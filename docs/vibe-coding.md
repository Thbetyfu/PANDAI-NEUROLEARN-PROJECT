# PANDAI NEUROLEARN - Advanced Vibe Coding Protocol

## 1. Safety & Ethical Constraints (Hard Rules)
- **Zero-Risk tDCS**: Setiap fungsi yang mengatur `current_intensity` wajib memiliki pengecekan `if (current > 2.0) throw Error`. AI dilarang keras menyarankan kode yang mengabaikan limitasi arus 1mA-2mA.
- **Fail-Safe Mechanism**: Semua loop kontrol perangkat keras harus menyertakan `watchdog_timer`. Jika koneksi MQTT terputus, hardware harus otomatis masuk ke `state: SAFE_MODE` (Arus 0mA).
- **Data Anonymization**: AI harus memproses data biometrik menjadi 'Score' (0-100) di level Python sebelum dikirim ke Dashboard. Dilarang menyimpan raw pixel atau raw EEG signal.

## 2. Python Architecture (Neuro-Client)
- **Type Hinting**: Wajib menggunakan `from typing import Final, Optional`. Contoh: `def apply_current(ma: float) -> bool:`.
- **Async Pattern**: Gunakan `asyncio` untuk mengelola stream data sensor agar tidak memblokir logic Amigdala Shield.
- **Dependency**: Gunakan `Paho-MQTT` v2.0, `OpenCV` untuk EAR, dan `Ollama-Python`.

## 3. Web Architecture (Dashboard & LMS)
- **State Management**: Gunakan `Zustand` untuk sinkronisasi data biometrik antar komponen UI.
- **Real-time Engine**: Gunakan `WebSockets` atau MQTT over WebSockets. Jangan pernah menyarankan `polling` untuk data biometrik.