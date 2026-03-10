import { useState } from 'react';
import Head from 'next/head';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  ChevronRight,
  Calculator,
  BookOpen,
  Search,
  Filter,
  Users,
  CheckCircle,
  Brain,
  MoreVertical,
  Eye,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// --- DUMMY DATA ---
const studentsList = [
  { id: 1, name: 'Fanan Agfian Mozart', nis: '2109845', score: 88.5, status: 'SANGAT BAIK', statusColor: 'text-[#15803D] bg-[#F0FDF4]', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fanan' },
  { id: 2, name: 'Aris Setiawan', nis: '2109846', score: 76.2, status: 'PERLU BIMBINGAN', statusColor: 'text-[#A16207] bg-[#FEFCE8]', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aris' },
  { id: 3, name: 'Citra Lestari', nis: '2109847', score: 92.0, status: 'SANGAT BAIK', statusColor: 'text-[#15803D] bg-[#F0FDF4]', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Citra' },
  { id: 4, name: 'Deni Pratama', nis: '2109848', score: 81.4, status: 'STABIL', statusColor: 'text-[#1D4ED8] bg-[#EFF6FF]', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Deni' },
  // Repeated to match mockup
  { id: 5, name: 'Deni Pratama', nis: '2109848', score: 81.4, status: 'STABIL', statusColor: 'text-[#1D4ED8] bg-[#EFF6FF]', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Deni2' },
  { id: 6, name: 'Deni Pratama', nis: '2109848', score: 81.4, status: 'STABIL', statusColor: 'text-[#1D4ED8] bg-[#EFF6FF]', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Deni3' },
  { id: 7, name: 'Deni Pratama', nis: '2109848', score: 81.4, status: 'STABIL', statusColor: 'text-[#1D4ED8] bg-[#EFF6FF]', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Deni4' },
  { id: 8, name: 'Deni Pratama', nis: '2109848', score: 81.4, status: 'STABIL', statusColor: 'text-[#1D4ED8] bg-[#EFF6FF]', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Deni5' },
  { id: 9, name: 'Deni Pratama', nis: '2109848', score: 81.4, status: 'STABIL', statusColor: 'text-[#1D4ED8] bg-[#EFF6FF]', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Deni6' },
  { id: 10, name: 'Deni Pratama', nis: '2109848', score: 81.4, status: 'STABIL', statusColor: 'text-[#1D4ED8] bg-[#EFF6FF]', img: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Deni7' },
];

const classes = ['XII MIPA 6', 'XII MIPA 5', 'XII MIPA 4', 'XII MIPA 3', 'XI MIPA 1'];

const tasksData = [
  { id: 1, title: 'Matematika Wajib Pos Test', date: '16 November 2022' },
  { id: 2, title: 'Matematika Wajib Pos Test', date: '16 November 2022' },
  { id: 3, title: 'Matematika Wajib Pos Test', date: '16 November 2022' },
];

// --- COMPONENTS ---

const StatCard = ({ icon: Icon, label, value, unit, trend, iconBg, iconColor }) => (
  <div className="bg-white rounded-[16px] border border-[#E2E8F0] shadow-sm p-5 flex items-center justify-between flex-1">
    <div className="flex items-center gap-4">
      <div className={cn("w-12 h-12 rounded-[12px] flex items-center justify-center", iconBg, iconColor)}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-[12px] font-bold text-[#94A3B8] tracking-[0.6px] uppercase">{label}</p>
        <div className="flex items-baseline gap-1 mt-0.5">
          <span className="text-[24px] font-bold text-[#0F172A]">{value}</span>
          {unit && <span className="text-[14px] text-[#94A3B8] ml-1">{unit}</span>}
          {trend && <span className="text-[14px] font-medium text-[#22C55E] ml-2">{trend}</span>}
        </div>
      </div>
    </div>
  </div>
);

export default function DaftarSiswaGuru() {
  const [selectedClass, setSelectedClass] = useState('XII MIPA 6');

  return (
    <DashboardLayout role='guru'>
      <Head>
        <title>Daftar Siswa - Pandai</title>
      </Head>

      <div className="min-h-screen bg-[#F8F8F8] -m-8 p-8">
        {/* Breadcrumb Header */}
        <h1 className="text-[24px] font-medium text-slate-900 tracking-[-0.07em] mb-8 font-sans">
          Dashboard Guru / Daftar Siswa
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* MAIN CONTENT AREA (Left) */}
          <div className="lg:col-span-8 space-y-8">

            {/* Class Selector Pills */}
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <span className="text-[14px] font-bold text-[#94A3B8] tracking-[1.4px] uppercase font-sans">PILIH KELAS:</span>
              <div className="flex flex-wrap gap-3">
                {classes.map((cls) => (
                  <button
                    key={cls}
                    onClick={() => setSelectedClass(cls)}
                    className={cn(
                      "px-5 py-2 rounded-full text-[14px] font-semibold transition-all duration-200",
                      selectedClass === cls
                        ? "bg-[#0052CC] text-white shadow-lg shadow-blue-200"
                        : "bg-white text-[#475569] border border-[#E2E8F0] hover:bg-slate-50"
                    )}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary Stat Cards */}
            <div className="flex flex-col md:flex-row gap-4">
              <StatCard icon={Users} label="TOTAL SISWA" value="36" unit="Siswa" iconBg="bg-[#EFF6FF]" iconColor="text-[#0052CC]" />
              <StatCard icon={CheckCircle} label="KEHADIRAN HARI INI" value="98%" trend="↑ 2%" iconBg="bg-[#F0FDF4]" iconColor="text-[#16A34A]" />
              <StatCard icon={Brain} label="SKOR KOGNITIF" value="82.4" unit="Avg" iconBg="bg-[#FFF7ED]" iconColor="text-[#EA580C]" />
            </div>

            {/* Main Table Card */}
            <div className="bg-white rounded-[16px] border border-[#E2E8F0] shadow-sm overflow-hidden">
              {/* Table Toolbar */}
              <div className="p-5 border-b border-[#F1F5F9] flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
                  <input
                    type="text"
                    placeholder="Cari nama siswa..."
                    className="w-full bg-[#F8FAFC] border-none rounded-[12px] py-3 pl-12 pr-4 text-[14px] selection:bg-blue-100 focus:ring-1 focus:ring-blue-100 placeholder-[#6B7280] font-sans"
                  />
                </div>
                <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] text-[14px] font-bold text-[#334155] hover:bg-slate-50 transition-colors w-full md:w-auto">
                  <Filter size={16} /> Urutkan
                </button>
              </div>

              {/* The Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F8FAFC]/50 border-b border-[#F1F5F9]">
                    <tr className="text-[#64748B] text-[12px] font-bold tracking-[0.6px] uppercase font-sans">
                      <th className="px-6 py-4 text-left">NAMA</th>
                      <th className="px-6 py-4 text-center">NILAI</th>
                      <th className="px-6 py-4 text-center">STATUS FOKUS</th>
                      <th className="px-6 py-4 text-right">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F5F9]">
                    {studentsList.map(student => (
                      <tr key={student.id} className="hover:bg-slate-50/80 transition-colors group">
                        {/* Student Info */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={student.img} alt={student.name} className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200" />
                            <div>
                              <div className="text-[14px] font-bold text-[#0F172A] font-sans">{student.name}</div>
                              <div className="text-[10px] text-[#64748B] font-sans uppercase">NIS: {student.nis}</div>
                            </div>
                          </div>
                        </td>
                        {/* Score with Progress Bar */}
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-3 min-w-[120px]">
                            <span className="text-[14px] font-bold text-[#334155] font-sans">{student.score}</span>
                            <div className="w-20 h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#0052CC] rounded-full"
                                style={{ width: `${student.score}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        {/* Status Badge */}
                        <td className="px-6 py-4 text-center">
                          <span className={cn(
                            "inline-block px-3 py-1 rounded-[8px] text-[11px] font-bold uppercase tracking-tight font-sans",
                            student.statusColor
                          )}>
                            {student.status}
                          </span>
                        </td>
                        {/* Actions */}
                        <td className="px-6 py-4 text-right text-[#94A3B8]">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 hover:bg-white hover:text-blue-600 hover:shadow-sm rounded-lg transition-all">
                              <Eye size={18} />
                            </button>
                            <button className="p-2 hover:bg-white hover:text-slate-600 hover:shadow-sm rounded-lg transition-all">
                              <MoreVertical size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN (Sidebar Widgets) */}
          <div className="lg:col-span-4 space-y-8">
            {/* Widget 1: Mata Pelajaran */}
            <div>
              <h3 className="text-[24px] font-medium text-slate-900 tracking-[-0.07em] mb-4 font-sans">
                Mata Pelajaran Diampu
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-[10px] p-6 flex flex-col items-center justify-center gap-4 border border-black/10 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                  <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                    <Calculator size={32} />
                  </div>
                  <span className="text-[16px] font-medium text-slate-800 text-center leading-tight">
                    Matematika Wajib
                  </span>
                </div>
                <div className="bg-white rounded-[10px] p-6 flex flex-col items-center justify-center gap-4 border border-black/10 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                  <div className="w-16 h-16 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                    <BookOpen size={32} />
                  </div>
                  <span className="text-[16px] font-medium text-slate-800 text-center leading-tight">
                    Fisika
                  </span>
                </div>
                <div className="bg-white rounded-[10px] p-6 flex flex-col items-center justify-center gap-4 border border-black/10 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                  <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                    <Calculator size={32} />
                  </div>
                  <span className="text-[16px] font-medium text-slate-800 text-center leading-tight">
                    Matematika Minat
                  </span>
                </div>
              </div>
            </div>

            {/* Widget 2: Tugas Perlu Dikoreksi */}
            <div>
              <h3 className="text-[24px] font-medium text-slate-900 tracking-[-0.07em] mb-4 font-sans">
                Tugas Perlu Dikoreksi
              </h3>
              <div className="flex flex-col gap-3">
                {tasksData.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white p-4 rounded-[18px] border border-black/10 shadow-sm flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-all group overflow-hidden relative"
                  >
                    {/* Gradient Border Accent */}
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#E2EBFF]" />

                    <div className="flex items-center gap-3 ml-1">
                      <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                        <Calculator size={20} />
                      </div>
                      <div>
                        <h5 className="text-[14px] font-bold text-[#1D115A] leading-tight">
                          {task.title}
                        </h5>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="px-2 py-0.5 bg-green-50 border border-green-100 text-[#0D9F00] text-[10px] font-bold rounded-full">
                            {task.date}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="text-slate-400 group-hover:text-indigo-600 transition-colors" size={20} />
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
