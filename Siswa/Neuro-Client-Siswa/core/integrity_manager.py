# Siswa/Neuro-Client-Siswa/core/integrity_manager.py
import time
from .exceptions import VisionCriticalError, HardwareCriticalError, CloudCriticalError
import config

class IntegrityManager:
    """
    Sistem Pengawasan Integritas Hardware (Medical Grade Safety Loop).
    Memastikan seluruh modul kritis sehat sebelum dan selama sesi belajar.
    """
    @staticmethod
    def perform_boot_check(vision, serial, mqtt):
        """
        Diagnosa awal seluruh komponen sistem.
        [MODIFIKASI: FOKUS VISION-ONLY UNTUK PENGEMBANGAN]
        """
        # print("[GUARD] 🛡️ Menjalankan Pemeriksaan Integritas Sistem...")
        
        # 1. Cek Vision (Kamera) — WAJIB AKTIF (Dengan Retry 5x)
        vision_ok = False
        for i in range(5):
            if vision and vision.is_camera_active():
                vision_ok = True
                break
            print(f"[GUARD] ⚠️ Menghubungkan Sensor Vision... Membangunkan kamera ({i+1}/5)...")
            time.sleep(2.0)
            
        if not vision_ok:
            raise VisionCriticalError("E01", "Kamera gagal dibangunkan (Hardware Timeout). Pastikan tidak digunakan aplikasi lain.")

        # 3. Cek Cloud (MQTT) — SEKARANG OPTIONAL (Graceful Degradation)
        # Broker publik seperti EMQX membutuhkan waktu handshake yang bervariasi.
        # [V6.1] Jika gagal terhubung, biarkan sistem berjalan dalam "Mode Offline"
        cloud_ok = False
        for i in range(3):
            if mqtt and mqtt.is_connected():
                cloud_ok = True
                break
            print(f"[GUARD] ⚠️ Koneksi Cloud (MQTT) belum siap, mencoba ulang ({i+1}/3)...")
            time.sleep(2.0)
            
        if not cloud_ok:
            print("[GUARD] 🌐 CLOUD OFFLINE: Gagal terhubung ke broker EMQX.")
            print("[GUARD] 🛡️ Melanjutkan dalam MODE OFFLINE. Data akan disimpan secara lokal.")
            # TIDAK LAGI melempar CloudCriticalError agar user tidak frustrasi.

        print("[GUARD] ✅ Integritas Terverifikasi. Sistem Siap.")
        return True

    @staticmethod
    def check_health(vision, serial, mqtt):
        """Audit runtime cerdas (Non-blocking & Toleran)."""
        # [V22.2] Gunakan last_update_tick dari vision daripada is_camera_active instan
        if vision:
            import time
            idle_duration = time.time() - vision.last_update_tick
            
            # Jika idle > 15 detik, baru kita nyatakan kritis (E01)
            # Ini memberikan ruang bagi OS saat window di-minimize
            if idle_duration > 15.0 and not getattr(vision, 'is_recovering', False):
                 raise VisionCriticalError("E01", f"Sinyal kamera hilang selama {int(idle_duration)} detik.")
        return True
