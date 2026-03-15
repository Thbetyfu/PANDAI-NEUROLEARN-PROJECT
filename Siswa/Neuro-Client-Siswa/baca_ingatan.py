import sqlite3

def baca_ingatan():
    """Skrip Sanity Check untuk melihat 5 log biometrik terakhir."""
    db_path = "Siswa/Neuro-Client-Siswa/db/local_memory.db"
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        print("\n🧠 [PANDAI] Riwayat Ingatan Kognitif Terakhir:")
        print("-" * 80)
        
        # Ambil 5 data terakhir
        cursor.execute("SELECT timestamp, ear_score, attention_index, emotion_state FROM biometric_logs ORDER BY id DESC LIMIT 5")
        rows = cursor.fetchall()
        
        if not rows:
            print("Database masih kosong. Jalankan aplikasi selama minimal 5 detik!")
        else:
            print(f"{'Waktu':<20} | {'EAR':<6} | {'Attention':<10} | {'Emotion':<10}")
            print("-" * 80)
            for row in rows:
                print(f"{row[0]:<20} | {row[1]:<6} | {row[2]:<10} | {row[3]:<10}")
        
        print("-" * 80)
        
        # Cek Intervensi
        print("\n⚡ [PANDAI] Riwayat Intervensi Terakhir:")
        cursor.execute("SELECT timestamp, trigger_reason, action_taken FROM intervention_history ORDER BY id DESC LIMIT 3")
        interventions = cursor.fetchall()
        for i in interventions:
            print(f"[{i[0]}] {i[1]} -> {i[2]}")
            
        conn.close()
    except Exception as e:
        print(f"Gagal membaca database: {e}")

if __name__ == "__main__":
    baca_ingatan()
