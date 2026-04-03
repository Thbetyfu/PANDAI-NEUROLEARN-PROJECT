import customtkinter as ctk

class HeaderFrame(ctk.CTkFrame):
    def __init__(self, master, title="Beranda", **kwargs):
        # Frame 22: height: 80px, background: #FFFFFF, border: 1px solid #E4E4E4
        super().__init__(master, height=80, corner_radius=0, fg_color="#FFFFFF", border_width=1, border_color="#E4E4E4", **kwargs)
        self.grid_propagate(False)

        # 1. Page Title (Beranda)
        # CSS Spec: Inter, 500 weight (Medium), 24px size, color: #000000
        # Padding matches: 25px 31px
        self.title_label = ctk.CTkLabel(
            self, text=title,
            font=ctk.CTkFont(family="Inter", size=24, weight="normal"),
            text_color="#000000",
            width=86, # CSS SPEC: width: 86px
            height=29, # CSS SPEC: height: 29px
            anchor="w"
        )
        # pack with side="left", padx=31 (CSS left padding), pady=25 (CSS top padding)
        self.title_label.pack(side="left", padx=31, pady=(25, 26), anchor="nw")

        # 2. Status Badge (Neuro-Bridge Live) - Keeping this as requested in previous steps for functionality
        self.status_badge = ctk.CTkFrame(self, fg_color="#FFFFFF", corner_radius=12, border_width=0)
        self.status_badge.pack(side="right", padx=40)

        # Pulse indicator (Green)
        self.pulse = ctk.CTkLabel(self.status_badge, text="●", text_color="#00C853", font=ctk.CTkFont(size=14))
        self.pulse.pack(side="left", padx=(12, 4))

        self.status_text = ctk.CTkLabel(
            self.status_badge, text="Neuro-Bridge Live", 
            font=ctk.CTkFont(family="Inter", size=12, weight="bold"), 
            text_color="#64748B"
        )
        self.status_text.pack(side="left", padx=(0, 12), pady=6)

    def set_title(self, new_title):
        if self.title_label and self.title_label.winfo_exists():
            try:
                self.title_label.configure(text=new_title)
            except: pass
