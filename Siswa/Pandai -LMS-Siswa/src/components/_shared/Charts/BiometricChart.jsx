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

    // Format warna untuk gradient
    const gradientId = useMemo(() => `color${label.replace(/\s/g, '')}`, [label]);

    return (
        <div className="w-full h-40 mt-4 rounded-2xl overflow-hidden bg-white/30 backdrop-blur-md border border-white/20 p-2">
            <div className="flex justify-between items-center mb-1 px-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
                <span className="text-xs font-black" style={{ color }}>{value?.toFixed(2) || "0.00"}</span>
            </div>

            <ResponsiveContainer width="100%" height="80%">
                <AreaChart data={history}>
                    <defs>
                        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.5} />
                    <XAxis dataKey="time" hide />
                    <YAxis domain={[min, max]} hide />
                    <Tooltip
                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '10px' }}
                        labelStyle={{ display: 'none' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="val"
                        stroke={color}
                        strokeWidth={2}
                        fillOpacity={1}
                        fill={`url(#${gradientId})`}
                        isAnimationActive={false} // Atasi lag saat data masuk cepat
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
