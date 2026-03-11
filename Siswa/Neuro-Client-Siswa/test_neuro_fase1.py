import unittest
import json
import time
from unittest.mock import MagicMock, patch

from network.mqtt_client import MQTTClient
from core.decision_engine import DecisionEngine
from ai.ollama_client import LocalAIClient

class TestNeuroClientFase1(unittest.TestCase):
    """
    Kumpulan pengujian otomasi (Test Suite) untuk Neuro-Client PANDAI NEUROLEARN Fase 1.
    Tujuan utamanya adalah memastikan integritas 'The Bridge' (MQTT), validasi struktur JSON,
    ketahanan logika perlindungan 'Amigdala Shield', dan jaminan respon pada AI lokal (Ollama).
    """

    def setUp(self):
        """Standard setup sebelum setiap test case."""
        self.mqtt = MQTTClient(broker_host="localhost", broker_port=1883)
        self.ai_client = LocalAIClient(host="localhost", port=11434, model="gemma2:2b")
        
        # Injeksi mock agar tidak mencoba connect ke real broker saat testing internal logika
        self.mock_paho_client = MagicMock()
        self.mqtt.client = self.mock_paho_client
        self.mqtt.connected = True # Simulasikan sedang terhubung
        
        self.engine = DecisionEngine(mqtt_client=self.mqtt, ai_client=self.ai_client)

    # --------------------------------------------------------------------------------
    # TEST 1: MQTT Handshake Test
    # --------------------------------------------------------------------------------
    @patch('network.mqtt_client.mqtt.Client.connect')
    def test_mqtt_handshake(self, mock_connect):
        """
        @doc Memverifikasi bahwa modul MQTTClient mengirimkan permintaan koneksi 
        dengan parameter host broker dan port yang tepat. Pengujian ini memastikan 
        sistem siap melakukan handshake untuk inisialisasi telemetri tanpa error network loop awal.
        """
        test_mqtt = MQTTClient(broker_host="localhost", broker_port=1883)
        test_mqtt.connect()
        
        # Mengecek apakah 'connect' dipanggil persis dengan argumen localhost, 1883, 60
        mock_connect.assert_called_once_with("localhost", 1883, 60)
        self.assertTrue(hasattr(test_mqtt, 'loop_thread'))

    # --------------------------------------------------------------------------------
    # TEST 2: JSON Schema Validation Test
    # --------------------------------------------------------------------------------
    def test_json_payload_schema(self):
        """
        @doc Memastikan payload yang dikirim dari engine mematuhi ketat spesifikasi JSON
        yang terdapat pada docs/protocol-iot.md. Kehilangan atribut krusial seperti 'device_id'
        bisa menyebabkan gagalnya sinkronisasi PANDAI Dashboard.
        """
        metrics = {"gsr_microsiemens": 0.45, "hrv_rmssd_ms": 72.5, "ear_score": 0.28, "cognitive_load": 45.2}
        hardware = {"tdcs_output_ma": 1.5, "lamp_intensity": 80, "skin_impedance_ohm": 12500, "battery_level": 92}
        
        success = self.mqtt.publish_processed_bio(session_id="TEST-01", metrics=metrics, hardware_state=hardware)
        self.assertTrue(success)
        
        # Memeriksa data argumen JSON yang dipublish oleh mock_paho_client 
        self.mock_paho_client.publish.assert_called_once()
        args, kwargs = self.mock_paho_client.publish.call_args
        
        topic = args[0]
        payload_str = args[1]
        
        self.assertEqual(topic, "pandai/v1/bio/processed")
        
        # Ekstraksi string menjadi dictionary
        payload_json = json.loads(payload_str)
        
        # Verifikasi struktur WAJIB Header
        self.assertIn("header", payload_json)
        self.assertIn("device_id", payload_json["header"])
        self.assertIn("session_id", payload_json["header"])
        self.assertIn("timestamp", payload_json["header"])
        
        # Verifikasi struktur WAJIB Payload
        self.assertIn("payload", payload_json)
        self.assertIn("metrics", payload_json["payload"])
        self.assertIn("hardware_state", payload_json["payload"])
        
        # Cek salah satu nilai wajib untuk validasi kedalaman Object/Dictionary
        self.assertIn("ear_score", payload_json["payload"]["metrics"])

    # --------------------------------------------------------------------------------
    # TEST 3: Amigdala Shield Threshold Test (Mata Mengantuk)
    # --------------------------------------------------------------------------------
    def test_amigdala_shield_sleepy(self):
        """
        @doc Menguji mekanisme Amigdala Shield AWAKE_INTERVENTION.
        Jika atensi visual (EAR) turun drastis ke 0.15 (simulasi mata tertutup/mengantuk), 
        sistem WAJIB mempublikasikan instruksi pencahayaan kuat ke topic actuator/light
        menjadi SET_LIGHT|#FFFFFF|100 (Warna Cool White 100%).
        """
        # Inject EAR anjlok secara instan
        self.engine.current_ear = 0.15
        
        # Evaluasinya:
        self.engine._evaluate_state()
        
        # Karena ear_score < 0.22, state berubah
        self.assertEqual(self.engine.current_state, "AWAKE_INTERVENTION")
        self.assertEqual(self.engine.lamp_intensity, 100)
        
        # Pastikan perintah kontrol lampu di-publish ke hardware via MQTT
        self.mock_paho_client.publish.assert_any_call("pandai/v1/actuator/light", "#FFFFFF|100")

    # --------------------------------------------------------------------------------
    # TEST 4: Safety Cut-off Hard Test (Impedansi Ekstrim)
    # --------------------------------------------------------------------------------
    def test_safety_hard_cutoff(self):
        """
        @doc Menguji protokol proteksi medis / keamanan saraf maksimal PANDAI NEUROLEARN.
        Menekan nilai Skin Impedance ke angka ekstrim 55000 Ohm memicu HARD CUT-OFF 
        karena elektroda mungkin lepas/kering yang menyebabkan risiko sengatan listrik fokal.
        Sistem diwajibkan mengirim 'EMERGENCY_OFF' dan memutus sirkuit via relay lokal.
        """
        self.engine.running = True
        self.engine.current_hrv = 60 # Normal
        self.engine.current_ear = 0.35 # Normal
        
        # Inject Impedansi ekstrim (Lepas kontak elektroda > 50k ohm)
        self.engine.impedance = 55000 
        
        self.engine._evaluate_state()
        
        # Logika keselamatan menuntut untuk shutdown seluruh sistem dan current menjadi 0 mA
        self.assertFalse(self.engine.running, "Engine harus segera berhenti demi safety cut-off")
        
        # Harus mem-publish 'EMERGENCY_OFF' di kedua channel keselamatan dan tdcs
        self.mock_paho_client.publish.assert_any_call("pandai/v1/actuator/tdcs", "EMERGENCY_OFF", qos=2)
        self.mock_paho_client.publish.assert_any_call("pandai/v1/system/safety", "EMERGENCY_OFF", qos=2)

    # --------------------------------------------------------------------------------
    # TEST 5: Local AI (Ollama) Integration Test (Timeout Handling)
    # --------------------------------------------------------------------------------
    @patch('ai.ollama_client.requests.post')
    def test_ai_timeout_handling(self, mock_post):
        """
        @doc Memastikan stabilitas Neuro-Client jika Ollama Server lokal berat atau down.
        Test melempar Timeout request pada Python. Sistem harus bisa melempar pesan gracefully 
        'Peringatan E03: Timeout saat menghubungi AI' agar UI tidak nge-hang (freeze).
        """
        import requests
        # Bypass request asli dengan melemparkan error Timeout
        mock_post.side_effect = requests.exceptions.Timeout("Tiruan Server down")
        
        response = self.ai_client.get_suggestion(context="Siswa kelelahan kognitif tinggi")
        
        # Cek balasan error code standard E03
        self.assertIn("Peringatan E03:", response)
        self.assertIn("Timeout", response)

if __name__ == '__main__':
    unittest.main()
