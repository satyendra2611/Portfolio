import React, { useState, useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';

export default function BigBangIntro({ onComplete, soundEnabled }) {
  const [phase, setPhase] = useState('singularity'); // 'singularity' | 'detonation' | 'expansion' | 'settle'
  const [particleSparks, setParticleSparks] = useState([]);
  const hasTriggeredAudio = useRef(false);
  const elementsRef = useRef([]);

  // Synthesize cosmic Big Bang ignition & expansion sound
  const playCosmicBigBangSound = () => {
    if (!soundEnabled || hasTriggeredAudio.current) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      hasTriggeredAudio.current = true;

      // 1. Deep sub-bass cosmic rumble (Singularity detonation)
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(45, ctx.currentTime);
      subOsc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.35);
      subOsc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 1.2);

      subGain.gain.setValueAtTime(0.01, ctx.currentTime);
      subGain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.08);
      subGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start();
      subOsc.stop(ctx.currentTime + 1.2);

      // 2. High cosmic shimmer (Photons bursting out)
      setTimeout(() => {
        try {
          const highOsc = ctx.createOscillator();
          const highGain = ctx.createGain();
          highOsc.type = 'triangle';
          highOsc.frequency.setValueAtTime(480, ctx.currentTime);
          highOsc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.4);

          highGain.gain.setValueAtTime(0.12, ctx.currentTime);
          highGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

          highOsc.connect(highGain);
          highGain.connect(ctx.destination);
          highOsc.start();
          highOsc.stop(ctx.currentTime + 0.6);
        } catch (_) {}
      }, 180);
    } catch (_) {}
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';

    // Generate 36 radial particle sparks
    const sparks = Array.from({ length: 36 }, (_, i) => {
      const angle = (i / 36) * Math.PI * 2 + (Math.random() - 0.5) * 0.15;
      const dist = 160 + Math.random() * 280;
      const size = 2 + Math.random() * 3.5;
      const delay = Math.random() * 0.12;
      return {
        id: i,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        size,
        delay,
        color: i % 3 === 0 ? '#ffffff' : i % 3 === 1 ? '#fed7aa' : '#67e8f9'
      };
    });
    setParticleSparks(sparks);

    const universeEl = document.getElementById('collapsible-universe');
    if (universeEl) {
      universeEl.classList.add('big-bang-universe-active');
    }

    // Collect all blocks and text elements in the viewport
    // Every single element will be pulled into the singularity point (50vw, 50vh)
    const winW = window.innerWidth || 1200;
    const winH = window.innerHeight || 800;
    const centerX = winW * 0.5;
    const centerY = winH * 0.5;

    const selectors = [
      // Header brand & items
      '.site-header .brand-link',
      '.site-header .nav-link',
      '.site-header .sound-toggle-btn',
      '.site-header .header-cta',
      '.site-header .mobile-menu-toggle',
      // Hero elements
      '.hero .eyebrow-pill',
      '.hero .hero-title',
      '.hero .lead',
      '.stats-row .stat-card',
      '.hero-actions .button',
      '.hero-scroll-btn',
      // Visual photo tiles & lens rings
      '.hero-visual .photo-tile',
      '.hero-visual .lens-ring'
    ];

    const capturedElements = [];
    selectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
        if (!capturedElements.includes(el)) {
          capturedElements.push(el);
        }
      });
    });

    // Compute exact physical displacement vector (dx, dy) for each element
    const items = [];
    capturedElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return;

      const elCenterX = rect.left + rect.width * 0.5;
      const elCenterY = rect.top + rect.height * 0.5;

      // Vector from natural position to Singularity center (50vw, 50vh)
      const dx = centerX - elCenterX;
      const dy = centerY - elCenterY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const spin = (Math.random() - 0.5) * 18; // slight initial rotation

      // Apply initial singularity state: Physically located at (50vw, 50vh), scale 0.02
      el.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(0.02) rotate(${spin}deg)`;
      el.style.opacity = '0';
      el.style.filter = 'blur(10px) brightness(3)';
      el.style.pointerEvents = 'none';
      el.style.willChange = 'transform, opacity, filter';
      el.style.zIndex = '10001';

      items.push({ el, dx, dy, dist, spin });
    });

    elementsRef.current = items;

    // Timeline:
    // 0ms - 550ms: Singularity Point pulses at center (all blocks compressed inside)
    // 550ms: Big Bang Detonation & Explosion Flash
    // 550ms - 1800ms: Cosmic Inflation - All blocks and texts physically shoot outward from center
    // 1800ms - 2100ms: Settle & cleanup
    const t1 = setTimeout(() => {
      playCosmicBigBangSound();
      setPhase('detonation');

      // Launch every block and text out from the Big Bang singularity!
      const allItems = elementsRef.current;
      const maxDim = Math.max(winW, winH);

      allItems.forEach(({ el, dist }, idx) => {
        // Staggered cosmic wave: elements closer to center begin first, followed by outer elements
        const waveDelay = Math.min(0.24, (dist / maxDim) * 0.18 + (idx % 3) * 0.02);

        el.style.transition = `transform 1.35s cubic-bezier(0.16, 1, 0.3, 1) ${waveDelay}s, opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) ${waveDelay}s, filter 1.05s ease-out ${waveDelay}s`;
        el.style.transform = 'translate3d(0, 0, 0) scale(1) rotate(0deg)';
        el.style.opacity = '1';
        el.style.filter = 'blur(0px) brightness(1)';
      });
    }, 550);

    const t2 = setTimeout(() => {
      setPhase('expansion');
    }, 850);

    const t3 = setTimeout(() => {
      setPhase('settle');
    }, 1500);

    const t4 = setTimeout(() => {
      cleanup();
    }, 2100);

    const cleanup = () => {
      document.body.style.overflow = '';
      if (universeEl) {
        universeEl.classList.remove('big-bang-universe-active');
      }

      // Pristine cleanup of all inline styles
      elementsRef.current.forEach(({ el }) => {
        el.style.transform = '';
        el.style.opacity = '';
        el.style.filter = '';
        el.style.transition = '';
        el.style.pointerEvents = '';
        el.style.willChange = '';
        el.style.zIndex = '';
      });

      if (onComplete) onComplete();
    };

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      document.body.style.overflow = '';
      if (universeEl) {
        universeEl.classList.remove('big-bang-universe-active');
      }
      elementsRef.current.forEach(({ el }) => {
        el.style.transform = '';
        el.style.opacity = '';
        el.style.filter = '';
        el.style.transition = '';
        el.style.pointerEvents = '';
        el.style.willChange = '';
        el.style.zIndex = '';
      });
    };
  }, []);

  const handleSkip = () => {
    document.body.style.overflow = '';
    const universeEl = document.getElementById('collapsible-universe');
    if (universeEl) {
      universeEl.classList.remove('big-bang-universe-active');
    }
    elementsRef.current.forEach(({ el }) => {
      el.style.transform = '';
      el.style.opacity = '';
      el.style.filter = '';
      el.style.transition = '';
      el.style.pointerEvents = '';
      el.style.willChange = '';
      el.style.zIndex = '';
    });
    if (onComplete) onComplete();
  };

  return (
    <div
      className={`big-bang-overlay phase-${phase}`}
      onClick={handleSkip}
      role="banner"
      aria-label="Cosmic Big Bang Origin Animation"
    >
      {/* 1. Primordial Singularity (Infinitely Dense Point of Matter) */}
      <div className="primordial-singularity-wrapper">
        <div className="singularity-dense-core" />
        <div className="singularity-glow-halo" />
        <div className="singularity-pulse-ring" />
      </div>

      {/* 2. Radiant Detonation Flash & Shockwaves */}
      {phase !== 'singularity' && (
        <>
          <div className="cosmic-explosion-flash" />
          <div className="cosmic-shockwave-ring ring-1" />
          <div className="cosmic-shockwave-ring ring-2" />

          {/* 3. Radial Particle Sparks expanding outward */}
          <div className="cosmic-sparks-container">
            {particleSparks.map((spark) => (
              <div
                key={spark.id}
                className="cosmic-spark"
                style={{
                  '--spark-x': `${spark.x}px`,
                  '--spark-y': `${spark.y}px`,
                  '--spark-size': `${spark.size}px`,
                  '--spark-color': spark.color,
                  '--spark-delay': `${spark.delay}s`
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* 4. Cosmic Origin Telemetry Badge */}
      <div className="big-bang-telemetry">
        <span className="telemetry-sparkle-dot" />
        <span className="telemetry-label">
          {phase === 'singularity'
            ? 'T = 0.00s // PRIMORDIAL SINGULARITY DENSITY'
            : phase === 'detonation'
            ? 'T + 10⁻³²s // THE BIG BANG DETONATION'
            : 'COSMIC INFLATION • UNIVERSE ALIGNING'}
        </span>
      </div>

      {/* Skip hint */}
      <button className="big-bang-skip-hint" onClick={handleSkip} aria-label="Skip animation">
        <span>Click anywhere to skip</span>
      </button>
    </div>
  );
}
