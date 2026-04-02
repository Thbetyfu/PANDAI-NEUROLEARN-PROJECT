import requests
import json
import threading

class LocalAIClient:
    """
    PANDAI AI Core - Phase 4 (Intelligence Engine)
    Interface untuk Ollama Local LLM dengan Neuro-Personalization.
    """
    def __init__(self, host="127.0.0.1", port=11434, model="gemma2:2b"):
        self.base_url = f"http://{host}:{port}/api/chat"
        self.model = model
        
    def get_suggestion(self, condition=None, history_context=None, prompt=None):
        """
        Memberikan saran belajar berbasis kondisi biometrik & data historis.
        """
        # --- AESTHETIC PROMPTS (High-Intelligence Response) ---
        PROMPTS = {
            "DROWSY": "Siswa menunjukkan penurunan EAR yang signifikan (kantuk). Berikan intervensi kognitif singkat untuk meningkatkan kewaspadaan (misal: cuci muka, stretching).",
            "STRESS": "Log biometrik menunjukkan lonjakan GSR (stres tinggi). Berikan panduan latihan pernapasan taktis 4-4-4 segera.",
            "NORMAL": "Siswa berada dalam zona Flow optimal. Berikan afirmasi positif berbasis sains untuk mempertahankan momentum kognitif.",
            "FATIGUE": "Kelelahan kognitif terdeteksi (HRV rendah). Berikan saran istirahat non-layar selama 10 menit untuk pemulihan neurotransmitter.",
            "CONFUSION": "Pola mata & emosi menunjukkan kebingungan. Sarankan siswa untuk memecah materi menjadi unit yang lebih kecil."
        }
        
        user_message = PROMPTS.get(condition, "Menganalisis performa belajar siswa saat ini...")

        # Integrasi Data Historis (Analysis Pattern)
        if history_context:
            user_message += f"\n\nData historis (30 menit terakhir): {history_context}.\nEvaluasi pola ini dan berikan 1 saran spesifik."

        if prompt:
             user_message = prompt

        payload = {
            "model": self.model,
            "messages": [
                 {
                     "role": "system", 
                     "content": "Kamu adalah PROFESOR PANDAI, pakar Neuro-Sains dan Psikologi Belajar. "
                                "Tugasmu: Memberikan intervensi kognitif real-time yang personal, tajam, namun berempati. "
                                "Gunakan bahasa Indonesia baku yang menginspirasi. MAKSIMAL 30 KATA."
                 },
                 {"role": "user", "content": user_message}
            ],
            "stream": False
        }
        
        try:
            response = requests.post(self.base_url, json=payload, headers={"Content-Type": "application/json"}, timeout=12.0)
            
            if response.status_code == 200:
                data = response.json()
                return data.get("message", {}).get("content", "Teruslah berproses, fokusmu sedang dibentuk! ✨")
            return f"Neuro-AI offline sementara ({response.status_code})."
                 
        except (requests.exceptions.ConnectionError, requests.exceptions.Timeout):
            # EMPATHY FALLBACK (TIDAK BOLEH DIAM SAAT ERROR)
            fallbacks = {
                "DROWSY": "Tarik napas panjang, Profesor melihat energimu menurun. Cobalah berjalan sejenak! 🚶‍♂️",
                "STRESS": "Ketegangan terdeteksi. Pejamkan mata 10 detik, biarkan otakmu beristirahat. 🧘‍♂️",
                "FLOW": "Luar biasa! Pertahankan ritme belajarmu, Profesor bangga padamu. 🔥"
            }
            return fallbacks.get(condition, "Fokus adalah kekuatan supermu. Teruslah belajar! ✨")
        except Exception:
            return "Satu langkah kecil menuju penguasaan ilmu. Tetap semangat! 🚀"
