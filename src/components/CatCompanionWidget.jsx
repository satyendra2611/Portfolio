import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Cat, Heart, Fish, Zap, Moon, Sparkles, Volume2, VolumeX, ChevronDown, ChevronUp, Radio } from 'lucide-react';

/**
 * CatCompanionWidget
 * Interactive Virtual Neko / Cyber Cat Companion for the Cat Realm Theme.
 * Features:
 * - Animated SVG Cat with ear twitches, eye blinks, and wagging tail
 * - Dynamic Petting system with happiness meter & floating hearts
 * - Synthesized real cat purr engine & sweet meows via Web Audio API
 * - Fish treat feeding animation & sound
 * - Interactive Red Laser pointer chase mode
 * - Sleep / Nap mode with low soothing purrs
 */
export default function CatCompanionWidget({ theme, soundEnabled = true }) {
  const [expanded, setExpanded] = useState(false);
  const [happiness, setHappiness] = useState(70);
  const [catState, setCatState] = useState('idle'); // 'idle' | 'happy' | 'eating' | 'sleeping' | 'laser'
  const [laserActive, setLaserActive] = useState(false);
  const [laserPos, setLaserPos] = useState({ x: -100, y: -100 });
  const [hearts, setHearts] = useState([]);
  const [isPurring, setIsPurring] = useState(false);
  const [catEyeAngle, setCatEyeAngle] = useState({ x: 0, y: 0 });

  const catRef = useRef(null);
  const purrOscRef = useRef(null);
  const purrGainRef = useRef(null);
  const audioCtxRef = useRef(null);
  const heartIdRef = useRef(0);

  // Initialize or resume audio context
  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
    return audioCtxRef.current;
  }, []);

  // Cat meow & purr sounds removed per user request (silent interactions)
  const playMeowSound = useCallback(() => {}, []);
  const startPurrSound = useCallback(() => {}, []);
  const stopPurrSound = useCallback(() => {
    setIsPurring(false);
  }, []);

  // Bell chime
  const playBellChime = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2489, now); // D#7
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch (_) {}
  }, [soundEnabled, getAudioContext]);

  // Petting action
  const handlePet = useCallback(() => {
    if (catState === 'sleeping') {
      setCatState('idle');
      stopPurrSound();
    }
    setCatState('happy');
    setHappiness((prev) => Math.min(100, prev + 12));
    playMeowSound('happy');
    startPurrSound();

    // Spawn floating hearts
    const newHearts = Array.from({ length: 4 }, (_, i) => ({
      id: ++heartIdRef.current,
      x: 35 + Math.random() * 50,
      delay: i * 0.12
    }));
    setHearts((prev) => [...prev, ...newHearts]);

    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => !newHearts.some((nh) => nh.id === h.id)));
    }, 1400);

    setTimeout(() => {
      setCatState('idle');
      stopPurrSound();
    }, 2200);
  }, [catState, playMeowSound, startPurrSound, stopPurrSound]);

  // Feed treat action
  const handleFeedTreat = useCallback(() => {
    if (catState === 'eating') return;
    setCatState('eating');
    playBellChime();
    setTimeout(() => playMeowSound('high'), 350);
    setHappiness((prev) => Math.min(100, prev + 20));

    setTimeout(() => {
      setCatState('happy');
      setTimeout(() => setCatState('idle'), 1500);
    }, 1200);
  }, [catState, playBellChime, playMeowSound]);

  // Toggle sleep mode
  const handleToggleSleep = useCallback(() => {
    if (catState === 'sleeping') {
      setCatState('idle');
      stopPurrSound();
    } else {
      setCatState('sleeping');
      playMeowSound('low');
      startPurrSound();
    }
  }, [catState, playMeowSound, startPurrSound, stopPurrSound]);

  // Laser Pointer tracking
  useEffect(() => {
    if (theme !== 'cat-realm') return;

    const handleMouseMove = (e) => {
      if (laserActive) {
        setLaserPos({ x: e.clientX, y: e.clientY });
      }

      // Calculate angle from cat widget to mouse to angle cat eyes
      if (catRef.current) {
        const rect = catRef.current.getBoundingClientRect();
        const catCenterX = rect.left + rect.width / 2;
        const catCenterY = rect.top + rect.height / 2;
        const dx = e.clientX - catCenterX;
        const dy = e.clientY - catCenterY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxOffset = 3.5;
        if (dist > 0) {
          setCatEyeAngle({
            x: (dx / dist) * Math.min(maxOffset, dist / 40),
            y: (dy / dist) * Math.min(maxOffset, dist / 40)
          });
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [theme, laserActive]);

  // Clean up purr audio on unmount or theme change
  useEffect(() => {
    return () => {
      stopPurrSound();
    };
  }, [stopPurrSound]);

  if (theme !== 'cat-realm') return null;

  return (
    <>
      {/* Interactive Laser Dot when Laser Mode is enabled */}
      {laserActive && (
        <div
          className="cat-laser-pointer"
          style={{ left: `${laserPos.x}px`, top: `${laserPos.y}px` }}
          aria-hidden="true"
        >
          <div className="laser-core" />
          <div className="laser-aura" />
        </div>
      )}

      {/* Cat Companion Dock */}
      <aside
        ref={catRef}
        className={`cat-companion-dock ${expanded ? 'expanded' : 'collapsed'}`}
        aria-label="Virtual Neko Cat Companion"
      >
        {/* Collapsed Pill Button */}
        <button
          type="button"
          className="cat-dock-trigger-btn"
          onClick={() => {
            setExpanded(!expanded);
            playBellChime();
          }}
          title="Virtual Neko Cat Companion"
        >
          <div className="cat-dock-live-dot" />
          <Cat className="cat-dock-icon" size={17} />
          <span className="cat-dock-label">NEKO COMPANION</span>
          <span className="cat-dock-badge">{happiness}% BLISS</span>
          {isPurring && <span className="cat-purr-tag">PURR...</span>}
          {expanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>

        {/* Expanded Cyber Neko Studio Modal / Card */}
        {expanded && (
          <div className="cat-dock-card">
            {/* Header */}
            <div className="cat-dock-header">
              <div className="cat-dock-title-group">
                <span className="cat-dock-tag">VIRTUAL COMPANION</span>
                <h4 className="cat-dock-title">NEKO // CYBER CAT</h4>
                <p className="cat-dock-subtitle">Luxe Neko • Interactive Purr Engine</p>
              </div>
              <div className="cat-dock-happiness-badge" title="Happiness Level">
                <Heart size={13} className="heart-icon-filled" />
                <span>{happiness}%</span>
              </div>
            </div>

            {/* Interactive Animated SVG Cat Stage */}
            <div className="cat-avatar-stage" onClick={handlePet} title="Click to Pet Neko!">
              {/* Floating Hearts Container */}
              <div className="cat-floating-hearts" aria-hidden="true">
                {hearts.map((h) => (
                  <span
                    key={h.id}
                    className="floating-heart"
                    style={{ left: `${h.x}%`, animationDelay: `${h.delay}s` }}
                  >
                    ♥
                  </span>
                ))}
              </div>

              {/* Status Speech Bubble */}
              <div className="cat-speech-bubble">
                {catState === 'happy' ? (
                  <span>Purrr... ♥ So Happy!</span>
                ) : catState === 'eating' ? (
                  <span>*Crunch Munch* Tasty Fish!</span>
                ) : catState === 'sleeping' ? (
                  <span>Zzz... Purr... Sleepy Loaf</span>
                ) : laserActive ? (
                  <span>Laser Spotted! Swat!</span>
                ) : (
                  <span>Click to Pet Me! (=^•^=)</span>
                )}
              </div>

              {/* Vector Animated Cat */}
              <svg viewBox="0 0 160 160" className={`cat-interactive-svg state-${catState}`}>
                <defs>
                  <linearGradient id="catCoat" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2d1b4e" />
                    <stop offset="70%" stopColor="#1a0f30" />
                    <stop offset="100%" stopColor="#0d0718" />
                  </linearGradient>
                  <radialGradient id="catEyeGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="70%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#047857" />
                  </radialGradient>
                  <linearGradient id="collarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ff85a2" />
                    <stop offset="100%" stopColor="#f72585" />
                  </linearGradient>
                </defs>

                {/* Animated Wagging Tail */}
                <path
                  d="M120,130 Q145,100 138,70 Q130,55 142,52"
                  className="cat-tail-anim"
                />

                {/* Cat Body Loaf */}
                <ellipse cx="80" cy="118" rx="44" ry="32" fill="url(#catCoat)" className="cat-body" />

                {/* Left & Right Paws */}
                <ellipse cx="58" cy="140" rx="10" ry="6" fill="#ffccd5" className="cat-paw left-paw" />
                <ellipse cx="102" cy="140" rx="10" ry="6" fill="#ffccd5" className="cat-paw right-paw" />

                {/* Cat Head */}
                <g className="cat-head-group">
                  {/* Left Ear with Twitch Animation */}
                  <polygon points="48,68 34,16 72,42" className="cat-ear ear-l" />
                  <polygon points="52,62 42,28 68,46" fill="#ff85a2" opacity="0.8" />

                  {/* Right Ear with Twitch Animation */}
                  <polygon points="112,68 126,16 88,42" className="cat-ear ear-r" />
                  <polygon points="108,62 118,28 92,46" fill="#ff85a2" opacity="0.8" />

                  {/* Head Round */}
                  <circle cx="80" cy="72" r="34" fill="url(#catCoat)" />

                  {/* Collar & Golden Bell */}
                  <path d="M54,94 Q80,105 106,94" stroke="url(#collarGrad)" strokeWidth="4" fill="none" />
                  <circle cx="80" cy="103" r="5.5" fill="#fbbf24" stroke="#d97706" strokeWidth="1" className="cat-bell-btn" onClick={(e) => { e.stopPropagation(); playBellChime(); }} />

                  {/* Eyes / Blinking / Eye Tracking */}
                  {catState === 'sleeping' ? (
                    // Sleeping peaceful curved eyes
                    <g className="cat-eyes-sleeping">
                      <path d="M58,70 Q68,78 74,70" stroke="#ff85a2" strokeWidth="2.5" fill="none" />
                      <path d="M86,70 Q92,78 102,70" stroke="#ff85a2" strokeWidth="2.5" fill="none" />
                    </g>
                  ) : catState === 'happy' ? (
                    // Blissful smiling eyes ^_^
                    <g className="cat-eyes-bliss">
                      <path d="M58,72 Q66,62 74,72" stroke="#34d399" strokeWidth="3" fill="none" />
                      <path d="M86,72 Q94,62 102,72" stroke="#34d399" strokeWidth="3" fill="none" />
                    </g>
                  ) : (
                    // Normal open eyes with pupil tracking
                    <g className="cat-eyes-open">
                      <ellipse cx="66" cy="68" rx="8" ry="7" fill="url(#catEyeGlow)" />
                      <ellipse
                        cx={66 + catEyeAngle.x}
                        cy={68 + catEyeAngle.y}
                        rx={laserActive ? 5 : 2.5}
                        ry="6"
                        fill="#052e16"
                        className="cat-pupil-eye"
                      />

                      <ellipse cx="94" cy="68" rx="8" ry="7" fill="url(#catEyeGlow)" />
                      <ellipse
                        cx={94 + catEyeAngle.x}
                        cy={68 + catEyeAngle.y}
                        rx={laserActive ? 5 : 2.5}
                        ry="6"
                        fill="#052e16"
                        className="cat-pupil-eye"
                      />
                    </g>
                  )}

                  {/* Nose & Whiskers */}
                  <polygon points="77,78 83,78 80,82" fill="#ff85a2" />
                  <line x1="56" y1="78" x2="28" y2="74" stroke="#ffccd5" strokeWidth="1.2" opacity="0.75" />
                  <line x1="56" y1="82" x2="30" y2="84" stroke="#ffccd5" strokeWidth="1.2" opacity="0.75" />
                  <line x1="104" y1="78" x2="132" y2="74" stroke="#ffccd5" strokeWidth="1.2" opacity="0.75" />
                  <line x1="104" y1="82" x2="130" y2="84" stroke="#ffccd5" strokeWidth="1.2" opacity="0.75" />
                </g>
              </svg>

              {/* Tap prompt */}
              <span className="cat-tap-hint">✨ CLICK TO PET NEKO ✨</span>
            </div>

            {/* Interactive Action Controls */}
            <div className="cat-dock-actions-grid">
              <button
                type="button"
                className="cat-action-btn pet-btn"
                onClick={handlePet}
                title="Pet the Cat"
              >
                <Heart size={13} />
                <span>Pet Me</span>
              </button>

              <button
                type="button"
                className="cat-action-btn feed-btn"
                onClick={handleFeedTreat}
                title="Feed a Fish Biscuit"
              >
                <Fish size={13} />
                <span>Feed Treat</span>
              </button>

              <button
                type="button"
                className={`cat-action-btn laser-btn ${laserActive ? 'active' : ''}`}
                onClick={() => {
                  setLaserActive(!laserActive);
                  playBellChime();
                }}
                title="Toggle Laser Pointer Mode"
              >
                <Zap size={13} />
                <span>{laserActive ? 'Laser On' : 'Laser Off'}</span>
              </button>

              <button
                type="button"
                className={`cat-action-btn sleep-btn ${catState === 'sleeping' ? 'active' : ''}`}
                onClick={handleToggleSleep}
                title="Cat Nap Mode"
              >
                <Moon size={13} />
                <span>{catState === 'sleeping' ? 'Waking' : 'Cat Nap'}</span>
              </button>
            </div>

            {/* Happiness Progress Bar */}
            <div className="cat-happiness-bar-container">
              <div className="cat-happiness-header">
                <span className="cat-metric-label">NEKO HAPPINESS METER:</span>
                <span className="cat-metric-val">{happiness}%</span>
              </div>
              <div className="cat-progress-track">
                <div
                  className="cat-progress-fill"
                  style={{ width: `${happiness}%` }}
                />
              </div>
            </div>

            {/* Real-time Telemetry Readout */}
            <div className="cat-dock-footer">
              <span>SOUND: {soundEnabled ? 'PURR ENGINE ACTIVE' : 'MUTED'}</span>
              <span className="accent">MODE: {catState.toUpperCase()}</span>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
