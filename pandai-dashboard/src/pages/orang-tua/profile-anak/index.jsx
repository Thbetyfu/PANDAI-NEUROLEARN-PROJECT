import Head from 'next/head';
import DashboardLayout from '@/components/layout/DashboardLayout';


// --- MOCK DATA FOR NEURO-SAFETY ---
const hrvData = [
  { time: '08:00', value: 45 },
  { time: '09:00', value: 55 },
  { time: '10:00', value: 48 },
  { time: '11:00', value: 60 },
  { time: '12:00', value: 52 },
  { time: '13:00', value: 42 }, // Below threshold simulated
  { time: '14:00', value: 58 },
  { time: '15:00', value: 62 },
];

const tdcsLogs = [
  {
    id: 1,
    time: '13:15',
    date: '22 Nov 2025',
    duration: 15, // minutes
    intensity: 1.5, // mA
    status: 'Aman',
  },
  {
    id: 2,
    time: '10:30',
    date: '22 Nov 2025',
    duration: 10,
    intensity: 1.0,
    status: 'Intervensi Sedang Berjalan',
  },
];

const HEALTHY_THRESHOLD = 50;
const studentName = "Fanan";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Activity, ShieldCheck, AlertCircle } from 'lucide-react';

export default function ProfilAnak() {
  return (
    <DashboardLayout role='orang_tua'>
      <Head>
        <title>Profil Anak - Pandai</title>
      </Head>

      <div className='flex flex-col gap-6 max-w-[1000px]'>
        {/* Header Title */}
        <h1 className='text-2xl font-bold text-slate-800'>
          Dashboard Orang Tua / Profil Anak
        </h1>

        {/* 1. Profile Header Card */}
        <div className='bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-6'>
          <div className='w-20 h-20 rounded-full bg-pink-100 overflow-hidden border-2 border-white shadow-sm'>
            {/* Gunakan placeholder yang sama dengan desain */}
            <img
              src='https://api.dicebear.com/7.x/avataaars/svg?seed=Fanan'
              alt='Fanan Agfian Mozart'
              className='w-full h-full object-cover'
            />
          </div>
          <div>
            <h2 className='text-2xl font-bold text-slate-800'>
              Fanan Agfian Mozart
            </h2>
            <p className='text-slate-500 font-medium'>Murid Kelas XII Mipa 6</p>
          </div>
        </div>

        {/* 2. Basic Information Form Card */}
        <div className='bg-white p-8 rounded-2xl border border-gray-100 shadow-sm'>
          <h3 className='text-lg font-bold text-slate-800 mb-8'>
            Basic Information
          </h3>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6'>
            {/* NIS */}
            <div className='flex flex-col gap-2'>
              <label className='text-sm text-slate-500 font-medium'>NIS</label>
              <div className='w-full bg-[#F9FAFB] border border-gray-100 rounded-xl px-4 py-3 text-slate-600 font-medium text-sm'>
                12789372
              </div>
            </div>

            {/* NISN */}
            <div className='flex flex-col gap-2'>
              <label className='text-sm text-slate-500 font-medium'>NISN</label>
              <div className='w-full bg-[#F9FAFB] border border-gray-100 rounded-xl px-4 py-3 text-slate-600 font-medium text-sm'>
                12789372
              </div>
            </div>

            {/* Jenis Kelamin */}
            <div className='flex flex-col gap-2'>
              <label className='text-sm text-slate-500 font-medium'>
                Jenis Kelamin
              </label>
              <div className='w-full bg-[#F9FAFB] border border-gray-100 rounded-xl px-4 py-3 text-slate-600 font-medium text-sm'>
                Laki-laki
              </div>
            </div>

            {/* Tanggal Lahir */}
            <div className='flex flex-col gap-2'>
              <label className='text-sm text-slate-500 font-medium'>
                Tanggal Lahir
              </label>
              <div className='w-full bg-[#F9FAFB] border border-gray-100 rounded-xl px-4 py-3 text-slate-600 font-medium text-sm'>
                19 Mei 2007
              </div>
            </div>

            {/* Email */}
            <div className='flex flex-col gap-2'>
              <label className='text-sm text-slate-500 font-medium'>
                Email
              </label>
              <div className='w-full bg-[#F9FAFB] border border-gray-100 rounded-xl px-4 py-3 text-slate-600 font-medium text-sm'>
                fananagfian@gmail.com
              </div>
            </div>

            {/* Nomor Telepon */}
            <div className='flex flex-col gap-2'>
              <label className='text-sm text-slate-500 font-medium'>
                Nomor Telepon
              </label>
              <div className='w-full bg-[#F9FAFB] border border-gray-100 rounded-xl px-4 py-3 text-slate-600 font-medium text-sm'>
                089669730759
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className='mt-10'>
            <button className='bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold py-3 px-8 rounded-full shadow-md shadow-indigo-200 transition-all active:scale-95'>
              Ajukan perubahan
            </button>
          </div>
        </div>


        {/* 3. Neuro-Safety Dashboard */}
        <div className='bg-white p-8 rounded-2xl border border-gray-100 shadow-sm'>
          <div className='flex items-center gap-3 mb-6'>
            <div className='w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600'>
              <Activity size={20} />
            </div>
            <div>
              <h3 className='text-lg font-bold text-slate-800'>
                Neuro-Safety Dashboard
              </h3>
              <p className='text-slate-500 text-xs font-medium'>
                Monitoring status keamanan neurologis dan intervensi
              </p>
            </div>
          </div>

          {/* Analisis PANDAI AI Section */}
          <div className='w-full bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-4 mb-8 flex gap-4 items-start relative'>
            <div className='bg-white p-2 rounded-lg text-indigo-600 shadow-sm'>
              <Activity size={20} className='text-indigo-600' />
            </div>
            <div className='flex-1'>
              <h4 className='text-xs font-bold text-indigo-800 uppercase tracking-wider mb-1'>
                Analisis PANDAI AI
              </h4>
              <p className='text-sm text-slate-700 leading-relaxed font-medium'>
                AI mendeteksi {studentName} mengalami kelelahan pada jam 11:00. Stimulasi tDCS telah diberikan dan fokus meningkat kembali ke 75% dalam 10 menit.
              </p>
              <span className='text-[10px] text-indigo-400 mt-2 block text-right font-medium'>
                Analisis terakhir: 2 menit yang lalu
              </span>
            </div>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {/* HRV Sparkline Chart */}
            <div className='flex flex-col gap-4'>
              <div className='flex items-center justify-between'>
                <h4 className='text-sm font-bold text-slate-700'>
                  Tren Detak Jantung (HRV)
                </h4>
                <div className='flex items-center gap-2 text-[10px] text-slate-400'>
                  <span className='w-2 h-2 rounded-full bg-red-500'></span>
                  Batas Aman ({HEALTHY_THRESHOLD})
                </div>
              </div>

              <div className='h-[200px] w-full bg-slate-50 rounded-xl p-4 border border-slate-100'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={hrvData}>
                    <CartesianGrid vertical={false} stroke='#e2e8f0' strokeDasharray='3 3' />
                    <XAxis
                      dataKey='time'
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 10 }}
                      dy={10}
                    />
                    <YAxis
                      hide={true}
                      domain={['dataMin - 10', 'dataMax + 10']}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        fontSize: '12px'
                      }}
                    />
                    <ReferenceLine
                      y={HEALTHY_THRESHOLD}
                      stroke='#ef4444'
                      strokeDasharray='3 3'
                      label={{
                        value: 'Min. Sehat',
                        position: 'right',
                        fill: '#ef4444',
                        fontSize: 10
                      }}
                    />
                    <Line
                      type='monotone'
                      dataKey='value'
                      stroke='#6366F1'
                      strokeWidth={3}
                      dot={{ r: 3, fill: '#6366F1', strokeWidth: 0 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* tDCS Intervention Log Table */}
            <div className='flex flex-col gap-4'>
              <h4 className='text-sm font-bold text-slate-700'>
                Log Intervensi tDCS Hari Ini
              </h4>

              <div className='relative overflow-hidden rounded-xl border border-gray-200'>
                {tdcsLogs.length > 0 ? (
                  <div className='overflow-x-auto'>
                    <table className='w-full text-left text-xs'>
                      <thead className='bg-slate-50 border-b border-gray-200'>
                        <tr>
                          <th className='px-4 py-3 font-semibold text-slate-600'>Waktu</th>
                          <th className='px-4 py-3 font-semibold text-slate-600'>Durasi</th>
                          <th className='px-4 py-3 font-semibold text-slate-600'>Intensitas</th>
                          <th className='px-4 py-3 font-semibold text-slate-600'>Status</th>
                        </tr>
                      </thead>
                      <tbody className='divide-y divide-gray-100 bg-white'>
                        {tdcsLogs.map((log) => (
                          <tr key={log.id} className='hover:bg-slate-50 transition-colors'>
                            <td className='px-4 py-3 font-medium text-slate-700'>
                              {log.time}
                              <span className='block text-[10px] text-slate-400 font-normal'>{log.date}</span>
                            </td>
                            <td className='px-4 py-3 text-slate-600'>{log.duration} Menit</td>
                            <td className='px-4 py-3 text-slate-600'>{log.intensity} mA</td>
                            <td className='px-4 py-3'>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${log.status === 'Aman'
                                  ? 'bg-indigo-100 text-indigo-700'
                                  : 'bg-amber-100 text-amber-700'
                                  }`}
                              >
                                {log.status === 'Aman' ? <ShieldCheck size={12} className="mr-1" /> : <AlertCircle size={12} className="mr-1" />}
                                {log.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  // Empty State
                  <div className='flex flex-col items-center justify-center py-12 px-4 text-center bg-slate-50/50'>
                    <div className='w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-3'>
                      <Activity size={24} />
                    </div>
                    <p className='text-sm font-medium text-slate-600'>
                      Belum ada riwayat intervensi hari ini
                    </p>
                    <p className='text-xs text-slate-400 mt-1 max-w-[200px]'>
                      Sistem akan mencatat otomatis jika ada aktivitas tDCS yang terdeteksi.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

