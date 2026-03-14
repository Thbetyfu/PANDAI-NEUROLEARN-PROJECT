import { useState, useEffect } from 'react';
import mqtt from 'mqtt';

export const useNeuroMqtt = () => {
    const [neuroData, setNeuroData] = useState(null);
    const [status, setStatus] = useState('OFFLINE');

    useEffect(() => {
        let isMounted = true;
        // Dinamis sinkronisasi broker eksteral (karena mosquitto mati di local machine)
        const wsUrl = 'wss://broker.emqx.io:8084/mqtt';
        const client = mqtt.connect(wsUrl);

        client.on('connect', () => {
            if (!isMounted || client.disconnecting) return;
            setStatus('ONLINE');
            client.subscribe('pandai/v1/bio/processed');
        });

        client.on('message', (topic, message) => {
            if (!isMounted) return;
            if (topic === 'pandai/v1/bio/processed') {
                try {
                    setNeuroData(JSON.parse(message.toString()));
                } catch (e) {
                    console.error("MQTT JSON Parse Error", e);
                }
            }
        });

        return () => {
            isMounted = false;
            client.end(true); // force disconnect unmount
        };
    }, []);

    return { neuroData, status };
};
