import customtkinter as ctk
import tkinter as tk
from PIL import Image, ImageDraw, ImageOps, ImageFont
import os
import random
from components.logo import load_svg_as_pil

# --- PANDAI INTEGRATED DESIGN SYSTEM ---
COLOR_BG = "#F8F8F8"
COLOR_WHITE = "#FFFFFF"
COLOR_BRAND_BLUE = "#330DF2"
COLOR_BRAND_PURPLE = "#7C3AED"
COLOR_TEXT_DARK = "#0F172A"
COLOR_TEXT_SUB = "#64748B"
COLOR_TEXT_DIM = "#94A3B8"
COLOR_BORDER = "#F1F5F9"
COLOR_INPUT_BG = "#F8FAFC"
COLOR_SUCCESS = "#10B981"
COLOR_INDIGO = "#2563EB"

FONT_INTER = "Inter"
FONT_HEADING = "Plus Jakarta Sans"

class ProfilPage(ctk.CTkFrame):
    def __init__(self, master, **kwargs):
        super().__init__(master, corner_radius=0, fg_color="transparent", **kwargs)
        
        self.profile_img_path = r"C:\Users\thori\.gemini\antigravity\brain\9e5b86e9-6d0d-4d2a-84c8-bfa814ff8ed9\mozart_profile_photo_1773214449442.png"
        self.current_tab = "Informasi Dasar"

        # 1. Main Scrollable Area
        self.scroll_frame = ctk.CTkScrollableFrame(self, fg_color="transparent", corner_radius=0)
        self.scroll_frame.place(relx=0, rely=0, relwidth=1, relheight=1)

        # 2. Main Container
        self.inner = ctk.CTkFrame(self.scroll_frame, fg_color="transparent")
        self.inner.pack(fill="x", padx=(30, 38), pady=(32, 100))

        # Setup Components
        self.setup_top_row()
        self.setup_tabs()
        
        # dynamic content area
        self.content_container = ctk.CTkFrame(self.inner, fg_color="transparent")
        self.content_container.pack(fill="x")
        
        self.render_content()

    def render_content(self):
        # Clear previous content
        for child in self.content_container.winfo_children():
            child.destroy()

        if self.current_tab == "Informasi Dasar":
            self.setup_content_form()
        else:
            self.setup_preferensi_belajar()

    def setup_top_row(self):
        row = ctk.CTkFrame(self.inner, fg_color="transparent")
        row.pack(fill="x", pady=(0, 24))
        
        prof_card = ctk.CTkFrame(row, fg_color=COLOR_WHITE, corner_radius=24, border_width=1, border_color=COLOR_BORDER, height=182)
        prof_card.pack(side="left", fill="both", expand=True, padx=(0, 24))
        prof_card.pack_propagate(False)

        content = ctk.CTkFrame(prof_card, fg_color="transparent")
        content.pack(fill="both", expand=True, padx=24, pady=24)

        try:
            pil_img = Image.open(self.profile_img_path)
            size = (96, 96)
            mask = Image.new('L', size, 0)
            draw = ImageDraw.Draw(mask)
            draw.ellipse((0, 0) + size, fill=255)
            output = ImageOps.fit(pil_img, size, centering=(0.5, 0.5))
            output.putalpha(mask)
            ctk_img = ctk.CTkImage(light_image=output, dark_image=output, size=(96, 96))
            img_label = ctk.CTkLabel(content, image=ctk_img, text="")
            img_label.pack(side="left")
        except:
            img_circle = ctk.CTkFrame(content, width=96, height=96, corner_radius=48, fg_color="#F1F5F9")
            img_circle.pack(side="left")
            ctk.CTkLabel(img_circle, text="M", font=ctk.CTkFont(size=32, weight="bold")).place(relx=0.5, rely=0.5, anchor="center")

        txt_box = ctk.CTkFrame(content, fg_color="transparent")
        txt_box.pack(side="left", padx=24, fill="y")
        ctk.CTkLabel(txt_box, text="Fanan Agfian Mozart", font=ctk.CTkFont(family=FONT_INTER, size=24, weight="bold"), text_color=COLOR_TEXT_DARK).pack(anchor="w")
        ctk.CTkLabel(txt_box, text="Murid Kelas XII Mipa 6", font=ctk.CTkFont(family=FONT_INTER, size=16), text_color=COLOR_TEXT_SUB).pack(anchor="w", pady=(4, 0))

        btn_row = ctk.CTkFrame(txt_box, fg_color="transparent")
        btn_row.pack(side="bottom", anchor="w", pady=(16, 0))
        
        ctk.CTkButton(btn_row, text="Ganti Foto Profil", fg_color="transparent", border_width=1, border_color="#E2E8F0", text_color=COLOR_TEXT_DARK, corner_radius=12, height=38, font=ctk.CTkFont(family=FONT_INTER, size=14, weight="bold")).pack(side="left", padx=(0, 12))
        ctk.CTkButton(btn_row, text="Unduh Raport Kognitif", fg_color="#F2EBFD", text_color=COLOR_BRAND_PURPLE, corner_radius=12, height=38, hover_color="#EBE1FC", font=ctk.CTkFont(family=FONT_INTER, size=14, weight="bold")).pack(side="left")

        # 2. Neuro-Insight Summary (304px x 182px specialized container)
        insight_card = ctk.CTkFrame(
            row, 
            fg_color=COLOR_WHITE, 
            corner_radius=24, 
            border_width=1, 
            border_color=COLOR_BORDER, 
            width=304, 
            height=182
        )
        insight_card.pack(side="right")
        insight_card.pack_propagate(False)
        
        # Header according to CSS (Inter, 14px, 600 weight, uppercase)
        ctk.CTkLabel(
            insight_card, 
            text="NEURO-INSIGHT RINGKAS", 
            font=ctk.CTkFont(family=FONT_INTER, size=14, weight="bold"), 
            text_color=COLOR_TEXT_SUB
        ).pack(anchor="w", padx=24, pady=(16, 0)) # Lifted text by reducing top pady
        
        # Rows with high-detail SVG Icons
        assets_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "assets")
        insights = [
            ("Rata-rata Atensi", "84%", "#3B82F6", 0.84, "#DBEAFE", "Ikon_Neuro-Insight-Ringkas_biru.svg"),
            ("Ketenangan", "92%", "#10B981", 0.92, "#D1FAE5", "Ikon_Neuro-Insight-Ringkas_Hijau.svg")
        ]
        
        # Container for symmetrical rows (Flexible container to avoid clipping)
        rows_cont = ctk.CTkFrame(insight_card, fg_color="transparent")
        rows_cont.pack(fill="x", padx=24, pady=(12, 16)) 
        
        for i, (name, val, color, ratio, bg, svg) in enumerate(insights):
            # Row container matching CSS: display: flex; flex-direction: row; justify-content: space-between; align-items: center;
            i_row = ctk.CTkFrame(rows_cont, fg_color="transparent")
            # 6px GAP between rows as requested
            i_row.pack(fill="x", pady=(0, 6) if i == 0 else 0) 
            
            # LEFT SIDE: Icon + Text Stack
            left_cont = ctk.CTkFrame(i_row, fg_color="transparent")
            left_cont.pack(side="left")
            
            # Icon box with SVG
            i_box = ctk.CTkFrame(left_cont, width=40, height=40, corner_radius=12, fg_color=bg)
            i_box.pack(side="left")
            i_box.pack_propagate(False)
            
            svg_path = os.path.join(assets_dir, svg)
            if os.path.exists(svg_path):
                icon_pil = load_svg_as_pil(svg_path, width=24, height=24)
                icon_ctk = ctk.CTkImage(light_image=icon_pil, dark_image=icon_pil, size=(24, 24))
                ctk.CTkLabel(i_box, image=icon_ctk, text="").place(relx=0.5, rely=0.5, anchor="center")
            
            # Text Stack (Name above Value)
            text_stack = ctk.CTkFrame(left_cont, fg_color="transparent")
            text_stack.pack(side="left", padx=12)
            
            ctk.CTkLabel(
                text_stack, text=name, 
                font=ctk.CTkFont(family=FONT_INTER, size=12, weight="normal"), 
                text_color=COLOR_TEXT_SUB
            ).pack(anchor="w")
            
            ctk.CTkLabel(
                text_stack, text=val, 
                font=ctk.CTkFont(family=FONT_INTER, size=16, weight="bold"), 
                text_color=COLOR_TEXT_DARK
            ).pack(anchor="w")

            # RIGHT SIDE: Progress Bar (Straight/Aligned with logic)
            pb = ctk.CTkProgressBar(i_row, width=64, height=6, fg_color="#F1F5F9", progress_color=color)
            pb.pack(side="right", pady=10) # Centered vertically within row
            pb.set(ratio)

    def setup_tabs(self):
        tab_container = ctk.CTkFrame(self.inner, fg_color="transparent")
        tab_container.pack(fill="x", pady=(0, 24))
        ctk.CTkFrame(tab_container, height=1, fg_color="#E2E8F0").place(relx=0, rely=1, relwidth=1, anchor="sw")
        
        # Informas Dasar Tab
        self.tab1 = ctk.CTkFrame(tab_container, fg_color="transparent", cursor="hand2")
        self.tab1.pack(side="left", padx=(0, 32))
        self.tab1_label = ctk.CTkLabel(self.tab1, text="Informasi Dasar", font=ctk.CTkFont(family=FONT_INTER, size=14))
        self.tab1_label.pack(pady=(16, 12))
        self.tab1_ind = ctk.CTkFrame(self.tab1, height=2)
        self.tab1_ind.pack(fill="x")

        # Preferensi Belajar Tab
        self.tab2 = ctk.CTkFrame(tab_container, fg_color="transparent", cursor="hand2")
        self.tab2.pack(side="left")
        self.tab2_label = ctk.CTkLabel(self.tab2, text="Preferensi Belajar", font=ctk.CTkFont(family=FONT_INTER, size=14))
        self.tab2_label.pack(pady=(16, 12))
        self.tab2_ind = ctk.CTkFrame(self.tab2, height=2)
        self.tab2_ind.pack(fill="x")

        self.tab1_label.bind("<Button-1>", lambda e: self.switch_tab("Informasi Dasar"))
        self.tab2_label.bind("<Button-1>", lambda e: self.switch_tab("Preferensi Belajar"))
        self.update_tab_ui()

    def switch_tab(self, name):
        self.current_tab = name
        self.update_tab_ui()
        self.render_content()

    def update_tab_ui(self):
        if self.current_tab == "Informasi Dasar":
            self.tab1_label.configure(text_color=COLOR_BRAND_PURPLE, font=ctk.CTkFont(family=FONT_INTER, size=14, weight="bold"))
            self.tab1_ind.configure(fg_color=COLOR_BRAND_PURPLE)
            self.tab2_label.configure(text_color=COLOR_TEXT_SUB, font=ctk.CTkFont(family=FONT_INTER, size=14, weight="normal"))
            self.tab2_ind.configure(fg_color="transparent")
        else:
            self.tab2_label.configure(text_color=COLOR_BRAND_PURPLE, font=ctk.CTkFont(family=FONT_INTER, size=14, weight="bold"))
            self.tab2_ind.configure(fg_color=COLOR_BRAND_PURPLE)
            self.tab1_label.configure(text_color=COLOR_TEXT_SUB, font=ctk.CTkFont(family=FONT_INTER, size=14, weight="normal"))
            self.tab1_ind.configure(fg_color="transparent")

    def setup_content_form(self):
        main_card = ctk.CTkFrame(self.content_container, fg_color=COLOR_WHITE, corner_radius=24, border_width=1, border_color=COLOR_BORDER)
        main_card.pack(fill="x")
        content = ctk.CTkFrame(main_card, fg_color="transparent")
        content.pack(fill="both", expand=True, padx=32, pady=32)
        ctk.CTkLabel(content, text="Informasi Dasar", font=ctk.CTkFont(family=FONT_INTER, size=18, weight="bold"), text_color=COLOR_TEXT_DARK).pack(anchor="w", pady=(0, 24))
        grid = ctk.CTkFrame(content, fg_color="transparent"); grid.pack(fill="x", pady=(0, 40)); grid.grid_columnconfigure((0, 1), weight=1, uniform="group1")
        fields = [("NIS", "12789372", 0, 0), ("NISN", "12789372", 0, 1), ("Jenis Kelamin", "Laki-laki", 1, 0), ("Tanggal Lahir", "19 Mei 2007", 1, 1), ("Email", "fananagfian@gmail.com", 2, 0), ("Nomor Telepon", "089669730759", 2, 1)]
        for label, val, r, c in fields:
            f_box = ctk.CTkFrame(grid, fg_color="transparent"); f_box.grid(row=r, column=c, padx=12, pady=12, sticky="nsew")
            ctk.CTkLabel(f_box, text=label, font=ctk.CTkFont(family=FONT_INTER, size=14, weight="bold"), text_color=COLOR_TEXT_SUB).pack(anchor="w", pady=(0, 8))
            inp = ctk.CTkFrame(f_box, height=48, fg_color=COLOR_INPUT_BG, corner_radius=16); inp.pack(fill="x"); inp.pack_propagate(False)
            ctk.CTkLabel(inp, text=val, font=ctk.CTkFont(family=FONT_INTER, size=16), text_color="#334155").pack(side="left", padx=16)
        ctk.CTkLabel(content, text="Status Akademik", font=ctk.CTkFont(family=FONT_INTER, size=18, weight="bold"), text_color=COLOR_TEXT_DARK).pack(anchor="w", pady=(0, 24))
        stat_grid = ctk.CTkFrame(content, fg_color="transparent"); stat_grid.pack(fill="x", pady=(0, 40)); stat_grid.grid_columnconfigure((0, 1), weight=1, uniform="group2")
        for label, val, r, c in [("Kelas", "XII MIPA 6", 0, 0), ("Wali Kelas", "Drs. Bambang Wijaya", 0, 1)]:
            s_box = ctk.CTkFrame(stat_grid, fg_color=COLOR_INPUT_BG, corner_radius=16, height=80); s_box.grid(row=r, column=c, padx=12, pady=12, sticky="nsew")
            ctk.CTkLabel(s_box, text=label.upper(), font=ctk.CTkFont(family=FONT_INTER, size=12, weight="bold"), text_color=COLOR_TEXT_DIM).pack(anchor="w", padx=16, pady=(16, 0))
            ctk.CTkLabel(s_box, text=val, font=ctk.CTkFont(family=FONT_INTER, size=18, weight="bold"), text_color="#334155").pack(anchor="w", padx=16, pady=(0, 12))
        ctk.CTkButton(content, text="Ajukan perubahan", fg_color=COLOR_BRAND_PURPLE, text_color=COLOR_WHITE, corner_radius=16, height=48, width=205, font=ctk.CTkFont(family=FONT_INTER, size=16, weight="bold")).pack(anchor="w", pady=(0, 16))

    def setup_preferensi_belajar(self):
        # Container from CSS (1096px width, 246px height logic)
        report_card = ctk.CTkFrame(self.content_container, fg_color=COLOR_WHITE, corner_radius=24, border_width=1, border_color=COLOR_BORDER)
        report_card.pack(fill="x", pady=(0, 24))
        
        content = ctk.CTkFrame(report_card, fg_color="transparent")
        content.pack(fill="both", expand=True, padx=32, pady=32)

        # Headline
        ctk.CTkLabel(content, text="Laporan Belajar Siswa", font=ctk.CTkFont(family=FONT_INTER, size=18, weight="bold"), text_color=COLOR_TEXT_DARK).pack(anchor="w")

        # Rangkuman Data Kognitif (Lorem Ipsum replacement)
        report_text = (
            "Berdasarkan analisis neuro-metrik selama 30 hari terakhir, Mozart menunjukkan pola fokus 'Deep Diver' dengan ketahanan kognitif yang optimal "
            "di pagi hari (08:00 - 10:30). Tingkat retensi memori meningkat signifikan saat materi disampaikan melalui stimulasi visual dan interaksi spasial. "
            "Kami merekomendasikan sesi belajar dengan interval Pomodoro 50/10 untuk menjaga keseimbangan ritme sirkadian kognitif Anda."
        )
        
        ctk.CTkLabel(
            content, text=report_text, 
            font=ctk.CTkFont(family=FONT_INTER, size=16, weight="normal"), 
            text_color="#0F172A", 
            justify="left", wraplength=1000
        ).pack(anchor="w", pady=(16, 0))

        # Creative Analytics Grid
        analytics_grid = ctk.CTkFrame(self.content_container, fg_color="transparent")
        analytics_grid.pack(fill="x")
        analytics_grid.grid_columnconfigure(0, weight=2)
        analytics_grid.grid_columnconfigure(1, weight=1)

        # 1. Cognitive Performance Chart (High-Fidelity PIL Rendering)
        chart_card = ctk.CTkFrame(analytics_grid, fg_color=COLOR_WHITE, corner_radius=24, border_width=1, border_color=COLOR_BORDER)
        chart_card.grid(row=0, column=0, sticky="nsew", padx=(0, 12))
        
        ctk.CTkLabel(chart_card, text="Pola Kekuatan Kognitif", font=ctk.CTkFont(family=FONT_INTER, size=16, weight="bold"), text_color=COLOR_TEXT_DARK).pack(anchor="w", padx=24, pady=24)
        
        chart_container = ctk.CTkFrame(chart_card, fg_color="transparent")
        chart_container.pack(fill="x", padx=24, pady=(0, 24))
        
        self.cog_chart_label = ctk.CTkLabel(chart_container, text="", fg_color="transparent")
        self.cog_chart_label.pack(fill="x")
        self.render_cognitive_chart()

        # 2. Key Insights Sidebar
        insight_stack = ctk.CTkFrame(analytics_grid, fg_color="transparent")
        insight_stack.grid(row=0, column=1, sticky="nsew", padx=(12, 0))

        # A. Ideal Time Card
        time_card = ctk.CTkFrame(insight_stack, fg_color=COLOR_BRAND_PURPLE, corner_radius=20)
        time_card.pack(fill="x", pady=(0, 12))
        ctk.CTkLabel(time_card, text="🕒 WAKTU BELAJAR IDEAL", font=ctk.CTkFont(size=11, weight="bold"), text_color="#E9E4FF").pack(anchor="nw", padx=20, pady=(20,0))
        ctk.CTkLabel(time_card, text="08:00 - 10:30", font=ctk.CTkFont(family=FONT_INTER, size=24, weight="bold"), text_color=COLOR_WHITE).pack(anchor="nw", padx=20, pady=(4,20))

        # B. Learning Style Card
        style_card = ctk.CTkFrame(insight_stack, fg_color=COLOR_WHITE, corner_radius=20, border_width=1, border_color=COLOR_BORDER)
        style_card.pack(fill="x")
        ctk.CTkLabel(style_card, text="GAYA BELAJAR", font=ctk.CTkFont(size=11, weight="bold"), text_color=COLOR_TEXT_SUB).pack(anchor="nw", padx=20, pady=(16,0))
        
        s_row = ctk.CTkFrame(style_card, fg_color="transparent")
        s_row.pack(fill="x", padx=20, pady=(0, 16))
        ctk.CTkLabel(s_row, text="🖼️", font=ctk.CTkFont(size=24)).pack(side="left")
        ctk.CTkLabel(s_row, text="Visual Spasial", font=ctk.CTkFont(family=FONT_INTER, size=16, weight="bold"), text_color=COLOR_TEXT_DARK).pack(side="left", padx=12)

    def render_cognitive_chart(self):
        """Renders a professional, anti-aliased cognitive bar chart using high-res PIL rendering"""
        # Increase scale for sharper text and visuals
        scale = 4
        w, h = 1000 * scale, 320 * scale # Increased space for labels
        base_h = 240 * scale
        
        img = Image.new('RGBA', (w, h), (255, 255, 255, 0))
        draw = ImageDraw.Draw(img)
        
        # Load Fonts (Fallback to default if not found)
        def get_font(size):
            try:
                # Common system font names for cross-platform
                for font_name in ["arial.ttf", "segoeui.ttf", "DejaVuSans.ttf"]:
                    try:
                        return ImageFont.truetype(font_name, size * scale)
                    except: continue
                return ImageFont.load_default()
            except:
                return None

        font_label = get_font(20) # Significantly larger for legibility
        font_perc = get_font(24)  # Significantly larger for legibility

        # 1. Grid Lines
        grid_y = [50, 100, 150, 200]
        for gy in grid_y:
            y_pos = base_h - (gy * scale)
            draw.line([(80*scale, y_pos), (920*scale, y_pos)], fill="#F1F5F9", width=1*scale)

        data = [
            ("Logika", 0.9, COLOR_BRAND_BLUE), 
            ("Visual", 0.85, COLOR_INDIGO), 
            ("Linguistik", 0.6, COLOR_BRAND_PURPLE), 
            ("Fokus", 0.88, COLOR_SUCCESS), 
            ("Memori", 0.72, COLOR_BRAND_BLUE)
        ]
        
        bar_w = 60 * scale
        gap = 160 * scale
        start_x = 120 * scale
        
        for i, (label, val, color) in enumerate(data):
            x0 = start_x + (i * gap)
            bh = val * 180 * scale
            y0 = base_h - bh - (20 * scale)
            y1 = base_h - (20 * scale)
            
            # Draw Bar Gradient using a mask for rounded corners
            bar_img = Image.new('RGBA', (bar_w, int(bh)), (0, 0, 0, 0))
            bar_draw = ImageDraw.Draw(bar_img)
            
            # Top rounded rectangle mask
            mask = Image.new('L', (bar_w, int(bh)), 0)
            mask_draw = ImageDraw.Draw(mask)
            radius = 12 * scale
            mask_draw.rounded_rectangle([0, 0, bar_w, int(bh) + radius], radius=radius, fill=255)
            
            top_color = self._hex_to_rgb(color)
            bottom_color = self._lighten_color(top_color, 0.4)
            
            for y in range(int(bh)):
                ratio = y / bh
                r = int(top_color[0] + (bottom_color[0] - top_color[0]) * ratio)
                g = int(top_color[1] + (bottom_color[1] - top_color[1]) * ratio)
                b = int(top_color[2] + (bottom_color[2] - top_color[2]) * ratio)
                bar_draw.line([(0, y), (bar_w, y)], fill=(r, g, b, 255))
            
            img.paste(bar_img, (x0, int(y0)), mask)
            
            # Percentage Label (Above bar - LARGER)
            draw.text((x0 + bar_w/2, y0 - 20*scale), f"{int(val*100)}%", fill=COLOR_TEXT_DARK, anchor="ms", font=font_perc)
            
            # Bottom Label (LARGER)
            draw.text((x0 + bar_w/2, y1 + 30*scale), label, fill=COLOR_TEXT_SUB, anchor="mt", font=font_label)

        # Convert to CTkImage
        ctk_img = ctk.CTkImage(light_image=img, dark_image=img, size=(1000, 320))
        self.cog_chart_label.configure(image=ctk_img)

    def _hex_to_rgb(self, hex_str):
        hex_str = hex_str.lstrip('#')
        return tuple(int(hex_str[i:i+2], 16) for i in (0, 2, 4))

    def _lighten_color(self, rgb, factor):
        return tuple(int(c + (255 - c) * factor) for c in rgb)
