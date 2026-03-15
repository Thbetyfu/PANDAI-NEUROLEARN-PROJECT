# Siswa/Neuro-Client-Siswa/core/integrity_manager.py
from .exceptions import VisionCriticalError, HardwareCriticalError, CloudCriticalError
import config
import time

class IntegrityManager:
    """
    Sistem Pengawasan Integritas Hardware (Medical Grade Safety Loop).
    Bertugas melakukan diagnostik mandiri pada Vision, Serial, dan MQTT.
    """
    def __init__(self, vision, serial, mqtt):
        self.vision = vision
        self.serial = serial
        self.mqtt = mqtt

    def perform_full_audit(self):
        """Mengecek semua fitur. Jika rusak satu, aplikasi mati."""
        print("[GUARD] 🛡️ Menjalankan Pemeriksaan Integritas Sistem (Full Audit)...")
        
        # 1. Cek Vision (Kamera)
        # Gunakan fungsi is_camera_active() yang baru ditambahkan
        if self.vision is None or not self.vision.is_camera_active():
            raise VisionCriticalError("E01", "Sistem Kamera tidak merespon atau tidak aktif.")

        # 2. Cek Hardware (Serial/ESP32)
        if not config.SIMULATION_MODE:
            if not self.serial or not self.serial.connected:
                raise HardwareCriticalError("E02", "Alat PANDAI tidak terdeteksi di Port USB.")
        else:
            print("[GUARD] ⚠️ Menjalankan sistem dengan Hardware Simulasi.")
            if not self.serial or not self.serial.connected:
                 raise HardwareCriticalError("E02", "Mock Hardware ESP32 gagal inisialisasi.")

        # 3. Cek Cloud (MQTT)
        # Gunakan is_connected() yang baru ditambahkan
        if not self.mqtt or not self.mqtt.is_connected():
            # Beri kesempatan rekoneksi singkat
            time.sleep(1)
            if not self.mqtt.is_connected():
                raise CloudCriticalError("E03", "Gagal terhubung ke Cloud EMQX. Jalur Saraf terputus.")

        print("[GUARD] ✅ Integritas Terverifikasi. Sistem Siap.")
        return True

    def check_health(self):
        """Metode alias untuk perform_full_audit agar kompatibel dengan loop DecisionEngine."""
        return self.perform_full_audit()
