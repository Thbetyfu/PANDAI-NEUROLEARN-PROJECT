import { useState } from 'react';
import Head from 'next/head';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  ChevronDown,
  ChevronRight,
  Calculator,
  BookOpen,
  Search,
} from 'lucide-react';

// Generate 20 dummy students
const studentsList = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: i % 2 === 0 ? 'Fanan Agfian Mozart' : 'Fanan Agfian Mozart', // Nama diulang sesuai gambar
  img: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
}));

const tasksData = [
  { id: 1, title: 'Matematika Wajib Pos Test', date: '16 November 2022' },
  { id: 2, title: 'Matematika Wajib Pos Test', date: '16 November 2022' },
  { id: 3, title: 'Matematika Wajib Pos Test', date: '16 November 2022' },
];

export default function DaftarSiswaGuru() {
  const [selectedClass, setSelectedClass] = useState('XII - IPA 5');
  const [sortOption, setSortOption] = useState('Nama');

  return (
    <DashboardLayout role='guru'>
      <Head>
        <title>Daftar Siswa - Pandai</title>
      </Head>

      <div className='flex flex-col gap-6 max-w-[1400px]'>
        {/* Header Title */}
        <h1 className='text-2xl font-bold text-slate-800'>
          Daftar Siswa
        </h1>

        <div className='grid grid-cols-12 gap-8'>
          {/* LEFT COLUMN (Daftar Siswa Table) */}
          <div className='col-span-12 lg:col-span-8'>
            <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-6 min-h-screen'>
              {/* Header Card */}
              <div className='flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4'>
                <h2 className='text-xl font-bold text-slate-800'>
                  Daftar Siswa
                </h2>

                <div className='flex gap-3'>
                  {/* Class Selector */}
                  <div className='relative group'>
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className='appearance-none bg-slate-50 border border-gray-200 text-slate-600 py-1.5 pl-4 pr-10 rounded-full text-xs font-bold cursor-pointer hover:border-gray-300 transition focus:outline-none'
                    >
                      <option>XII - IPA 5</option>
                      <option>XII - IPA 6</option>
                    </select>
                    <div className='absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400'>
                      <ChevronDown size={14} />
                    </div>
                  </div>

                  {/* Sort Selector */}
                  <div className='relative group'>
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className='appearance-none bg-slate-50 border border-gray-200 text-slate-600 py-1.5 pl-4 pr-10 rounded-full text-xs font-bold cursor-pointer hover:border-gray-300 transition focus:outline-none'
                    >
                      <option>Nama</option>
                      <option>Absen</option>
                    </select>
                    <div className='absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400'>
                      <ChevronDown size={14} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Table List */}
              <div className='overflow-hidden rounded-xl border border-blue-50'>
                <table className='w-full text-left border-collapse'>
                  <thead>
                    <tr className='bg-blue-50/50 border-b border-blue-100 text-slate-600 text-sm'>
                      <th className='py-3 px-4 font-bold w-16'>No</th>
                      <th className='py-3 px-4 font-bold'>Nama</th>
                    </tr>
                  </thead>
                  <tbody className='divide-y divide-gray-50'>
                    {studentsList.map((student, idx) => (
                      <tr
                        key={student.id}
                        className='hover:bg-slate-50 transition-colors group'
                      >
                        <td className='py-3 px-4'>
                          <span className='text-blue-600 font-bold text-sm'>
                            {idx + 1}
                          </span>
                        </td>
                        <td className='py-3 px-4'>
                          <div className='flex items-center gap-3'>
                            <div className='w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-gray-100'>
                              <img
                                src={student.img}
                                alt={student.name}
                                className='w-full h-full object-cover'
                              />
                            </div>
                            <span className='font-bold text-slate-700 text-sm group-hover:text-blue-600 transition-colors'>
                              {student.name}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
