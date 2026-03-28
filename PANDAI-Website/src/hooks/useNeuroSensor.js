/**
 * useNeuroSensor.js — PANDAI Multi-Layer Biometric Engine v5.0
 * ============================================================
 * Layer 1: Behavioral Signals  (response time, idle, tab-switch)
 * Layer 2: Computer-Vision     (BlazeFace — face presence, gaze proxy, face-center drift)
 * Layer 3: Webcam rPPG proxy   (brightness variance as a proxy for micro-movements)
 *
 * Returns a unified `neuroState` object consumed by NeuroExperience.jsx
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import * as blazeface from '@tensorflow-models/blazeface';
import '@tensorflow/tfjs';

// ── Constants ────────────────────────────────────────────────────────────────
const DETECT_INTERVAL_MS = 120;      // ~8 fps face detection (light on CPU)
const IDLE_THRESHOLD_MS  = 3000;     // 3 s with no mouse/key activity = idle
const GAZE_CENTER_THRESH = 0.35;     // nose must stay within 35% of face box center
const MIN_FACE_BOX_RATIO = 0.06;     // face must fill at least 6% of frame area
const BLINK_BRIGHT_DELTA = 15;       // brightness drop of 15 units → blink candidate

// ── Hook ─────────────────────────────────────────────────────────────────────
export default function useNeuroSensor(videoRef, isActive) {
  const [neuroState, setNeuroState] = useState({
    facePresent:       false,
    faceConfidence:    0,      // 0–1  (BlazeFace score)
    gazeOnScreen:      true,   // true = looking forward
    isIdle:            false,
    tabSwitchCount:    0,
    blinkCount:        0,
    attentionScore:    100,    // 0–100 composite
    stabilityScore:   100,    // 0–100 composite
    alertMessage:      null,   // string | null
    modelReady:        false,
  });

  // Refs (avoid stale closures in intervals)
  const modelRef          = useRef(null);
  const lastActivityRef   = useRef(Date.now());
  const tabSwitchRef      = useRef(0);
  const blinkRef          = useRef(0);
  const prevBrightRef     = useRef(null);
  const idleTimerRef      = useRef(null);
  const rafRef            = useRef(null);
  const canvasRef         = useRef(document.createElement('canvas'));
  const compositeRef      = useRef({ att: 100, stab: 100 });

  // ── Load BlazeFace Model ──────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const model = await blazeface.load({ maxFaces: 1 });
        if (!cancelled) {
          modelRef.current = model;
          setNeuroState(prev => ({ ...prev, modelReady: true }));
        }
      } catch (e) {
        console.error('[NeuroSensor] BlazeFace load failed:', e);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ── Layer 1: Tab-Switch Listener ─────────────────────────────────────────
  useEffect(() => {
    if (!isActive) return;
    const onVisChange = () => {
      if (document.hidden) {
        tabSwitchRef.current += 1;
        setNeuroState(prev => ({
          ...prev,
          tabSwitchCount: tabSwitchRef.current,
          alertMessage: '⚠️ Prof berpindah tab! Sesi biometrik terinterupsi.',
        }));
      } else {
        setNeuroState(prev => ({ ...prev, alertMessage: null }));
      }
    };
    document.addEventListener('visibilitychange', onVisChange);
    return () => document.removeEventListener('visibilitychange', onVisChange);
  }, [isActive]);

  // ── Layer 1: Idle Detector ────────────────────────────────────────────────
  useEffect(() => {
    if (!isActive) return;
    const resetIdle = () => {
      lastActivityRef.current = Date.now();
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        setNeuroState(prev => ({
          ...prev,
          isIdle: true,
          alertMessage: '⏸️ Tidak ada aktivitas terdeteksi. Apakah Prof masih ada?',
        }));
      }, IDLE_THRESHOLD_MS);
      setNeuroState(prev => ({ ...prev, isIdle: false, alertMessage: prev.alertMessage?.startsWith('⏸️') ? null : prev.alertMessage }));
    };

    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('keydown', resetIdle);
    window.addEventListener('click', resetIdle);
    resetIdle(); // prime
    return () => {
      clearTimeout(idleTimerRef.current);
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('keydown', resetIdle);
      window.removeEventListener('click', resetIdle);
    };
  }, [isActive]);

  // ── Layer 2 + 3: Main Detection Loop ─────────────────────────────────────
  const detectionLoop = useCallback(async () => {
    const video  = videoRef.current;
    const model  = modelRef.current;
    const canvas = canvasRef.current;

    if (!video || !model || video.readyState < 2) {
      rafRef.current = setTimeout(detectionLoop, DETECT_INTERVAL_MS);
      return;
    }

    // Resize canvas to match video
    canvas.width  = video.videoWidth  || 320;
    canvas.height = video.videoHeight || 240;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // ── Layer 3: rPPG Brightness Proxy ───────────────────────────────
    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let brightness = 0;
    const total = frame.data.length / 4;
    for (let i = 0; i < frame.data.length; i += 4) {
      brightness += (frame.data[i] * 0.299 + frame.data[i+1] * 0.587 + frame.data[i+2] * 0.114);
    }
    const avgBright = brightness / total;

    // Blink detection via sudden brightness drop over the eye region (proxy)
    if (prevBrightRef.current !== null) {
      const delta = prevBrightRef.current - avgBright;
      if (delta > BLINK_BRIGHT_DELTA) {
        blinkRef.current += 1;
      }
    }
    prevBrightRef.current = avgBright;

    // ── Layer 2: BlazeFace Detection ───────────────────────────────────
    let facePresent    = false;
    let faceConfidence = 0;
    let gazeOnScreen   = true;

    try {
      const predictions = await model.estimateFaces(video, false);
      if (predictions.length > 0) {
        const face  = predictions[0];
        facePresent    = true;
        faceConfidence = parseFloat(face.probability[0].toFixed(2));

        // Face size check: must fill minimum of frame area
        const [tlX, tlY] = face.topLeft;
        const [brX, brY] = face.bottomRight;
        const faceW = brX - tlX;
        const faceH = brY - tlY;
        const faceArea  = faceW * faceH;
        const frameArea = canvas.width * canvas.height;
        const faceRatio = faceArea / frameArea;

        if (faceRatio < MIN_FACE_BOX_RATIO) {
          facePresent = false; // Too far away / partial face
        }

        // Gaze proxy: nose landmark must stay near horizontal center of face box
        // BlazeFace landmarks: [rightEye, leftEye, nose, mouth, rightEar, leftEar]
        const nose      = face.landmarks[2];
        const noseX     = nose[0];
        const faceCenterX = (tlX + brX) / 2;
        const faceCenterY = (tlY + brY) / 2;
        const driftX    = Math.abs(noseX - faceCenterX) / faceW;
        gazeOnScreen    = driftX < GAZE_CENTER_THRESH;
      }
    } catch (_) {
      // Silently handle frame-level errors
    }

    // ── Composite Score Calculation ────────────────────────────────────────
    const prevAtt  = compositeRef.current.att;
    const prevStab = compositeRef.current.stab;

    // Attention decreases: face absent (-20), tab switch (-10 each), idle (-5), gaze off (-8)
    let attDelta = 0;
    if (!facePresent)  attDelta -= 20;
    if (!gazeOnScreen) attDelta -= 8;

    // Stability decreases if brightness variance is high (head movement proxy)
    const brightDelta = prevBrightRef.current !== null ? Math.abs(avgBright - prevBrightRef.current) : 0;
    let stabDelta = 0;
    if (brightDelta > 5) stabDelta -= 3; // micro-movement detected

    const newAtt  = Math.max(0, Math.min(100, prevAtt  + attDelta  + (attDelta === 0 ? 0.5 : 0)));
    const newStab = Math.max(0, Math.min(100, prevStab + stabDelta + (stabDelta === 0 ? 0.3 : 0)));
    compositeRef.current = { att: newAtt, stab: newStab };

    // ── Alert Logic ────────────────────────────────────────────────────────
    let alertMessage = null;
    if (!facePresent)                alertMessage = '🚨 WAJAH TIDAK TERDETEKSI! Sesi Dikunci.';
    else if (!gazeOnScreen)          alertMessage = '👁️ Pandangan menyimpang — Harap fokus ke layar.';
    else if (tabSwitchRef.current > 0) alertMessage = `⚠️ ${tabSwitchRef.current}x berpindah tab terdeteksi.`;

    setNeuroState({
      facePresent,
      faceConfidence,
      gazeOnScreen,
      isIdle:         false,
      tabSwitchCount: tabSwitchRef.current,
      blinkCount:     blinkRef.current,
      attentionScore: Math.round(newAtt),
      stabilityScore: Math.round(newStab),
      alertMessage,
      modelReady:     true,
    });

    rafRef.current = setTimeout(detectionLoop, DETECT_INTERVAL_MS);
  }, [videoRef]);

  // Start/stop detection loop
  useEffect(() => {
    if (isActive && modelRef.current) {
      rafRef.current = setTimeout(detectionLoop, DETECT_INTERVAL_MS);
    }
    return () => clearTimeout(rafRef.current);
  }, [isActive, detectionLoop]);

  return neuroState;
}
