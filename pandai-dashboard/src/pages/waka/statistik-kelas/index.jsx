import { useState } from 'react';
import Head from 'next/head';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ChevronDown, ChevronUp } from 'lucide-react';

// --- COMPONENTS ---

// Accordion Item Component
const ClassAccordion = ({ classNameString, isOpen, onClick }) => {
  return (
    <div className='bg-blue-50/50 rounded-2xl border border-blue-100 overflow-hidden mb-4 transition-all duration-300'>
      {/* Header Accordion (Clickable) */}
      <div
        onClick={onClick}
        className='p-5 flex items-center justify-between cursor-pointer hover:bg-blue-100/50 transition-colors'
      >
        <h3 className='font-bold text-indigo-900 text-lg'>{classNameString}</h3>
        <button className='w-8 h-8 rounded-full bg-white flex items-center justify-center text-indigo-600 shadow-sm'>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {/* Content (Visible if Open) */}
      {isOpen && (
        <div className='p-6 bg-white border-t border-blue-100'>
          {/* Top Section: Info Wali Kelas & Chart */}
          <div className='flex flex-col lg:flex-row gap-8 mb-8'>
            {/* Kiri: Wali Kelas */}
            <div className='w-full lg:w-1/4'>
              <p className='text-xs font-bold text-slate-400 mb-2'>
                Wali kelas
              </p>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-full bg-gray-200 overflow-hidden'>
                  <img
                    src='https://api.dicebear.com/7.x/avataaars/svg?seed=Budi'
                    alt='Wali Kelas'
                  />
                </div>
                <span className='font-bold text-slate-700 text-sm'>
                  Budi Gunawan
                </span>
              </div>
            </div>

            {/* Kanan: Statistik Mapel */}
            <div className='w-full lg:w-3/4 bg-white rounded-xl border border-gray-100 p-5 shadow-sm'>
              <div className='flex justify-between items-center mb-4 border-b border-gray-50 pb-3'>
                <h4 className='font-bold text-slate-700'>Mata Pelajaran</h4>
                <div className='relative'>
                  <select className='appearance-none bg-slate-50 border border-gray-200 text-slate-600 py-1 pl-3 pr-8 rounded-lg text-xs font-bold cursor-pointer focus:outline-none'>
                    <option>Matematika</option>
                    <option>Fisika</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className='absolute right-2 top-1.5 text-slate-400 pointer-events-none'
                  />
                </div>
              </div>

              <div className='flex flex-col md:flex-row gap-6'>
                {/* Chart Peningkatan */}
                <div className='flex-1 flex items-center gap-4 border-r border-gray-50 pr-4'>
                  <div className='relative w-16 h-16'>
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
                  <div>
                    <h5 className='text-xs font-bold text-slate-500 mb-1'>
                      Peningkatan Siswa
                    </h5>
                    <div className='text-xl font-bold text-slate-700'>
                      24
                      <span className='text-xs text-slate-400 font-normal'>
                        /32
                      </span>{' '}
                      <span className='text-xs font-normal text-slate-500'>
                        murid sudah paham
                      </span>
                    </div>
                    <div className='inline-block px-1.5 py-0.5 bg-green-50 text-green-600 rounded text-[10px] font-bold mt-1'>
                      ↗ 10%
                    </div>
                  </div>
                </div>

                {/* Evaluasi Pengajar */}
                <div className='flex-1'>
                  <h5 className='text-xs font-bold text-slate-500 mb-2'>
                    Evaluasi Pengajar Mapel
                  </h5>
                  <div className='flex items-center gap-2 mb-2'>
                    <div className='w-6 h-6 rounded-full bg-gray-200 overflow-hidden'>
                      <img
                        src='https://api.dicebear.com/7.x/avataaars/svg?seed=Melati'
                        alt='Pengajar'
                      />
                    </div>
                    <span className='font-bold text-slate-700 text-xs'>
                      Melati Puspita
                    </span>
                  </div>
                  <div className='bg-indigo-50/50 border border-indigo-100 p-3 rounded-lg'>
                    <p className='text-[10px] text-slate-600 leading-relaxed'>
                      Sebagian besar siswa di kelas ini telah memahami pelajaran
                      matematika.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section: Daftar Siswa Table */}
          <div>
            <div className='flex justify-between items-center mb-3'>
              <h4 className='font-bold text-slate-700 text-sm'>Daftar siswa</h4>
              <div className='flex items-center gap-1 bg-slate-50 border border-slate-100 px-2 py-1 rounded text-[10px] font-medium text-slate-500 cursor-pointer'>
                Berdasarkan peringkat <ChevronDown size={12} />
              </div>
            </div>

            <div className='bg-slate-50/30 rounded-xl border border-slate-100 overflow-hidden'>
              <table className='w-full text-left'>
                <tbody className='divide-y divide-slate-50'>
                  {[
                    98.56, 97.83, 94.32, 93.45, 92.2, 92.2, 92.2, 92.2, 92.2,
                  ].map((score, i) => (
                    <tr
                      key={i}
                      className='hover:bg-blue-50/50 transition-colors'
                    >
                      <td className='p-3 pl-4 w-10'>
                        <span className='font-bold text-indigo-600 text-xs'>
                          {i + 1}
                        </span>
                      </td>
                      <td className='p-3'>
                        <div className='flex items-center gap-3'>
                          <div className='w-6 h-6 rounded-full bg-gray-200 overflow-hidden'>
                            <img
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`}
                              alt='Siswa'
                            />
                          </div>
                          <span className='font-bold text-slate-700 text-xs'>
                            {[
                              'Fanan Agfian Mozart',
                              'Michale Kevin',
                              'Richard Santoso',
                              'Clara Puspita',
                            ][i] || 'Kevin Evan Santoso'}
                          </span>
                        </div>
                      </td>
                      <td className='p-3 pr-4 text-right'>
                        <span className='font-bold text-slate-500 text-xs'>
                          {score}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function StatistikKelas() {
  // State untuk menyimpan ID kelas yang sedang terbuka
  const [openId, setOpenId] = useState(1); // Default kelas pertama terbuka

  const toggleAccordion = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const classes = [
    { id: 1, name: 'XII MIPA 6' },
    { id: 2, name: 'XII MIPA 5' },
    { id: 3, name: 'XII MIPA 4' },
    { id: 4, name: 'XII MIPA 3' },
  ];

  return (
    <DashboardLayout role='waka'>
      <Head>
        <title>Statistik Kelas - Pandai</title>
      </Head>

      <div className='flex flex-col gap-6 max-w-[1400px]'>
        <h1 className='text-2xl font-bold text-slate-800'>
          Dashboard WAKA / Statistik Siswa
        </h1>

        <div className='mt-2'>
          <h2 className='text-lg font-bold text-indigo-900 mb-4'>Kelas</h2>

          <div className='flex flex-col gap-2'>
            {classes.map((cls) => (
              <ClassAccordion
                key={cls.id}
                classNameString={cls.name}
                isOpen={openId === cls.id}
                onClick={() => toggleAccordion(cls.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
