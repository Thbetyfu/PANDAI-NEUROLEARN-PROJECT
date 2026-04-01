# 🧠 PANDAI NEUROLEARN 2.0 - MASTER ROADMAP
**Versi:** 2.1 | **Status:** High-Intelligence Mode 🚀

Format ini dirancang khusus untuk memberikan transparansi penuh atas progres, kualitas kode (QA), dan metode pengujian.

---

## 📅 PHASE 1: Real-Time & Cloud Core (Current Status: 🟢 FINISHED)
*Fokus: Membangun jalur data yang stabil antara alat (Python) dan Dashboard (Web).*

### 🛠️ Yang Telah Dikerjakan
- Integrasi MQTT Cloud (EMQX) via WebSocket Secure (WSS).
- Sinkronisasi metrik `Focus Index`, `Cognitive Load`, dan `EAR` secara real-time.
- Pembuatan sistem `start_siswa.bat` (Auto-Cleanup & Auto-Browser).
- Perbaikan Race Condition pada Next.js (isMounted guards).

### 🎯 KPI (Key Performance Indicator)
- **Latency**: Pengiriman data dari Python ke Web < 150ms.
- **Stability**: Tidak ada "Client Disconnecting" saat navigasi antar halaman.
- **Accuracy**: Data di Dashboard Profil 100% sama dengan logs di terminal Neuro-Client.

### 🛡️ QA (Code Quality)
- **Modularity**: Logic MQTT dipisah ke dalam hooks (`useNeuroMqtt.js`).
- **Resilience**: Penambahan `try-catch` pada parser JSON MQTT.
- **Fail-safe**: AI Fallback tetap memberikan motivasi meskipun Ollama offline.

### 🤖 Test Otomatis & Manual
- **Automated**: Pemeriksaan port 3000 (Next.js) dan konektivitas broker EMQX via terminal.
- **Manual Test Plan**:
    1. Tutup mata selama 1 detik -> Cek apakah LMS memunculkan alert "Mata Mengantuk".
    2. Matikan internet -> Cek apakah status berubah menjadi "OFFLINE" dan tidak crash.
    3. Klik `start_siswa.bat` -> Pastikan 2 terminal & 1 browser terbuka otomatis.

---

## 📈 PHASE 2: Intelligence & Persistence (🟢 FINISHED)
*Fokus: Menyimpan data riwayat (Trend) dan analisis Citra Anak (Hardware-In-The-Loop).*

### 🛠️ Yang Telah Dikerjakan
- **Database Integration**: Implementasi SQLite (Python) dengan sistem buffer 5 detik untuk efisiensi I/O.
- **Memory Management**: Fitur Auto-Cleanup data > 30 hari untuk menjaga performa penyimpanan lokal.
- **Lightweight Emotion Engine**: Klasifikasi emosi (Happy, Sad, Confused) berbasis Euclidean Landmark MediaPipe.
- **Gaze Tracking System**: Koordinat pupil (x,y) dikirim via MQTT untuk visualisasi heatmap di Dashboard.
- **Hardware Abstraction**: Layer SerialClient yang mendukung mode simulasi (Mock) dan real (ESP32).

### 🎯 KPI
- **Data Integrity**: 100% data intervensi tersimpan permanen di `local_memory.db`.
- **Latency**: Proses emosi tidak menambah lag pada jalur biometrik utama (Throttling on).

---

## 🏗️ PHASE 3: Visual Mastery & Security (🟢 FINISHED)
*Fokus: Visualisasi data mendalam pada LMS dan penguatan keamanan identitas.*

### 🛠️ Yang Telah Dikerjakan
- **LMS Real-time Charts**: Berhasil mengganti chart statis dengan grafik garis dinamis (Recharts) untuk EAR dan Attention Index.
- **Face Verification (Anti-Cheat)**: Implementasi pembanding wajah siswa (Identity Lock) untuk memastikan subjek penelitian yang benar.
- **Pre-Learning Calibration**: Sistem kalibrasi EAR & GSR otomatis pada setiap awal sesi belajar (Manual Reset Baselines).
- **Intervention History UI**: Menampilkan daftar log intervensi saraf (tDCS/Light) yang premium di ProfileScreen LMS.
- **AI Study Report UI**: Integrasi 'Wawasan PANDAI AI' yang memberikan saran kognitif real-time berdasarkan data sensor.
- **History Courier System**: Arsitektur MQTT Request-Response untuk menarik data biometrik 7 hari terakhir dari Python ke Web.
- **Local PDF Report**: Generator laporan sesi belajar profesional (`report_generator.py`) untuk bukti progres medis.

### 🎯 KPI
- **Visual Accuracy**: Grafik di dashboard mencerminkan fluktuasi biometrik secara instan (< 200ms delay).
- **Identity Security**: Fitur Anti-Cheat aktif dan berhasil mengunci sistem jika wajah tidak terverifikasi.

### 🛡️ QA (Code Quality)
- **Component Reusability**: Pembuatan `BiometricChart.jsx` dan `HistoricalTrendChart.jsx` yang universal dan performan.
- **Cloud-Ready Architecture**: Pemisahan jalur data real-time dan data historis via MQTT Request-Response.
- **Local Persistence**: Sinkronisasi data antara log database lokal dan tampilan dashboard tanpa data loss.

---

## 🎮 PHASE 4: Gamification & Engagement (Upcoming)
*Fokus: Membuat siswa ketagihan belajar secara sehat.*

### 🛠️ Yang Harus Dikerjakan
- **Fokus Streak**: Sistem reward berdasarkan durasi Zona Flow.
- **Dynamic Avatar**: Karakter panda yang ekspresinya berubah (Senang jika Fokus, Bingung jika Stress).
- **Deep AI Tips**: Gemma AI memberikan tips spesifik berdasarkan riwayat stres di database.

### 🎯 KPI
- **Retention**: Siswa membuka menu statistik minimal 1x setiap sesi belajar.
- **Visual Engagement**: Animasi avatar berjalan mulus tanpa lag di browser mobile.

### 🛡️ QA (Code Quality)
- **Asset Optimization**: Semua asset gambar menggunakan format SVG/WebP agar ringan.
- **State Management**: Penggunaan React Context/Zustand untuk mengelola state Global Panda.

### 🤖 Test Otomatis & Manual
- **Manual Test Plan**:
    1. Paksa kondisi "DROWSY" via simulator -> Cek apakah ekspresi avatar berubah sedih/ngantuk.
    2. Belajar selama 15 menit -> Cek apakah poin streak bertambah.

---

## 🏁 Report Progres (Current Status)
- [x] Cloud IoT Path (MQTT) - **DONE**
- [x] Real-time Dashboard - **DONE**
- [x] Auto-Startup Sysem - **DONE**
- [x] Database Persistence - **DONE**
- [x] Real Data Trend Chart - **DONE**
- [x] Face Verification (Anti-Cheat) - **DONE**
- [x] Local PDF Report - **DONE**
- [ ] Gamification & Avatar - **NEXT**
