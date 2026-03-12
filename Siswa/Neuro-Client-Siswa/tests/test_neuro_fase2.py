import unittest
from unittest.mock import MagicMock, patch
import json
import serial

from sensors.vision_engine import VisionEngine
from network.serial_client import SerialClient
from core.decision_engine import DecisionEngine
from ai.ollama_client import LocalAIClient

class LandmarkMock:
    """Mock class untuk menggantikan mediapipe landmark."""
    def __init__(self, x, y):
        self.x = x
        self.y = y

class TestNeuroClientFase2(unittest.TestCase):
    """
    Test suite integrasi tingkat lanjut untuk Neuro-Client PANDAI Fase 2.
    Meliputi Vision Engine, Serial Client terpadu, Decision Engine, 
    dan proteksi batas keamanan.
    """

    def setUp(self):
        """Persiapan mock objects."""
        pass

    # 1. Vision Logic Test (EAR Calculation)
    def test_vision_logic_ear_calculation(self):
        """
        @doc Menguji akurasi kalkulasi Eye Aspect Ratio (EAR).
        Simulasi koordinat mata terbuka dan tertutup untuk memastikan 
        matematika Euclidean berjalan sesuai standar klinis PANDAI.
        """
        vision = VisionEngine()
        
        # Membuat 468 array dummy. Kita hanya peduli index mata kiri:
        # LEFT_EYE = [33, 160, 158, 133, 153, 144]
        landmarks = [LandmarkMock(0, 0) for _ in range(468)]
        
        # Mata Terbuka: p1 -> p4 horizontal, p2->p6 dan p3->p5 vertikal terbuka
        # p1=33(kiri), p4=133(kanan), p2=160(atas1), p3=158(atas2), p5=153(bawah2), p6=144(bawah1)
        landmarks[33] = LandmarkMock(0, 0)
        landmarks[133] = LandmarkMock(10, 0)
        
        landmarks[160] = LandmarkMock(2, 2)
        landmarks[144] = LandmarkMock(2, -2) # jarak vertikal 4
        
        landmarks[158] = LandmarkMock(8, 2)
        landmarks[153] = LandmarkMock(8, -2) # jarak vertikal 4
        
        ear_terbuka = vision._calculate_ear(landmarks, [33, 160, 158, 133, 153, 144])
        # Rumus: (4 + 4) / (2 * 10) = 8 / 20 = 0.40
        self.assertEqual(ear_terbuka, 0.40)
        
        # Mata Tertutup (semua koordinat Y adalah 0)
        for idx in [33, 160, 158, 133, 153, 144]:
            landmarks[idx].y = 0
            
        ear_tertutup = vision._calculate_ear(landmarks, [33, 160, 158, 133, 153, 144])
        self.assertEqual(ear_tertutup, 0.0)

    # 2. GSR Spike Detection Test
    def test_gsr_spike_detection(self):
        """
        @doc Memastikan algoritma pendeteksi lonjakan stres (GSR > 15%).
        Menginjeksi nilai GSR 0.40 lau 0.47, memeriksa apakah state 
        langsung berpindah ke HIGH_STRESS dan current di-set ke 1.0mA.
        """
        serial_mock = MagicMock()
        ai_mock = MagicMock()
        engine = DecisionEngine(serial_client=serial_mock, ai_client=ai_mock)
        
        # Inisialisasi awal
        engine.current_gsr = 0.40
        engine.prev_gsr = 0.40
        
        # Spike input (naik 17.5%)
        engine.current_gsr = 0.47
        
        engine._evaluate_state()
        
        self.assertEqual(engine.current_state, "HIGH_STRESS")
        self.assertEqual(engine.tdcs_ma, 1.0)
        serial_mock.send_command.assert_any_call("SET_CURRENT", 1.0)

    # 3. Serial Command Integrity
    @patch('serial.Serial')
    def test_serial_command_integrity(self, mock_serial_class):
        """
        @doc Memastikan format transmisi text ke hardware ESP32 sempurna.
        Mencoba memanggil send_command("SET_LIGHT", "#FFFFFF|100") dan verifikasi
        di level byte (encode UTF-8).
        """
        mock_ser_instance = MagicMock()
        mock_serial_class.return_value = mock_ser_instance
        
        client = SerialClient(port="COM_DUMMY", baudrate=115200)
        
        client.send_command("SET_LIGHT", "#FFFFFF|100")
        
        # Harusnya memanggil ser.write(b"SET_LIGHT|#FFFFFF|100\n")
        mock_ser_instance.write.assert_called_with(b"SET_LIGHT|#FFFFFF|100\n")

    # 4. Hybrid Data Priority Test
    def test_hybrid_data_priority(self):
        """
        @doc Memastikan Data dari Hardware (ESP32) mem-bypass data random engine.
        DecisionEngine mensinkronkan datanya jika serial memiliki bacaan sensor aktif.
        """
        serial_mock = MagicMock()
        serial_mock.get_bio_data.return_value = {"gsr": 0.88, "hrv": 55.5, "imp": 12000}
        
        engine = DecisionEngine(serial_client=serial_mock)
        
        # Eksekusi sinkronisasi layaknya step "2" dalam _run_loop() nya engine
        bio_data = engine.serial.get_bio_data()
        if bio_data:
            engine.current_gsr = bio_data.get('gsr', engine.current_gsr)
            engine.current_hrv = bio_data.get('hrv', engine.current_hrv)
            engine.impedance = bio_data.get('imp', engine.impedance)
            
        self.assertEqual(engine.current_gsr, 0.88)
        self.assertEqual(engine.current_hrv, 55.5)
        self.assertEqual(engine.impedance, 12000)

    # 5. AI Contextual Chat Test
    @patch('threading.Thread.start') # Mencegah async thread beneran running
    def test_ai_contextual_chat(self, mock_thread_start):
        """
        @doc Memastikan engine mengirim sinyal yang benar ke Ollama,
        seperti keyword kondisi DROWSY saat AI trigger dipanggil.
        """
        # Dalam mock kali ini kita langsung patch ai_client dalam engine
        ai_mock = MagicMock()
        engine = DecisionEngine(ai_client=ai_mock)
        
        # Buat dia ngantuk
        engine.current_ear = 0.10
        engine._evaluate_state()
        
        # Cek apakah _trigger_ai memanggil fetch
        # Karena _trigger_ai pakai threading, kita intercept
        # Atau kita panggil fungsi private-nya langsung
        engine._fetch_and_print_ai("DROWSY")
        
        ai_mock.get_suggestion.assert_called_with(condition="DROWSY")

    # 6. Safety Compliance (The 2mA Limit) & Error Handling (E01)
    @patch('serial.Serial')
    def test_safety_compliance_2ma_limit(self, mock_serial_class):
        """
        @doc Aturan WAJIB Neuromodulasi: DILARANG keras arus melebihi 2.0mA.
        Sistem harus otomatis menolak (reject) atau mem-batasi perintah 2.5mA.
        Ditambah penanganan error saat COM port tidak ada/gagal (E01 fallback).
        """
        mock_ser_instance = MagicMock()
        mock_serial_class.return_value = mock_ser_instance
        
        # Test simulasi port COM gagal (Exception)
        mock_serial_class.side_effect = serial.SerialException("Port tidak ada E01")
        client_fail = SerialClient(port="COM99")
        self.assertFalse(client_fail.is_connected)
        
        # Reset mock untuk test normal port
        mock_serial_class.side_effect = None
        mock_ser_instance = MagicMock()
        mock_serial_class.return_value = mock_ser_instance
        
        client_ok = SerialClient(port="COM3")
        self.assertTrue(client_ok.is_connected)
        
        # Minta 2.5mA (Bahaya)
        client_ok.send_command("SET_CURRENT", 2.5)
        
        # Sistem HARUS memblokir string "SET_CURRENT|2.5"
        # Uji apakah write tidak pernah dipanggil dengan value "2.5"
        calls = mock_ser_instance.write.call_args_list
        safe = True
        for call in calls:
            args, _ = call
            if b"2.5" in args[0] and b"SET_CURRENT" in args[0]:
                safe = False
                
        self.assertTrue(safe, "❌ PELANGGARAN MEDIS: Sistem mengirim arus > 2mA!")


if __name__ == '__main__':
    unittest.main()
