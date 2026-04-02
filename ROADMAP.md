# 🧠 PANDAI NEUROLEARN 2.0 - MASTER ROADMAP
**Versi:** 2.2 | **Status:** High-Intelligence Mode 🚀

Format ini dirancang khusus untuk memberikan transparansi penuh atas progres, kualitas kode (QA), dan metode pengujian ekosistem PANDAI, dengan fokus mendalam pada direktori `SISWA`.

---

## 📂 STRUKTUR DIREKTORI FOKUS: `SISWA/`
Ekosistem siswa dibagi menjadi dua pilar utama yang bekerja secara simbiotik:
1.  **`Neuro-Client-Siswa/` (Python/Desktop):** Bertindak sebagai "Edge Server" lokal untuk akuisisi data biometrik, Computer Vision (EAR), kontrol tDCS, dan integrasi Local LLM (Ollama).
2.  **`Pandai-LMS-Siswa/` (Next.js/Web):** Bertindak sebagai antarmuka pembelajaran neuro-adaptif (Smart Environment) yang merespons data dari Neuro-Client secara *real-time*.

---

## 📅 PHASE 1: Real-Time & Cloud Core (🟢 FINISHED)
*Fokus: Membangun jalur data (*pipeline*) latensi rendah antara perangkat keras siswa (Python) dan antarmuka belajar (Web).*

### 🛠️ Yang Telah Dikerjakan (Folder `SISWA/`)
* **`Neuro-Client-Siswa/network/mqtt_client.py`:** Pembuatan *publisher* MQTT yang mengirim data metrik (Focus, Stress, EAR) ke broker awan (EMQX) via WebSocket Secure (WSS).
* **`Pandai-LMS-Siswa/src/hooks/useNeuroMqtt.js`:** Pembuatan *custom hook* React untuk *subscribe* ke topik MQTT dan mendistribusikan data sensor secara asinkron ke seluruh komponen LMS.
* **`Siswa/test/start_siswa.bat`:** Pembuatan skrip otomatisasi yang membersihkan *port*, menjalankan server lokal (Next.js), dan membuka Neuro-Client secara bersamaan.
* **Fix Race Condition:** Perbaikan status `isMounted` pada Next.js untuk mencegah *hydration error* saat merender grafik *real-time*.

### 🎯 KPI (Key Performance Indicator)
* **Latency**: Pengiriman data biometrik dari `main.py` ke `HomeScreen.jsx` < 150ms.
* **Stability**: Tidak ada "Client Disconnecting" saat siswa berpindah dari modul bacaan ke kuis.

---

## 📈 PHASE 2: Intelligence & Persistence (🟢 FINISHED)
*Fokus: Mengamankan rekam jejak biometrik siswa secara luring dan pemrosesan AI tingkat lanjut (Edge AI).*

### 🛠️ Yang Telah Dikerjakan (Folder `SISWA/`)
* **`Neuro-Client-Siswa/core/database_manager.py`:** Implementasi *Local Memory* menggunakan SQLite untuk menyimpan log intervensi fisik (tDCS) dan metrik fokus harian dengan sistem *buffer* 5 detik untuk efisiensi I/O.
* **`Neuro-Client-Siswa/sensors/vision_engine.py`:** Pembuatan algoritma klasifikasi *Eye Aspect Ratio* (EAR) dan emosi (Lightweight Emotion Engine) berbasis MediaPipe tanpa *lag*.
* **`Neuro-Client-Siswa/network/serial_client.py`:** Abstraksi komunikasi Serial untuk ESP32 (GSR/HRV), lengkap dengan mode "Mock/Simulasi" jika perangkat keras sedang dilepas.
* **Data Cleanup:** Fitur pembersihan otomatis (Auto-Cleanup) untuk data log yang lebih lama dari 30 hari guna menjaga *storage* laptop siswa.

### 🎯 KPI
* **Data Integrity**: 100% data riwayat intervensi tersimpan permanen di `local_memory.db` meskipun koneksi internet terputus.

---

## 🏗️ PHASE 3: Visual Mastery & Security (🟢 FINISHED)
*Fokus: Visualisasi *dashboard* kognitif di LMS dan keamanan protokol riset.*

### 🛠️ Yang Telah Dikerjakan (Folder `SISWA/`)
* **`Pandai-LMS-Siswa/src/components/_shared/Charts/`:** Berhasil mengintegrasikan Recharts untuk membuat `BiometricChart.jsx` (grafik EAR *real-time*) dan `HistoricalTrendChart.jsx` (grafik fokus 7 hari).
* **Identity Lock (Anti-Cheat):** Sistem pembanding wajah di awal sesi belajar pada aplikasi Python untuk memastikan subjek riset tidak digantikan oleh orang lain.
* **`Neuro-Client-Siswa/ai/report_generator.py`:** Skrip yang secara otomatis merangkum data biometrik SQLite menjadi laporan PDF berstandar medis (Local PDF Report) setelah sesi belajar selesai.
* **History Courier System:** Menggunakan `useHistoryMqtt.js` di Next.js untuk meminta riwayat 7 hari terakhir dari `Neuro-Client`, dan memvisualisasikannya di menu Profil LMS.

### 🎯 KPI
* **Visual Accuracy**: Fluktuasi garis di grafik web LMS mencerminkan kondisi mata/keringat siswa di dunia nyata dalam waktu < 200ms.
* **Identity Security**: Aplikasi Python mengunci akses stimulasi jika wajah di kamera tidak cocok dengan database awal.

---

## 🎮 PHASE 4: Gamification & Engagement (🟡 UPCOMING / IN PROGRESS)
*Fokus: Membuat intervensi neurofisiologis terasa menyenangkan (Gamifikasi) agar siswa tidak merasa sedang "diawasi" alat medis.*

### 🛠️ Yang Harus Dikerjakan (Fokus Selanjutnya di Folder `SISWA/`)
* **Dynamic Avatar (`Pandai-LMS-Siswa/src/components/_shared/Panda/PandaAvatar.jsx`):** Mengganti logo statis dengan karakter Panda (*SVG Asset*) yang ekspresinya berubah secara otomatis merespons variabel `emotion` dari MQTT (misal: Panda sedih jika status = 'Confused').
* **Focus Streak Engine (`Pandai-LMS-Siswa/src/hooks/useFocusStreak.js`):** Membuat logika yang menghitung durasi berkelanjutan siswa di "Zona Flow" (EAR stabil, Stress rendah) dan mengubahnya menjadi poin/streak harian di web.
* **Deep AI Tips (`Neuro-Client-Siswa/ai/ollama_client.py`):** Meningkatkan *prompt* Ollama (Local LLM) agar tidak hanya memberi motivasi generik, tetapi menganalisis tabel SQLite untuk memberikan tips belajar berdasarkan pola kelelahan siswa.

### 🎯 KPI
* **Retention**: Menu 'Statistik' dan 'Profil' di LMS menjadi area yang paling sering diklik siswa setiap hari.
* **Visual Engagement**: Perpindahan ekspresi karakter Avatar (SVG) berjalan di *frontend* tanpa mengganggu FPS dari grafik biometrik (*Render Optimization*).

### 🛡️ QA (Code Quality)
* **Asset Optimization**: File di `Pandai-LMS-Siswa/public/images/` dioptimasi ukurannya (SVG murni) agar `PandaAvatar` termuat seketika.
* **State Management**: Menggunakan React Context/Zustand di Next.js untuk mengelola "Global Emotion State" agar avatar di *Header* dan *CourseScreen* tersinkronisasi.

---

## 🏁 Report Progres (Current Status)
- [x] Cloud IoT Path (MQTT via EMQX) - **DONE**
- [x] Auto-Startup System (`start_siswa.bat`) - **DONE**
- [x] Lightweight Edge Vision (`vision_engine.py`) - **DONE**
- [x] Database Persistence (`local_memory.db`) - **DONE**
- [x] LMS Real-time Charts (`Recharts`) - **DONE**
- [x] History Courier & PDF Generation - **DONE**
- [ ] Gamification & Dynamic Avatar - **NEXT FOCUS**