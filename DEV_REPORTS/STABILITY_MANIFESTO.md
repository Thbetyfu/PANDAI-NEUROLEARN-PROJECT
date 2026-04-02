# 🛡️ PANDAI STABILITY MANIFESTO (V2.3)
### — Professor S3 Software Architecture —

## 🔍 Root Cause Analysis (Beda Diagnosa)

Selama fase transisi dari **Lokal MQTT** ke **Cloud-EMQX**, kami menemukan "Rantai Kesalahan Kritis" yang menyebabkan sistem stagnan meskipun kamera menyala. Berikut adalah temuan autopsi teknis:

### 1. 📂 Typonomality (Kesalahan Tipografi)
*   **Gejala**: Widget Kamera di Dashboard (HUD) menampilkan `⚠️ VisionEngine belum aktif`.
*   **Akar Masalah**: Pada `beranda.py`, fungsi spawn HUD mencari atribut `decision_engine.vision_engine`. Namun, di inisialisasi kelas, variabel tersebut disimpan sebagai `self.vision`.
*   **Dampak**: Resource kamera ada dan menyala (hardware), namun referensinya `None`, sehingga HUD buta.

### 2. ⚡ The Missing Heartbeat (Signal Logic)
*   **Gejala**: Layar Dashboard browser terkunci (Lock Screen) meskipun siswa di depan laptop.
*   **Akar Masalah**: PANDAI Shield di browser mencari flag `face_detected`, namun `DecisionEngine` hanya mengirimkan metrik EAR tanpa status deteksi eksplisit.
*   **Dampak**: Browser menganggap siswa "hilang" selamanya.

### 3. 📡 Topic Mismatch (MQTT Isolation)
*   **Gejala**: Tombol "Pilih Kamera" di Dashboard tidak bereaksi di Python Client.
*   **Akar Masalah**: MQTT Client di browser mengirim perintah ke `pandai/v1/control/camera`, namun Python Client (setelah migrasi ke Cloud) hanya mendengar di jalur terisolasi `pandai/v1/PANDAI_NC_01/control/camera`.
*   **Dampak**: Sinyal kontrol dikirim ke "antah berantah".

---

## 🛠️ Roadmap Perbaikan (The S3 Solution)

### ✅ Phase 1: Harmonization (DONE)
*   Sinkronisasi seluruh penamaan atribut dari `vision_engine` menjadi `vision` di seluruh `core` dan `pages`.
*   Menambahkan flag `face_detected` di `VisionEngine` dan menyiarkannya via MQTT di setiap siklus telemetri (10fps).

### ✅ Phase 2: MQTT Tunneling (DONE)
*   Standarisasi `ROOT_TOPIC` menggunakan `DEVICE_ID`. 
*   Seluruh callback MQTT di Python sekarang dilindungi oleh prefix dinamis agar tidak bentrok dengan user lain di broker publik.

### ✅ Phase 3: Hardware HUD Resilience (DONE)
*   Memperbaiki `CameraWidget` di `overlay_hud.py` agar mendapatkan referensi sensor yang benar.
*   Implementasi `try-except` berlapis pada inisialisasi video agar aplikasi utama tidak crash jika driver kamera sibuk.

---

## 🚦 QA Verification Checklist (Audit S3)

- [x] **Connectivity**: `broker.emqx.io:1883` (Python) & `wss://broker.emqx.io:8084/mqtt` (LMS).
- [x] **Anti-Hallucination**: Kode diuji terhadap mismatch atribut (verified via view_file).
- [x] **Identity Lock**: Flag `face_detected` terintegrasi di `GlobalIntervention.js`.
- [x] **Resource Cleanup**: Reset baseline biometrik menggunakan `MovingAverage.clear()`.

---

## 📖 Pesan Untuk Pengembang Masa Depan (Legacy Note)
> *"Kekuatan sebuah sistem Neuro-Kognitif bukan hanya pada algoritmanya, tapi pada integritas jabat tangan antar-modulnya. Jangan pernah asumsikan variabel 'ada' sebelum memeriksanya dengan `getattr` atau `hasattr`."*

**Ditandatangani,**
*Antigravity Professor S3 Software Architect*
