import { create } from 'zustand';

export const usePandaiStore = create((set) => ({
    students: [], // Ini akan diisi dari API nanti
    liveBiometrics: {
        gsr: 0,
        hrv: 0,
        ear: 0
    },
    biometricsHistory: [],
    interventionLogs: [],

    setBiometrics: (newData) => set((state) => ({
        liveBiometrics: { ...state.liveBiometrics, ...newData }
    })),

    addBiometricData: (dataPoint) => set((state) => {
        const newHistory = [...state.biometricsHistory, dataPoint].slice(-20);
        return { biometricsHistory: newHistory };
    }),

    addLog: (log) => set((state) => {
        const newLogs = [log, ...state.interventionLogs].slice(0, 5);
        return { interventionLogs: newLogs };
    }),
}));
