import React, { useState, useEffect, useRef } from 'react';

/**
 * CameraFlashTransition
 * Cinematic theme transition overlay that plays when switching from Cosmic -> Camera Red theme:
 * 1. Camera body & lens element materializes with focus lock sound
 * 2. Lens aperture blades contract & zoom
 * 3. Powerful realistic camera flash strobes (white/cyan to blazing crimson) with authentic electronic flash burst & capacitor recharge whine sound
 * 4. With the blinding flash dispersion, the Camera Red interface & environment reveal in dramatic fashion!
 */
export default function CameraFlashTransition({ active, onComplete, soundEnabled = true }) {
  const [stage, setStage] = useState('idle'); // 'idle' | 'materialize' | 'shutter' | 'flash' | 'dissolve'
  const hasPlayedAudio = useRef(false);

  // Synthesize realistic professional camera shutter click + Xenon flash pop + capacitor high-pitch recharge whine
  const playCameraFlashAudio = () => {
    if (!soundEnabled || hasPlayedAudio.current) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      hasPlayedAudio.current = true;

      const now = ctx.currentTime;

      // 1. Electronic AutoFocus Confirmation Beep (two crisp high chirps)
      const beep1 = ctx.createOscillator();
      const beepGain1 = ctx.createGain();
      beep1.type = 'sine';
      beep1.frequency.setValueAtTime(1400, now);
      beepGain1.gain.setValueAtTime(0.08, now);
      beepGain1.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      beep1.connect(beepGain1);
      beepGain1.connect(ctx.destination);
      beep1.start(now);
      beep1.stop(now + 0.06);

      const beep2 = ctx.createOscillator();
      const beepGain2 = ctx.createGain();
      beep2.type = 'sine';
      beep2.frequency.setValueAtTime(1750, now + 0.08);
      beepGain2.gain.setValueAtTime(0.09, now + 0.08);
      beepGain2.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      beep2.connect(beepGain2);
      beepGain2.connect(ctx.destination);
      beep2.start(now + 0.08);
      beep2.stop(now + 0.16);

      // 2. Mechanical Shutter Curtain Slap (at flash moment: ~450ms)
      const shutterTime = now + 0.45;
      const shutterOsc = ctx.createOscillator();
      const shutterGain = ctx.createGain();
      shutterOsc.type = 'triangle';
      shutterOsc.frequency.setValueAtTime(800, shutterTime);
      shutterOsc.frequency.exponentialRampToValueAtTime(80, shutterTime + 0.04);
      shutterGain.gain.setValueAtTime(0.22, shutterTime);
      shutterGain.gain.exponentialRampToValueAtTime(0.001, shutterTime + 0.05);
      shutterOsc.connect(shutterGain);
      shutterGain.connect(ctx.destination);
      shutterOsc.start(shutterTime);
      shutterOsc.stop(shutterTime + 0.05);

      // 3. High-Voltage Xenon Flash Pop & White Noise Shockwave (at 450ms)
      // Generates an explosive burst of filtered noise
      const bufferSize = ctx.sampleRate * 0.15; // 150ms buffer
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.02));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(1800, shutterTime);
      noiseFilter.Q.setValueAtTime(1.2, shutterTime);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.35, shutterTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, shutterTime + 0.12);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(shutterTime);

      // 4. Xenon Flash Capacitor Strobe Ring / High Recharge Whine (480ms -> 1200ms)
      const whineOsc = ctx.createOscillator();
      const whineGain = ctx.createGain();
      whineOsc.type = 'sine';
      whineOsc.frequency.setValueAtTime(2400, shutterTime + 0.08);
      whineOsc.frequency.exponentialRampToValueAtTime(9200, shutterTime + 0.65);

      whineGain.gain.setValueAtTime(0.001, shutterTime + 0.08);
      whineGain.gain.linearRampToValueAtTime(0.06, shutterTime + 0.22);
      whineGain.gain.exponentialRampToValueAtTime(0.0001, shutterTime + 0.65);

      whineOsc.connect(whineGain);
      whineGain.connect(ctx.destination);
      whineOsc.start(shutterTime + 0.08);
      whineOsc.stop(shutterTime + 0.65);
    } catch (_) {}
  };

  useEffect(() => {
    if (!active) {
      setStage('idle');
      hasPlayedAudio.current = false;
      return;
    }

    // Begin sequence
    setStage('materialize');
    playCameraFlashAudio();

    // Shutter contraction at 380ms
    const timer1 = setTimeout(() => {
      setStage('shutter');
    }, 380);

    // Blinding Flash bursts at 450ms
    const timer2 = setTimeout(() => {
      setStage('flash');
    }, 450);

    // Dissolve into Camera Theme at 750ms
    const timer3 = setTimeout(() => {
      setStage('dissolve');
    }, 750);

    // Complete and remove overlay at 1150ms
    const timer4 = setTimeout(() => {
      setStage('idle');
      if (onComplete) onComplete();
    }, 1150);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [active]);

  if (!active && stage === 'idle') return null;

  return (
    <div
      className={`camera-flash-overlay stage-${stage}`}
      aria-hidden="true"
    >
      {/* Blinding Fullscreen Xenon Flash Light Strobe */}
      <div className="flash-strobe-layer" />

      {/* Optical Light Rays / Anamorphic Flare */}
      <div className="flash-anamorphic-flare" />

      {/* Central Camera Rig Materialization Container */}
      <div className="camera-rig-container">
        {/* Outer Viewfinder Telemetry Frame */}
        <div className="camera-rig-hud">
          <div className="hud-corner top-left" />
          <div className="hud-corner top-right" />
          <div className="hud-corner bottom-left" />
          <div className="hud-corner bottom-right" />
          <div className="hud-rec-tag">
            <span className="hud-rec-dot" />
            <span>OPTICAL SHUTTER ENGAGED</span>
          </div>
          <div className="hud-lens-tag">VIVO X300 • f/1.4</div>
        </div>

        {/* The Camera Body & Lens */}
        <div className="camera-illustration">
          {/* Flash Unit on top */}
          <div className="camera-flash-unit">
            <div className="flash-bulb" />
            <div className="flash-beam-burst" />
          </div>

          {/* Pentaprism Viewfinder Top */}
          <div className="camera-pentaprism">
            <span className="prism-logo">X300</span>
          </div>

          {/* Main Camera Chassis */}
          <div className="camera-body-chassis">
            <div className="chassis-texture" />
            <div className="red-accent-line" />
            <div className="grip-mount" />

            {/* Lens Barrel */}
            <div className="camera-lens-barrel">
              {/* Outer knurled focus ring */}
              <div className="lens-focus-ring" />
              {/* Aperture ring markings */}
              <div className="lens-aperture-markings">
                <span>1.4</span>
                <span>2.0</span>
                <span>2.8</span>
                <span>4.0</span>
                <span>5.6</span>
                <span>8.0</span>
              </div>

              {/* Front Glass Optical Element */}
              <div className="lens-front-glass">
                {/* Iris Aperture Blades (contrasting / spinning on shutter) */}
                <div className="lens-iris-aperture">
                  <div className="aperture-blade b1" />
                  <div className="aperture-blade b2" />
                  <div className="aperture-blade b3" />
                  <div className="aperture-blade b4" />
                  <div className="aperture-blade b5" />
                  <div className="aperture-blade b6" />
                </div>

                {/* Violet / Crimson Anti-Reflective Optical Coating Reflection */}
                <div className="lens-optical-glare" />
                <div className="lens-core-strobe" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
