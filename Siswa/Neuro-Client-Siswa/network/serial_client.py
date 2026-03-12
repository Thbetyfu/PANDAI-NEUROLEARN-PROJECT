import serial
import json
import time

class SerialClient:
    def __init__(self, port="COM3", baudrate=115200):
        self.is_connected = False
        try:
            if port:
                self.ser = serial.Serial(port, baudrate, timeout=1)
                self.is_connected = True
                print(f"[Serial] ✅ Terhubung ke ESP32 di {port}")
            else:
                 print("[Serial] ⚠️ Port tidak ditentukan")
        except:
            self.is_connected = False
            print("[Serial] ⚠️ Gagal terhubung ke ESP32")

    @property
    def connected(self):
         return self.is_connected

    def get_bio_data(self):
        if not self.is_connected: return None
        try:
            if self.ser.in_waiting > 0:
                line = self.ser.readline().decode('utf-8').strip()
                return json.loads(line)
        except: return None
        return None

    def send_command(self, cmd_type, value):
        if self.is_connected:
            # Format sesuai protocol-iot.md: SET_CURRENT|1.5
            msg = f"{cmd_type}|{value}\n"
            try:
                self.ser.write(msg.encode())
                print(f"[Serial] Kirim: {msg.strip()}")
            except Exception as e:
                print(f"[Serial] Gagal kirim: {e}")

    def disconnect(self):
         if self.is_connected:
              self.ser.close()
              self.is_connected = False
