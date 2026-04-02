# Siswa/Neuro-Client-Siswa/core/integrity_manager.py
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
        print("[GUARD] 🛡️ Menjalankan Pemeriksaan Integritas Sistem...")
        
        # 1. Cek Vision (Kamera) — WAJIB AKTIF
        if vision is None or not vision.is_camera_active():
            raise VisionCriticalError("E01", "Kamera tidak terdeteksi atau sistem vision tidak aktif.")

        # 2. Cek Hardware (Serial/ESP32) — [NON-AKTIF / COMMENTED FOR NOW]
        """
        CATATAN PENGEMBANG (HARDWARE ALIGNMENT):
        Bagian ini dinonaktifkan sementara karena fokus pada Fitur Vision (Kamera).
        Jika Hardware (Headset biometrik & Lampu) sudah tersedia:
        1. Uncomment baris di bawah ini.
        2. Pastikan port COM sesuai di config.py atau deteksi otomatis ditambahkan.
        3. Pastikan ESP32 mengirimkan data JSON yang valid ('gsr', 'hrv', 'hr').
        """
        # if not config.SIMULATION_MODE:
        #     if not serial or not serial.connected:
        #         raise HardwareCriticalError("E02", "Alat PANDAI (ESP32) tidak terdeteksi di Port USB.")
        # else:
        #     if not serial or not serial.connected:
        #         raise HardwareCriticalError("E02", "Virtual Hardware ESP32 gagal inisialisasi.")

        # 3. Cek Cloud (MQTT) — WAJIB AKTIF (Untuk kirim sinyal ke Dashboard)
        if not mqtt or not mqtt.is_connected():
            raise CloudCriticalError("E03", "Gagal terhubung ke Cloud (MQTT). Jalur data terputus.")

        print("[GUARD] ✅ Integritas Terverifikasi (Vision-Only Mode). Sistem Siap.")
        return True

    @staticmethod
    def check_health(vision, serial, mqtt):
        """Alias untuk pemantauan runtime berkala."""
        return IntegrityManager.perform_boot_check(vision, serial, mqtt)
