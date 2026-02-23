# PANDAI NEUROLEARN 2.0 - IoT Communication Protocol

Protokol ini mengatur spesifikasi teknis pertukaran data antara **Neuro-Client**, **ESP32**, dan **PANDAI Ecosystem**.

## 1. Data Abstraction Layer
Setiap payload yang dikirim dari Neuro-Client ke Dashboard harus mengikuti skema kalkulasi berikut:

| Parameter | Type | Range | Deskripsi |
|-----------|------|-------|-----------|
| `attention_index` | Float | 0.0 - 1.0 | Gabungan data EAR (Eye Aspect Ratio) dan Head-Pose. |
| `stress_index` | Float | 0.0 - 1.0 | Kalkulasi tingkat stres berdasarkan fluktuasi GSR. |
| `cognitive_fatigue`| Boolean| T/F | `True` jika HRV RMSSD < 20ms selama 5 menit berturut-turut. |

## 2. Konfigurasi Jaringan & Topik
- **Broker**: Local Raspberry Pi 4B (Mosquitto)
- **Host**: `192.168.x.x` (Internal Network)
- **Port**: 1883

| Topic | Deskripsi | QoS | Direction |
|-------|-----------|-----|-----------|
| `pandai/v1/bio/raw` | Data mentah biometrik (GSR, HRV) | 0 | ESP32 → NC |
| `pandai/v1/bio/processed` | Hasil abstraksi kognitif | 0 | NC → Dashboard |
| `pandai/v1/actuator/tdcs` | Kontrol arus stimulator tDCS (mA) | 2 | NC → ESP32 |
| `pandai/v1/actuator/light` | Kontrol spektrum & kecerahan lampu | 2 | NC → ESP32 |
| `pandai/v1/system/safety` | Alert darurat & Impedansi tinggi | 2 | Any → All |

## 3. Command Set (Neuro-Client → ESP32)
Format perintah string untuk kontrol hardware cepat:

- `SET_CURRENT|val`: Mengatur arus tDCS (Range: 0.1 - 2.0 mA).
- `SET_LIGHT|hex|intensity`: Mengatur warna COB LED (Contoh: `#FFFFFF|100`).
- `EMERGENCY_OFF`: Memutus relay utama untuk penghentian total.

## 4. Format Payload JSON (Standardized)
Semua unit **WAJIB** menggunakan format ini. Jika format salah, unit penerima akan melempar **Error E03**.

### Telemetri Biometrik
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
```

## 5. Threshold & Protokol Keamanan (Amigdala Shield)
Safety logic yang berjalan sebagai proteksi berlapis.

- **EAR**: `< 0.22` selama 5 detik → Trigger: Tingkatkan kecerahan lampu.
- **GSR**: Kenaikan `> 15%` dalam 30 detik → Trigger: tDCS 1.0mA (Alpha Stim).
- **Impedansi**: `> 50,000 Ohm` → **HARD CUT-OFF** via Mechanical Relay.
- **Watchdog**: Jika heartbeat MQTT hilang dalam 5 detik, ESP32 reset ke 0mA secara otomatis.

## 6. Error Codes Reference
| Code | Name | Deskripsi |
|------|------|-----------|
| **E01** | Sensor Disconnected | Koneksi fisik ke sensor GSR/Headset terputus. |
| **E02** | High Impedance | Resistansi kulit terlalu tinggi (>50kOhm). |
| **E03** | Local AI Timeout | Ollama tidak memberikan respon dalam waktu batas. |