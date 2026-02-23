# PANDAI NEUROLEARN 2.0 - IoT Communication Protocol

Protokol ini mengatur pertukaran data antara **Neuro-Client** (Edge Unit), **ESP32** (Hardware Unit), **PANDAI Dashboard**, dan **PANDAI LMS**.

## 1. Konfigurasi Jaringan
- **Protokol**: MQTT (Message Queuing Telemetry Transport)
- **Broker**: Local Raspberry Pi 4B (Mosquitto)
- **Host**: `pandai-hub.local` atau `192.168.x.x`
- **Port**: 1883
- **QoS Level**: 
  - `QoS 0`: Data Biometrik (Frekuensi tinggi, toleransi kehilangan data rendah)
  - `QoS 2`: Perintah Intervensi & Safety (Kritis, tidak boleh hilang/duplikat)

## 2. Struktur Topik (Topic Hierarchy)
| Topic | Deskripsi | Publisher | Subscriber |
|-------|-----------|-----------|------------|
| `pandai/v1/bio/raw` | Data mentah biometrik (GSR, HRV) | ESP32 | Neuro-Client |
| `pandai/v1/bio/processed` | Hasil abstraksi kognitif (Attention, Stress) | Neuro-Client | Dashboard/LMS |
| `pandai/v1/actuator/tdcs` | Kontrol arus stimulator tDCS (mA) | Neuro-Client | ESP32 |
| `pandai/v1/actuator/light` | Kontrol spektrum & kecerahan lampu | Neuro-Client | ESP32 |
| `pandai/v1/system/safety` | Alert darurat & Impedansi tinggi | Any Unit | All |

## 3. Format Payload JSON

### A. Telemetri Biometrik Terpadu
Dikirim setiap 1000ms untuk pemantauan real-time di Dashboard.
```json
{
  "header": {
    "device_id": "PANDAI-NC-01",
    "session_id": "SESS-20260223",
    "timestamp": "2026-02-23T13:16:00Z"
  },
  "payload": {
    "metrics": {
      "gsr_microsiemens": 0.45,
      "hrv_rmssd_ms": 72.5,
      "ear_score": 0.28,
      "cognitive_load": 45.2
    },
    "hardware_state": {
      "tdcs_output_ma": 1.5,
      "lamp_intensity": 80,
      "skin_impedance_ohm": 12500,
      "battery_level": 92
    }
  }
}

{
  "command": "ADJUST_INTERVENTION",
  "params": {
    "tdcs_target": 1.2,
    "light_mode": "cool_white",
    "transition_ms": 500
  },
  "safety_token": "AUTH-9912"
}

## 4. Threshold & Aksi Sistem

| Parameter | Threshold | Aksi Sistem |
|-----------|-----------|-------------|
| **EAR (Drowsiness)** | < 0.22 (5 detik) | Tingkatkan Kecerahan Lampu (Wake-up call) |
| **GSR (Stress)** | Kenaikan > 15% (30 detik) | Aktifkan tDCS 1.0mA (Calm/Alpha Stim) |
| **HRV (Fatigue)** | RMSSD < 25ms | Trigger LMS: "Istirahat Sejenak & Minigame" |
| **Impedance** | > 50,000 Ohm | **SAFETY SHUTDOWN** & Alert ke Dashboard |
