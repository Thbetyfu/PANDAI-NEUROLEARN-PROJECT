# 🛡️ PANDAI NEURO-CLIENT: KITAB SUCI PENGEMBANG (Catatan DEV) v25.2

## 📅 MANDAT STRATEGIS (03/04/2026 - MEI 2026)
> **FOKUS UTAMA: STABILITAS SOFTWARE & UI DASHBOARD**
> 
> Seluruh pengembang DILARANG KERAS menyentuh konfigurasi hardware, driver kamera, atau penambahan sensor fisik baru hingga Mei 2026. Fokus kita saat ini adalah memastikan:
> 1. Logika pemrosesan biometrik di software berjalan tanpa bug.
> 2. Antarmuka Dashboard (UI) stabil, premium, dan tidak menyebabkan crash.
> 3. Integrasi data ke cloud (MQTT) berjalan mulus.
> 
> **JANGAN mengubah alur VisionEngine v25.0 untuk eksperimen hardware baru sampai masa mandat ini berakhir.**

---

## 🏛️ KASUS 1: HARDWARE RESILIENCE (Vision Engine)
### 🔍 Masalah: "Kamera Macet (Ghosting) / Access Denied / Black Frame"
Aplikasi mengalami kemacetan total setelah beberapa detik hardware kamera menyala. Muncul pesan `🚨 Data Stream Timeout`.

### 🕵️ Akar Masalah:
*   **Race Condition**: Beberapa thread mencoba mengakses `.read()` kamera secara bersamaan.
*   **Protocol Conflict**: Memaksa penggunaan `CAP_DSHOW` atau `MJPG` pada webcam laptop modern memicu driver Windows memutus aliran data untuk keamanan.
*   **Inclusive Mode**: Windows memblokir Python jika Chrome atau aplikasi lain sedang "mengintip" kamera.

### ✅ Solusi (The Mule Protocol):
*   **Single Source of Truth**: Hanya satu thread tunggal (`_capture_thread`) yang diizinkan memanggil fungsi `.read()`.
*   **Default OS Priority**: Jalur pendeteksian diubah menjadi `None` (Default OS) terlebih dahulu agar Windows menentukan jalur terbaik secara otomatis.
*   **Heartbeat Tolerance**: Waktu tunggu kegagalan ditingkatkan hingga **30 detik (150 frame)** untuk memberikan napas bagi driver melakukan kalibrasi cahaya otomatis.

---

## 🧠 KASUS 2: AI AWAKENING (Night Vision AI)
### 🔍 Masalah: "AI Tidak Mendeteksi Wajah di Ruangan Redup"
Landmark wajah menghilang saat cahaya kurang, menyebabkan `EAR` (kedipan mata) tertahan di angka 0.5 (Macet).

### ✅ Solusi:
*   **Histogram Equalization**: Implementasi normalisasi cahaya di dalam loop AI. Gambar "diterangi" secara digital di otak AI sebelum diproses oleh MediaPipe, tanpa merusak tampilan asli di layar.

---

## 💥 KASUS 3: UI STABILITY (rgba vs hex)
### 🔍 Masalah: "UI Crash Saat Menekan Tombol Berhenti"
Muncul `_tkinter.TclError: unknown color name "rgba(...)"`.

### 🕵️ Akar Masalah:
*   Library `CustomTkinter` tidak mendukung format CSS `rgba()` pada properti `fg_color`. Penulisan ini menyebabkan "crash" fatal pada *mainloop* UI.

### ✅ Solusi:
*   **Hex-Only Policy**: Semua format warna wajib menggunakan kode Hex (contoh: `#0F172A`). Transparansi dikelola secara visual melalui kedalaman warna Hex, bukan Alpha channel.

---

## 🚩 ZONA MERAH (DILARANG KERAS DISENTUH!)
Bagian kode ini telah divalidasi melalui 25 iterasi debugging. **JANGAN MERUBAH TANPA IZIN USER:**
1.  **`sensors/vision_engine.py`**: Seluruh alur `_init_camera`, `_capture_thread`, dan `_process_loop`. Mengubahnya satu baris saja akan memicu *Race Condition* hardware.
2.  **`pages/beranda.py`**: Logika `show_session_confirmation` dan `fg_color` overlay. State management di sini sangat sensitif terhadap perubahan.

## ✅ ZONA AMAN (BOLEH DIKEMBANGKAN)
1.  **Analisis Data**: Penambahan logika perhitungan emosi atau gaze tracking di luar dasar yang sudah ada.
2.  **Visual Dashboard**: Penambahan widget navigasi selama warna menggunakan format Hex.
3.  **MQTT Logic**: Penambahan topik baru untuk telemetry atau data biometrik eksternal (GSR/HR).

---

## ⚠️ PERINGATAN RISIKO & HAL YANG HARUS DIPERHATIKAN
1.  **Windows Privacy Settings**: Jika kamera tidak menyala saat Integritas dicek, periksa: *Settings > Privacy > Camera > Allow desktop apps to access your camera (Wajib ON).*
2.  **Zombie Processes**: Gunakan `taskkill /F /IM python.exe /T` sebelum menjalankan `main.py` agar tidak ada "mayat hidup" Python yang masih memegang kunci hardware kamera.
3.  **CPU Starvation**: AI berjalan di thread terpisah. Jika komputer melambat, jangan kurangi delay, tapi gunakan `ResourceMonitor` untuk melakukan *adaptive sleep*.

---
**PANDAI Neuro-Client v25.2 - Diterbitkan dengan Integritas Perangkat Keras yang Tinggi.** 🕊️🛡️🏹🚀
