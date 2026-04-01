import React, { useMemo } from 'react';
import { useNeuroMqtt } from '@/hooks/useNeuroMqtt';

const PandaAvatar = ({ size = 150 }) => {
  const { neuroData, status } = useNeuroMqtt();

  const state = useMemo(() => {
    if (status === 'OFFLINE' || !neuroData) return 'neutral';

    const { focus_index, cognitive_load, ear } = neuroData;

    // Logic based on Master Roadmap Phase 4
    if (ear < 0.2) return 'drowsy';
    if (cognitive_load > 0.7) return 'stress';
    if (focus_index > 0.75) return 'happy';
    
    return 'neutral';
  }, [neuroData, status]);

  const getEmoji = () => {
    switch (state) {
      case 'happy': return '🔥';
      case 'stress': return '😵‍💫';
      case 'drowsy': return '😴';
      default: return '✨';
    }
  };

  const getStatusText = () => {
    switch (state) {
      case 'happy': return 'ZONA FLOW!';
      case 'stress': return 'TENANG YA...';
      case 'drowsy': return 'AYO BANGUN!';
      default: return 'SIAP BELAJAR';
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 relative">
      {/* Expression Badge */}
      <div className={`absolute -top-4 -right-2 px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-lg animate-bounce transition-colors duration-500 ${
        state === 'happy' ? 'bg-orange-500' : 
        state === 'stress' ? 'bg-red-500' : 
        state === 'drowsy' ? 'bg-indigo-500' : 'bg-primary-blue'
      }`}>
        {getStatusText()}
      </div>

      <div 
        className={`relative rounded-full overflow-hidden border-4 transition-all duration-500 ${
          status === 'ONLINE' ? 'border-primary-blue shadow-blue-200 shadow-2xl' : 'border-gray-200 grayscale'
        }`}
        style={{ width: size, height: size }}
      >
        <img 
          src="/images/fire-panda.svg" 
          alt="Panda Avatar"
          className={`w-full h-full object-contain transition-transform duration-700 ${
            state === 'happy' ? 'scale-110 rotate-3' : 
            state === 'stress' ? 'scale-95 blur-[0.5px]' : 
            state === 'drowsy' ? 'translate-y-2 opacity-80' : ''
          }`}
        />
        
        {/* State Overlay Effect */}
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-20 ${
          state === 'happy' ? 'bg-orange-400' : 
          state === 'stress' ? 'bg-red-600' : 
          state === 'drowsy' ? 'bg-blue-900' : 'bg-transparent'
        }`} />
      </div>

      <div className="flex items-center gap-1">
        <span className="text-xl">{getEmoji()}</span>
        <span className={`text-[10px] font-bold uppercase tracking-wider ${
          status === 'ONLINE' ? 'text-primary-blue' : 'text-gray-400'
        }`}>
          {status}
        </span>
      </div>
    </div>
  );
};

export default PandaAvatar;
