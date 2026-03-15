import React from 'react';
import { Copy, Activity, Brain, Eye, Camera, TrendingUp, Smile, UserCheck, MapPin } from 'lucide-react';
import { useNeuroMqtt } from '../../hooks/useNeuroMqtt';
import { useNeuroListener } from '@/hooks/useNeuroListener';

export default function ProfileScreen() {
  const { neuroData, status } = useNeuroMqtt();
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

        {/* BAGIAN BARU: Neuro-Cognitive Status */}
        <div className='bg-white border border-gray-100 rounded-3xl p-5 shadow-sm'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='font-bold text-[#1D115A] text-lg'>Status Saraf (Real-time)</h3>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${status === 'ONLINE' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
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

          {/* Bagian Baru: Statistik Kesejahteraan & Tren */}
          <div className='mt-8 pt-8 border-t border-gray-100'>
            <div className='flex items-center gap-2 mb-4'>
              <TrendingUp size={20} className='text-blue-600' />
              <h3 className='font-bold text-[#1D115A] text-lg'>Tren Kesejahteraan Biometrik</h3>
            </div>

            <div className='bg-linear-to-br from-[#F8FAFF] to-white p-4 rounded-3xl border border-blue-50 mb-6'>
              <p className='text-[10px] text-gray-500 font-medium uppercase mb-4'>Heart Rate Variability (HRV) - 7 Hari Terakhir</p>
              {/* Mini Chart Mockup (SVG) */}
              <div className="w-full h-24 mb-2 flex items-end gap-1">
                {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
                  <div key={i} className="flex-1 bg-blue-100 rounded-t-lg relative group">
                    <div
                      className="absolute bottom-0 w-full bg-blue-500 rounded-t-lg transition-all duration-1000"
                      style={{ height: `${h}%` }}
                    ></div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[8px] text-gray-400 font-bold uppercase">
                <span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span><span>Min</span>
              </div>
            </div>

            {/* Visual Monitoring (Kamera) - Sekarang berada persis di bawah Tren */}
            <div className='mb-6'>
              <div className="flex items-center justify-between mb-3 px-1">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${neuroData?.payload?.metrics?.face_detected ? 'bg-blue-500' : 'bg-red-500'}`}></div>
                  Visual Monitoring (Kamera)
                </h4>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                  {neuroData?.payload?.metrics?.face_detected ? 'FACE DETECTED' : 'FACE NOT FOUND'}
                </span>
              </div>

              <div className='bg-white border border-gray-100 p-4 rounded-2xl relative overflow-hidden shadow-xs'>
                {/* Decorative Camera Icon */}
                <Camera size={48} className="absolute -right-2 -bottom-2 text-gray-100/50" />

                <div className="relative z-10">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <p className='text-[10px] text-gray-500 font-medium'>Raut Wajah (EAR Score)</p>
                      <p className='text-2xl font-black text-[#1D115A]'>{neuroData?.payload?.metrics?.ear_score || 0.00}</p>
                    </div>
                    <div className="text-right">
                      <p className='text-[10px] text-gray-500 font-medium text-right'>Analisis Statistik</p>
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
                  <p className="text-[9px] text-gray-400 mt-2 italic font-medium">Sinkronisasi Real-time dengan Neuro-Engine Aktif.</p>
                </div>
              </div>
            </div>

            {/* FITUR BARU: Tren Citra Anak (Emotion & Gaze) */}
            <div className='mt-8 pt-8 border-t border-gray-100'>
              <div className='flex items-center gap-2 mb-4'>
                <UserCheck size={20} className='text-purple-600' />
                <h3 className='font-bold text-[#1D115A] text-lg'>Tren Citra Anak</h3>
              </div>

              <div className='grid grid-cols-2 gap-3 mb-6'>
                {/* Emotion Status Card */}
                <div className='bg-[#FDF8FF] border border-purple-50 p-4 rounded-3xl relative overflow-hidden'>
                  <Smile size={32} className="absolute -right-1 -top-1 text-purple-100/50" />
                  <p className='text-[10px] text-gray-500 font-bold uppercase mb-1'>Mood Analysis</p>
                  <p className='text-xl font-black text-purple-800'>
                    {neuroData?.payload?.metrics?.emotion || "NEUTRAL"}
                  </p>
                  <div className='mt-2 flex items-center gap-1'>
                    <div className='w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse'></div>
                    <span className='text-[8px] font-bold text-purple-400 uppercase tracking-tighter'>Emotion Sync Active</span>
                  </div>
                </div>

                {/* Gaze/Heatmap Stats Card */}
                <div className='bg-[#F8FAFF] border border-blue-50 p-4 rounded-3xl relative overflow-hidden'>
                  <MapPin size={32} className="absolute -right-1 -top-1 text-blue-100/50" />
                  <p className='text-[10px] text-gray-500 font-bold uppercase mb-1'>Attention Focus</p>
                  <p className='text-xl font-black text-blue-800 uppercase'>
                    {neuroData?.payload?.metrics?.gaze_coords?.x > 0.4 && neuroData?.payload?.metrics?.gaze_coords?.x < 0.6 ? "On Target" : "Distracted"}
                  </p>
                  <p className='text-[8px] font-medium text-gray-400'>Coord: {neuroData?.payload?.metrics?.gaze_coords?.x}, {neuroData?.payload?.metrics?.gaze_coords?.y}</p>
                </div>
              </div>

              {/* Attention Heatmap Visualization (Offloaded to Dashboard) */}
              <div className='bg-gray-950 p-6 rounded-[2rem] relative overflow-hidden aspect-video border-[6px] border-white shadow-xl'>
                <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 to-transparent'></div>

                {/* The "Heat" Point - Dynamically positioned via MQTT coordinates */}
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

                <div className="absolute bottom-4 left-6 right-6 flex justify-between items-center text-white/40">
                  <span className="text-[10px] font-bold uppercase tracking-widest">Live Attention Heatmap</span>
                  <div className="flex gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                  </div>
                </div>
              </div>
              <p className='text-[9px] text-gray-400 mt-3 text-center italic'>Dashboard memproses data koordinat pupil secara ringan untuk akurasi monitor.</p>
            </div>
          </div>

          {/* Alert Intervensi: Sekarang di dalam scrollable content, tidak menutupi navbar */}
          {neuroData?.payload?.metrics?.ear_score < 0.24 && typeof neuroData?.payload?.metrics?.ear_score === 'number' && (
            <div className='p-3 bg-orange-50 border border-orange-200 rounded-xl animate-pulse mb-4'>
              <p className='text-[11px] text-orange-700 font-bold flex items-center gap-2'>
                <Eye size={14} /> Sistem mendeteksi kamu mengantuk. Segarkan dirimu!
              </p>
            </div>
          )}

          {/* Simulation Debug Window (dipindah ke dalam layar Profil) */}
          <div className="mt-4 pt-4 border-t border-gray-100">
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
            {isSimulating && (
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <button onClick={() => triggerSimulation('DROWSY')} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-2 py-2 rounded-xl transition">😴 Drowsy</button>
                <button onClick={() => triggerSimulation('HIGH_STRESS')} className="bg-red-500 hover:bg-red-600 text-white font-bold px-2 py-2 rounded-xl transition">⚠️ Stress</button>
                <button onClick={() => triggerSimulation('FATIGUE')} className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-2 py-2 rounded-xl transition">😫 Fatigue</button>
                <button onClick={() => triggerSimulation('NORMAL')} className="bg-green-500 hover:bg-green-600 text-white font-bold px-2 py-2 rounded-xl transition">✅ Normal</button>
              </div>
            )}
          </div>
        </div>

        {/* Informasi Pribadi */}
        <div>
          <h3 className='font-bold text-[#1D115A] text-lg mb-3'>Informasi Pribadi</h3>

          <div className='space-y-3 border-gray-100 shadow-sm px-6 py-4 rounded-2xl bg-white'>
            <div className=' flex justify-between items-center'>
              <span className='text-sm font-bold text-[#1D115A]'>NISN</span>
              <div className='flex items-center gap-3 bg-gray-50 pl-4 pr-2 py-2 rounded-xl'>
                <span className='text-sm font-semibold text-gray-700 tracking-wider'>
                  {MOCK_USER.nisn}
                </span>
                <button className='p-1.5 hover:bg-white rounded-lg transition-colors text-gray-400 hover:text-[#1D115A] shadow-sm'>
                  <Copy size={14} />
                </button>
              </div>
            </div>
            <hr />

            <div className='flex justify-between items-center'>
              <span className='text-sm font-bold text-[#1D115A]'>NIS</span>
              <div className='flex items-center gap-3 bg-gray-50 pl-4 pr-2 py-2 rounded-xl'>
                <span className='text-sm font-semibold text-gray-700 tracking-wider'>
                  {MOCK_USER.nis}
                </span>
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
