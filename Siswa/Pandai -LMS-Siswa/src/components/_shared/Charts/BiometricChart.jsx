import React, { useState, useEffect, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

/**
 * BiometricChart - Komponen grafik real-time premium untuk PANDAI LMS.
 * Digunakan untuk visualisasi metrik saraf (Attention, EAR, dll).
 */
export default function BiometricChart({ value, label, color = "#3B82F6", min = 0, max = 1 }) {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (value !== undefined && value !== null) {
            setHistory(prev => {
                const newData = [...prev, { time: new Date().toLocaleTimeString(), val: value }];
                // Simpan rata-rata 30-40 data poin terakhir agar tidak berat
                if (newData.length > 30) return newData.slice(1);
                return newData;
            });
        }
    }, [value]);

    // [V25.6.2] Sanitize label to create a safe SVG ID
    const gradientId = useMemo(() => `glow-${label.replace(/[^a-zA-Z0-9]/g, '')}`, [label]);

    return (
        <div className="w-full h-44 mt-4 rounded-[28px] overflow-hidden bg-white/5 border border-white/10 p-4 shadow-xl relative group">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-20 transition-opacity group-hover:opacity-40" style={{ backgroundColor: color }}></div>
            
            <div className="flex justify-between items-center mb-4 relative z-10">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }}></div>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]">{label}</span>
                </div>
                <div className="text-right">
                   <span className="text-lg font-black tracking-tighter" style={{ color }}>{value?.toFixed(2) || "0.00"}</span>
                </div>
            </div>

            <div className="h-[90px] w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={history}>
                        <defs>
                            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                                <stop offset="100%" stopColor={color} stopOpacity={0} />
                            </linearGradient>
                            
                            {/* [V25.6.2] The 'Alive' Glow Filter */}
                            <filter id={`glow-filter-${gradientId}`}>
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>
                        
                        <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" strokeDasharray="5 5" />
                        <XAxis dataKey="time" hide />
                        <YAxis domain={[min, max]} hide />
                        
                        {/* Glow Layer (Blurry) */}
                        <Area
                            type="monotone"
                            dataKey="val"
                            stroke={color}
                            strokeWidth={4}
                            strokeOpacity={0.3}
                            fill="transparent"
                            filter={`url(#glow-filter-${gradientId})`}
                            isAnimationActive={false}
                        />

                        {/* Main Signal Line */}
                        <Area
                            type="monotone"
                            dataKey="val"
                            stroke={color}
                            strokeWidth={2}
                            fill={`url(#${gradientId})`}
                            isAnimationActive={false}
                            dot={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            
            {/* Live Indicator */}
            <div className="mt-2 flex items-center justify-end gap-1.5 opacity-30">
                <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest italic">Live Telemetry Active</span>
            </div>
        </div>
    );
}
