import React from 'react';
import { Copy, Activity, Brain, Eye } from 'lucide-react';
import { useNeuroMqtt } from '../../hooks/useNeuroMqtt';
import { useNeuroListener } from '@/hooks/useNeuroListener';

export default function ProfileScreen() {
  const { neuroData, status } = useNeuroMqtt();
  const { isSimulating, setIsSimulating, triggerSimulation } = useNeuroListener();

  return (
    <div className='px-6 pb-24 pt-8'>
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
            <div className='bg-[#F8FAFF] p-4 rounded-2xl'>
              <Brain size={20} className='text-blue-600 mb-2' />
              <p className='text-[10px] text-gray-500 font-medium'>Skor Fokus</p>
              <p className='text-xl font-bold text-blue-700'>
                {((neuroData?.payload?.metrics?.attention_index || neuroData?.payload?.metrics?.ear_score || 0) * 100).toFixed(0)}%
              </p>
            </div>
            <div className='bg-[#FDF8FF] p-4 rounded-2xl'>
              <Activity size={20} className='text-purple-600 mb-2' />
              <p className='text-[10px] text-gray-500 font-medium'>Beban Kerja</p>
              <p className='text-xl font-bold text-purple-700'>
                {neuroData?.payload?.metrics?.cognitive_load || 0}%
              </p>
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
