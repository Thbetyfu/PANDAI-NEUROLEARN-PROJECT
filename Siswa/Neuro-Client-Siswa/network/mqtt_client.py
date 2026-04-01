import paho.mqtt.client as mqtt
import json
import time
import threading

class MQTTClient:
    def __init__(self, client_id="PANDAI-NC-01", broker_host="localhost", broker_port=1883):
        self.client_id = client_id
        self.broker_host = broker_host
        self.broker_port = broker_port
        
        self.client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, client_id=self.client_id)
        
        # Callbacks
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.client.on_disconnect = self.on_disconnect
        
        self.connected = False
        self.message_callbacks = {}

    def is_connected(self):
        """Mengecek status koneksi ke MQTT Broker."""
        return self.connected
        
    def connect(self):
        try:
            print(f"[MQTT] Connecting to {self.broker_host}:{self.broker_port}...")
            self.client.connect(self.broker_host, self.broker_port, 60)
            
            # Start loop in a separate thread
            self.loop_thread = threading.Thread(target=self.client.loop_forever, daemon=True)
            self.loop_thread.start()
            return True
        except Exception as e:
            print(f"[MQTT] Connection failed: {e}")
            return False
            
    def disconnect(self):
        if self.connected:
            self.client.disconnect()
            
    def on_connect(self, client, userdata, flags, reason_code, properties):
        if reason_code == 0:
            print(f"[MQTT] Successfully connected to broker")
            self.connected = True
            
            # Subscribe to necessary topics
            self.subscribe("pandai/v1/bio/raw")
            self.subscribe("pandai/v1/system/safety")
            self.subscribe("pandai/v1/actuator/tdcs")
            self.subscribe("pandai/v1/history/request")
        else:
            print(f"[MQTT] Connection failed with code {reason_code}")
            
    def on_disconnect(self, client, userdata, flags, reason_code, properties):
        print(f"[MQTT] Disconnected from broker")
        self.connected = False
            
    def subscribe(self, topic):
        self.client.subscribe(topic)
        print(f"[MQTT] Subscribed to {topic}")
        
    def add_callback(self, topic, callback):
        """Add a specific callback for a topic"""
        self.message_callbacks[topic] = callback
        
    def on_message(self, client, userdata, msg):
        topic = msg.topic
        payload = msg.payload.decode('utf-8')
        
        # print(f"[MQTT] Received from {topic}: {payload[:50]}...")
        
        # Route to specific callbacks
        for t, callback in self.message_callbacks.items():
            if mqtt.topic_matches_sub(t, topic):
                try:
                    try:
                        data = json.loads(payload)
                        callback(topic, data)
                    except json.JSONDecodeError:
                        # If not JSON, pass as string
                        callback(topic, payload)
                except Exception as e:
                    # Mencegah logic di dalam callback menghancurkan Thread utama MQTT
                    print(f"[MQTT] 🚨 Isolasi Error: Kegagalan dalam mengeksekusi callback pada topik '{topic}'. Detail: {e}")
                    
    def publish_processed_bio(self, session_id, metrics, hardware_state):
        """Method to publish data according to protocol-iot.md"""
        if not self.connected:
            return False
            
        topic = "pandai/v1/bio/processed"
        
        from datetime import datetime, timezone
        timestamp = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
        
        payload = {
            "header": {
                "device_id": self.client_id,
                "session_id": session_id,
                "timestamp": timestamp
            },
            "payload": {
                "metrics": metrics,
                "hardware_state": hardware_state
            }
        }
        
        try:
            self.client.publish(topic, json.dumps(payload), qos=0)
            return True
        except Exception as e:
            print(f"[MQTT] Publish failed: {e}")
            return False
            
    def send_emergency_off(self):
        """Send emergency stop signal"""
        if self.connected:
            print("[MQTT] 🚨 SENDING EMERGENCY OFF 🚨")
            self.client.publish("pandai/v1/actuator/tdcs", "EMERGENCY_OFF", qos=2)
            self.client.publish("pandai/v1/system/safety", "EMERGENCY_OFF", qos=2)

    def publish(self, topic, payload):
        """Generic publish method."""
        if not self.connected:
            return False
        try:
            self.client.publish(topic, json.dumps(payload) if isinstance(payload, (dict, list)) else str(payload), qos=1)
            return True
        except Exception as e:
            print(f"[MQTT] Generic publish failed: {e}")
            return False
