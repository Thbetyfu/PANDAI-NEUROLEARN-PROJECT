# Siswa/Neuro-Client-Siswa/config.py

# UBAH KE FALSE JIKA ALAT ESP32 SUDAH TERPASANG
SIMULATION_MODE = True 

# MQTT Config
MQTT_BROKER = "broker.emqx.io"
MQTT_PORT = 1883 
MQTT_WS_PORT = 8084
import uuid
DEVICE_ID = "PANDAI_NC_01" # [V25.3] Fixed to match LMS-Siswa's expected ID for MQTT discovery.
