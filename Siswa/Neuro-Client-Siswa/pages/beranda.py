"""
=================================================================
PANDAI Neuro-Client — Halaman Beranda (Dashboard Utama)
=================================================================

CATATAN PENTING UNTUK PENGEMBANG:
---------------------------------
Halaman ini adalah pintu utama siswa memulai sesi belajar.

FITUR UTAMA:
1. **Stopwatch Sesi Belajar**: 
   Bukan timer countdown biasa. Ini adalah STOPWATCH yang menghitung 
   NAIK dari 00:00 untuk merekam berapa lama siswa belajar dalam satu sesi.
   Data durasi ini nantinya akan dikirim ke server melalui MQTT untuk 
   analisis kognitif oleh PANDAI AI.

2. **Tombol Mulai/Berhenti Sesi**:
   - Saat ditekan "Mulai Sesi": Stopwatch mulai berjalan, tombol berubah 
     menjadi "Berhenti", dan Floating HUD + Kamera Laptop muncul.
   - Saat ditekan "Berhenti": Stopwatch berhenti, HUD & Kamera hilang, 
     tombol kembali ke "Mulai Sesi".
   
3. **Floating HUD Overlay** (components/overlay_hud.py):
   Panel melayang di atas layar saat sesi aktif, menampilkan Flow Score, 
   status tDCS, dan insight AI real-time. Ini memungkinkan siswa melihat 
   status belajar mereka meskipun aplikasi utama diminimalkan.

4. **Kamera PiP (Picture-in-Picture)**:
   Widget kamera laptop yang muncul di pojok kanan bawah saat sesi aktif.
   Fungsinya untuk memantau ekspresi wajah dan gerakan mata siswa guna 
   mendeteksi kantuk atau distraksi (menggunakan Computer Vision).

ARSITEKTUR INTEGRASI:
   BerandaPage → (start_session) → FloatingHUD + CameraWidget
                → (stop_session)  → Destroy HUD + Camera
   
   Stopwatch data → MQTT → Server → PANDAI AI Analysis

TODO UNTUK PENGEMBANG SELANJUTNYA:
- [ ] Kirim data durasi sesi ke server via MQTT saat sesi berakhir
- [ ] Integrasikan Flow Score real-time dari Decision Engine ke HUD
- [ ] Tambahkan notifikasi audio saat sesi melewati 25 menit (Pomodoro)
- [ ] Simpan riwayat sesi belajar ke database lokal (SQLite)
- [ ] Implementasi analisis wajah dari feed kamera (OpenCV + MediaPipe)
=================================================================
"""

import customtkinter as ctk
import tkinter as tk
import random
import os
from components.logo import PandaiEmotLogo, load_svg_as_pil
from ai.report_generator import ReportGenerator

class BerandaPage(ctk.CTkFrame):
    def __init__(self, master, **kwargs):
        super().__init__(master, corner_radius=0, fg_color="transparent", **kwargs)
        
        # --- CSS CONSTANTS ---
        self.CONTENT_WIDTH = 1122
        self.TEXT_DARK_BLUE = "#001D5A"
        self.CORNER_RADIUS = 24

        # ============================================================
        # STOPWATCH STATE
        # ============================================================
        # elapsed_seconds: Total detik yang telah berlalu sejak sesi dimulai
        # session_active: Boolean flag apakah sesi sedang berjalan
        # _stopwatch_job: ID dari after() callback untuk dibatalkan saat stop
        # hud_ref / cam_ref: Referensi ke overlay window agar bisa di-destroy
        # ============================================================
        self.elapsed_seconds = 0
        self.session_active = False
        self._stopwatch_job = None
        self.hud_ref = None
        self.cam_ref = None
        
        # New: PDF Generator
        self.report_gen = ReportGenerator()

        # 1. MAIN SCROLLABLE AREA
        self.scroll_frame = ctk.CTkScrollableFrame(
            self, 
            fg_color="transparent", 
            corner_radius=0
        )
        self.scroll_frame.place(relx=0, rely=0, relwidth=1, relheight=1)

        # Content Inner Wrapper (Liquid Layout)
        self.inner = ctk.CTkFrame(self.scroll_frame, fg_color="transparent")
        self.inner.pack(fill="x", pady=(80, 100), padx=(40, 56))

        # --- SECTION 1: HEADER (Hi, Mozart + Logo) ---
        self.setup_header()

        # --- SECTION 2: STATISTIK ROW ---
        self.setup_stats_row()

        # --- SECTION 3: BOTTOM GRID ---
        self.setup_bottom_grid()

    def setup_header(self):
        header_container = ctk.CTkFrame(self.inner, fg_color="transparent")
        header_container.pack(fill="x", pady=(0, 32), anchor="w")

        greet_row = ctk.CTkFrame(header_container, fg_color="transparent")
        greet_row.pack(anchor="w")

        self.hi_label = ctk.CTkLabel(
            greet_row, 
            text="Hi, Mozart", 
            font=ctk.CTkFont(family="Clash Grotesk", size=64, weight="bold"),
            text_color=self.TEXT_DARK_BLUE,
            height=79
        )
        self.hi_label.pack(side="left")

        self.emot_logo = PandaiEmotLogo(greet_row, size=65)
        self.emot_logo.pack(side="left", padx=(10, 0))

        ctk.CTkLabel(
            header_container, 
            text="Sudah siap untuk petualangan hari ini?", 
            font=ctk.CTkFont(family="Inter", size=22, weight="bold"),
            text_color="#0041C9"
        ).pack(anchor="w", pady=(12, 0))

    def setup_stats_row(self):
        row = ctk.CTkFrame(self.inner, fg_color="transparent")
        row.pack(fill="x", pady=(0, 32))
        
        assets_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "assets")
        
        stats_config = [
            ("Total Waktu Belajar Mingguan", "42.5h", "+12%", "Icon_Jam_Total Waktu Belajar Mingguan.svg", "#0066FF"),
            ("Rata-Rata Skor Fokus", "88%", "+5.2%", "Icon_musik_Rata Rata Skor Fokus.svg", "#8A2BE2"),
            ("Tingkat Retensi", "76%", "+2.1%", "Icon_Data_Tingkat Retensi.svg", "#0066FF"),
            ("Beban Kognitif", "Medium", "-3.4%", "Icon_Chart_Beban Kognitif.svg", "#5F1DE2")
        ]

        for title, val, growth, icon_file, accent in stats_config:
            self.create_stat_card(row, title, val, growth, icon_file, accent, assets_dir)

    def create_stat_card(self, parent, title, val, growth, icon_file, accent_color, assets_dir):
        card = ctk.CTkFrame(
            parent, 
            height=150, 
            fg_color="#FFFFFF", 
            corner_radius=self.CORNER_RADIUS, 
            border_width=1, 
            border_color="#E2E8F0"
        )
        card.pack(side="left", padx=(0, 16), expand=True, fill="both")
        card.pack_propagate(False)

        head = ctk.CTkFrame(card, fg_color="transparent")
        head.pack(fill="x", padx=24, pady=(24, 0))
        
        ctk.CTkLabel(
            head, text=title, 
            font=ctk.CTkFont(family="Clash Grotesk", size=14, weight="bold"), 
            text_color="#64748B",
            wraplength=180,
            justify="left",
            anchor="w"
        ).pack(side="left", fill="x", expand=True)

        icon_path = os.path.join(assets_dir, icon_file)
        if os.path.exists(icon_path):
            with open(icon_path, "r") as f:
                svg_data = f.read()
            import re
            svg_data = re.sub(r'fill="[^"]*"', f'fill="{accent_color}"', svg_data)
            svg_data = re.sub(r'stroke="[^"]*"', f'stroke="{accent_color}"', svg_data)
            
            img = load_svg_as_pil(None, width=24, height=28, svg_data=svg_data)
            ctk_img = ctk.CTkImage(light_image=img, dark_image=img, size=(24, 28))
            ctk.CTkLabel(head, image=ctk_img, text="").pack(side="right")

        ctk.CTkLabel(
            card, text=val, 
            font=ctk.CTkFont(family="Space Grotesk", size=30, weight="bold"), 
            text_color="#0F172A",
            anchor="w"
        ).pack(fill="x", padx=24, pady=(10, 0))
        
        g_color = "#00C853" if "+" in growth else "#F59E0B"
        ctk.CTkLabel(
            card, text=growth, 
            font=ctk.CTkFont(family="Space Grotesk", size=14, weight="bold"), 
            text_color=g_color,
            anchor="w"
        ).pack(fill="x", padx=24, pady=(5, 0))

    def setup_bottom_grid(self):
        top_header = ctk.CTkFrame(self.inner, fg_color="transparent")
        top_header.pack(fill="x", pady=(0, 24))
        
        ctk.CTkLabel(
            top_header, text="Mulai Belajar", 
            font=ctk.CTkFont(family="Plus Jakarta Sans", size=24, weight="bold"), 
            text_color="#0F172A"
        ).pack(side="left")

        status_badge = ctk.CTkFrame(top_header, fg_color="#E8F9F1", corner_radius=9999, border_width=1, border_color="#D1F2E1")
        status_badge.pack(side="right")
        ctk.CTkLabel(
            status_badge, text="SISTEM SIAP", 
            text_color="#10B981", 
            font=ctk.CTkFont(family="Inter", size=12, weight="bold"),
            padx=16, pady=6
        ).pack()

        grid = ctk.CTkFrame(self.inner, fg_color="transparent")
        grid.pack(fill="both", expand=True)
        grid.grid_columnconfigure(0, weight=4)
        grid.grid_columnconfigure(1, weight=6)
        
        # LEFT COLUMN (Stopwatch Section)
        left_col = ctk.CTkFrame(grid, fg_color="transparent")
        left_col.grid(row=0, column=0, sticky="nsew", padx=(0, 24))

        learn_card = ctk.CTkFrame(
            left_col, fg_color="#FFFFFF", corner_radius=self.CORNER_RADIUS, 
            border_width=1, border_color="#E2E8F0", height=596
        )
        learn_card.pack(fill="both", expand=True)
        learn_card.pack_propagate(False)

        # ============================================================
        # STOPWATCH UI
        # ============================================================
        # Ini adalah STOPWATCH (penghitung waktu naik), BUKAN timer countdown.
        # Fungsi: Merekam berapa lama siswa belajar dalam satu sesi.
        # Format tampilan: MM:SS (menit : detik)
        # 
        # Canvas digunakan untuk menggambar:
        # 1. Outer Ring (track abu-abu #F1F5F9)
        # 2. Active Progress Ring (ungu #4F46E5) yang berputar seiring waktu
        # 3. Teks waktu di tengah (MM:SS)
        # 4. Label "STOPWATCH" di bawah waktu
        #
        # Ring progress dihitung berdasarkan detik dalam satu menit:
        #   extent = -(elapsed_seconds % 60) * 6 derajat (360deg / 60 detik)
        # ============================================================
        timer_container = ctk.CTkFrame(learn_card, fg_color="transparent", width=240, height=240)
        timer_container.pack(pady=(80, 40))
        
        self.timer_canvas = tk.Canvas(timer_container, width=240, height=240, bg="#FFFFFF", highlightthickness=0)
        self.timer_canvas.pack()
        
        # Gambar ring awal (00:00)
        self._draw_stopwatch_ring(0)

        # ============================================================
        # TOMBOL MULAI / BERHENTI SESI
        # ============================================================
        # Tombol ini bersifat toggle:
        # - State "idle": Tampil "Mulai Sesi" (ungu)
        #   -> Klik: Mulai stopwatch, tampilkan HUD + Kamera
        # - State "active": Tampil "Berhenti" (merah)
        #   -> Klik: Stop stopwatch, sembunyikan HUD + Kamera
        #
        # Integrasi dengan Overlay:
        # - FloatingHUD: Panel melayang di atas layar (flow score, tDCS, insight)
        # - CameraWidget: Webcam PiP di pojok kanan bawah (deteksi kantuk)
        # ============================================================
        self.session_btn = ctk.CTkButton(
            learn_card, text="\u25b6  Mulai Sesi", fg_color="#4F46E5", hover_color="#3730A3",
            corner_radius=16, height=60, width=240, 
            font=ctk.CTkFont(family="Plus Jakarta Sans", size=18, weight="bold"),
            command=self.toggle_session
        )
        self.session_btn.pack(pady=(0, 20))
        
        ctk.CTkLabel(
            learn_card, text="Target: Fokus / Deep Work", 
            font=ctk.CTkFont(family="Plus Jakarta Sans", size=14), 
            text_color="#64748B"
        ).pack()

        # RIGHT COLUMN (Health Section)
        right_col = ctk.CTkFrame(grid, fg_color="transparent")
        right_col.grid(row=0, column=1, sticky="nsew")

        health_card = ctk.CTkFrame(
            right_col, fg_color="#FFFFFF", corner_radius=self.CORNER_RADIUS, 
            border_width=1, border_color="#E2E8F0", height=596
        )
        health_card.pack(fill="both", expand=True)
        health_card.pack_propagate(False)

        top_row = ctk.CTkFrame(health_card, fg_color="transparent")
        top_row.pack(fill="x", padx=32, pady=(32, 24))
        
        title_cont = ctk.CTkFrame(top_row, fg_color="transparent")
        title_cont.pack(side="left")
        
        assets_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "assets")
        heart_icon_path = os.path.join(assets_dir, "Icon_Hati_Status Biologis Real-time.svg")
        if os.path.exists(heart_icon_path):
            heart_img = load_svg_as_pil(heart_icon_path, width=24, height=21)
            heart_ctk_img = ctk.CTkImage(light_image=heart_img, dark_image=heart_img, size=(24, 21))
            ctk.CTkLabel(title_cont, image=heart_ctk_img, text="").pack(side="left")
        else:
            ctk.CTkLabel(title_cont, text="\u2764\ufe0f", font=ctk.CTkFont(size=22)).pack(side="left")

        ctk.CTkLabel(
            title_cont, text="Status Biologis Real-time", 
            font=ctk.CTkFont(family="Plus Jakarta Sans", size=24, weight="bold"), 
            text_color="#0F172A"
        ).pack(side="left", padx=(12, 0))
        
        badge = ctk.CTkFrame(top_row, fg_color="#EEF2FF", corner_radius=9999, border_width=1, border_color="#E0E7FF")
        badge.pack(side="right")
        ctk.CTkLabel(badge, text="\u2728", text_color="#4F46E5", font=ctk.CTkFont(size=14)).pack(side="left", padx=(10, 4), pady=4)
        ctk.CTkLabel(badge, text="AI MONITORING AKTIF", text_color="#4F46E5", font=ctk.CTkFont(family="Inter", size=12, weight="bold")).pack(side="left", padx=(0, 10), pady=4)

        ai_box = ctk.CTkFrame(health_card, fg_color="#F3F6FF", corner_radius=16, border_width=1, border_color="#E0E7FF", height=125)
        ai_box.pack(fill="x", padx=32, pady=(0, 24))
        ai_box.pack_propagate(False)

        icon_circle = ctk.CTkFrame(ai_box, width=48, height=48, corner_radius=24, fg_color="#FFFFFF")
        icon_circle.place(x=20, y=38)
        ctk.CTkLabel(icon_circle, text="\U0001f9d8", font=ctk.CTkFont(size=20)).place(relx=0.5, rely=0.5, anchor="center")

        ctk.CTkLabel(
            ai_box, text="Rekomendasi Istirahat AI", 
            font=ctk.CTkFont(family="Plus Jakarta Sans", size=14, weight="bold"), 
            text_color="#312E81"
        ).place(x=84, y=24)
        
        ctk.CTkLabel(
            ai_box, text="Detak jantung Anda meningkat (92 BPM), luangkan waktu 5 menit untuk bernapas dalam agar fokus kembali optimal.", 
            font=ctk.CTkFont(family="Plus Jakarta Sans", size=11), 
            text_color="#4338CA", 
            wraplength=300, justify="left"
        ).place(x=84, y=48)

        ctk.CTkButton(
            ai_box, text="3s Mulai Istirahat", fg_color="#4F46E5", hover_color="#3730A3",
            corner_radius=12, width=138, height=36, font=ctk.CTkFont(size=12, weight="bold")
        ).place(x=400, y=45)

        vitals_row = ctk.CTkFrame(health_card, fg_color="transparent")
        vitals_row.pack(fill="x", padx=32, pady=(0, 24))

        hr_card = ctk.CTkFrame(vitals_row, fg_color="#FFF1F2", corner_radius=16, border_width=1, border_color="#FECDD3", height=147)
        hr_card.pack(side="left", fill="both", expand=True, padx=(0, 12))
        ctk.CTkLabel(hr_card, text="\U0001f4c8 HEART RATE", font=ctk.CTkFont(size=10, weight="bold"), text_color="#E11D48").pack(anchor="w", padx=16, pady=(16, 0))
        
        hr_val_row = ctk.CTkFrame(hr_card, fg_color="transparent")
        hr_val_row.pack(anchor="w", padx=16)
        ctk.CTkLabel(hr_val_row, text="92", font=ctk.CTkFont(family="Plus Jakarta Sans", size=28, weight="bold"), text_color="#0F172A").pack(side="left")
        ctk.CTkLabel(hr_val_row, text="BPM", font=ctk.CTkFont(family="Plus Jakarta Sans", size=12), text_color="#64748B").pack(side="left", padx=4, pady=(8,0))
        
        hr_canvas = tk.Canvas(hr_card, height=40, bg="#FFF1F2", highlightthickness=0)
        hr_canvas.pack(fill="x", padx=16, pady=(10, 16))
        bars = [16, 24, 20, 40, 24]
        colors = ["#FECDD3", "#FDA4AF", "#FB7185", "#F43F5E", "#FB7185"]
        for i, h in enumerate(bars):
            hr_canvas.create_rectangle(i*22, 40-h, i*22+12, 40, fill=colors[i], outline="", width=0)

        stress_card = ctk.CTkFrame(vitals_row, fg_color="#FFFBEB", corner_radius=16, border_width=1, border_color="#FEF3C7", height=147)
        stress_card.pack(side="left", fill="both", expand=True, padx=(0, 12))
        ctk.CTkLabel(stress_card, text="\U0001f331 STRESS LEVEL", font=ctk.CTkFont(size=10, weight="bold"), text_color="#D97706").pack(anchor="w", padx=16, pady=(16, 0))
        ctk.CTkLabel(stress_card, text="Tinggi", font=ctk.CTkFont(family="Plus Jakarta Sans", size=28, weight="bold"), text_color="#0F172A").pack(anchor="w", padx=16)
        
        stress_pb_bg = ctk.CTkFrame(stress_card, height=8, fg_color="#E2E8F0", corner_radius=4)
        stress_pb_bg.pack(fill="x", padx=16, pady=(12, 4))
        stress_pb_fill = ctk.CTkFrame(stress_pb_bg, width=80, height=8, fg_color="#F59E0B", corner_radius=4)
        stress_pb_fill.place(x=0, y=0)
        ctk.CTkLabel(stress_card, text="BUTUH RELAKSASI", font=ctk.CTkFont(size=10, weight="bold"), text_color="#D97706").pack(anchor="w", padx=16)

        ox_card = ctk.CTkFrame(vitals_row, fg_color="#F0F9FF", corner_radius=16, border_width=1, border_color="#E0F2FE", height=147)
        ox_card.pack(side="left", fill="both", expand=True)
        ctk.CTkLabel(ox_card, text="\U0001f4a7 OKSIGEN", font=ctk.CTkFont(size=10, weight="bold"), text_color="#0284C7").pack(anchor="w", padx=16, pady=(16, 0))
        
        ox_val_row = ctk.CTkFrame(ox_card, fg_color="transparent")
        ox_val_row.pack(anchor="w", padx=16)
        ctk.CTkLabel(ox_val_row, text="98", font=ctk.CTkFont(family="Plus Jakarta Sans", size=28, weight="bold"), text_color="#0F172A").pack(side="left")
        ctk.CTkLabel(ox_val_row, text="%", font=ctk.CTkFont(family="Plus Jakarta Sans", size=12), text_color="#64748B").pack(side="left", padx=4, pady=(8,0))
        
        ox_canvas = tk.Canvas(ox_card, height=32, bg="#F0F9FF", highlightthickness=0)
        ox_canvas.pack(fill="x", padx=16, pady=(10, 16))
        fill_colors = ["#BAE6FD", "#7DD3FC", "#38BDF8", "#0EA5E9", "#0284C7"]
        for i in range(5):
             ox_canvas.create_rectangle(i*24, 8, i*24+8, 32, fill=fill_colors[i], outline="", width=0)

        focus_history = ctk.CTkFrame(
            health_card, fg_color="#F8FAFC", corner_radius=16, 
            border_width=1, border_color="#CBD5E1" 
        )
        focus_history.pack(fill="x", padx=32, pady=(0, 32))
        
        fh_header = ctk.CTkFrame(focus_history, fg_color="transparent")
        fh_header.pack(fill="x", padx=24, pady=(24, 16))
        
        fh_text_cont = ctk.CTkFrame(fh_header, fg_color="transparent")
        fh_text_cont.pack(side="left")
        ctk.CTkLabel(
            fh_text_cont, text="Analisis Kualitas Fokus", 
            font=ctk.CTkFont(family="Plus Jakarta Sans", size=14, weight="bold"), 
            text_color="#0F172A"
        ).pack(anchor="w")
        ctk.CTkLabel(
            fh_text_cont, text="Berdasarkan data gelombang otak 30 menit terakhir", 
            font=ctk.CTkFont(family="Plus Jakarta Sans", size=11), 
            text_color="#64748B"
        ).pack(anchor="w")

        live_badge = ctk.CTkFrame(fh_header, fg_color="transparent")
        live_badge.pack(side="right")
        ctk.CTkFrame(live_badge, width=8, height=8, corner_radius=4, fg_color="#4F46E5").pack(side="left", padx=4)
        ctk.CTkLabel(live_badge, text="LIVE DATA", font=ctk.CTkFont(size=10, weight="bold"), text_color="#4F46E5").pack(side="left")

        spark_canvas = tk.Canvas(focus_history, height=40, bg="#F8FAFC", highlightthickness=0)
        spark_canvas.pack(fill="x", padx=24, pady=(0, 24))
        for i in range(30):
            h = random.randint(10, 35)
            spark_canvas.create_rectangle(i*14, 40-h, i*14+4, 40, fill="#4F46E5", outline="", width=0)

        upcoming_section = ctk.CTkFrame(self.inner, fg_color="transparent")
        upcoming_section.pack(fill="x", pady=(32, 40))

        ctk.CTkLabel(
            upcoming_section, text="Tugas dalam tenggat", 
            font=ctk.CTkFont(family="Inter", size=22, weight="bold"), 
            text_color="#0F172A"
        ).pack(anchor="w", pady=(0, 16))

        task_container = ctk.CTkFrame(upcoming_section, fg_color="transparent")
        task_container.pack(fill="x")

        for i in range(2):
            task_card = ctk.CTkFrame(
                task_container, height=80, fg_color="#FFFFFF", border_width=1, 
                border_color="#E2E8F0", corner_radius=20
            )
            task_card.pack(fill="x", pady=4)
            task_card.pack_propagate(False)

            left_side = ctk.CTkFrame(task_card, fg_color="#E2EBFF", width=6, corner_radius=0)
            left_side.pack(side="left", fill="y")

            content = ctk.CTkFrame(task_card, fg_color="transparent")
            content.pack(side="left", padx=24, fill="y")
            
            ctk.CTkLabel(
                content, text="Tugas Bahasa Inggris: Past Tense" if i == 0 else "Ujian Matematika: Kalkulus", 
                font=ctk.CTkFont(family="Inter", size=16, weight="bold"), text_color="#1D115A" 
            ).pack(anchor="w", pady=(18, 0))
            
            deadline = ctk.CTkFrame(task_card, fg_color="transparent", border_width=1, border_color="#E2E8F0", corner_radius=36)
            deadline.pack(side="right", padx=24)
            ctk.CTkLabel(
                deadline, text="22 November 2025" if i == 0 else "Besok, 08:00 WIB", 
                font=ctk.CTkFont(family="Inter", size=11, weight="bold"), 
                text_color="#64748B", padx=12, pady=4
            ).pack()

    # ================================================================
    # STOPWATCH ENGINE
    # ================================================================
    # Berikut adalah sistem inti stopwatch yang mengontrol:
    # 1. Penghitungan waktu (detik per detik)
    # 2. Update visual canvas (ring progress + teks)
    # 3. Sinkronisasi dengan overlay HUD dan kamera
    # ================================================================

    def _draw_stopwatch_ring(self, seconds: int):
        """
        Menggambar ulang ring stopwatch pada canvas.
        
        Parameter:
            seconds: Total detik yang telah berlalu
            
        Visual Components:
            - Outer Ring (track abu-abu): Selalu terlihat
            - Active Ring (ungu): Berputar 6 derajat setiap detik (360/60s)
            - MM:SS text: Format menit:detik di tengah ring
            - "STOPWATCH" label: Indikator bahwa ini stopwatch, bukan countdown
        """
        self.timer_canvas.delete("all")
        
        # Outer Ring (track)
        self.timer_canvas.create_oval(10, 10, 230, 230, outline="#F1F5F9", width=14)
        
        # Active Progress Ring
        # Berputar penuh setiap 60 detik (1 putaran = 1 menit)
        progress_angle = -(seconds % 60) * 6  # 6 derajat per detik
        if progress_angle != 0:
            self.timer_canvas.create_arc(
                10, 10, 230, 230, 
                start=90, extent=progress_angle, 
                outline="#4F46E5", width=14, style="arc"
            )
        
        # Format waktu: MM:SS
        mins = seconds // 60
        secs = seconds % 60
        time_str = f"{mins:02d}:{secs:02d}"
        
        # Teks waktu di tengah
        self.timer_canvas.create_text(
            120, 110, text=time_str, 
            font=("Plus Jakarta Sans", 48, "bold"), fill="#0F172A"
        )
        # Label "STOPWATCH" agar pengembang dan user tahu ini bukan countdown
        self.timer_canvas.create_text(
            120, 150, text="STOPWATCH", 
            font=("Plus Jakarta Sans", 12, "bold"), fill="#94A3B8"
        )

    def toggle_session(self):
        """
        Toggle antara Mulai Sesi dan Berhenti.
        
        Flow:
        1. Jika IDLE -> START:
           - Reset stopwatch ke 00:00
           - Mulai penghitungan waktu
           - Ubah tombol menjadi "Berhenti" (merah)
           - Spawn FloatingHUD + CameraWidget
        
        2. Jika ACTIVE -> STOP:
           - Hentikan stopwatch
           - Catat total durasi sesi (untuk dikirim ke server nanti)
           - Ubah tombol kembali ke "Mulai Sesi" (ungu)
           - Destroy HUD + Camera
        """
        if not self.session_active:
            self.start_session()
        else:
            self.stop_session()

    def start_session(self):
        """
        Memulai sesi belajar baru.
        
        Aksi:
        1. Reset stopwatch ke 0
        2. Set state ke active
        3. Ubah tampilan tombol
        4. Mulai tick stopwatch (setiap 1 detik)
        5. Spawn overlay (HUD di atas layar + Kamera di pojok kanan bawah)
        
        CATATAN: Overlay di-spawn dengan delay 500ms agar tidak bentrok 
        dengan animasi UI tombol.
        """
        # [NEW] Kalibrasi & Kunci Identitas saat mulai belajar
        if hasattr(self, 'engine') and self.engine:
            self.engine.reset_baselines()

        self.elapsed_seconds = 0
        self.session_active = True
        
        # Update tombol: Berubah menjadi merah "Berhenti"
        self.session_btn.configure(
            text="\u23f9  Berhenti", 
            fg_color="#DC2626",  # Merah untuk menandakan aksi destruktif
            hover_color="#B91C1C"
        )
        
        # Mulai tick stopwatch
        self._tick_stopwatch()
        
        # Spawn overlay setelah delay singkat untuk stabilitas
        self.after(500, self._spawn_overlay)
        
        print("Sesi belajar dimulai!")

    def stop_session(self):
        """
        Menghentikan sesi belajar yang sedang berjalan.
        
        Aksi:
        1. Hentikan stopwatch tick
        2. Catat durasi total (self.elapsed_seconds)
        3. Kembalikan tombol ke mode "Mulai Sesi"
        4. Destroy overlay HUD dan Kamera
        
        TODO: Kirim self.elapsed_seconds ke server melalui MQTT
        Format: {"session_duration_seconds": self.elapsed_seconds, "student_id": "..."}
        """
        self.session_active = False
        
        # Hentikan after() callback
        if self._stopwatch_job is not None:
            self.after_cancel(self._stopwatch_job)
            self._stopwatch_job = None
        
        # [NEW] Generate PDF Report
        duration_str = f"{self.elapsed_seconds // 60:02d}:{self.elapsed_seconds % 60:02d}"
        
        # Ambil data riil dari engine jika ada
        avg_focus = 0
        dominant_emotion = "NORMAL"
        if hasattr(self, 'engine') and self.engine:
            # Contoh hitung kasar dari buffer terakhir (atau ambil dari DB nanti)
            avg_focus = 85 # Placeholder, idealnya query DB
            dominant_emotion = getattr(self.engine, 'current_state', "FLOW")

        report_data = {
            "duration": duration_str,
            "avg_focus": avg_focus,
            "max_load": 40,
            "dominant_emotion": dominant_emotion,
            "security_status": "VERIFIED" if (not hasattr(self.engine.vision_engine, 'identity_verified') or self.engine.vision_engine.identity_verified) else "ALERT",
            "ai_insight": "Sesi belajar yang sangat produktif. Anda mempertahankan level fokus tinggi selama 78% dari total durasi."
        }
        self.report_gen.generate_session_report("Mozart", report_data)

        # Catat durasi sesi untuk logging/kirim ke server
        duration_mins = self.elapsed_seconds // 60
        duration_secs = self.elapsed_seconds % 60
        print(f"Sesi belajar selesai! Durasi: {duration_mins}m {duration_secs}s ({self.elapsed_seconds} detik)")
        
        # Kembalikan tombol ke state awal
        self.session_btn.configure(
            text="\u25b6  Mulai Sesi", 
            fg_color="#4F46E5",  # Ungu kembali
            hover_color="#3730A3"
        )
        
        # Destroy overlay windows
        self._destroy_overlay()

    def _tick_stopwatch(self):
        """
        Callback yang dipanggil setiap 1 detik untuk mengupdate stopwatch.
        
        Flow setiap tick:
        1. Tambah elapsed_seconds += 1
        2. Gambar ulang ring canvas dengan waktu baru
        3. Schedule tick berikutnya (after 1000ms)
        
        Tick akan terus berjalan selama self.session_active == True.
        """
        if not self.session_active:
            return
        
        self.elapsed_seconds += 1
        self._draw_stopwatch_ring(self.elapsed_seconds)
        
        # Schedule tick berikutnya (1 detik = 1000ms)
        self._stopwatch_job = self.after(1000, self._tick_stopwatch)

    # ================================================================
    # OVERLAY MANAGEMENT (HUD + KAMERA)
    # ================================================================
    # Bagian ini mengontrol kapan overlay muncul dan hilang.
    # Overlay terdiri dari:
    # 1. FloatingHUD: Panel status di atas layar (Flow Score, tDCS, Insight)
    # 2. CameraWidget: Kamera laptop PiP di pojok kanan bawah
    #
    # Overlay hanya muncul saat sesi belajar AKTIF.
    # Saat sesi berakhir, overlay di-destroy dan resource (kamera) dilepas.
    # ================================================================

    def _spawn_overlay(self):
        """
        Membuat dan menampilkan Floating HUD + Camera Widget.
        
        Dipanggil saat sesi belajar dimulai.
        Safety: Menggunakan try/except agar app tidak crash jika 
        overlay gagal dibuat (misalnya karena driver kamera error).
        """
        from components.overlay_hud import FloatingHUD, CameraWidget
        
        # Spawn Floating HUD (panel status di atas layar)
        try:
            self.hud_ref = FloatingHUD(self.winfo_toplevel())
            print("  -> Floating HUD aktif")
        except Exception as e:
            print(f"  -> HUD gagal: {e}")
            self.hud_ref = None
        
        # Spawn Camera Widget (kamera laptop di pojok kanan bawah)
        # Fungsi kamera: Memantau ekspresi wajah siswa untuk deteksi kantuk
        # dan distraksi menggunakan Computer Vision (pengembangan selanjutnya)
        try:
            self.cam_ref = CameraWidget(self.winfo_toplevel())
            print("  -> Kamera monitoring aktif")
        except Exception as e:
            print(f"  -> Kamera gagal: {e}")
            self.cam_ref = None

    def _destroy_overlay(self):
        """
        Menutup dan membersihkan overlay HUD + Camera Widget.
        
        Dipanggil saat sesi belajar berakhir.
        Penting: Camera Widget harus di-destroy dengan benar agar 
        resource kamera (cv2.VideoCapture) dilepas dan tidak bocor.
        """
        if self.hud_ref is not None:
            try:
                self.hud_ref.destroy()
                print("  -> Floating HUD ditutup")
            except Exception:
                pass
            self.hud_ref = None
        
        if self.cam_ref is not None:
            try:
                self.cam_ref.destroy()
                print("  -> Kamera monitoring ditutup")
            except Exception:
                pass
            self.cam_ref = None
