import Head from 'next/head';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Clipboard, Calendar, Clock, ChevronRight } from 'lucide-react';

const kegiatanData = [
    {
        id: 1,
        title: 'Ujian Tengah Semester',
        subject: 'Matematika Wajib',
        date: '24 Maret 2024',
        time: '08:00 - 10:00',
        status: 'Upcoming',
    },
    {
        id: 2,
        title: 'Praktikum Listrik Dinamis',
        subject: 'Fisika',
        date: '26 Maret 2024',
        time: '13:00 - 15:00',
        status: 'Draft',
    },
    {
        id: 3,
        title: 'Quiz Aljabar Linear',
        subject: 'Matematika Minat',
        date: '20 Maret 2024',
        time: '09:00 - 10:00',
        status: 'Completed',
    },
];

export default function KegiatanGuru() {
    return (
        <DashboardLayout role='guru'>
            <Head>
                <title>Kegiatan Guru - Pandai</title>
            </Head>

            <div className='flex flex-col gap-8 max-w-[1200px] mx-auto font-sans'>
                <div className='flex justify-between items-center'>
                    <h1 className='text-[28px] font-bold text-[#1F2937]'>Daftar Kegiatan</h1>
                    <button className='bg-[#0041C9] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-[#003199] transition-all shadow-lg shadow-blue-200'>
                        + Tambah Kegiatan
                    </button>
                </div>

                <div className='grid grid-cols-1 gap-4'>
                    {kegiatanData.map((k) => (
                        <div
                            key={k.id}
                            className='bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all cursor-pointer group'
                        >
                            <div className='flex items-center gap-6'>
                                <div className='w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-[#0041C9] group-hover:scale-110 transition-transform'>
                                    <Clipboard size={28} />
                                </div>
                                <div>
                                    <h3 className='text-lg font-bold text-slate-800 mb-1 group-hover:text-[#0041C9] transition-colors'>
                                        {k.title}
                                    </h3>
                                    <div className='flex items-center gap-4 text-sm text-slate-500'>
                                        <span className='font-semibold text-[#0041C9] bg-blue-50 px-2 py-0.5 rounded'>
                                            {k.subject}
                                        </span>
                                        <div className='flex items-center gap-1.5'>
                                            <Calendar size={14} />
                                            {k.date}
                                        </div>
                                        <div className='flex items-center gap-1.5'>
                                            <Clock size={14} />
                                            {k.time}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='flex items-center gap-6'>
                                <span
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold ${k.status === 'Upcoming'
                                            ? 'bg-blue-50 text-blue-600'
                                            : k.status === 'Completed'
                                                ? 'bg-green-50 text-green-600'
                                                : 'bg-gray-100 text-gray-500'
                                        }`}
                                >
                                    {k.status}
                                </span>
                                <ChevronRight className='text-slate-300 group-hover:text-[#0041C9] transition-colors' size={24} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
