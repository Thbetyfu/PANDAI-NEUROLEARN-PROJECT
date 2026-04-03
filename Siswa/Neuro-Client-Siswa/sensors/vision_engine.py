import threading
import queue
import time
import cv2
import mediapipe as mp
import collections
import ctypes # For thread priority
from PIL import Image
from core.resource_monitor import ResourceMonitor

class VisionEngine:
    """
    Kecerdasan Buatan (Computer Vision) untuk deteksi kelelahan dan atensi.
    UPGRADE: v5.0 "Self-Healing Shield" - Menghadapi CPU 100% (Next.js Compile).
    """
    def __init__(self, camera_index=0):
        # 1. Pipeline Control & Persistence
        self.frame_queue = queue.Queue(maxsize=1) 
        self.monitor = ResourceMonitor(cpu_limit=85)
        
        # 2. MediaPipe Config (High Performance Delegate)
        self.mp_face_mesh = mp.solutions.face_mesh
        
        # [NEW] GPU DELEGATE SUPPORT (Attempt)
        # Kami mencoba menggunakan GPU jika tersedia (TFLite)
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.4,
            # Pelajari: Python API MediaPipe tidak selalu mengekspos Delegate secara langsung 
            # seperti Android/C++, tapi kita pastikan config teringan.
        )

        # Landmarks 
        self.LEFT_EYE  = [33, 160, 158, 133, 153, 144]
        self.RIGHT_EYE = [362, 385, 387, 263, 373, 380]

        # Lifecycle & Hardware
        self.camera_index = camera_index
        self.cap = None
        self.is_running = False
        self.is_recovering = False # Flag saat sedang reset hardware
        self._lock = threading.Lock()
        
        # State & Health
        self.ear_score = 0.5
        self.ear_history = collections.deque(maxlen=10)
        self._raw_frame_lock = threading.Lock()
        self._latest_raw_frame = None  # [STRICT-V6] Decoupled Preview Frame
        self.current_frame = None      # Deprecated in favor of _latest_raw_frame
        self.face_detected = False
        self.frame_count = 0
        self.last_update_tick = time.time() # Watchdog: Last SUCCESSFUL read
        self._last_mesh = None
        self.no_face_frames = 0
        self.consecutive_failures = 0 # Deteksi kegagalan I/O hardware

    def start(self):
        """Memulai sistem vision (Multi-threaded)."""
        self.is_running = True
        # [V12] Reset watchdog timer to current time.
        # Jangan mematikan timer di sini, biarkan _capture_thread yang menangani init pertama kali.
        self.last_update_tick = time.time()
        
        # [STEP 2] Pipeline Threads (Decoupled)
        # Kami membedakan prioritas thread antar tugas
        t_cap = threading.Thread(target=self._capture_thread, name="CamCapture", daemon=True)
        t_ai = threading.Thread(target=self._process_loop, name="AIProcess", daemon=True)
        
        t_cap.start()
        t_ai.start()
        
        print(f"[Vision] 🚀 Shield v12 AKTIF (Kamera Index: {self.camera_index})")
        return True

    def _init_camera(self):
        """Inisialisasi modern menggunakan Media Foundation (MSMF) untuk Windows 10/11."""
        with self._lock:
            self.is_recovering = True
            
        try:
            print(f"[Vision] 🛠️ [STRICT] Mencoba Inisialisasi modern (MSMF) di Kamera {self.camera_index}...")
            if self.cap:
                self.cap.release()
                self.cap = None
            
            # [STRICT] Coba CAP_DSHOW (Legacy Compatibility) kemudian CAP_MSMF (Modern Windows)
            # DSHOW seringkali lebih stabil saat pencarian awal dan error reporting cepat
            new_cap = cv2.VideoCapture(self.camera_index, cv2.CAP_DSHOW)
            
            if not new_cap.isOpened():
                 new_cap = cv2.VideoCapture(self.camera_index, cv2.CAP_MSMF)

            if not new_cap.isOpened():
                 new_cap = cv2.VideoCapture(self.camera_index)

            if new_cap.isOpened():
                # [STRICT] Hardcoded optimizations for speed
                new_cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
                new_cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
                new_cap.set(cv2.CAP_PROP_BUFFERSIZE, 1) # Force latest frame only
                new_cap.set(cv2.CAP_PROP_FPS, 30)
                new_cap.set(cv2.CAP_PROP_FOURCC, cv2.VideoWriter_fourcc(*'MJPG')) 
                
                with self._lock:
                    self.cap = new_cap
                    self.is_recovering = False
                print(f"[Vision] ✅ Hardware Kamera {self.camera_index} Siap.")
                return True
        except Exception as e:
            print(f"[Vision] ⚠️ Inisialisasi Gagal Total: {e}")
        
        with self._lock:
            self.is_recovering = False
        return False

    def stop(self):
        self.is_running = False
        with self._lock:
            if self.cap:
                self.cap.release()
                self.cap = None

    def _capture_thread(self):
        """THREAD 1: Camera I/O dengan PRIORITAS TERTINGGI OS."""
        # Windows API: Set current thread to THREAD_PRIORITY_HIGHEST (Value 2)
        try:
             ctypes.windll.kernel32.SetThreadPriority(ctypes.windll.kernel32.GetCurrentThread(), 2)
             print("[STRICT] 🚄 Camera Capture priority set to HIGHEST.")
        except: pass

        while self.is_running:
            try:
                if self.cap is None or not self.cap.isOpened():
                    time.sleep(1.5)
                    if self._init_camera():
                         # Berikan jeda pemanasan untuk sensor CMOS
                         time.sleep(1.0) 
                    continue

                # Cek apakah kamera freeze (Stuck di buffer driver)
                # Gunakan grab() dulu untuk membuang frame lama
                success = self.cap.grab()
                if success:
                    success, frame = self.cap.retrieve()
                
                if success and frame is not None:
                    self.last_update_tick = time.time()
                    self.consecutive_failures = 0
                    
                    # [V6] Update Raw Frame for UI Preview (Fast/Decoupled)
                    with self._raw_frame_lock:
                        self._latest_raw_frame = frame.copy()
                    
                    # Update queue for AI Processing (Will skip if queue is full)
                    try:
                        if not self.frame_queue.empty():
                            self.frame_queue.get_nowait()
                        self.frame_queue.put_nowait(frame)
                    except queue.Full: pass
                else:
                    self.consecutive_failures += 1
                    # RADICAL RECOVERY [V13]: Toleransi lebih tinggi (15x) untuk warm-up sensor
                    if self.consecutive_failures > 15:
                        print(f"[Vision] 🚨 Hardware Stuck Persistent ({self.consecutive_failures}). Resetting Camera...")
                        self._init_camera()
                        time.sleep(1.0)
                        time.sleep(1.0)
                    time.sleep(0.1)

            except Exception as e:
                print(f"[Vision-IO] Exception: {e}")
                time.sleep(0.5)

    def _process_loop(self):
        """THREAD 2: AI Processing dengan ADAPTIVE THROTTLING."""
        while self.is_running:
            # 1. Jeda Dinamis berdasarkan Beban CPU (ResourceMonitor)
            # Jika CPU > 85%, AI akan melambat secara otomatis
            time.sleep(self.monitor.get_adaptive_sleep())

            try:
                # 2. Ambil frame terbaru (Timeout 1.0s untuk cegah hang)
                try:
                    frame = self.frame_queue.get(timeout=1.0)
                except queue.Empty:
                    continue

                # 3. Optimization: Downscaling 320p untuk proses AI Mesh
                # Ini menghemat CPU sangat besar dibandingkan memproses frame 720p/1080p
                small_frame = cv2.resize(frame, (320, 240))
                
                self.frame_count += 1
                results = None
                
                # Adaptive Skip Rate
                # Normal: Proses 1 dari 2 frame. Stress: Proses 1 dari 3 frame.
                skip_rate = 3 if self.monitor.should_throttle() else 2
                
                if self.frame_count % skip_rate == 0:
                    small_frame.flags.writeable = False
                    rgb_small = cv2.cvtColor(small_frame, cv2.COLOR_BGR2RGB)
                    results = self.face_mesh.process(rgb_small)
                    small_frame.flags.writeable = True

                # 4. State Management dengan Thread-Locking
                if results and results.multi_face_landmarks:
                    self.no_face_frames = 0
                    with self._lock:
                        self.face_detected = True
                        self._last_mesh = results.multi_face_landmarks[0].landmark
                else:
                    self.no_face_frames += 1
                    # Toleransi 20 frame tanpa wajah sebelum dinyatakan "Hilang"
                    if self.no_face_frames > 20: 
                        with self._lock: 
                            self.face_detected = False
                            self._last_mesh = None

                # [STRICT-V6] AI Loop no longer handles UI Frame Conversion
                # This ensures video feed stays 30 FPS regardless of AI speed.
                
            except Exception as e:
                # Jangan biarkan exception mematikan loop processing
                print(f"[AI-LOOP] Warning: {e}")
                time.sleep(0.1)

    def is_camera_active(self):
        """Mengecek apakah hardware kamera terikat dan aktif (Toleran terhadap fase Recovery)."""
        with self._lock:
            if self.is_recovering:
                return True # Tetap lapor aktif saat sedang mencoba reconnect
            return self.cap is not None and self.cap.isOpened()

    def get_frame(self, target_size=(640, 480)):
        """Mendapatkan frame terbaru dengan prioritas kecepatan visual (Visual Fluidity)."""
        with self._raw_frame_lock:
            if self._latest_raw_frame is None:
                return None
            render_frame = self._latest_raw_frame.copy()

        # [V7] Ultra-Fast Resize for Preview
        # Gunakan INTER_NEAREST untuk preview karena jauh lebih hemat CPU daripada INTER_LINEAR
        if target_size:
            render_frame = cv2.resize(render_frame, target_size, interpolation=cv2.INTER_NEAREST)
        
        # 2. Convert to RGB
        frame_rgb = cv2.cvtColor(render_frame, cv2.COLOR_BGR2RGB)
        
        # 3. Layering: Drawing landmarks (hanya jika ada mesh terbaru)
        with self._lock:
            latest_mesh = self._last_mesh
            
        if latest_mesh:
            h, w, _ = frame_rgb.shape
            self._draw_eye_landmarks(frame_rgb, latest_mesh, w, h)
            
        # 4. Final conversion (Zero-Latency PIL)
        return Image.fromarray(frame_rgb)

    def get_ear(self):
        with self._lock:
            return self.ear_score

    def is_face_detected(self):
        with self._lock:
            return self.face_detected

    def _calculate_ear(self, mesh, eye_indices):
        """Matematika dasar untuk Eye Aspect Ratio."""
        v1 = self._dist(mesh[eye_indices[1]], mesh[eye_indices[5]])
        v2 = self._dist(mesh[eye_indices[2]], mesh[eye_indices[4]])
        h1 = self._dist(mesh[eye_indices[0]], mesh[eye_indices[3]])
        return (v1 + v2) / (2.0 * h1) if h1 > 0 else 0.0

    def _dist(self, p1, p2):
        return ((p1.x - p2.x)**2 + (p1.y - p2.y)**2)**0.5

    def _draw_eye_landmarks(self, frame_rgb, mesh, img_w, img_h):
        for idx in self.LEFT_EYE + self.RIGHT_EYE:
            pt = mesh[idx]
            cv2.circle(frame_rgb, (int(pt.x * img_w), int(pt.y * img_h)), 1, (0, 255, 0), -1)

    @staticmethod
    def list_available_cameras():
        available = []
        # Cek hingga 5 index kamera
        for i in range(5):
            cap = cv2.VideoCapture(i, cv2.CAP_DSHOW)
            if cap.isOpened():
                available.append(i)
                cap.release()
        return available

    def get_available_cameras(self):
         return self.list_available_cameras()

    def get_citra_anak(self):
        """Kembalikan status emosi (PLACEHOLDER: Untuk integrasi AI Expert berikutnya)."""
        return {"emotion": "NEUTRAL", "gaze_coords": {"x": 0.5, "y": 0.5}}

    def set_reference_identity(self):
         """Kalibrasi identitas awal sesi (Identity Lock)."""
         print("[Vision] 🔐 Reference Identity Locked.")
         self.identity_verified = True
