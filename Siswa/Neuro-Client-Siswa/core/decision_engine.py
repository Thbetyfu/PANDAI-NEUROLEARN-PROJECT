import time
import threading
from datetime import datetime
from collections import deque

from .exceptions import PandaiCriticalError, VisionCriticalError, HardwareCriticalError, CloudCriticalError
from .integrity_manager import IntegrityManager
from .database_manager import DatabaseManager

class MovingAverage:
    def __init__(self, size=10):
        self.queue = deque(maxlen=size)
        
    def add(self, val):
        self.queue.append(val)
        
    def get(self, default=0):
        if not self.queue:
            return default
        return sum(self.queue) / len(self.queue)

class DecisionEngine:
    def __init__(self, mqtt_client=None, serial_client=None, ai_client=None, vision_engine=None, mode="hybrid"):
        self.mqtt_client = mqtt_client
        self.ai_client = ai_client
        self.vision = vision_engine
        
        # New: Persistence Layer (SQLite)
        self.db = DatabaseManager()
        
        # New: Integrity Manager for Safety Loop
        self.integrity = IntegrityManager(vision_engine, serial_client, mqtt_client)

        # Security & Integrity Status
        self.is_healthy = True
        self.error_message = ""
        
        self.running = False
        self.session_id = f"SESS-{datetime.now().strftime('%Y%m%d%H%M%S')}"

        # State & History
        self.current_state = "FLOW" # Kept from original, not explicitly removed by snippet
        self.ear_ma = MovingAverage(size=5)
        self.gsr_ma = MovingAverage(size=10)
        self.hrv_ma = MovingAverage(size=10)
        
        self.current_ear = 0.5
        self.current_gsr = 0.0
        self.current_hrv = 0.0
        self.current_hr = 0
        self.prev_gsr = 0.0
        self.impedance = 0
        self.cognitive_load = 40.0 # Kept from original, not explicitly removed by snippet
        self.tdcs_ma = 0.0 # Kept from original, not explicitly removed by snippet
        self.lamp_intensity = 50 # Kept from original, not explicitly removed by snippet

        # State Flags
        self.last_print_time = 0
        self.drowsy_frames_count = 0
        self.last_ai_trigger = 0
        self.ear_loss_timestamp = None 
        self.last_data_timestamp = time.time() # Watchdog: Data Freshness (Fast)
        self.last_audit_timestamp = time.time() # Integrity: System Audit (Slow)
        self.db_save_timer = 0 # Throttle DB write to 1fps

    def start(self):
        print(f"[Engine] 🧠 Neuro-Architect Protocol Berjalan (Sesi: {self.session_id})")
        self.running = True
        if self.vision and not self.vision.is_running:
            self.vision.start()
        threading.Thread(target=self._run_loop, daemon=True).start()

    def stop(self):
        self.running = False
        if self.vision:
             self.vision.stop()

    def _run_loop(self):
        while self.running:
            try:
                # 0. Runtime Integrity Check (Medical Safety Loop)
                self._check_runtime_integrity()

                # 1. Update data dari Vision (Eye Tracking)
                if self.vision:
                    raw_ear = self.vision.get_ear()
                    self.ear_ma.add(raw_ear)
                    self.current_ear = self.ear_ma.get(default=0.5)

                # 2. Update data dari Serial (Biometrics dari ESP32)
                if self.serial:
                    bio_data = self.serial.get_bio_data()
                    if bio_data:
                        # Raw Values
                        raw_gsr = bio_data.get('gsr', self.current_gsr)
                        raw_hrv = bio_data.get('hrv', self.current_hrv)
                        self.current_hr = bio_data.get('hr', self.current_hr)
                        self.impedance = bio_data.get('imp', self.impedance)
                        
                        # Processed Values (Moving Average untuk stabilitas)
                        self.gsr_ma.add(raw_gsr)
                        self.hrv_ma.add(raw_hrv)
                        
                        self.prev_gsr = self.current_gsr
                        self.current_gsr = self.gsr_ma.get()
                        self.current_hrv = self.hrv_ma.get()
                        self.last_data_timestamp = time.time() # Reset Watchdog Timer

                # 3. Intelligent State Evaluation (The Brain core)
                self._evaluate_cognitive_state()

                # 4. Telemetry (Fast response 10fps)
                self._publish_telemetry()

                # 5. Persistence (Slow log 1fps to save SD Card/Disk)
                self._handle_persistence()

            except PandaiCriticalError as e:
                print(f"[Engine] Runtime Critical Error: {e}")
                self._trigger_emergency(str(e))
                self.running = False
            except Exception as e:
                print(f"[Engine] Unexpected Loop Error: {e}")
                
            time.sleep(0.1)

    def _check_runtime_integrity(self):
        """Watchdog: Gabungan pengecekan data beku (Fast) & audit sistemik (Slow)."""
        now = time.time()
        
        # 1. Fast Watchdog: Deteksi sensor beku/tersenggol (> 3 detik)
        if (now - self.last_data_timestamp) > 3.0:
            raise HardwareCriticalError("E02", "WATCHDOG: Sensor biometrik berhenti merespon (Frozen).")

        # 2. Slow Systemic Audit: Audit kesehatan modul (tiap 5 detik)
        if (now - self.last_audit_timestamp) > 5.0:
            self.integrity.perform_full_audit()
            self.last_audit_timestamp = now

        try:
            # 3. Vision Granular Check (EAR Suicide)
            if self.vision:
                raw_ear = self.vision.get_ear()
                if raw_ear == 0.0 or raw_ear is None:
                    if self.ear_loss_timestamp is None:
                        self.ear_loss_timestamp = now
                    elif (now - self.ear_loss_timestamp) > 5.0:
                        raise VisionCriticalError("E01", "KONTROL VISI HILANG: Kamera tidak mendeteksi mata > 5 detik.")
                else:
                    self.ear_loss_timestamp = None
                    
        except VisionCriticalError as e:
             raise e
        except HardwareCriticalError as e:
             raise e
        except CloudCriticalError as e:
             raise e
        except PandaiCriticalError as e:
            self.is_healthy = False
            self.error_message = str(e)
            self._trigger_emergency(self.error_message)
            raise e

    def _evaluate_cognitive_state(self):
        """
        Multimodal Fusion Logic:
        Mengkombinasikan berbagai sensor untuk menentukan kondisi kognitif presisi.
        """
        now = time.time()
        should_print = (now - self.last_print_time) >= 1.5
        
        # --- A. AMIGDALA SHIELD (Safety Priority) ---
        # 1. Skin Impedance Safety
        if self.impedance > 50000:
             self._trigger_emergency("IMPEDANSI TINGGI")
             return

        # 2. Heart Rate Safety (README Spec: HR > 130 bpm)
        if self.current_hr > 130:
             self._trigger_emergency(f"HR KRITIS ({self.current_hr} BPM)")
             return

        # --- B. COGNITIVE CLASSIFICATION ---
        # 1. Detect CONFUSION (High Stress Spike + Dropping EAR)
        stress_spike = self.current_gsr > (self.gsr_ma.get() * 1.2)
        distracted = self.current_ear < 0.28
        
        if stress_spike and distracted:
            self._update_state("CONFUSION", 1.5, "#FFEB3B|80") # Yellow alert
            self._trigger_ai("CONFUSION")

        # 2. Detect FATIGUE (Low HRV + Low EAR)
        elif self.current_hrv < 30 and self.current_ear < 0.25:
            self.drowsy_frames_count += 1
            if self.drowsy_frames_count > 10: # ~1 detik konfirmasi
                self._update_state("FATIGUE", 0.0, "#FF5252|100") # Red alert - Cut tDCS
                self._trigger_ai("FATIGUE")
        
        # 3. Detect HIGH STRESS (Pure GSR Spike)
        elif stress_spike:
            self._update_state("HIGH_STRESS", 1.0, "#A241FF|70") # Purple alert
            self._trigger_ai("STRESS")

        # 4. FLOW STATE (Normal/Optimal)
        else:
            self.drowsy_frames_count = 0
            if self.current_state != "FLOW" and self.current_ear > 0.3:
                self._update_state("FLOW", 1.5, "#E0F7FA|50") # Calm blue
                self._trigger_ai("NORMAL")

        if should_print:
            self.last_print_time = now
            print(f"[Engine] State: {self.current_state} | EAR: {round(self.current_ear,2)} | GSR: {round(self.current_gsr,2)} | HR: {self.current_hr}")

    def _update_state(self, state, tdcs_val, lamp_cmd):
        if self.current_state == state:
            return
            
        self.current_state = state
        self.tdcs_ma = tdcs_val
        
        # Command Hardware Synchronously
        if self.serial:
            self.serial.send_command("SET_CURRENT", tdcs_val)
            self.serial.send_command("SET_LIGHT", lamp_cmd)
        
        # Sync with Dashboard
        if self.mqtt_client and self.mqtt_client.connected:
            self.mqtt_client.client.publish("pandai/v1/actuator/light", lamp_cmd)
            
        # Log to Database
        self.db.save_intervention(self.session_id, "SYSTEM_STATE", state, tdcs_val)
        
        print(f"[Shield] ⚡ Transition to {state} | tDCS: {tdcs_val}mA | Light: {lamp_cmd}")

    def _trigger_emergency(self, reason):
        print(f"[Shield] 🚨 EMERGENCY SHIELD ACTIVATED: {reason}")
        self.current_state = "EMERGENCY_STOP"
        self.tdcs_ma = 0.0
        if self.serial:
            self.serial.send_command("EMERGENCY_OFF", "")
        if self.mqtt_client and self.mqtt_client.connected:
            self.mqtt_client.send_emergency_off()
        
        self.db.save_intervention(self.session_id, "EMERGENCY", reason, 0.0)
        self.running = False

    def _publish_telemetry(self):
        if not self.mqtt_client or not self.mqtt_client.connected:
            return

        # Simple Attention Index (0.0 - 1.0)
        att_score = min(1.0, self.current_ear / 0.35) 
        if self.current_state in ["FATIGUE", "AWAKE_INTERVENTION"]:
            att_score *= 0.5
            
        metrics = {
             "gsr_microsiemens": round(self.current_gsr, 3),
             "hrv_rmssd_ms": round(self.current_hrv, 2),
             "hr_bpm": round(self.current_hr, 1),
             "ear_score": round(self.current_ear, 3),
             "attention_index": round(att_score, 2),
             "state": self.current_state
        }

        # 2. Citra Anak (Emotion & Gaze)
        citra_anak = {"emotion": "UNKNOWN", "gaze_coords": {"x": 0.5, "y": 0.5}}
        if self.vision:
            citra_anak = self.vision.get_citra_anak()

        hardware = {
             "tdcs_output_ma": self.tdcs_ma,
             "lamp_intensity": self.lamp_intensity,
             "skin_impedance_ohm": self.impedance
        }
        
        # Merge metrics with citra_anak for MQTT payload
        metrics.update(citra_anak)

        self.mqtt_client.publish_processed_bio(self.session_id, metrics, hardware)

    def _handle_persistence(self):
        """Menyimpan log ke SQLite setiap 1 detik."""
        now = time.time()
        if (now - self.db_save_timer) >= 1.0:
            emotion = "UNKNOWN"
            if self.vision:
                emotion = self.vision.get_citra_anak()["emotion"]
                
            self.db.save_log(
                self.session_id, 
                focus=self.current_ear, # Temporary focus proxy
                gsr=self.current_gsr, 
                hrv=self.current_hrv, 
                emotion=emotion,
                state=self.current_state
            )
            self.db_save_timer = now

    def _trigger_ai(self, condition):
        # Throttle AI Trigger (max 1x per 30 seconds for same condition)
        now = time.time()
        if (now - self.last_ai_trigger) < 30:
            return
            
        if self.ai_client:
            self.last_ai_trigger = now
            threading.Thread(target=self._fetch_and_print_ai, args=(condition,), daemon=True).start()

    def _fetch_and_print_ai(self, condition):
        try:
             saran = self.ai_client.get_suggestion(condition=condition)
             print(f"\n🧠 [PANDAI AI Core]: {saran}\n")
        except:
             pass
