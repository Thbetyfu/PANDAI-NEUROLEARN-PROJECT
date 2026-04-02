"""
=================================================================
PANDAI Neuro-Client — Vision Engine (Guardian System Core)
=================================================================

ARSITEKTUR:
  - Thread terpisah (_update) agar perhitungan CV tidak mem-freeze UI.
  - threading.Lock() pada semua state mutable agar thread-safe.
  - Frame PIL diexpose untuk CameraWidget (single camera instance).
  - Identitas & emosi tetap berjalan di throttle 10 FPS.

FAIL-SAFE:
  - SerialException, UnicodeDecodeError pada hardware
  - cv2.read() failure → retry tanpa mematikan thread
  - Semua crash internal dibungkus catch-all agar thread abadi
=================================================================
"""

import cv2
import mediapipe as mp
import math
import time
import threading
import collections
from PIL import Image


class VisionEngine:
    def __init__(self, camera_index: int = 0):
        # --- MediaPipe Setup ---
        self.mp_face_mesh = mp.solutions.face_mesh
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            max_num_faces=1,
            refine_landmarks=True,       # Aktifkan landmark iris presisi tinggi
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5,
        )

        # --- Landmark Index (MediaPipe 468-point model) ---
        self.LEFT_EYE  = [33, 160, 158, 133, 153, 144]
        self.RIGHT_EYE = [362, 385, 387, 263, 373, 380]

        # --- Camera ---
        self.camera_index = camera_index
        self.cap = None

        # --- Thread Control ---
        self.is_running = False
        self._lock = threading.Lock()   # Satu lock untuk SEMUA state mutable

        # --- EAR State ---
        self.ear_score   = 0.5
        self.ear_history = collections.deque(maxlen=10)

        # --- Frame Output (untuk CameraWidget di overlay) ---
        self.current_frame: Image.Image | None = None

        # --- Citra Anak (Emosi + Gaze) ---
        self.current_emotion = "NEUTRAL"
        self.pupil_coords    = {"x": 0.5, "y": 0.5}
        self.frame_count     = 0        # FPS throttle counter

        # --- Anti-Cheat / Identity ---
        self.reference_signature   = None
        self.identity_verified     = True
        self.identity_mismatch_frames = 0
        self.no_face_frames        = 0
        self.camera_ready          = False

    @staticmethod
    def list_available_cameras():
        """
        Mendeteksi semua indeks kamera yang tersedia di sistem.
        Mencoba beberapa backend (DSHOW & MSMF) untuk kompatibilitas Windows.
        """
        available = []
        # Kita cek hingga index 5 (biasanya cukup untuk laptop + webcam eksternal)
        for i in range(6):
            # Coba backend DirectShow (Cepat di Windows)
            cap = cv2.VideoCapture(i, cv2.CAP_DSHOW)
            if cap is not None and cap.isOpened():
                success, _ = cap.read()
                if success:
                    available.append(i)
                cap.release()
                continue
            
            # Fallback ke backend default jika DSHOW gagal
            cap = cv2.VideoCapture(i)
            if cap is not None and cap.isOpened():
                available.append(i)
                cap.release()
                
        return available

    # ================================================================
    # HELPER: Jarak Euclidean
    # ================================================================

    def _calc_dist(self, p1, p2) -> float:
        """Jarak Euclidean antara dua MediaPipe NormalizedLandmark."""
        return math.hypot(p2.x - p1.x, p2.y - p1.y)

    def _calc_dist_idx(self, mesh, i1: int, i2: int) -> float:
        return self._calc_dist(mesh[i1], mesh[i2])

    # ================================================================
    # EAR CALCULATION
    # ================================================================

    def _calculate_ear(self, mesh, eye_indices: list) -> float:
        """Eye Aspect Ratio sesuai rumus proposal."""
        p1, p2, p3, p4, p5, p6 = [mesh[i] for i in eye_indices]
        ver1 = self._calc_dist(p2, p6)
        ver2 = self._calc_dist(p3, p5)
        hor  = self._calc_dist(p1, p4)
        if hor == 0:
            return 0.0
        return (ver1 + ver2) / (2.0 * hor)

    # ================================================================
    # CITRA ANAK: EMOSI + GAZE
    # ================================================================

    def _detect_citra_anak(self, mesh):
        """Deteksi Emosi & Pupil via landmark mathematics (lightweight)."""
        m_left, m_right = mesh[61], mesh[291]
        m_top, m_bottom = mesh[13], mesh[14]

        # MAR (Mouth Aspect Ratio) → Senyum
        mar = self._calc_dist(m_top, m_bottom) / (self._calc_dist(m_left, m_right) or 1e-6)

        # Jarak alis → Bingung/Marah
        brow_dist = self._calc_dist(mesh[105], mesh[334])

        # Sudut bibir turun → Sedih
        avg_corner_y = (m_left.y + m_right.y) / 2
        sad_indicator = avg_corner_y - m_top.y

        if mar > 0.4:
            self.current_emotion = "HAPPY"
        elif brow_dist < 0.2:
            self.current_emotion = "CONFUSED/ANGRY"
        elif sad_indicator > 0.05:
            self.current_emotion = "SAD"
        else:
            self.current_emotion = "NEUTRAL"

        # Pupil tracking via Iris landmark (index 468 & 473)
        if len(mesh) > 473:
            iris_l = mesh[468]
            iris_r = mesh[473]
            self.pupil_coords = {
                "x": round((iris_l.x + iris_r.x) / 2, 3),
                "y": round((iris_l.y + iris_r.y) / 2, 3),
            }

    # ================================================================
    # IDENTITY TRACKING (Anti-Cheat)
    # ================================================================

    def _get_face_signature(self, mesh) -> dict | None:
        eye_dist    = self._calc_dist_idx(mesh, 33, 263)
        nose_len    = self._calc_dist_idx(mesh, 1, 2)
        mouth_width = self._calc_dist_idx(mesh, 61, 291)
        face_height = self._calc_dist_idx(mesh, 10, 152)
        if eye_dist == 0:
            return None
        return {
            "eye_nose_ratio":   round(eye_dist / nose_len,    3) if nose_len    != 0 else 0,
            "mouth_eye_ratio":  round(mouth_width / eye_dist, 3),
            "face_width_ratio": round(eye_dist / face_height, 3) if face_height != 0 else 0,
        }

    def set_reference_identity(self):
        """Mengunci wajah saat ini sebagai referensi siswa."""
        print("[Vision] 🔐 Mengunci Identitas Referensi...")
        with self._lock:
            self.reference_signature = "PENDING"
        return True

    def _verify_identity(self, current_sig: dict):
        if not self.reference_signature or self.reference_signature == "PENDING":
            return
        diffs = []
        for key in self.reference_signature:
            ref  = self.reference_signature[key]
            curr = current_sig.get(key, 0)
            if ref == 0:
                continue
            diffs.append(abs(curr - ref) / ref)
        avg_diff = sum(diffs) / len(diffs) if diffs else 0
        if avg_diff > 0.15:
            self.identity_mismatch_frames += 1
            if self.identity_mismatch_frames > 30:
                self.identity_verified = False
        else:
            self.identity_mismatch_frames = 0
            self.identity_verified = True

    # ================================================================
    # FRAME RENDERING: Tambah overlay landmark ke frame
    # ================================================================

    def _draw_eye_landmarks(self, frame_rgb, mesh, img_w: int, img_h: int):
        """Gambar titik hijau di landmark mata — efek UI medis/futuristik."""
        for p in self.LEFT_EYE + self.RIGHT_EYE:
            cx = int(mesh[p].x * img_w)
            cy = int(mesh[p].y * img_h)
            cv2.circle(frame_rgb, (cx, cy), 2, (0, 255, 0), -1)

        # EAR label di pojok kiri atas frame
        ear_text = f"EAR: {self.ear_score:.2f}"
        color    = (239, 68, 68) if self.ear_score < 0.25 else (16, 185, 129)
        cv2.putText(frame_rgb, ear_text, (10, 24),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

    # ================================================================
    # LIFECYCLE
    # ================================================================

    def start(self):
        """Memulai kamera dan algoritma di background thread."""
        self.is_running = True
        self.cap = cv2.VideoCapture(self.camera_index)
        threading.Thread(target=self._update, daemon=True).start()
        return True

    def stop(self):
        """Mematikan kamera dan thread."""
        self.is_running = False
        if self.cap:
            self.cap.release()

    # ================================================================
    # MAIN LOOP (Background Thread)
    # ================================================================

    def _update(self):
        LEFT_EYE  = self.LEFT_EYE
        RIGHT_EYE = self.RIGHT_EYE

        while self.is_running:
            try:
                success, frame = self.cap.read()
                if not success:
                    print("[VISION] ⚠️ Gagal mendapat gambar dari kamera. Mencoba lagi...")
                    time.sleep(1)
                    continue

                # Optimasi: writeable=False sebelum diproses MediaPipe
                frame.flags.writeable = False
                frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                results   = self.face_mesh.process(frame_rgb)
                frame.flags.writeable = True

                # Kita butuh frame RGB yang bisa ditulis untuk overlay
                frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

                if results.multi_face_landmarks:
                    self.no_face_frames = 0
                    mesh = results.multi_face_landmarks[0].landmark

                    # EAR Calculation (rata-rata 2 mata)
                    left_ear  = self._calculate_ear(mesh, LEFT_EYE)
                    right_ear = self._calculate_ear(mesh, RIGHT_EYE)
                    avg_ear   = (left_ear + right_ear) / 2.0

                    with self._lock:
                        self.ear_history.append(avg_ear)
                        self.ear_score = sum(self.ear_history) / len(self.ear_history)

                    # Gambar landmark overlay ke frame
                    img_h, img_w, _ = frame_rgb.shape
                    self._draw_eye_landmarks(frame_rgb, mesh, img_w, img_h)

                    # FPS Throttling: Emosi & Identitas hanya setiap 5 frame (~10 FPS)
                    self.frame_count += 1
                    if self.frame_count >= 5:
                        try:
                            self._detect_citra_anak(mesh)

                            current_sig = self._get_face_signature(mesh)
                            with self._lock:
                                if self.reference_signature == "PENDING" and current_sig:
                                    self.reference_signature = current_sig
                                    print(f"[Vision] ✅ Identitas Terkunci: {self.reference_signature}")
                                elif current_sig:
                                    self._verify_identity(current_sig)
                        except Exception as e_citra:
                            print(f"[VisionEngine] Citra Anak Error: {e_citra}")
                        self.frame_count = 0
                else:
                    self.no_face_frames += 1
                    self.current_emotion = "OFF-CAMERA"
                    if self.no_face_frames > 15:
                        with self._lock:
                            self.ear_score = 0.0

                # Commit frame ke buffer (thread-safe)
                pil_frame = Image.fromarray(frame_rgb)
                with self._lock:
                    self.current_frame = pil_frame

            except Exception as e:
                # 🛡️ JARING PENGAMAN: Thread tidak pernah mati karena crash internal
                print(f"[VISION] 🚨 Engine Penglihatan Crash: {e}")
                time.sleep(0.5)

            time.sleep(0.06)  # ~15 FPS internal throttle (CPU Optimized)

    # ================================================================
    # PUBLIC API
    # ================================================================

    def get_frame(self) -> Image.Image | None:
        """Ambil PIL Image frame terbaru (thread-safe). Untuk CameraWidget."""
        with self._lock:
            return self.current_frame

    def get_ear(self) -> float:
        """Ambil nilai EAR yang sudah dihaluskan (Moving Average)."""
        with self._lock:
            return round(self.ear_score, 3)

    def get_data(self) -> tuple:
        """Shorthand untuk get_frame() + get_ear() sekaligus (satu lock)."""
        with self._lock:
            return self.current_frame, round(self.ear_score, 3)

    def is_camera_active(self) -> bool:
        """Cek apakah kamera terbuka dan thread berjalan."""
        if not self.cap:
            return False
        return self.cap.isOpened() and self.is_running

    def get_citra_anak(self) -> dict:
        """Data emosi + gaze untuk dikirim via MQTT."""
        with self._lock:
            return {
                "emotion":     self.current_emotion,
                "gaze_coords": self.pupil_coords,
            }
