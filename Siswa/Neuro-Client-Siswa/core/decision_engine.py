import time
import random
import threading
from datetime import datetime

class DecisionEngine:
    def __init__(self, mqtt_client=None, ai_client=None):
        self.mqtt_client = mqtt_client
        self.ai_client = ai_client
        
        self.running = False
        self.session_id = f"SESS-{datetime.now().strftime('%Y%m%d%H%M%S')}"
        
        # State Internal
        self.current_state = "FLOW"
        
        # Biometrik Simulasi
        self.current_ear = 0.35
        self.current_gsr = 0.30
        self.current_hrv = 60.0 # RMSSD mst
        self.cognitive_load = 40.0
        
        # Hardware Status Simulasi
        self.tdcs_ma = 0.0
        self.lamp_intensity = 50
        self.impedance = 15000
        
    def start_simulation(self):
        print("[Engine] Memulai Simulasi Amigdala Shield...")
        self.running = True
        
        # Mulai thread simulasi loop
        self.sim_thread = threading.Thread(target=self._run_loop, daemon=True)
        self.sim_thread.start()
        
    def stop(self):
        print("[Engine] Menghentikan Engine.")
        self.running = False
        
    def _run_loop(self):
        while self.running:
            # 1. Update nilai simulasi (berfluktuasi sedikit)
            self._simulate_fluctuations()
            
            # 2. Confusion Pinpointing Logic & Amigdala Shield
            self._evaluate_state()
            
            # 3. Kirim via MQTT (agar Dashboard dapat data)
            self._publish_data()
            
            # Loop setiap 2 detik
            time.sleep(2)
            
    def _simulate_fluctuations(self):
        # Angka acak ± 5%
        self.current_ear = max(0.1, min(0.5, self.current_ear + random.uniform(-0.02, 0.02)))
        self.current_hrv = max(10, min(100, self.current_hrv + random.uniform(-2, 2)))
        self.current_gsr = max(0.1, min(1.0, self.current_gsr + random.uniform(-0.01, 0.01)))
        
        # Sesekali buat siswa ngantuk atau stress parah
        if random.random() < 0.05: # 5% chance
            self.current_ear -= 0.1 # Tiba-tiba EAR drop (ngantuk/merem)
            print(f"[Sim] ⚠️ Siswa mulai mengantuk. EAR drop ke {self.current_ear:.2f}")
            
    def _evaluate_state(self):
        """Inti dari Amigdala Shield Protocol"""
        
        # Cek EAR (Eye Aspect Ratio): < 0.22 artinya mengantuk/merem
        if self.current_ear < 0.22:
            if self.current_state != "AWAKE_INTERVENTION":
                print(f"[Shield] 🔴 AMIGDALA ALERT: EAR rendah ({self.current_ear:.2f}). Mengaktifkan AWAKE_INTERVENTION!")
                self.current_state = "AWAKE_INTERVENTION"
                
                # Intervensi: Tingkatkan lampu
                self.lamp_intensity = 100
                if self.mqtt_client:
                    self.mqtt_client.client.publish("pandai/v1/actuator/light", f"#FFFFFF|100")
                
                # Panggil AI suggestion
                self._trigger_ai("Siswa mulai kehilangan kesadaran visual (mengantuk).")
                
        # Cek HRV RMSSD: < 20ms artinya Cognitive Fatigue
        elif self.current_hrv < 20:
             if self.current_state != "FATIGUE":
                print(f"[Shield] 🔴 AMIGDALA ALERT: HRV sangat rendah ({self.current_hrv:.1f}ms). Kemungkinan FATIGUE.")
                self.current_state = "FATIGUE"
                self.tdcs_ma = 0.0 # Hentikan stimulasi jika fatigue parah
                if self.mqtt_client:
                    self.mqtt_client.send_emergency_off()
                    
                self._trigger_ai("Siswa mengalami kelelahan kognitif parah.")
                
        # Cek Impedansi (Hardware Limit) - Simulasi Tiba-tiba elektroda lepas
        elif self.impedance > 50000:
             print(f"[Shield] 🚨 IMPEDANSI TINGGI ({self.impedance} ohm). HARD CUT-OFF!")
             if self.mqtt_client:
                    self.mqtt_client.send_emergency_off()
             self.running = False # Hentikan simulasi juga karena darurat hardware
        # Kondisi Normal/Flow
        else:
            if self.current_state != "FLOW":
                print(f"[Shield] 🟢 Kembali ke zona FLOW. EAR: {self.current_ear:.2f}, HRV: {self.current_hrv:.1f}")
                self.current_state = "FLOW"
                self.lamp_intensity = 50
                if self.mqtt_client:
                     self.mqtt_client.client.publish("pandai/v1/actuator/light", f"#E0F7FA|50")
                
    def _publish_data(self):
        if not self.mqtt_client or not self.mqtt_client.connected:
            return
            
        metrics = {
             "gsr_microsiemens": round(self.current_gsr, 2),
             "hrv_rmssd_ms": round(self.current_hrv, 1),
             "ear_score": round(self.current_ear, 2),
             "cognitive_load": round(self.cognitive_load, 1)
        }
        
        hardware = {
             "tdcs_output_ma": self.tdcs_ma,
             "lamp_intensity": self.lamp_intensity,
             "skin_impedance_ohm": self.impedance,
             "battery_level": 95
        }
        
        self.mqtt_client.publish_processed_bio(self.session_id, metrics, hardware)
        # print(f"[Engine] Data terkirim ke MQTT. State: {self.current_state}")
        
    def _trigger_ai(self, context):
        """Minta saran dari Ollama secara asinkron"""
        if self.ai_client:
            print(f"[Engine] Meminta saran AI lokal untuk: {context}")
            # Jalankan di background agar tidak memblokir loop
            threading.Thread(target=self._fetch_and_print_ai, args=(context,), daemon=True).start()
        else:
            print(f"[Bot] Saran Otomatis: Istirahat sejenak 5 menit.")
            
    def _fetch_and_print_ai(self, context):
        try:
             saran = self.ai_client.get_suggestion(context)
             print(f"\n🧠 [PANDAI AI Core]: {saran}\n")
        except Exception as e:
             print(f"[AI Error] Timeout: {e}")
