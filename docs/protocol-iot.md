# IoT Communication Protocol - PANDAI

## MQTT Configuration
- **Broker**: (TBD - e.g., local RPi or Cloud)
- **Port**: 1883
- **Root Topic**: `pandai/v1/`

## Topics
| Topic | Description | Direction |
|-------|-------------|-----------|
| `pandai/v1/sensor/raw` | Raw biometric data (GSR, HRV) | NeuroClient -> LMS/Dashboard |
| `pandai/v1/control/tdcs` | Control signals for tDCS | Dashboard -> NeuroClient |
| `pandai/v1/alert` | Stress detection notifications | NeuroClient -> All |

## JSON Format Example (Sensor Data)
```json
{
  "device_id": "NC-001",
  "timestamp": "2026-02-23T13:16:00Z",
  "data": {
    "gsr": 0.45,
    "hrv": 72,
    "stress_level": "medium"
  }
}
```

## Threshold Biosensor
- **GSR Stress**: > 0.8 uS increase in < 2s.
- **HRV Low**: < 40 ms (signaling focus or high stress).
