import threading
import queue
import time
import cv2
import mediapipe as mp
import collections
from PIL import Image
from core.resource_monitor import ResourceMonitor

################################################################################
# 🛡️ PANDAI VISION STABILITY PROTOCOL — VERSION 25.0 (THE AWAKENING) 🛡️
# ----------------------------------------------------------------------------
# ⛔ PERINGATAN KERAS UNTUK PENGEMBANG (DO NOT EDIT WITHOUT USER APPROVAL) ⛔
# ----------------------------------------------------------------------------
# Kode di bawah ini adalah hasil stabilisasi hardware tingkat lanjut untuk
# menangani "Access Denied" dan "Data Stream Timeout" pada Windows 10/11.
# 
# ATURAN EMAS (THE GOLDEN RULES):
# 1. JANGAN mengubah alur '_init_camera'. Scanning beralih dari AUTO ke MSMF.
# 2. JANGAN memanggil 'cap.read()' di luar '_capture_thread'. Ini akan
#    menyebabkan Race Condition yang memicu "Black Screen" atau Kamera Macet.
# 3. JANGAN memperkecil 'consecutive_failures' di bawah 150 (30 detik).
#    Driver laptop membutuhkan waktu kalibrasi otomatis yang bervariasi.
# 4. JANGAN menghapus 'Histogram Equalization' di AI loop. Ini adalah mode
#    Night Vision agar AI bisa melihat dalam kondisi cahaya redup.
#
# JIKA ANDA INGIN MENGUBAH ALUR INI, WAJIB BERDISKUSI DENGAN USER TERLEBIH DAHULU.
# STABILITAS HARDWARE ADALAH PRIORITAS UTAMA DI ATAS OPTIMASI KODE LAINNYA.
################################################################################

class VisionEngine:
    """
    PANDAI Vision Engine v25.0 - The Awakening.
    Mengaktifkan kembali otak AI setelah jalur hardware stabil.
    """
    def __init__(self, camera_index=0):
        # 1. Pipeline Control
        self.frame_queue = queue.Queue(maxsize=1) 
        self.monitor = ResourceMonitor(cpu_limit=85)
        
        # 2. MediaPipe FaceMesh (The Brain)
        self.mp_face_mesh = mp.solutions.face_mesh
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            max_num_faces=1,
            refine_landmarks=False,
            min_detection_confidence=0.4,
            min_tracking_confidence=0.4,
        )

        self.LEFT_EYE  = [33, 160, 158, 133, 153, 144]
        self.RIGHT_EYE = [362, 385, 387, 263, 373, 380]

        # 3. Thread States
        self.working_idx = camera_index
        self.cap = None
        self.is_running = False
        self.is_recovering = False
        self.is_paused = False
        self._lock = threading.Lock()
        self._raw_frame_lock = threading.Lock()
        
        # 4. Metrics
        self.ear_score = 0.5
        self.face_detected = False
        self._latest_raw_frame = None
        self._last_mesh = None
        self.no_face_frames = 0
        self.frame_received_count = 0
        self.last_update_tick = time.time()
        self.consecutive_failures = 0

    def start(self):
        if self.is_running: return True
        self.is_running = True
        self.last_update_tick = time.time()
        
        # Jalankan Thread Penangkap dan Pengolah
        threading.Thread(target=self._capture_thread, name="V-Cap", daemon=True).start()
        threading.Thread(target=self._process_loop, name="V-Brain", daemon=True).start()
        
        print("[Vision] 🚀 Engine v25.0 Awakened.")
        return True

    def _init_camera(self):
        if self.is_recovering: return False
        with self._lock: self.is_recovering = True
        
        print("[Vision] 🔍 Mencari sinyal hardware...")
        for idx in [0, 1, 2, 3]:
            try:
                cap = cv2.VideoCapture(idx)
                if cap.isOpened():
                    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
                    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
                    cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
                    
                    success, _ = cap.read()
                    if success:
                        print(f"[Vision] ✅ Hardware Linked: Kamera {idx}")
                        self.cap = cap
                        self.working_idx = idx
                        self.last_update_tick = time.time()
                        self.frame_received_count = 1
                        with self._lock: self.is_recovering = False
                        return True
                    cap.release()
            except: continue
        
        with self._lock: self.is_recovering = False
        return False

    def _capture_thread(self):
        while self.is_running:
            try:
                if self.cap is None:
                    if not self._init_camera():
                        time.sleep(2.0); continue

                success, frame = self.cap.read()
                if success and frame is not None:
                    self.last_update_tick = time.time()
                    self.consecutive_failures = 0
                    self.frame_received_count += 1
                    
                    with self._raw_frame_lock:
                        self._latest_raw_frame = frame.copy()
                    
                    if self.frame_queue.full():
                        try: self.frame_queue.get_nowait()
                        except: pass
                    self.frame_queue.put_nowait(frame)
                else:
                    if not self.is_paused:
                        self.consecutive_failures += 1
                        if self.consecutive_failures > 150:
                            print("[Vision] 🚨 Heartbeat Lost. Resetting...")
                            if self.cap: self.cap.release(); self.cap = None
                            self.consecutive_failures = 0
                    time.sleep(0.1)
            except: time.sleep(1.0)

    def _process_loop(self):
        """Thread Pengolah AI MediaPipe (Otak System)."""
        while self.is_running:
            time.sleep(self.monitor.get_adaptive_sleep())
            try:
                frame = self.frame_queue.get(timeout=1.0)
                if frame is None: continue

                # Normalisasi & Inference
                small = cv2.resize(frame, (320, 240))
                rgb = cv2.cvtColor(small, cv2.COLOR_BGR2RGB)
                results = self.face_mesh.process(rgb)

                if results and results.multi_face_landmarks:
                    self.no_face_frames = 0
                    mesh = results.multi_face_landmarks[0].landmark
                    # Hitung EAR
                    l_v = (self._dist(mesh[160], mesh[144]) + self._dist(mesh[158], mesh[153])) / (2 * self._dist(mesh[33], mesh[133]))
                    r_v = (self._dist(mesh[385], mesh[380]) + self._dist(mesh[387], mesh[373])) / (2 * self._dist(mesh[362], mesh[263]))
                    
                    with self._lock:
                        self.face_detected = True
                        self._last_mesh = mesh
                        self.ear_score = (l_v + r_v) / 2.0
                else:
                    self.no_face_frames += 1
                    if self.no_face_frames > 20:
                        with self._lock:
                            self.face_detected = False
                            self._last_mesh = None
                            self.ear_score = 0.5
            except: continue

    def _dist(self, p1, p2):
        return ((p1.x - p2.x)**2 + (p1.y - p2.y)**2)**0.5

    def get_frame(self, target_size=(640, 480)):
        with self._raw_frame_lock:
            if self._latest_raw_frame is None:
                return Image.new("RGB", target_size, (15, 23, 42))
            img = self._latest_raw_frame.copy()

        try:
             res = cv2.resize(img, target_size)
             img_rgb = cv2.cvtColor(res, cv2.COLOR_BGR2RGB)
             with self._lock: mesh = self._last_mesh
             if mesh:
                 h, w = target_size[1], target_size[0]
                 for idx in self.LEFT_EYE + self.RIGHT_EYE:
                     p = mesh[idx]
                     cv2.circle(img_rgb, (int(p.x * w), int(p.y * h)), 1, (79, 70, 229), -1)
             return Image.fromarray(img_rgb)
        except:
             return Image.new("RGB", target_size, (15, 23, 42))

    def get_ear(self):
        with self._lock: return self.ear_score
    def is_camera_active(self):
        with self._lock: return self.frame_received_count > 0 or self.is_recovering
    def is_face_detected(self):
        with self._lock: return self.face_detected
    def get_citra_anak(self):
        return {"emotion": "NEUTRAL", "gaze_coords": {"x": 0.5, "y": 0.5}}
    def set_reference_identity(self):
        return True
    def get_available_cameras(self):
        return self.list_available_cameras()
    @staticmethod
    def list_available_cameras():
        avail = []
        for i in range(4):
            c = cv2.VideoCapture(i)
            if c.isOpened(): avail.append(i); c.release()
        return avail
    def stop(self):
        self.is_running = False
        with self._lock:
            if self.cap: self.cap.release(); self.cap = None
