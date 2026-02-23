import React from 'react';
import ListCard from '../_shared/ListCard';
import { Bell } from 'lucide-react';
import Title from '@/components/_shared/Title';

export default function HomeScreen() {
  return (
    <div className='px-6 pb-24 pt-4'>
      <div className='flex justify-between items-start mb-6'>
        <div className='flex items-center gap-3'>
          <img
            src={MOCK_USER?.avatar}
            alt='Profile'
            className='w-12 h-12 rounded-full object-cover border-2 border-gray-100'
          />
          <div>
            <h3 className='font-bold text-[#0f0c29]'>{MOCK_USER?.name}</h3>
            <span className='text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md font-medium'>
              {MOCK_USER?.role}
            </span>
          </div>
        </div>
        <button className='p-2.5 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50'>
          <Bell size={20} />
        </button>
      </div>

      <h1 className='text-[28px] font-bold mb-8 flex items-center gap-2 bg-linear-to-r from-black to-[#003EC0] bg-clip-text text-transparent b'>
        Hellooo, Mozart{' '}
        <div className='bg-logo-only bg-cover bg-no-repeat w-8 aspect-42/34 inline-block animate-bounce'></div>
      </h1>

      <div className='relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden mb-6 shadow-xl shadow-blue-200/50 group'>
        <div className='absolute inset-0 bg-gradient-to-b from-primary-blue to-[#7d6dfb]  '>
          <div className='h-full p-6 flex flex-col items-center text-center bg-fire-panda bg-no-repeat bg-[position:50%_calc(100%_+_1rem)]'>
            <span className='bg-white/20 backdrop-blur-md text-white text-[10px] font-medium px-4 py-1.5 rounded-full mb-4 border border-white/10'>
              19 Desember 2025
            </span>

            <h2 className='text-white text-xl font-bold leading-snug mb-1'>
              Nilai Matematika kamu
              <br />
              naik 30% minggu ini🔥
            </h2>
          </div>
        </div>

        <div className='absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl'></div>
        <div className='absolute -top-20 -left-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl'></div>
      </div>
      <div className='bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mb-8'>
        <div className='flex justify-center mb-4'>
          <h3 className='font-bold flex items-center gap-2 bg-gradient-to-b from-black to-[#003EC0] bg-clip-text text-transparent text-base'>
            Progress Harian
          </h3>
        </div>
        <div className='flex items-center'>
          <div className='flex-1 flex flex-col items-center gap-1 border-r border-gray-100'>
            <span className='text-gray-400 text-xs font-medium'>
              Materi dipelajari
            </span>
            <span className='text-4xl font-bold text-[#0f0c29]'>3</span>
          </div>
          <div className='flex-1 flex flex-col items-center gap-1'>
            <span className='text-gray-400 text-xs font-medium'>
              Tugas Dikerjakan
            </span>
            <span className='text-4xl font-bold text-[#0f0c29]'>2</span>
          </div>
        </div>
      </div>
      <div>
        <Title level='h3' mb='mb-4'>
          Tugas dalam tenggat
        </Title>
        <div className='flex flex-col gap-2'>
          <ListCard
            title='Tugas Bahasa Inggris'
            description='22 November 2025'
            icon='bg-ind-icon'
          />
          <ListCard
            title='Tugas Bahasa Inggris'
            description='22 November 2025'
            icon='bg-eng-icon'
          />
          <ListCard
            title='Tugas Matematika'
            description='22 November 2025'
            icon='bg-math-icon'
          />
        </div>
      </div>
    </div>
  );
}

const MOCK_USER = {
  name: 'Fanan Agfian Mozart',
  role: 'Murid',
  nisn: '123456789',
  nis: '123456789',
  avatar: 'https://i.pravatar.cc/150?u=mozart_student',
};
