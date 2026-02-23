import { useState, useEffect } from 'react';
import Head from 'next/head';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StressRelaxChart from '@/components/shared/StressRelaxChart';
import { usePandaiStore } from '@/store/useStore';
import { useSimulation } from '@/hooks/useSimulation';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChevronDown, ChevronRight, Calculator, BookOpen, Info } from 'lucide-react';

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

const studentsEvalData = [
  {
    id: 1,
    name: 'Fanan Agfian Mozart',
    chapter: 'Bab 1 - Aljabar I',
    score: 45,
    img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fanan',
  },
  {
    id: 2,
    name: 'Richard Santoso',
    chapter: 'Bab 1 - Aljabar I',
    score: 32,
    img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Richard',
  },
  {
    id: 3,
    name: 'Clara Puspita Sari',
    chapter: 'Bab 1 - Aljabar I',
    score: 25,
    img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Clara',
  },
];

const tasksData = [
  { id: 1, title: 'Matematika Wajib Pos Test', date: '16 November 2022' },
  { id: 2, title: 'Matematika Wajib Pos Test', date: '16 November 2022' },
  { id: 3, title: 'Matematika Wajib Pos Test', date: '16 November 2022' },
];

export default function EvaluasiGuru() {
  const [selectedClassChart, setSelectedClassChart] =
    useState('MTK - XII IPA 5');
  const [selectedClassTable, setSelectedClassTable] = useState('XII - IPA 5');
  const [selectedMateri, setSelectedMateri] = useState('Matematika');

  // Activate live biometric simulation
  useSimulation();

  // Connect to live biometrics store
  const biometricsHistory = usePandaiStore((state) => state.biometricsHistory);

  return (
    <DashboardLayout role='guru'>
      <Head>
        <title>Evaluasi - Pandai</title>
      </Head>

      <div className='flex flex-col gap-6 max-w-[1400px]'>
        {/* Header Title */}
        <h1 className='text-2xl font-bold text-slate-800'>
          Evaluasi
        </h1>

        <div className='grid grid-cols-12 gap-8'>
          {/* LEFT COLUMN */}
          <div className='col-span-12 lg:col-span-8 flex flex-col gap-6'>
            {/* 1. Evaluasi & Sentimen Section */}
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
                      <span>{selectedClassChart}</span>
                      <ChevronDown size={14} />
                    </div>
                  </div>

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
                          className='text-[#0055D4]'
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

            {/* 2. Rangkuman Panduan Mengajar */}
            <div className='bg-[#F4F6FA] border border-indigo-100 rounded-xl p-5'>
              <h4 className='text-indigo-800 font-bold text-sm mb-1'>
                Rangkuman panduan mengajar
              </h4>
              <p className='text-slate-600 text-sm leading-relaxed'>
                Sebagian besar siswa di kelas ini telah memahami pelajaran
                matematika, namun anda juga perlu untuk memperhatikan murid yang
                belum paham.
              </p>
            </div>

            {/* 3. Stress-Relax Balance Chart with Explanation */}
            <div className='space-y-3'>
              {/* Info Box */}
              <div className='bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3'>
                <Info className='text-blue-600 flex-shrink-0 mt-0.5' size={20} />
                <div>
                  <h5 className='font-bold text-blue-900 text-sm mb-1'>
                    Tentang Stress-Relax Balance
                  </h5>
                  <p className='text-blue-700 text-xs leading-relaxed'>
                    Chart ini mengukur keseimbangan emosional siswa. <span className='font-semibold'>Garis merah (GSR)</span> menunjukkan tingkat stres,
                    sedangkan <span className='font-semibold'>garis hijau (HRV)</span> menunjukkan tingkat relaksasi.
                    Zona optimal (Flow Zone) tercapai ketika kedua nilai seimbang di sekitar 50%.
                  </p>
                </div>
              </div>

              {/* Chart */}
              <StressRelaxChart data={biometricsHistory.length > 0 ? biometricsHistory : []} />
            </div>

            {/* 3. Siswa Yang Perlu Dievaluasi Table */}
            <div className='bg-white rounded-lg border border-gray-100 shadow-sm p-6'>
              <div className='flex flex-col md:flex-row md:items-center justify-between mb-7 gap-4'>
                <h2 className='text-[23px] font-medium text-black tracking-tight'>
                  Siswa Yang Perlu Dievaluasi
                </h2>

                <div className='flex gap-6'>
                  {/* Class Selector */}
                  <div className='relative group'>
                    <select
                      value={selectedClassTable}
                      onChange={(e) => setSelectedClassTable(e.target.value)}
                      className='appearance-none bg-gradient-to-b from-black/5 to-transparent border border-black/10 text-black/70 py-[2px] pl-[10px] pr-10 rounded-full text-xs font-medium cursor-pointer hover:border-black/20 transition focus:outline-none'
                    >
                      <option>XII - IPA 5</option>
                      <option>XII - IPA 6</option>
                    </select>
                    <div className='absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400'>
                      <ChevronDown size={14} />
                    </div>
                  </div>

                  {/* Subject Selector */}
                  <div className='relative group'>
                    <select
                      value={selectedMateri}
                      onChange={(e) => setSelectedMateri(e.target.value)}
                      className='appearance-none bg-gradient-to-b from-black/5 to-transparent border border-black/10 text-black/70 py-[2px] pl-[10px] pr-10 rounded-full text-xs font-medium cursor-pointer hover:border-black/20 transition focus:outline-none'
                    >
                      <option>Matematika</option>
                      <option>Fisika</option>
                    </select>
                    <div className='absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400'>
                      <ChevronDown size={14} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className='flex flex-col gap-2.5'>
                {/* Header Row */}
                <div className='flex items-center justify-between px-5 py-2.5 bg-[#E8F1FB] border border-[rgba(102,102,102,0.14)] rounded-[5px]'>
                  <div className='w-8 text-center'>
                    <span className='font-medium text-[15px] text-black tracking-tight'>No</span>
                  </div>
                  <div className='flex-1'>
                    <span className='font-medium text-[15px] text-black tracking-tight'>Nama</span>
                  </div>
                  <div className='w-32'>
                    <span className='font-medium text-[15px] text-black tracking-tight'>Materi</span>
                  </div>
                  <div className='w-40 text-center'>
                    <span className='font-medium text-[15px] text-black tracking-tight'>Stress-Relax</span>
                  </div>
                  <div className='w-20 text-center'>
                    <span className='font-medium text-[15px] text-black tracking-tight'>Skor Quiz</span>
                  </div>
                </div>

                {/* Data Rows */}
                <div className='flex flex-col gap-6 py-2.5 px-5 rounded-xl'>
                  {/* Row 1 - Stress */}
                  <div className='flex items-center justify-between'>
                    <div className='w-8 text-center'>
                      <span className='font-semibold text-sm text-[#0041C9] tracking-tight'>1.</span>
                    </div>
                    <div className='flex-1'>
                      <span className='font-semibold text-sm text-[#1D115A] tracking-tight'>Fanan Agfian Mozart</span>
                    </div>
                    <div className='w-32'>
                      <span className='font-normal text-sm text-[#1D115A] tracking-tight'>Bab 1 - Aljabar I</span>
                    </div>
                    <div className='w-40 flex items-center justify-center gap-2'>
                      {/* Stress Indicator - 2/5 dots filled (Red) */}
                      <div className='flex items-center gap-1'>
                        <div className='w-1.5 h-4 bg-[#F87171] rounded-full'></div>
                        <div className='w-1.5 h-4 bg-[#F87171] rounded-full'></div>
                        <div className='w-1.5 h-4 bg-[#E2E8F0] rounded-full'></div>
                        <div className='w-1.5 h-4 bg-[#E2E8F0] rounded-full'></div>
                        <div className='w-1.5 h-4 bg-[#E2E8F0] rounded-full'></div>
                      </div>
                      <span className='font-bold text-[10px] text-[#EF4444] uppercase tracking-wide'>Stress</span>
                    </div>
                    <div className='w-20 text-center'>
                      <span className='font-medium text-sm text-[#F26767] tracking-tight'>45</span>
                    </div>
                  </div>

                  {/* Row 2 - Neutral */}
                  <div className='flex items-center justify-between'>
                    <div className='w-8 text-center'>
                      <span className='font-semibold text-sm text-[#0041C9] tracking-tight'>2.</span>
                    </div>
                    <div className='flex-1'>
                      <span className='font-semibold text-sm text-[#1D115A] tracking-tight'>Jossephine Angela</span>
                    </div>
                    <div className='w-32'>
                      <span className='font-normal text-sm text-[#1D115A] tracking-tight'>Bab 1 - Aljabar I</span>
                    </div>
                    <div className='w-40 flex items-center justify-center gap-2'>
                      {/* Neutral Indicator - 3/5 dots filled (Yellow) */}
                      <div className='flex items-center gap-1'>
                        <div className='w-1.5 h-4 bg-[#FACC15] rounded-full'></div>
                        <div className='w-1.5 h-4 bg-[#FACC15] rounded-full'></div>
                        <div className='w-1.5 h-4 bg-[#FACC15] rounded-full'></div>
                        <div className='w-1.5 h-4 bg-[#E2E8F0] rounded-full'></div>
                        <div className='w-1.5 h-4 bg-[#E2E8F0] rounded-full'></div>
                      </div>
                      <span className='font-bold text-[10px] text-[#EAB308] uppercase tracking-wide'>Neutral</span>
                    </div>
                    <div className='w-20 text-center'>
                      <span className='font-medium text-sm text-[#EAB308] tracking-tight'>50</span>
                    </div>
                  </div>

                  {/* Row 3 - Relax */}
                  <div className='flex items-center justify-between'>
                    <div className='w-8 text-center'>
                      <span className='font-semibold text-sm text-[#0041C9] tracking-tight'>3.</span>
                    </div>
                    <div className='flex-1'>
                      <span className='font-semibold text-sm text-[#1D115A] tracking-tight'>Raphael Cameron</span>
                    </div>
                    <div className='w-32'>
                      <span className='font-normal text-sm text-[#1D115A] tracking-tight'>Bab 1 - Aljabar I</span>
                    </div>
                    <div className='w-40 flex items-center justify-center gap-2'>
                      {/* Relax Indicator - 5/5 dots filled (Green) */}
                      <div className='flex items-center gap-1'>
                        <div className='w-1.5 h-4 bg-[#4ADE80] rounded-full'></div>
                        <div className='w-1.5 h-4 bg-[#4ADE80] rounded-full'></div>
                        <div className='w-1.5 h-4 bg-[#4ADE80] rounded-full'></div>
                        <div className='w-1.5 h-4 bg-[#4ADE80] rounded-full'></div>
                        <div className='w-1.5 h-4 bg-[#4ADE80] rounded-full'></div>
                      </div>
                      <span className='font-bold text-[10px] text-[#4ADE80] uppercase tracking-wide'>Relax</span>
                    </div>
                    <div className='w-20 text-center'>
                      <span className='font-medium text-sm text-[#F87171] tracking-tight'>20</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (Sidebar Widgets) */}
          <div className='col-span-12 lg:col-span-4 flex flex-col gap-8'>
            {/* Widget 1: Mata Pelajaran */}
            <div>
              <h3 className='text-lg font-bold text-slate-800 mb-4'>
                Mata Pelajaran Diampu
              </h3>
              <div className='grid grid-cols-2 gap-4'>
                <div className='bg-white rounded-2xl p-6 flex flex-col items-center justify-center gap-3 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-indigo-100 group'>
                  <div className='w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform'>
                    <Calculator size={24} />
                  </div>
                  <span className='text-slate-700 font-bold text-center text-sm'>
                    Matematika Wajib
                  </span>
                </div>
                <div className='bg-white rounded-2xl p-6 flex flex-col items-center justify-center gap-3 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-indigo-100 group'>
                  <div className='w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform'>
                    <BookOpen size={24} />
                  </div>
                  <span className='text-slate-700 font-bold text-center text-sm'>
                    Fisika
                  </span>
                </div>
                <div className='bg-white rounded-2xl p-6 flex flex-col items-center justify-center gap-3 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-indigo-100 group col-span-1'>
                  <div className='w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform'>
                    <Calculator size={24} />
                  </div>
                  <span className='text-slate-700 font-bold text-center text-sm'>
                    Matematika Minat
                  </span>
                </div>
              </div>
            </div>

            {/* Widget 2: Tugas */}
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
