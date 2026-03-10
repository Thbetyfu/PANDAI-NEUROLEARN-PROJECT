import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  ChevronLeft,
  RotateCcw,
  Home,
  CheckCircle2,
  XCircle,
  Trophy,
  ArrowRight,
} from 'lucide-react';
import Title from '@/components/_shared/Title';
import TruncateText from '@/lib/TruncateText';
import DummyDataSets from '../../../../../../dummyDatas';

export default function QuizPage() {
  const router = useRouter();
  const { courseName, chapterId } = router.query;

  // --- Data State ---
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeChapter, setActiveChapter] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- Gameplay State ---
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { questionIndex: selectedAnswer }

  // --- Load Data ---
  useEffect(() => {
    if (!router.isReady) return;

    if (courseName && chapterId) {
      const course = DummyDataSets.find(
        (c) => c.title.toLowerCase() === courseName.toLowerCase()
      );

      if (course) {
        setActiveCourse(course);
        const chapter = course.chapters.find(
          (ch) => ch.chapterId === parseInt(chapterId)
        );
        if (chapter) {
          setActiveChapter(chapter);
          setQuizData(chapter.quiz);
        }
      }
      setIsLoading(false);
    }
  }, [router.isReady, courseName, chapterId]);

  // --- Handlers ---
  const handleOptionClick = (selectedOption) => {
    // 1. Simpan jawaban
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: selectedOption,
    }));

    // 2. Logic Navigasi
    // HANYA auto-next jika INI BUKAN soal terakhir
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 300);
    }
    // Jika soal terakhir, JANGAN lakukan apa-apa (tunggu tombol submit ditekan)
  };

  const handleRestart = () => {
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setIsFinished(false);
    setIsStarted(true);
  };

  const calculateResult = () => {
    if (!quizData) return { score: 0, correct: 0, wrong: 0 };

    let correctCount = 0;
    quizData.questions.forEach((q, index) => {
      if (userAnswers[index] === q.correctAnswer) {
        correctCount++;
      }
    });

    const totalQuestions = quizData.questions.length;
    const score = Math.round((correctCount / totalQuestions) * 100);
    const wrongCount = totalQuestions - correctCount;

    return { score, correct: correctCount, wrong: wrongCount };
  };

  // --- Loading View ---
  if (isLoading || !quizData || !activeChapter) {
    return (
      <div className='min-h-screen flex items-center justify-center text-gray-500'>
        Memuat...
      </div>
    );
  }

  // =================================================================
  // VIEW 3: RESULT PAGE
  // =================================================================
  if (isFinished) {
    const { score, correct, wrong } = calculateResult();
    const isPassed = score >= quizData.passingGrade;

    return (
      <div className='flex flex-col min-h-screen w-full bg-[#FBFCFF] font-sans overflow-hidden relative pt-12 p-6'>
        <div className='flex-1 flex flex-col items-center justify-center px-8 pb-20'>
          <div
            className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 shadow-2xl ${
              isPassed ? 'bg-green-100' : 'bg-red-100'
            }`}
          >
            <Trophy
              size={64}
              className={isPassed ? 'text-green-600' : 'text-red-500'}
              fill={isPassed ? '#dcfce7' : '#fee2e2'}
            />
          </div>
          <h2 className='text-3xl font-bold text-[#0f172a] mb-1'>
            {isPassed ? 'Luar Biasa!' : 'Tetap Semangat!'}
          </h2>
          <p className='text-gray-500 mb-8 font-medium'>
            Kamu telah menyelesaikan kuis ini.
          </p>
          <div className='w-full bg-white border border-gray-100 rounded-3xl p-6 shadow-xl shadow-gray-200/50 mb-8'>
            <div className='text-center mb-6'>
              <span className='text-sm text-gray-400 font-bold uppercase tracking-wider'>
                Total Nilai
              </span>
              <div
                className={`text-6xl font-black mt-2 ${
                  isPassed ? 'text-blue-600' : 'text-orange-500'
                }`}
              >
                {score}
              </div>
            </div>
            <div className='flex gap-4'>
              <div className='flex-1 bg-green-50 rounded-2xl p-4 flex flex-col items-center border border-green-100'>
                <CheckCircle2 size={24} className='text-green-600 mb-2' />
                <span className='text-2xl font-bold text-green-700'>
                  {correct}
                </span>
                <span className='text-xs font-semibold text-green-600'>
                  Benar
                </span>
              </div>
              <div className='flex-1 bg-red-50 rounded-2xl p-4 flex flex-col items-center border border-red-100'>
                <XCircle size={24} className='text-red-500 mb-2' />
                <span className='text-2xl font-bold text-red-700'>{wrong}</span>
                <span className='text-xs font-semibold text-red-600'>
                  Salah
                </span>
              </div>
            </div>
          </div>
          <div className='w-full space-y-3'>
            <button
              onClick={handleRestart}
              className='w-full bg-[#1e1b4b] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-lg shadow-indigo-900/20'
            >
              <RotateCcw size={20} /> Ulangi Kuis
            </button>
            <button
              onClick={() => router.push(`/course/${courseName}`)}
              className='w-full bg-white text-gray-700 border-2 border-gray-100 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform hover:bg-gray-50'
            >
              <Home size={20} /> Kembali ke Materi
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =================================================================
  // VIEW 1: INTRO PAGE
  // =================================================================
  if (!isStarted) {
    return (
      <>
        <Head>
          <title>Intro - {activeCourse.title}</title>
        </Head>
        <div className='flex flex-col min-h-screen w-full bg-[#FBFCFF] font-sans overflow-hidden relative pt-12 p-6'>
          <div className='flex items-center gap-2 pb-6 pt-18 fixed bg-white top-0 w-full z-999'>
            <button
              onClick={() => router.back()}
              className='p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors'
            >
              <ChevronLeft size={28} className='text-gray-900' />
            </button>
            <Title mb='mb-0'>{TruncateText(activeCourse?.title, 3)}</Title>
          </div>
          <div className='flex-1 overflow-hidden  no-scrollbar pb-28 px-6 pt-24'>
            <div className='flex justify-center'>
              <div className='w-[232px] aspect-square bg-math-icon bg-cover bg-no-repeat'></div>
            </div>
            <h2 className='text-2xl font-bold text-[#0f172a] mb-2'>
              Latihan {activeChapter.chapterTitle.split(': ')[1] || 'Quiz'}
            </h2>
            <div className='inline-flex items-center bg-gray-100 text-gray-500 text-[11px] px-3 py-1.5 rounded-full mb-6 font-semibold tracking-wide'>
              Deadline:{' '}
              {new Date(quizData.deadline).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </div>
            <p className='text-[#334155] text-[15px] leading-relaxed mb-8 font-medium'>
              Kerjakan latihan fungsi berikut dengan memilih pilihan jawaban
              yang dirasa sesuai.
            </p>
            <div className='bg-[#f8fafc] border border-gray-100 rounded-2xl p-5 space-y-2'>
              <div className='flex items-center gap-2 text-[#334155] font-medium text-sm'>
                <span className='w-1.5 h-1.5 rounded-full bg-slate-400'></span>
                Waktu pengerjaan: 20 menit
              </div>
              <div className='flex items-center gap-2 text-[#334155] font-medium text-sm'>
                <span className='w-1.5 h-1.5 rounded-full bg-slate-400'></span>
                Diizinkan mengerjakan: {quizData.maxAttempts} kali
              </div>
            </div>
          </div>
          <div className='fixed bottom-0 w-[calc(100%-48px)] bg-white/90 backdrop-blur-sm border-t border-gray-50 pb-8'>
            <button
              onClick={() => setIsStarted(true)}
              className='w-full bg-[#1e1b4b] text-white font-bold py-4 rounded-3xl text-lg shadow-xl shadow-indigo-900/10 active:scale-[0.98] transition-all'
            >
              Kerjakan Tugas
            </button>
          </div>
        </div>
      </>
    );
  }

  // =================================================================
  // VIEW 2: GAMEPLAY
  // =================================================================
  const currentQuestion = quizData.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quizData.questions.length - 1;
  const hasAnsweredCurrent = userAnswers[currentQuestionIndex] !== undefined;

  return (
    <>
      <Head>
        <title>Kuis - Soal {currentQuestionIndex + 1}</title>
      </Head>
      <div className='flex flex-col min-h-screen w-full bg-[#FBFCFF] font-sans overflow-hidden relative pt-12 p-6'>
        <div className='flex items-center gap-2 pb-6 pt-18 fixed bg-white top-0 w-full z-999'>
          <button
            onClick={() => router.back()}
            className='p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors'
          >
            <ChevronLeft size={28} className='text-gray-900' />
          </button>
          <Title mb='mb-0'>
            {TruncateText(
              'Latihan ' +
                (activeChapter.chapterTitle.split(': ')[1] || 'Fungsi'),
              2
            )}
          </Title>
        </div>

        {/* Pagination Grid */}
        <div className='border-b border-slate-50 pt-24 pb-6 mb-6'>
          <div className='px-6'>
            <div className='flex flex-wrap gap-2.5 justify-center'>
              {quizData.questions.map((q, index) => {
                const isActive = index === currentQuestionIndex;
                const isAnswered = userAnswers[index] !== undefined;

                let buttonStyle =
                  'bg-white border border-purple-200 text-purple-600 hover:bg-purple-50';
                if (isActive) {
                  buttonStyle =
                    'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 scale-105 border-transparent';
                } else if (isAnswered) {
                  buttonStyle =
                    'bg-green-500 text-white border-transparent shadow-md shadow-green-500/20';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(index)}
                    className={`
                        w-[2.6rem] h-[2.6rem] rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-200
                        ${buttonStyle}
                      `}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Question Area */}
        <div className='flex-1 px-8 flex flex-col items-center overflow-y-auto no-scrollbar pb-8'>
          <div className='text-center w-full mb-10 mt-2'>
            <h2 className='text-[1.75rem] font-bold text-[#1e1b4b] leading-tight mb-8'>
              {currentQuestion.text}
              {currentQuestion.text.includes('__') ||
              currentQuestion.text.includes('...')
                ? null
                : ''}
            </h2>
            <p className='text-[#0f172a] font-bold text-sm tracking-wide'>
              Pilih salah satu:
            </p>
          </div>

          {/* Options List */}
          <div className='w-full space-y-4'>
            {currentQuestion.options.map((option, idx) => {
              const isSelected = userAnswers[currentQuestionIndex] === option;
              let optionClass =
                'bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white shadow-purple-500/20';

              if (isSelected) {
                optionClass =
                  'bg-[#312e81] text-white ring-4 ring-[#6366f1]/30 shadow-xl scale-[0.99]';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(option)}
                  className={`
                      w-full relative overflow-hidden group
                      font-bold text-xl py-3.5 rounded-full 
                      shadow-lg transition-all duration-200
                      ${optionClass}
                    `}
                >
                  <span className='relative z-10'>{option}</span>
                  {!isSelected && (
                    <div className='absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity' />
                  )}
                </button>
              );
            })}
          </div>

          {/* TOMBOL SUBMIT KHUSUS SOAL TERAKHIR */}
          {isLastQuestion && (
            <div className='w-full mt-8 animate-in slide-in-from-bottom-4 duration-500'>
              <button
                onClick={() => setIsFinished(true)}
                className={`
                    w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-lg shadow-xl transition-all
                    bg-[#1e1b4b] text-white hover:bg-[#151338] active:scale-[0.98] shadow-indigo-900/20 cursor-pointer
                  `}
              >
                <span>Selesai & Lihat Hasil</span>
                <ArrowRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
