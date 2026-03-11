"""
PANDAI Neuro-Client Overlay HUD
================================
Floating Always-On-Top panel that appears when the client is active.
Contains: Logo, Flow Score, tDCS Status, AI Insight strip.
Also spawns a Camera PiP widget in the bottom-right corner.

Safety: Camera access includes graceful fallback if unavailable.
"""
import customtkinter as ctk
import tkinter as tk
from PIL import Image, ImageDraw, ImageFont, ImageOps
import os
import math

from components.logo import load_svg_as_pil

# --- PANDAI HUD DESIGN TOKENS ---
COLOR_WHITE = "#FFFFFF"
COLOR_BORDER = "#E2E8F0"
COLOR_BORDER_LIGHT = "#F1F5F9"
COLOR_TEXT_DARK = "#0F172A"
COLOR_TEXT_DIM = "#94A3B8"
COLOR_SUCCESS = "#10B981"
COLOR_BLUE = "#2563EB"
COLOR_BLUE_LIGHT = "#3B82F6"
COLOR_PURPLE = "#9333EA"
COLOR_PURPLE_BG = "#FAF5FF"
COLOR_BRAND_PURPLE = "#7C3AED"

FONT_INTER = "Inter"


class FloatingHUD(tk.Toplevel):
    """
    Premium floating pill-shaped HUD bar.
    CSS Spec: width: 896px, height: 62px, border-radius: 9999px, bg: #FFFFFF
    Always on top, centered horizontally at the top of the screen.
    """

    def __init__(self, master: ctk.CTk | None = None, **kwargs):
        super().__init__(master)

        # --- Window Properties (Frameless, Always On Top) ---
        self.overrideredirect(True)
        self.attributes("-topmost", True)
        # Windows transparency: use a chroma key color
        _TRANSPARENT_COLOR = "#FF00FF"
        self.configure(bg=_TRANSPARENT_COLOR)
        self.attributes("-transparentcolor", _TRANSPARENT_COLOR)

        self.hud_width = 896
        self.hud_height = 62

        # Center horizontally at the top of the screen
        screen_w = self.winfo_screenwidth()
        x = (screen_w - self.hud_width) // 2
        y = 10  # 10px from top edge
        self.geometry(f"{self.hud_width}x{self.hud_height}+{x}+{y}")

        # Allow dragging
        self._drag_x = 0
        self._drag_y = 0

        # Assets directory
        self.assets_dir = os.path.join(
            os.path.dirname(os.path.dirname(__file__)), "assets"
        )

        # Build the HUD
        self._build_hud()

    def _build_hud(self):
        """Construct the pill-shaped HUD bar."""
        # Main pill container
        self.pill = ctk.CTkFrame(
            self,
            fg_color=COLOR_WHITE,
            corner_radius=31,  # 9999px -> half of height for pill
            border_width=1,
            border_color=COLOR_BORDER,
            width=self.hud_width,
            height=self.hud_height,
        )
        self.pill.pack(fill="both", expand=True)
        self.pill.pack_propagate(False)

        # Enable dragging on the pill
        self.pill.bind("<Button-1>", self._start_drag)
        self.pill.bind("<B1-Motion>", self._on_drag)

        # Inner content (horizontal row)
        content = ctk.CTkFrame(self.pill, fg_color="transparent")
        content.pack(fill="both", expand=True, padx=24, pady=10)

        # === SECTION 1: Logo + Brand ===
        brand_frame = ctk.CTkFrame(content, fg_color="transparent")
        brand_frame.pack(side="left")

        # Vertical divider after brand
        brand_inner = ctk.CTkFrame(brand_frame, fg_color="transparent")
        brand_inner.pack(side="left", padx=(0, 12))

        # PANDAI Logo (Emot)
        logo_path = os.path.join(self.assets_dir, "Logo PANDAI Emot.svg")
        if os.path.exists(logo_path):
            logo_pil = load_svg_as_pil(logo_path, width=34, height=28)
            logo_ctk = ctk.CTkImage(
                light_image=logo_pil, dark_image=logo_pil, size=(34, 28)
            )
            ctk.CTkLabel(brand_inner, image=logo_ctk, text="").pack(side="left")

        # Brand text stack
        brand_text = ctk.CTkFrame(brand_inner, fg_color="transparent")
        brand_text.pack(side="left", padx=(8, 0))

        ctk.CTkLabel(
            brand_text,
            text="PANDAI",
            font=ctk.CTkFont(family=FONT_INTER, size=14, weight="bold"),
            text_color=COLOR_TEXT_DARK,
        ).pack(anchor="w")

        ctk.CTkLabel(
            brand_text,
            text="CLIENT ACTIVE",
            font=ctk.CTkFont(family=FONT_INTER, size=10, weight="bold"),
            text_color=COLOR_TEXT_DIM,
        ).pack(anchor="w")

        # Vertical Divider
        ctk.CTkFrame(brand_frame, width=1, height=32, fg_color=COLOR_BORDER_LIGHT).pack(
            side="left"
        )

        # === SECTION 2: Flow Score ===
        flow_frame = ctk.CTkFrame(content, fg_color="transparent")
        flow_frame.pack(side="left", padx=(16, 0))

        # Circular Score Ring (PIL rendered)
        self.flow_score_label = ctk.CTkLabel(flow_frame, text="", fg_color="transparent")
        self.flow_score_label.pack(side="left")
        self._render_flow_score(75)

        # Flow Score Text
        flow_text = ctk.CTkFrame(flow_frame, fg_color="transparent")
        flow_text.pack(side="left", padx=(8, 0))

        ctk.CTkLabel(
            flow_text,
            text="Flow Score",
            font=ctk.CTkFont(family=FONT_INTER, size=12, weight="bold"),
            text_color=COLOR_TEXT_DARK,
        ).pack(anchor="w")

        ctk.CTkLabel(
            flow_text,
            text="Optimal",
            font=ctk.CTkFont(family=FONT_INTER, size=10, weight="bold"),
            text_color=COLOR_SUCCESS,
        ).pack(anchor="w")

        # Vertical Divider
        ctk.CTkFrame(content, width=1, height=32, fg_color=COLOR_BORDER_LIGHT).pack(
            side="left", padx=(16, 0)
        )

        # === SECTION 3: tDCS ACTIVE Button ===
        tdcs_frame = ctk.CTkFrame(content, fg_color="transparent")
        tdcs_frame.pack(side="left", padx=(16, 0))

        tdcs_btn = ctk.CTkButton(
            tdcs_frame,
            text="⚡ TDCS ACTIVE",
            fg_color=COLOR_BLUE,
            text_color=COLOR_WHITE,
            corner_radius=9999,
            height=29,
            font=ctk.CTkFont(family=FONT_INTER, size=11, weight="bold"),
            hover_color="#1D4ED8",
        )
        tdcs_btn.pack(side="left")

        # Vertical Divider
        ctk.CTkFrame(content, width=1, height=32, fg_color=COLOR_BORDER_LIGHT).pack(
            side="left", padx=(16, 0)
        )

        # === SECTION 4: AI Insight Strip ===
        insight_frame = ctk.CTkFrame(content, fg_color="transparent")
        insight_frame.pack(side="left", fill="x", expand=True, padx=(16, 0))

        # Purple icon box
        insight_icon_box = ctk.CTkFrame(
            insight_frame, width=32, height=32, corner_radius=8, fg_color=COLOR_PURPLE_BG
        )
        insight_icon_box.pack(side="left")
        insight_icon_box.pack_propagate(False)

        ctk.CTkLabel(
            insight_icon_box,
            text="🧠",
            font=ctk.CTkFont(size=14),
        ).place(relx=0.5, rely=0.5, anchor="center")

        # Insight text
        ctk.CTkLabel(
            insight_frame,
            text="Insight: Attention dipping... recommended to rest in 5 minutes",
            font=ctk.CTkFont(family=FONT_INTER, size=12, weight="bold"),
            text_color=COLOR_PURPLE,
        ).pack(side="left", padx=(8, 0))

        # Chevron down arrow
        ctk.CTkLabel(
            insight_frame,
            text="▾",
            font=ctk.CTkFont(size=14),
            text_color=COLOR_TEXT_DIM,
        ).pack(side="right")

    def _render_flow_score(self, score: int):
        """Render a circular flow score indicator using PIL."""
        size = 40
        scale = 3
        s = size * scale
        img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
        draw = ImageDraw.Draw(img)

        # Background circle (track)
        line_w = 3 * scale
        bbox = [line_w, line_w, s - line_w, s - line_w]
        draw.arc(bbox, start=0, end=360, fill=COLOR_BORDER_LIGHT, width=line_w)

        # Progress arc (blue)
        angle = int((score / 100) * 360)
        draw.arc(bbox, start=-90, end=-90 + angle, fill=COLOR_BLUE_LIGHT, width=line_w)

        # Center text
        try:
            font = ImageFont.truetype("arial.ttf", 11 * scale)
        except Exception:
            font = ImageFont.load_default()

        text = str(score)
        text_bbox = draw.textbbox((0, 0), text, font=font)
        tw = text_bbox[2] - text_bbox[0]
        th = text_bbox[3] - text_bbox[1]
        draw.text(
            ((s - tw) / 2, (s - th) / 2 - 2 * scale),
            text,
            fill=COLOR_TEXT_DARK,
            font=font,
        )

        ctk_img = ctk.CTkImage(light_image=img, dark_image=img, size=(size, size))
        self.flow_score_label.configure(image=ctk_img)
        self._flow_img = ctk_img  # prevent GC

    # --- Drag Functionality ---
    def _start_drag(self, event):
        self._drag_x = event.x
        self._drag_y = event.y

    def _on_drag(self, event):
        x = self.winfo_x() + event.x - self._drag_x
        y = self.winfo_y() + event.y - self._drag_y
        self.geometry(f"+{x}+{y}")

    def update_flow_score(self, score: int):
        """Public API to update the flow score dynamically."""
        self._render_flow_score(score)

    def update_insight(self, text: str):
        """Public API to update the insight text dynamically."""
        # Find the insight label and update it
        for widget in self.pill.winfo_children():
            if isinstance(widget, ctk.CTkLabel) and "Insight" in str(
                widget.cget("text")
            ):
                widget.configure(text=text)


class CameraWidget(tk.Toplevel):
    """
    Floating Picture-in-Picture camera widget.
    Placed at the bottom-right corner of the screen.
    Shows webcam feed for student monitoring.
    Safety: Graceful fallback if camera is unavailable.
    """

    def __init__(self, master: ctk.CTk | None = None, **kwargs):
        super().__init__(master)

        # Frameless, Always On Top
        self.overrideredirect(True)
        self.attributes("-topmost", True)
        self.configure(bg="white")

        self.cam_width = 220
        self.cam_height = 200

        # Position: bottom-right
        screen_w = self.winfo_screenwidth()
        screen_h = self.winfo_screenheight()
        x = screen_w - self.cam_width - 20
        y = screen_h - self.cam_height - 60  # Above taskbar
        self.geometry(f"{self.cam_width}x{self.cam_height}+{x}+{y}")

        # Drag support
        self._drag_x = 0
        self._drag_y = 0

        # Camera state
        self.cap = None
        self.is_running = False

        self._build_widget()
        self._start_camera()

    def _build_widget(self):
        """Build the camera PiP widget UI."""
        # Outer card
        self.card = ctk.CTkFrame(
            self,
            fg_color=COLOR_WHITE,
            corner_radius=16,
            border_width=1,
            border_color=COLOR_BORDER,
        )
        self.card.pack(fill="both", expand=True)

        # Header bar
        header = ctk.CTkFrame(self.card, fg_color="transparent", height=32)
        header.pack(fill="x", padx=12, pady=(8, 0))
        header.pack_propagate(False)

        ctk.CTkLabel(
            header,
            text="Cam",
            font=ctk.CTkFont(family=FONT_INTER, size=14, weight="bold"),
            text_color=COLOR_TEXT_DARK,
        ).pack(side="left")

        # Minimize button
        min_btn = ctk.CTkButton(
            header,
            text="—",
            fg_color="transparent",
            text_color=COLOR_TEXT_DIM,
            width=24,
            height=24,
            hover_color=COLOR_BORDER_LIGHT,
            corner_radius=6,
            font=ctk.CTkFont(size=14, weight="bold"),
            command=self._toggle_minimize,
        )
        min_btn.pack(side="right")

        # Drag support on header
        header.bind("<Button-1>", self._start_drag)
        header.bind("<B1-Motion>", self._on_drag)

        # Camera display area
        self.cam_label = ctk.CTkLabel(
            self.card,
            text="📷 Menghubungkan kamera...",
            font=ctk.CTkFont(family=FONT_INTER, size=11),
            text_color=COLOR_TEXT_DIM,
            fg_color="#F8FAFC",
            corner_radius=12,
        )
        self.cam_label.pack(fill="both", expand=True, padx=8, pady=8)

        self._minimized = False

    def _start_camera(self):
        """Initialize webcam capture with safety fallback."""
        try:
            import cv2

            self.cap = cv2.VideoCapture(0)
            if self.cap.isOpened():
                self.is_running = True
                self._update_frame()
            else:
                self.cam_label.configure(text="⚠️ Kamera tidak tersedia")
        except ImportError:
            self.cam_label.configure(text="📷 OpenCV belum terinstall\npip install opencv-python")
        except Exception as e:
            self.cam_label.configure(text=f"⚠️ Error: {str(e)[:30]}")

    def _update_frame(self):
        """Capture and display webcam frame."""
        if not self.is_running or self.cap is None:
            return
        if self._minimized:
            self.after(500, self._update_frame)
            return

        try:
            import cv2

            ret, frame = self.cap.read()
            if ret:
                # Convert BGR to RGB
                frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                frame = cv2.resize(frame, (200, 140))

                pil_img = Image.fromarray(frame)
                ctk_img = ctk.CTkImage(
                    light_image=pil_img, dark_image=pil_img, size=(200, 140)
                )
                self.cam_label.configure(image=ctk_img, text="")
                self._cam_img = ctk_img  # prevent GC
        except Exception:
            pass

        # ~15 FPS
        self.after(66, self._update_frame)

    def _toggle_minimize(self):
        """Toggle camera widget minimize state."""
        self._minimized = not self._minimized
        if self._minimized:
            self.geometry(f"{self.cam_width}x40")
            self.cam_label.pack_forget()
        else:
            self.geometry(f"{self.cam_width}x{self.cam_height}")
            self.cam_label.pack(fill="both", expand=True, padx=8, pady=8)
            if self.is_running:
                self._update_frame()

    def _start_drag(self, event):
        self._drag_x = event.x
        self._drag_y = event.y

    def _on_drag(self, event):
        x = self.winfo_x() + event.x - self._drag_x
        y = self.winfo_y() + event.y - self._drag_y
        self.geometry(f"+{x}+{y}")

    def destroy(self):
        """Cleanup camera resource on destroy."""
        self.is_running = False
        if self.cap is not None:
            self.cap.release()
        super().destroy()
