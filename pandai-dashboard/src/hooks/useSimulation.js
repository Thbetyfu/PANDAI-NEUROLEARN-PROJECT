import { useEffect } from 'react';
import { usePandaiStore } from '../store/useStore';

export const useSimulation = () => {
    const { setBiometrics, addBiometricData, addLog } = usePandaiStore();

    useEffect(() => {
        const interval = setInterval(() => {
            const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

            // Simulate data trends slightly
            const gsr = Math.floor(Math.random() * 40) + 30; // 30-70 range
            const hrv = Math.floor(Math.random() * 40) + 40; // 40-80 range
            const ear = (Math.random() * 0.5 + 0.5).toFixed(2); // 0.5 - 1.0

            setBiometrics({ gsr, hrv, ear });
            addBiometricData({ time, gsr, hrv });

            // Randomly add log (10% chance)
            if (Math.random() > 0.9) {
                const types = ['tDCS', 'Led'];
                const actions = ['Micro-break triggered', 'Focus boost activated', 'Relaxation prompt sent', 'Attention drift detected'];
                const students = ['Budi Santoso', 'Siti Aminah', 'Rizky Ramadhan', 'Dewi Putri', 'Ahmad Hidayat'];

                addLog({
                    type: types[Math.floor(Math.random() * types.length)],
                    student: students[Math.floor(Math.random() * students.length)],
                    action: actions[Math.floor(Math.random() * actions.length)],
                    time: time
                });
            }

        }, 2000); // Update every 2 seconds

        return () => clearInterval(interval);
    }, [setBiometrics, addBiometricData, addLog]);
};
