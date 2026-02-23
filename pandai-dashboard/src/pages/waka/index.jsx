import Head from 'next/head';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Users, Calendar, MoreHorizontal } from 'lucide-react'; // Menggunakan Lucide (Shadcn standard)

// --- MOCK DATA ---
const stats = [
  { label: 'Total Guru', value: '45', icon: Users },
  { label: 'Total Kelas', value: '120', icon: Calendar },
];

const teachers = [
  // Saya duplikasi data agar terlihat banyak seperti di desain (Grid)
  ...Array(7).fill({
    name: 'Budi Gunawan',
    nip: '12345678',
    mapel: 'Matematika Wajib XII',
    kelas: 'IPA XII',
    waliKelas: 'Walikelas XII MIPA 6',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi', // Placeholder
    bgGradient: false,
  }),
];

// --- REUSABLE COMPONENTS (Mini Shadcn-like Components) ---

// 1. Component Card Sederhana
const StatCard = ({ label, value, icon: Icon }) => (
  <div className='bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between'>
    <div>
      <h3 className='text-slate-500 font-medium text-lg mb-2'>{label}</h3>
      <p className='text-4xl font-bold text-slate-800'>{value}</p>
    </div>
    <div className='w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-800'>
      <Icon size={32} strokeWidth={2} />
    </div>
  </div>
);

// 2. Component Teacher Card (Kartu Guru) - Premium Gradient Design
const TeacherCard = ({ teacher }) => (
  <div
    className='flex flex-col items-start p-6 gap-[21px] w-[200px] h-[334px] rounded-[24px] border border-black/20'
    style={{
      background: 'linear-gradient(180deg, #FFFFFF 50%, #E9F2FB 100%)'
    }}
  >
    {/* Profile & Name Section */}
    <div className='flex flex-col items-start gap-[18px] w-[152px]'>
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
          className='w-full h-6 font-semibold text-2xl leading-[100%] text-center tracking-[-0.06em]'
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

    {/* Mapel Diampu Section */}
    <div className='flex flex-col items-start gap-[7px] w-[152px]'>
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
        <span className='flex items-center justify-center px-2 py-[1px] bg-black/[0.02] border border-black/10 rounded-full text-xs font-medium leading-[15px] tracking-[-0.02em] text-[#37364E]'>
          {teacher.kelas}
        </span>
      </div>
    </div>

    {/* Wali Kelas Section */}
    <div className='flex flex-col items-start gap-[7px] w-[152px]'>
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
);

// --- MAIN PAGE ---

export default function DashboardWaka() {
  return (
    <DashboardLayout role='waka'>
      <Head>
        <title>Dashboard Waka - Pandai</title>
      </Head>

      <div className='flex flex-col gap-8 max-w-[1400px]'>
        {/* Header Title */}
        <h1 className='text-2xl font-bold text-slate-800'>Dashboard WAKA</h1>

        {/* 1. Stats Section */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {stats.map((stat, idx) => (
            <StatCard key={idx} {...stat} />
          ))}
        </div>

        {/* 2. Daftar Guru Section */}
        <div>
          <h2 className="w-[1076px] h-[29px] font-medium text-[24px] leading-[29px] tracking-[-0.07em] text-black flex-none order-0 self-stretch grow-0 mb-6">
            Daftar Sekilas Guru
          </h2>

          {/* Grid Layout untuk Kartu Guru */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
            {teachers.map((t, i) => (
              <TeacherCard key={i} teacher={t} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
