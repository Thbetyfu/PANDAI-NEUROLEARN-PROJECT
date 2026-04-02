import sqlite3
import os
from datetime import datetime, timedelta

class DatabaseManager:
    """
    Manajemen Persistensi Data PANDAI (Memori Lokal).
    Menyimpan log kognitif dan riwayat intervensi ke dalam SQLite lokal.
    """
    def __init__(self, db_path="db/local_memory.db"):
        """Inisialisasi koneksi ke SQLite."""
        self.db_path = db_path
        # Pastikan folder db ada
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        self._init_tables()

    def _init_tables(self):
        """Membuat tabel jika belum ada."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()

        # Tabel Log Biometrik (Disimpan per interval 5 detik)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS biometric_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                ear_score REAL,
                attention_index REAL,
                cognitive_load REAL,
                emotion_state TEXT
            )
        ''')

        # Tabel Log Intervensi & AI
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS intervention_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                trigger_reason TEXT,
                action_taken TEXT
            )
        ''')

        conn.commit()
        conn.close()
        print(f"[DATABASE] ✅ Memori Lokal Siap ({self.db_path})")

    def insert_biometric_log(self, ear, attention, load, emotion="NORMAL"):
        """Menyimpan data ringkasan ke database."""
        try:
            conn = sqlite3.connect(self.db_path, timeout=5.0)
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO biometric_logs (ear_score, attention_index, cognitive_load, emotion_state)
                VALUES (?, ?, ?, ?)
            ''', (ear, attention, load, emotion))
            conn.commit()
            conn.close()
        except sqlite3.OperationalError as e:
            print(f"[DATABASE] ⚠️ Memori sementara terkunci (Locked) oleh thread lain: {e}")
        except Exception as e:
            print(f"[DATABASE] ⚠️ Gagal menyimpan log: {e}")

    def log_intervention(self, reason, action):
        """Mencatat kapan sistem memberikan intervensi."""
        try:
            conn = sqlite3.connect(self.db_path, timeout=5.0)
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO intervention_history (trigger_reason, action_taken)
                VALUES (?, ?)
            ''', (reason, action))
            conn.commit()
            conn.close()
            print(f"[DATABASE] ⚡ Intervensi Dicatat: {reason} -> {action}")
        except sqlite3.OperationalError as e:
            print(f"[DATABASE] ⚠️ Gagal menyimpan intervensi karena Database Locked: {e}")
        except Exception as e:
            print(f"[DATABASE] ⚠️ Gagal menyimpan intervensi secara general: {e}")

    def clean_old_data(self, days=30):
        """Menghapus data yang lebih tua dari X hari untuk menghemat memori."""
        try:
            cutoff_date = (datetime.now() - timedelta(days=days)).strftime('%Y-%m-%d %H:%M:%S')
            conn = sqlite3.connect(self.db_path, timeout=5.0)
            cursor = conn.cursor()
            cursor.execute('DELETE FROM biometric_logs WHERE timestamp < ?', (cutoff_date,))
            deleted = cursor.rowcount
            conn.commit()
            conn.close()
            if deleted > 0:
                print(f"[DATABASE] 🧹 Membersihkan {deleted} baris data lama.")
        except sqlite3.OperationalError as e:
            print(f"[DATABASE] ⚠️ Cleanup dibatalkan sementara karena Database Locked: {e}")
        except Exception as e:
            print(f"[DATABASE] ⚠️ Cleanup error tak terduga: {e}")
            pass

    def get_history_data(self, days=7):
        """Mengambil rata-rata harian (fokus & stres) selama X hari terakhir."""
        try:
            conn = sqlite3.connect(self.db_path, timeout=5.0)
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            
            # Query untuk mengelompokkan rata-rata per hari
            query = """
                SELECT 
                    date(timestamp) as date,
                    AVG(attention_index) as avg_focus,
                    AVG(cognitive_load) as avg_load
                FROM biometric_logs 
                WHERE timestamp > datetime('now', ?)
                GROUP BY date(timestamp)
                ORDER BY date ASC
            """
            cursor.execute(query, (f'-{days} days',))
            rows = cursor.fetchall()
            conn.close()
            
            return [dict(row) for row in rows]
        except sqlite3.OperationalError as e:
            print(f"[DATABASE] ⚠️ Gagal mengambil query History karena Database Locked: {e}")
            return []
        except Exception as e:
            print(f"[DATABASE] ⚠️ Tabel korup atau error tak terduga: {e}")
            return []

    def get_recent_summary(self, limit=10):
        """Mengambil ringkasan teks dari N data terakhir untuk input AI context."""
        try:
            conn = sqlite3.connect(self.db_path, timeout=2.0)
            cursor = conn.cursor()
            cursor.execute('''
                SELECT attention_index, cognitive_load, emotion_state 
                FROM biometric_logs 
                ORDER BY timestamp DESC LIMIT ?
            ''', (limit,))
            rows = cursor.fetchall()
            conn.close()
            
            if not rows: return "Data stabil"
            
            # Format: 'Avg Focus: 85%, Emotion: HAPPY'
            avg_att = sum(r[0] for r in rows) / len(rows)
            avg_load = sum(r[1] for r in rows) / len(rows)
            emotions = [r[2] for r in rows]
            dom_emotion = max(set(emotions), key=emotions.count)
            
            return f"Fokus Rata-rata: {int(avg_att*100)}%, Beban Kognitif: {int(avg_load)}%, Emosi Dominan: {dom_emotion}"
        except Exception:
            return "Pola belajar sedang dianalisis"
