import { useState, useEffect, useRef } from 'react';
import mqtt from 'mqtt';

export function useNeuroListener() {
    const [neuroState, setNeuroState] = useState('NORMAL');
    const [bioData, setBioData] = useState(null);
    const [isSimulating, setIsSimulating] = useState(false);
    const simTimer = useRef(null);

    useEffect(() => {
        let client = null;

        if (isSimulating) {
            // MODE SIMULASI: Dummy data yang berubah-ubah untuk demo tanpa alat
            console.log('[NeuroListener] Mode Simulasi Aktif');

            let idx = 0;
            simTimer.current = setInterval(() => {
                // Hanya timer dummy, data beneran dipicu fungsi triggerSimulation
            }, 5000);

        } else {
            // MODE REAL-TIME MQTT
            console.log('[NeuroListener] Menghubungkan ke Broker Mosquitto (WebSocket port 9001)...');

            // Terhubung ke Public Broker (SSL layer untuk keandalan browser)
            const wsUrl = 'wss://broker.emqx.io:8084/mqtt';
            client = mqtt.connect(wsUrl);

            client.on('connect', () => {
                console.log('[NeuroListener] ✅ Terhubung ke MQTT Broker');
                client.subscribe('pandai/v1/bio/processed');
            });

            client.on('message', (topic, message) => {
                try {
                    const payload = JSON.parse(message.toString());
                    if (payload.payload && payload.payload.metrics) {
                        const metrics = payload.payload.metrics;
                        setBioData(metrics);

                        // Mapping state dari DecisionEngine Neuro-Client (Python)
                        if (metrics.state) {
                            setNeuroState(metrics.state);
                        } else {
                            // Fallback mapping if 'state' wasn't present
                            if (metrics.hrv_rmssd_ms < 20) setNeuroState('FATIGUE');
                            else if (metrics.ear_score < 0.24) setNeuroState('DROWSY');
                            else setNeuroState('NORMAL');
                        }
                    }
                } catch (error) {
                    console.error('[NeuroListener] Error parsing message:', error);
                }
            });

            client.on('error', (err) => {
                console.error('[NeuroListener] ❌ MQTT Connection Error:', err);
            });
        }

        return () => {
            if (simTimer.current) clearInterval(simTimer.current);
            if (client) client.end();
        };
    }, [isSimulating]);

    // Fungsi untuk memicu perubahan di Mode Simulasi (Fase 3.1 Testing)
    const triggerSimulation = (stateName) => {
        setIsSimulating(true);
        setNeuroState(stateName);
        console.log(`[NeuroListener] Trigger Simulasi: ${stateName}`);
    };

    return { neuroState, bioData, isSimulating, setIsSimulating, triggerSimulation };
}
