import React, { useState } from 'react';
import { Smartphone, Headphones, Volume2, VolumeX, Radio, Activity, Zap, Sparkles, ChevronUp, ChevronDown, Music } from 'lucide-react';
import { VIVO_X300_BASE64 } from '../assets/vivoX300Base64';

export default function VivoX300AudioWidget({
  theme,
  soundEnabled,
  isAmbientPlaying = false,
  ambientMuted = false,
  onToggleAmbientMute = () => {}
}) {
  const [expanded, setExpanded] = useState(false);
  const [bassMode, setBassMode] = useState('jbl-punch'); // 'jbl-punch' | 'spatial-wide' | 'lossless-direct'

  if (theme !== 'hifi-studio') return null;

  const triggerAcousticPulse = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(65, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.12);
      osc.frequency.exponentialRampToValueAtTime(384, ctx.currentTime + 0.28);

      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      // AudioContext fallback
    }
  };

  return (
    <aside
      className={`vivo-x300-audio-dock ${expanded ? 'expanded' : 'collapsed'}`}
      aria-label="Vivo X300 Hi-Fi Audio Controller"
    >
      {/* Collapsed Pill Button */}
      <button
        type="button"
        className="vivo-dock-trigger-btn"
        onClick={() => {
          setExpanded(!expanded);
          triggerAcousticPulse();
        }}
        title="Vivo X300 Flagship Hi-Fi Audio Dock"
      >
        <div className="vivo-dock-pulse-dot" />
        <Smartphone className="vivo-dock-icon phone" size={16} />
        <span className="vivo-dock-label">VIVO X300 // 384kHz DAC</span>
        <span className="vivo-dock-badge">HI-RES</span>
        {isAmbientPlaying && !ambientMuted && (
          <span className="vivo-dock-music-tag" title="Continuous Ambient Music Playing">
            <Music size={10} className="music-pulse-icon" /> BGM
          </span>
        )}
        {expanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
      </button>

      {/* Expanded Cyber Studio Modal / Card */}
      {expanded && (
        <div className="vivo-dock-card">
          <div className="vivo-dock-header">
            <div className="vivo-dock-title-group">
              <span className="vivo-dock-flagship-tag">FLAGSHIP PHONE</span>
              <h4 className="vivo-dock-title">VIVO X300 5G</h4>
              <p className="vivo-dock-subtitle">Super Audio • 32-Bit / 384kHz Lossless DAC</p>
            </div>
            <div className="vivo-dock-gear-badges">
              <span className="gear-tag jbl">JBL CLUB</span>
              <span className="gear-tag oneplus">ONEPLUS ANC</span>
            </div>
          </div>

          {/* Vivo X300 Flagship Image Display (Converted to Base64) */}
          <div className="vivo-dock-image-container" onClick={triggerAcousticPulse}>
            <img
              src={VIVO_X300_BASE64}
              alt="Vivo X300 Flagship Phone Hi-Fi Audio"
              className="vivo-dock-phone-img"
              loading="lazy"
            />
            <div className="vivo-dock-hologram-scanline" />
            <div className="vivo-dock-spec-overlay">
              <span className="spec-pill"><Activity size={10} /> 32-BIT 384kHz</span>
              <span className="spec-pill"><Radio size={10} /> LHDC 5.0</span>
              <span className="spec-pill"><Zap size={10} /> -48dB ANC</span>
            </div>
          </div>

          {/* Audio Profile Selector */}
          <div className="vivo-dock-modes">
            <span className="vivo-dock-modes-label">TUNING PROFILE:</span>
            <div className="vivo-dock-modes-grid">
              <button
                type="button"
                className={`vivo-mode-btn ${bassMode === 'jbl-punch' ? 'active' : ''}`}
                onClick={() => { setBassMode('jbl-punch'); triggerAcousticPulse(); }}
              >
                <Volume2 size={12} />
                <span>JBL Bass Thump</span>
              </button>
              <button
                type="button"
                className={`vivo-mode-btn ${bassMode === 'spatial-wide' ? 'active' : ''}`}
                onClick={() => { setBassMode('spatial-wide'); triggerAcousticPulse(); }}
              >
                <Sparkles size={12} />
                <span>OnePlus 3D Spatial</span>
              </button>
              <button
                type="button"
                className={`vivo-mode-btn ${bassMode === 'lossless-direct' ? 'active' : ''}`}
                onClick={() => { setBassMode('lossless-direct'); triggerAcousticPulse(); }}
              >
                <Headphones size={12} />
                <span>Vivo Direct DAC</span>
              </button>
            </div>
          </div>

          {/* Continuous Ambient Hi-Fi Loop Player Bar (Base64 Encoded Audio) */}
          <div className="vivo-dock-ambient-bar">
            <div className="vivo-ambient-left">
              <div className={`vivo-ambient-disc ${isAmbientPlaying && !ambientMuted ? 'spinning' : ''}`}>
                <Music size={12} />
              </div>
              <div className="vivo-ambient-info">
                <span className="vivo-ambient-title">AMBIENT HI-FI BGM</span>
                <span className="vivo-ambient-status">
                  {ambientMuted
                    ? 'MUTED'
                    : isAmbientPlaying
                    ? 'LOOPING (LOW SOUND)'
                    : 'READY / AUTOPLAY'}
                </span>
              </div>
            </div>
            <button
              type="button"
              className={`vivo-ambient-btn ${ambientMuted ? 'muted' : 'active'}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleAmbientMute();
              }}
              title={ambientMuted ? 'Unmute Ambient Music' : 'Mute Ambient Music'}
            >
              {ambientMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
              <span>{ambientMuted ? 'OFF' : 'ON'}</span>
            </button>
          </div>

          {/* Live Frequency Level Meter */}
          <div className="vivo-dock-meter">
            <div className="vivo-meter-bars">
              {[42, 68, 85, 92, 74, 55, 88, 96, 62, 78, 90, 84, 70, 60, 92, 80].map((h, i) => (
                <span
                  key={i}
                  className="meter-bar"
                  style={{
                    height: `${h}%`,
                    animationDelay: `${i * 0.08}s`
                  }}
                />
              ))}
            </div>
            <div className="vivo-meter-readout">
              <span>LATENCY: 18ms</span>
              <span className="accent">BITRATE: 990kbps LHDC</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
