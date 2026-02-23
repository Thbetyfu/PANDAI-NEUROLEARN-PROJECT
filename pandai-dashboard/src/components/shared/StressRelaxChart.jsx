import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const StressRelaxChart = ({ data }) => (
    <div className="h-[300px] w-full bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Stress-Relax Balance (Flow Zone)</h3>
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorGsr" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorHrv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="time" hide />
                <YAxis hide domain={[0, 100]} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                {/* Zona Flow State (Arsiran Tengah) */}
                <ReferenceLine y={50} stroke="#6366F1" strokeDasharray="3 3" label={{ position: 'right', value: 'Flow Zone', fill: '#6366F1', fontSize: 10 }} />
                <Area type="monotone" dataKey="gsr" stroke="#EF4444" fillOpacity={1} fill="url(#colorGsr)" name="Stress (GSR)" />
                <Area type="monotone" dataKey="hrv" stroke="#10B981" fillOpacity={1} fill="url(#colorHrv)" name="Relax (HRV)" />
            </AreaChart>
        </ResponsiveContainer>
    </div>
);

export default StressRelaxChart;
