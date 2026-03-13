import requests
import json
import threading

class LocalAIClient:
    def __init__(self, host="127.0.0.1", port=11434, model="gemma2:2b"):
        # Ganti ke mode chat
        self.base_url = f"http://{host}:{port}/api/chat"
        self.model = model
        
    def get_suggestion(self, context=None, condition=None, prompt=None):
        """Memanggil Ollama API dengan instruksi berbasis kondisi"""
        
        # Tambahkan Mapping Prompt
        PROMPTS = {
            "DROWSY": "Siswa mengantuk. Berikan instruksi singkat yang memicu adrenalin dan kesegaran!",
            "STRESS": "Siswa stres tinggi. Pandu teknik pernapasan 4-7-8 sekarang.",
            "NORMAL": "Siswa fokus. Berikan apresiasi singkat untuk menjaga motivasi.",
            "FATIGUE": "Siswa sangat kelelahan kognitif. Arahkan siswa istirahat penuh dari menatap layar segera."
        }
        
        # Ambil instruksi default jika kondisi tidak dikenal
        user_message = PROMPTS.get(condition, "Berikan tips observasi pendidikan.")

        # Override legacy context (Fase 1 compat)
        if prompt:
             user_message = prompt
        elif context and not condition:
             user_message = f"Siswa mengalami kendala berikut: {context}. Tolong berikan saran 2 kalimat."

        payload = {
            "model": self.model,
            "messages": [
                 {"role": "system", "content": "Kamu adalah AI asisten pendidik PANDAI NEUROLEARN. Jawab maksimal 25 kata dengan bahasa Indonesia baku dan memotivasi."},
                 {"role": "user", "content": user_message}
            ],
            "stream": False
        }
        
        headers = {
            "Content-Type": "application/json"
        }
        
        try:
            response = requests.post(self.base_url, json=payload, headers=headers, timeout=10.0)
            
            if response.status_code == 200:
                data = response.json()
                message = data.get("message", {})
                return message.get("content", "Tidak ada respon dari AI.")
            else:
                 return f"Error [{response.status_code}]: {response.text}"
                 
        except requests.exceptions.ConnectionError:
            return "Tarik napas panjang... mari kita kembalikan fokus optimalmu! ✨ (Ollama Offline)"
        except requests.exceptions.Timeout:
            return "Perhatian menurun, coba tegakkan badan ya! (AI Timeout)"
        except Exception as e:
            return "Fokus adalah kunci! (AI Fallback)"
