import customtkinter as ctk

# Konfigurasi Tema (Identik dengan Visual Branding PANDAI)
ctk.set_appearance_mode("Dark")
ctk.set_default_color_theme("dark-blue")

class NeuroClientApp(ctk.CTk):
    def __init__(self):
        super().__init__()

        # Setup Window Utama
        self.title("PANDAI Neuro-Client - Guardian System")
        self.geometry("1024x720")
        self.configure(fg_color="#0F172A") # Latar belakang Slate Dark yang tidak menyilaukan mata

        # Konfigurasi Grid Layout Utama (2 Baris, 2 Kolom)
        self.grid_rowconfigure(0, weight=1)
        self.grid_columnconfigure(1, weight=1)

        self.setup_sidebar()
        self.setup_main_view()
        self.setup_status_bar()

    def setup_sidebar(self):
        # 1. SIDEBAR (Navigasi Kiri)
        self.sidebar_frame = ctk.CTkFrame(self, width=200, corner_radius=0, fg_color="#1E293B")
        self.sidebar_frame.grid(row=0, column=0, sticky="nsew")
        self.sidebar_frame.grid_rowconfigure(4, weight=1) # Spacer ke bawah

        # Logo Text
        self.logo_label = ctk.CTkLabel(self.sidebar_frame, text="PANDAI\nNeuro-Client", font=ctk.CTkFont(family="Inter", size=20, weight="bold"))
        self.logo_label.grid(row=0, column=0, padx=20, pady=(30, 30))

        # Tombol Navigasi (Dengan efek warna Indigo/Purple PANDAI)
        self.btn_dashboard = ctk.CTkButton(self.sidebar_frame, text="Dashboard Utama", fg_color="#0041C9", hover_color="#A241FF")
        self.btn_dashboard.grid(row=1, column=0, padx=20, pady=10)

        self.btn_sensors = ctk.CTkButton(self.sidebar_frame, text="Kalibrasi Sensor", fg_color="transparent", border_width=1, text_color="#DCE4EE")
        self.btn_sensors.grid(row=2, column=0, padx=20, pady=10)

    def setup_main_view(self):
        # 2. MAIN DASHBOARD (Area Monitoring Kanan)
        self.main_frame = ctk.CTkFrame(self, corner_radius=15, fg_color="transparent")
        self.main_frame.grid(row=0, column=1, padx=20, pady=20, sticky="nsew")
        self.main_frame.grid_columnconfigure((0, 1), weight=1)

        # Header Title
        self.header_label = ctk.CTkLabel(self.main_frame, text="Biometric Nerve Center", font=ctk.CTkFont(family="Inter", size=28, weight="bold"))
        self.header_label.grid(row=0, column=0, columnspan=2, padx=10, pady=(0, 20), sticky="w")

        # Kartu GSR (Tingkat Stres)
        self.gsr_card = ctk.CTkFrame(self.main_frame, corner_radius=15, fg_color="#1E293B")
        self.gsr_card.grid(row=1, column=0, padx=10, pady=10, sticky="nsew")
        ctk.CTkLabel(self.gsr_card, text="Tingkat Stres (GSR)", font=ctk.CTkFont(size=16)).pack(pady=(20,5))
        self.gsr_val = ctk.CTkLabel(self.gsr_card, text="Normal", font=ctk.CTkFont(size=32, weight="bold"), text_color="#10B981") # Hijau
        self.gsr_val.pack(pady=(0,20))

        # Kartu HRV (Kelelahan Kognitif)
        self.hrv_card = ctk.CTkFrame(self.main_frame, corner_radius=15, fg_color="#1E293B")
        self.hrv_card.grid(row=1, column=1, padx=10, pady=10, sticky="nsew")
        ctk.CTkLabel(self.hrv_card, text="Fokus Kognitif (HRV)", font=ctk.CTkFont(size=16)).pack(pady=(20,5))
        self.hrv_val = ctk.CTkLabel(self.hrv_card, text="Optimal", font=ctk.CTkFont(size=32, weight="bold"), text_color="#A241FF") # Ungu
        self.hrv_val.pack(pady=(0,20))

        # Jendela Kamera & Tracking Mata
        self.cam_card = ctk.CTkFrame(self.main_frame, corner_radius=15, fg_color="#1E293B", height=300)
        self.cam_card.grid(row=2, column=0, columnspan=2, padx=10, pady=20, sticky="nsew")
        self.cam_card.grid_propagate(False)
        ctk.CTkLabel(self.cam_card, text="[ Jendela Kamera Traking Mata (EAR) Akan Muncul Di Sini ]", text_color="gray").place(relx=0.5, rely=0.5, anchor="center")

    def setup_status_bar(self):
        # 3. BOTTOM STATUS BAR (Indikator Alat)
        self.status_frame = ctk.CTkFrame(self, height=35, corner_radius=0, fg_color="#0B1120")
        self.status_frame.grid(row=1, column=0, columnspan=2, sticky="nsew")
        self.status_label = ctk.CTkLabel(self.status_frame, text="🟢 ESP32: Connected   |   🟡 tDCS: Standby   |   🔵 AI: Syncing", font=ctk.CTkFont(size=12))
        self.status_label.pack(side="left", padx=20, pady=5)

if __name__ == "__main__":
    app = NeuroClientApp()
    app.mainloop()
