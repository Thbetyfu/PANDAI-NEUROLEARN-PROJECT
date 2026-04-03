# Siswa/Neuro-Client-Siswa/core/resource_monitor.py
import psutil
import time

class ResourceMonitor:
    """
    Monitor CPU dan Memory secara real-time untuk melakukan 
    Auto-Throttling pada mesin AI PANDAI. 
    (Professor S3 Resilience Module)
    """
    def __init__(self, cpu_limit=85, mem_limit=80):
        self.cpu_limit = cpu_limit
        self.mem_limit = mem_limit
        self.last_check = 0
        self.cached_status = False

    def should_throttle(self):
        """Mengecek apakah sistem sedang overload (Next.js compilation, dsb)."""
        now = time.time()
        if now - self.last_check < 2.0: # Cache selama 2 detik
            return self.cached_status
        
        cpu = psutil.cpu_percent()
        mem = psutil.virtual_memory().percent
        
        self.cached_status = (cpu > self.cpu_limit or mem > self.mem_limit)
        self.last_check = now
        
        if self.cached_status:
            print(f"[MONITOR] ⚠️ High System Load detected (CPU: {cpu}%). Entering Eco-Mode...")
            
        return self.cached_status

    def get_adaptive_sleep(self):
        """Memberikan jeda tambahan jika CPU sedang panas."""
        return 0.1 if self.should_throttle() else 0.03
