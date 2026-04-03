import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useNeuroListener } from '@/hooks/useNeuroListener';
import { Camera, Brain, Lock, RefreshCcw, WifiOff } from 'lucide-react';
import PanicOverlay from '../Common/PanicOverlay';

export default function GlobalIntervention({ children }) {
    const { 
        neuroState, 
        bioData, 
        isSimulating, 
        setIsSimulating, 
        triggerSimulation, 
        isConnected,
        switchCamera 
    } = useNeuroListener();
    const router = useRouter();

    const [showPopup, setShowPopup] = useState(false);
    const [popupContent, setPopupContent] = useState(null);
    const [isFaceLocked, setIsFaceLocked] = useState(false);
    const [faceTimer, setFaceTimer] = useState(10); // Countdown 10 detik

    // [V25.9.3] QUANTUM LOCK: Direct mapping from bioData to Lock State
    useEffect(() => {
        const isFaceDetected = bioData?.face_detected;
        
        if (!isFaceDetected && !isSimulating) {
            // Instant Lock
            setIsFaceLocked(true);
        } else {
            // Instant Unlock
            setIsFaceLocked(false);
            setFaceTimer(10); // Reset for internal logic if needed
        }
    }, [bioData?.face_detected, isSimulating]);

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
            {/* INTEGRITY GUARD: Panic Overlay if MQTT Disconnected or Data Lost and not simulating */}
            {!isConnected && !isSimulating && (
                <PanicOverlay
                    errorType="MQTTConnectionCriticalError"
                    message="Koneksi ke Jalur Saraf (Cloud Broker) terputus. Sistem intervensi tidak dapat menjamin validitas data kognitif Anda."
                />
            )}

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
            {(neuroState === 'NORMAL' || neuroState === 'FLOW') && !isFaceLocked && (
                <div className="fixed top-4 right-4 z-[9990] bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold shadow-md animate-pulse">
                    Fokusmu luar biasa! Pertahankan 🔥
                </div>
            )}

            {/* HARD LOCK OVERLAY (Face Detection Missing) */}
            {(faceTimer < 5 || isFaceLocked) && !isSimulating && (
                <div className={`fixed inset-0 z-[10000] flex items-center justify-center transition-all duration-500 ${isFaceLocked ? 'bg-black/90 backdrop-blur-xl' : 'bg-orange-600/20 backdrop-blur-sm'}`}>
                    <div className="bg-white/10 border border-white/20 p-10 rounded-[32px] shadow-2xl max-w-lg w-full text-center backdrop-blur-md">
                        <div className="relative mb-8 flex justify-center">
                            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                                <Camera size={48} className="text-white" />
                            </div>
                            <div className="absolute -top-2 -right-2 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center border-4 border-white">
                                <Lock size={16} className="text-white" />
                            </div>
                        </div>

                        <h2 className="text-3xl font-black text-white mb-4 tracking-tight">KONTROL KAMERA AKTIF</h2>

                                <p className="text-white/80 text-lg leading-relaxed">
                                    PANDAI Shield tidak mendeteksi kehadiranmu! <br />
                                    <strong>Sesi belajar telah dikunci secara otomatis.</strong>
                                </p>
                                <div className="text-6xl font-black text-white py-4">
                                     ⛔ SHIELD ACTIVE
                                </div>
                                <div className="space-y-6">
                                    <p className="text-white/80 text-lg leading-relaxed">
                                        Sesi belajar ditangguhkan demi keamanan dan akurasi data. <br />
                                        <strong>Mohon aktifkan kamera Laptop Anda dan posisikan wajah di depan layar.</strong>
                                    </p>
                                    <div className="flex items-center justify-center gap-3 py-4 bg-white/10 rounded-2xl border border-white/5">
                                        <RefreshCcw size={20} className="text-white animate-spin" />
                                        <span className="text-white font-bold uppercase tracking-widest text-xs">Menunggu Sinyal Neuro-Client...</span>
                                    </div>

                                    {/* CAMERA SELECTOR UI */}
                                    <div className="mt-8 pt-6 border-t border-white/10 space-y-4 text-left">
                                        <label className="text-white/50 text-xs font-bold uppercase tracking-widest block px-2">Cek & Pilih Kamera Aktif:</label>
                                        <div className="flex gap-2">
                                            <select 
                                                defaultValue={0}
                                                onChange={(e) => switchCamera(parseInt(e.target.value))}
                                                className="flex-1 bg-white/5 border border-white/10 text-white rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer hover:bg-white/10"
                                            >
                                                {bioData?.available_cameras?.length > 0 ? (
                                                    bioData.available_cameras.map((idx) => (
                                                        <option key={idx} value={idx} className="bg-slate-900 py-2">📸 Gunakan Kamera {idx}</option>
                                                    ))
                                                ) : (
                                                    <option className="bg-slate-900">Mencari Kamera...</option>
                                                )}
                                            </select>
                                        </div>
                                        <p className="text-[10px] text-white/30 px-2 italic text-center">Indeks kamera dideteksi otomatis oleh Neuro-Client Python.</p>
                                    </div>
                                </div>

                        <div className="mt-8 pt-8 border-t border-white/10">
                            <p className="text-white/50 text-[10px] uppercase font-bold tracking-widest">PANDAI NeuroLearn Security Protocol v2.2</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
