import { useState, useEffect } from 'react';
import mqtt from 'mqtt';

export const useNeuroMqtt = () => {
    const [neuroData, setNeuroData] = useState(null);
    const [status, setStatus] = useState('OFFLINE');

    useEffect(() => {
        // Dinamis mendeteksi IP/Host LMS agar mqtt websocket tidak putus
        const wsUrl = typeof window !== 'undefined' ? `ws://${window.location.hostname}:9001` : 'ws://localhost:9001';
        const client = mqtt.connect(wsUrl);

        client.on('connect', () => {
            setStatus('ONLINE');
            client.subscribe('pandai/v1/bio/processed');
        });

        client.on('message', (topic, message) => {
            if (topic === 'pandai/v1/bio/processed') {
                try {
                    setNeuroData(JSON.parse(message.toString()));
                } catch (e) {
                    console.error("MQTT JSON Parse Error", e);
                }
            }
        });

        return () => client.end();
    }, []);

    return { neuroData, status };
};
