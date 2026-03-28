/**
 * useSecurityShield.js — PANDAI Cyber-Shield v5.1
 * ============================================
 * 1. Pencegahan Right-Click (Context Menu)
 * 2. Blokade Copy/Paste/Cut Pintasan Keyboard
 * 3. Deteksi & Pencegahan DevTools (Inspect Element) mendasar
 * 4. Peringatan Konsol untuk 'Bad Actors'
 */

import { useEffect } from 'react';

export default function useSecurityShield(active = true) {
  useEffect(() => {
    if (!active) return;

    // ── 1. Disable Context Menu (Right Click) ──────────────────────────────
    const handleContextMenu = (e) => {
      e.preventDefault();
      console.warn('🛡️ [PANDAI] Akses Context Menu diblokir demi integritas data biometrik.');
    };

    // ── 2. Keyboard Shortcuts Lock (Copy, Paste, Cut, Inspect) ──────────────
    const handleKeyDown = (e) => {
      // Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+U (view source)
      if (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'u')) {
        e.preventDefault();
        return;
      }
      
      // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C (DevTools)
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) {
        e.preventDefault();
        return;
      }

      // F12 (DevTools)
      if (e.key === 'F12') {
        e.preventDefault();
        return;
      }
    };

    // ── 3. DevTools Detection (Simple Loop) ─────────────────────────────────
    // Kami menggunakan trik konsol untuk mendeteksi jika jendela inspeksi dibuka
    const devToolsCheck = () => {
      const start = performance.now();
      // eslint-disable-next-line
      debugger; 
      const end = performance.now();
      
      // Jika debugger menginterupsi > 100ms, kemungkinan besar DevTools aktif
      if (end - start > 100) {
        // Bisa trigger lock kuis di sini if needed
        console.error('🛡️ [SECURITY BREACH] DevTools terdeteksi! Laporan divalidasi sebagai tidak sah jika dilanjutkan.');
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    
    // Interval check ringan
    const interval = setInterval(devToolsCheck, 5000);

    // Initial console warning for hackers
    console.log(
      "%c🛡️ PANDAI SECURITY", 
      "color: #0041c9; font-size: 30px; font-weight: bold; text-shadow: 2px 2px 0px white;"
    );
    console.log(
      "%cBerhenti! Ini adalah bagian dari sistem biometrik PANDAI. Manipulasi kode di sini akan membatalkan sertifikasi kognitif Anda.",
      "color: #ef4444; font-size: 14px;"
    );

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      clearInterval(interval);
    };
  }, [active]);
}
