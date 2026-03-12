import { useState, useEffect } from 'react';
import mqtt from 'mqtt';

export const useNeuroMqtt = () => {
    const [neuroData, setNeuroData] = useState(null);
    const [status, setStatus] = useState('OFFLINE');

    useEffect(() => {
        // Sesuaikan host dengan IP Raspberry Pi atau Localhost Anda
        const client = mqtt.connect('ws://localhost:9001');

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
