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

## 📈 PHASE 2: Intelligence & Persistence (In Progress 🏗️)
*Fokus: Menyimpan data riwayat (Trend) dan analisis Citra Anak (Hardware-In-The-Loop).*

### 🛠️ Yang Harus Dikerjakan
- **Database Integration**: Implementasi SQLite (Python) untuk menyimpan log biometrik mentah & olahan.
- **Hardware Sensor Persistence**: Menyimpan data **Impedansi Kulit** dan **GSR Raw Data** untuk audit medis.
- **Lightweight Emotion Engine**: Menambah fungsi `_detect_emotion()` di `VisionEngine` menggunakan hitungan matematika Euclidean Landmark (tanpa CNN/AI berat).
    - *Happy*: Kalkulasi jarak sudut bibir (MAR - Mouth Aspect Ratio).
    - *Angry/Confused*: Kalkulasi jarak antar alis (Landmarks 105 & 334).
    - *Sad*: Kalkulasi posisi sudut bibir relatif terhadap pusat bibir.
- **Gaze Tracking Offloading**: Deteksi koordinat x, y pupil di Python, lalu kirim via MQTT setiap 500ms untuk dirender sebagai heatmap di Web Dashboard.
- **FPS Optimization**: Deteksi emosi diset berjalan setiap 5 frame (throttling) untuk menghemat baterai laptop.
- **Trend Engine**: Membuat fungsi untuk menghitung rata-rata harian HRV, Fokus, dan Tingkat Stres.

### 🎯 KPI
- **CPU Overhead**: Peningkatan konsumsi CPU < 5% meskipun fitur emosi & gaze aktif.
- **Medical Audit Safety**: Data impedansi (ohm) tersimpan setiap 10 detik.
- **Emotion Accuracy**: Akurasi deteksi emosi dasar (Senang/Bingung/Ngantuk) > 85% via MediaPipe Landmark.

### 🛡️ QA (Code Quality)
- **Math-Only Logic**: Dilarang menggunakan model Deep Learning berat; wajib menggunakan perbandingan jarak Euclidean Landmark.
- **Throttling Logic**: Memastikan proses citra anak tidak mengganggu jalur data bio-elektrik yang berjalan 100ms.

### 🤖 Test Otomatis & Manual
- **Manual Test Plan**:
    1. Berikan ekspresi "Senyum" -> Cek status emosi di Dashboard berubah jadi "Happy".
    2. Kerutkan dahi -> Cek status "Confused/Angry".
    3. Lakukan aktivitas yang memicu stres -> Cek kolom `stress_event` di database terisi otomatis via GSR Spike.
    4. Cek log impedansi -> Pastikan nilai Ohm terekam berkala.

---

## � PHASE 3: Gamification & Engagement (Upcoming)
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
- [x] Cloud IoT Path (MQTT) - **BERJALAN**
- [x] Real-time Dashboard - **BERJALAN**
- [x] Auto-Startup Sysem - **BERJALAN**
- [ ] Database Persistence - **TERTUNDA** (Menunggu instruksi Bapak)
- [ ] Real Data Trend Chart - **TERTUNDA**

---

### ❓ Bagaimana Pak Thoriq? 
Apakah format Roadmap dengan detail **KPI, QA, dan Manual Test** seperti ini sudah cukup jelas untuk dipahami? Jika sudah, apakah bisa kita langsung **Eksekusi Phase 2 (Database Integration)** sekarang?
