import customtkinter as ctk
import tkinter as tk
from PIL import Image, ImageDraw
import math

# --- KONFIGURASI DESAIN PANDAI (FIGMA SPEC) ---
COLOR_BG = "#F8F8F8"
COLOR_WHITE = "#FFFFFF"
COLOR_TEXT_DARK = "#0F172A"
COLOR_TEXT_SUB = "#64748B"
COLOR_BRAND_BLUE = "#330DF2"
COLOR_BORDER = "#F1F5F9"

FONT_HEADING = "Plus Jakarta Sans"
FONT_INTER = "Inter"

class StatistikPage(ctk.CTkFrame):
    def __init__(self, master, engine=None, **kwargs):
        super().__init__(master, corner_radius=0, fg_color="transparent", **kwargs)
        self.engine = engine
        
        # 1. Main Scrollable Area
        self.scroll_frame = ctk.CTkScrollableFrame(
            self, 
            fg_color="transparent", 
            corner_radius=0
        )
        self.scroll_frame.place(relx=0, rely=0, relwidth=1, relheight=1)

        # 2. Main Container (Adaptive Flex Column)
        self.inner = ctk.CTkFrame(self.scroll_frame, fg_color="transparent")
        self.inner.pack(fill="x", padx=(40, 48), pady=(32, 100))

        # --- ROW 1: RADAR & AI WIDGET ---
        self.setup_top_row()

        # --- ROW 2: AREA CHART HRV ---
        self.setup_hrv_row()

        # --- ROW 3: TREN CITRA ANAK (EMOTION & GAZE) ---
        self.setup_citra_anak_row()

        # --- ROW 4: SESSION LOG TABLE ---
        self.setup_table_row()

    def setup_top_row(self):
        # Container (flex: row, gap: 32px, height: 418px)
        row1 = ctk.CTkFrame(self.inner, fg_color="transparent")
        row1.pack(fill="x", pady=(0, 32))

        # 1. Dashboard Kesadaran Diri (Radar Chart Card)
        radar_card = ctk.CTkFrame(
            row1, 
            fg_color=COLOR_WHITE, 
            corner_radius=12, 
            border_width=1, 
            border_color=COLOR_BORDER,
            height=418
        )
        radar_card.pack(side="left", fill="both", expand=True, padx=(0, 16))
        radar_card.pack_propagate(False)

        # Card Header
        head = ctk.CTkFrame(radar_card, fg_color="transparent")
        head.pack(fill="x", padx=24, pady=24)
        
        title_box = ctk.CTkFrame(head, fg_color="transparent")
        title_box.pack(side="left")
        ctk.CTkLabel(title_box, text="Dashboard Kesadaran Diri", font=ctk.CTkFont(family=FONT_INTER, size=18, weight="bold"), text_color=COLOR_TEXT_DARK).pack(anchor="w")
        ctk.CTkLabel(title_box, text="Analisis profil kognitif dan kesiapan belajar real-time", font=ctk.CTkFont(family=FONT_INTER, size=14), text_color=COLOR_TEXT_SUB).pack(anchor="w")

        # Active Badge
        badge = ctk.CTkFrame(head, fg_color="#F5F3FF", corner_radius=9999)
        badge.pack(side="right")
        ctk.CTkFrame(badge, width=8, height=8, corner_radius=999, fg_color=COLOR_BRAND_BLUE).pack(side="left", padx=(12, 8), pady=10)
        ctk.CTkLabel(badge, text="AKTIF", font=ctk.CTkFont(family=FONT_INTER, size=12, weight="bold"), text_color=COLOR_BRAND_BLUE).pack(side="left", padx=(0, 12))

        # Radar Area
        content = ctk.CTkFrame(radar_card, fg_color="transparent")
        content.pack(fill="both", expand=True, padx=24, pady=(0, 24))

        radar_canvas = tk.Canvas(content, width=256, height=256, bg=COLOR_WHITE, highlightthickness=0)
        radar_canvas.pack(side="left", padx=(20, 0))
        self.draw_radar(radar_canvas)

        # Right side stats
        stats_col = ctk.CTkFrame(content, fg_color="transparent")
        stats_col.pack(side="right", fill="both", expand=True, padx=(40, 0))

        stat_items = [
            ("Fokus Kognitif", "88%", COLOR_BRAND_BLUE, 0.88),
            ("Memori Kerja", "72%", "#10B981", 0.72),
            ("Kecepatan Proses", "24%", "#F97316", 0.24)
        ]

        for label, val_text, color, ratio in stat_items:
            s_card = ctk.CTkFrame(stats_col, fg_color="#F8FAFC", corner_radius=12, border_width=1, border_color=COLOR_BORDER)
            s_card.pack(fill="x", pady=8)
            
            s_top = ctk.CTkFrame(s_card, fg_color="transparent")
            s_top.pack(fill="x", padx=16, pady=(16, 4))
            ctk.CTkLabel(s_top, text=label, font=ctk.CTkFont(family=FONT_INTER, size=14, weight="normal"), text_color="#475569").pack(side="left")
            ctk.CTkLabel(s_top, text=val_text, font=ctk.CTkFont(family=FONT_INTER, size=14, weight="bold"), text_color=color).pack(side="right")
            
            # Progress Bar
            track = ctk.CTkFrame(s_card, height=6, fg_color="#E2E8F0", corner_radius=9999)
            track.pack(fill="x", padx=16, pady=(0, 16))
            fill = ctk.CTkFrame(track, height=6, fg_color=color, corner_radius=9999)
            fill.place(relx=0, rely=0, relwidth=ratio)

        ai_card_container = ctk.CTkFrame(row1, fg_color="transparent", width=300)
        ai_card_container.pack(side="right", fill="y", padx=(16, 0))
        ai_card_container.pack_propagate(False)

        # 2. Card AI (Top half of right column)
        ai_card = ctk.CTkFrame(
            ai_card_container, 
            fg_color="#330DF2", 
            corner_radius=12, 
            height=264
        )
        ai_card.pack(fill="x", pady=(0, 16))
        ai_card.pack_propagate(False)

        # Background Decoration (Circle Pattern)
        ai_bg_canvas = tk.Canvas(ai_card, width=192, height=192, bg=COLOR_BRAND_BLUE, highlightthickness=0)
        ai_bg_canvas.place(x=150, y=80)
        ai_bg_canvas.create_oval(0, 0, 192, 192, fill="#4A28F4", outline="") # Approximation of blur circle

        # AI Icon (Glassmorphic)
        ai_icon_box = ctk.CTkFrame(ai_card, width=48, height=48, corner_radius=8, fg_color="#5C45F5")
        ai_icon_box.place(x=24, y=24)
        ctk.CTkLabel(ai_icon_box, text="✨", font=ctk.CTkFont(size=20)).place(relx=0.5, rely=0.5, anchor="center")

        ctk.CTkLabel(
            ai_card, text="Rekomendasi Waktu Belajar", 
            font=ctk.CTkFont(family=FONT_INTER, size=18, weight="bold"),
            text_color=COLOR_WHITE,
            justify="left"
        ).place(x=24, y=96)

        ctk.CTkLabel(
            ai_card, text="Berdasarkan pola HRV dan fokus kognitif Anda, jendela performa puncak Anda berikutnya adalah:", 
            font=ctk.CTkFont(family=FONT_INTER, size=12),
            text_color=COLOR_WHITE,
            justify="left",
            wraplength=250
        ).place(x=24, y=135)

        # B. Total Waktu Belajar Card (White)
        stats_card = ctk.CTkFrame(
            ai_card_container, 
            fg_color=COLOR_WHITE, 
            corner_radius=12, 
            border_width=1, 
            border_color=COLOR_BORDER,
            height=163
        )
        stats_card.pack(fill="x")
        stats_card.pack_propagate(False)

        ctk.CTkLabel(
            stats_card, text="TOTAL WAKTU BELAJAR", 
            font=ctk.CTkFont(family=FONT_INTER, size=14, weight="bold"),
            text_color=COLOR_TEXT_SUB
        ).pack(anchor="w", padx=24, pady=(24, 0))

        val_row = ctk.CTkFrame(stats_card, fg_color="transparent")
        val_row.pack(anchor="w", padx=24, pady=(8, 0))
        
        ctk.CTkLabel(
            val_row, text="24.5", 
            font=ctk.CTkFont(family=FONT_INTER, size=36, weight="bold"),
            text_color=COLOR_TEXT_DARK
        ).pack(side="left")
        
        ctk.CTkLabel(
            val_row, text=" Jam", 
            font=ctk.CTkFont(family=FONT_INTER, size=18, weight="bold"),
            text_color="#94A3B8"
        ).pack(side="left", pady=(10, 0))

        # Growth Row
        growth_row = ctk.CTkFrame(stats_card, fg_color="transparent")
        growth_row.pack(anchor="w", padx=24, pady=(16, 0))
        
        ctk.CTkLabel(growth_row, text="↗", font=ctk.CTkFont(size=14), text_color="#10B981").pack(side="left", padx=(0, 4))
        ctk.CTkLabel(
            growth_row, text="+12% dari minggu lalu", 
            font=ctk.CTkFont(family=FONT_INTER, size=14, weight="normal"),
            text_color="#10B981"
        ).pack(side="left")

    def setup_hrv_row(self):
        # Visual Area: Tren Kesejahteraan Biometrik
        hrv_card = ctk.CTkFrame(
            self.inner, 
            fg_color=COLOR_WHITE, 
            corner_radius=12, 
            border_width=1, 
            border_color=COLOR_BORDER
        )
        hrv_card.pack(fill="x", pady=(0, 32))

        # Header
        head = ctk.CTkFrame(hrv_card, fg_color="transparent")
        head.pack(fill="x", padx=24, pady=24)
        
        info = ctk.CTkFrame(head, fg_color="transparent")
        info.pack(side="left")
        ctk.CTkLabel(info, text="Tren Kesejahteraan Biometrik", font=ctk.CTkFont(family=FONT_INTER, size=18, weight="bold"), text_color=COLOR_TEXT_DARK).pack(anchor="w")
        ctk.CTkLabel(info, text="Heart Rate Variability (HRV) & Index Pemulihan Stres", font=ctk.CTkFont(family=FONT_INTER, size=14), text_color=COLOR_TEXT_SUB).pack(anchor="w")

        # Legends
        leg = ctk.CTkFrame(head, fg_color="transparent")
        leg.pack(side="right")
        for n, c in [("HRV Index", COLOR_BRAND_BLUE), ("Target Ideal", "#E2E8F0")]:
            l = ctk.CTkFrame(leg, fg_color="transparent")
            l.pack(side="left", padx=12)
            ctk.CTkFrame(l, width=12, height=12, corner_radius=99, fg_color=c).pack(side="left", padx=(0, 8))
            ctk.CTkLabel(l, text=n, font=ctk.CTkFont(family=FONT_INTER, size=12, weight="normal"), text_color=COLOR_TEXT_SUB).pack(side="left")

        # Chart & Axis Container
        chart_container = ctk.CTkFrame(hrv_card, fg_color="transparent")
        chart_container.pack(fill="x", padx=25, pady=(0, 25))

        # Premium Pre-rendered Image-based Chart
        self.chart_label = ctk.CTkLabel(chart_container, text="", fg_color="transparent")
        self.chart_label.pack(fill="x")
        self.render_premium_chart()

        # X-Axis Labels Row (Flex Layout: space-between)
        x_axis = ctk.CTkFrame(chart_container, fg_color="transparent", height=16)
        x_axis.pack(fill="x", pady=(12, 0))
        
        days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]
        for day in days:
            lbl = ctk.CTkLabel(
                x_axis, text=day,
                font=ctk.CTkFont(family=FONT_INTER, size=12, weight="normal"),
                text_color="#94A3B8"
            )
            lbl.pack(side="left", expand=True)

    def setup_table_row(self):
        # Bottom Row: Session Log
        table_card = ctk.CTkFrame(
            self.inner, 
            fg_color=COLOR_WHITE, 
            corner_radius=12, 
            border_width=1, 
            border_color=COLOR_BORDER,
            height=345
        )
        table_card.pack(fill="x")
        table_card.pack_propagate(False)

        # Header
        t_head = ctk.CTkFrame(table_card, fg_color="transparent", height=77)
        t_head.pack(fill="x", pady=0)
        ctk.CTkLabel(t_head, text="Log Sesi Belajar Terbaru", font=ctk.CTkFont(family=FONT_INTER, size=18, weight="bold"), text_color=COLOR_TEXT_DARK).pack(side="left", padx=24, pady=24)
        ctk.CTkLabel(t_head, text="LIHAT SEMUA", font=ctk.CTkFont(family=FONT_INTER, size=14, weight="bold"), text_color=COLOR_BRAND_BLUE).pack(side="right", padx=24, pady=24)

        # Border
        ctk.CTkFrame(table_card, height=1, fg_color=COLOR_BORDER).pack(fill="x")

        # Table Container
        table_main = ctk.CTkFrame(table_card, fg_color="transparent")
        table_main.pack(fill="both", expand=True)

        # Header Row (F8FAFC)
        t_grid_head = ctk.CTkFrame(table_main, fg_color="#F8FAFC", height=48, corner_radius=0)
        t_grid_head.pack(fill="x")
        t_grid_head.pack_propagate(False)

        headers = [
            ("AKTIVITAS", 279), 
            ("DURASI", 140), 
            ("STATUS KOGNITIF", 228), 
            ("SKOR", 194)
        ]
        
        for text, width in headers:
            ctk.CTkLabel(
                t_grid_head, text=text, width=width, 
                font=ctk.CTkFont(family=FONT_INTER, size=12, weight="bold"),
                text_color=COLOR_TEXT_SUB, anchor="w"
            ).pack(side="left", padx=24)

        # Body Rows
        # (Title, Sub, Duration, StatusLabel, StatusBG, StatusText, Score, Icon, IconBG, IconColor)
        session_data = [
            ("Matematika Lanjut", "Bab 4: Kalkulus Turunan", "45 Menit", "OPTIMAL", "#D1FAE5", "#059669", "92/100", "Σ", "#DBEAFE", "#2563EB"),
            ("Bahasa Inggris", "Listening - IELTS Prep", "32 Menit", "MODERAT", "#FEF3C7", "#D97706", "78/100", "A", "#FEF3C7", "#D97706"),
            ("Fisika Dasar", "Hukum Newton III", "25 Menit", "OPTIMAL", "#D1FAE5", "#059669", "85/100", "⚛", "#F3E8FF", "#9333EA")
        ]

        for title, sub, dur, stat, sbg, stx, sc, icon, ibg, itx in session_data:
            # Row Border
            ctk.CTkFrame(table_main, height=1, fg_color=COLOR_BORDER).pack(fill="x")
            
            r = ctk.CTkFrame(table_main, fg_color=COLOR_WHITE, height=72)
            r.pack(fill="x")
            r.pack_propagate(False)
            
            # 1. Aktivitas
            act_box = ctk.CTkFrame(r, width=279, fg_color="transparent")
            act_box.pack(side="left", padx=24)
            act_box.pack_propagate(False)
            
            icon_bg = ctk.CTkFrame(act_box, width=32, height=32, corner_radius=4, fg_color=ibg)
            icon_bg.pack(side="left", pady=20)
            ctk.CTkLabel(icon_bg, text=icon, text_color=itx, font=ctk.CTkFont(size=14, weight="bold")).place(relx=0.5, rely=0.5, anchor="center")
            
            txt_stack = ctk.CTkFrame(act_box, fg_color="transparent")
            txt_stack.pack(side="left", padx=12, pady=18)
            ctk.CTkLabel(txt_stack, text=title, font=ctk.CTkFont(family=FONT_INTER, size=14, weight="bold"), text_color="#1E293B").pack(anchor="w")
            ctk.CTkLabel(txt_stack, text=sub, font=ctk.CTkFont(family=FONT_INTER, size=12), text_color=COLOR_TEXT_SUB).pack(anchor="w")

            # 2. Durasi
            ctk.CTkLabel(r, text=dur, width=140, font=ctk.CTkFont(family=FONT_INTER, size=14, weight="normal"), text_color="#1E293B", anchor="w").pack(side="left", padx=24)

            # 3. Status
            s_box = ctk.CTkFrame(r, width=228, fg_color="transparent")
            s_box.pack(side="left", padx=24)
            s_box.pack_propagate(False)
            
            badge = ctk.CTkFrame(s_box, fg_color=sbg, corner_radius=9999)
            badge.place(rely=0.5, anchor="w")
            
            # Dot
            ctk.CTkFrame(badge, width=6, height=6, corner_radius=99, fg_color=stx).pack(side="left", padx=(10, 6), pady=8)
            ctk.CTkLabel(badge, text=stat, font=ctk.CTkFont(family=FONT_INTER, size=12, weight="bold"), text_color=stx).pack(side="left", padx=(0, 10))

            # 4. Skor
            ctk.CTkLabel(r, text=sc, width=194, font=ctk.CTkFont(family=FONT_INTER, size=14, weight="bold"), text_color="#334155", anchor="w").pack(side="left", padx=24)

    def setup_citra_anak_row(self):
        # 1. Container Row
        row_citra = ctk.CTkFrame(self.inner, fg_color="transparent")
        row_citra.pack(fill="x", pady=(0, 32))
        
        # Header
        head = ctk.CTkFrame(row_citra, fg_color="transparent")
        head.pack(fill="x", padx=24, pady=(0, 24))
        
        info = ctk.CTkFrame(head, fg_color="transparent")
        info.pack(side="left")
        ctk.CTkLabel(info, text="Tren Citra Anak", font=ctk.CTkFont(family=FONT_INTER, size=18, weight="bold"), text_color=COLOR_TEXT_DARK).pack(anchor="w")
        ctk.CTkLabel(info, text="Analisis visual emosi dan fokus pandangan mata (Gaze Tracking)", font=ctk.CTkFont(family=FONT_INTER, size=14), text_color=COLOR_TEXT_SUB).pack(anchor="w")

        # 2. Main Content (Vertical stacked layout)
        content = ctk.CTkFrame(row_citra, fg_color="transparent")
        content.pack(fill="x", padx=16)

        # Top Section: Emotion & Focus Cards (Horizontal pair inside top section)
        top_stats = ctk.CTkFrame(content, fg_color="transparent")
        top_stats.pack(fill="x", pady=(0, 16))

        # Emotion Card
        self.emotion_card = ctk.CTkFrame(top_stats, fg_color=COLOR_WHITE, corner_radius=12, border_width=1, border_color=COLOR_BORDER, height=140)
        self.emotion_card.pack(side="left", fill="both", expand=True, padx=(0, 8))
        self.emotion_card.pack_propagate(False)
        
        ctk.CTkLabel(self.emotion_card, text="STATUS EMOSI REAL-TIME", font=ctk.CTkFont(size=10, weight="bold"), text_color=COLOR_TEXT_SUB).pack(anchor="w", padx=24, pady=(20, 0))
        self.emotion_val = ctk.CTkLabel(self.emotion_card, text="NEUTRAL", font=ctk.CTkFont(family=FONT_HEADING, size=32, weight="bold"), text_color=COLOR_BRAND_BLUE)
        self.emotion_val.pack(anchor="w", padx=24)
        
        self.emotion_sync_label = ctk.CTkLabel(self.emotion_card, text="● SYNCED WITH VISION ENGINE", font=ctk.CTkFont(size=9, weight="bold"), text_color="#10B981")
        self.emotion_sync_label.pack(anchor="w", padx=24, pady=(2, 0))

        # Focus Status Card
        self.focus_card = ctk.CTkFrame(top_stats, fg_color=COLOR_WHITE, corner_radius=12, border_width=1, border_color=COLOR_BORDER, height=140)
        self.focus_card.pack(side="left", fill="both", expand=True, padx=(8, 0))
        self.focus_card.pack_propagate(False)

        ctk.CTkLabel(self.focus_card, text="KONSISTENSI FOKUS VISUAL", font=ctk.CTkFont(size=10, weight="bold"), text_color=COLOR_TEXT_SUB).pack(anchor="w", padx=24, pady=(20, 0))
        self.focus_status = ctk.CTkLabel(self.focus_card, text="ON TARGET", font=ctk.CTkFont(family=FONT_HEADING, size=24, weight="bold"), text_color="#8B5CF6")
        self.focus_status.pack(anchor="w", padx=24)

        # Bottom Section: Live Attention Heatmap (Expanded below)
        right_col = ctk.CTkFrame(content, fg_color="#0F172A", corner_radius=24, height=350)
        right_col.pack(side="top", fill="x", pady=(8, 0))
        right_col.pack_propagate(False)

        ctk.CTkLabel(right_col, text="LIVE ATTENTION HEATMAP", font=ctk.CTkFont(size=10, weight="bold"), text_color="white").pack(anchor="w", padx=24, pady=(24, 0))
        
        # Heatmap Canvas
        self.heatmap_canvas = tk.Canvas(right_col, bg="#0F172A", highlightthickness=0)
        self.heatmap_canvas.pack(fill="both", expand=True, padx=20, pady=20)
        
        # Initial Heat Element
        self.heat_glow = self.heatmap_canvas.create_oval(0, 0, 0, 0, fill="#330DF2", outline="", stipple="gray50") # Mock glow
        self.heat_point = self.heatmap_canvas.create_oval(0, 0, 0, 0, fill="white", outline="")

        # Disclaimer
        ctk.CTkLabel(row_citra, text="Akurasi heatmap bergantung pada kalibrasi pencahayaan ruangan dan posisi duduk anak.", font=ctk.CTkFont(size=10, slant="italic"), text_color=COLOR_TEXT_SUB).pack(pady=(12, 0))

    def update_realtime(self):
        """Metode update UI real-time dengan Exception Guard"""
        try:
            if self.engine and self.engine.vision:
                # 1. Get Data from Vision Engine
                citra_data = self.engine.vision.get_citra_anak()
                emotion = citra_data.get("emotion", "NEUTRAL")
                gaze = citra_data.get("gaze_coords", {"x": 0.5, "y": 0.5})
                
                # 2. Update Emotion Text
                self.emotion_val.configure(text=emotion)
                
                # 3. Update Focus Status
                is_focused = 0.4 < gaze["x"] < 0.6
                self.focus_status.configure(
                    text="ON TARGET" if is_focused else "DISTRACTED",
                    text_color="#8B5CF6" if is_focused else "#F43F5E"
                )
                
                # 4. Update Heatmap Position
                cw = self.heatmap_canvas.winfo_width()
                ch = self.heatmap_canvas.winfo_height()
                
                if cw > 1 and ch > 1:
                    hx = gaze["x"] * cw
                    hy = gaze["y"] * ch
                    self.heatmap_canvas.coords(self.heat_glow, hx-40, hy-40, hx+40, hy+40)
                    self.heatmap_canvas.coords(self.heat_point, hx-5, hy-5, hx+5, hy+5)
        except Exception as e:
            print(f"[StatistikUI] Exception in real-time loop: {e}")
            # Silently recover for UI but log it

        # Loop every 100ms
        self.after(100, self.update_realtime)

    def draw_radar(self, canvas):
        cx, cy = 128, 128
        for r in [100, 75, 50, 25]:
            self.draw_poly(canvas, cx, cy, r, 5, "#E2E8F0")
        
        for i in range(5):
            angle = math.radians(i * 72 - 90)
            canvas.create_line(cx, cy, cx + 110 * math.cos(angle), cy + 110 * math.sin(angle), fill="#F1F5F9")

        pts = [0.9, 0.7, 0.8, 0.6, 0.85]
        coords = []
        for i, v in enumerate(pts):
            angle = math.radians(i * 72 - 90)
            coords.extend([cx + (100 * v) * math.cos(angle), cy + (100 * v) * math.sin(angle)])
        canvas.create_polygon(coords, fill="#EBE8FE", outline=COLOR_BRAND_BLUE, width=2)

    def draw_poly(self, canvas, cx, cy, r, n, color):
        coords = []
        for i in range(n):
            angle = math.radians(i * (360/n) - 90)
            coords.extend([cx + r * math.cos(angle), cy + r * math.sin(angle)])
        canvas.create_polygon(coords, outline=color, fill="", width=1)

    def render_premium_chart(self):
        w, h = 1047, 256
        # Use higher resolution for anti-aliasing simulation (2x)
        scale = 2
        sw, sh = w * scale, h * scale
        img = Image.new("RGBA", (sw, sh), (255, 255, 255, 0))
        draw = ImageDraw.Draw(img)

        # Helper for scale and rounding to int (required by PIL in some modes)
        def s(p):
            if isinstance(p, (int, float)): return int(p * scale)
            return (int(p[0] * scale), int(p[1] * scale))

        # 1. Background Grid Lines (Dashed)
        grid_y = [51.2, 102.4, 153.6, 204.8]
        for gy in grid_y:
            for gx in range(0, w, 8):
                draw.line([s((gx, gy)), s((min(gx+4, w), gy))], fill="#F1F5F9", width=s(1.1))

        # 2. Target Ideal Zone (Green 5% opacity)
        draw.rectangle([s(0), s(64), s(w), s(115.2)], fill=(16, 185, 129, 13))

        # 3. Curve Path Calc (Bezier)
        def bezier(t, p0, p1, p2, p3):
            tx = (1-t)**3 * p0[0] + 3*(1-t)**2 * t * p1[0] + 3*(1-t) * t**2 * p2[0] + t**3 * p3[0]
            ty = (1-t)**3 * p0[1] + 3*(1-t)**2 * t * p1[1] + 3*(1-t) * t**2 * p2[1] + t**3 * p3[1]
            return (tx, ty)

        segments = [
            ((0, 192), (103.8, 179.147), (155.7, 76.3238), (259.5, 102.03)),
            ((259.5, 102.03), (363.3, 127.735), (467.1, 50.618), (570.9, 76.3238)),
            ((570.9, 76.3238), (674.7, 102.03), (778.5, 192), (882.3, 166.294)),
            ((882.3, 166.294), (986.1, 140.588), (1038, 127.735), (1038, 127.735))
        ]

        raw_pts = []
        for p0, p1, p2, p3 in segments:
            for i in range(101):
                raw_pts.append(bezier(i/100, p0, p1, p2, p3))

        # 4. Premium Gradient Area Fill (Masked Gradient)
        # Create mask for the polygon
        mask = Image.new("L", (sw, sh), 0)
        mask_draw = ImageDraw.Draw(mask)
        poly_pts = [s((0, h))] + [s(p) for p in raw_pts] + [s((w, h))]
        mask_draw.polygon(poly_pts, fill=255)

        # Create gradient image
        grad_img = Image.new("RGBA", (sw, sh), (0, 0, 0, 0))
        grad_draw = ImageDraw.Draw(grad_img)
        for gy in range(int(sh)):
            # Indigo #330DF2 = (51, 13, 242)
            # Fade from 20% alpha (51) to 0% alpha
            alpha = int(51 * (1 - gy / sh))
            grad_draw.line([(0, gy), (sw, gy)], fill=(51, 13, 242, alpha))
        
        # Composite the gradient with mask onto main image
        img.paste(grad_img, (0, 0), mask)

        # 5. Main Line (3.285px stroke)
        draw.line([s(p) for p in raw_pts], fill="#330DF2", width=s(3.285), joint="curve")

        # Downsample and Display
        final_img = img.resize((w, h), Image.Resampling.LANCZOS)
        self.hrv_premium_img = ctk.CTkImage(light_image=final_img, dark_image=final_img, size=(w, h))
        self.chart_label.configure(image=self.hrv_premium_img)
