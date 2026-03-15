import cv2
import mediapipe as mp
import time
from threading import Thread
import collections

class VisionEngine:
    def __init__(self, camera_index=0):
        self.mp_face_mesh = mp.solutions.face_mesh
        self.face_mesh = self.mp_face_mesh.FaceMesh(refine_landmarks=True)
        self.ear_score = 0.5
        self.ear_history = collections.deque(maxlen=10)
        self.no_face_frames = 0
        self.is_running = False
        self.cap = None
        self.camera_index = camera_index
        
        # New: Emotion & Gaze States
        self.current_emotion = "NEUTRAL"
        self.pupil_coords = {"x": 0.5, "y": 0.5}
        self.frame_count = 0 # Untuk FPS Throttling

    def _calculate_distance(self, p1, p2):
        return ((p1.x - p2.x)**2 + (p1.y - p2.y)**2)**0.5

    def _calculate_ear(self, landmarks, eye_indices):
        p1, p2, p3, p4, p5, p6 = [landmarks[i] for i in eye_indices]
        ver1 = self._calculate_distance(p2, p6)
        ver2 = self._calculate_distance(p3, p5)
        hor = self._calculate_distance(p1, p4)
        if hor == 0:
            return 0.0
        return (ver1 + ver2) / (2.0 * hor)

    def _detect_citra_anak(self, mesh):
        """Deteksi Emosi & Pupil menggunakan Matematika Landmark (Lightweight)"""
        # 1. EMOSI: Senyum (Happy) via Mouth Aspect Ratio (MAR)
        # Landmarks Bibir: 61 (kiri), 291 (kanan), 13 (atas), 14 (bawah)
        m_left, m_right = mesh[61], mesh[291]
        m_top, m_bottom = mesh[13], mesh[14]
        
        mar = self._calculate_distance(m_top, m_bottom) / self._calculate_distance(m_left, m_right)
        
        # 2. EMOSI: Bingung/Marah via Jarak Alis
        # Landmarks Alis: 105 (kiri), 334 (kanan)
        brow_dist = self._calculate_distance(mesh[105], mesh[334])
        
        # 3. EMOSI: Sedih via Posisi Sudut Bibir vs Tengah
        avg_corner_y = (m_left.y + m_right.y) / 2
        sad_indicator = avg_corner_y - m_top.y
        
        # Logic Klasifikasi
        if mar > 0.4: self.current_emotion = "HAPPY"
        elif brow_dist < 0.2: self.current_emotion = "CONFUSED/ANGRY"
        elif sad_indicator > 0.05: self.current_emotion = "SAD"
        else: self.current_emotion = "NEUTRAL"
        
        # 4. PUPIL TRACKING (Estimasi via Landmark Mata)
        # Landmark Mata: 468 (kiri), 473 (kanan) - Iris Center di Face Mesh
        if len(mesh) > 473:
            iris_left = mesh[468]
            iris_right = mesh[473]
            self.pupil_coords = {
                "x": round((iris_left.x + iris_right.x) / 2, 3),
                "y": round((iris_left.y + iris_right.y) / 2, 3)
            }

    def start(self):
        self.is_running = True
        self.cap = cv2.VideoCapture(self.camera_index)
        Thread(target=self._update, daemon=True).start()
        return True

    def stop(self):
        self.is_running = False
        if self.cap:
             self.cap.release()

    def _update(self):
        # Indeks landmark mata kiri/kanan MediaPipe
        LEFT_EYE = [33, 160, 158, 133, 153, 144]
        RIGHT_EYE = [362, 385, 387, 263, 373, 380] # Tambahan presisi: Dua mata
        
        while self.is_running:
            try:
                success, frame = self.cap.read()
                if success:
                    results = self.face_mesh.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
                    if results.multi_face_landmarks:
                        self.no_face_frames = 0
                        mesh = results.multi_face_landmarks[0].landmark
                        
                        # Hitung rata-rata 2 mata agar lebih akurat dibanding 1 sebelah saja
                        left_ear = self._calculate_ear(mesh, LEFT_EYE)
                        right_ear = self._calculate_ear(mesh, RIGHT_EYE)
                        avg_ear = (left_ear + right_ear) / 2.0
                        
                        self.ear_history.append(avg_ear)
                        # Smoothening result
                        self.ear_score = sum(self.ear_history) / len(self.ear_history)
                        
                        # FPS Throttling: Emosi & Pupil hanya diproses setiap 5 frame (~10 FPS)
                        self.frame_count += 1
                        if self.frame_count >= 5:
                            try:
                                self._detect_citra_anak(mesh)
                            except Exception as e_citra:
                                print(f"[VisionEngine] Citra Anak Error: {e_citra}")
                            self.frame_count = 0
                    else:
                        self.no_face_frames += 1
                        self.current_emotion = "OFF-CAMERA"
                        if self.no_face_frames > 15: # Jika separuh detik tidak ada wajah
                            self.ear_score = 0.0 # Force Drowsy / Alert System
            except Exception as e:
                print(f"[VisionEngine] Critical Error: {e}")
                time.sleep(1) # Chill before retry
            time.sleep(0.06) # ~15 FPS internal throttle (CPU Optimized)

    def get_ear(self) -> float:
        return round(self.ear_score, 3)

    def is_camera_active(self):
        """Mengecek apakah kamera terbuka dan menghasilkan frame."""
        if not self.cap: return False
        return self.cap.isOpened() and self.is_running
        
    def get_citra_anak(self):
        """Mengembalikan data emosi dan koordinat pupil untuk MQTT"""
        return {
            "emotion": self.current_emotion,
            "gaze_coords": self.pupil_coords
        }
