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
        
        # New: Anti-Cheat / Identification
        self.reference_signature = None
        self.identity_verified = True # Default true until reference set
        self.identity_mismatch_frames = 0

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

    def _get_face_signature(self, mesh):
        """Menciptakan fingerprint wajah unik berdasarkan rasio jarak landmark."""
        # 1. Jarak Mata (p33 ke p263)
        eye_dist = self._calculate_distance(mesh[33], mesh[263])
        # 2. Panjang Hidung (p1 ke p2)
        nose_len = self._calculate_distance(mesh[1], mesh[2])
        # 3. Lebar Mulut (p61 ke p291)
        mouth_width = self._calculate_distance(mesh[61], mesh[291])
        # 4. Tinggi Wajah (p10 ke p152)
        face_height = self._calculate_distance(mesh[10], mesh[152])
        
        if eye_dist == 0: return None
        
        # Gunakan rasio agar invarian terhadap skala (maju-mundur kepala)
        return {
            "eye_nose_ratio": round(eye_dist / nose_len, 3) if nose_len != 0 else 0,
            "mouth_eye_ratio": round(mouth_width / eye_dist, 3),
            "face_width_ratio": round(eye_dist / face_height, 3) if face_height != 0 else 0
        }

    def set_reference_identity(self):
        """Mengambil sampel wajah saat ini sebagai referensi identitas siswa."""
        print("[Vision] 🔐 Mengunci Identitas Referensi...")
        self.reference_signature = "PENDING" # Flag untuk nunggu frame berikutnya
        return True

    def _verify_identity(self, current_sig):
        """Membandingkan signature saat ini dengan referensi."""
        if not self.reference_signature or self.reference_signature == "PENDING":
            return True
            
        diffs = []
        for key in self.reference_signature:
            ref = self.reference_signature[key]
            curr = current_sig[key]
            if ref == 0: continue
            diffs.append(abs(curr - ref) / ref)
            
        avg_diff = sum(diffs) / len(diffs) if diffs else 0
        
        # Threshold 15% deviasi dianggap orang berbeda/kecurangan
        if avg_diff > 0.15:
            self.identity_mismatch_frames += 1
            if self.identity_mismatch_frames > 30: # ~2 detik mismatch konstan
                self.identity_verified = False
        else:
            self.identity_mismatch_frames = 0
            self.identity_verified = True

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
                if not success:
                    print("[VISION] ⚠️ Gagal mendapat gambar dari kamera. Mencoba lagi...")
                    time.sleep(1)
                    continue
                    
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
                            
                            # Process Identity Tracking
                            current_sig = self._get_face_signature(mesh)
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
                    if self.no_face_frames > 15: # Jika separuh detik tidak ada wajah
                        self.ear_score = 0.0 # Force Drowsy / Alert System
            except Exception as e:
                # Menangkap error MediaPipe/OpenCV agar thread tidak mati
                print(f"[VISION] 🚨 Engine Penglihatan Crash: {e}")
                time.sleep(0.5)
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
