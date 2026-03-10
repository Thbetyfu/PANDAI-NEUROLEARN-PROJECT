# Spesifikasi Teknis: PANDAI Dashboard (Web-based)

## 1. Ringkasan Proyek
PANDAI Dashboard adalah platform monitoring terpadu yang menghubungkan Guru, Wakil Kepala Sekolah (Waka), dan Orang Tua dalam satu ekosistem data kognitif. Dashboard ini berfungsi untuk memvisualisasikan data biometrik siswa secara real-time yang dikirimkan dari Edge Server (Raspberry Pi).

## 2. Tech Stack (Versi 2026)
- **Framework:** Next.js 16 (Pages Router).
- **Library UI:** React 19.
- **Styling:** Tailwind CSS v4.
- **Visualisasi Data:** Recharts (untuk grafik biometrik dan heatmap atensi).
- **Komponen UI:** Radix UI (untuk aksesibilitas) & Lucide React (ikon).
- **State Management:** React Context / Zustand.

## 3. Struktur Folder & Navigasi
Dashboard menggunakan Role-Based Access Control (RBAC) dengan struktur folder sebagai berikut:
- `/pages/index.js` -> Halaman Landing & Login.
- `/pages/guru/` -> Fitur: Daftar Siswa, Monitoring Live Kelas, Evaluasi Kognitif.
- `/pages/waka/` -> Fitur: Statistik Performa Guru, Metrik Efisiensi Kurikulum Nasional/Sekolah.
- `/pages/orang-tua/` -> Fitur: Dashboard Profil Anak, Riwayat Sesi 5-Hari, Notifikasi Intervensi.

## 4. Komponen Visual Utama (Charts)
- **Attention Heatmap:** Menampilkan distribusi fokus mata siswa (EAR) sepanjang sesi belajar.
- **Stress-Relax Balance:** Grafik Line Chart yang menggabungkan GSR dan HRV untuk memantau Flow State.
- **Intervention Log:** Tabel transparan yang mencatat kapan tDCS atau Sengatan Mikro diaktifkan.

## 5. Integrasi Data (Backend Bridge)
- **API Connection:** Dashboard mengambil data dari database lokal di Raspberry Pi (PostgreSQL/SQLite).
- **Real-time Updates:** Menggunakan WebSockets untuk menampilkan perubahan detak jantung atau tingkat kantuk siswa secara instan tanpa refresh halaman.

## 6. Standar Desain (UI/UX)
- **Dashboard Orang Tua:** Harus mobile-friendly (Responsive Design).
- **Keamanan:** Data biometrik harus ditampilkan secara anonim jika diakses oleh Waka (statistik makro).
- **Aksesibilitas:** Kontras warna tinggi sesuai standar WCAG karena akan digunakan di lingkungan sekolah.