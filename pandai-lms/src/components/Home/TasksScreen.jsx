import React from 'react';
import { ChevronRight, Clock } from 'lucide-react';
import ListCard from '../_shared/ListCard';

import DummyDataSets from '../../../dummyDatas';

export default function TasksScreen() {
  return (
    <div className='px-6 pb-24 pt-6'>
      <div className='flex items-center gap-2 mb-8'>
        <h1 className='text-[28px] font-bold bg-gradient-to-r from-black via-[#003EC0] to-[#003EC0] bg-clip-text text-transparent'>
          Tugas yang perlu kamu selesaikan
        </h1>

        <div className='bg-logo-only bg-cover bg-no-repeat w-8 aspect-42/34 inline-block animate-bounce'></div>
      </div>

      <h3 className='font-bold bg-linear-to-r from-black to-[#003EC0] bg-clip-text text-transparent text-[22px] mb-4'>
        Berdasarkan Mata Pelajaran
      </h3>
      <div className='flex gap-4 overflow-x-auto pb-6 -mx-6 px-6 no-scrollbar snap-x'>
        {coursesDummyData.map((card) => (
          <div
            key={card.id}
            className='snap-start min-w-[140px] bg-white p-5 rounded-[1.5rem] shadow-sm border border-gray-100 flex flex-col items-center gap-3 hover:border-[#4c3ae3] transition-colors cursor-pointer group'
          >
            <div className='flex items-center gap-1'>
              <span className='text-xs font-bold text-[#0f0c29]'>
                {card.title}
              </span>
              <ChevronRight size={14} className='text-gray-300' />
            </div>
            <div
              className={`w-14 h-14 ${card.color} rounded-2xl flex items-center justify-center text-3xl mb-1 group-hover:scale-110 transition-transform bg-cover bg-no-repeat ${card.icon}`}
            ></div>
          </div>
        ))}
      </div>

      <h3 className='font-bold bg-linear-to-r from-black to-[#003EC0] bg-clip-text text-transparent text-[22px] mb-4'>
        Dalam Tenggat
      </h3>
      <div className='space-y-4'>
        {TASKS.map((task) => (
          <React.Fragment key={task.id}>
            <ListCard
              title={task.title}
              description={task.date}
              icon={task.icon}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

const coursesDummyData = [
  {
    id: 1,
    title: 'Bahasa Ind...',
    progress: '0/12 bab dipelajari',
    icon: 'bg-ind-icon',
  },
  {
    id: 2,
    title: 'Bahasa Ing...',
    progress: '0/12 bab dipelajari',
    icon: 'bg-eng-icon',
  },
  {
    id: 3,
    title: 'Matematika',
    progress: '0/12 bab dipelajari',
    icon: 'bg-math-icon',
  },
  {
    id: 4,
    title: 'Fisika',
    progress: '0/12 bab dipelajari',
    icon: 'bg-physc-icon',
  },
  {
    id: 5,
    title: 'Pendidikan....',
    progress: '0/12 bab dipelajari',
    icon: 'bg-pkn-icon',
  },
];

const TASKS = [
  {
    id: 1,
    title: 'Tugas Matematika Wajib: Fungsi',
    date: '22 November 2025',
    icon: 'bg-math-icon',
  },
  {
    id: 2,
    title: 'Tugas Bahasa Inggris: Past Tense',
    date: '22 November 2025',
    icon: 'bg-eng-icon',
  },
  {
    id: 3,
    title: 'Tugas Fisika: Kinematika',
    date: '23 November 2025',
    icon: 'bg-physc-icon',
  },
];
