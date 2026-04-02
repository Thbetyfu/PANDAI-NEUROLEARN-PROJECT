import customtkinter as ctk
import os
import tkinter as tk
import sys

from core.exceptions import PandaiCriticalError, VisionCriticalError, HardwareCriticalError, CloudCriticalError
from core.integrity_manager import IntegrityManager
import config

# Import Components
from components.sidebar import SidebarFrame
from components.header import HeaderFrame

# Import Pages
from pages.beranda import BerandaPage
from pages.statistik_anda import StatistikPage
from pages.profil_anda import ProfilPage
from pages.debug_display import DebugDisplayPage

# Import Core Systems
from network.mqtt_client import MQTTClient
from network.serial_client import SerialClient
from ai.ollama_client import LocalAIClient
from core.decision_engine import DecisionEngine
from sensors.vision_engine import VisionEngine

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

        # 1. Initialize Managers
        self.integrity_manager = None
        self.security_token = False
        self.selected_camera_index = 0 # Default camera

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
            "Statistik Anda": StatistikPage(self.view_container, engine=None), # Will be set after init_core
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

        # 7. INIT BACKGROUND SYSTEMS
        try:
            self.init_core_systems()
            # A. PRE-STARTUP INTEGRITY GUARD
            self.run_integrity_check()
            self.security_token = True
            print("[Security] 🛡️ Integrity Check Passed. Security Token Issued.")
            self.select_page("Beranda") 
        except PandaiCriticalError as e:
             self.show_panic_screen(f"Alasan: {e.message} (Kode: {e.code})", error_code=e.code)
             return
        except Exception as e: 
             self.show_panic_screen(f"Terjadi kesalahan sistem saat inisialisasi: {e}", error_code="SYS_ERR")
             return

        # Final Status
        print("="*60)
        print("  Core Systems: INITIALIZED & ONLINE")
        print("="*60)

    def run_integrity_check(self):
        """Standardized Health Check via IntegrityManager [E01-E03]."""
        # Menggunakan Static Method sesuai saran Audit (Pola Stateless Audit)
        IntegrityManager.perform_boot_check(self.vision, self.serial, self.mqtt)

    def show_panic_screen(self, message, error_code=None):
        """Halaman UI 'Panic' yang menutupi seluruh layar jika terjadi Dosa Besar."""
        panic_overlay = ctk.CTkFrame(self, fg_color="#1E293B" if error_code == "E01" else "#F43F5E", corner_radius=0)
        panic_overlay.place(relx=0, rely=0, relwidth=1, relheight=1)
        panic_overlay.lift()

        # Disable all background interaction
        self.sidebar.nav_frame.grid_remove() # Hilangkan menu navigasi
        
        container = ctk.CTkFrame(panic_overlay, fg_color="transparent")
        container.place(relx=0.5, rely=0.5, anchor="center")

        title = "🔍 KONFIGURASI KAMERA" if error_code == "E01" else "🚨 SYSTEM PANIC 🚨"
        ctk.CTkLabel(container, text=title, font=ctk.CTkFont(size=40, weight="bold"), text_color="white").pack(pady=20)
        
        # Error Content
        error_box = ctk.CTkFrame(container, fg_color="#334155" if error_code == "E01" else "#991B1B", corner_radius=16)
        error_box.pack(pady=20, padx=20, fill="both")
        
        ctk.CTkLabel(error_box, text=message, font=ctk.CTkFont(size=18), text_color="white", wraplength=500, justify="center", padx=30, pady=30).pack()

        # --- CAMERA PICKER (Show only if E01) ---
        if error_code == "E01":
            ctk.CTkLabel(container, text="Pilih kamera yang tersedia di bawah ini:", font=ctk.CTkFont(weight="bold"), text_color="white").pack(pady=(20, 10))
            
            # Mendeteksi kamera
            available_cameras = VisionEngine.list_available_cameras()
            options = [f"Kamera {i}" for i in available_cameras] if available_cameras else ["Tidak Ada Kamera Terdeteksi"]
            
            self.cam_dropdown = ctk.CTkOptionMenu(
                container, values=options, 
                width=300, height=45, fg_color="#475569", 
                button_color="#64748B", dropdown_fg_color="#334155",
                command=self._on_camera_selected
            )
            self.cam_dropdown.pack(pady=10)
            
            btn_retry = ctk.CTkButton(
                container, text="Mulai Ulang Dengan Kamera Ini", 
                fg_color="#10B981", text_color="white", hover_color="#059669",
                height=50, width=300, font=ctk.CTkFont(weight="bold"),
                command=lambda: self._restart_system_with_camera()
            )
            btn_retry.pack(pady=30)
        else:
            btn_fix = ctk.CTkButton(
                container, text="Keluar & Periksa Kabel", 
                fg_color="white", text_color="#F43F5E", hover_color="#F1F5F9",
                height=50, font=ctk.CTkFont(weight="bold"),
                command=self.on_closing
            )
            btn_fix.pack(pady=40)

    def _on_camera_selected(self, choice):
        """Set index berdasarkan pilihan dropdown."""
        try:
            self.selected_camera_index = int(choice.split(" ")[1])
            print(f"[UI] Kamera {self.selected_camera_index} dipilih.")
        except:
            pass

    def _restart_system_with_camera(self):
        """Mematikan semua sistem lama (jika ada) dan mulai ulang core."""
        print(f"[RESTART] Mencoba booting ulang dengan Kamera {self.selected_camera_index}...")
        # Cleanup
        if hasattr(self, 'vision') and self.vision:
             self.vision.stop()
        if hasattr(self, 'engine'):
             self.engine.stop()

        # Restart
        try:
            self.init_core_systems(camera_index=self.selected_camera_index)
            self.run_integrity_check()
            self.security_token = True
            
            # Hapus overlay panic if success
            for child in self.winfo_children():
                if isinstance(child, ctk.CTkFrame) and child.cget("fg_color") in ["#1E293B", "#F43F5E"]:
                    child.destroy()
            
            self.sidebar.nav_frame.grid() # Kembalikan sidebar
            self.select_page("Beranda")
            print("[Security] 🛡️ Lockdown Diangkat. Kamera Terhubung.")
        except PandaiCriticalError as e:
            # Tetap di panic screen dengan pesan baru
            print(f"[RESTART] Gagal: {e.message}")
            self.show_panic_screen(f"Gagal Hubungkan: {e.message} (Kode: {e.code})", error_code=e.code)
        except Exception as e:
            self.show_panic_screen(f"Fatal Error: {e}", error_code="SYS_ERR")

    def init_core_systems(self, camera_index=None):
        print("="*60)
        print("  PANDAI NEUROLEARN 2.0 — Core Systems Startup")
        print("="*60)

        # Gunakan index yang dipassing atau default
        cam_idx = camera_index if camera_index is not None else self.selected_camera_index

        # 1. MQTT (The Bridge to Dashboard)
        self.mqtt = MQTTClient(broker_host=config.MQTT_BROKER, broker_port=config.MQTT_PORT)
        self.mqtt.connect()
        # Give a small time for MQTT connect
        time.sleep(0.5)

        # 2. Serial Client (The Bridge to ESP32)
        # Unified SerialClient secara otomatis menangani MOCK/REAL via config
        self.serial = SerialClient(port="COM3") 

        # 3. Vision Engine (The Eyes — EAR via Kamera)
        self.vision = VisionEngine(camera_index=cam_idx)
        self.vision.start()

        # 4. Local AI (Ollama)
        try:
            self.ai_client = LocalAIClient(host="localhost", port=11434, model="gemma2:2b")
        except:
             self.ai_client = None

        # 5. Decision Engine (The Brain — Amigdala Shield)
        self.engine = DecisionEngine(
            mqtt_client=self.mqtt,
            serial_client=self.serial if (self.serial and self.serial.connected) else None,
            ai_client=self.ai_client,
            vision_engine=self.vision,
            mode="hybrid",
        )
        self.engine.start()

        # Inject engine and start update loop
        if "Statistik Anda" in self.pages:
            self.pages["Statistik Anda"].engine = self.engine
            self.pages["Statistik Anda"].update_realtime()
        
        if "Beranda" in self.pages:
            self.pages["Beranda"].engine = self.engine

    def on_closing(self):
        print("Tutup app, mematikan semua sistem...")
        # Ensure overlay from Beranda is cleaned up
        if hasattr(self, 'pages') and 'Beranda' in self.pages:
            beranda = self.pages['Beranda']
            if hasattr(beranda, '_destroy_overlay'):
                beranda._destroy_overlay()
        if hasattr(self, 'engine'):
            self.engine.stop()
        if hasattr(self, 'vision') and self.vision:
            self.vision.stop()
        if hasattr(self, 'serial'):
            self.serial.disconnect()
        if hasattr(self, 'mqtt'):
            self.mqtt.disconnect()
        self.destroy()

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
