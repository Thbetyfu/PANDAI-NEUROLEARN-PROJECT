import { useState } from 'react';
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
import { ChevronRight, Calculator, BookOpen, ChevronDown, MonitorActivity } from 'lucide-react';
import InterventionLog from '@/components/shared/InterventionLog';
import { usePandaiStore } from '@/store/useStore';

// --- DUMMY DATA ---
const chartData = [
  { name: 'Jan', value: 20 },
  { name: 'Feb', value: 45 },
  { name: 'Mar', value: 50 },
  { name: 'Apr', value: 55 },
  { name: 'May', value: 60 },
  { name: 'Jun', value: 65 },
  { name: 'Jul', value: 85 },
  { name: 'Aug', value: 95 },
  { name: 'Sep', value: 80 },
  { name: 'Oct', value: 82 },
  { name: 'Nov', value: 78 },
  { name: 'Dec', value: 75 },
];

const studentsData = [
  {
    id: 1,
    name: 'Fanan Agfian Mozart',
    chapter: 'Bab 1 - Aljabar I',
    score: 98.56,
    img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fanan',
  },
  {
    id: 2,
    name: 'Michale Kevin Sanjaya',
    chapter: 'Bab 1 - Aljabar I',
    score: 97.83,
    img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kevin',
  },
  {
    id: 3,
    name: 'Richard Santoso',
    chapter: 'Bab 1 - Aljabar I',
    score: 94.22,
    img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Richard',
  },
  {
    id: 4,
    name: 'Dian Sastro',
    chapter: 'Bab 1 - Aljabar I',
    score: 91.0,
    img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dian',
  },
  {
    id: 5,
    name: 'Budi Doremi',
    chapter: 'Bab 1 - Aljabar I',
    score: 89.5,
    img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi',
  },
];

const tasksData = [
  { id: 1, title: 'Matematika Wajib Pos Test', date: '16 November 2022' },
  { id: 2, title: 'Matematika Wajib Pos Test', date: '16 November 2022' },
  { id: 3, title: 'Matematika Wajib Pos Test', date: '16 November 2022' },
];

const classOptions = ['XII - IPA 5', 'XII - IPA 6', 'XI - IPS 1'];
const subjectOptions = ['Matematika', 'Fisika', 'Kimia'];

const dummyLogs = [
  { student: 'Fanan Agfian', action: 'tDCS Activated (Focus)', time: '10:05', type: 'tDCS' },
  { student: 'Richard Santoso', action: 'Smart Room (Cool White)', time: '10:12', type: 'Env' },
  { student: 'Kevin Sanjaya', action: 'tDCS Activated (Relax)', time: '10:25', type: 'tDCS' },
];

const LiveKognitifGrid = () => {
  // Generate 32 students
  const students = Array.from({ length: 32 }, (_, i) => {
    // Random status
    const rand = Math.random();
    let status = 'aktif'; // green
    if (rand > 0.8) status = 'stress'; // red
    else if (rand > 0.6) status = 'bosan'; // orange
    return { id: i + 1, status };
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-800">Monitoring Live Kognitif</h3>
        <p className="text-xs text-slate-400">Diupdate 5 menit yang lalu</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mb-4">
        {students.map((s) => (
          <div
            key={s.id}
            className={`
              aspect-square rounded-lg flex items-center justify-center text-xs font-bold text-white transition-all hover:scale-105 cursor-pointer
              ${s.status === 'aktif' ? 'bg-[#46BD84]' : ''}
              ${s.status === 'bosan' ? 'bg-[#F2994A]' : ''}
              ${s.status === 'stress' ? 'bg-[#FF6B6B]' : ''}
            `}
          >
            {s.id}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs font-medium text-slate-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#46BD84]"></div>
          Aktif
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#F2994A]"></div>
          Bosan
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF6B6B]"></div>
          Stress
        </div>
      </div>
    </div>
  );
};

export default function DashboardGuru() {
  const [selectedClass, setSelectedClass] = useState('XII - IPA 5');
  const [selectedSubject, setSelectedSubject] = useState('Matematika');
  const { interventionLogs } = usePandaiStore();

  return (
    <DashboardLayout role='guru'>
      <Head>
        <title>Dashboard Guru - Pandai</title>
      </Head>

      <div className='flex flex-col gap-8 max-w-[1400px] mx-auto font-sans'>
        {/* Header Title */}
        <h1 className='text-[28px] font-bold text-[#1F2937]'>Dashboard Guru</h1>

        <div className='grid grid-cols-12 gap-8'>
          {/* LEFT COLUMN (Wide) */}
          <div className='col-span-12 lg:col-span-8 flex flex-col gap-6'>

            {/* 1. Banner Section */}
            <div className='relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0041C9] to-[#001D5A] text-white p-8 shadow-xl'>
              <div className='absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none'></div>
              <div className='relative z-10'>
                <div className='inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold mb-4 border border-white/10'>
                  22 November 2025
                </div>
                <h2 className='text-3xl font-bold mb-2'>Halo Pak Budi!</h2>
                <p className='text-blue-100 max-w-lg text-sm leading-relaxed opacity-90'>
                  LMS adalah tempat untuk guru melihat progress siswa dan
                  mendapatkan evaluasi pembelajaran
                </p>
              </div>
            </div>

            {/* 2. Evaluasi & Sentimen Section */}
            <div>
              <h3 className='text-lg font-bold text-slate-800 mb-4'>
                Evaluasi & Sentimen
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                {/* Chart: Rasio Pemahaman Siswa */}
                <div className='md:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 relative'>
                  <div className='flex justify-between items-start mb-4'>
                    <h4 className='font-bold text-slate-700'>
                      Rasio Pemahaman Siswa
                    </h4>
                    <div className='flex items-center gap-1 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full text-xs font-medium text-slate-600 cursor-pointer hover:bg-slate-100 transition'>
                      <span>MTK - XII IPA 5</span>
                      <ChevronDown size={14} />
                    </div>
                  </div>

                  {/* Recharts Area */}
                  <div className='h-[200px] w-full text-xs'>
                    <ResponsiveContainer width='100%' height='100%'>
                      <LineChart data={chartData}>
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
                        <YAxis hide={true} domain={[0, 100]} />
                        <Tooltip
                          contentStyle={{
                            borderRadius: '8px',
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          }}
                          cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }}
                        />
                        <Line
                          type='monotone'
                          dataKey='value'
                          stroke='#22c55e'
                          strokeWidth={3}
                          dot={{ r: 0 }}
                          activeDot={{
                            r: 6,
                            fill: '#22c55e',
                            stroke: '#fff',
                            strokeWidth: 2,
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Chart: Pemahaman Murid (Donut) */}
                <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between'>
                  <h4 className='font-bold text-slate-700 mb-2'>
                    Pemahaman Murid
                  </h4>

                  <div className='flex items-center gap-4'>
                    <div className='relative w-24 h-24'>
                      <svg
                        className='w-full h-full transform -rotate-90'
                        viewBox='0 0 36 36'
                      >
                        <path
                          className='text-indigo-50'
                          d='M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='4'
                        />
                        <path
                          className='text-[#0041C9]'
                          strokeDasharray='75, 100'
                          d='M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='4'
                          strokeLinecap='round'
                        />
                      </svg>
                    </div>

                    <div className='flex flex-col'>
                      <span className='text-4xl font-bold text-slate-700'>
                        24
                        <span className='text-xl text-slate-400 font-normal'>
                          /32
                        </span>
                      </span>
                      <div className='inline-flex items-center gap-1 text-green-600 bg-green-50 px-2 py-0.5 rounded-md text-xs font-bold w-max mt-1'>
                        <ChevronRight
                          className='rotate-[-90deg]'
                          size={12}
                          strokeWidth={4}
                        />
                        10%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Rangkuman Panduan Mengajar */}
            <div className='bg-[#F4F6FA] border border-[#E0E7FF] rounded-xl p-5 flex gap-4'>
              <div className="min-w-[4px] bg-[#0041C9] rounded-full self-stretch"></div>
              <div>
                <h4 className='text-[#0041C9] font-bold text-sm mb-1'>
                  Rangkuman panduan mengajar
                </h4>
                <p className='text-slate-600 text-sm leading-relaxed'>
                  Sebagian besar siswa di kelas ini telah memahami pelajaran
                  matematika, namun anda juga perlu untuk memperhatikan murid yang
                  belum paham.
                </p>
              </div>
            </div>

            {/* 4. Monitoring Live Kognitif */}
            <LiveKognitifGrid />

            {/* 3. Live Intervention Log (Moved from Right Column) */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className='text-lg font-bold text-slate-800'>Intervention Log</h3>
              </div>
              <InterventionLog logs={interventionLogs.length > 0 ? interventionLogs : dummyLogs} simpleView={true} />
            </div>

            {/* 5. Daftar Nilai Siswa Table */}
            <div>
              {/* Table Component */}
              <div className='bg-white rounded-[8px] border border-black/5 shadow-sm overflow-hidden'>
                {/* Table Header Section inside the card */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 pb-2 gap-4">
                  <h3 className='font-bold text-lg text-black tracking-tight font-["Inter"]'>
                    Daftar Nilai Siswa
                  </h3>

                  {/* Select / Dropdown Filters */}
                  <div className='flex gap-3'>
                    {/* Class Selector */}
                    <div className='relative group'>
                      <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className='appearance-none bg-white border border-black/10 text-black/70 py-1.5 pl-4 pr-10 rounded-full text-[13px] font-semibold focus:outline-none focus:ring-2 focus:ring-[#0041C9]/10 hover:border-[#0041C9]/30 transition-all cursor-pointer font-["Inter"] shadow-sm'
                      >
                        {classOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <div className='absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-black/40'>
                        <ChevronDown size={14} strokeWidth={2.5} />
                      </div>
                    </div>

                    {/* Subject Selector */}
                    <div className='relative group'>
                      <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className='appearance-none bg-white border border-black/10 text-black/70 py-1.5 pl-4 pr-10 rounded-full text-[13px] font-semibold focus:outline-none focus:ring-2 focus:ring-[#0041C9]/10 hover:border-[#0041C9]/30 transition-all cursor-pointer font-["Inter"] shadow-sm'
                      >
                        {subjectOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <div className='absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-black/40'>
                        <ChevronDown size={14} strokeWidth={2.5} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className='overflow-x-auto px-6 pb-6'>
                  <table className='w-full text-left border-separate border-spacing-0 min-w-[600px]'>
                    <thead>
                      <tr className='h-[43px]'>
                        <th className='px-4 font-bold font-["Inter"] text-black text-sm bg-[#E8F1FB] border-y border-l border-[#666666]/15 rounded-l-[5px] whitespace-nowrap first:pl-6'>Nama</th>
                        <th className='px-4 font-bold font-["Inter"] text-black text-sm bg-[#E8F1FB] border-y border-[#666666]/15 whitespace-nowrap'>Materi</th>
                        <th className='px-4 font-bold font-["Inter"] text-black text-sm text-right bg-[#E8F1FB] border-y border-r border-[#666666]/15 rounded-r-[5px] whitespace-nowrap last:pr-6'>
                          Scor Quiz
                        </th>
                      </tr>
                    </thead>
                    <tbody className=''>
                      {/* Spacer row to separate header from body slightly if needed, or just relying on standard spacing */}
                      <tr className="h-2"></tr>
                      {studentsData.map((student, idx) => (
                        <tr
                          key={student.id}
                          className='group cursor-default hover:bg-[#E8F1FB]/30 transition-colors rounded-lg'
                        >
                          <td className='py-3 px-6'>
                            <div className='flex items-center gap-4'>
                              <span className='text-[#0041C9] font-bold text-sm w-4 font-["Inter"]'>
                                {idx + 1}
                              </span>
                              <div className='w-9 h-9 rounded-full bg-gray-200 overflow-hidden border border-gray-100 shrink-0'>
                                <img
                                  src={student.img}
                                  alt={student.name}
                                  className='w-full h-full object-cover'
                                />
                              </div>
                              <span className='font-bold text-[#08090A] text-sm font-["Inter"]'>
                                {student.name}
                              </span>
                            </div>
                          </td>
                          <td className='py-3 px-6'>
                            <span className='text-[#001D5A] font-bold text-sm font-["Inter"]'>
                              {student.chapter}
                            </span>
                          </td>
                          <td className='py-3 px-6 text-right'>
                            <div className='inline-block bg-[#F9FAFB] border border-[#E5E7EB] text-[#111827] px-4 py-1.5 rounded-full text-sm font-bold font-["Inter"] shadow-sm'>
                              {student.score.toLocaleString('id-ID', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (Sidebar Widgets) */}
          <div className='col-span-12 lg:col-span-4 flex flex-col gap-8'>
            {/* 1. Mata Pelajaran Diampu */}
            <div>
              <h3 className='text-lg font-bold text-slate-800 mb-4'>
                Mata Pelajaran Diampu
              </h3>
              <div className='grid grid-cols-2 gap-4'>
                {/* Card 1 */}
                <div className='bg-white rounded-2xl p-6 flex flex-col items-center justify-center gap-3 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-indigo-100 group'>
                  <div className='w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#0041C9] group-hover:scale-110 transition-transform'>
                    <Calculator size={24} />
                  </div>
                  <span className='text-slate-700 font-bold text-center text-sm'>
                    Matematika Wajib
                  </span>
                </div>
                {/* Card 2 */}
                <div className='bg-white rounded-2xl p-6 flex flex-col items-center justify-center gap-3 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-indigo-100 group'>
                  <div className='w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform'>
                    <BookOpen size={24} />
                  </div>
                  <span className='text-slate-700 font-bold text-center text-sm'>
                    Fisika
                  </span>
                </div>
                {/* Card 3 (Big) */}
                <div className='bg-white rounded-2xl p-6 flex flex-col items-center justify-center gap-3 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-indigo-100 group col-span-2 md:col-span-1 lg:col-span-2 xl:col-span-1'>
                  <div className='w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform'>
                    <Calculator size={24} />
                  </div>
                  <span className='text-slate-700 font-bold text-center text-sm'>
                    Matematika Minat
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Tugas Perlu Dikoreksi */}
            <div>
              <h3 className='text-lg font-bold text-slate-800 mb-4'>
                Tugas Perlu Dikoreksi
              </h3>
              <div className='flex flex-col gap-3'>
                {tasksData.map((task, i) => (
                  <div
                    key={i}
                    className='bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors group'
                  >
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600'>
                        <Calculator size={18} />
                      </div>
                      <div>
                        <h5 className='text-sm font-bold text-indigo-900 group-hover:text-indigo-700'>
                          {task.title}
                        </h5>
                        <p className='text-xs text-green-600 bg-green-50 inline-block px-1.5 py-0.5 rounded mt-1 font-medium'>
                          {task.date}
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      className='text-slate-300 group-hover:text-slate-500'
                      size={20}
                    />
                  </div>
                ))}
              </div>
            </div>


          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
