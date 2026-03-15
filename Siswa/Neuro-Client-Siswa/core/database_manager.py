import sqlite3
import os
from datetime import datetime

class DatabaseManager:
    """
    Manajemen Persistensi Data PANDAI (Persistence Layer).
    Menyimpan log kognitif dan riwayat intervensi ke dalam SQLite lokal.
    """
    def __init__(self, db_path="db/neuro_data.db"):
        self.db_path = db_path
        self._init_db()

    def _init_db(self):
        """Inisialisasi tabel jika belum ada."""
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Tabel 1: Session Logs (Data Biometrik & Kognitif)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS session_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT,
                timestamp DATETIME,
                focus_index REAL,
                gsr_value REAL,
                hrv_value REAL,
                emotion TEXT,
                state TEXT
            )
        ''')
        
        # Tabel 2: Intervention History (tDCS, Lampu, Audio)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS intervention_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT,
                timestamp DATETIME,
                type TEXT,
                action TEXT,
                value REAL
            )
        ''')
        
        conn.commit()
        conn.close()

    def save_log(self, session_id, focus, gsr, hrv, emotion, state):
        """Simpan detak data biometrik siswa."""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO session_logs (session_id, timestamp, focus_index, gsr_value, hrv_value, emotion, state)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (session_id, datetime.now().isoformat(), focus, gsr, hrv, emotion, state))
            conn.commit()
            conn.close()
        except Exception as e:
            print(f"[DB] Error saving log: {e}")

    def save_intervention(self, session_id, inter_type, action, value=0.0):
        """Catat setiap kali ada intervensi tDCS atau hardware lainnya."""
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO intervention_history (session_id, timestamp, type, action, value)
                VALUES (?, ?, ?, ?, ?)
            ''', (session_id, datetime.now().isoformat(), inter_type, action, value))
            conn.commit()
            conn.close()
        except Exception as e:
            print(f"[DB] Error saving intervention: {e}")
