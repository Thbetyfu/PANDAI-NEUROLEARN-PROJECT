import { useState, useEffect } from 'react';
import mqtt from 'mqtt';

export const useNeuroMqtt = () => {
    const [neuroData, setNeuroData] = useState(null);
    const [status, setStatus] = useState('OFFLINE');

    useEffect(() => {
        // Dinamis sinkronisasi broker eksteral (karena mosquitto mati di local machine)
        const wsUrl = 'wss://broker.emqx.io:8084/mqtt';
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
