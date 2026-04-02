import React, { useMemo } from 'react';
import { useNeuroMqtt } from '@/hooks/useNeuroMqtt';

/**
 * PANDAI Dynamic Avatar - Phase 4 (Gamification Engine)
 * Mengubah ekspresi & aura Panda berdasarkan data biometrik real-time.
 */
const PandaAvatar = ({ size = 150 }) => {
  const { neuroData, status } = useNeuroMqtt();

  // 1. DATA EXTRACTION: Mengikuti protokol MQTT v1.0
  const metrics = neuroData?.payload?.metrics || {};
  const { 
    attention_index = 0.5, 
    cognitive_load = 40, 
    ear_score = 0.5, 
    emotion = 'NEUTRAL',
    state: engineState = 'FLOW'
  } = metrics;

  // 2. STATE CLASSIFICATION (Logic Roadmap Phase 4)
  const avatarState = useMemo(() => {
    if (status === 'OFFLINE' || !neuroData) return 'idle';

    // Prioritas: Emergency/Security Alert
    if (engineState === 'IDENTITY_LOCK') return 'alert';
    
    // Logic Biometrik
    if (ear_score < 0.23) return 'drowsy';
    if (cognitive_load > 75 || emotion === 'CONFUSED/ANGRY') return 'stress';
    if (attention_index > 0.8 || emotion === 'HAPPY') return 'flow';
    if (emotion === 'SAD') return 'sad';
    
    return 'neutral';
  }, [neuroData, status, ear_score, cognitive_load, emotion, attention_index, engineState]);

  // 3. UI MAPPING (Aesthetics & Text)
  const config = {
    idle: { emoji: '💤', text: 'OFFLINE', color: 'bg-gray-400', aura: 'bg-gray-200', glow: 'shadow-gray-200' },
    flow: { emoji: '🔥', text: 'ZONA FLOW', color: 'bg-orange-500', aura: 'bg-orange-400', glow: 'shadow-orange-400/50' },
    stress: { emoji: '😵‍💫', text: 'TENANG YA...', color: 'bg-red-500', aura: 'bg-rose-500', glow: 'shadow-red-400/50' },
    drowsy: { emoji: '😴', text: 'AYO BANGUN!', color: 'bg-indigo-600', aura: 'bg-indigo-400', glow: 'shadow-indigo-400/50' },
    sad: { emoji: '🥺', text: 'SEMANGAT!', color: 'bg-blue-500', aura: 'bg-blue-300', glow: 'shadow-blue-300/40' },
    alert: { emoji: '⚠️', text: 'IDENTITY LOCK', color: 'bg-black', aura: 'bg-red-900', glow: 'shadow-red-900' },
    neutral: { emoji: '✨', text: 'SIAP BELAJAR', color: 'bg-primary-blue', aura: 'bg-blue-100', glow: 'shadow-blue-200/50' }
  }[avatarState];

  return (
    <div className="flex flex-col items-center gap-3 relative group">
      {/* 🚀 STEP 1: Floating Badge (Glassmorphism) */}
      <div className={`absolute -top-6 px-4 py-1.5 rounded-full text-[11px] font-black text-white shadow-xl z-20 transition-all duration-500 
        backdrop-blur-md border border-white/20 scale-100 group-hover:scale-110 ${config.color}`}>
        <span className="flex items-center gap-2">
          <span className="animate-pulse">{config.emoji}</span>
          {config.text}
        </span>
      </div>

      {/* 🚀 STEP 2: Main Avatar Container */}
      <div 
        className={`relative rounded-full border-[6px] transition-all duration-700 p-2 ${
          status === 'ONLINE' ? `border-white shadow-2xl ${config.glow}` : 'border-gray-100 grayscale'
        }`}
        style={{ width: size, height: size }}
      >
        {/* Dynamic Aura Background */}
        <div className={`absolute inset-4 rounded-full transition-all duration-1000 opacity-30 blur-2xl ${config.aura} ${
          avatarState === 'flow' ? 'animate-pulse' : ''
        }`} />

        {/* Panda SVG Asset */}
        <img 
          src="/images/fire-panda.svg" 
          alt="Panda Avatar"
          className={`w-full h-full object-contain relative z-10 transition-all duration-700 ${
            avatarState === 'flow' ? 'scale-110 drop-shadow-[0_0_15px_rgba(251,146,60,0.8)]' : 
            avatarState === 'stress' ? 'scale-105 saturate-150 animate-bounce' : 
            avatarState === 'drowsy' ? 'translate-y-2 opacity-70 blur-[0.2px]' : 
            avatarState === 'alert' ? 'invert brightness-50' : ''
          }`}
        />
        
        {/* Gradient Overlay for Mood Depth */}
        <div className={`absolute inset-0 rounded-full pointer-events-none transition-opacity duration-1000 opacity-10 ${
          avatarState === 'flow' ? 'bg-gradient-to-tr from-orange-400 to-yellow-200' : 
          avatarState === 'stress' ? 'bg-gradient-to-tr from-red-600 to-transparent' : 
          avatarState === 'drowsy' ? 'bg-indigo-900 border-b-8 border-black/20' : 'bg-transparent'
        }`} />
      </div>

      {/* 🚀 STEP 3: Status Indicator */}
      <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-gray-100 shadow-sm">
        <div className={`w-2 h-2 rounded-full ${status === 'ONLINE' ? 'bg-green-500 animate-ping' : 'bg-gray-300'}`} />
        <span className={`text-[10px] font-black tracking-widest uppercase ${
          status === 'ONLINE' ? 'text-primary-blue' : 'text-gray-400'
        }`}>
          {status}
        </span>
      </div>
    </div>
  );
};

export default PandaAvatar;
