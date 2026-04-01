import React, { useState, useEffect } from 'react';
import { usePandaiStore } from '../../store/useStore';
import PanicOverlay from './PanicOverlay';
import { useNeuroListener } from '../../hooks/useNeuroListener';
import ErrorBoundary from './ErrorBoundary';

export default function IntegrityGuard({ children }) {
    const isConnected = usePandaiStore((state) => state.isConnected);
    const [showPanic, setShowPanic] = useState(false);

    // Inisialisasi listener MQTT global
    useNeuroListener();

    useEffect(() => {
        let timer;
        if (!isConnected) {
            // Memberikan "Grace Period" 3 detik jika koneksi terputus sesaat
            // untuk mencegah UI tiba-tiba terkunci (false panic)
            timer = setTimeout(() => {
                setShowPanic(true);
            }, 3000);
        } else {
            setShowPanic(false);
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [isConnected]);

    return (
        <>
            {showPanic && (
                <PanicOverlay
                    message="Dashboard Guru terputus dari jaringan sensor PANDAI. Sesi pemantauan biometrik siswa tidak dapat dilanjutkan saat ini."
                />
            )}
            {/* Menggunakan grayscale + opacity sebagai ganti blur-sm agar lebih ringan bagi browser */}
            <div className={showPanic ? 'opacity-40 grayscale pointer-events-none transition-all duration-700' : 'transition-all duration-700'}>
                <ErrorBoundary>
                    {children}
                </ErrorBoundary>
            </div>
        </>
    );
}
