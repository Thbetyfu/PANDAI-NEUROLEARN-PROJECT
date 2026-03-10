import { useState } from 'react';
import Head from 'next/head';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
    Plus,
    ChevronLeft,
    ChevronRight,
    Calculator,
    BookOpen,
    Calendar as CalendarIcon,
    Clock,
    Bell,
    ArrowRight,
    ClipboardList,
    Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

// --- DUMMY DATA ---
const scheduleDays = [
    { name: 'SENIN', date: '24' },
    { name: 'SELASA', date: '25' },
    { name: 'RABU', date: '26' },
    { name: 'KAMIS', date: '27' },
    { name: 'JUMAT', date: '28' },
];

const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00'];

const scheduleItems = [
    // SENIN (Index 0)
    { day: 0, timeIndex: 0, title: 'Matematika Wajib', class: 'XII-IPA 5', color: 'bg-indigo-600 text-white', span: 1 },
    { day: 0, timeIndex: 1, title: 'Rapat Kuri...', class: 'Aula', color: 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-200', span: 1 },
    { day: 0, timeIndex: 3, title: 'Matematika Wajib', class: 'XII-IPA 1', color: 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-200', span: 1 },

    // SELASA (Index 1)
    { day: 1, timeIndex: 0, title: 'Fisika', class: 'XI-IPA 5', color: 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-200', span: 1 },
    { day: 1, timeIndex: 2, title: 'Fisika', class: 'XI-IPA 1', color: 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-200', span: 1 },

    // RABU (Index 2)
    { day: 2, timeIndex: 0, title: 'Matematika Minat', class: 'XI-IPA 5', color: 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-200', span: 1 },
    { day: 2, timeIndex: 1, title: 'Matematika Minat', class: 'XI-IPA 1', color: 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-200', span: 1 },
    { day: 2, timeIndex: 3, title: 'Matematika Minat', class: 'XI-IPA 1', color: 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-200', span: 1 },

    // KAMIS (Index 3)
    { day: 3, timeIndex: 1, title: 'Fisika', class: 'XI-IPA 5', color: 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-200', span: 1 },
    { day: 3, timeIndex: 2, title: 'Matematika Wajib', class: 'XII-IPA 1', color: 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-200', span: 1 },

    // JUMAT (Index 4)
    { day: 4, timeIndex: 0, title: 'Matematika Wajib', class: 'XII-IPA 5', color: 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-200', span: 1 },
    { day: 4, timeIndex: 2, title: 'Fisika', class: 'XII-IPA 1', color: 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-200', span: 1 },
];

const subjects = [
    { id: 1, name: 'Matematika Wajib', icon: Calculator, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { id: 2, name: 'Fisika', icon: BookOpen, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 3, name: 'Matematika Minat', icon: Calculator, color: 'text-indigo-600', bg: 'bg-indigo-50' },
];

const tasksToGrade = [
    { id: 1, title: 'Matematika Wajib Pos Tes...', date: '16 November 2022' },
    { id: 2, title: 'Matematika Wajib Pos Tes...', date: '16 November 2022' },
    { id: 3, title: 'Matematika Wajib Pos Tes...', date: '16 November 2022' },
];

const activeTasks = [
    { id: 1, title: 'Kuis Logaritma Lanjutan', progress: 85 },
    { id: 2, title: 'Tugas Diferensial Trigonometri', progress: 42 },
];

export default function KegiatanGuru() {
    return (
        <DashboardLayout role="guru">
            <Head>
                <title>Kegiatan Guru - Pandai</title>
            </Head>

            <div className="flex flex-col gap-8 max-w-[1400px] mx-auto font-sans">
                {/* Page Title */}
                <h1 className="text-[28px] font-bold text-[#1F2937]">Dashboard Guru / Kegiatan</h1>

                <div className="grid grid-cols-12 gap-8">

                    {/* LEFT COLUMN */}
                    <div className="col-span-12 lg:col-span-9 flex flex-col gap-8">

                        {/* 1. Weekly Schedule Card */}
                        <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                                            <CalendarIcon size={18} />
                                        </div>
                                        <h2 className="text-xl font-bold text-slate-800">Jadwal Kegiatan Mingguan</h2>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex bg-slate-50 rounded-full p-1 border border-slate-100">
                                            <button className="p-1 hover:bg-white hover:shadow-sm rounded-full transition-all text-slate-400 hover:text-slate-700">
                                                <ChevronLeft size={18} />
                                            </button>
                                            <button className="p-1 hover:bg-white hover:shadow-sm rounded-full transition-all text-slate-400 hover:text-slate-700">
                                                <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Schedule Grid */}
                                <div className="overflow-x-auto">
                                    <div className="min-w-[800px]">
                                        <div className="grid grid-cols-6 border-b border-gray-50 pb-4 mb-4">
                                            <div className="text-center text-xs font-bold text-slate-400 py-2">WAKTU</div>
                                            {scheduleDays.map((day, idx) => (
                                                <div key={idx} className="text-center group">
                                                    <div className="text-[10px] font-bold text-indigo-600 mb-1">{day.name}</div>
                                                    <div className="text-xl font-black text-slate-800 tracking-tighter">{day.date}</div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="relative">
                                            {timeSlots.map((time, tIdx) => (
                                                <div key={tIdx} className="grid grid-cols-6 h-[80px] border-b border-gray-50/50 last:border-0 relative">
                                                    <div className="text-[11px] font-bold text-slate-400 pt-1 text-center border-r border-gray-50/50">
                                                        {time}
                                                    </div>

                                                    {/* Inner grid for schedule blocks */}
                                                    {[0, 1, 2, 3, 4].map((dIdx) => {
                                                        const item = scheduleItems.find(i => i.day === dIdx && i.timeIndex === tIdx);
                                                        if (item) {
                                                            return (
                                                                <div key={`${dIdx}-${tIdx}`} className="p-1 relative z-10">
                                                                    <div className={cn(
                                                                        "h-full w-full rounded-xl p-3 flex flex-col justify-between shadow-sm transition-all hover:scale-[1.02] cursor-pointer",
                                                                        item.color
                                                                    )}>
                                                                        <div className="flex flex-col">
                                                                            <span className="text-[11px] font-bold line-clamp-1">{item.title}</span>
                                                                            <span className="text-[9px] opacity-80 font-medium">{item.class}</span>
                                                                        </div>
                                                                        {tIdx === 0 && dIdx === 0 && (
                                                                            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                        return <div key={`${dIdx}-${tIdx}`} className="p-1 border-r border-gray-50/50 last:border-0 group hover:bg-slate-50/50 transition-colors"></div>;
                                                    })}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Smart Reminder Banner */}
                        <div className="bg-gradient-to-r from-orange-50 to-orange-100/50 border border-orange-200/50 rounded-[20px] p-6 flex items-center justify-between shadow-sm shadow-orange-100/20">
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 bg-orange-400 rounded-[18px] flex items-center justify-center text-white shadow-lg shadow-orange-200">
                                    <Clock size={28} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-orange-800 mb-1 leading-none">Smart Reminder</h4>
                                    <p className="text-orange-700/80 text-sm max-w-xl leading-snug">
                                        Pemeriksaan Tugas <span className="font-bold">"Trigonometri Dasar"</span> akan berakhir dalam 2 jam. 12 siswa belum dinilai.
                                    </p>
                                </div>
                            </div>
                            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-2xl font-bold text-sm transition-all shadow-md shadow-orange-200 active:scale-95">
                                Periksa Sekarang
                            </button>
                        </div>

                        {/* 3. Pusat Tugas & Asesmen */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <ClipboardList className="text-indigo-600" size={24} />
                                <h2 className="text-xl font-bold text-slate-800">Pusat Tugas & Asesmen</h2>
                            </div>

                            <button className="w-full bg-[#3D25FF] hover:bg-[#321EE0] text-white py-5 rounded-[20px] flex items-center justify-center gap-3 font-bold text-lg shadow-xl shadow-indigo-100 transition-all active:scale-[0.99] mb-6">
                                <div className="w-8 h-8 rounded-full border-2 border-white/30 flex items-center justify-center">
                                    <Plus size={20} strokeWidth={3} />
                                </div>
                                Buat Tugas Baru
                            </button>

                            <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-[11px] font-black text-slate-400 tracking-widest uppercase">Tugas Aktif</span>
                                    <button className="text-indigo-600 text-xs font-bold hover:underline">Lihat Semua</button>
                                </div>

                                <div className="flex flex-col gap-6">
                                    {activeTasks.map((task) => (
                                        <div key={task.id} className="flex flex-col gap-2">
                                            <div className="flex justify-between items-end">
                                                <h5 className="font-bold text-slate-800 text-[15px]">{task.title}</h5>
                                                <span className="text-indigo-600 font-black text-sm">{task.progress}%</span>
                                            </div>
                                            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-1000"
                                                    style={{ width: `${task.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 4. Beban Kerja Siswa (Avg) */}
                            <div className="bg-white rounded-[12px] border border-[#E2E8F0] shadow-sm p-6 mt-8 flex flex-col gap-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-[15px] font-bold text-slate-800 font-sans">Beban Kerja Siswa (Avg)</h2>
                                        <p className="text-[11px] text-slate-400 mt-1 font-sans">Total tugas dari semua Mapel minggu ini</p>
                                    </div>
                                    <Info size={18} className="text-slate-400 cursor-pointer" />
                                </div>

                                <div className="flex justify-between items-center px-10 py-6">
                                    {['Sen', 'Sel', 'Rab', 'Kam', 'Jum'].map((day) => (
                                        <span key={day} className={cn(
                                            "text-[12px] font-bold uppercase font-sans tracking-wider",
                                            day === 'Rab' ? "text-[#EF4444]" : "text-slate-400"
                                        )}>
                                            {day}
                                        </span>
                                    ))}
                                </div>

                                <div className="bg-[#FEF2F2] rounded-lg p-4">
                                    <p className="text-[11px] text-[#DC2626] leading-snug font-sans">
                                        <span className="font-bold mr-1 uppercase">Saran:</span>
                                        Hari Rabu memiliki beban kerja tinggi (9 tugas deadline). Hindari membuat tugas baru dengan tenggat hari tersebut.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="col-span-12 lg:col-span-3 flex flex-col gap-8">

                        {/* 1. Mata Pelajaran Diampu */}
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Mata Pelajaran Diampu</h3>
                            <div className="flex flex-col gap-4">
                                {subjects.map((s) => (
                                    <div key={s.id} className="bg-white rounded-[24px] p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col items-center gap-4">
                                        <div className={cn("w-16 h-16 rounded-[22px] flex items-center justify-center transition-transform group-hover:scale-110", s.bg, s.color)}>
                                            <s.icon size={32} />
                                        </div>
                                        <span className="font-bold text-slate-800 text-center text-sm px-2">{s.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 2. Tugas Perlu Dikoreksi */}
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Tugas Perlu Dikoreksi</h3>
                            <div className="flex flex-col gap-3">
                                {tasksToGrade.map((task) => (
                                    <div key={task.id} className="bg-white p-4 rounded-[20px] border border-gray-100 shadow-sm flex items-center justify-between group cursor-pointer hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                                <BookOpen size={18} />
                                            </div>
                                            <div className="flex flex-col">
                                                <h5 className="text-[13px] font-bold text-indigo-900 group-hover:text-indigo-700 leading-tight">
                                                    {task.title}
                                                </h5>
                                                <p className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md mt-1 w-fit">
                                                    {task.date}
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </DashboardLayout>
    );
}
