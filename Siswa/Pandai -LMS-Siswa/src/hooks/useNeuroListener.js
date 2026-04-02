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
        let client = null;
        let isMounted = true;

        if (isSimulating) {
            // ...
        } else {
            console.log('[NeuroListener] Menghubungkan ke Broker Mosquitto Local (WebSocket port 9001)...');
            const wsUrl = 'ws://localhost:9001'; 
            client = mqtt.connect(wsUrl);
            mqttClientRef.current = client;

            client.on('connect', () => {
                if (!isMounted || client.disconnecting) return;
                setIsConnected(true);
                client.subscribe('pandai/v1/bio/processed');
            });

            client.on('message', (topic, message) => {
                if (!isMounted) return;
                try {
                    const payload = JSON.parse(message.toString());
                    const metrics = payload.payload?.metrics || payload.metrics;
                    if (metrics) {
                        setBioData(metrics);
                        if (metrics.state) setNeuroState(metrics.state);
                    }
                } catch (error) {
                    console.error('[NeuroListener] Error parsing message:', error);
                }
            });

            client.on('close', () => {
                if (isMounted) setIsConnected(false);
            });

            client.on('error', (err) => {
                if (!isMounted) return;
                console.error('[NeuroListener] ❌ MQTT Connection Error:', err);
            });
        }

        const currentClient = client;

        return () => {
            isMounted = false;
            if (simTimer.current) clearInterval(simTimer.current);
            if (currentClient) currentClient.end(true);
            mqttClientRef.current = null;
        };
    }, [isSimulating]);

    const triggerSimulation = (stateName) => {
        setIsSimulating(true);
        setNeuroState(stateName);
    };

    const switchCamera = (index) => {
        if (mqttClientRef.current && isConnected) {
            console.log(`[NeuroListener] Sending camera switch command to index: ${index}`);
            mqttClientRef.current.publish('pandai/v1/control/camera', JSON.stringify({ index }));
        } else {
            console.warn('[NeuroListener] Cannot switch camera: MQTT client not connected');
        }
    };

    return { neuroState, bioData, isSimulating, setIsSimulating, triggerSimulation, isConnected, switchCamera };
}
