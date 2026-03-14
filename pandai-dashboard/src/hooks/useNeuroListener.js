import { useEffect } from 'react';
import mqtt from 'mqtt';
import { usePandaiStore } from '../store/useStore';

export const useNeuroListener = () => {
    const { setBiometrics, addBiometricData, addLog, setIsConnected } = usePandaiStore();

    useEffect(() => {
        let isMounted = true;
        const wsUrl = 'wss://broker.emqx.io:8084/mqtt';
        const client = mqtt.connect(wsUrl);

        client.on('connect', () => {
            if (!isMounted) return;
            console.log('[DashboardListener] ✅ Terhubung ke MQTT Broker');
            setIsConnected(true);
            client.subscribe('pandai/v1/bio/processed');
        });

        client.on('message', (topic, message) => {
            if (!isMounted) return;
            try {
                const payload = JSON.parse(message.toString());
                if (payload.payload && payload.payload.metrics) {
                    const metrics = payload.payload.metrics;
                    setBiometrics({
                        gsr: metrics.gsr_microsiemens,
                        hrv: metrics.hrv_rmssd_ms,
                        ear: metrics.ear_score,
                        emotion: metrics.emotion,
                        state: metrics.state
                    });

                    const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                    addBiometricData({
                        time,
                        gsr: metrics.gsr_microsiemens,
                        hrv: metrics.hrv_rmssd_ms
                    });
                }
            } catch (error) {
                console.error('[DashboardListener] Parse Error:', error);
            }
        });

        client.on('close', () => {
            if (isMounted) setIsConnected(false);
        });

        client.on('error', (err) => {
            if (isMounted) setIsConnected(false);
            console.error('[DashboardListener] MQTT Error:', err);
        });

        return () => {
            isMounted = false;
            client.end(true);
        };
    }, []);
};
