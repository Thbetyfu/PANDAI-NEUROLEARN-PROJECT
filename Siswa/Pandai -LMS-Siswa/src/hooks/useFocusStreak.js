import { useState, useEffect, useRef } from 'react';

/**
 * PANDAI Focus Streak Engine - Phase 4 (Gamification Hook)
 * Menghitung durasi kontinu siswa di "Zona Flow".
 * Dilengkapi dengan "Grace Period" agar kedipan mata/gangguan singkat 
 * tidak langsung memutus streak (Empathy-Driven Design).
 */
export const useFocusStreak = (neuroData) => {
  const [streakMinutes, setStreakMinutes] = useState(0);
  const [secondsInFlow, setSecondsInFlow] = useState(0);
  
  // State Internal
  const distractionGraceRef = useRef(0);
  const timerRef = useRef(null);

  // 1. DATA EXTRACTION: Mengikuti protokol MQTT v1.0
  const metrics = neuroData?.payload?.metrics || {};
  const attention_index = metrics.attention_index || 0;
  const isCurrentlyInFlow = attention_index > 0.75;

  useEffect(() => {
    if (!neuroData) return;

    // Logic: Streak berjalan jika dalam Flow
    if (isCurrentlyInFlow) {
      // Reset grace period jika kembali fokus
      distractionGraceRef.current = 0;

      if (!timerRef.current) {
        timerRef.current = setInterval(() => {
          setSecondsInFlow((prev) => {
            const next = prev + 1;
            if (next >= 60) {
              setStreakMinutes((m) => m + 1);
              return 0; // Reset ke 0 tiap 1 menit
            }
            return next;
          });
        }, 1000);
      }
    } else {
      // 🛡️ EMPATHY-DRIVEN DESIGN: Kasih toleransi 3 detik gangguan
      distractionGraceRef.current += 1;
      
      if (distractionGraceRef.current > 3 && timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        setSecondsInFlow(0); // Reset progress detik jika benar-benar teralihkan
        console.log("[Gamification] ⚠️ Streak Terputus: Fokus menurun > 3 detik.");
      }
    }

    return () => {
      // Cleanup effect but KEEP state for persistence across re-renders
    };
  }, [neuroData?.header?.timestamp]); // Trigger per data baru dari MQTT

  // Cleanup Global
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return { streakMinutes, secondsInFlow, isCurrentlyInFlow };
};
