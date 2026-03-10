import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  ChevronLeft,
  Home,
  X,
  Swords,
  Trophy,
  CheckCircle2,
  XCircle,
  Heart,
} from 'lucide-react';
import Title from '@/components/_shared/Title';
import DummyDataSets from '../../../../../../dummyDatas';

export default function MinigamePage() {
  const router = useRouter();
  const { courseName, chapterId } = router.query;

  const [minigameData, setMinigameData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [gamePhase, setGamePhase] = useState('story');
  const [storyIndex, setStoryIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [heroHp, setHeroHp] = useState(100);
  const [enemyHp, setEnemyHp] = useState(100);

  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const [feedbackText, setFeedbackText] = useState(null);
  const [showAnswerModal, setShowAnswerModal] = useState(false);

  const storySequence = [
    { speaker: 'Budi', text: 'Wah ada alien iiii takotnye....', side: 'left' },
    {
      speaker: 'Alien',
      text: 'Rawr aku sangat lapar, aku suka anak kecil😋',
      side: 'right',
    },
  ];

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
        if (chapter && chapter.minigame) {
          setMinigameData(chapter.minigame);
        }
      }
      setIsLoading(false);
    }
  }, [router.isReady, courseName, chapterId]);

  const handleNextStory = () => {
    if (storyIndex < storySequence.length - 1) {
      setStoryIndex((prev) => prev + 1);
    } else {
      setGamePhase('battle');
    }
  };

  const handleAnswer = (selectedOption) => {
    if (!minigameData) return;
    setShowAnswerModal(false);
    const actualQuestionIndex =
      currentQuestionIndex % minigameData.questions.length;
    const currentQ = minigameData.questions[actualQuestionIndex];

    const isCorrect = selectedOption === currentQ.correctAnswer;

    if (isCorrect) {
      const damage = 20;
      setEnemyHp((prev) => Math.max(0, prev - damage));
      setFeedbackText('Rasakan itu dasar alien!!!');
      setCorrectCount((prev) => prev + 1);
    } else {
      const damage = 20;
      setHeroHp((prev) => Math.max(0, prev - damage));
      setFeedbackText('Aduh! Serangan meleset!');
      setWrongCount((prev) => prev + 1);
    }
  };

  const handleNextBattle = () => {
    if (heroHp <= 0) {
      setGamePhase('result');
      return;
    }
    if (enemyHp <= 0) {
      setGamePhase('result');
      return;
    }
    setCurrentQuestionIndex((prev) => prev + 1);
    setFeedbackText(null);
  };

  if (isLoading || !minigameData)
    return (
      <div className='h-screen flex items-center justify-center'>
        Loading Game...
      </div>
    );

  const HealthBar = ({ current, max, label, colorClass, align }) => (
    <div
      className={`flex flex-col w-[45%] ${
        align === 'right' ? 'items-end' : 'items-start'
      }`}
    >
      <div className='bg-yellow-500 text-white font-bold px-4 py-1 rounded-full text-xs mb-1 shadow-md border-2 border-white'>
        {label}
      </div>
      <div className='w-full h-5 bg-gray-700 rounded-full border-2 border-white relative overflow-hidden shadow-lg'>
        <div
          className={`h-full transition-all duration-500 ${colorClass}`}
          style={{ width: `${(current / max) * 100}%` }}
        />
        <span className='absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-md'>
          {current}/{max}
        </span>
      </div>
    </div>
  );

  const actualQuestionIndex =
    currentQuestionIndex % minigameData.questions.length;
  const currentQ = minigameData.questions[actualQuestionIndex];

  let activeSpeaker = '';
  let activeText = '';
  let activeSide = 'left';

  if (gamePhase === 'story') {
    const story = storySequence[storyIndex];
    activeSpeaker = story.speaker;
    activeText = story.text;
    activeSide = story.side;
  } else if (gamePhase === 'battle') {
    if (feedbackText) {
      activeSpeaker = 'Budi';
      activeText = feedbackText;
      activeSide = 'left';
    } else {
      activeSpeaker = '';
      activeText = currentQ.text;
      activeSide = 'center';
    }
  }

  const heroImageVar =
    heroHp <= 40
      ? 'var(--background-image-budi-low)'
      : 'var(--background-image-budi-full)';

  let enemyImageVar = 'var(--background-image-alien-full)';
  if (enemyHp <= 20) {
    enemyImageVar = 'var(--background-image-alien-low)';
  } else if (enemyHp <= 60) {
    enemyImageVar = 'var(--background-image-alien-half)';
  }

  if (gamePhase === 'result') {
    const isAlienDefeated = enemyHp <= 0;
    const score = heroHp;

    let title = 'Misi Selesai!';
    let subtitle = '';
    let trophyColor = 'text-yellow-500';
    let bgTrophy = 'bg-yellow-100';
    let scoreColor = 'text-[#1e1b4b]';

    if (isAlienDefeated) {
      title = 'Alien Kalah!';
      subtitle = 'Hebat! Kamu menyelamatkan bumi.';
      trophyColor = 'text-green-600';
      bgTrophy = 'bg-green-100';
      scoreColor = 'text-green-600';
    } else {
      title = 'Kamu Kalah!';
      subtitle = 'Budi kehabisan tenaga...';
      trophyColor = 'text-red-500';
      bgTrophy = 'bg-red-100';
      scoreColor = 'text-red-500';
    }

    return (
      <div className='min-h-screen bg-[#1c1c1e] flex justify-center items-center font-sans'>
        <div className='w-full max-w-[400px] bg-white h-screen sm:h-[844px] sm:rounded-[3rem] overflow-hidden flex flex-col relative pt-6'>
          <div className='flex-1 flex flex-col items-center justify-center px-8 pb-10'>
            <div
              className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 shadow-2xl ${bgTrophy}`}
            >
              {isAlienDefeated ? (
                <Trophy
                  size={64}
                  className={trophyColor}
                  fill='currentColor'
                  fillOpacity={0.2}
                />
              ) : (
                <Heart
                  size={64}
                  className={trophyColor}
                  fill='currentColor'
                  fillOpacity={0.2}
                />
              )}
            </div>

            <h2 className='text-3xl font-bold text-[#0f172a] mb-1'>{title}</h2>
            <p className='text-gray-500 mb-8 font-medium text-center'>
              {subtitle}
            </p>

            <div className='w-full bg-white border border-gray-100 rounded-3xl p-6 shadow-xl shadow-gray-200/50 mb-8'>
              <div className='text-center mb-6'>
                <span className='text-sm text-gray-400 font-bold uppercase tracking-wider'>
                  Sisa HP (Nilai Akhir)
                </span>
                <div className={`text-6xl font-black mt-2 ${scoreColor}`}>
                  {score}
                </div>
              </div>

              <div className='flex gap-4'>
                <div className='flex-1 bg-green-50 rounded-2xl p-4 flex flex-col items-center border border-green-100'>
                  <CheckCircle2 size={24} className='text-green-600 mb-2' />
                  <span className='text-2xl font-bold text-green-700'>
                    {correctCount}
                  </span>
                  <span className='text-xs font-semibold text-green-600'>
                    Benar
                  </span>
                </div>
                <div className='flex-1 bg-red-50 rounded-2xl p-4 flex flex-col items-center border border-red-100'>
                  <XCircle size={24} className='text-red-500 mb-2' />
                  <span className='text-2xl font-bold text-red-700'>
                    {wrongCount}
                  </span>
                  <span className='text-xs font-semibold text-red-600'>
                    Salah
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => router.back()}
              className='w-full bg-[#1e1b4b] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-lg'
            >
              <Home size={20} /> Selesai & Kembali
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Minigame - {minigameData.gameTitle}</title>
      </Head>

      <div className='flex flex-col h-screen w-full bg-[#FBFCFF] font-sans overflow-hidden relative pt-12'>
        <div className='flex items-center gap-2 p-6 pt-18 fixed bg-white top-0 w-full z-999'>
          <button
            onClick={() => router.back()}
            className='p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors'
          >
            <ChevronLeft size={28} className='text-gray-900' />
          </button>
          <Title mb='mb-0'>Melawan Alien</Title>
        </div>

        <div
          className='relative flex-1 bg-gray-100 overflow-hidden bg-cover bg-center'
          style={{ backgroundImage: 'var(--background-image-minigame-bg)' }}
        >
          <div className='absolute inset-0 bg-minigame-bg flex items-end justify-center bg-opacity-20'>
            <div className='w-full h-1/3 bg-gradient-to-t from-gray-900 to-transparent opacity-50'></div>
          </div>

          <div
            className={`absolute bottom-32 left-4 transition-all duration-500 ${
              gamePhase === 'battle' && !feedbackText ? 'scale-105' : ''
            }`}
          >
            <div
              className='w-48 h-64 bg-contain bg-no-repeat bg-bottom drop-shadow-2xl'
              style={{ backgroundImage: heroImageVar }}
            />
          </div>

          <div
            className={`absolute bottom-32 right-4 transition-all duration-500 ${
              gamePhase === 'battle' && feedbackText
                ? 'animate-pulse opacity-80'
                : ''
            }`}
          >
            <div
              className='w-56 h-72 bg-contain bg-no-repeat bg-bottom drop-shadow-2xl'
              style={{ backgroundImage: enemyImageVar }}
            />
          </div>

          {gamePhase === 'battle' && (
            <div className='absolute top-28 left-0 w-full px-4 flex justify-between z-10'>
              <HealthBar
                current={heroHp}
                max={100}
                label='Budi'
                colorClass='bg-green-500'
                align='left'
              />
              <HealthBar
                current={enemyHp}
                max={100}
                label='Alien'
                colorClass='bg-red-500'
                align='right'
              />
            </div>
          )}

          {showAnswerModal && (
            <div className='absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 animate-in fade-in duration-200'>
              <div className='bg-white w-full max-h-[80%] overflow-y-auto rounded-3xl p-5 shadow-2xl border-4 border-yellow-400 animate-in zoom-in-95 duration-200'>
                <div className='flex justify-between items-center mb-4'>
                  <h3 className='text-lg font-bold text-gray-800 flex items-center gap-2'>
                    <Swords size={20} className='text-orange-500' /> Pilih
                    Serangan
                  </h3>
                  <button
                    onClick={() => setShowAnswerModal(false)}
                    className='p-1 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-600'
                  >
                    <X size={20} />
                  </button>
                </div>

                <p className='text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100'>
                  {currentQ.text}
                </p>

                <div className='flex flex-col gap-3'>
                  {currentQ.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(opt)}
                      className='w-full text-left bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold p-4 rounded-xl shadow-md active:scale-[0.98] transition-all border-b-4 border-orange-600 hover:brightness-105'
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className='absolute bottom-6 left-4 right-4 z-20'>
            {activeSpeaker && (
              <div
                className={`absolute -top-4 ${
                  activeSide === 'right' ? 'right-4' : 'left-0'
                } z-30`}
              >
                <div className='bg-yellow-500 text-white font-bold px-6 py-1.5 rounded-t-xl rounded-br-xl shadow-md border-2 border-white text-sm'>
                  {activeSpeaker}
                </div>
              </div>
            )}

            <div className='bg-white/95 backdrop-blur-sm border-4 border-yellow-400 rounded-3xl p-5 shadow-2xl min-h-[140px] flex flex-col justify-between'>
              <p className='text-gray-800 font-bold text-lg leading-snug pr-2'>
                {activeText}
              </p>

              {(gamePhase === 'story' ||
                (gamePhase === 'battle' && feedbackText)) && (
                <div className='flex justify-end mt-2'>
                  <button
                    onClick={
                      gamePhase === 'story' ? handleNextStory : handleNextBattle
                    }
                    className='flex items-center gap-1 text-gray-500 font-bold text-sm hover:text-black transition-colors px-2 py-1'
                  >
                    Next <span className='text-lg'>{'>>'}</span>
                  </button>
                </div>
              )}

              {gamePhase === 'battle' && !feedbackText && (
                <div className='mt-4'>
                  <button
                    onClick={() => setShowAnswerModal(true)}
                    className='w-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white font-bold py-3 rounded-xl shadow-lg active:scale-95 flex justify-center items-center gap-2 animate-pulse'
                  >
                    <Swords size={20} />
                    Pilih Serangan
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
