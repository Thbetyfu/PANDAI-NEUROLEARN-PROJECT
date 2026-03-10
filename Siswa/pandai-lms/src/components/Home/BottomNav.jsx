import React from 'react';
import { LayoutGrid, BookOpen, ClipboardList, User } from 'lucide-react';

export default function BottomNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'beranda', label: 'Beranda', icon: LayoutGrid },
    { id: 'pelajaran', label: 'Pelajaran', icon: BookOpen },
    { id: 'tugas', label: 'Tugas', icon: ClipboardList },
    { id: 'profil', label: 'Profil', icon: User },
  ];

  const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);

  return (
    <div className='bg-white border-t border-gray-100 pb-8 pt-4 px-6 sticky bottom-0 z-50'>
      <div className='relative flex justify-between items-end'>
        <div
          className='absolute -top-4 left-0 w-1/4 h-1.5 flex justify-center transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)'
          style={{ transform: `translateX(${activeIndex * 100}%)` }}
        >
          <div className='w-10 h-full bg-[#4c3ae3] rounded-b-lg shadow-[0_2px_8px_rgba(76,58,227,0.4)]'></div>
        </div>

        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center gap-1 flex-1 transition-colors duration-300 z-10 ${
                isActive
                  ? 'text-[#4c3ae3]'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon
                size={24}
                strokeWidth={isActive ? 2.5 : 2}
                fill={isActive ? '#4c3ae320' : 'none'}
              />
              <span
                className={`text-[10px] ${
                  isActive ? 'font-bold' : 'font-medium'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
