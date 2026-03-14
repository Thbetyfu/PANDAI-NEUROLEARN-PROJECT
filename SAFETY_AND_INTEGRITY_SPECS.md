# 🛡️ PANDAI: Medical-Grade Safety & Integrity Protocol (v2.0)

Dokumentasi ini merangkum sistem keamanan berlapis (Multi-Layered Safety) yang diimplementasikan pada infrastruktur PANDAI untuk menjamin validitas data neuro-sains dan keselamatan pengguna (Siswa).

## 1. Arsitektur "Dosa Besar" (Standardized Exceptions)
Kami mendefinisikan kegagalan hardware bukan sebagai bug biasa, melainkan sebagai **Pangkal Kegagalan Integritas**.
- **`VisionCriticalError`**: Kegagalan pada Optical Eye-Tracking System (Kamera).
- **`SerialCriticalError`**: Hilangnya koneksi fisik ke modul biometrik (ESP32).
- **`MQTTConnectionCriticalError`**: Putusnya jalur komunikasi data Cloud (Jalur Saraf).

## 2. Integrity Shield (Startup Diagnostic)
Setiap aplikasi PANDAI (Neuro-Client, Dashboard) melakukan diagnosa mandiri (Self-Check) sebelum UI diaktifkan.
- **Dependency Injection Control**: UI utama tidak akan di-render kecuali `SecurityToken` bernilai `True` (Hardware Lulus Verifikasi).
- **Panic Overlay**: Jika verifikasi gagal, sistem memunculkan layar peringatan yang memblokir instruksi, mencegah "Hole in Data" (data hilang di awal sesi).

## 3. Runtime Suicide Logic (Anti-Cheat & Safety)
Mekanisme proteksi real-time untuk mencegah manipulasi data di tengah sesi belajar.
- **5-Second Rule**: Jika sensor vision (EAR) kehilangan sinyal mata selama > 5 detik, sistem mengasumsikan sensor ditutup atau anak meninggalkan kursi.
- **Emergency Kill-Switch**: Secara otomatis mematikan intervensi tDCS (transcranial Direct Current Stimulation) seketika untuk mencegah stimulasi tanpa pengawasan biometrik yang valid.

## 4. Multi-Platform Sync
Keamanan tidak hanya ada di satu sisi:
- **Python Client**: Mengontrol hardware dan mengirimkan status integritas.
- **LMS (Web)**: Berfungsi sebagai *Remote Barrier* yang mengunci layar Dashboard jika sinyal dari Python Client terputus.
- **Teacher Dashboard**: Memberikan peringatan integritas untuk memastikan guru tidak melihat data "Halusinasi" saat sistem sedang offline.

---
**PANDAI Safety Lab - 2026**
*Inovasi Karsa Cipta: Integrasi Neuro-Teknologi untuk Pendidikan Indonesia.*
