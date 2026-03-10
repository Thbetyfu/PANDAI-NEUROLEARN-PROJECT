import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  ChevronLeft,
  FileText,
  Gamepad2,
  MessageSquare,
  CheckSquare,
} from 'lucide-react';
import Title from '@/components/_shared/Title';
import ListCard from '@/components/_shared/ListCard';
import DummyDataSets from '../../../../../dummyDatas';
import TruncateText from '@/lib/TruncateText';

const CourseDetail = () => {
  const router = useRouter();
  const { courseName, chapterId } = router.query;

  const [currentChapter, setCurrentChapter] = useState(null);
  const [contentList, setContentList] = useState([]);
  const [activeCardId, setActiveCardId] = useState(null);

  useEffect(() => {
    if (router.isReady && courseName && chapterId) {
      const foundCourse = DummyDataSets.find(
        (c) =>
          c.title.toLowerCase() === courseName.toLowerCase() ||
          c.id.toString() === courseName
      );

      if (foundCourse) {
        const foundChapter = foundCourse.chapters.find(
          (chap) => chap.chapterId.toString() === chapterId
        );

        if (foundChapter) {
          setCurrentChapter(foundChapter);

          // Generate list content
          const generatedList = [
            {
              id: 'video',
              title: 'Video Pembelajaran',
              type: 'video',
              status: 'Dipelajari',
              data: foundChapter.resources?.videoUrl,
              thumbnail: null,
              duration: '03:12',
            },
            {
              id: 'ppt',
              title: 'PPT Pembelajaran',
              type: 'material',
              status: 'Dipelajari',
              data: foundChapter.resources?.pptUrl,
              icon: <FileText size={20} />,
            },
            {
              id: 'quiz',
              title: foundChapter.quiz?.title || 'Tugas Latihan',
              type: 'task',
              status: 'Dikerjakan',
              data: foundChapter.quiz,
              icon: <CheckSquare size={20} />,
            },
            {
              id: 'feedback',
              title: 'Sentimen Analisis',
              type: 'analysis',
              status: 'Dikerjakan',
              data: foundChapter.feedback,
              icon: <MessageSquare size={20} />,
            },
            {
              id: 'game',
              title: 'Minigame',
              type: 'game',
              status: 'Dikerjakan',
              data: foundChapter.minigame,
              icon: <Gamepad2 size={20} />,
            },
          ];

          setContentList(generatedList);
          // Default buka video saat pertama load
          setActiveCardId('video');
        }
      }
    }
  }, [router.isReady, courseName, chapterId]);

  // Handle Toggle khusus untuk Video (Accordion)
  const handleToggle = (id) => {
    setActiveCardId(activeCardId === id ? null : id);
  };

  // Handle Navigasi untuk item selain Video
  const handleNavigation = (item) => {
    // Base path untuk mempermudah penulisan URL
    const basePath = `/course/${courseName}/${chapterId}`;

    switch (item.id) {
      case 'ppt':
        // Redirect ke home (sesuai request)
        router.push('/');
        break;
      case 'quiz':
        // Redirect ke halaman Kuis
        router.push(`${basePath}/kuis`);
        break;
      case 'feedback':
        // Redirect ke halaman Sentimen Analisis
        router.push(`${basePath}/sentimen-analisis`);
        break;
      case 'game':
        // Redirect ke halaman Minigame
        router.push(`${basePath}/minigame`);
        break;
      default:
        // Jika tidak ada case yang cocok, tidak melakukan apa-apa
        break;
    }
  };

  if (!router.isReady)
    return <div className='p-6 text-center text-gray-500'>Memuat...</div>;

  if (!currentChapter)
    return (
      <div className='p-6 text-center text-red-500'>
        <p className='font-bold'>Bab tidak ditemukan!</p>
        <p className='text-sm text-gray-400'>
          Pastikan URL benar (contoh: /course/Matematika/303)
        </p>
        <button
          onClick={() => router.back()}
          className='mt-4 text-blue-500 underline'
        >
          Kembali
        </button>
      </div>
    );

  return (
    <div className='min-h-screen bg-gray-50 p-6 font-sans max-w-md mx-auto pt-12'>
      <div className='flex items-center gap-2 pb-6 pt-18 fixed bg-white top-0 w-full z-999'>
        <button
          onClick={() => router.back()}
          className='p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors'
        >
          <ChevronLeft size={28} className='text-gray-900' />
        </button>
        <Title mb='mb-0'>{TruncateText(currentChapter.chapterTitle, 3)}</Title>
      </div>

      {/* LIST CONTENT */}
      <div className='flex flex-col gap-3 pt-24'>
        {contentList.map((item) => {
          const isOpen = activeCardId === item.id;

          // 1. RENDER CARD VIDEO (Pake logic Toggle/Accordion)
          if (item.type === 'video') {
            return (
              <ListCard
                key={item.id}
                title={item.title}
                description={item.status}
                variant='extended'
                isOpen={isOpen}
                onClick={() => handleToggle(item.id)} // Hanya toggle, tidak redirect
              >
                {isOpen && (
                  <div className='px-4 pb-4 animate-in fade-in slide-in-from-top-2 duration-300'>
                    <div className='relative w-full rounded-2xl overflow-hidden aspect-video bg-gray-900 shadow-lg group cursor-pointer'>
                      <iframe
                        className='w-full h-full'
                        src='https://www.youtube.com/embed/XL95jjINJ_0?si=odKDXqUlitRVRSg9'
                        title='YouTube video player'
                        frameborder='0'
                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                        referrerpolicy='strict-origin-when-cross-origin'
                        allowfullscreen
                      ></iframe>
                    </div>
                  </div>
                )}
              </ListCard>
            );
          }

          // 2. RENDER CARD LAINNYA (Pake logic Redirect)
          return (
            <ListCard
              key={item.id}
              title={item.title}
              description={item.status}
              variant='default'
              // Tambahkan onClick handler untuk navigasi
              onClick={() => handleNavigation(item)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CourseDetail;
