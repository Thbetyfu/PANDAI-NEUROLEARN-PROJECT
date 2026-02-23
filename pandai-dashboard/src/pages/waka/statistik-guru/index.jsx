import Head from 'next/head';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { ChevronDown } from 'lucide-react';

// --- COMPONENTS ---

// 1. Kartu Performa Guru (Horizontal Premium Design)
const PerformanceCard = ({ teacher, type = 'good' }) => {
  const isGood = type === 'good';

  // Calculate circle progress (percentage * 0.45 for partial circle)
  const progressAngle = (teacher.percentage / 100) * 360;
  const progressDegrees = Math.min(progressAngle, 180); // Max 180 degrees for half circle

  return (
    <div
      className='flex flex-row items-start p-6 gap-[21px] w-[503px] h-[309px] rounded-[24px] border border-black/20'
      style={{
        background: isGood
          ? 'linear-gradient(180deg, #FFFFFF 50%, #E9F2FB 100%)'
          : 'linear-gradient(180deg, #FFFFFF 50%, #FBE9E9 100%)'
      }}
    >
      {/* LEFT: Profile Section (152px) */}
      <div className='flex flex-col items-start gap-[21px] w-[152px]'>
        {/* Profile & Name */}
        <div className='flex flex-col items-start gap-[18px] w-full'>
          {/* Profile Image */}
          <div className='w-20 h-20 rounded-full overflow-hidden'>
            <img
              src={teacher.image}
              alt={teacher.name}
              className='w-full h-full object-cover'
            />
          </div>

          {/* Name & NIP */}
          <div className='flex flex-col items-start gap-[7px] w-full'>
            <h4
              className='w-full h-6 font-semibold text-2xl leading-[100%] tracking-[-0.06em]'
              style={{
                background: 'linear-gradient(180deg, #000000 4.61%, #000000 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {teacher.name}
            </h4>
            <p
              className='w-full h-[14px] font-medium text-sm leading-[100%] tracking-[-0.06em]'
              style={{
                background: 'linear-gradient(180deg, #000000 4.61%, #000000 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              NIP: {teacher.nip}
            </p>
          </div>
        </div>

        {/* Mapel Diampu */}
        <div className='flex flex-col items-start gap-[7px] w-full'>
          <p
            className='w-full h-[14px] font-medium text-sm leading-[100%] tracking-[-0.06em]'
            style={{
              background: 'linear-gradient(180deg, #000000 4.61%, #000000 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Mapel Diampu
          </p>
          <div className='flex flex-row flex-wrap items-center gap-x-1 gap-y-2 w-full'>
            <span className='flex items-center justify-center px-2 py-[1px] bg-black/[0.02] border border-black/10 rounded-full text-xs font-medium leading-[15px] tracking-[-0.02em] text-[#37364E]'>
              {teacher.mapel}
            </span>
          </div>
        </div>

        {/* Wali Kelas */}
        <div className='flex flex-col items-start gap-[7px] w-full'>
          <p
            className='w-full h-[14px] font-medium text-sm leading-[100%] tracking-[-0.06em]'
            style={{
              background: 'linear-gradient(180deg, #000000 4.61%, #000000 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Wali kelas
          </p>
          <div className='flex flex-row flex-wrap items-center gap-x-1 gap-y-2 w-full'>
            <span className='flex items-center justify-center px-2 py-[1px] bg-black/[0.02] border border-black/10 rounded-full text-xs font-medium leading-[15px] tracking-[-0.02em] text-[#37364E]'>
              {teacher.waliKelas}
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT: Stats Section (282px) */}
      <div className='flex flex-col items-start gap-2.5 w-[282px]'>
        {/* Circular Progress & Stats */}
        <div className='flex flex-row justify-center items-center py-[9px] gap-[10px] w-full h-[72px]'>
          {/* Dual Circle SVG */}
          <div className='relative w-[54px] h-[54px]'>
            <svg className='w-full h-full' viewBox='0 0 54 54'>
              {/* Background Circle (Ellipse 167) */}
              <circle
                cx='27'
                cy='27'
                r='22.5'
                fill='none'
                stroke='#E5E5E5'
                strokeWidth='9'
              />
              {/* Progress Circle (Ellipse 168) */}
              {/* Progress Circle (Ellipse 168) - Adjusted to match Background size */}
              <circle
                cx='27'
                cy='27'
                r='22.5'
                fill='none'
                stroke='#0041C9'
                strokeWidth='9'
                strokeDasharray={`${(teacher.done / teacher.total) * 141.4} 141.4`}
                strokeDashoffset='0'
                transform='rotate(-90 27 27)'
                strokeLinecap='round'
              />
            </svg>
          </div>

          {/* Stats Text */}
          <div className='flex flex-col items-start gap-2'>
            {/* Main Stats */}
            <div className='flex flex-row items-end gap-1'>
              <span className='font-semibold text-[32px] leading-[150%] tracking-[-0.04em] text-[#1D115A]'>
                {teacher.done}/{teacher.total}
              </span>
              <span className='font-medium text-sm leading-[150%] tracking-[-0.04em] text-[#1D115A]'>
                murid sudah paham
              </span>
            </div>

            {/* Badge */}
            <div
              className={`flex flex-row justify-center items-center px-1.5 py-[1px] gap-1 rounded ${isGood
                ? 'bg-[rgba(13,159,0,0.05)] border border-[rgba(13,159,0,0.2)]'
                : 'bg-[rgba(255,0,0,0.05)] border border-[rgba(255,0,0,0.2)]'
                }`}
            >
              {/* Arrow Icon */}
              <svg className='w-2.5 h-[5px]' viewBox='0 0 10 5'>
                <path
                  d={isGood ? 'M5 0L9 5H1L5 0Z' : 'M5 5L9 0H1L5 5Z'}
                  fill={isGood ? '#0D9F00' : '#FF0000'}
                />
              </svg>
              <span className={`font-medium text-xs leading-[15px] tracking-[-0.02em] ${isGood ? 'text-[#0D9F00]' : 'text-[#FF0000]'
                }`}>
                {isGood ? '10%' : '6%'}
              </span>
            </div>
          </div>
        </div>

        {/* Evaluasi Box */}
        <div className='flex flex-col items-start p-3 gap-2 w-full h-[166px] bg-white border border-black/10 rounded-xl overflow-hidden'>
          <h5 className='font-semibold text-base leading-[100%] tracking-[-0.04em] text-[#1D115A]'>
            Evaluasi Guru
          </h5>
          <div className='flex flex-col items-start p-3 gap-[15px] w-full bg-[rgba(0,65,201,0.02)] border border-black/10 rounded-md overflow-y-auto max-h-[110px]'>
            <p className='font-medium text-sm leading-[150%] tracking-[-0.04em] text-[#1D115A]'>
              {teacher.eval}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. Kartu Guru Biasa (Reuse dari Dashboard Home)
const SimpleTeacherCard = ({ teacher }) => (
  <div className='bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4 group'>
    <div className='flex flex-col gap-3'>
      <div className='w-16 h-16 rounded-full bg-pink-100 overflow-hidden mx-auto md:mx-0'>
        <img
          src={teacher.image}
          alt={teacher.name}
          className='w-full h-full object-cover'
        />
      </div>
      <div>
        <h4 className='font-bold text-lg text-slate-800'>{teacher.name}</h4>
        <p className='text-xs text-slate-500 font-medium'>NIP: {teacher.nip}</p>
      </div>
    </div>
    <div className='space-y-3'>
      <div>
        <p className='text-[10px] uppercase font-bold text-slate-400 mb-1'>
          Mapel Diampu
        </p>
        <span className='inline-block px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-xs font-semibold text-slate-600'>
          {teacher.mapel}
        </span>
      </div>
      <div>
        <p className='text-[10px] uppercase font-bold text-slate-400 mb-1'>
          Wali kelas
        </p>
        <span className='inline-block px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-xs font-semibold text-slate-600'>
          {teacher.waliKelas}
        </span>
      </div>
    </div>
  </div>
);

// --- DATA ---
const bestTeachers = [
  {
    name: 'Budi Gunawan',
    nip: '12345678',
    mapel: 'Matematika Wajib XII',
    waliKelas: 'Walikelas XII MIPA 6',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi',
    percentage: 75,
    done: 24,
    total: 32,
    eval: 'Budi Gunawan dianggap kompeten sebagai guru Matematika karena telah meningkatkan tingkat pemahaman siswa di kelas Matematika Wajib XII.',
  },
  {
    name: 'Siti Aminah',
    nip: '87654321',
    mapel: 'Fisika XII',
    waliKelas: 'Walikelas XII MIPA 5',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti',
    percentage: 78,
    done: 25,
    total: 32,
    eval: 'Siti Aminah dianggap kompeten karena metode pengajarannya yang interaktif dan mudah dipahami siswa.',
  },
  {
    name: 'Ahmad Fauzi',
    nip: '11223344',
    mapel: 'Kimia XII',
    waliKelas: 'Walikelas XII MIPA 4',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad',
    percentage: 81,
    done: 26,
    total: 32,
    eval: 'Ahmad Fauzi berhasil meningkatkan minat belajar siswa melalui eksperimen laboratorium yang menarik.',
  },
  {
    name: 'Dewi Lestari',
    nip: '55667788',
    mapel: 'Biologi XII',
    waliKelas: 'Walikelas XII MIPA 3',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dewi',
    percentage: 72,
    done: 23,
    total: 32,
    eval: 'Dewi Lestari menggunakan metode pembelajaran berbasis proyek yang efektif meningkatkan pemahaman siswa.',
  },
  {
    name: 'Hendro Wijaya',
    nip: '99887766',
    mapel: 'Bahasa Indonesia XII',
    waliKelas: 'Walikelas XII IPS 1',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hendro',
    percentage: 84,
    done: 27,
    total: 32,
    eval: 'Hendro Wijaya berhasil meningkatkan kemampuan literasi siswa melalui program membaca intensif.',
  },
  {
    name: 'Rina Susanti',
    nip: '44332211',
    mapel: 'Bahasa Inggris XII',
    waliKelas: 'Walikelas XII IPS 2',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rina',
    percentage: 79,
    done: 25,
    total: 32,
    eval: 'Rina Susanti menggunakan media digital untuk meningkatkan kemampuan speaking siswa dengan baik.',
  },
  {
    name: 'Tono Hartono',
    nip: '66778899',
    mapel: 'Ekonomi XII',
    waliKelas: 'Walikelas XII IPS 3',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tono',
    percentage: 76,
    done: 24,
    total: 32,
    eval: 'Tono Hartono mengajarkan konsep ekonomi dengan studi kasus nyata yang mudah dipahami siswa.',
  },
  {
    name: 'Maya Sari',
    nip: '22334455',
    mapel: 'Geografi XII',
    waliKelas: 'Walikelas XII IPS 4',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
    percentage: 80,
    done: 26,
    total: 32,
    eval: 'Maya Sari menggunakan peta interaktif dan field trip untuk meningkatkan pemahaman geografi siswa.',
  },
  {
    name: 'Bambang Tri',
    nip: '77889900',
    mapel: 'Sejarah XII',
    waliKelas: 'Walikelas XII IPS 5',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bambang',
    percentage: 77,
    done: 25,
    total: 32,
    eval: 'Bambang Tri mengajarkan sejarah dengan pendekatan storytelling yang menarik minat siswa.',
  },
  {
    name: 'Fitri Handayani',
    nip: '33445566',
    mapel: 'Sosiologi XII',
    waliKelas: 'Walikelas XII IPS 6',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fitri',
    percentage: 83,
    done: 27,
    total: 32,
    eval: 'Fitri Handayani menggunakan diskusi kelompok dan analisis kasus sosial untuk meningkatkan pemahaman siswa.',
  },
];

const badTeachers = [
  {
    name: 'Sulistio',
    nip: '12345678',
    mapel: 'IPA XII',
    waliKelas: 'Walikelas XII MIPA 7',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sulistio',
    percentage: 25,
    done: 8,
    total: 32,
    eval: 'Sulistio dianggap kurang kompeten dalam mengajar di mata pelajaran IPA karena sebagian siswa merasa belum paham, nilai siswa terus menurun.',
  },
  {
    name: 'Agus Santoso',
    nip: '98765432',
    mapel: 'Matematika Peminatan XII',
    waliKelas: 'Walikelas XII MIPA 8',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Agus',
    percentage: 28,
    done: 9,
    total: 32,
    eval: 'Agus Santoso perlu meningkatkan metode pengajaran karena banyak siswa kesulitan memahami materi kalkulus.',
  },
  {
    name: 'Linda Wijayanti',
    nip: '11112222',
    mapel: 'Fisika Peminatan XII',
    waliKelas: 'Walikelas XII MIPA 9',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Linda',
    percentage: 22,
    done: 7,
    total: 32,
    eval: 'Linda Wijayanti perlu evaluasi dalam menjelaskan konsep fisika modern, siswa kesulitan mengikuti pembelajaran.',
  },
  {
    name: 'Rudi Hermawan',
    nip: '33334444',
    mapel: 'Kimia Peminatan XII',
    waliKelas: 'Walikelas XII MIPA 10',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rudi',
    percentage: 30,
    done: 10,
    total: 32,
    eval: 'Rudi Hermawan perlu meningkatkan praktikum laboratorium agar siswa lebih memahami reaksi kimia.',
  },
  {
    name: 'Yanti Purnama',
    nip: '55556666',
    mapel: 'Bahasa Jepang XII',
    waliKelas: 'Walikelas XII Bahasa 1',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yanti',
    percentage: 26,
    done: 8,
    total: 32,
    eval: 'Yanti Purnama perlu meningkatkan metode pengajaran kanji dan tata bahasa Jepang yang lebih mudah dipahami.',
  },
  {
    name: 'Hendra Kusuma',
    nip: '77778888',
    mapel: 'Seni Budaya XII',
    waliKelas: 'Walikelas XII Bahasa 2',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hendra',
    percentage: 24,
    done: 8,
    total: 32,
    eval: 'Hendra Kusuma perlu lebih interaktif dalam mengajarkan seni budaya agar siswa lebih antusias.',
  },
  {
    name: 'Diah Rahayu',
    nip: '99990000',
    mapel: 'Prakarya XII',
    waliKelas: 'Walikelas XII MIPA 11',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diah',
    percentage: 27,
    done: 9,
    total: 32,
    eval: 'Diah Rahayu perlu memberikan lebih banyak praktik langsung dalam pembelajaran prakarya.',
  },
  {
    name: 'Wahyu Hidayat',
    nip: '11223355',
    mapel: 'PJOK XII',
    waliKelas: 'Walikelas XII IPS 7',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Wahyu',
    percentage: 29,
    done: 9,
    total: 32,
    eval: 'Wahyu Hidayat perlu meningkatkan variasi latihan fisik agar siswa lebih termotivasi dalam olahraga.',
  },
  {
    name: 'Evi Marlina',
    nip: '44556677',
    mapel: 'PKN XII',
    waliKelas: 'Walikelas XII IPS 8',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Evi',
    percentage: 23,
    done: 7,
    total: 32,
    eval: 'Evi Marlina perlu meningkatkan metode diskusi dan studi kasus dalam pembelajaran PKN.',
  },
  {
    name: 'Joko Susilo',
    nip: '88990011',
    mapel: 'Bahasa Arab XII',
    waliKelas: 'Walikelas XII Bahasa 3',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joko',
    percentage: 21,
    done: 7,
    total: 32,
    eval: 'Joko Susilo perlu meningkatkan metode pengajaran nahwu dan shorof agar lebih mudah dipahami siswa.',
  },
];

const allTeachers = Array(5).fill({
  name: 'Budi Gunawan',
  nip: '12345678',
  mapel: 'Matematika Wajib XII',
  waliKelas: 'Walikelas XII MIPA 6',
  image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi',
});

export default function StatistikGuru() {
  return (
    <DashboardLayout role='waka'>
      <Head>
        <title>Statistik Guru - Pandai</title>
      </Head>

      <div className='flex flex-col gap-8 max-w-[2200px]'>
        <h1 className='text-2xl font-bold text-slate-800'>
          Dashboard WAKA / Statistik Guru
        </h1>

        {/* 1. Guru Terbaik */}
        <div>
          <h2
            className='w-[1076px] h-[29px] font-semibold text-2xl leading-[5px] tracking-[-0.07em] mb-6'
            style={{
              background: 'linear-gradient(180deg, #000000 0%, #0041C9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Guru Terbaik
          </h2>
          <div className='flex flex-wrap gap-[35px] items-start'>
            {bestTeachers.map((t, i) => (
              <PerformanceCard key={i} teacher={t} type='good' />
            ))}
          </div>
        </div>

        {/* 2. Butuh Evaluasi */}
        <div>
          <h2
            className='w-[1076px] h-[29px] font-semibold text-2xl leading-[29px] tracking-[-0.07em] mb-6'
            style={{
              background: 'linear-gradient(180deg, #000000 0%, #0041C9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Butuh Evaluasi
          </h2>
          <div className='flex flex-wrap gap-[35px] items-start'>
            {badTeachers.map((t, i) => (
              <PerformanceCard key={i} teacher={t} type='bad' />
            ))}
          </div>
        </div>

        {/* 3. Daftar Guru */}
        <div>
          <h2 className='text-lg font-bold text-indigo-900 mb-4'>
            Daftar Guru
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
            {allTeachers.map((t, i) => (
              <SimpleTeacherCard key={i} teacher={t} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
