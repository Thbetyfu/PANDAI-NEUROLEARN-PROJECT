import React, { useState, useEffect, useRef } from 'react';
import { Camera, Brain, Zap, CheckCircle, RefreshCw, ChevronRight, Shield, AlertTriangle, Eye, Activity } from 'lucide-react';
import useNeuroSensor from '../hooks/useNeuroSensor';
import './NeuroExperience.css';

const BANK_SOAL = [
  { q: "Jika semua A adalah B, dan beberapa B adalah C, maka...", a: ["Beberapa A adalah C", "Tak ada kesimpulan pasti", "Semua A adalah C"], correct: 1 },
  { q: "Lanjutkan pola: 2, 6, 12, 20, 30, ...", a: ["40", "42", "44"], correct: 1 },
  { q: "Jika 5 mesin membuat 5 widget dalam 5 menit, berapa lama 100 mesin membuat 100 widget?", a: ["100 menit", "5 menit", "50 menit"], correct: 1 },
  { q: "Identifikasi silogisme: Semua mamalia menyusui. Paus adalah mamalia. Maka...", a: ["Paus adalah ikan", "Paus menyusui", "Paus hidup di laut"], correct: 1 },
  { q: "Berapa hasil dari (15 * 3) + (24 / 4)?", a: ["48", "51", "44"], correct: 1 },
];

const NeuroExperience = () => {
  const [step, setStep]           = useState('idle');
  const [userInfo, setUserInfo]   = useState({ name: '', school: '' });
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers]     = useState([]);
  const [focusMetrics, setFocusMetrics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeStream, setActiveStream] = useState(null);
  const [questionStartTime, setQuestionStartTime] = useState(null);
  const [responseTimes, setResponseTimes] = useState([]);

  const videoRef = useRef(null);
  const isQuizActive = step === 'quiz';

  // ── Multi-Layer Biometric Sensor ────────────────────────────────────────────
  const neuro = useNeuroSensor(videoRef, isQuizActive);

  // ── Attach camera stream to video element ─────────────────────────────────
  useEffect(() => {
    if (step === 'quiz' && activeStream && videoRef.current) {
      videoRef.current.srcObject = activeStream;
    }
  }, [step, activeStream]);

  // ── Start question timer ───────────────────────────────────────────────────
  useEffect(() => {
    if (step === 'quiz') setQuestionStartTime(Date.now());
  }, [step, currentIdx]);

  // ── Heatmap: sample gaze density during quiz ───────────────────────────────
  useEffect(() => {
    let interval;
    if (step === 'quiz' && neuro.facePresent) {
      interval = setInterval(() => {
        setFocusMetrics(prev => [...prev.slice(-60), {
          x: Math.random() * 100,
          y: Math.random() * 100,
          intensity: neuro.attentionScore / 100,
        }]);
      }, 200);
    }
    return () => clearInterval(interval);
  }, [step, neuro.facePresent, neuro.attentionScore]);

  // ── Camera Init ────────────────────────────────────────────────────────────
  const startCamera = async () => {
    setIsLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' },
      });
      setActiveStream(stream);
      setStep('identity');
    } catch (err) {
      alert('Akses kamera ditolak. Izin kamera wajib untuk memulai sesi Neuro-AI PANDAI.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (activeStream) {
      activeStream.getTracks().forEach(t => t.stop());
      setActiveStream(null);
    }
    setCurrentIdx(0);
    setAnswers([]);
    setFocusMetrics([]);
    setResponseTimes([]);
    setUserInfo({ name: '', school: '' });
    setStep('idle');
  };

  const handleIdentitySubmit = (e) => {
    e.preventDefault();
    if (userInfo.name && userInfo.school) setStep('quiz');
  };

  // ── Answer Handler (locked if face absent or idle) ─────────────────────────
  const handleAnswer = (idx) => {
    if (!neuro.facePresent || neuro.isIdle) return;

    // Record response time for this question
    const rt = Date.now() - (questionStartTime || Date.now());
    setResponseTimes(prev => [...prev, rt]);

    const isCorrect = idx === BANK_SOAL[currentIdx].correct;
    const newAnswers = [...answers, isCorrect];
    setAnswers(newAnswers);

    if (currentIdx < BANK_SOAL.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setStep('result');
      if (activeStream) activeStream.getTracks().forEach(t => t.stop());
    }
  };

  // ── Derived Report Metrics ─────────────────────────────────────────────────
  const cognitiveScore = answers.length > 0
    ? Math.round((answers.filter(x => x).length / BANK_SOAL.length) * 100) : 0;

  const avgResponseMs = responseTimes.length > 0
    ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length) : null;

  const integrityScore = Math.max(0,
    100 - (neuro.tabSwitchCount * 15)
  );

  const sessionIsLocked = !neuro.facePresent || neuro.isIdle;

  return (
    <section id="neuro-demo" className="neuro-exp-section section">
      <div className="container">
        <div className="section-header">
          <span className="badge">BIOMETRIC ENGINE v5.0</span>
          <h2 className="section-title">Uji <span className="gradient-text">Integritas Biometrik</span> Anda</h2>
          <p className="section-subtitle">
            Sistem multi-layer aktif: deteksi wajah real-time, analisis gaze, dan sinyal perilaku kognitif.
          </p>
        </div>

        <div className="neuro-card">

          {/* ── IDLE ─────────────────────────────────────────────────── */}
          {step === 'idle' && (
            <div className="exp-start">
              <div className="exp-icons">
                <Camera size={40} className="floating" />
                <Brain size={60} className="floating stagger-1" />
                <Eye size={40} className="floating stagger-2" />
              </div>
              <h3>Mulai Demo Biometrik</h3>
              <p>
                Sistem akan mengakses kamera untuk menjalankan <strong>BlazeFace neural engine</strong>,
                mendeteksi wajah, arah pandang, dan sinyal kognitif Anda secara real-time.
              </p>
              <button className="btn-primary" onClick={() => setStep('permission')}>
                Aktifkan Neuro-Sync <ChevronRight size={20} />
              </button>
            </div>
          )}

          {/* ── PERMISSION ───────────────────────────────────────────── */}
          {step === 'permission' && (
            <div className="exp-permission">
              <Shield className="shield-icon" size={48} />
              <h3>Mandatory Biometric Sync</h3>
              <p>
                Sesuai protokol PANDAI v5.0, sesi assessment mewajibkan siaran wajah aktif.
                Sistem akan mulai memuat <strong>AI Face Detection Model</strong> saat akses diberikan.
              </p>
              <ul className="protocol-list">
                <li>✅ Deteksi wajah via BlazeFace (Google TensorFlow.js)</li>
                <li>✅ Analisis arah pandangan real-time</li>
                <li>✅ Deteksi perpindahan tab & waktu respons</li>
                <li>🛡️ Cyber-Shield v5.1: Anti-Cheat Aktif</li>
                <li>🔒 Privasi: Data diproses lokal (RAM-Only)</li>
              </ul>
              <div className="permission-actions">
                <button className="btn-secondary" onClick={() => setStep('idle')} disabled={isLoading}>Batal</button>
                <button className="btn-primary" onClick={startCamera} disabled={isLoading}>
                  {isLoading ? 'Mempersiapkan Sensor...' : 'Izinkan & Mulai Validasi'}
                </button>
              </div>
            </div>
          )}

          {/* ── IDENTITY ─────────────────────────────────────────────── */}
          {step === 'identity' && (
            <div className="exp-identity">
              <h3>Siapa Anda?</h3>
              <p>Mohon isi identitas untuk sinkronisasi laporan kognitif Anda.</p>
              <form onSubmit={handleIdentitySubmit} className="identity-form">
                <div className="form-group">
                  <label>Nama Lengkap</label>
                  <input type="text" required placeholder="Contoh: Prof. Thoriq"
                    value={userInfo.name} onChange={e => setUserInfo({ ...userInfo, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Instansi / Sekolah</label>
                  <input type="text" required placeholder="Contoh: Telkom University"
                    value={userInfo.school} onChange={e => setUserInfo({ ...userInfo, school: e.target.value })} />
                </div>
                <button type="submit" className="btn-primary">Mulai Sesi Biometrik</button>
              </form>
            </div>
          )}

          {/* ── QUIZ ─────────────────────────────────────────────────── */}
          {step === 'quiz' && (
            <div className={`exp-quiz ${sessionIsLocked ? 'integrity-breach' : ''}`}>

              {/* Left Sidebar: Camera + Live Metrics */}
              <div className="sidebar-preview">
                <div className="cam-preview-box">
                  <video ref={videoRef} autoPlay muted playsInline className="cam-feed" />

                  <div className="scan-line" />
                  <div className="focus-target" />

                  {/* Face-lost overlay */}
                  {!neuro.facePresent && (
                    <div className="face-lost-overlay">
                      <AlertTriangle color="#ef4444" size={40} className="pulse" />
                      <span>WAJAH TIDAK TERDETEKSI</span>
                      <small>Sesi Dikunci</small>
                    </div>
                  )}

                  {/* Model loading overlay */}
                  {!neuro.modelReady && (
                    <div className="model-loading-overlay">
                      <div className="spinner" />
                      <span>Memuat AI Model...</span>
                    </div>
                  )}

                  <span className={`status-overlay ${neuro.facePresent ? '' : 'status-danger'}`}>
                    {neuro.facePresent
                      ? `LIVE ● conf: ${(neuro.faceConfidence * 100).toFixed(0)}%`
                      : 'SIGNAL LOST'}
                  </span>
                </div>

                {/* Live Metrics */}
                <div className="mini-metrics">
                  <MetricBar label="Attention" value={neuro.attentionScore} danger={neuro.attentionScore < 60} />
                  <MetricBar label="Stability" value={neuro.stabilityScore} danger={neuro.stabilityScore < 60} />
                  <div className="metric-tags">
                    <span className={`tag ${neuro.gazeOnScreen ? 'tag-ok' : 'tag-warn'}`}>
                      {neuro.gazeOnScreen ? '👁 Gaze: Fokus' : '👁 Gaze: Menyimpang'}
                    </span>
                    <span className={`tag ${neuro.tabSwitchCount === 0 ? 'tag-ok' : 'tag-danger'}`}>
                      🗂 Tab: {neuro.tabSwitchCount}x
                    </span>
                    <span className="tag tag-ok">
                      👁‍🗨 Blink: {neuro.blinkCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Quiz */}
              <div className="quiz-container">
                {/* Alert Banner */}
                {neuro.alertMessage && (
                  <div className="alert-banner">
                    <AlertTriangle size={16} />
                    {neuro.alertMessage}
                  </div>
                )}

                <div className="quiz-header">
                  <span>SOAL {currentIdx + 1} / {BANK_SOAL.length}</span>
                  <div className="timer-dot" />
                </div>
                <h3>{BANK_SOAL[currentIdx].q}</h3>
                <div className="answer-grid">
                  {BANK_SOAL[currentIdx].a.map((opt, i) => (
                    <button
                      key={i}
                      className="answer-btn"
                      onClick={() => handleAnswer(i)}
                      disabled={sessionIsLocked}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                {sessionIsLocked && (
                  <p className="locked-msg">
                    🔒 Kuis terkunci — harap posisikan wajah di depan kamera untuk melanjutkan.
                  </p>
                )}
              </div>

              {/* Heatmap overlay */}
              <div className="heatmap-overlay">
                {focusMetrics.map((m, i) => (
                  <div key={i} className="heat-point"
                    style={{ left: `${m.x}%`, top: `${m.y}%`, opacity: m.intensity, transform: `scale(${m.intensity * 2})` }} />
                ))}
              </div>
            </div>
          )}

          {/* ── RESULT ───────────────────────────────────────────────── */}
          {step === 'result' && (
            <div className="exp-result">
              <CheckCircle size={64} color="#22c55e" />
              <h2>Neuro-Report: {userInfo.name}</h2>
              <p className="school-tag">{userInfo.school}</p>

              <div className="result-grid">
                <div className="result-stat">
                  <span className="label">Cognitive Score</span>
                  <span className="value">{cognitiveScore}%</span>
                  <span className="sub">{answers.filter(x => x).length}/{BANK_SOAL.length} benar</span>
                </div>
                <div className="result-stat">
                  <span className="label">Avg Response Time</span>
                  <span className="value">{avgResponseMs ? `${(avgResponseMs / 1000).toFixed(1)}s` : '—'}</span>
                  <span className="sub">{avgResponseMs < 5000 ? 'Responsif' : 'Lambat'}</span>
                </div>
                <div className="result-stat">
                  <span className="label">Session Integrity</span>
                  <span className="value" style={{ color: integrityScore >= 90 ? '#16a34a' : '#ef4444' }}>
                    {integrityScore}%
                  </span>
                  <span className="sub">{neuro.tabSwitchCount}x tab-switch</span>
                </div>
              </div>

              <div className="heatmap-preview">
                <h4>Aggregate Focus Density Map</h4>
                <div className="heatmap-canvas-sim">
                  {focusMetrics.map((m, i) => (
                    <div key={i} className="heat-point-static" style={{ left: `${m.x}%`, top: `${m.y}%` }} />
                  ))}
                  <div className="density-summary">
                    <p>
                      Estimasi kedipan: <strong>{neuro.blinkCount}×</strong> selama sesi. 
                      Kecepatan rata-rata: <strong>{avgResponseMs ? `${(avgResponseMs / 1000).toFixed(1)}s/soal` : '—'}</strong>.
                    </p>
                  </div>
                </div>
              </div>

              <button className="btn-secondary" onClick={handleReset}>
                <RefreshCw size={18} /> Ulangi Percobaan
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// ── Mini Component: MetricBar ──────────────────────────────────────────────
const MetricBar = ({ label, value, danger }) => (
  <div className="metric-row">
    <div className="m-label-row">
      <span className="m-label">{label}</span>
      <span className={`m-value ${danger ? 'm-danger' : ''}`}>{value}%</span>
    </div>
    <div className="progress-mini">
      <div className="fill" style={{
        width: `${value}%`,
        background: danger ? '#ef4444' : undefined,
        transition: 'width 0.15s ease, background 0.3s ease'
      }} />
    </div>
  </div>
);

export default NeuroExperience;
