import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { ChevronLeft, Send, CheckCircle2 } from 'lucide-react';
import Title from '@/components/_shared/Title';

// Import Data Dummy
import DummyDataSets from '../../../../../../dummyDatas';

export default function SentimentPage() {
  const router = useRouter();
  const { courseName, chapterId } = router.query;

  // --- State Data ---
  const [sentimentData, setSentimentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- State UX ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // Menyimpan jawaban { id_soal: jawaban }
  const [textInput, setTextInput] = useState(''); // State khusus untuk input tipe text
  const [isFinished, setIsFinished] = useState(false);

  // --- Load Data ---
  useEffect(() => {
    if (!router.isReady) return;
    if (courseName && chapterId) {
      const course = DummyDataSets.find(
        (c) => c.title.toLowerCase() === courseName.toLowerCase()
      );
      if (course) {
        const chapter = course.chapters.find(
          (ch) => ch.chapterId === parseInt(chapterId)
        );
        if (chapter && chapter.sentimentAnalysis) {
          setSentimentData(chapter.sentimentAnalysis);
        }
      }
      setIsLoading(false);
    }
  }, [router.isReady, courseName, chapterId]);

  // --- Handlers ---

  const handleNext = (answerValue) => {
    // 1. Simpan Jawaban
    const currentQ = sentimentData[currentIndex];
    setAnswers((prev) => ({ ...prev, [currentQ.id]: answerValue }));

    // 2. Reset Text Input (jika ada)
    setTextInput('');

    // 3. Navigasi
    if (currentIndex < sentimentData.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (textInput.trim() !== '') {
      handleNext(textInput);
    }
  };

  // --- Loading State ---
  if (isLoading || !sentimentData) {
    return (
      <div className='min-h-screen flex items-center justify-center text-gray-500'>
        Memuat Data...
      </div>
    );
  }

  // --- VIEW: FINISHED / THANK YOU ---
  if (isFinished) {
    return (
      <div className='min-h-screen bg-[#1c1c1e] flex justify-center items-center font-sans'>
        <div className='w-full max-w-[400px] bg-white h-screen sm:h-[844px] sm:rounded-[3rem] overflow-hidden flex flex-col relative shadow-2xl'>
          <div className='flex-1 flex flex-col items-center justify-center px-8 text-center'>
            <div className='w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500'>
              <CheckCircle2 size={64} className='text-purple-600' />
            </div>
            <h2 className='text-2xl font-bold text-[#0f172a] mb-2'>
              Terima Kasih!
            </h2>
            <p className='text-gray-500 mb-8 font-medium'>
              Masukan kamu sangat berharga untuk perkembangan materi kami.
            </p>
            <button
              onClick={() => router.push(`/course/${courseName}`)}
              className='w-full bg-[#1e1b4b] text-white font-bold py-4 rounded-2xl shadow-lg active:scale-[0.98] transition-transform'
            >
              Kembali ke Materi
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW: QUESTION ---
  const currentQ = sentimentData[currentIndex];
  const progressPercent = ((currentIndex + 1) / sentimentData.length) * 100;

  return (
    <>
      <Head>
        <title>Sentiment Analysis</title>
      </Head>

      <div className='flex flex-col min-h-screen w-full bg-[#FBFCFF] font-sans overflow-hidden relative pt-12 p-6'>
        <div className='flex items-center gap-2 pb-6 pt-18 fixed bg-white top-0 w-full z-999'>
          <button
            onClick={() => router.back()}
            className='p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors'
          >
            <ChevronLeft size={28} className='text-gray-900' />
          </button>
          <Title mb='mb-0'>Sentimen Analisis</Title>
        </div>

        {/* Progress Bar */}
        <div className=' py-2 pt-24'>
          <div className='w-full h-2.5 bg-gray-100 rounded-full overflow-hidden'>
            <div
              className='h-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-500 ease-out rounded-full'
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className='text-right text-xs text-gray-400 font-medium mt-1'>
            {currentIndex + 1} dari {sentimentData.length}
          </p>
        </div>

        {/* Scrollable Content */}
        <div className='flex-1 overflow-y-auto no-scrollbar px-6 pb-8'>
          {/* Question Card */}
          <div className='bg-[#f8fafc] border border-gray-100 rounded-2xl p-6 mb-8 shadow-sm'>
            <h2 className='text-[#1e293b] text-center font-bold text-lg leading-relaxed'>
              {currentQ.question}
            </h2>
          </div>

          {/* Input Area: Berubah sesuai tipe soal */}
          <div className='w-full animate-in slide-in-from-bottom-8 duration-500'>
            <p className='text-center text-[#0f172a] font-bold text-sm mb-4'>
              {currentQ.type === 'multiple-choice'
                ? 'Pilih salah satu:'
                : 'Tulis pendapatmu:'}
            </p>

            {/* TIPE 1: MULTIPLE CHOICE */}
            {currentQ.type === 'multiple-choice' && (
              <div className='space-y-3'>
                {currentQ.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleNext(option)}
                    className='px-6 w-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white font-bold py-3.5 rounded-full shadow-lg shadow-purple-500/20 active:scale-[0.98] transition-transform flex justify-center items-center'
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}

            {/* TIPE 2: TEXT INPUT */}
            {currentQ.type === 'text' && (
              <form onSubmit={handleTextSubmit} className='flex flex-col gap-4'>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder='Ketik jawabanmu di sini...'
                  className='w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700 font-medium h-32 resize-none shadow-inner'
                  autoFocus
                />
                <button
                  type='submit'
                  disabled={!textInput.trim()}
                  className={`
                      w-full font-bold py-3.5 rounded-full shadow-lg flex justify-center items-center gap-2 transition-all
                      ${
                        textInput.trim()
                          ? 'bg-[#1e1b4b] text-white active:scale-[0.98] cursor-pointer'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }
                    `}
                >
                  <span>Lanjut</span>
                  <Send size={18} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
