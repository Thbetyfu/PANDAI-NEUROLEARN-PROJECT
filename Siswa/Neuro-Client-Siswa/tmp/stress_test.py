import multiprocessing
import time
import os

def cpu_burner():
    """Peg CPU indefinitely."""
    print(f"Burner process {os.getpid()} started.")
    while True:
        _ = 1000 * 1000 * 1000 # Just busy work

if __name__ == "__main__":
    cpu_count = multiprocessing.cpu_count()
    print(f"Starting {cpu_count} burner processes to simulate extreme system load...")
    
    processes = []
    for _ in range(cpu_count):
        p = multiprocessing.Process(target=cpu_burner)
        p.daemon = True
        p.start()
        processes.append(p)
        
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("Stopping burners...")
        for p in processes:
            p.terminate()
