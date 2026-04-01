import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

/**
 * HistoricalTrendChart - Grafik riwayat kognitif 7 hari terakhir.
 * Memproses data dari MQTT History Response.
 */
export default function HistoricalTrendChart({ data }) {
    if (!data || data.length === 0) {
        return (
            <div className="w-full h-48 bg-gray-50 rounded-3xl flex items-center justify-center border border-dashed border-gray-200">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Belum ada data 7 hari terakhir</p>
            </div>
        );
    }

    return (
        <div className="w-full h-56 bg-white rounded-3xl p-4 shadow-xs border border-gray-100">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                    <XAxis
                        dataKey="date"
                        fontSize={8}
                        tickFormatter={(str) => {
                            const date = new Date(str);
                            return date.toLocaleDateString('id-ID', { weekday: 'short' });
                        }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', fontSize: '10px' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="avg_focus"
                        name="Fokus"
                        stroke="#2563EB"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#2563EB', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="avg_load"
                        name="Beban"
                        stroke="#9333EA"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#9333EA', strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
