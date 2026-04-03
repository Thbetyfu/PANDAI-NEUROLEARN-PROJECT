import { useState, useEffect, useRef } from 'react';
import mqtt from 'mqtt';

export function useNeuroListener() {
    const [neuroState, setNeuroState] = useState('NORMAL');
    const [bioData, setBioData] = useState(null);
    const [isSimulating, setIsSimulating] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const simTimer = useRef(null);
    const mqttClientRef = useRef(null);

    useEffect(() => {
        if (!mqttClientRef.current) {
            // Unify with Python: Use Public Cloud Broker to avoid local WebSocket issues
            const client = mqtt.connect('wss://broker.emqx.io:8084/mqtt', {
                clientId: `LMS_WEB_${Math.random().toString(16).slice(3)}`,
                clean: true,
                reconnectPeriod: 5000,
            });

            const DEVICE_ID = "PANDAI_NC_01";
            const PROCESSED_TOPIC = `pandai/v1/${DEVICE_ID}/bio/processed`;
            const CONTROL_TOPIC = `pandai/v1/${DEVICE_ID}/control/camera`;

            client.on('connect', () => {
                console.log('✅ Connected to Public MQTT Broker (EMQX)');
                setIsConnected(true);
                client.subscribe([PROCESSED_TOPIC], (err) => {
                    if (!err) console.log(`📡 Subscribed to ${PROCESSED_TOPIC}`);
                });
            });

            client.on('message', (topic, message) => {
                if (topic === PROCESSED_TOPIC) {
                    try {
                        const data = JSON.parse(message.toString());
                        
                        // [V25.4.3] Corrected state handling
                        setBioData(data);
                        if (data.status) {
                            // Only update neuroState if the status string changes (to avoid over-renders)
                            setNeuroState(data.status); 
                        }
                    } catch (e) {
                        console.error('Error parsing MQTT message:', e);
                    }
                }
            });

            client.on('error', (err) => {
                console.error('MQTT Error:', err);
                setIsConnected(false);
            });

            client.on('close', () => {
                console.log('MQTT Disconnected');
                setIsConnected(false);
            });

            mqttClientRef.current = client;
        }

        return () => {
            // Persistent client across re-renders
        };
    }, []);

    const triggerSimulation = (stateName) => {
        setIsSimulating(true);
        setNeuroState(stateName);
    };

    const switchCamera = (index) => {
        if (mqttClientRef.current && isConnected) {
            console.log(`[NeuroListener] Sending camera switch command to index: ${index}`);
            const DEVICE_ID = "PANDAI_NC_01";
            const CONTROL_TOPIC = `pandai/v1/${DEVICE_ID}/control/camera`;
            mqttClientRef.current.publish(CONTROL_TOPIC, JSON.stringify({ index }));
        } else {
            console.warn('[NeuroListener] Cannot switch camera: MQTT client not connected');
        }
    };

    return { neuroState, bioData, isSimulating, setIsSimulating, triggerSimulation, isConnected, switchCamera };
}
