import Head from 'next/head';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { BookOpen, Calculator, FileText } from 'lucide-react';

// --- MOCK DATA ---

const progressData = [
  { name: 'Jan', value: 65 },
  { name: 'Feb', value: 70 },
  { name: 'Mar', value: 85 },
  { name: 'Apr', value: 82 },
  { name: 'May', value: 80 },
  { name: 'Jun', value: 78 },
  { name: 'Jul', value: 80 },
  { name: 'Aug', value: 85 },
  { name: 'Sep', value: 90 },
  { name: 'Oct', value: 95 },
  { name: 'Nov', value: 88 },
  { name: 'Dec', value: 85 },
];

const subjects = [
  {
    name: 'Matematika Wajib',
    score: 98.56,
    icon: Calculator,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    name: 'Matematika Wajib',
    score: 98.56,
    icon: Calculator,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    name: 'Matematika Wajib',
    score: 98.56,
    icon: Calculator,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    name: 'Matematika Wajib',
    score: 98.56,
    icon: Calculator,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    name: 'Matematika Wajib',
    score: 98.56,
    icon: Calculator,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    name: 'Matematika Wajib',
    score: 98.56,
    icon: Calculator,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    name: 'Matematika Wajib',
    score: 98.56,
    icon: Calculator,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
];

const history = [
  { title: 'Matematika Wajib Pos Test', score: 98.56 },
  { title: 'Matematika Wajib Pos Test', score: 98.56 },
  { title: 'Matematika Wajib Pos Test', score: 98.56 },
  { title: 'Matematika Wajib Pos Test', score: 98.56 },
];

// --- COMPONENTS ---

const SubjectCard = ({ subject }) => (
  <div className='bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center gap-3 hover:shadow-md transition-all group'>
    <div
      className={`w-14 h-14 ${subject.bg} rounded-xl flex items-center justify-center ${subject.color} group-hover:scale-110 transition-transform duration-300`}
    >
      {/* 3D Icon Simulation using Lucide with drop shadow */}
      <subject.icon
        size={28}
        strokeWidth={2}
        style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
      />
    </div>
    <div className='text-center w-full'>
      <h4 className='font-bold text-slate-800 text-sm mb-2'>{subject.name}</h4>
      <div className='bg-slate-50 border border-slate-100 rounded-lg py-1 px-2'>
        <p className='text-[10px] text-slate-400 font-medium'>
          Nilai Rata-rata:{' '}
          <span className='text-slate-700 font-bold text-xs'>
            {subject.score}
          </span>
        </p>
      </div>
    </div>
  </div>
);

const HistoryItem = ({ item }) => (
  <div className='bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer'>
    <div className='flex items-center gap-4'>
      <div className='w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600'>
        <BookOpen size={20} />
      </div>
      <div>
        <h5 className='font-bold text-indigo-900 text-sm line-clamp-1'>
          {item.title}
        </h5>
        <p className='text-xs text-slate-400 font-medium'>Selesai dikerjakan</p>
      </div>
    </div>
    <div className='flex flex-col items-end'>
      <span className='text-[10px] text-slate-400'>Nilai</span>
      <span className='text-sm font-bold text-slate-700'>{item.score}</span>
    </div>
  </div>
);

// --- MAIN PAGE ---

export default function DashboardOrangTua() {
  return (
    <DashboardLayout role='orang_tua'>
      <Head>
        <title>Dashboard Orang Tua - Pandai</title>
      </Head>

      <div className='flex flex-col gap-6 max-w-[1400px]'>
        {/* Header Title */}
        <h1 className='text-2xl font-bold text-slate-800'>
          Dashboard Orang Tua
        </h1>

        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
          {/* LEFT COLUMN (Content Utama) - Span 8 */}
          <div className='col-span-1 lg:col-span-8 flex flex-col gap-8'>
            {/* 1. Section Banner Profile Anak */}
            <div className='w-full'>
              <h2 className='text-lg font-bold text-slate-800 mb-4'>
                Progress Belajar Anak
              </h2>
              <div className='relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#4F46E5] to-[#8E8CFF] text-white p-8 shadow-lg shadow-indigo-200'>
                {/* Decorative Circle */}
                <div className='absolute -top-24 -right-24 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl'></div>

                <div className='relative z-10'>
                  <div className='inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-[10px] font-medium mb-3 border border-white/10'>
                    22 November 2025
                  </div>
                  <h2 className='text-2xl font-bold mb-2'>
                    Profil Anak: Fanan Agfian Mozart
                  </h2>
                  <div className='flex flex-col gap-1 text-sm text-indigo-100 opacity-90 font-medium'>
                    <p>Kelas: XII MIPA 6</p>
                    <p>NISN: 1312342342</p>
                    <p>NIS: 1312313</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Chart Section */}
            <div className='bg-white p-6 rounded-2xl border border-gray-100 shadow-sm'>
              <div className='flex justify-between items-center mb-6'>
                <h3 className='font-bold text-slate-700'>
                  Peningkatan Anak Anda
                </h3>
                <div className='relative'>
                  <select className='appearance-none bg-slate-50 border border-gray-200 text-slate-600 py-1.5 pl-3 pr-8 rounded-lg text-xs font-bold cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500'>
                    <option>Matematika Wajib</option>
                    <option>Fisika</option>
                  </select>
                  <div className='absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-400'>
                    <svg
                      width='12'
                      height='12'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                    >
                      <polyline points='6 9 12 15 18 9'></polyline>
                    </svg>
                  </div>
                </div>
              </div>

              <div className='h-[200px] w-full text-xs'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={progressData}>
                    <CartesianGrid
                      vertical={false}
                      stroke='#f1f5f9'
                      strokeDasharray='3 3'
                    />
                    <XAxis
                      dataKey='name'
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 10 }}
                      dy={10}
                    />
                    <YAxis
                      hide={false}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 10 }}
                      domain={[0, 100]}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      }}
                    />
                    {/* Dotted Reference Line (Simulation) */}
                    <Line
                      type='monotone'
                      dataKey='value'
                      stroke='#22c55e'
                      strokeWidth={3}
                      dot={{ r: 0 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 3. Grid Mata Pelajaran */}
            <div>
              <h3 className='text-lg font-bold text-slate-800 mb-4'>
                Mata Pelajaran & Nilai
              </h3>
              <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                {subjects.map((subj, idx) => (
                  <SubjectCard key={idx} subject={subj} />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (Sidebar Widget) - Span 4 */}
          <div className='col-span-1 lg:col-span-4'>
            <h3 className='text-lg font-bold text-slate-800 mb-4'>
              Riwayat Quiz Terbaru
            </h3>
            <div className='flex flex-col gap-4'>
              {history.map((item, idx) => (
                <HistoryItem key={idx} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
