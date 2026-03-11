import customtkinter as ctk
import os
import tkinter as tk

# Import Components
from components.sidebar import SidebarFrame
from components.header import HeaderFrame

# Import Pages
from pages.beranda import BerandaPage
from pages.statistik_anda import StatistikPage
from pages.profil_anda import ProfilPage
from pages.debug_display import DebugDisplayPage

# --- KONFIGURASI DESAIN PANDAI (FIGMA SPEC) ---
COLOR_APP_BG = "#F8F8F8"
COLOR_SIDEBAR_BG = "#F8F8F8"

class NeuroClientApp(ctk.CTk):
    def __init__(self):
        super().__init__()

        # Window Config
        self.title("PANDAI Neuro-Client 2.0")
        self.geometry("1440x1024")
        self.configure(fg_color=COLOR_APP_BG)

        # App State
        self.user_name = "Mozart"
        self.user_email = "mozart@pandai.id"

        # Main Layout
        self.grid_columnconfigure(0, weight=0, minsize=273)
        self.grid_columnconfigure(1, weight=1)
        self.grid_rowconfigure(0, weight=1)

        # 1. SIDEBAR Component
        self.sidebar = SidebarFrame(self, select_page_callback=self.select_page)
        self.sidebar.grid(row=0, column=0, sticky="nsew")

        # 2. MAIN CONTENT AREA
        self.main_container = ctk.CTkFrame(self, fg_color=COLOR_APP_BG, corner_radius=0)
        self.main_container.grid(row=0, column=1, sticky="nsew")
        self.main_container.grid_rowconfigure(1, weight=1)
        self.main_container.grid_columnconfigure(0, weight=1)

        # --- RECTANGLE 403: THE BLUE AURA (IMAGE-BASED FOR RELIABILITY) ---
        self.generate_and_place_aura()

        # 3. HEADER Component (80px height)
        self.header = HeaderFrame(self.main_container)
        self.header.grid(row=0, column=0, sticky="ew")

        # 4. VIEW CONTAINER (Switching Pages)
        self.view_container = ctk.CTkFrame(self.main_container, fg_color="transparent", corner_radius=0)
        self.view_container.grid(row=1, column=0, sticky="nsew")
        self.view_container.grid_columnconfigure(0, weight=1)
        self.view_container.grid_rowconfigure(0, weight=1)

        # 5. INITIALIZE PAGES
        self.pages = {
            "Beranda": BerandaPage(self.view_container),
            "Statistik Anda": StatistikPage(self.view_container),
            "Profil Anda": ProfilPage(self.view_container),
            "Debug": DebugDisplayPage(self.view_container)
        }

        for p in self.pages.values():
            p.grid(row=0, column=0, sticky="nsew")
            p.grid_remove()

        # Final Z-Index Check
        self.view_container.lift()
        self.header.lift()

        # 6. RESPONSIVE BINDING
        self._last_width = 0
        self._last_height = 0
        self.bind("<Configure>", self.on_window_resize)

        # Start with Beranda
        self.select_page("Beranda")

    def on_window_resize(self, event):
        """Handle dynamic background scaling and layout adjustments for TV/Laptop focus"""
        # Only trigger if dimensions actually changed (prevent recursion)
        if event.width != self._last_width or event.height != self._last_height:
            self._last_width = event.width
            self._last_height = event.height
            self.generate_and_place_aura()

    def generate_and_place_aura(self):
        """Generates a high-quality PIL gradient image adaptive to current window width"""
        from PIL import Image, ImageDraw
        
        # Get current container dimensions
        # If window just opened, width might be reported as 1
        cw = max(self.winfo_width(), 1440) 
        ch = 362 # Background height stays fixed at top area
        
        # Create gradient image that spans full current width
        gradient = Image.new('RGB', (cw, ch), "#F8F8F8")
        draw = ImageDraw.Draw(gradient)
        
        start_color = (123, 166, 255) # #7BA6FF
        end_color = (248, 248, 248)   # #F8F8F8
        
        for y in range(ch):
            r = int(start_color[0] + (end_color[0] - start_color[0]) * (y / ch))
            g = int(start_color[1] + (end_color[1] - start_color[1]) * (y / ch))
            b = int(start_color[2] + (end_color[2] - start_color[2]) * (y / ch))
            draw.line([(0, y), (cw, y)], fill=(r, g, b))
        
        # Convert to CTkImage
        self.aura_img = ctk.CTkImage(light_image=gradient, dark_image=gradient, size=(cw, ch))
        
        if not hasattr(self, "aura_label"):
            self.aura_label = ctk.CTkLabel(self.main_container, image=self.aura_img, text="", fg_color="transparent")
            self.aura_label.place(x=0, y=80)
            self.aura_label.lower()
        else:
            self.aura_label.configure(image=self.aura_img)

    def select_page(self, name):
        # Update Sidebar Nav UI
        self.sidebar.update_active_nav(name)
        
        # Update Header Title
        self.header.set_title(name)
        
        # Switch Page Visibility
        for n, page in self.pages.items():
            if n == name:
                page.grid()
                # If scrollable, try to force transparency on internal canvas
                try:
                    if hasattr(page, "scroll_frame"):
                        page.scroll_frame.configure(fg_color="transparent")
                except:
                    pass
            else:
                page.grid_remove()
        # Update Sidebar Nav UI
        self.sidebar.update_active_nav(name)
        
        # Update Header Title
        self.header.set_title(name)
        
        # Switch Page Visibility
        for n, page in self.pages.items():
            if n == name:
                page.grid()
            else:
                page.grid_remove()

if __name__ == "__main__":
    ctk.set_appearance_mode("Light")
    app = NeuroClientApp()
    app.mainloop()
