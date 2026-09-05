import React, { useState, useEffect, useRef } from 'react';
import { RotateCcw, Sparkles } from 'lucide-react';

const COLLAPSE_ZONE_HEIGHT = 1200; // px of scroll space beyond the footer to collapse everything

export default function SingularityDOMCollapse({ playShutterSound }) {
  const [collapseProgress, setCollapseProgress] = useState(0);
  const [isFullySwallowed, setIsFullySwallowed] = useState(false);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const animFrameRef = useRef(null);
  const blocksRef = useRef([]);

  useEffect(() => {
    const universeEl = document.getElementById('collapsible-universe');
    if (!universeEl) return;

    // Collect all visible blocks, cards, headings, and text elements
    const collectBlocks = () => {
      const items = [];

      // 1. All contact cards (Phone, Email, Instagram, LinkedIn, GitHub)
      document.querySelectorAll('.contact-card').forEach((el, i) => {
        items.push({ el, delay: i * 0.04, baseZ: 25 });
      });

      // 2. Direct message form (with inputs & button)
      const form = document.querySelector('.quick-message-form');
      if (form) items.push({ el: form, delay: 0.08, baseZ: 24 });

      // 3. Section heading & lead
      const contactHeading = document.querySelector('#contact .section-heading');
      if (contactHeading) items.push({ el: contactHeading, delay: 0.14, baseZ: 22 });

      // 4. Footer elements
      const footerLeft = document.querySelector('.footer-left');
      if (footerLeft) items.push({ el: footerLeft, delay: 0.06, baseZ: 23 });

      const footerRight = document.querySelector('.footer-right');
      if (footerRight) items.push({ el: footerRight, delay: 0.10, baseZ: 23 });

      const footerBottom = document.querySelector('.footer-bottom-bar');
      if (footerBottom) items.push({ el: footerBottom, delay: 0.16, baseZ: 21 });

      const footerHint = document.querySelector('.footer-event-horizon-hint');
      if (footerHint) items.push({ el: footerHint, delay: 0.02, baseZ: 20 });

      // 5. Site header / Navbar
      const header = document.querySelector('.site-header');
      if (header) items.push({ el: header, delay: 0.20, baseZ: 30 });

      blocksRef.current = items;
    };

    collectBlocks();

    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const winHeight = window.innerHeight || 1;
      const docHeight = document.documentElement.scrollHeight || 1;

      // The point where normal content ends and the collapse zone begins
      const zoneStart = Math.max(0, docHeight - winHeight - COLLAPSE_ZONE_HEIGHT);

      if (scrollY <= zoneStart) {
        targetProgressRef.current = 0;
      } else {
        const extraScroll = scrollY - zoneStart;
        const progress = Math.min(Math.max(extraScroll / COLLAPSE_ZONE_HEIGHT, 0), 1);
        targetProgressRef.current = progress;
      }
    };

    // Smooth physics loop for 60 FPS block suction animation
    const updatePhysics = () => {
      const current = currentProgressRef.current;
      const target = targetProgressRef.current;

      // Smooth spring/lerp interpolation
      const next = current + (target - current) * 0.14;
      currentProgressRef.current = Math.abs(next - target) < 0.0008 ? target : next;

      const p = currentProgressRef.current;
      window.__domCollapseProgress = p;

      const scrollY = window.scrollY || 0;
      const winHeight = window.innerHeight || 1;
      const winWidth = window.innerWidth || 1;
      const docHeight = document.documentElement.scrollHeight || 1;
      const zoneStart = Math.max(0, docHeight - winHeight - COLLAPSE_ZONE_HEIGHT);

      // Center of the supermassive black hole in the viewport
      const bhX = winWidth * 0.5;
      const bhY = winHeight * 0.55;

      if (p > 0.002) {
        // Pin the viewport at the last section so the user can watch the blocks fly
        const pinTranslateY = Math.max(0, scrollY - zoneStart);
        universeEl.style.transform = `translate3d(0, ${pinTranslateY}px, 0)`;
        universeEl.style.pointerEvents = p > 0.15 ? 'none' : 'auto';
        document.body.setAttribute('data-collapsing', 'true');
        document.body.style.setProperty('--dom-collapse', p.toFixed(4));

        // Physically pull each individual block and text element into the black hole!
        const blocks = blocksRef.current;
        for (let i = 0; i < blocks.length; i++) {
          const { el, delay, baseZ } = blocks[i];
          if (!el) continue;

          // Staggered progress for this block
          const startP = delay;
          const endP = 0.94;
          const localP = Math.min(Math.max((p - startP) / (endP - startP), 0), 1);

          if (localP <= 0) {
            el.style.transform = '';
            el.style.opacity = '';
            el.style.filter = '';
            continue;
          }

          // Compute element center
          const rect = el.getBoundingClientRect();
          const curTx = el.__curTx || 0;
          const curTy = el.__curTy || 0;
          const originX = rect.left - curTx + rect.width * 0.5;
          const originY = rect.top - curTy + rect.height * 0.5;

          const dx = bhX - originX;
          const dy = bhY - originY;

          // Relativistic acceleration curve towards singularity
          const travelP = Math.pow(localP, 1.35);
          const tx = dx * travelP;
          const ty = dy * travelP;
          el.__curTx = tx;
          el.__curTy = ty;

          // Vortex spiral rotation as matter is pulled by frame-dragging
          const swirlDir = dx >= 0 ? 1 : -1;
          const rot = swirlDir * Math.pow(localP, 1.15) * 160;

          // Scale: Stays 100% visible and readable for the majority of the flight!
          // Only shrinks as it reaches the mouth of the event horizon (localP > 0.45)
          let scale = 1;
          if (localP > 0.45) {
            const shrinkP = (localP - 0.45) / 0.55;
            scale = Math.max(0.001, 1 - Math.pow(shrinkP, 1.5) * 0.99);
          }

          // Spaghettification stretching along trajectory
          const stretchY = localP > 0.35 ? Math.min(1.6, 1 + (localP - 0.35) * 0.9) : 1;

          // Opacity: Remains solid (1.0) while flying, only vanishes inside the void (localP > 0.85)
          let opacity = 1;
          if (localP > 0.85) {
            opacity = Math.max(0, 1 - (localP - 0.85) / 0.15);
          }

          // Subtle relativistic blur as it enters the photon sphere
          const blur = localP > 0.55 ? (localP - 0.55) * 6 : 0;

          el.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) rotate(${rot.toFixed(1)}deg) scale(${scale.toFixed(3)}) scaleY(${stretchY.toFixed(2)})`;
          el.style.opacity = `${opacity.toFixed(2)}`;
          el.style.filter = blur > 0.2 ? `blur(${blur.toFixed(1)}px)` : '';
          el.style.zIndex = `${baseZ || 25}`;
          el.style.willChange = 'transform, opacity';
        }
      } else {
        // Reset universe and all blocks cleanly
        universeEl.style.transform = '';
        universeEl.style.pointerEvents = '';
        document.body.removeAttribute('data-collapsing');
        document.body.style.removeProperty('--dom-collapse');

        const blocks = blocksRef.current;
        for (let i = 0; i < blocks.length; i++) {
          const { el } = blocks[i];
          if (!el) continue;
          el.__curTx = 0;
          el.__curTy = 0;
          el.style.transform = '';
          el.style.opacity = '';
          el.style.filter = '';
          el.style.zIndex = '';
          el.style.willChange = '';
        }
      }

      setCollapseProgress(p);
      setIsFullySwallowed(p >= 0.88);

      animFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', () => {
      collectBlocks();
      handleScroll();
    }, { passive: true });

    handleScroll();
    animFrameRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (universeEl) {
        universeEl.style.transform = '';
        universeEl.style.pointerEvents = '';
      }
      const blocks = blocksRef.current;
      for (let i = 0; i < blocks.length; i++) {
        const { el } = blocks[i];
        if (!el) continue;
        el.style.transform = '';
        el.style.opacity = '';
        el.style.filter = '';
        el.style.zIndex = '';
      }
      document.body.removeAttribute('data-collapsing');
      document.body.style.removeProperty('--dom-collapse');
    };
  }, []);

  const handleRestoreUniverse = () => {
    if (playShutterSound) playShutterSound();
    const docHeight = document.documentElement.scrollHeight || 1;
    const winHeight = window.innerHeight || 1;
    const zoneStart = Math.max(0, docHeight - winHeight - COLLAPSE_ZONE_HEIGHT);

    window.scrollTo({
      top: Math.max(0, zoneStart - 40),
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* Deep Singularity Scroll Zone at the bottom of the page */}
      <div
        id="singularity-scroll-zone"
        className="singularity-scroll-zone"
        style={{ height: `${COLLAPSE_ZONE_HEIGHT}px` }}
        aria-hidden="true"
      >
        <div className="collapse-zone-telemetry">
          <span className="telemetry-depth">
            {collapseProgress < 0.05
              ? 'EVENT HORIZON: SCROLL DOWN TO ENTER'
              : `EVENT HORIZON INFLOW: ${(collapseProgress * 100).toFixed(0)}%`}
          </span>
        </div>
      </div>

      {/* Floating Prompt when universe is consumed into the black hole */}
      {isFullySwallowed && (
        <div className="singularity-restoration-overlay" role="dialog" aria-label="Universe Swallowed">
          <div className="restoration-beacon-card">
            <div className="beacon-header">
              <span className="beacon-dot" />
              <span className="beacon-tag">ALL MATTER CONSUMED INTO SINGULARITY</span>
            </div>
            <p className="beacon-text">
              Every block, card, and line of text has crossed the Event Horizon into the Supermassive Black Hole.
            </p>
            <button
              className="restore-universe-btn"
              onClick={handleRestoreUniverse}
              aria-label="Restore Universe"
            >
              <RotateCcw size={15} />
              <span>Scroll Up or Click to Reverse Gravity</span>
              <Sparkles size={14} className="sparkle-accent" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
