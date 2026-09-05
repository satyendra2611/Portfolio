import React, { useState, useEffect, useRef } from 'react';

/**
 * CameraClickBurst
 * Spawns an animated micro-flash strobe, expanding 6-blade iris aperture ring,
 * and realistic mechanical leaf shutter audio click on mouse clicks when in Camera Red theme.
 */
export default function CameraClickBurst({ theme, soundEnabled }) {
  const [bursts, setBursts] = useState([]);
  const burstIdRef = useRef(0);

  const playClickShutterSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Mechanical high-speed shutter curtain slap
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1100, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.035);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.035);

      // Micro electronic sensor exposure beep
      setTimeout(() => {
        try {
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(1900, ctx.currentTime);
          osc2.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.025);

          gain2.gain.setValueAtTime(0.06, ctx.currentTime);
          gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.025);

          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.start();
          osc2.stop(ctx.currentTime + 0.025);
        } catch (_) {}
      }, 25);
    } catch (_) {}
  };

  useEffect(() => {
    if (theme !== 'camera-red') return;

    const handleClick = (e) => {
      // Don't trigger if clicked on an input or textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      playClickShutterSound();

      const newBurst = {
        id: ++burstIdRef.current,
        x: e.clientX,
        y: e.clientY
      };

      setBursts((prev) => [...prev.slice(-6), newBurst]);

      setTimeout(() => {
        setBursts((prev) => prev.filter((b) => b.id !== newBurst.id));
      }, 650);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [theme, soundEnabled]);

  if (theme !== 'camera-red' || bursts.length === 0) return null;

  return (
    <div className="camera-click-burst-layer" aria-hidden="true">
      {bursts.map((b) => (
        <div
          key={b.id}
          className="camera-click-burst-instance"
          style={{ left: `${b.x}px`, top: `${b.y}px` }}
        >
          {/* Central Strobe Flash Core */}
          <div className="burst-flash-core" />

          {/* Expanding Anamorphic Crosshair Flare */}
          <div className="burst-anamorphic-flare" />

          {/* Expanding 6-blade Aperture Reticle */}
          <div className="burst-aperture-ring">
            <div className="burst-blade b1" />
            <div className="burst-blade b2" />
            <div className="burst-blade b3" />
            <div className="burst-blade b4" />
            <div className="burst-blade b5" />
            <div className="burst-blade b6" />
          </div>

          {/* HUD Capture Badge */}
          <div className="burst-hud-tag">
            <span>[ SNAP 1/8000s ]</span>
          </div>
        </div>
      ))}
    </div>
  );
}
