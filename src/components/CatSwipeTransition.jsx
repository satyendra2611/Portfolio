import React, { useState, useEffect } from 'react';

/**
 * CatSwipeTransition
 * Delightful visual screen transition when entering the Cat Realm / Neko Luxe Theme:
 * 1. Luminous cat eyes peek open in the dark center.
 * 2. Giant glowing cyber cat paw swoops across with glowing scratch trails.
 * 3. Sparkle dust and hearts disperse as the new theme unveils!
 */
export default function CatSwipeTransition({ active, onComplete }) {
  const [stage, setStage] = useState('idle'); // 'idle' | 'peek' | 'swipe' | 'fadeout'

  useEffect(() => {
    if (!active) {
      setStage('idle');
      return;
    }

    setStage('peek');

    const t1 = setTimeout(() => {
      setStage('swipe');
    }, 180);

    const t2 = setTimeout(() => {
      setStage('fadeout');
    }, 750);

    const t3 = setTimeout(() => {
      setStage('idle');
      if (onComplete) onComplete();
    }, 1100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [active]);

  if (stage === 'idle') return null;

  return (
    <div
      className={`cat-swipe-overlay stage-${stage}`}
      aria-hidden="true"
    >
      {/* Background Velvet Frosted Veil */}
      <div className="cat-swipe-veil" />

      {/* Center Cat Silhouette with Glowing Emerald Eyes */}
      <div className="cat-swipe-peeker">
        <svg viewBox="0 0 200 160" className="cat-head-svg">
          {/* Cat Ears */}
          <polygon points="40,90 20,20 80,55" className="cat-ear ear-left" />
          <polygon points="50,85 32,32 76,58" className="cat-ear-inner inner-left" />
          <polygon points="160,90 180,20 120,55" className="cat-ear ear-right" />
          <polygon points="150,85 168,32 124,58" className="cat-ear-inner inner-right" />

          {/* Cat Head Base */}
          <path
            d="M40,90 Q100,50 160,90 Q180,140 100,150 Q20,140 40,90 Z"
            className="cat-face-base"
          />

          {/* Luminous Slit Pupils / Glowing Eyes */}
          <ellipse cx="72" cy="100" rx="14" ry="10" className="cat-eye eye-left" />
          <ellipse cx="72" cy="100" rx="4" ry="9" className="cat-pupil pupil-left" />
          <ellipse cx="128" cy="100" rx="14" ry="10" className="cat-eye eye-right" />
          <ellipse cx="128" cy="100" rx="4" ry="9" className="cat-pupil pupil-right" />

          {/* Cute Nose & Whiskers */}
          <polygon points="96,120 104,120 100,126" className="cat-nose" />
          <line x1="60" y1="120" x2="15" y2="114" className="cat-whisker" />
          <line x1="60" y1="126" x2="18" y2="128" className="cat-whisker" />
          <line x1="140" y1="120" x2="185" y2="114" className="cat-whisker" />
          <line x1="140" y1="126" x2="182" y2="128" className="cat-whisker" />
        </svg>

        <span className="cat-swipe-banner">NEKO REALM // ACTIVE</span>
      </div>

      {/* Giant Glowing Cyber Cat Paw Swiping Diagonally Across Screen */}
      <div className="cat-paw-swat-container">
        <svg viewBox="0 0 320 320" className="giant-cat-paw-svg">
          <defs>
            <linearGradient id="pawGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff85a2" />
              <stop offset="50%" stopColor="#f72585" />
              <stop offset="100%" stopColor="#7209b7" />
            </linearGradient>
            <radialGradient id="padGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffccd5" />
              <stop offset="80%" stopColor="#ff85a2" />
              <stop offset="100%" stopColor="#f72585" />
            </radialGradient>
          </defs>

          {/* Main Giant Palm Pad */}
          <ellipse cx="160" cy="190" rx="65" ry="52" fill="url(#pawGlowGrad)" className="paw-shadow" />
          <ellipse cx="160" cy="186" rx="56" ry="44" fill="url(#padGlow)" className="paw-main-pad" />

          {/* 4 Cute Toe Beans with Claw Sparks */}
          <g className="toe-beans">
            <ellipse cx="98" cy="120" rx="22" ry="28" transform="rotate(-25 98 120)" fill="url(#padGlow)" />
            <ellipse cx="138" cy="98" rx="22" ry="30" transform="rotate(-8 138 98)" fill="url(#padGlow)" />
            <ellipse cx="182" cy="98" rx="22" ry="30" transform="rotate(8 182 98)" fill="url(#padGlow)" />
            <ellipse cx="222" cy="120" rx="22" ry="28" transform="rotate(25 222 120)" fill="url(#padGlow)" />
          </g>

          {/* 4 Luminous Claw Scratches */}
          <path d="M85,90 Q70,55 55,20" className="claw-scratch scratch-1" />
          <path d="M130,65 Q125,35 120,5" className="claw-scratch scratch-2" />
          <path d="M190,65 Q195,35 200,5" className="claw-scratch scratch-3" />
          <path d="M235,90 Q250,55 265,20" className="claw-scratch scratch-4" />
        </svg>

        {/* Scratch Light Beams & Sparkles */}
        <div className="scratch-laser laser-1" />
        <div className="scratch-laser laser-2" />
        <div className="scratch-laser laser-3" />
      </div>

      {/* Floating Stardust & Heart Particles */}
      <div className="cat-sparkles">
        {[...Array(16)].map((_, i) => (
          <span
            key={i}
            className="cat-sparkle-dot"
            style={{
              top: `${15 + (i * 5.2) % 70}%`,
              left: `${10 + (i * 7.3) % 80}%`,
              animationDelay: `${(i * 0.05).toFixed(2)}s`
            }}
          >
            {i % 3 === 0 ? '♥' : i % 3 === 1 ? '✨' : '🐾'}
          </span>
        ))}
      </div>
    </div>
  );
}
