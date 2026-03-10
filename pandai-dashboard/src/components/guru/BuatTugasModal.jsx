import React, { useState } from 'react';
import {
    X,
    Plus,
    Bold,
    Italic,
    List,
    Link as LinkIcon,
    Calendar,
    Clock,
    Sparkles,
    Search,
    Check,
    ClipboardList,
    Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

const BuatTugasModal = ({ isOpen, onClose }) => {
    const [selectedDifficulty, setSelectedDifficulty] = useState('Semua');

    if (!isOpen) return null;

    const questions = [
        {
            id: 1,
            difficulty: 'SEDANG',
            topic: 'ALJABAR',
            text: 'Tentukan himpunan penyelesaian dari persamaan kuadrat x² - 5x + 6 = 0.',
            options: ['{ 2, 3 }', '{ -2, -3 }', '{ 1, 6 }', '{ -1, -6 }'],
            status: 'available'
        },
        {
            id: 2,
            difficulty: 'MUDAH',
            topic: 'FUNGSI',
            text: 'Jika f(x) = 2x + 3, maka nilai dari f(5) adalah...',
            options: ['10', '13', '15', '8'],
            status: 'selected'
        }
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-[1200px] h-[90vh] rounded-[16px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] border border-[#3713EC]/10 flex flex-col overflow-hidden relative">

                {/* Header */}
                <div className="px-6 py-4 border-b border-[#F1F5F9] flex items-center justify-between bg-white shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#3713EC]/10 rounded-lg flex items-center justify-center text-[#3713EC]">
                            <ClipboardList size={18} />
                        </div>
                        <h1 className="text-[20px] font-bold text-[#1E293B] tracking-tight">Buat Tugas Matematika Wajib</h1>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>

                {/* Body Content */}
                <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">

                    {/* Left Column: Detail Tugas */}
                    <div className="w-full lg:w-[460px] border-b lg:border-b-0 lg:border-r border-[#F1F5F9] p-6 lg:p-8 overflow-y-auto bg-white flex flex-col gap-8">
                        <div className="flex flex-col gap-6">
                            <h2 className="text-[14px] font-semibold text-[#64748B] tracking-[0.7px] uppercase font-sans">Detail Tugas</h2>

                            {/* Judul Tugas */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] font-medium text-[#1E293B] font-sans">Judul Tugas</label>
                                <input
                                    type="text"
                                    placeholder="Contoh: Latihan Persamaan Kuadrat & Fungsi"
                                    className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg px-4 py-3 text-[14px] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3713EC]/10 focus:border-[#3713EC]/30 transition-all font-sans"
                                />
                            </div>

                            {/* Instruksi */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] font-medium text-[#1E293B] font-sans">Instruksi / Deskripsi</label>
                                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg overflow-hidden flex flex-col">
                                    {/* Toolbar */}
                                    <div className="px-3 py-2 border-b border-[#E2E8F0] bg-white flex items-center gap-2 overflow-x-auto">
                                        <button className="p-1.5 hover:bg-slate-100 rounded text-[#1E293B] shrink-0"><Bold size={16} /></button>
                                        <button className="p-1.5 hover:bg-slate-100 rounded text-[#1E293B] shrink-0"><Italic size={16} /></button>
                                        <button className="p-1.5 hover:bg-slate-100 rounded text-[#1E293B] shrink-0"><List size={16} /></button>
                                        <button className="p-1.5 hover:bg-slate-100 rounded text-[#1E293B] shrink-0"><LinkIcon size={16} /></button>
                                    </div>
                                    <textarea
                                        placeholder="Berikan instruksi pengerjaan tugas di sini..."
                                        className="w-full h-32 bg-transparent p-4 text-[14px] placeholder-[#94A3B8] focus:outline-none resize-none font-sans"
                                    />
                                </div>
                            </div>

                            {/* Deadline & Waktu */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <label className="text-[14px] font-medium text-[#1E293B] font-sans">Tenggat Waktu</label>
                                    <div className="relative">
                                        <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                                        <input
                                            type="text"
                                            placeholder="mm/dd/yyyy"
                                            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg pl-10 pr-4 py-2.5 text-[14px] font-sans"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-[14px] font-medium text-[#1E293B] font-sans">Waktu</label>
                                    <div className="relative">
                                        <Clock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
                                        <input
                                            type="text"
                                            placeholder="--:-- --"
                                            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg pl-10 pr-4 py-2.5 text-[14px] font-sans"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Pilih Kelas */}
                            <div className="flex flex-col gap-2">
                                <label className="text-[14px] font-medium text-[#1E293B] font-sans">Pilih Kelas</label>
                                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3 flex flex-wrap gap-2 items-center">
                                    <span className="bg-[#3713EC]/10 text-[#3713EC] px-3 py-1 rounded-full text-[12px] font-bold flex items-center gap-2">
                                        X-MIPA 1 <X size={14} className="cursor-pointer" />
                                    </span>
                                    <span className="bg-[#3713EC]/10 text-[#3713EC] px-3 py-1 rounded-full text-[12px] font-bold flex items-center gap-2">
                                        X-MIPA 2 <X size={14} className="cursor-pointer" />
                                    </span>
                                    <button className="text-[#3713EC] text-[12px] font-bold hover:underline px-2">+ Tambah Kelas</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Bank Soal & AI */}
                    <div className="flex-1 bg-[#F8FAFC]/50 p-6 lg:p-8 overflow-y-auto flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-[14px] font-semibold text-[#64748B] tracking-[0.7px] uppercase font-sans">Bank Soal & Generator AI</h2>
                            <div className="bg-[#3713EC] text-white px-3 py-1 rounded-lg text-[12px] font-bold flex items-center gap-2 shadow-sm shadow-[#3713EC]/20">
                                <ClipboardList size={14} /> 2 Soal Terpilih
                            </div>
                        </div>

                        {/* AI Generator Box */}
                        <div className="bg-gradient-to-br from-[#3713EC] to-[#4338CA] rounded-[16px] p-6 text-white shadow-xl shadow-[#3713EC]/20 relative overflow-hidden group">
                            <div className="relative z-10 flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <Sparkles size={24} className="text-white" />
                                    <div>
                                        <h3 className="text-[18px] font-bold leading-tight">Generate Soal AI</h3>
                                        <p className="text-[12px] text-white/80 font-medium">Buat soal otomatis berdasarkan materi atau topik tertentu.</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center gap-2">
                                    <input
                                        type="text"
                                        placeholder="Ketik topik matematika (misal: Trigonometri)..."
                                        className="w-full flex-1 bg-white/20 border border-white/10 rounded-lg px-4 py-3 text-[14px] placeholder-white/60 focus:outline-none focus:bg-white/30 transition-all font-sans"
                                    />
                                    <button className="w-full sm:w-auto bg-white text-[#3713EC] px-6 py-3 rounded-lg font-bold text-[14px] shadow-lg shadow-black/10 hover:bg-slate-50 transition-all active:scale-95 shrink-0">
                                        Buat Soal
                                    </button>
                                </div>
                            </div>
                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-white/20 transition-all"></div>
                        </div>

                        {/* Search & Filter */}
                        <div className="flex flex-col gap-4">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
                                <input
                                    type="text"
                                    placeholder="Cari soal matematika..."
                                    className="w-full bg-white border border-[#E2E8F0] rounded-xl pl-12 pr-4 py-3 text-[14px] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3713EC]/10 transition-all font-sans shadow-sm"
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                <span className="text-[12px] font-semibold text-[#64748B] font-sans">Tingkat:</span>
                                <div className="flex flex-wrap items-center gap-2">
                                    {['Semua', 'Mudah', 'Sedang', 'Sulit'].map((diff) => (
                                        <button
                                            key={diff}
                                            onClick={() => setSelectedDifficulty(diff)}
                                            className={cn(
                                                "px-4 py-1.5 rounded-full text-[12px] font-bold transition-all border",
                                                selectedDifficulty === diff
                                                    ? "bg-white border-[#E2E8F0] text-[#1E293B] shadow-sm"
                                                    : "bg-transparent border-transparent text-[#64748B] hover:text-[#1E293B]"
                                            )}
                                        >
                                            {diff}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Question List */}
                        <div className="flex flex-col gap-4">
                            {questions.map((q) => (
                                <div key={q.id} className={cn(
                                    "bg-white rounded-[16px] border p-6 flex flex-col gap-4 transition-all relative group shadow-sm",
                                    q.status === 'selected' ? "border-[#3713EC]" : "border-[#E2E8F0]"
                                )}>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase",
                                                q.difficulty === 'SEDANG' ? "bg-[#FEF9C3] text-[#CA8A04]" : "bg-[#DCFCE7] text-[#16A34A]"
                                            )}>
                                                {q.difficulty}
                                            </span>
                                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] font-black tracking-wider uppercase">
                                                {q.topic}
                                            </span>
                                        </div>
                                        <button className={cn(
                                            "flex items-center justify-center gap-2 px-4 py-1.5 rounded-full text-[12px] font-bold transition-all active:scale-95 w-full sm:w-auto",
                                            q.status === 'selected'
                                                ? "bg-[#3713EC] text-white"
                                                : "bg-white border border-[#E2E8F0] text-[#3713EC] hover:bg-[#3713EC]/5"
                                        )}>
                                            {q.status === 'selected' ? <><Check size={14} /> Terpilih</> : <><Plus size={14} /> Tambah</>}
                                        </button>
                                    </div>
                                    <p className="text-[14px] font-medium text-[#1E293B] leading-relaxed font-sans">{q.text}</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {q.options.map((opt, i) => (
                                            <div key={i} className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-lg px-4 py-2 hover:bg-white hover:border-[#E2E8F0] transition-all cursor-pointer group/opt">
                                                <div className="w-6 h-6 rounded-full border border-slate-200 bg-white flex items-center justify-center text-[11px] font-bold text-slate-500 group-hover/opt:border-[#3713EC] group-hover/opt:text-[#3713EC]">
                                                    {String.fromCharCode(65 + i)}
                                                </div>
                                                <span className="text-[12px] text-slate-600 font-medium">{opt}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-5 border-t border-[#F1F5F9] flex flex-col sm:flex-row items-center justify-between bg-white shrink-0 gap-4">
                    <div className="flex items-center gap-2 text-slate-400">
                        <Info size={14} />
                        <p className="text-[12px] font-medium">Draft disimpan otomatis pada 14:30 WIB</p>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button onClick={onClose} className="flex-1 sm:flex-none px-6 py-2.5 text-[14px] md:text-[16px] font-semibold text-[#475569] hover:bg-slate-50 rounded-lg transition-colors">
                            Batal
                        </button>
                        <button className="flex-[2] sm:flex-none bg-[#3713EC] hover:bg-[#2d0fb8] text-white px-4 md:px-8 py-2.5 rounded-lg font-bold text-[14px] md:text-[16px] shadow-lg shadow-[#3713EC]/20 transition-all active:scale-[0.98]">
                            Simpan & Publikasikan
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuatTugasModal;
