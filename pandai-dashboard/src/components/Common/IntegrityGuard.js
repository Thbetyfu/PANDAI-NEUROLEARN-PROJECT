import React from 'react';
import { usePandaiStore } from '../../store/useStore';
import PanicOverlay from './PanicOverlay';
import { useNeuroListener } from '../../hooks/useNeuroListener';

export default function IntegrityGuard({ children }) {
    const isConnected = usePandaiStore((state) => state.isConnected);

    // Inisialisasi listener MQTT global
    useNeuroListener();

    return (
        <>
            {!isConnected && (
                <PanicOverlay
                    message="Dashboard Guru terputus dari jaringan sensor PANDAI. Sesi pemantauan biometrik siswa tidak dapat dilanjutkan saat ini."
                />
            )}
            <div className={!isConnected ? 'blur-sm pointer-events-none' : ''}>
                {children}
            </div>
        </>
    );
}
