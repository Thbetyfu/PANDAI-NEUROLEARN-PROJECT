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
        
    def clear(self):
        self.queue.clear()

class DecisionEngine:
    def __init__(self, mqtt_client=None, serial_client=None, ai_client=None, vision_engine=None, mode="hybrid"):
        self.mqtt_client = mqtt_client
        self.ai_client = ai_client
        self.vision = vision_engine
        
        # New: Persistence Layer (SQLite)
        self.db = DatabaseManager()
        self.data_buffer = []
        self.last_db_save = time.time()
        self.db_save_interval = 5.0 # Simpan setiap 5 detik
        
        # New: System Context
        self.serial = serial_client
        self.mqtt = mqtt_client
        self.ai_client = ai_client # Ensure AI client is assigned
        self.vision = vision_engine # Ensure vision engine is assigned

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
        self.db_save_timer = 0
        self.engine_error = None  # Capture critical errors for UI reporting
        self.is_suspended = False # [V9] Lifecycle Awareness (Fix E05 Minimization)
 # Throttle DB write to 1fps

        # [NEW] MQTT Callbacks (Sync with ROOT_TOPIC for isolation)
        if self.mqtt:
            self.mqtt.add_callback(f"{self.mqtt.ROOT_TOPIC}/history/request", self._handle_history_request)
            self.mqtt.add_callback(f"{self.mqtt.ROOT_TOPIC}/control/camera", self._handle_camera_control)

    def start(self):
        """Memulai protokol kognitif (The Amigdala Loop)."""
        if self.running: return
        print(f"[Engine] 🧠 Neuro-Architect Protocol Berjalan (Sesi: {self.session_id})")
        self.running = True
        
        # [SECURITY] Bersihkan data lama (> 30 hari) saat startup
        print("[Engine] 🧹 Memeriksa dan membersihkan memori lama...")
        self.db.clean_old_data(days=30)
        
        if self.vision and not self.vision.is_running:
            self.vision.start()
        threading.Thread(target=self._run_loop, daemon=True).start()

    def _handle_camera_control(self, topic, data):
        """Menerima index kamera baru dari Browser/Dashboard."""
        try:
            # Handle JSON dict or raw string/int
            idx_val = data.get("index") if isinstance(data, dict) else data
            new_idx = int(idx_val)
            
            if self.vision:
                print(f"[Engine] 🔄 Switching Camera to Index: {new_idx}")
                # Hentikan kamera lama
                self.vision.stop()
                # Update index
                self.vision.camera_index = new_idx
                # Start lagi
                self.vision.start()
        except Exception as e:
            print(f"[Engine] Camera switch failed: {e}")

    def stop(self):
        self.running = False
        if self.vision:
             self.vision.stop()

    def _run_loop(self):
        while self.running:
            try: # 🛡️ BEMPER UTAMA DIMULAI DI SINI
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

                # 5. Intelligent Buffer (Averaging every 5 seconds)
                self._handle_buffering()

            except PandaiCriticalError as e:
                print(f"[Engine] Runtime Critical Error: {e}")
                self.engine_error = e # Simpan untuk UI utama
                self._trigger_emergency(str(e))
                self.running = False
            except ZeroDivisionError:
                print("[ENGINE] ⚠️ Terjadi pembagian dengan nol saat menghitung rata-rata.")
            except KeyError as e:
                print(f"[ENGINE] ⚠️ Format data tidak sesuai, kehilangan kunci: {e}")
            except Exception as e:
                # 🛡️ JARING PENGAMAN TERAKHIR
                # Menangkap SEMUA jenis error agar loop utama tidak pernah mati!
                print(f"\n[ENGINE] 🚨 KESALAHAN FATAL DI LOOP UTAMA: {e}")
                print("[ENGINE] 🔄 Sistem memulihkan diri otomatis dalam 1 detik...\n")
                time.sleep(1) # Beri waktu istirahat agar tidak nge-spam terminal
            
            # Istirahat 0.1 detik wajib ada di luar try-except
            time.sleep(0.1)

    def _check_runtime_integrity(self):
        """Watchdog: Gabungan pengecekan data beku (Fast) & audit sistemik (Slow)."""
        now = time.time()
        
        # 1. Biometric Watchdog: Hanya aktif jika sensor Fisik (Headset) terhubung
        if self.serial and (now - self.last_data_timestamp) > 10.0:
            raise HardwareCriticalError("E02", "WATCHDOG BIOMETRIK: Aliran data terhenti > 10 detik. Periksa alat PANDAI.")

        # 3. Vision Watchdog: Deteksi Kamera Beku/Frozen 
        # [V9] SKIP CHECK JIKA SUSPENDED (User sedang minimize aplikasi)
        if self.is_suspended:
            # Tetap reset tick agar saat di-restore tidak langsung kena timeout
            if self.vision:
                self.vision.last_update_tick = time.time()
            return

        if self.vision and (now - self.vision.last_update_tick > 30.0):
             # [V18.7] Jangan lempar error jika vision sedang mencoba memulihkan diri (Scanner aktif)
             if not getattr(self.vision, 'is_recovering', False):
                raise VisionCriticalError("E05", "KAMERA TIDAK MERESPON: Frame gagal diupdate selama 30 detik terakhir.")

        # 4. Slow Systemic Audit: Diagnosa kesehatan modul (tiap 5 detik)
        # [V22.2] Jangan lakukan audit jika sistem sedang di-suspend (Minimize)
        if (now - self.last_audit_timestamp) > 5.0:
            if not self.is_suspended:
                IntegrityManager.check_health(self.vision, self.serial, self.mqtt)
            self.last_audit_timestamp = now

        try:
            # 3. Vision Granular Check (EAR Suicide)
            if self.vision and not self.is_suspended:
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

    def reset_baselines(self):
        """Mereset semua rata-rata bergerak untuk kalibrasi ulang (Manual atau tiap Sesi)."""
        print("[Engine] 🔄 Melakukan Kalibrasi Ulang Biometrik...")
        self.ear_ma.clear()
        self.gsr_ma.clear()
        self.hrv_ma.clear()
        self.last_data_timestamp = time.time()
        # Jika ada vision, kunci identitas baru
        if self.vision:
            self.vision.set_reference_identity()

    def _evaluate_cognitive_state(self):
        """
        Multimodal Fusion Logic:
        Mengkombinasikan berbagai sensor untuk menentukan kondisi kognitif presisi.
        """
        if hasattr(self.vision, 'identity_verified') and not self.vision.identity_verified:
            if self.current_state != "IDENTITY_LOCK":
                self._update_state("IDENTITY_LOCK", 0.0, "#000000|100")
            return

        now = time.time()
        should_print = (now - self.last_print_time) >= 1.5
        
        # --- A. AMIGDALA SHIELD (Safety Priority) ---
        # 1. Skin Impedance Safety (COMMENTED: No Hardware Yet)
        # if self.impedance > 50000:
        #      self._trigger_emergency("IMPEDANSI TINGGI")
        #      return

        # 2. Heart Rate Safety (COMMENTED: No Hardware Yet)
        # if self.current_hr > 130:
        #      self._trigger_emergency(f"HR KRITIS ({self.current_hr} BPM)")
        #      return

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

        # 0. Detect Identity Mismatch (Anti-Cheat)
        if hasattr(self.vision, 'identity_verified') and not self.vision.identity_verified:
            if self.current_state != "IDENTITY_LOCK":
                self._update_state("IDENTITY_LOCK", 0.0, "#000000|100") # Dark alert - Cut tDCS
                self.db.log_intervention("SECURITY_ALERT", "Mismatch Identitas Siswa")
            return

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
        
        # Command Hardware Synchronously (COMMENTED: No Hardware Yet)
        """
        CATATAN HARDWARE (ACTUATORS):
        Aktifkan baris di bawah ini untuk mengirim perintah fisik ke ESP32
        jika sudah tersedia (Headset tDCS & Lampu Cerdas).
        """
        # if self.serial:
        #     self.serial.send_command("SET_CURRENT", tdcs_val)
        #     self.serial.send_command("SET_LIGHT", lamp_cmd)
        
        # Sync with Dashboard
        if self.mqtt_client and self.mqtt_client.connected:
            self.mqtt_client.client.publish("pandai/v1/actuator/light", lamp_cmd)
            
        # Log to Database (Intervention History)
        self.db.log_intervention(f"KONDISI_{state}", f"tDCS: {tdcs_val}mA | Light: {lamp_cmd}")
        
        print(f"[Shield] ⚡ Transition to {state} | tDCS: {tdcs_val}mA | Light: {lamp_cmd}")

    def _trigger_emergency(self, reason):
        print(f"[Shield] 🚨 EMERGENCY SHIELD ACTIVATED: {reason}")
        self.current_state = "EMERGENCY_STOP"
        self.tdcs_ma = 0.0
        if self.serial:
            self.serial.send_command("EMERGENCY_OFF", "")
        if self.mqtt_client and self.mqtt_client.connected:
            self.mqtt_client.send_emergency_off()
        
        self.db.log_intervention("EMERGENCY_SHUTDOWN", reason)
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
             "cognitive_load": round(self.cognitive_load, 2),
             "state": self.current_state,
             "face_detected": self.vision.is_face_detected() if self.vision else False,
             "identity_verified": getattr(self.vision, 'identity_verified', True),
             "available_cameras": self.vision.get_available_cameras() if self.vision else []
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

    def _handle_buffering(self):
        """Memasukkan data ke buffer dan simpan ke DB setiap 5 detik."""
        # Calculate current attention index
        att_score = min(1.0, self.current_ear / 0.35)
        if self.current_state in ["FATIGUE", "AWAKE_INTERVENTION"]:
            att_score *= 0.5
            
        emotion = "UNKNOWN"
        if self.vision:
            emotion = self.vision.get_citra_anak()["emotion"]

        self.data_buffer.append({
            "ear": self.current_ear,
            "attention": att_score,
            "load": self.cognitive_load,
            "emotion": emotion
        })

        # Cek interval 5 detik
        now = time.time()
        if (now - self.last_db_save) >= self.db_save_interval:
            self._save_buffer_to_db()
            self.last_db_save = now

    def _save_buffer_to_db(self):
        """Menghitung rata-rata dan menyimpan ke SQLite."""
        if not self.data_buffer: return

        avg_ear = sum(d["ear"] for d in self.data_buffer) / len(self.data_buffer)
        avg_att = sum(d["attention"] for d in self.data_buffer) / len(self.data_buffer)
        avg_load = sum(d["load"] for d in self.data_buffer) / len(self.data_buffer)
        
        emotions = [d["emotion"] for d in self.data_buffer]
        dominant_emotion = max(set(emotions), key=emotions.count)

        self.db.insert_biometric_log(
            ear=round(avg_ear, 3),
            attention=round(avg_att, 2),
            load=round(avg_load, 2),
            emotion=dominant_emotion
        )
        self.data_buffer.clear()

    def _trigger_ai(self, condition):
        # Throttle AI Trigger (max 1x per 30 seconds for same condition)
        now = time.time()
        if (now - self.last_ai_trigger) < 30:
            return
            
        if self.ai_client:
            self.last_ai_trigger = now
            # Ambil konteks historis singkat dari DB
            history_ctx = self.db.get_recent_summary(limit=5)
            threading.Thread(target=self._fetch_and_print_ai, args=(condition, history_ctx), daemon=True).start()

    def _fetch_and_print_ai(self, condition, history_ctx):
        try:
             saran = self.ai_client.get_suggestion(condition=condition, history_context=history_ctx)
             print(f"\n🧠 [PROFESOR PANDAI]: {saran}\n")
        except Exception as e:
             # print(f"AI Fetch Error: {e}")
             pass

    def _handle_history_request(self, topic, data):
        """Merespon jika Dashboard meminta riwayat belajar."""
        print(f"[Engine] 📬 Request Riwayat Diterima: {data}")
        
        # Cek apakah request menanyakan durasi spesifik
        days = 7
        if isinstance(data, dict) and "days" in data:
            days = data["days"]
        elif data == "GET_7_DAYS":
            days = 7
            
        history = self.db.get_history_data(days=days)
        
        response_payload = {
            "status": "SUCCESS",
            "request_topic": topic,
            "data": history,
            "timestamp_response": time.strftime('%Y-%m-%d %H:%M:%S')
        }
        
        if self.mqtt:
            self.mqtt.publish("pandai/v1/history/response", response_payload)
            print(f"[Engine] 📤 Riwayat {days} Hari Telah Dikirim.")
