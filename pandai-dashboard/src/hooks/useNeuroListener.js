import { useEffect, useRef } from 'react';
import mqtt from 'mqtt';
import { usePandaiStore } from '../store/useStore';

export const useNeuroListener = () => {
    const { setBiometrics, addBiometricData, setIsConnected } = usePandaiStore();
    const lastUpdateRef = useRef(0);

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
            
            const now = Date.now();
            // THROTTLE: Only update UI once every 200ms (5fps) to prevent crashes
            if (now - lastUpdateRef.current < 200) return;
            
            try {
                const payload = JSON.parse(message.toString());
                if (payload && payload.payload && payload.payload.metrics) {
                    const metrics = payload.payload.metrics;
                    
                    lastUpdateRef.current = now;
                    
                    // 🛡️ BEMPER: Default fallback to 0/UNKNOWN preventing NaN/Undefined chart crashes
                    setBiometrics({
                        gsr: metrics.gsr_microsiemens || 0,
                        hrv: metrics.hrv_rmssd_ms || 0,
                        ear: metrics.ear_score || 0,
                        emotion: metrics.emotion || 'UNKNOWN',
                        state: metrics.state || 'OFFLINE'
                    });

                    const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                    addBiometricData({
                        time,
                        gsr: metrics.gsr_microsiemens || 0,
                        hrv: metrics.hrv_rmssd_ms || 0
                    });
                }
            } catch (error) {
                // 🛡️ JARING PENGAMAN: Jika IoT putus asinkron dan mengirim corrupt data,
                // Dashboard tidak akan Blank/Crash (White Screen of Death).
                console.error('[DashboardListener] 🚨 Isolasi Error (Format JSON Corrupt):', error);
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
