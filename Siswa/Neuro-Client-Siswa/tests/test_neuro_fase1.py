"""
=================================================================
  PANDAI NEUROLEARN 2.0 — Fase 1 Automated Test Suite
  Senior QA Automation Engineer: Antigravity Agent
=================================================================
  Referensi Protokol:
    - docs/protocol-iot.md  (JSON Schema, Threshold, Error Codes)
    - docs/vibe-coding.md   (Safety Rules, Async Pattern)

  Cara Menjalankan:
    python -m unittest tests.test_neuro_fase1
=================================================================
"""

import sys
import os
import unittest
import json
from unittest.mock import MagicMock, patch

# Pastikan root project ada di sys.path agar import modul internal berjalan
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from network.mqtt_client import MQTTClient
from core.decision_engine import DecisionEngine
from ai.ollama_client import LocalAIClient


class TestNeuroClientFase1(unittest.TestCase):
    """
    Kumpulan pengujian otomasi (Test Suite) untuk Neuro-Client PANDAI NEUROLEARN Fase 1.

    Tujuan utamanya adalah memastikan integritas 'The Bridge' (MQTT), validasi struktur JSON,
    ketahanan logika perlindungan 'Amigdala Shield', dan jaminan respon pada AI lokal (Ollama).

    Seluruh pengujian berjalan secara LOKAL. Tidak ada data yang dikirim ke cloud.
    """

    def setUp(self):
        """Standard setup sebelum setiap test case."""
        # Buat instance MQTT, tapi mock internal paho client agar tidak butuh broker nyata
        self.mqtt = MQTTClient(broker_host="localhost", broker_port=1883)
        self.ai_client = LocalAIClient(host="localhost", port=11434, model="gemma2:2b")

        # Injeksi mock agar tidak mencoba connect ke real broker saat testing logika internal
        self.mock_paho_client = MagicMock()
        self.mqtt.client = self.mock_paho_client
        self.mqtt.connected = True  # Simulasikan sedang terhubung

        self.engine = DecisionEngine(mqtt_client=self.mqtt, ai_client=self.ai_client)

    # ---------------------------------------------------------------------------
    # TEST 1: MQTT Handshake Test
    # ---------------------------------------------------------------------------
    @patch("network.mqtt_client.mqtt.Client")
    def test_mqtt_handshake(self, mock_mqtt_class):
        """
        @doc Memverifikasi bahwa modul MQTTClient mengirimkan permintaan koneksi
        dengan parameter host broker dan port yang tepat (localhost:1883).
        Pengujian ini memastikan sistem siap melakukan handshake untuk inisialisasi
        telemetri tanpa error network loop awal.

        Ref: docs/protocol-iot.md §2 — Konfigurasi Jaringan & Topik
        """
        mock_instance = MagicMock()
        mock_mqtt_class.return_value = mock_instance

        test_mqtt = MQTTClient(broker_host="localhost", broker_port=1883)
        result = test_mqtt.connect()

        # Mengecek apakah 'connect' dipanggil persis dengan argumen localhost, 1883, 60
        mock_instance.connect.assert_called_once_with("localhost", 1883, 60)
        self.assertTrue(result)

    # ---------------------------------------------------------------------------
    # TEST 2: JSON Schema Validation Test
    # ---------------------------------------------------------------------------
    def test_json_payload_schema(self):
        """
        @doc Memastikan payload yang dikirim dari engine mematuhi ketat spesifikasi JSON
        yang terdapat pada docs/protocol-iot.md §4.

        Struktur WAJIB:
          header  → device_id, session_id, timestamp
          payload → metrics (gsr, hrv, ear, cognitive_load)
                  → hardware_state (tdcs, lamp, impedance, battery)

        Kehilangan atribut krusial seperti 'device_id' bisa menyebabkan gagalnya
        sinkronisasi PANDAI Dashboard (Error E03).
        """
        metrics = {
            "gsr_microsiemens": 0.45,
            "hrv_rmssd_ms": 72.5,
            "ear_score": 0.28,
            "cognitive_load": 45.2,
        }
        hardware = {
            "tdcs_output_ma": 1.5,
            "lamp_intensity": 80,
            "skin_impedance_ohm": 12500,
            "battery_level": 92,
        }

        success = self.mqtt.publish_processed_bio(
            session_id="TEST-01", metrics=metrics, hardware_state=hardware
        )
        self.assertTrue(success)

        # Memeriksa data argumen JSON yang dipublikasikan oleh mock paho client
        self.mock_paho_client.publish.assert_called_once()
        args, _kwargs = self.mock_paho_client.publish.call_args

        topic = args[0]
        payload_str = args[1]

        self.assertEqual(topic, "pandai/v1/bio/processed")

        # Ekstraksi string menjadi dictionary
        payload_json = json.loads(payload_str)

        # --- Verifikasi struktur WAJIB Header ---
        self.assertIn("header", payload_json)
        self.assertIn("device_id", payload_json["header"])
        self.assertIn("session_id", payload_json["header"])
        self.assertIn("timestamp", payload_json["header"])

        # --- Verifikasi struktur WAJIB Payload ---
        self.assertIn("payload", payload_json)
        self.assertIn("metrics", payload_json["payload"])
        self.assertIn("hardware_state", payload_json["payload"])

        # --- Verifikasi kedalaman field metrics ---
        m = payload_json["payload"]["metrics"]
        self.assertIn("gsr_microsiemens", m)
        self.assertIn("hrv_rmssd_ms", m)
        self.assertIn("ear_score", m)
        self.assertIn("cognitive_load", m)

        # --- Verifikasi kedalaman field hardware_state ---
        h = payload_json["payload"]["hardware_state"]
        self.assertIn("tdcs_output_ma", h)
        self.assertIn("lamp_intensity", h)
        self.assertIn("skin_impedance_ohm", h)
        self.assertIn("battery_level", h)

    # ---------------------------------------------------------------------------
    # TEST 3: Amigdala Shield Threshold Test (Mata Mengantuk)
    # ---------------------------------------------------------------------------
    def test_amigdala_shield_sleepy(self):
        """
        @doc Menguji mekanisme Amigdala Shield AWAKE_INTERVENTION.

        Jika atensi visual (EAR) turun drastis ke 0.15 (simulasi mata tertutup/mengantuk),
        sistem WAJIB mempublikasikan instruksi pencahayaan kuat ke topik actuator/light
        menjadi SET_LIGHT|#FFFFFF|100 (Warna Cool White, intensitas 100%).

        Ref: docs/protocol-iot.md §5 — EAR < 0.22 → Trigger: Tingkatkan kecerahan lampu.
        Ref: docs/protocol-iot.md §3 — SET_LIGHT|hex|intensity
        """
        # Inject EAR anjlok secara instan ke 0.15 (mata tertutup)
        self.engine.current_ear = 0.15

        # Jalankan evaluasi state Amigdala Shield
        self.engine._evaluate_state()

        # Karena ear_score < 0.22, state harus berubah menjadi AWAKE_INTERVENTION
        self.assertEqual(self.engine.current_state, "AWAKE_INTERVENTION")
        self.assertEqual(self.engine.lamp_intensity, 100)

        # Pastikan perintah kontrol lampu di-publish ke hardware via MQTT
        self.mock_paho_client.publish.assert_any_call(
            "pandai/v1/actuator/light", "#FFFFFF|100"
        )

    # ---------------------------------------------------------------------------
    # TEST 4: Safety Cut-off Hard Test (Impedansi Ekstrim)
    # ---------------------------------------------------------------------------
    def test_safety_hard_cutoff(self):
        """
        @doc Menguji protokol proteksi medis / keamanan saraf maksimal PANDAI NEUROLEARN.

        Menekan nilai Skin Impedance ke angka ekstrim 55000 Ohm memicu HARD CUT-OFF
        karena elektroda mungkin lepas atau kering, yang menyebabkan risiko
        sengatan listrik fokal di area DLPFC.

        Sistem diwajibkan:
          1. Mengirim 'EMERGENCY_OFF' ke topik actuator/tdcs (QoS 2).
          2. Mengirim 'EMERGENCY_OFF' ke topik system/safety (QoS 2).
          3. Menghentikan seluruh loop engine secara instan (running = False).

        Ref: docs/protocol-iot.md §5 — Impedansi > 50,000 Ohm → HARD CUT-OFF
        Ref: docs/protocol-iot.md §3 — EMERGENCY_OFF: Memutus relay utama
        """
        self.engine.running = True
        self.engine.current_hrv = 60  # Normal
        self.engine.current_ear = 0.35  # Normal

        # Inject Impedansi ekstrim (Lepas kontak elektroda > 50k ohm)
        self.engine.impedance = 55000

        self.engine._evaluate_state()

        # Logika keselamatan menuntut engine untuk langsung shutdown
        self.assertFalse(
            self.engine.running,
            "Engine harus segera berhenti demi safety cut-off hardware!",
        )

        # Harus mem-publish 'EMERGENCY_OFF' di kedua channel keselamatan
        self.mock_paho_client.publish.assert_any_call(
            "pandai/v1/actuator/tdcs", "EMERGENCY_OFF", qos=2
        )
        self.mock_paho_client.publish.assert_any_call(
            "pandai/v1/system/safety", "EMERGENCY_OFF", qos=2
        )

    # ---------------------------------------------------------------------------
    # TEST 5: Local AI (Ollama) Integration Test — Timeout Handling
    # ---------------------------------------------------------------------------
    @patch("ai.ollama_client.requests.post")
    def test_ai_timeout_handling(self, mock_post):
        """
        @doc Memastikan stabilitas Neuro-Client jika Ollama Server lokal terlalu berat
        atau tidak merespon (crash/maintenance).

        Test ini meng-injeksi simulasi `requests.exceptions.Timeout` pada Python.
        Sistem harus bisa mengembalikan pesan gracefully berisi kode error standar
        'Peringatan E03: Timeout saat menghubungi AI' agar UI tidak nge-hang (freeze)
        dan Decision Engine bisa tetap berjalan tanpa gangguan.

        Ref: docs/protocol-iot.md §6 — E03: Local AI Timeout
        Ref: docs/vibe-coding.md §1 — Fail-Safe Mechanism
        """
        import requests as req

        # Bypass request asli dengan melemparkan error Timeout
        mock_post.side_effect = req.exceptions.Timeout("Tiruan Server Ollama down")

        response = self.ai_client.get_suggestion(
            context="Siswa mengalami kelelahan kognitif tinggi"
        )

        # Cek balasan mengandung error code standard E03
        self.assertIn("Peringatan E03:", response)
        self.assertIn("Timeout", response)


if __name__ == "__main__":
    unittest.main()
