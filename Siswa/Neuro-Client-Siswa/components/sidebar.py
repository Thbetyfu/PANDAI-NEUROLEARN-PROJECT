import customtkinter as ctk
import os
from .logo import PandaiFullLogo
from .navigation import NavButton

class SidebarFrame(ctk.CTkFrame):
    def __init__(self, master, select_page_callback, **kwargs):
        super().__init__(master, width=273, corner_radius=0, fg_color="#F8F8F8", border_width=1, border_color="#E4E4E4", **kwargs)
        self.grid_propagate(False)
        self.select_page_callback = select_page_callback
        self.nav_items = {}

        # 1. App Logo (Top Area)
        self.logo_panel = ctk.CTkFrame(self, height=80, corner_radius=0, fg_color="#FFFFFF")
        self.logo_panel.pack(fill="x", side="top")
        self.logo_panel.pack_propagate(False)

        self.logo = PandaiFullLogo(self.logo_panel, height=32)
        self.logo.place(relx=0.5, rely=0.5, anchor="center")

        # 2. Navigation (Frame 23)
        self.nav_frame = ctk.CTkFrame(self, fg_color="#F8F8F8", corner_radius=0)
        self.nav_frame.pack(fill="both", expand=True, pady=18)

        nav_config = [
            ("Beranda", "Menu Icon.svg"),
            ("Statistik Anda", "chart-square.svg"),
            ("Profil Anda", "profile-2user.svg"),
            ("Debug", "neuro-headset.svg")
        ]

        for name, svg in nav_config:
            self.create_nav_button(name, svg)

        # 3. Footer / Logout (Account Area)
        self.footer_frame = ctk.CTkFrame(self, fg_color="#F8F8F8", height=112)
        self.footer_frame.pack(fill="x", side="bottom")

        self.btn_logout = ctk.CTkButton(
            self.footer_frame,
            text="Log-Out",
            anchor="center",
            fg_color="#FFFFFF",
            text_color="#000000",
            font=ctk.CTkFont(family="Inter", size=18, weight="bold"),
            border_width=1,
            border_color="#E4E4E4",
            width=241,
            height=60,
            corner_radius=12,
            hover_color="#F1F1F1",
            command=master.quit if hasattr(master, "quit") else None
        )
        self.btn_logout.pack(pady=(20, 32))

    def create_nav_button(self, name, svg):
        btn = NavButton(
            self.nav_frame,
            name=name,
            svg_filename=svg,
            command=lambda n=name: self.select_page_callback(n)
        )
        btn.pack(fill="x", padx=16, pady=4)
        self.nav_items[name] = btn

    def update_active_nav(self, active_name):
        for name, btn in self.nav_items.items():
            btn.set_active(name == active_name)
