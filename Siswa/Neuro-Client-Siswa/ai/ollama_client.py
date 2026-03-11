import requests
import json
import threading

class LocalAIClient:
    def __init__(self, host="127.0.0.1", port=11434, model="gemma2:2b"):
        self.base_url = f"http://{host}:{port}/api/generate"
        self.model = model
        
    def get_suggestion(self, context, prompt=None):
        """Memanggil Ollama API secara sinkron"""
        
        # System Prompt khusus PANDAI
        if not prompt:
            prompt = (
                f"Kamu adalah AI asisten pendidik untuk 'PANDAI NEUROLEARN'. "
                f"Siswa saat ini mengalami masalah: '{context}'. "
                f"Tolong beri saran singkat 1-2 kalimat (Maksimal 20 kata). "
                f"Gunakan bahasa Indonesia baku dan ramah, "
                f"Saran harus mengajak istirahat atau fokus ulang."
            )
            
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False # Matikan stream untuk respon utuh sekaligus
        }
        
        headers = {
            "Content-Type": "application/json"
        }
        
        # print(f"[AI] Menghubungi Ollama di {self.base_url} (Model: {self.model})...")
        try:
            # Gunakan timeout pendek (10s) agar tidak hang jika server mati
            response = requests.post(self.base_url, json=payload, headers=headers, timeout=10.0)
            
            if response.status_code == 200:
                data = response.json()
                return data.get("response", "Tidak ada respon.")
            else:
                 return f"Error [{response.status_code}]: {response.text}"
                 
        except requests.exceptions.ConnectionError:
            return "Peringatan E03: Server AI Lokal (Ollama) tidak merespon/mati."
        except requests.exceptions.Timeout:
            return "Peringatan E03: Timeout saat menghubungi AI. Terlalu sibuk."
        except Exception as e:
            return f"Terjadi kesalahan saat memproses AI: {e}"
