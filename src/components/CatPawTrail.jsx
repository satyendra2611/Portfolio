import React, { useEffect, useState, useRef, useCallback } from 'react';

/**
 * CatPawTrail
 * Interactive glowing cat paw cursor trails and click pounce bursts for the Cat Realm Theme.
 * Spawns alternating left/right little paws as the cursor moves, plus heart/paw bursts on click.
 */
export default function CatPawTrail({ theme, soundEnabled = true }) {
  const [paws, setPaws] = useState([]);
  const [bursts, setBursts] = useState([]);
  const lastPos = useRef({ x: 0, y: 0 });
  const isLeft = useRef(false);
  const pawIdRef = useRef(0);
  const burstIdRef = useRef(0);

  // Kitten chirp sound removed per user request
  const playClickChirp = useCallback(() => {}, []);

  useEffect(() => {
    if (theme !== 'cat-realm') return;

    const handleMouseMove = (e) => {
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Spawn every 38px of mouse movement
      if (dist > 38) {
        lastPos.current = { x: e.clientX, y: e.clientY };
        isLeft.current = !isLeft.current;

        const angle = Math.atan2(dy, dx);
        const perpAngle = angle + (isLeft.current ? Math.PI / 2 : -Math.PI / 2);
        const offsetDist = 12; // distance between left & right paws

        const px = e.clientX + Math.cos(perpAngle) * offsetDist;
        const py = e.clientY + Math.sin(perpAngle) * offsetDist;

        const id = ++pawIdRef.current;
        const newPaw = {
          id,
          x: px,
          y: py,
          rotation: (angle * 180) / Math.PI + 90,
          isLeft: isLeft.current
        };

        setPaws((prev) => [...prev.slice(-18), newPaw]);

        setTimeout(() => {
          setPaws((prev) => prev.filter((p) => p.id !== id));
        }, 950);
      }
    };

    const handleClick = (e) => {
      playClickChirp();
      const id = ++burstIdRef.current;
      const newBurst = {
        id,
        x: e.clientX,
        y: e.clientY
      };

      setBursts((prev) => [...prev.slice(-8), newBurst]);
      setTimeout(() => {
        setBursts((prev) => prev.filter((b) => b.id !== id));
      }, 900);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('pointerdown', handleClick, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('pointerdown', handleClick);
    };
  }, [theme, playClickChirp]);

  if (theme !== 'cat-realm') return null;

  return (
    <div className="cat-paw-trail-layer" aria-hidden="true">
      {/* Walking Cat Paw Prints */}
      {paws.map((paw) => (
        <div
          key={paw.id}
          className="cat-paw-print"
          style={{
            left: `${paw.x}px`,
            top: `${paw.y}px`,
            transform: `translate(-50%, -50%) rotate(${paw.rotation}deg)`
          }}
        >
          <svg viewBox="0 0 32 32" className="mini-paw-svg">
            {/* Main Pad */}
            <ellipse cx="16" cy="18" rx="6.5" ry="5.2" className="paw-pad-glow" />
            {/* 4 Little Toe Beans */}
            <circle cx="10" cy="11.5" r="2.2" className="toe-bean-glow" />
            <circle cx="14" cy="9.2" r="2.3" className="toe-bean-glow" />
            <circle cx="18" cy="9.2" r="2.3" className="toe-bean-glow" />
            <circle cx="22" cy="11.5" r="2.2" className="toe-bean-glow" />
          </svg>
        </div>
      ))}

      {/* Click Pounce Heart & Sparkle Bursts */}
      {bursts.map((burst) => (
        <div
          key={burst.id}
          className="cat-click-burst"
          style={{ left: `${burst.x}px`, top: `${burst.y}px` }}
        >
          <span className="burst-stamp">🐾</span>
          <span className="burst-item item-1">♥</span>
          <span className="burst-item item-2">✨</span>
          <span className="burst-item item-3">♥</span>
          <span className="burst-item item-4">✨</span>
          <span className="burst-item item-5">🐾</span>
          <div className="burst-shockwave" />
        </div>
      ))}
    </div>
  );
}
