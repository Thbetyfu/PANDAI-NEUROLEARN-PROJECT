import React from 'react';
import { AlertTriangle, WifiOff, ShieldAlert } from 'lucide-react';

export default function PanicOverlay({ message }) {
    return (
        <div className="fixed inset-0 z-[9999] bg-stone-900/95 backdrop-blur-md flex items-center justify-center p-6 text-center">
            <div className="max-w-xl w-full">
                <div className="bg-white rounded-3xl p-10 shadow-2xl border-t-8 border-rose-500">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-rose-100 rounded-full">
                            <ShieldAlert size={48} className="text-rose-600 animate-pulse" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">DATA INTEGRITY ALERT</h1>

                    <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                        {message || " Dashboard Guru kehilangan koneksi dengan Jalur Saraf PANDAI. Pengawasan real-time siswa ditangguhkan demi keamanan data."}
                    </p>

                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 mb-8 flex items-start gap-3 text-left">
                        <WifiOff size={20} className="text-amber-600 mt-1 flex-shrink-0" />
                        <p className="text-sm text-amber-800">
                            <strong>Diagnosa:</strong> Jalur MQTT Cloud terputus. Mohon periksa koneksi internet Anda atau hubungi Network Administrator PANDAI.
                        </p>
                    </div>

                    <button
                        onClick={() => window.location.reload()}
                        className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2"
                    >
                        REFRESH DASHBOARD
                    </button>
                </div>

                <p className="mt-6 text-white/40 text-xs font-mono uppercase tracking-[0.2em]">
                    Medical Grade Safety System Activated
                </p>
            </div>
        </div>
    );
}
