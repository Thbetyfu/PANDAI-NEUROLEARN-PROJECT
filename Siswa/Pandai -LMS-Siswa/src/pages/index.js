import React, { useState } from 'react';
import HomeScreen from '@/components/Home/HomeScreen';
import CoursesScreen from '@/components/Home/CourseScreen';
import TasksScreen from '@/components/Home/TasksScreen';
import ProfileScreen from '@/components/Home/ProfileScreen';
import BottomNav from '@/components/Home/BottomNav';

export default function App() {
  const [activeTab, setActiveTab] = useState('beranda');

  return (
    <div className='flex flex-col h-screen w-full bg-[#FBFCFF] font-sans overflow-hidden relative pt-12'>
      <div className='flex-1 overflow-y-auto no-scrollbar relative scroll-smooth'>
        {activeTab === 'beranda' && <HomeScreen />}
        {activeTab === 'pelajaran' && <CoursesScreen />}
        {activeTab === 'tugas' && <TasksScreen />}
        {activeTab === 'profil' && <ProfileScreen />}
      </div>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      <div className='absolute bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-800 rounded-full opacity-20 pointer-events-none z-50'></div>
    </div>
  );
}
