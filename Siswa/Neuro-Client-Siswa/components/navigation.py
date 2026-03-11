import customtkinter as ctk
from PIL import Image
import os
import io
from .logo import load_svg_as_pil

class NavButton(ctk.CTkFrame):
    def __init__(self, master, name, svg_filename, command=None, **kwargs):
        super().__init__(master, fg_color="transparent", height=50, corner_radius=12, **kwargs)
        self.name = name
        self.svg_filename = svg_filename
        self.command = command
        self.is_active = False
        self.assets_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "assets")
        
        # UI Elements
        self.btn_label = ctk.CTkLabel(
            self, 
            text=f"   {self.name}", 
            font=ctk.CTkFont(family="Inter", size=16, weight="bold"),
            anchor="w",
            height=50,
            padx=20,
            compound="left",
            corner_radius=11
        )
        self.btn_label.pack(fill="both", expand=True)

        self.btn_label.bind("<Button-1>", lambda e: self.on_click())
        self.btn_label.bind("<Enter>", lambda e: self.on_hover(True))
        self.btn_label.bind("<Leave>", lambda e: self.on_hover(False))

        self.refresh_state()

    def set_active(self, active):
        self.is_active = active
        self.refresh_state()

    def on_click(self):
        if self.command:
            self.command()

    def on_hover(self, hover):
        if not self.is_active:
            if hover:
                self.btn_label.configure(fg_color="#F1F1F1")
            else:
                self.btn_label.configure(fg_color="transparent")

    def refresh_state(self):
        path = os.path.join(self.assets_dir, self.svg_filename)
        if not os.path.exists(path):
            print(f"Warning: SVG not found {path}")
            return

        # 1. Read and modify SVG color
        with open(path, "r") as f:
            svg_data = f.read()
        
        target_color = "#A241FF" if self.is_active else "#292D32"
        # The icons use stroke="black", fill="#292D32" or variations. 
        # We replace both to be safe.
        modified_svg = svg_data.replace('stroke="black"', f'stroke="{target_color}"')
        modified_svg = modified_svg.replace('fill="#292D32"', f'fill="{target_color}"')
        modified_svg = modified_svg.replace('stroke="#292D32"', f'stroke="{target_color}"')
        modified_svg = modified_svg.replace('fill="black"', f'fill="{target_color}"')
        modified_svg = modified_svg.replace('fill="none"', 'fill="none"') # Guard

        # 2. Render using resvg (via helper in logo.py)
        # Optimized: Internal 3x boost handles sharpness. Target is 24x24 display.
        pil_img = load_svg_as_pil(None, width=24, height=24, svg_data=modified_svg)
        
        # 3. Apply to CTkImage
        ctk_img = ctk.CTkImage(light_image=pil_img, dark_image=pil_img, size=(24, 24))
        
        if self.is_active:
            self.btn_label.configure(
                image=ctk_img,
                fg_color="#FFFFFF",
                text_color="#A241FF"
            )
            # Match CSS: background #FFFFFF, border 1px solid #E4E4E4, radius 12px
            self.configure(fg_color="#FFFFFF", border_width=1, border_color="#E4E4E4")
        else:
            self.btn_label.configure(
                image=ctk_img,
                fg_color="transparent",
                text_color="#000000"
            )
            self.configure(fg_color="transparent", border_width=0)
