import customtkinter as ctk
import tkinter as tk
from datetime import datetime
import math
import random
from PIL import Image, ImageDraw

# --- PANDAI INTEGRATED DESIGN SYSTEM ---
COLOR_BG = "#F8FAFC"
COLOR_WHITE = "#FFFFFF"
COLOR_BRAND_BLUE = "#330DF2"
COLOR_TEXT_DARK = "#0F172A"
COLOR_TEXT_SUB = "#64748B"
COLOR_BORDER = "#F1F5F9"
COLOR_SUCCESS = "#10B981"
COLOR_WARNING = "#F59E0B"
COLOR_DANGER = "#EF4444"

FONT_INTER = "Inter"
FONT_MONO = "Consolas"

class DebugDisplayPage(ctk.CTkFrame):
    def __init__(self, master, **kwargs):
        super().__init__(master, corner_radius=0, fg_color=COLOR_BG, **kwargs)
        
        # 1. Main Scrollable Container
        self.scroll_frame = ctk.CTkScrollableFrame(self, fg_color="transparent", corner_radius=0)
        self.scroll_frame.place(relx=0, rely=0, relwidth=1, relheight=1)

        # Content Internal Frame
        self.inner = ctk.CTkFrame(self.scroll_frame, fg_color="transparent")
        self.inner.pack(fill="both", expand=True, padx=40, pady=40)

        # Header Area
        self.setup_header()
        
        # Content Grid
        self.grid_container = ctk.CTkFrame(self.inner, fg_color="transparent")
        self.grid_container.pack(fill="both", expand=True)
        self.grid_container.grid_columnconfigure((0, 1), weight=1)

        # Section 1: Network & IoT (White Card)
        self.setup_status_panel(self.grid_container, "Network & IoT Matrix", 0, 0)
        
        # Section 2: Biometric Stream (White Card)
        self.setup_stream_panel(self.grid_container, "Live Neural Stream", 0, 1)

        # Section 3: Hardware Control (White Card)
        self.setup_hardware_panel(self.grid_container, "Hardware Stimulator Control", 1, 0)

        # Section 4: Master Logs (Dark Technical Card)
        self.setup_log_panel(self.grid_container, "Master System Logs", 1, 1)

    def setup_header(self):
        header_container = ctk.CTkFrame(self.inner, fg_color="transparent")
        header_container.pack(fill="x", pady=(0, 40))

        ctk.CTkLabel(
            header_container, 
            text="System Debug Control", 
            font=ctk.CTkFont(family=FONT_INTER, size=32, weight="bold"),
            text_color=COLOR_TEXT_DARK
        ).pack(anchor="w")

        sub = ctk.CTkFrame(header_container, fg_color="transparent")
        sub.pack(anchor="w", pady=(8, 0))
        
        # Pulsing Live Indicator
        self.live_dot = ctk.CTkFrame(sub, width=8, height=8, corner_radius=999, fg_color=COLOR_SUCCESS)
        self.live_dot.pack(side="left", padx=(0, 8), pady=8)
        
        ctk.CTkLabel(
            sub, text="REAL-TIME DIAGNOSTIC ACTIVE", 
            font=ctk.CTkFont(family=FONT_INTER, size=14, weight="bold"),
            text_color=COLOR_BRAND_BLUE
        ).pack(side="left")

    def setup_status_panel(self, parent, title, r, c):
        f = ctk.CTkFrame(parent, fg_color=COLOR_WHITE, corner_radius=16, border_width=1, border_color=COLOR_BORDER)
        f.grid(row=r, column=c, padx=12, pady=12, sticky="nsew")
        
        ctk.CTkLabel(f, text=title, font=ctk.CTkFont(family=FONT_INTER, size=16, weight="bold"), text_color=COLOR_TEXT_DARK).pack(pady=24, padx=24, anchor="w")
        
        indicators = [
            ("MQTT Broker", "CONNECTED", COLOR_SUCCESS),
            ("ESP32 Master", "STABLE", COLOR_SUCCESS),
            ("AI Inference", "LATENCY 42ms", COLOR_BRAND_BLUE),
            ("Health Sync", "ONLINE", COLOR_SUCCESS)
        ]
        
        for label, status, color in indicators:
            row = ctk.CTkFrame(f, fg_color="transparent")
            row.pack(fill="x", padx=24, pady=8)
            ctk.CTkLabel(row, text=label, font=ctk.CTkFont(family=FONT_INTER, size=14), text_color=COLOR_TEXT_SUB).pack(side="left")
            
            badge = ctk.CTkFrame(row, fg_color="#F8FAFC", corner_radius=4)
            badge.pack(side="right")
            ctk.CTkFrame(badge, width=6, height=6, corner_radius=3, fg_color=color).pack(side="left", padx=(8, 4), pady=10)
            ctk.CTkLabel(badge, text=status, font=ctk.CTkFont(family=FONT_INTER, size=12, weight="bold"), text_color=color).pack(side="left", padx=(0, 8))

    def setup_stream_panel(self, parent, title, r, c):
        f = ctk.CTkFrame(parent, fg_color=COLOR_WHITE, corner_radius=16, border_width=1, border_color=COLOR_BORDER)
        f.grid(row=r, column=c, padx=12, pady=12, sticky="nsew")
        
        ctk.CTkLabel(f, text=title, font=ctk.CTkFont(family=FONT_INTER, size=16, weight="bold"), text_color=COLOR_TEXT_DARK).pack(pady=24, padx=24, anchor="w")
        
        # Simulating a small wave canvas
        canvas = tk.Canvas(f, height=120, bg="#FBFBFF", highlightthickness=0)
        canvas.pack(fill="x", padx=24, pady=(0, 20))
        
        # Draw a small decorative wave
        w, h = 400, 120
        pts = []
        for x in range(0, w, 10):
            y = 60 + 20 * math.sin(x * 0.05)
            pts.append((x, y))
        canvas.create_line(pts, fill=COLOR_BRAND_BLUE, width=2, smooth=True)

    def setup_hardware_panel(self, parent, title, r, c):
        f = ctk.CTkFrame(parent, fg_color=COLOR_WHITE, corner_radius=16, border_width=1, border_color=COLOR_BORDER)
        f.grid(row=r, column=c, padx=12, pady=12, sticky="nsew")
        
        ctk.CTkLabel(f, text=title, font=ctk.CTkFont(family=FONT_INTER, size=16, weight="bold"), text_color=COLOR_TEXT_DARK).pack(pady=24, padx=24, anchor="w")
        
        # Stimulator Value
        val_box = ctk.CTkFrame(f, fg_color="#F5F3FF", corner_radius=12)
        val_box.pack(fill="x", padx=24, pady=(0, 20))
        ctk.CTkLabel(val_box, text="Current Output", font=ctk.CTkFont(family=FONT_INTER, size=12), text_color=COLOR_BRAND_BLUE).pack(padx=16, pady=(12, 0), anchor="w")
        ctk.CTkLabel(val_box, text="2.5 mA", font=ctk.CTkFont(family=FONT_INTER, size=24, weight="bold"), text_color=COLOR_BRAND_BLUE).pack(padx=16, pady=(0, 12), anchor="w")

        btn_container = ctk.CTkFrame(f, fg_color="transparent")
        btn_container.pack(fill="x", padx=24, pady=(0, 24))
        
        ctk.CTkButton(
            btn_container, text="CALIBRATE", fg_color=COLOR_BRAND_BLUE, 
            corner_radius=8, font=ctk.CTkFont(weight="bold"), height=40
        ).pack(side="left", expand=True, padx=(0, 8))
        
        ctk.CTkButton(
            btn_container, text="HALT SYSTEM", fg_color="transparent", 
            border_width=1, border_color=COLOR_DANGER, text_color=COLOR_DANGER,
            corner_radius=8, font=ctk.CTkFont(weight="bold"), height=40
        ).pack(side="left", expand=True, padx=(8, 0))

    def setup_log_panel(self, parent, title, r, c):
        f = ctk.CTkFrame(parent, fg_color="#0F172A", corner_radius=16) # Keeping logs dark for legibility
        f.grid(row=r, column=c, padx=12, pady=12, sticky="nsew")
        
        ctk.CTkLabel(f, text=title, font=ctk.CTkFont(family=FONT_INTER, size=16, weight="bold"), text_color=COLOR_WHITE).pack(pady=24, padx=24, anchor="w")
        
        log_box = ctk.CTkTextbox(f, height=200, fg_color="transparent", text_color=COLOR_SUCCESS, font=ctk.CTkFont(family=FONT_MONO, size=12))
        log_box.pack(fill="both", expand=True, padx=24, pady=(0, 24))
        
        # Sample technical logs
        log_box.insert("end", "[INFO] System initialized...\n")
        log_box.insert("end", "[MQTT] Subscribed to topic: neuro/raw\n")
        log_box.insert("end", "[HARD] ESP32 Handshake (v1.2) OK\n")
        log_box.insert("end", "[AI] Inference engine warming up...\n")
        log_box.configure(state="disabled")
