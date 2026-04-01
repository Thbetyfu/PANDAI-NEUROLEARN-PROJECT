import { useState, useEffect, useRef } from 'react';

export const useFocusStreak = (neuroData) => {
  const [streakMinutes, setStreakMinutes] = useState(0);
  const [secondsInFlow, setSecondsInFlow] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!neuroData) return;

    const { focus_index } = neuroData;
    const isFlowing = focus_index > 0.75;

    if (isFlowing) {
      if (!timerRef.current) {
        timerRef.current = setInterval(() => {
          setSecondsInFlow((prev) => {
            const next = prev + 1;
            if (next >= 60) {
              setStreakMinutes((m) => m + 1);
              return 0;
            }
            return next;
          });
        }, 1000);
      }
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
        // Optional: Reset seconds if flow is broken? 
        // Roadmap doesn't specify, but usually streaks are for continuous flow.
        setSecondsInFlow(0);
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [neuroData?.focus_index]);

  return { streakMinutes, secondsInFlow };
};
