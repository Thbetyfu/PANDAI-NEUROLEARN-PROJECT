import React from 'react';
import { AlertTriangle, WifiOff, CameraOff, Cpu } from 'lucide-react';

export default function PanicOverlay({ errorType, message }) {
    const getIcon = () => {
        switch (errorType) {
            case 'VisionCriticalError': return <CameraOff size={64} className="text-white mb-4" />;
            case 'MQTTConnectionCriticalError': return <WifiOff size={64} className="text-white mb-4" />;
            case 'SerialCriticalError': return <Cpu size={64} className="text-white mb-4" />;
            default: return <AlertTriangle size={64} className="text-white mb-4" />;
        }
    };

    return (
        <div className="fixed inset-0 z-[9999] bg-rose-600 flex items-center justify-center p-6 text-center">
            <div className="max-w-2xl w-full">
                <div className="flex flex-col items-center animate-bounce mb-8">
                    {getIcon()}
                    <h1 className="text-4xl font-black text-white tracking-tighter">🚨 SYSTEM PANIC 🚨</h1>
                </div>

                <div className="bg-rose-900/50 backdrop-blur-xl border border-rose-400/30 rounded-3xl p-10 shadow-2xl">
                    <h2 className="text-rose-100 font-bold text-xl mb-4 uppercase tracking-widest">
                        Medical Grade Safety Protocol Active
                    </h2>
                    <p className="text-white text-lg font-medium leading-relaxed mb-8">
                        {message || "Sistem mendeteksi kegagalan integritas pada sensor vital. Sesi belajar dihentikan paksa demi validitas data saraf."}
                    </p>

                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-8 py-4 bg-white text-rose-600 font-bold rounded-2xl hover:bg-rose-50 transition-colors shadow-lg"
                        >
                            RE-CALIBRATE SYSTEM
                        </button>
                    </div>
                </div>

                <p className="mt-8 text-rose-200 text-sm italic">
                    PANDAI Security Shield v2.0 - Memastikan keakuratan intervensi tDCS & Biofeedback.
                </p>
            </div>
        </div>
    );
}
