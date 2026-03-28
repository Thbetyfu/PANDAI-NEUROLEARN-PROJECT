import React, { useState, useEffect } from 'react';
import { Activity, Zap, Brain, Radio } from 'lucide-react';
import './NeuralStatusBar.css';

const NeuralStatusBar = () => {
  const [focusLevel, setFocusLevel] = useState(88);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    // Simulasi inisialisasi sinkronisasi
    const timer = setTimeout(() => setSynced(true), 2400);

    // Simulasi fluktuasi fokus saraf secara real-time
    const interval = setInterval(() => {
      setFocusLevel(prev => {
        const change = (Math.random() * 4 - 2).toFixed(1);
        const next = parseFloat(prev) + parseFloat(change);
        return Math.min(Math.max(next, 85), 98).toFixed(1);
      });
    }, 1500);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={`neural-status-bar ${synced ? 'synced' : ''}`}>
      <div className="neural-container">
        <div className="neural-left">
          <div className="status-indicator">
            <div className={`status-dot ${synced ? 'active' : 'connecting'}`} />
            <span>{synced ? 'NEURAL SYNC: ACTIVE' : 'INITIALIZING BIOMETRIC...'}</span>
          </div>
          <div className="wave-container">
            <div className="neural-wave wave-1" />
            <div className="neural-wave wave-2" />
            <div className="neural-wave wave-3" />
          </div>
        </div>

        <div className="neural-center">
          <div className="metric-item">
            <Brain size={14} className="metric-icon" />
            <span className="metric-label">Focus Affinity</span>
            <span className="metric-value">{focusLevel}%</span>
            <div className="focus-progress-bg">
              <div className="focus-progress-fill" style={{ width: `${focusLevel}%` }} />
            </div>
          </div>
        </div>

        <div className="neural-right">
          <div className="tag-item">
            <Activity size={14} />
            <span>Optimal State</span>
          </div>
          <div className="tag-item secondary">
            <Radio size={14} />
            <span>v4.0 Symbiotic</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeuralStatusBar;
