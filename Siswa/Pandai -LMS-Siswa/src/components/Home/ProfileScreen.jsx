import React, { useEffect } from 'react';
import { useNeuroMqtt } from '../../hooks/useNeuroMqtt';
import { useHistoryMqtt } from '../../hooks/useHistoryMqtt';
import { useNeuroListener } from '@/hooks/useNeuroListener';
import BiometricChart from '../_shared/Charts/BiometricChart';
import HistoricalTrendChart from '../_shared/Charts/HistoricalTrendChart';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Sparkles, TrendingUp, Brain, Activity, Camera, Smile, UserCheck, MapPin, Copy, Calendar } from 'lucide-react';

export default function ProfileScreen() {
  const { neuroData, status } = useNeuroMqtt();
  const { historyData, isLoading, error } = useHistoryMqtt();
  const { isSimulating, setIsSimulating, triggerSimulation } = useNeuroListener();

  return (
    <div className='px-6 pb-32 pt-8'>
      {/* Header Profile */}
      <div className='flex flex-col items-center mb-10'>
        <div className='relative group cursor-pointer'>
          <div className='w-28 h-28 rounded-full p-1 bg-white border-2 border-gray-100 shadow-lg overflow-hidden'>
            <img
              src={MOCK_USER.avatar}
              alt='Large Profile'
              className='w-full h-full rounded-full object-cover transition-transform duration-500 group-hover:scale-110'
            />
          </div>
        </div>

        <h2 className='text-[28px] font-bold bg-linear-to-r from-black to-[#003EC0] bg-clip-text text-transparent mt-4'>
          {MOCK_USER.name}
        </h2>
        <span className='bg-gray-100 text-gray-500 text-xs px-4 py-1.5 rounded-full mt-2 font-medium'>
          {MOCK_USER.role}
        </span>
      </div>

      <div className='text-left w-full space-y-6'>

        {/* BAGIAN UTAMA: Neuro-Cognitive Status */}
        <div className='bg-white border border-gray-100 rounded-3xl p-5 shadow-sm'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='font-bold text-[#1D115A] text-lg'>Status Saraf (Real-time)</h3>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${status === 'ONLINE' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
              {status}
            </span>
          </div>

          <div className='grid grid-cols-2 gap-3 mb-4'>
            <div className='bg-linear-to-br from-[#F8FAFF] to-[#E2EBFF] p-4 rounded-2xl border border-white/50 shadow-sm'>
              <Brain size={20} className='text-blue-600 mb-2' />
              <p className='text-[10px] text-gray-500 font-medium uppercase tracking-wider'>Focus Index</p>
              <p className='text-2xl font-black text-blue-700'>
                {((neuroData?.payload?.metrics?.attention_index || 0) * 100).toFixed(0)}%
              </p>
            </div>
            <div className='bg-linear-to-br from-[#FDF8FF] to-[#F3E8FF] p-4 rounded-2xl border border-white/50 shadow-sm'>
              <Activity size={20} className='text-purple-600 mb-2' />
              <p className='text-[10px] text-gray-500 font-medium uppercase tracking-wider'>Beban Kerja</p>
              <p className='text-2xl font-black text-purple-700'>
                {neuroData?.payload?.metrics?.cognitive_load || 0}%
              </p>
            </div>
          </div>

          {/* Real-time Charts Section */}
          <div className='mt-8 pt-8 border-t border-gray-100'>
            <div className='flex items-center gap-2 mb-4'>
              <TrendingUp size={20} className='text-blue-600' />
              <h3 className='font-bold text-[#1D115A] text-lg'>Live Neuro-Activity</h3>
            </div>

            <div className="space-y-4">
              <BiometricChart
                label="Focus Stability (Attention)"
                value={(neuroData?.payload?.metrics?.attention_index || 0)}
                color="#1D4ED8"
              />
              <BiometricChart
                label="Cognitive Fatigue (EAR)"
                value={neuroData?.payload?.metrics?.ear_score || 0}
                color="#8B5CF6"
                min={0}
                max={0.5}
              />
            </div>
          </div>

          {/* NEW: Historical Trend Section */}
          <div className='mt-8 pt-8 border-t border-gray-100'>
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center gap-2'>
                <Calendar size={20} className='text-indigo-600' />
                <h3 className='font-bold text-[#1D115A] text-lg'>Tren Belajar 7 Hari</h3>
              </div>
            </div>
            
            {isLoading ? (
              <div className="w-full h-48 bg-gray-50/50 animate-pulse rounded-3xl flex items-center justify-center border border-dashed border-gray-200">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Menarik Log Sejarah...</p>
                </div>
              </div>
            ) : error ? (
              <div className="w-full h-48 bg-red-50 rounded-3xl flex items-center justify-center border border-red-200">
                 <p className="text-red-500 text-xs font-bold">{error}</p>
              </div>
            ) : (
              <HistoricalTrendChart data={historyData} />
            )}

            <div className='mt-3 flex justify-center gap-4'>
              <div className='flex items-center gap-1.5'>
                <div className='w-2 h-2 rounded-full bg-blue-600'></div>
                <span className='text-[10px] font-bold text-gray-400'>RATA-RATA FOKUS</span>
              </div>
              <div className='flex items-center gap-1.5'>
                <div className='w-2 h-2 rounded-full bg-purple-600'></div>
                <span className='text-[10px] font-bold text-gray-400'>BEBAN KERJA</span>
              </div>
            </div>
          </div>

          {/* Visual Monitoring (Kamera) */}
          <div className='mt-8 pt-8 border-t border-gray-100'>
            <div className="flex items-center justify-between mb-4">
              <h3 className='font-bold text-[#1D115A] text-lg flex items-center gap-2'>
                <Camera size={20} className="text-blue-500" />
                Monitoring Visual
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${neuroData?.payload?.metrics?.face_detected ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
                {neuroData?.payload?.metrics?.face_detected ? 'FACE DETECTED' : 'FACE NOT FOUND'}
              </span>
            </div>

            <div className='bg-white border border-gray-100 p-4 rounded-2xl relative overflow-hidden shadow-xs'>
              <div className="relative z-10">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <p className='text-[10px] text-gray-500 font-medium'>Raut Wajah (EAR Score)</p>
                    <p className='text-2xl font-black text-[#1D115A]'>{neuroData?.payload?.metrics?.ear_score || 0.00}</p>
                  </div>
                  <div className="text-right">
                    <p className='text-[10px] text-gray-500 font-medium text-right'>Analisis Citra</p>
                    <p className={`text-[12px] font-bold ${neuroData?.payload?.metrics?.face_detected ? 'text-green-600' : 'text-gray-400'}`}>
                      {neuroData?.payload?.metrics?.face_detected ? 'Kualitas Prima' : 'Sensor Standby'}
                    </p>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${neuroData?.payload?.metrics?.ear_score < 0.24 ? 'bg-orange-500' : 'bg-blue-500'}`}
                    style={{ width: `${Math.min(100, (neuroData?.payload?.metrics?.ear_score || 0) * 200)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Mood & Gaze Analysis */}
          <div className='mt-8 pt-8 border-t border-gray-100'>
            <div className='flex items-center gap-2 mb-4'>
              <UserCheck size={20} className='text-purple-600' />
              <h3 className='font-bold text-[#1D115A] text-lg'>Analisis Perilaku</h3>
            </div>

            <div className='grid grid-cols-2 gap-3 mb-6'>
              <div className='bg-[#FDF8FF] border border-purple-50 p-4 rounded-3xl relative overflow-hidden'>
                <Smile size={32} className="absolute -right-1 -top-1 text-purple-100/50" />
                <p className='text-[10px] text-gray-500 font-bold uppercase mb-1'>Mood Analysis</p>
                <p className='text-xl font-black text-purple-800'>{neuroData?.payload?.metrics?.emotion || "NEUTRAL"}</p>
                <div className='mt-2 flex items-center gap-1'>
                  <div className='w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse'></div>
                  <span className='text-[8px] font-bold text-purple-400 uppercase tracking-tighter'>Emotion Sync Active</span>
                </div>
              </div>

              <div className='bg-[#F8FAFF] border border-blue-50 p-4 rounded-3xl relative overflow-hidden'>
                <MapPin size={32} className="absolute -right-1 -top-1 text-blue-100/50" />
                <p className='text-[10px] text-gray-500 font-bold uppercase mb-1'>Attention Focus</p>
                <p className='text-xl font-black text-blue-800 uppercase'>
                  {neuroData?.payload?.metrics?.gaze_coords?.x > 0.4 && neuroData?.payload?.metrics?.gaze_coords?.x < 0.6 ? "On Target" : "Distracted"}
                </p>
                <p className='text-[8px] font-medium text-gray-400'>Coord: {neuroData?.payload?.metrics?.gaze_coords?.x}, {neuroData?.payload?.metrics?.gaze_coords?.y}</p>
              </div>
            </div>

            <div className='bg-gray-950 p-6 rounded-[2rem] relative overflow-hidden aspect-video border-[6px] border-white shadow-xl'>
              <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 to-transparent'></div>
              <div
                className="absolute w-24 h-24 bg-blue-500/40 rounded-full blur-2xl transition-all duration-500 ease-out"
                style={{
                  left: `${(neuroData?.payload?.metrics?.gaze_coords?.x || 0.5) * 100}%`,
                  top: `${(neuroData?.payload?.metrics?.gaze_coords?.y || 0.5) * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              ></div>
              <div
                className="absolute w-4 h-4 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] transition-all duration-300"
                style={{
                  left: `${(neuroData?.payload?.metrics?.gaze_coords?.x || 0.5) * 100}%`,
                  top: `${(neuroData?.payload?.metrics?.gaze_coords?.y || 0.5) * 100}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              ></div>
            </div>
          </div>

          {/* AI Neuro-Insights */}
          <div className="mt-8 p-6 bg-gradient-to-br from-[#0041C9] to-[#001D5A] rounded-3xl text-white shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={18} className="text-blue-300 animate-pulse" />
                <h4 className="font-bold text-sm tracking-wide">WAWASAN PANDAI AI</h4>
              </div>
              <p className="text-xs leading-relaxed opacity-90 font-medium">
                "Kapasitas kognitif Anda optimal pagi ini. Rekomendasi: Fokus pada materi berat (Kalkulus/Fisika) selama 45 menit ke depan sebelum load mental meningkat."
              </p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-[10px] text-blue-200">Berdasarkan data 1 jam terakhir</span>
                <button className="text-[10px] font-bold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-all">Lihat Detail</button>
              </div>
            </div>
          </div>

          {/* Intervention Logs */}
          <div className="mt-8 pt-8 border-t border-gray-100">
            <div className='flex items-center gap-2 mb-4'>
              <Activity size={20} className='text-orange-500' />
              <h3 className='font-bold text-[#1D115A] text-lg'>Log Keselamatan Saraf</h3>
            </div>
            <div className="space-y-3">
              {[
                { action: "tDCS: Flow Induction", val: "1.5mA", time: "10:45", type: "med" },
                { action: "Light: Focus White", val: "80%", time: "10:12", type: "env" },
                { action: "AI: Rest Suggestion", val: "5 Min", time: "09:30", type: "ai" }
              ].map((log, i) => (
                <div key={i} className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 flex justify-between items-center hover:shadow-md transition-all group">
                  <div className="flex items-center gap-3">
                    <div className={`w-1 h-8 rounded-full ${log.type === 'med' ? 'bg-indigo-500' : log.type === 'env' ? 'bg-yellow-400' : 'bg-blue-400'}`}></div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{log.action}</p>
                      <p className="text-xs font-black text-slate-700">{log.val}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-gray-400">{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[9px] text-gray-400 mt-4 text-center italic">Integrity Shield: 100% intervensi terverifikasi aman oleh PANDAI Core.</p>
          </div>

          {/* Admin Panel */}
          <div className="mt-8 pt-8 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-800 mb-2 uppercase tracking-wide">Panel Simulasi Tester</h4>
            <label className="flex items-center space-x-2 text-xs mb-3 cursor-pointer p-2 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                checked={isSimulating}
                onChange={(e) => setIsSimulating(e.target.checked)}
                className="rounded text-blue-600"
              />
              <span className="font-semibold text-gray-700">Override Mode Simulasi Intervensi</span>
            </label>
            <AnimatePresence>
              {isSimulating && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="grid grid-cols-2 gap-2 text-[10px]"
                >
                  <button onClick={() => triggerSimulation('DROWSY')} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-2 py-2 rounded-xl transition cursor-pointer">😴 Drowsy</button>
                  <button onClick={() => triggerSimulation('HIGH_STRESS')} className="bg-red-500 hover:bg-red-600 text-white font-bold px-2 py-2 rounded-xl transition cursor-pointer">⚠️ Stress</button>
                  <button onClick={() => triggerSimulation('FATIGUE')} className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-2 py-2 rounded-xl transition cursor-pointer">😫 Fatigue</button>
                  <button onClick={() => triggerSimulation('NORMAL')} className="bg-green-500 hover:bg-green-600 text-white font-bold px-2 py-2 rounded-xl transition cursor-pointer">✅ Normal</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Informasi Pribadi */}
        <div>
          <h3 className='font-bold text-[#1D115A] text-lg mb-3'>Informasi Pribadi</h3>
          <div className='space-y-3 border-gray-100 shadow-sm px-6 py-4 rounded-2xl bg-white'>
            <div className='flex justify-between items-center'>
              <span className='text-sm font-bold text-[#1D115A]'>NISN</span>
              <div className='flex items-center gap-3 bg-gray-50 pl-4 pr-2 py-2 rounded-xl'>
                <span className='text-sm font-semibold text-gray-700 tracking-wider'>{MOCK_USER.nisn}</span>
                <button className='p-1.5 hover:bg-white rounded-lg transition-colors text-gray-400 hover:text-[#1D115A] shadow-sm'>
                  <Copy size={14} />
                </button>
              </div>
            </div>
            <hr />
            <div className='flex justify-between items-center'>
              <span className='text-sm font-bold text-[#1D115A]'>NIS</span>
              <div className='flex items-center gap-3 bg-gray-50 pl-4 pr-2 py-2 rounded-xl'>
                <span className='text-sm font-semibold text-gray-700 tracking-wider'>{MOCK_USER.nis}</span>
                <button className='p-1.5 hover:bg-white rounded-lg transition-colors text-gray-400 hover:text-[#1D115A] shadow-sm'>
                  <Copy size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='mt-12'>
        <button className='w-full py-4 text-red-500 font-bold text-sm bg-red-50 rounded-2xl hover:bg-red-100 transition-colors flex justify-center items-center gap-2'>
          Log Out
        </button>
      </div>
    </div>
  );
}

const MOCK_USER = {
  name: 'Fanan Agfian Mozart',
  role: 'Murid',
  nisn: '123456789',
  nis: '123456789',
  avatar: 'https://i.pravatar.cc/150?u=mozart_student',
};
