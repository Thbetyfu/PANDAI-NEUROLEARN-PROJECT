import time
import threading
import os
import sys
import tkinter as tk
import customtkinter as ctk

# Import Core Logics
from core.exceptions import PandaiCriticalError, VisionCriticalError, HardwareCriticalError, CloudCriticalError
from core.integrity_manager import IntegrityManager
import config

# Import Components & Pages
from components.sidebar import SidebarFrame
from components.header import HeaderFrame
from pages.beranda import BerandaPage
from pages.statistik_anda import StatistikPage
from pages.profil_anda import ProfilPage
from pages.debug_display import DebugDisplayPage

# Import Networking & Sensors
from network.mqtt_client import MQTTClient
from network.serial_client import SerialClient
from ai.ollama_client import LocalAIClient
from core.decision_engine import DecisionEngine
from sensors.vision_engine import VisionEngine

# Debug Check: Verify standard libraries
print(f"[BOOT] Initializing Neuro-Client Core (Time Module: {time}, OS: {os.name})")

# Konfigurasi Desain
COLOR_APP_BG = "#F8F8F8"
COLOR_SIDEBAR_BG = "#F8F8F8"

class NeuroClientApp(ctk.CTk):
    def __init__(self):
        super().__init__()

        # Window Config
        self.title("PANDAI Neuro-Client 2.0")
        self.geometry("1440x1024")
        self.configure(fg_color=COLOR_APP_BG)

        # [STRICT FOCUS] SET CPU PRIORITY TO HIGH
        # Memastikan Windows memberikan resource maksimal ke Neuro-Client
        import psutil
        try:
            p = psutil.Process(os.getpid())
            p.nice(psutil.HIGH_PRIORITY_CLASS)
            print("[STRICT] 🚀 CPU Priority Set to HIGH.")
        except Exception as e:
            print(f"[STRICT] ⚠️ Gagal mengatur prioritas CPU: {e}")

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

        # 2. MAIN CONTENT AREA (The Body)
        # Parent: self (The App), Column: 1
        self.main_container = ctk.CTkFrame(self, fg_color="#F8FAFC", corner_radius=0)
        self.main_container.grid(row=0, column=1, sticky="nsew")
        self.main_container.grid_rowconfigure(1, weight=1) # View Container area
        self.main_container.grid_columnconfigure(0, weight=1)
        
        # [V11] Force early geometry for Aura calculation
        self.update_idletasks()

        # 3. HEADER & VIEW CONTAINER (Children of Main Container)
        self.header = HeaderFrame(self.main_container)
        self.header.grid(row=0, column=0, sticky="ew")

        self.view_container = ctk.CTkFrame(self.main_container, fg_color="transparent", corner_radius=0)
        self.view_container.grid(row=1, column=0, sticky="nsew")
        self.view_container.grid_rowconfigure(0, weight=1)
        self.view_container.grid_columnconfigure(0, weight=1)

        # 4. AURA BACKGROUND
        self.generate_and_place_aura()

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

        # 6. RESPONSIVE & LIFECYCLE BINDING
        self._last_width = 0
        self._last_height = 0
        self.bind("<Configure>", self.on_window_resize)
        # [V9] NEW: UCD LIFECYCLE MANAGEMENT (Fix E05 minimization lock)
        self.bind("<Map>", self.on_window_restore)
        self.bind("<Unmap>", self.on_window_minimize)

        # 7. DEFERRED CORE STARTUP (UCD: Solusi Anti White-Screen)
        # Kami membiarkan jendela UI digambar terlebih dahulu agar siswa tidak panik melihat layar putih.
        self.header.set_title("Menyiapkan PANDAI Engine...")
        self.after(200, self._start_background_init)

        # 8. RUNTIME HEALTH MONITOR
        self.check_runtime_health()

    def check_runtime_health(self):
        """Monitor berkala untuk menangkap error dari engine (Background Thread)."""
        if hasattr(self, 'engine') and self.engine and self.engine.engine_error:
            err = self.engine.engine_error
            print(f"[UI] 🚨 MENANGKAP ERROR RUNTIME DARI ENGINE: {err}")
            self.show_panic_screen(f"Terjadi Gangguan Sistem Saat Sesi Berlangsung:\n\n{err.message}\n\n(Kode: {err.code})", error_code=err.code)
            return # Hentikan monitor jika sudah panic
            
        # Terus monitor tiap 2 detik
        self.after(2000, self.check_runtime_health)

    def _start_background_init(self):
        """Memindahkan proses I/O berat (MQTT/Kamera) ke background thread agar UI tetap mulus."""
        print("[BOOT] 🚄 Starting Background Bootstrap Worker...")
        threading.Thread(target=self._background_init_worker, daemon=True).start()

    def _background_init_worker(self):
        """Pekerja yang merakit komponen mesin di belakang layar (Threaded)."""
        try:
            # 1. Inisialisasi Hardware & Engine
            self.init_core_systems()
            
            # 2. Jalankan Integrity Guard (E01-E03)
            print("[GUARD] 🛡️ Menjalankan Pemeriksaan Integritas Sistem...")
            self.run_integrity_check()
            
            # 3. Jika berhasil, pindahkan kembali ke UI thread untuk membuka Dashboard
            self.after(0, self._on_boot_success)
            
        except PandaiCriticalError as e:
            self.after(0, lambda: self.show_panic_screen(f"Alasan: {e.message} (Kode: {e.code})", error_code=e.code))
        except Exception as e:
            print(f"[FATAL] Startup Error: {e}")
            self.after(0, lambda: self.show_panic_screen(f"Terjadi kesalahan sistem saat inisialisasi: {e}", error_code="SYS_ERR"))

    def _on_boot_success(self):
        self.security_token = True
        print("[Security] 🛡️ Integrity Check Passed. Moving to Dashboard.")
        
        # [NEW-V15] INJEKSI ENGINE KE UI SECARA AMAN (Wajib di Main Thread)
        if hasattr(self, 'engine') and self.engine:
            if "Statistik Anda" in self.pages:
                self.pages["Statistik Anda"].engine = self.engine
                self.pages["Statistik Anda"].update_realtime()
            if "Beranda" in self.pages:
                self.pages["Beranda"].engine = self.engine

        # [V11] FORCE UI REFRESH
        self.update_idletasks()
        self.generate_and_place_aura()
        
        self.select_page("Beranda")

    def run_integrity_check(self):
        """Standardized Health Check via IntegrityManager [E01-E03]."""
        IntegrityManager.perform_boot_check(self.vision, self.serial, self.mqtt)

    def show_panic_screen(self, message, error_code=None):
        """Halaman UI 'Panic' yang menutupi seluruh layar jika terjadi Dosa Besar."""
        # Theme: E01/E05/E03 = Sidebar configuration style, ELSE = Critical Alert style
        is_recoverable = error_code in ["E01", "E05", "E03"]
        bg_color = "#0F172A" if is_recoverable else "#991B1B"
        
        panic_overlay = ctk.CTkFrame(self, fg_color=bg_color, corner_radius=0)
        panic_overlay.place(relx=0, rely=0, relwidth=1, relheight=1)
        
        # Disable background interaction
        self.sidebar.nav_frame.grid_remove()
        
        container = ctk.CTkFrame(panic_overlay, fg_color="transparent")
        container.place(relx=0.5, rely=0.5, anchor="center")

        # Icons based on error
        icon = "📷" if error_code in ["E01", "E05"] else ("☁️" if error_code == "E03" else "🚨")
        ctk.CTkLabel(container, text=icon, font=ctk.CTkFont(size=64)).pack(pady=(0, 20))

        title = "KONFIGURASI KAMERA" if error_code in ["E01", "E05"] else ("HUBUNGKAN CLOUD" if error_code == "E03" else "GANGGUAN SISTEM")
        ctk.CTkLabel(container, text=title, font=ctk.CTkFont(family="Space Grotesk", size=42, weight="bold"), text_color="white").pack(pady=10)
        
        error_box = ctk.CTkFrame(container, fg_color="#1E293B", corner_radius=24, border_width=1, border_color="#334155")
        error_box.pack(pady=20, padx=20, fill="both")

        ctk.CTkLabel(error_box, text=message, font=ctk.CTkFont(family="Inter", size=18), 
                     text_color="#CBD5E1", wraplength=600, justify="center", padx=40, pady=40).pack()

        # --- RECOVERY ZONE ---
        recovery_zone = ctk.CTkFrame(container, fg_color="transparent")
        recovery_zone.pack(pady=20, fill="x")

        # Camera Picker (Only for E01 or E05)
        if error_code in ["E01", "E05"]:
            ctk.CTkLabel(recovery_zone, text="Pilih kamera lain yang tersedia:", 
                         font=ctk.CTkFont(family="Inter", size=14, weight="bold"), text_color="white").pack(pady=(10, 5))
            
            available = VisionEngine.list_available_cameras()
            options = [f"Kamera {i}" for i in available] if available else ["Tidak Ada Kamera Terdeteksi"]
            
            self.cam_dropdown = ctk.CTkOptionMenu(
                recovery_zone, values=options, 
                width=340, height=48, fg_color="#334155", 
                button_color="#475569", dropdown_fg_color="#0F172A",
                corner_radius=12,
                command=self._on_camera_selected
            )
            self.cam_dropdown.pack(pady=10)
            
            btn_row = ctk.CTkFrame(recovery_zone, fg_color="transparent")
            btn_row.pack(pady=20)

            ctk.CTkButton(btn_row, text="🔄 COBA LAGI SEKARANG", 
                          fg_color="#4F46E5", text_color="white", hover_color="#4338CA",
                          height=56, width=280, font=ctk.CTkFont(size=16, weight="bold"),
                          corner_radius=16,
                          command=self._restart_system_with_camera).pack(side="left", padx=10)
        
        elif error_code == "E03":
            ctk.CTkButton(recovery_zone, text="🌐 HUBUNGKAN ULANG CLOUD", 
                          fg_color="#10B981", text_color="white", hover_color="#059669",
                          height=56, width=320, font=ctk.CTkFont(size=16, weight="bold"),
                          corner_radius=16,
                          command=self._restart_system_with_camera).pack(pady=10)
            
            ctk.CTkButton(recovery_zone, text="❌ KELUAR", fg_color="transparent", text_color="#94A3B8",
                          command=self.quit).pack(pady=10)
        else:
            ctk.CTkButton(recovery_zone, text="❌ KELUAR APLIKASI", fg_color="#F43F5E", hover_color="#E11D48",
                          height=50, width=240, font=ctk.CTkFont(weight="bold"), corner_radius=12,
                          command=self.quit).pack()

        # Footer Tips
        ctk.CTkLabel(container, text="Tips: Pastikan kamera tidak sedang digunakan oleh Zoom, Teams, atau Browser.", 
                     font=ctk.CTkFont(family="Inter", size=13), text_color="#94A3B8").pack(pady=20)

    def _on_camera_selected(self, choice):
        """Set index berdasarkan pilihan dropdown."""
        try:
            self.selected_camera_index = int(choice.split(" ")[1])
            print(f"[UI] Kamera {self.selected_camera_index} dipilih.")
        except:
            pass

    def _restart_system_with_camera(self):
        """Membangkitkan kembali sistem dari layar Panic (Non-blocking)."""
        print(f"[RESTART] 🔄 Mencoba booting ulang dengan Kamera {self.selected_camera_index}...")
        
        # Cleanup
        if hasattr(self, 'vision') and self.vision:
             self.vision.stop()
        if hasattr(self, 'engine'):
             self.engine.stop()

        try:
            # 1. Re-Init Hardware
            self.init_core_systems(camera_index=self.selected_camera_index)
            
            # 2. Async Integrity Check [V10]
            print("[RESTART] ⏳ Memulihkan koneksi kamera & cloud di background...")
            import threading
            threading.Thread(target=self._async_boot_guard, daemon=True).start()
            
        except Exception as e:
            print(f"[RESTART] Fatal: {e}")
            self.show_panic_screen(f"Gagal Pemulihan: {e}", error_code="SYS_FAIL")

    def _on_boot_success(self):
        self.security_token = True
        print("[Security] 🛡️ Lockdown Diangkat. Pindah ke Dashboard.")
        
        # Hapus overlay panic if success (Recursively cleanup)
        for child in self.winfo_children():
            # Check for CTkFrame overlays starting with default naming
            if isinstance(child, ctk.CTkFrame) and "!ctkframe" in child.winfo_name().lower():
                  child.destroy()
        
        # Ensure Sidebar is visible
        self.sidebar.nav_frame.grid()
        self.select_page("Beranda")

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

        # 2. Serial Client (The Bridge to ESP32) — [NON-AKTIF / COMMENTED]
        """
        CATATAN PENGEMBANG (BIOMETRIC HARDWARE):
        Jika headset biometrik sudah ada, uncomment baris bawah dan pastikan 
        port COM3 sesuai atau gunakan detektor port otomatis.
        """
        self.serial = None
        # self.serial = SerialClient(port="COM3") 

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

        # [V15] Hapus injeksi UI dari sini. 
        # Injeksi dipindah ke _on_boot_success untuk menghindari Threading Error CustomTkinter.
        pass

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

    def on_window_minimize(self, event):
        """[STRICT-V9] Suspend monitoring saat di-minimize."""
        # [V14] Filter: Hanya proses jika widget utama yang di-minimize, bukan sub-widget
        if event.widget == self and hasattr(self, "engine") and self.engine:
            print("[Lifecycle] 📉 Window Minimized. Suspending Watchdog...")
            self.engine.is_suspended = True

    def on_window_restore(self, event):
        """[STRICT-V9] Resume monitoring saat diaktifkan kembali."""
        # [V14] Filter: Hanya proses jika widget utama yang di-map
        if event.widget == self and hasattr(self, "engine") and self.engine:
            print("[Lifecycle] 📈 Window Restored. Resuming Watchdog...")
            # [STRICT] Force heartbeat reset agar tidak kadaluarsa
            if self.vision:
                self.vision.last_update_tick = time.time()
            self.engine.is_suspended = False

    def on_window_resize(self, event):
        """Handle dynamic background scaling and layout adjustments."""
        # [V14] Filter: Hanya trigger jika windows utama yang berganti ukuran
        if event.widget == self and (event.width != self._last_width or event.height != self._last_height):
             # Ignore very small values (minimize transitions)
             if event.width > 200 and event.height > 200:
                 self._last_width = event.width
                 self._last_height = event.height
                 self.generate_and_place_aura()

    def _handle_camera_reset(self, overlay_to_remove):
        """Mencoba menghidupkan kembali kamera yang beku/freeze."""
        print("[UI] 🔄 Mencoba memulihkan kamera...")
        try:
            # 1. Stop Loop & Engine
            if hasattr(self, 'engine'):
                self.engine.running = False
                if self.engine.vision:
                    self.engine.vision.stop()
                    
            # 2. Reset Status & Error
            self.engine.engine_error = None
            self.engine.running = True
            
            # 3. Re-start Vision (Background Thread)
            if self.engine.vision:
                self.engine.vision.start()
            
            # 4. Re-start Engine Thread
            import threading
            self.engine_thread = threading.Thread(target=self.engine._run_loop, daemon=True)
            self.engine_thread.start()
            
            # 5. Kembalikan Sidebar & Hapus Overlay
            self.sidebar.nav_frame.grid()
            
            # Deep Cleanup of overlays in Pages (prevent duplicates)
            beranda = self.pages.get('Beranda')
            if beranda and hasattr(beranda, '_destroy_overlay'):
                beranda._destroy_overlay()
            
            if overlay_to_remove:
                overlay_to_remove.destroy()
            
            # 6. Lanjutkan Monitor Health
            self.check_runtime_health()
            
            print("[UI] ✅ Kamera berhasil di-reset.")
            
        except Exception as e:
            from tkinter import messagebox
            messagebox.showerror("Gagal Reset", f"Kamera gagal dipulihkan: {e}")

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
        
        # [V10] Safety Check: Ensure parent container exists and window is not minimized
        if not self.main_container.winfo_exists() or self.state() == "iconic":
            return

        # Convert to CTkImage
        self.aura_img = ctk.CTkImage(light_image=gradient, dark_image=gradient, size=(cw, ch))
        
        try:
            # Safety Check: Ensure widget still exists before configuring
            if not hasattr(self, "aura_label") or not self.aura_label.winfo_exists():
                self.aura_label = ctk.CTkLabel(self.main_container, image=self.aura_img, text="", fg_color="transparent")
                self.aura_label.place(x=0, y=80)
                self.aura_label.lower()
            else:
                self.aura_label.configure(image=self.aura_img)
        except Exception as e:
            print(f"[UI] Aura Draw Skip: {e}") # Silently ignore during transitions

    def select_page(self, name):
        # Update Sidebar Nav UI
        if self.sidebar and self.sidebar.winfo_exists():
            self.sidebar.update_active_nav(name)
        
        # Update Header Title
        if self.header and self.header.winfo_exists():
            self.header.set_title(name)
        
        # Switch Page Visibility
        for n, page in self.pages.items():
            if not page.winfo_exists():
                 continue
                 
            if n == name:
                try:
                    page.grid()
                    # If scrollable, try to force transparency on internal canvas
                    if hasattr(page, "scroll_frame") and page.scroll_frame.winfo_exists():
                        page.scroll_frame.configure(fg_color="transparent")
                except:
                    pass
            else:
                try:
                    page.grid_remove()
                except:
                    pass

if __name__ == "__main__":
    ctk.set_appearance_mode("Light")
    app = NeuroClientApp()
    app.mainloop()
