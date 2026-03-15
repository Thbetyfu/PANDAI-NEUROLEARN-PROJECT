# Siswa/Neuro-Client-Siswa/core/exceptions.py

class PandaiCriticalError(Exception):
    """Base class untuk semua error fatal di PANDAI NEUROLEARN."""
    def __init__(self, code, message):
        self.code = code
        self.message = message
        super().__init__(f"[{code}] {message}")

class VisionCriticalError(PandaiCriticalError):
    """E01: Error pada sistem penglihatan (Kamera/MediaPipe)."""
    pass

class HardwareCriticalError(PandaiCriticalError):
    """E02: Error pada perangkat fisik (ESP32/Sensor GSR)."""
    pass

class CloudCriticalError(PandaiCriticalError):
    """E03: Error pada sinkronisasi Cloud (MQTT)."""
    pass
