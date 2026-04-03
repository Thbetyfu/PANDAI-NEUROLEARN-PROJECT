import paho.mqtt.client as mqtt
import json
import time
import threading
import queue
import config

class MQTTClient:
    """
    MQTT Client dengan Arsitektur 'Safe-Publish Pipeline'.
    Menggunakan dedicated background thread untuk pengiriman data agar tidak memblokir engine.
    """
    def __init__(self, client_id=None, broker_host=None, broker_port=None):
        self.client_id = client_id or config.DEVICE_ID
        self.broker_host = broker_host or config.MQTT_BROKER
        self.broker_port = broker_port or config.MQTT_PORT
        
        # Topic Prefixes
        self.ROOT_TOPIC = f"pandai/v1/{self.client_id}"
        
        # Publisher Queue (Solusi 2: Non-blocking)
        self.publish_queue = queue.Queue(maxsize=100)
        self.is_running = False
        
        self.client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, client_id=self.client_id)
        
        # Callbacks
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.on_disconnect = self.on_disconnect
        
        self.connected = False
        self.message_callbacks = {}

    def is_connected(self):
        return self.connected
        
    def connect(self):
        try:
            print(f"[MQTT] Connecting to {self.broker_host}:{self.broker_port}...")
            self.client.connect_async(self.broker_host, self.broker_port, 60)
            
            # Start network loop
            self.client.loop_start()
            
            # Start background publisher thread
            self.is_running = True
            threading.Thread(target=self._publisher_loop, name="MQTTPublisher", daemon=True).start()
            
            return True
        except Exception as e:
            print(f"[MQTT] Connection failed: {e}")
            return False
            
    def disconnect(self):
        self.is_running = False
        self.client.loop_stop()
        self.client.disconnect()
            
    def _publisher_loop(self):
        """Dedicated thread untuk menguras antrean publish."""
        while self.is_running:
            try:
                # Ambil (topic, payload, qos) dari queue
                topic, payload, qos = self.publish_queue.get(timeout=1.0)
                
                if self.connected:
                    self.client.publish(topic, payload, qos=qos)
            except queue.Empty:
                continue
            except Exception as e:
                print(f"[MQTT-PIPE] Publish Error: {e}")

    def on_connect(self, client, userdata, flags, reason_code, properties):
        if reason_code == 0:
            print(f"[MQTT] Successfully connected to broker")
            self.connected = True
            self.subscribe(f"{self.ROOT_TOPIC}/bio/raw")
            self.subscribe(f"{self.ROOT_TOPIC}/system/safety")
            self.subscribe(f"{self.ROOT_TOPIC}/actuator/tdcs")
            self.subscribe(f"{self.ROOT_TOPIC}/history/request")
            self.subscribe(f"{self.ROOT_TOPIC}/control/camera")
        else:
            # [STRICT-V6.2] Descriptive failure reasons
            error_msg = str(reason_code)
            print(f"[MQTT] ❌ Gagal terhubung (Kode: {error_msg}).")
            if "authorized" in error_msg.lower():
                print("[MQTT] Tip: Server menolak ID ini karena duplikasi. Saya akan mereset ID Anda.")
            self.connected = False
            
    def on_disconnect(self, client, userdata, flags, reason_code, properties):
        print(f"[MQTT] Disconnected from broker")
        self.connected = False
            
    def subscribe(self, topic):
        self.client.subscribe(topic)
        print(f"[MQTT] Subscribed to {topic}")
        
    def add_callback(self, topic, callback):
        self.message_callbacks[topic] = callback
        
    def on_message(self, client, userdata, msg):
        topic = msg.topic
        payload = msg.payload.decode('utf-8')
        for t, callback in self.message_callbacks.items():
            if mqtt.topic_matches_sub(t, topic):
                try:
                    data = json.loads(payload)
                    callback(topic, data)
                except:
                    callback(topic, payload)

    def publish_processed_bio(self, session_id, metrics, hardware_state):
        """[V25.4.2] Full Integrity Payload — Unlocks LMS Security Overlay."""
        if not self.connected: return False
        topic = f"{self.ROOT_TOPIC}/bio/processed"
        
        # [V25.4.2] Mapping all fields required by GlobalIntervention.js and useNeuroListener.js
        payload = {
            "device_id": self.client_id,
            "session_id": session_id,
            "focus_level": metrics.get("focus_level", metrics.get("ear_score", 0.5)),
            "stress_level": metrics.get("stress_level", metrics.get("gsr_microsiemens", 0.0)),
            "attention_index": metrics.get("attention_index", 0.0),
            "face_detected": metrics.get("face_detected", False),       # REQUIRED TO UNLOCK UI
            "available_cameras": metrics.get("available_cameras", []), # REQUIRED FOR DROPDOWN
            "is_drowsy": metrics.get("is_drowsy", False),
            "is_bored": metrics.get("is_bored", False),
            "status": metrics.get("state", "NORMAL"),                  # Sync state
            "timestamp": time.time()
        }
        
        return self.publish(topic, payload, qos=0)

    def send_emergency_off(self):
        print("[MQTT] 🚨 SENDING EMERGENCY OFF 🚨")
        self.publish(f"{self.ROOT_TOPIC}/actuator/tdcs", "EMERGENCY_OFF", qos=2)
        self.publish(f"{self.ROOT_TOPIC}/system/safety", "EMERGENCY_OFF", qos=2)

    def publish(self, topic, payload, qos=1):
        """Non-blocking publish (via queue)."""
        content = json.dumps(payload) if isinstance(payload, (dict, list)) else str(payload)
        try:
            self.publish_queue.put_nowait((topic, content, qos))
            return True
        except queue.Full:
            # Overwrite oldest if full
            try:
                self.publish_queue.get_nowait()
                self.publish_queue.put_nowait((topic, content, qos))
                return True
            except:
                return False
