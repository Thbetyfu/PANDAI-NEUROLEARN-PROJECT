import cv2
import mediapipe as mp
import time
from threading import Thread

class VisionEngine:
    def __init__(self, camera_index=0):
        self.mp_face_mesh = mp.solutions.face_mesh
        self.face_mesh = self.mp_face_mesh.FaceMesh(refine_landmarks=True)
        self.ear_score = 0.5
        self.is_running = False
        self.cap = None
        self.camera_index = camera_index

    def _calculate_ear(self, landmarks, eye_indices):
        # Formula: (|p2-p6| + |p3-p5|) / (2*|p1-p4|)
        p1, p2, p3, p4, p5, p6 = [landmarks[i] for i in eye_indices]
        ver1 = ((p2.x - p6.x)**2 + (p2.y - p6.y)**2)**0.5
        ver2 = ((p3.x - p5.x)**2 + (p3.y - p5.y)**2)**0.5
        hor = ((p1.x - p4.x)**2 + (p1.y - p4.y)**2)**0.5
        if hor == 0:
            return 0.0
        return (ver1 + ver2) / (2.0 * hor)

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
        while self.is_running:
            success, frame = self.cap.read()
            if success:
                results = self.face_mesh.process(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
                if results.multi_face_landmarks:
                    mesh = results.multi_face_landmarks[0].landmark
                    self.ear_score = self._calculate_ear(mesh, LEFT_EYE)
            time.sleep(0.03) # ~30 FPS

    def get_ear(self) -> float:
        return round(self.ear_score, 3)
