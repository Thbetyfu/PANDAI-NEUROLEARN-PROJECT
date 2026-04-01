import serial
import json
import time
import random
import config

class SerialClient:
    """
    Abstraction Layer untuk Hardware PANDAI (ESP32).
    Bisa beralih otomatis antara data REAL (USB) dan MOCK (Simulasi) 
    tergantung pada SIMULATION_MODE di config.py.
    """
    def __init__(self, port="COM3", baudrate=115200):
        self.is_connected = False
        self.port = port
        self.baudrate = baudrate
        self.mode = "SIMULATION" if config.SIMULATION_MODE else "REAL"
        self._start_time = time.time()
        
        if self.mode == "REAL":
            self._connect_real()
        else:
            self._connect_mock()

    def _connect_real(self):
        try:
            self.ser = serial.Serial(self.port, self.baudrate, timeout=1)
            self.is_connected = True
            print(f"[Serial] ✅ REAL MODE: Terhubung ke ESP32 di {self.port}")
        except Exception as e:
            self.is_connected = False
            print(f"[Serial] ⚠️ REAL MODE FAIL: Gagal terhubung ke ESP32. Error: {e}")

    def _connect_mock(self):
        self.is_connected = True
        print("[Serial] 🧪 MOCK MODE: Virtual Hardware ESP32 Aktif")

    @property
    def connected(self):
        return self.is_connected

    def get_bio_data(self):
        """Unified method untuk mengambil data biometrik (Real or Mock)."""
        if not self.is_connected: 
            return None
            
        if self.mode == "REAL":
            return self._get_real_data()
        else:
            return self._get_mock_data()

    def _get_real_data(self):
        try:
            if self.ser.in_waiting > 0:
                line = self.ser.readline().decode('utf-8').strip()
                return json.loads(line)
        except serial.SerialException as e:
            # PETUNJUK ERROR JELAS:
            print(f"[HARDWARE] 🚨 FATAL: Koneksi USB ESP32 terputus mendadak! Detail: {e}")
            self.is_connected = False
            return None
        except UnicodeDecodeError:
            print("[HARDWARE] ⚠️ Data Serial masuk tidak terbaca (Kabel mungkin goyang). Mengabaikan...")
            return None
        except Exception as e:
            print(f"[HARDWARE] ⚠️ Error tak terduga pada Sensor: {e}")
            return None
        return None

    def _get_mock_data(self):
        elapsed = time.time() - self._start_time
        # Simulasi lonjakan stres (GSR Spike) setiap 40 detik
        is_stress_moment = (int(elapsed) % 40) > 35
        
        if is_stress_moment:
            gsr = random.uniform(0.60, 0.85)
            hrv = random.uniform(15, 25)
        else:
            gsr = random.uniform(0.30, 0.45)
            hrv = random.uniform(40, 70)
            
        return {
            "gsr": round(gsr, 3),
            "hrv": round(hrv, 1),
            "hr": random.randint(70, 90),
            "imp": random.randint(15000, 25000),
            "bat": 85
        }

    def send_command(self, cmd_type, value):
        """Unified method untuk mengirim perintah intervensi."""
        if not self.is_connected:
            return

        # SAFETY COMPLIANCE: Hard limit tDCS maksimal 2.0 mA
        if cmd_type == "SET_CURRENT":
            try:
                if float(value) > 2.0:
                    print(f"[Serial] 🛡️ SAFETY BLOCK: Arus {value}mA melebihi batas 2.0mA.")
                    return
            except: pass

        if self.mode == "REAL":
            msg = f"{cmd_type}|{value}\n"
            try:
                self.ser.write(msg.encode())
                # print(f"[Serial] REAL Sent: {msg.strip()}")
            except:
                print("[Serial] REAL Send Failed")
        else:
            print(f"[Serial] MOCK Command: {cmd_type} | Value: {value}")

    def disconnect(self):
        if self.mode == "REAL" and self.is_connected:
            self.ser.close()
        self.is_connected = False
        print(f"[Serial] {self.mode} Disconnected.")
