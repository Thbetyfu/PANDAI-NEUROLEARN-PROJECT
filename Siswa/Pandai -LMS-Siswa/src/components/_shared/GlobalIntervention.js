import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useNeuroListener } from '@/hooks/useNeuroListener';

export default function GlobalIntervention({ children }) {
    const { neuroState, isSimulating, setIsSimulating, triggerSimulation } = useNeuroListener();
    const router = useRouter();

    const [showPopup, setShowPopup] = useState(false);
    const [popupContent, setPopupContent] = useState(null);

    // Mapping logic: DROWSY, HIGH_STRESS, FATIGUE, NORMAL
    useEffect(() => {
        console.log('[GlobalIntervention] State changed:', neuroState);

        let currentState = neuroState;
        if (currentState === 'AWAKE_INTERVENTION') currentState = 'DROWSY';

        if (currentState === 'FATIGUE') {
            // FATIGUE Redirect
            router.push('/course/chapter/minigame');
            setShowPopup(false);
        }
        else if (currentState === 'DROWSY') {
            setPopupContent({
                title: "Mengantuk? 😴",
                message: "Sepertinya kamu butuh kesegaran! Klik tombol ini untuk peregangan.",
                type: 'DROWSY'
            });
            setShowPopup(true);
        }
        else if (currentState === 'HIGH_STRESS') {
            // High stress henti otomatis (pointer-events-none di div utama)
            setPopupContent({
                title: "Stres Tinggi Terdeteksi ⚠️",
                message: "Mari berhenti sejenak. Ambil napas 4 detik, tahan 7 detik, embuskan 8 detik...",
                type: 'HIGH_STRESS'
            });
            setShowPopup(true);

            // AUTO-PAUSE VIDEO MATERI
            document.querySelectorAll('video').forEach(vid => {
                if (!vid.paused) vid.pause();
            });

            // Sembunyikan setelah 60 detik (simulasi relaksasi)
            const timer = setTimeout(() => {
                setShowPopup(false);
                if (isSimulating) triggerSimulation('NORMAL');
            }, 60000);
            return () => clearTimeout(timer);
        }
        else {
            // NORMAL / FOCUSED atau FLOW
            setShowPopup(false);
        }

    }, [neuroState, isSimulating]);

    return (
        <>
            <div className={`relative min-h-screen ${showPopup && popupContent?.type === 'HIGH_STRESS' ? 'opacity-20 pointer-events-none overflow-hidden' : ''}`}>
                {children}
            </div>

            {/* Popup Intervention (Berada di luar div wrapper childrens agar tidak ikut pudar) */}
            {showPopup && popupContent && (
                <div className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center transform transition-all scale-100">
                        <h2 className="text-2xl font-bold mb-4">{popupContent.title}</h2>
                        <p className="text-gray-600 mb-6">{popupContent.message}</p>

                        <button
                            onClick={() => {
                                setShowPopup(false);
                                if (isSimulating) triggerSimulation('NORMAL'); // reset
                            }}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-colors"
                        >
                            {popupContent.type === 'DROWSY' ? "Saya Siap Belajar Lagi!" : "Sudah Lebih Tenang"}
                        </button>
                    </div>
                </div>
            )}

            {/* Badge Normal / Focused */}
            {(neuroState === 'NORMAL' || neuroState === 'FLOW') && (
                <div className="fixed top-4 right-4 z-[9990] bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold shadow-md animate-pulse">
                    Fokusmu luar biasa! Pertahankan 🔥
                </div>
            )}

            {/* Simulation Debug Window untuk Fase 3.1 Testing */}
            <div className="fixed bottom-4 right-4 z-[9999] bg-white p-3 rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-gray-100 opacity-30 hover:opacity-100 transition-opacity">
                <h4 className="text-[10px] font-bold text-gray-800 mb-2 uppercase tracking-wide">Neuro-Client Shield Test</h4>
                <label className="flex items-center space-x-2 text-xs mb-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={isSimulating}
                        onChange={(e) => setIsSimulating(e.target.checked)}
                        className="rounded text-blue-600"
                    />
                    <span className="font-semibold text-gray-700">Override Mode Simulasi</span>
                </label>
                {isSimulating && (
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <button onClick={() => triggerSimulation('DROWSY')} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-2 py-1.5 rounded transition">😴 Drowsy</button>
                        <button onClick={() => triggerSimulation('HIGH_STRESS')} className="bg-red-500 hover:bg-red-600 text-white font-bold px-2 py-1.5 rounded transition">⚠️ Stress</button>
                        <button onClick={() => triggerSimulation('FATIGUE')} className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-2 py-1.5 rounded transition">😫 Fatigue</button>
                        <button onClick={() => triggerSimulation('NORMAL')} className="bg-green-500 hover:bg-green-600 text-white font-bold px-2 py-1.5 rounded transition">✅ Normal</button>
                    </div>
                )}
            </div>
        </>
    );
}
