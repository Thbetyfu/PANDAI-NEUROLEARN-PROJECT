# Siswa/Neuro-Client-Siswa/config.py

# UBAH KE FALSE JIKA ALAT ESP32 SUDAH TERPASANG
SIMULATION_MODE = True 

# MQTT Config
MQTT_BROKER = "broker.emqx.io"
MQTT_PORT = 1883 
MQTT_WS_PORT = 8084
import uuid
DEVICE_ID = f"PANDAI_NC_01_{uuid.uuid4().hex[:6]}" # Unique ID per instance to avoid collisions
