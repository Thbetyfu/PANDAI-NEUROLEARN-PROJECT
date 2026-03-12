import time
import threading
from datetime import datetime

class DecisionEngine:
    def __init__(self, mqtt_client=None, serial_client=None, ai_client=None, vision_engine=None, mode="hybrid"):
        self.mqtt_client = mqtt_client
        self.ai_client = ai_client
        self.serial = serial_client
        self.vision = vision_engine

        self.running = False
        self.session_id = f"SESS-{datetime.now().strftime('%Y%m%d%H%M%S')}"

        # State Internal
        self.current_state = "FLOW"

        # Biometrik Data
        self.current_ear = 0.5
        self.current_gsr = 0.30
        self.prev_gsr = 0.30
        self.current_hrv = 60.0
        self.cognitive_load = 40.0
        
        # Hardware Status
        self.tdcs_ma = 0.0
        self.lamp_intensity = 50
        self.impedance = 15000

    def start(self):
        print("[Engine] Mengaktifkan Operasi Otak Terpadu...")
        self.running = True
        if self.vision and not self.vision.is_running:
            self.vision.start()
        threading.Thread(target=self._run_loop, daemon=True).start()

    def start_simulation(self):
         self.start()

    def stop(self):
        self.running = False
        if self.vision:
             self.vision.stop()

    def _run_loop(self):
        while self.running:
            # 1. Update data dari Vision (kamera)
            if self.vision:
                 self.current_ear = self.vision.get_ear()

            # 2. Update data dari Serial (ESP32)
            if self.serial:
                 bio_data = self.serial.get_bio_data()
                 if bio_data:
                     self.prev_gsr = self.current_gsr
                     self.current_gsr = bio_data.get('gsr', self.current_gsr)
                     self.current_hrv = bio_data.get('hrv', self.current_hrv)
                     self.impedance = bio_data.get('imp', self.impedance)

            # 3. Decision Logic & Amigdala Shield
            self._evaluate_state()

            # 4. Kirim telemetry via MQTT
            self._publish_data()

            time.sleep(2) # Setiap 2 detik evaluasi ulang

    def _evaluate_state(self):
        # Prioritas Tertinggi: Impedansi (Safety)
        if self.impedance > 50000:
             print(f"[Shield] 🚨 IMPEDANSI TINGGI ({self.impedance} ohm). HARD CUT-OFF!")
             if self.serial:
                  self.serial.send_command("EMERGENCY_OFF", "")
             if self.mqtt_client and self.mqtt_client.connected:
                  self.mqtt_client.send_emergency_off()
             self.running = False
             return

        # Prioritas 1: GSR Spike Detection (Stres Tinggi) 
        if self.current_gsr > (self.prev_gsr * 1.15) and self.prev_gsr > 0:
            if self.current_state != "HIGH_STRESS":
                print(f"[Shield] 🔴 STRES TINGGI: GSR melonjak dari {self.prev_gsr} ke {self.current_gsr}")
                self.current_state = "HIGH_STRESS"
                self.tdcs_ma = 1.0
                if self.serial:
                     self.serial.send_command("SET_CURRENT", 1.0)
                self._trigger_ai("STRESS")

        # Prioritas 2: EAR (Mengantuk)
        elif self.current_ear < 0.22:
            if self.current_state != "AWAKE_INTERVENTION":
                print(f"[Shield] 🔴 AMIGDALA ALERT: EAR rendah ({self.current_ear}). MENGANTUK!")
                self.current_state = "AWAKE_INTERVENTION"
                self.lamp_intensity = 100
                if self.serial:
                     self.serial.send_command("SET_LIGHT", "#FFFFFF|100")
                if self.mqtt_client and self.mqtt_client.connected:
                     self.mqtt_client.client.publish("pandai/v1/actuator/light", "#FFFFFF|100")
                self._trigger_ai("DROWSY")

        # Prioritas 3: HRV (Fatigue)
        elif self.current_hrv < 20:
             if self.current_state != "FATIGUE":
                print(f"[Shield] 🔴 AMIGDALA ALERT: HRV kritis ({self.current_hrv}). FATIGUE!")
                self.current_state = "FATIGUE"
                self.tdcs_ma = 0.0
                if self.serial:
                     self.serial.send_command("EMERGENCY_OFF", "")
                if self.mqtt_client and self.mqtt_client.connected:
                     self.mqtt_client.send_emergency_off()
                self._trigger_ai("FATIGUE")

        # Prioritas 4: Normal / Flow
        else:
            if self.current_state != "FLOW":
                print(f"[Shield] 🟢 Kembali ke zona FLOW. EAR: {self.current_ear}, HRV: {self.current_hrv}")
                self.current_state = "FLOW"
                self.lamp_intensity = 50
                if self.serial:
                     self.serial.send_command("SET_LIGHT", "#E0F7FA|50")
                if self.mqtt_client and self.mqtt_client.connected:
                     self.mqtt_client.client.publish("pandai/v1/actuator/light", "#E0F7FA|50")
                self._trigger_ai("NORMAL")

    def _publish_data(self):
        if not self.mqtt_client or not self.mqtt_client.connected:
            return

        metrics = {
             "gsr_microsiemens": round(self.current_gsr, 2),
             "hrv_rmssd_ms": round(self.current_hrv, 1),
             "ear_score": round(self.current_ear, 2),
             "cognitive_load": round(self.cognitive_load, 1),
             "state": self.current_state
        }

        hardware = {
             "tdcs_output_ma": self.tdcs_ma,
             "lamp_intensity": self.lamp_intensity,
             "skin_impedance_ohm": self.impedance,
             "battery_level": 95
        }

        self.mqtt_client.publish_processed_bio(self.session_id, metrics, hardware)

    def _trigger_ai(self, condition):
        if self.ai_client:
            print(f"[Engine] Meminta instruksi AI untuk status: {condition}")
            threading.Thread(target=self._fetch_and_print_ai, args=(condition,), daemon=True).start()

    def _fetch_and_print_ai(self, condition):
        try:
             saran = self.ai_client.get_suggestion(condition=condition)
             print(f"\n🧠 [PANDAI AI Core]: {saran}\n")
        except Exception as e:
             pass
