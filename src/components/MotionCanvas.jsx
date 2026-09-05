import React, { useEffect, useRef } from 'react';

export default function MotionCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    let animationId;

    // Smooth scroll interpolation
    let targetScroll = window.scrollY || 0;
    let smoothScroll = targetScroll;

    // Mouse tracking with smooth lerp
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    // ==========================================
    // 1. STARFIELD & SHOOTING STARS SETUP
    // ==========================================
    let stars = [];
    const STAR_COUNT = 240;

    function initStars() {
      stars = Array.from({ length: STAR_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height * 3, // span deep scroll space
        radius: Math.random() < 0.85 ? 0.6 + Math.random() * 0.9 : 1.6 + Math.random() * 1.2,
        baseAlpha: 0.25 + Math.random() * 0.65,
        twinkleSpeed: 0.015 + Math.random() * 0.03,
        twinklePhase: Math.random() * Math.PI * 2,
        depth: 0.15 + Math.random() * 0.85, // 0.15 = deep background, 1.0 = foreground
        color: Math.random() < 0.2 ? '#e0f2fe' : Math.random() < 0.35 ? '#fed7aa' : '#ffffff'
      }));
    }

    // Shooting stars / meteors
    let meteors = [];
    function spawnMeteor() {
      const startX = Math.random() * width * 1.2;
      const startY = Math.random() * height * 0.6;
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3; // roughly 45 degrees
      const speed = 14 + Math.random() * 10;
      meteors.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: 70 + Math.random() * 80,
        alpha: 1.0,
        decay: 0.018 + Math.random() * 0.015,
        width: 1.2 + Math.random() * 1.0
      });
    }

    // ==========================================
    // 2. ANDROMEDA GALAXY (M31) SETUP
    // ==========================================
    let andromedaStars = [];
    const ANDROMEDA_STAR_COUNT = 650;

    function initAndromeda() {
      andromedaStars = [];
      const arms = 2;
      const armOffset = (Math.PI * 2) / arms;

      for (let i = 0; i < ANDROMEDA_STAR_COUNT; i++) {
        // Logarithmic spiral distribution
        const arm = i % arms;
        const distRatio = Math.pow(Math.random(), 1.8);
        const maxDist = Math.min(width * 0.28, 260);
        const dist = 10 + distRatio * maxDist;

        // Spiral angle with noise dispersion
        const angle = dist * 0.032 + arm * armOffset + (Math.random() - 0.5) * 0.55;
        const spread = (Math.random() - 0.5) * (dist * 0.35);

        // Elliptical galaxy compression (inclination)
        const x = Math.cos(angle) * dist + Math.sin(angle) * spread * 0.4;
        const y = (Math.sin(angle) * dist - Math.cos(angle) * spread * 0.4) * 0.42; // compressed on y-axis

        andromedaStars.push({
          relX: x,
          relY: y,
          radius: 0.5 + Math.random() * 1.2,
          alpha: 0.25 + Math.random() * 0.7,
          color:
            dist < 40
              ? '#fffbeb'
              : Math.random() < 0.4
              ? '#c084fc'
              : Math.random() < 0.7
              ? '#67e8f9'
              : '#f8fafc'
        });
      }
    }

    // ==========================================
    // 3. SOLAR SYSTEM CONFIGURATION
    // ==========================================
    const PLANETS = [
      {
        name: 'Mercury',
        dist: 55,
        radius: 2.2,
        speed: 0.028,
        angleOffset: 0.4,
        color: '#d6d3d1',
        glow: 'rgba(214, 211, 209, 0.4)'
      },
      {
        name: 'Venus',
        dist: 82,
        radius: 3.5,
        speed: 0.021,
        angleOffset: 1.8,
        color: '#fde047',
        glow: 'rgba(253, 224, 71, 0.4)'
      },
      {
        name: 'Earth',
        dist: 118,
        radius: 4.2,
        speed: 0.015,
        angleOffset: 3.2,
        color: '#38bdf8',
        glow: 'rgba(56, 189, 248, 0.6)',
        hasMoon: true
      },
      {
        name: 'Mars',
        dist: 154,
        radius: 3.0,
        speed: 0.012,
        angleOffset: 5.1,
        color: '#f87171',
        glow: 'rgba(248, 113, 113, 0.5)'
      },
      {
        name: 'Jupiter',
        dist: 215,
        radius: 8.5,
        speed: 0.007,
        angleOffset: 2.1,
        color: '#fed7aa',
        glow: 'rgba(254, 215, 170, 0.45)',
        hasBands: true
      },
      {
        name: 'Saturn',
        dist: 285,
        radius: 7.2,
        speed: 0.005,
        angleOffset: 4.4,
        color: '#fef08a',
        glow: 'rgba(254, 240, 138, 0.45)',
        hasRings: true
      },
      {
        name: 'Uranus',
        dist: 350,
        radius: 5.0,
        speed: 0.0035,
        angleOffset: 0.9,
        color: '#67e8f9',
        glow: 'rgba(103, 232, 249, 0.4)'
      },
      {
        name: 'Neptune',
        dist: 410,
        radius: 4.8,
        speed: 0.0026,
        angleOffset: 3.7,
        color: '#60a5fa',
        glow: 'rgba(96, 165, 250, 0.5)'
      }
    ];

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      initStars();
      initAndromeda();
    }

    function onMouseMove(e) {
      mouse.targetX = (e.clientX - width / 2) * 0.035;
      mouse.targetY = (e.clientY - height / 2) * 0.035;
    }

    function onMouseLeave() {
      mouse.targetX = 0;
      mouse.targetY = 0;
    }

    function onScroll() {
      targetScroll = window.scrollY || 0;
    }

    // ==========================================
    // RENDER: ANDROMEDA GALAXY (M31)
    // ==========================================
    function drawAndromeda(cx, cy, rotation) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);

      // Deep galactic diffuse glow
      const bgGlow = ctx.createRadialGradient(0, 0, 4, 0, 0, 160);
      bgGlow.addColorStop(0, 'rgba(245, 243, 255, 0.35)');
      bgGlow.addColorStop(0.2, 'rgba(192, 132, 252, 0.18)');
      bgGlow.addColorStop(0.5, 'rgba(56, 189, 248, 0.08)');
      bgGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = bgGlow;
      ctx.beginPath();
      ctx.ellipse(0, 0, 160, 68, 0, 0, Math.PI * 2);
      ctx.fill();

      // Brilliant galactic core
      const coreGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, 32);
      coreGlow.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      coreGlow.addColorStop(0.3, 'rgba(254, 243, 199, 0.7)');
      coreGlow.addColorStop(0.7, 'rgba(192, 132, 252, 0.3)');
      coreGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.ellipse(0, 0, 35, 16, 0, 0, Math.PI * 2);
      ctx.fill();

      // Individual galaxy stars in spiral arms
      andromedaStars.forEach((star) => {
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.alpha;
        ctx.beginPath();
        ctx.arc(star.relX, star.relY, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      ctx.restore();
    }

    // ==========================================
    // RENDER: THE SUN WITH SOLAR CORONA & FLARES
    // ==========================================
    function drawSun(cx, cy) {
      ctx.save();
      ctx.translate(cx, cy);

      const pulse = Math.sin(frame * 0.03) * 2;
      const coreR = 18 + pulse * 0.5;

      // Outer Corona Ray Halo
      const coronaR = 75 + pulse * 4;
      const coronaGrad = ctx.createRadialGradient(0, 0, coreR * 0.8, 0, 0, coronaR);
      coronaGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      coronaGrad.addColorStop(0.2, 'rgba(253, 224, 71, 0.55)');
      coronaGrad.addColorStop(0.5, 'rgba(249, 115, 22, 0.22)');
      coronaGrad.addColorStop(0.8, 'rgba(239, 68, 68, 0.08)');
      coronaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = coronaGrad;
      ctx.beginPath();
      ctx.arc(0, 0, coronaR, 0, Math.PI * 2);
      ctx.fill();

      // Radiating solar flare spikes
      const rayCount = 12;
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.18)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < rayCount; i++) {
        const rayAngle = (i / rayCount) * Math.PI * 2 + frame * 0.005;
        const len = coreR + 12 + Math.sin(frame * 0.05 + i * 1.5) * 8;
        ctx.beginPath();
        ctx.moveTo(Math.cos(rayAngle) * coreR, Math.sin(rayAngle) * coreR);
        ctx.lineTo(Math.cos(rayAngle) * len, Math.sin(rayAngle) * len);
        ctx.stroke();
      }

      // Blinding solar sphere
      const sunCore = ctx.createRadialGradient(0, 0, 0, 0, 0, coreR);
      sunCore.addColorStop(0, '#ffffff');
      sunCore.addColorStop(0.45, '#fef08a');
      sunCore.addColorStop(0.85, '#f97316');
      sunCore.addColorStop(1, '#ea580c');

      ctx.fillStyle = sunCore;
      ctx.beginPath();
      ctx.arc(0, 0, coreR, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // ==========================================
    // RENDER: PLANETS & ORBITS
    // ==========================================
    function drawSolarSystem(sunX, sunY, tiltAngle) {
      // Draw faint elliptical orbit paths first
      ctx.save();
      ctx.translate(sunX, sunY);
      ctx.rotate(tiltAngle);

      PLANETS.forEach((planet) => {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
        ctx.lineWidth = 0.8;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.ellipse(0, 0, planet.dist, planet.dist * 0.42, 0, 0, Math.PI * 2);
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // Draw each planet on its inclined orbit
      PLANETS.forEach((planet) => {
        // Orbit position over time + scroll influence
        const angle = frame * planet.speed + planet.angleOffset + smoothScroll * 0.0008;
        const px = Math.cos(angle) * planet.dist;
        const py = Math.sin(angle) * planet.dist * 0.42;

        ctx.save();
        ctx.translate(px, py);

        // SATURN'S BACK RING (drawn behind planet)
        if (planet.hasRings) {
          ctx.strokeStyle = 'rgba(254, 240, 138, 0.45)';
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.ellipse(0, 0, planet.radius * 2.5, planet.radius * 0.85, 0.25, Math.PI, Math.PI * 2);
          ctx.stroke();
        }

        // Planet atmospheric glow
        if (planet.glow) {
          const glowGrad = ctx.createRadialGradient(0, 0, planet.radius * 0.5, 0, 0, planet.radius * 2.4);
          glowGrad.addColorStop(0, planet.glow);
          glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(0, 0, planet.radius * 2.4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Planet body
        ctx.fillStyle = planet.color;
        ctx.beginPath();
        ctx.arc(0, 0, planet.radius, 0, Math.PI * 2);
        ctx.fill();

        // Jupiter's cloud bands
        if (planet.hasBands) {
          ctx.strokeStyle = 'rgba(180, 83, 9, 0.55)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(-planet.radius * 0.8, -planet.radius * 0.25);
          ctx.lineTo(planet.radius * 0.8, -planet.radius * 0.25);
          ctx.moveTo(-planet.radius * 0.9, planet.radius * 0.2);
          ctx.lineTo(planet.radius * 0.9, planet.radius * 0.2);
          ctx.stroke();
        }

        // Earth's Moon
        if (planet.hasMoon) {
          const moonAngle = frame * 0.08;
          const moonX = Math.cos(moonAngle) * 11;
          const moonY = Math.sin(moonAngle) * 6;
          ctx.fillStyle = '#f5f5f4';
          ctx.beginPath();
          ctx.arc(moonX, moonY, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }

        // SATURN'S FRONT RING (drawn over planet for 3D occlusion)
        if (planet.hasRings) {
          ctx.strokeStyle = 'rgba(254, 240, 138, 0.75)';
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.ellipse(0, 0, planet.radius * 2.5, planet.radius * 0.85, 0.25, 0, Math.PI);
          ctx.stroke();

          // Outer faint ring band
          ctx.strokeStyle = 'rgba(253, 224, 71, 0.28)';
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.ellipse(0, 0, planet.radius * 3.1, planet.radius * 1.05, 0.25, 0, Math.PI);
          ctx.stroke();
        }

        ctx.restore();
      });

      ctx.restore();
    }

    // ==========================================
    // RENDER: GALACTUS - THE COSMIC TITAN
    // ==========================================
    function drawGalactus(cx, cy, scale) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);

      // 1. Vast Celestial Aura
      const auraR = 190;
      const auraGrad = ctx.createRadialGradient(0, -20, 20, 0, -20, auraR);
      auraGrad.addColorStop(0, 'rgba(168, 85, 247, 0.24)');
      auraGrad.addColorStop(0.35, 'rgba(236, 72, 153, 0.12)');
      auraGrad.addColorStop(0.7, 'rgba(56, 189, 248, 0.05)');
      auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(0, -20, auraR, 0, Math.PI * 2);
      ctx.fill();

      // 2. Colossal Armor Pauldrons & Torso
      ctx.fillStyle = '#0a0514';
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.45)';
      ctx.lineWidth = 1.6;

      ctx.beginPath();
      ctx.moveTo(-22, 38);
      // Left shoulder pauldron sweep
      ctx.lineTo(-80, 48);
      ctx.lineTo(-118, 92);
      ctx.lineTo(-90, 150);
      ctx.lineTo(90, 150);
      // Right shoulder pauldron sweep
      ctx.lineTo(118, 92);
      ctx.lineTo(80, 48);
      ctx.lineTo(22, 38);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Armor segment lines
      ctx.strokeStyle = 'rgba(236, 72, 153, 0.35)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-55, 65);
      ctx.lineTo(0, 92);
      ctx.lineTo(55, 65);
      ctx.moveTo(0, 92);
      ctx.lineTo(0, 150);
      ctx.stroke();

      // 3. Chest Core: The Power Cosmic Nexus
      const nexusPulse = Math.sin(frame * 0.05) * 4;
      const nexusGrad = ctx.createRadialGradient(0, 98, 2, 0, 98, 30 + nexusPulse);
      nexusGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      nexusGrad.addColorStop(0.25, 'rgba(236, 72, 153, 0.65)');
      nexusGrad.addColorStop(0.65, 'rgba(168, 85, 247, 0.28)');
      nexusGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = nexusGrad;
      ctx.beginPath();
      ctx.arc(0, 98, 30 + nexusPulse, 0, Math.PI * 2);
      ctx.fill();

      // Swirling Power Cosmic gravitational vortex
      ctx.save();
      ctx.translate(0, 98);
      ctx.rotate(frame * 0.035);
      for (let v = 0; v < 18; v++) {
        const vRad = (v / 18) * Math.PI * 2;
        const vDist = 20 + Math.sin(frame * 0.04 + v) * 14;
        const vx = Math.cos(vRad) * vDist;
        const vy = Math.sin(vRad) * (vDist * 0.55);
        ctx.fillStyle = v % 2 === 0 ? 'rgba(192, 132, 252, 0.85)' : 'rgba(56, 189, 248, 0.85)';
        ctx.beginPath();
        ctx.arc(vx, vy, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // 4. The Legendary Tuning-Fork / Horned Helmet
      ctx.fillStyle = '#110822';
      ctx.strokeStyle = 'rgba(192, 132, 252, 0.85)';
      ctx.lineWidth = 2.2;

      ctx.beginPath();
      // Chin
      ctx.moveTo(0, 32);
      // Left jaw
      ctx.lineTo(-24, 25);
      // Left ear pod
      ctx.lineTo(-38, 20);
      ctx.lineTo(-44, -6);
      ctx.lineTo(-48, -12);
      // Left horn outer sweep (towering upward curve)
      ctx.quadraticCurveTo(-102, -65, -94, -142);
      // Left horn tip
      ctx.lineTo(-82, -152);
      // Left horn inner sweep
      ctx.quadraticCurveTo(-75, -82, -38, -58);
      // Left top crown stepped architecture
      ctx.lineTo(-32, -92);
      ctx.lineTo(-24, -95);
      ctx.lineTo(-22, -128);
      // Crown central spire apex
      ctx.lineTo(0, -140);
      // Right top crown stepped architecture
      ctx.lineTo(22, -128);
      ctx.lineTo(24, -95);
      ctx.lineTo(32, -92);
      // Right horn inner sweep
      ctx.lineTo(38, -58);
      ctx.quadraticCurveTo(75, -82, 82, -152);
      // Right horn tip
      ctx.lineTo(94, -142);
      // Right horn outer sweep
      ctx.quadraticCurveTo(102, -65, 48, -12);
      ctx.lineTo(44, -6);
      ctx.lineTo(38, 20);
      // Right jaw
      ctx.lineTo(24, 25);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Helmet architectural crest details
      ctx.strokeStyle = 'rgba(236, 72, 153, 0.65)';
      ctx.lineWidth = 1.4;
      // Brow visor ridge
      ctx.beginPath();
      ctx.moveTo(-28, -26);
      ctx.lineTo(0, -16);
      ctx.lineTo(28, -26);
      ctx.stroke();

      // Central crest line
      ctx.beginPath();
      ctx.moveTo(0, -140);
      ctx.lineTo(0, -28);
      ctx.stroke();

      // Horn energy conduits
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.55)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-45, -46);
      ctx.quadraticCurveTo(-72, -78, -86, -140);
      ctx.moveTo(45, -46);
      ctx.quadraticCurveTo(72, -78, 86, -140);
      ctx.stroke();

      // 5. Dark Visage & Piercing Glowing Cosmic Eyes
      ctx.fillStyle = '#06020a';
      ctx.beginPath();
      ctx.moveTo(-18, -18);
      ctx.lineTo(18, -18);
      ctx.lineTo(14, 20);
      ctx.lineTo(0, 26);
      ctx.lineTo(-14, 20);
      ctx.closePath();
      ctx.fill();

      // Glowing Eyes with Cosmic Radiance
      ctx.shadowColor = '#67e8f9';
      ctx.shadowBlur = 14;
      ctx.fillStyle = '#ffffff';

      // Left Eye
      ctx.beginPath();
      ctx.moveTo(-14, -6);
      ctx.lineTo(-4, -5);
      ctx.lineTo(-5, -1);
      ctx.lineTo(-13, -2);
      ctx.closePath();
      ctx.fill();

      // Right Eye
      ctx.beginPath();
      ctx.moveTo(14, -6);
      ctx.lineTo(4, -5);
      ctx.lineTo(5, -1);
      ctx.lineTo(13, -2);
      ctx.closePath();
      ctx.fill();

      ctx.shadowBlur = 0;

      // 6. Crackling Power Cosmic Lightning Arcs between Horns
      if (Math.sin(frame * 0.1) > -0.1) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.lineWidth = 1.4;
        ctx.shadowColor = '#c084fc';
        ctx.shadowBlur = 10;

        ctx.beginPath();
        let lx = -85;
        let ly = -145;
        ctx.moveTo(lx, ly);
        const steps = 7;
        for (let s = 1; s <= steps; s++) {
          const targetX = -85 + (170 / steps) * s;
          const targetY = -145 + Math.sin(frame * 0.25 + s) * 18;
          const jitterX = (Math.random() - 0.5) * 12;
          const jitterY = (Math.random() - 0.5) * 14;
          ctx.lineTo(targetX + jitterX, targetY + jitterY);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      ctx.restore();
    }

    // ==========================================
    // RENDER: SUPERMASSIVE BLACK HOLE (SINGULARITY)
    // ==========================================
    function drawBlackHole(cx, cy, intensity) {
      if (intensity <= 0.01) return;

      const domP = window.__domCollapseProgress || 0;
      const effectiveIntensity = Math.min(1.6, intensity + domP * 0.35);

      ctx.save();
      ctx.translate(cx, cy);

      const baseR = (48 + domP * 14) * effectiveIntensity;
      const diskR = (190 + domP * 60) * effectiveIntensity;

      // 1. Vast Gravitational Lensing Halo / Distortion Glow
      const lensGrad = ctx.createRadialGradient(0, 0, baseR * 0.9, 0, 0, diskR * 1.6);
      lensGrad.addColorStop(0, 'rgba(0, 0, 0, 0.98)');
      lensGrad.addColorStop(0.2, 'rgba(249, 115, 22, 0.38)');
      lensGrad.addColorStop(0.45, 'rgba(168, 85, 247, 0.22)');
      lensGrad.addColorStop(0.7, 'rgba(56, 189, 248, 0.12)');
      lensGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = lensGrad;
      ctx.beginPath();
      ctx.arc(0, 0, diskR * 1.6, 0, Math.PI * 2);
      ctx.fill();

      // 2. Collimated Relativistic Polar Jets (shooting above & below)
      const jetLength = 340 * intensity;
      const jetGrad = ctx.createLinearGradient(0, -jetLength, 0, jetLength);
      jetGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
      jetGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0.75)');
      jetGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.85)');
      jetGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0.75)');
      jetGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');

      ctx.fillStyle = jetGrad;
      ctx.beginPath();
      ctx.moveTo(-6 * intensity, -jetLength);
      ctx.lineTo(6 * intensity, -jetLength);
      ctx.lineTo(1.5 * intensity, 0);
      ctx.lineTo(6 * intensity, jetLength);
      ctx.lineTo(-6 * intensity, jetLength);
      ctx.lineTo(-1.5 * intensity, 0);
      ctx.closePath();
      ctx.fill();

      // 3. Gravitationally Warped Upper Lensing Ring (Arcing Over the Singularity)
      ctx.save();
      ctx.scale(1, 0.44);
      const upperWarpGrad = ctx.createRadialGradient(0, -baseR * 1.3, baseR * 0.8, 0, -baseR * 1.3, diskR * 1.15);
      upperWarpGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      upperWarpGrad.addColorStop(0.25, 'rgba(253, 186, 116, 0.8)');
      upperWarpGrad.addColorStop(0.65, 'rgba(234, 88, 12, 0.4)');
      upperWarpGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.strokeStyle = upperWarpGrad;
      ctx.lineWidth = 16 * intensity;
      ctx.beginPath();
      ctx.arc(0, 0, diskR * 0.96, Math.PI, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // 4. Gravitationally Warped Lower Lensing Ring (Arcing Underneath)
      ctx.save();
      ctx.scale(1, 0.38);
      const lowerWarpGrad = ctx.createRadialGradient(0, baseR * 1.2, baseR * 0.7, 0, baseR * 1.2, diskR * 1.05);
      lowerWarpGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
      lowerWarpGrad.addColorStop(0.3, 'rgba(251, 146, 60, 0.6)');
      lowerWarpGrad.addColorStop(0.7, 'rgba(194, 65, 12, 0.25)');
      lowerWarpGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.strokeStyle = lowerWarpGrad;
      ctx.lineWidth = 11 * intensity;
      ctx.beginPath();
      ctx.arc(0, 0, diskR * 0.92, 0, Math.PI);
      ctx.stroke();
      ctx.restore();

      // 5. Main Relativistic Accretion Disk (Tilted Elliptical Swirl)
      ctx.save();
      ctx.rotate(0.24);

      for (let ring = 0; ring < 5; ring++) {
        const rDist = baseR * 1.08 + ring * (24 * intensity);
        ctx.lineWidth = (7 - ring * 0.8) * intensity;
        const ringGrad = ctx.createLinearGradient(-rDist, 0, rDist, 0);
        // Doppler beaming: approaching side (left) is fiercely brighter and blue-shifted
        ringGrad.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
        ringGrad.addColorStop(0.22, 'rgba(254, 215, 170, 0.85)');
        ringGrad.addColorStop(0.5, 'rgba(249, 115, 22, 0.45)');
        ringGrad.addColorStop(0.8, 'rgba(194, 65, 12, 0.22)');
        ringGrad.addColorStop(1, 'rgba(124, 45, 18, 0.08)');

        ctx.strokeStyle = ringGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, rDist, rDist * 0.27, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 6. Inward Spiraling Accretion Plasma Streams (Drawn BEFORE Event Horizon so they vanish into void)
      const particleCount = 36 + Math.floor(domP * 45);
      for (let p = 0; p < particleCount; p++) {
        const speed = (0.045 + (p % 4) * 0.015) * (1 + domP * 1.6);
        const pAngle = frame * speed + (p / particleCount) * Math.PI * 2;
        // Inward progression toward baseR
        const progress = (frame * (0.6 + domP * 1.2) + p * 8) % (diskR * 0.82);
        const pDist = diskR - progress;
        if (pDist > baseR) {
          const px = Math.cos(pAngle) * pDist;
          const py = Math.sin(pAngle) * (pDist * 0.27);
          ctx.fillStyle = p % 3 === 0 ? '#ffffff' : p % 3 === 1 ? '#fed7aa' : '#fb923c';
          ctx.beginPath();
          ctx.arc(px, py, (1.1 + (p % 2) * 0.6 + domP * 0.8) * effectiveIntensity, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      // 7. Pitch-Black Event Horizon (Absolute Singularity Void - Nothing Escapes)
      ctx.save();
      ctx.globalAlpha = 1.0;
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#000000';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 40;
      ctx.beginPath();
      ctx.arc(0, 0, baseR, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // 8. Blinding Razor-Thin Photon Sphere
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.4 * intensity;
      ctx.beginPath();
      ctx.arc(0, 0, baseR + 1.2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      ctx.restore();
    }

    // ==========================================
    // RENDER: CAMERA APERTURE RETICLE TRIBUTE
    // ==========================================
    function drawCameraReticles(cx, cy) {
      ctx.save();
      ctx.translate(cx, cy);
      const rot = frame * 0.003 + smoothScroll * 0.0006;
      ctx.rotate(rot);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(0, 0, 36, 0, Math.PI * 2);
      ctx.stroke();

      // Shutter aperture blades
      for (let i = 0; i < 6; i++) {
        ctx.rotate(Math.PI / 3);
        ctx.beginPath();
        ctx.moveTo(8, 0);
        ctx.lineTo(36, 9);
        ctx.stroke();
      }
      ctx.restore();
    }

    // ==========================================
    // MAIN RAF RENDER LOOP
    // ==========================================
    function render() {
      frame += 1;

      // Smooth scroll lerp
      smoothScroll += (targetScroll - smoothScroll) * 0.06;

      // Smooth mouse follow
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      // Calculate scroll progress toward the bottom of the page (0.0 to 1.0)
      const docHeight = document.documentElement.scrollHeight || 1;
      const winHeight = window.innerHeight || 1;
      const maxScroll = Math.max(1, docHeight - winHeight);
      const scrollRatio = Math.min(Math.max(smoothScroll / maxScroll, 0), 1);

      // Black Hole Gravitational Singularity Activates as user approaches the last page
      // Starts surfacing around 0.65 scroll, reaches full collapse at 1.0
      const domP = window.__domCollapseProgress || 0;
      const collapseIntensity = Math.min(1.5, Math.min(Math.max((scrollRatio - 0.65) / 0.35, 0), 1) + domP * 0.5);

      // Black hole position: emerges in center/lower-center, locked firmly at center when DOM collapses
      const bhX = width * 0.5 + mouse.x * 0.25 * (1 - domP * 0.9);
      const bhY = height * 0.55 + (1 - Math.min(1, collapseIntensity)) * 260 + mouse.y * 0.25 * (1 - domP * 0.9);

      // Clear full canvas (transparent on pure black body)
      ctx.clearRect(0, 0, width, height);

      // 1. STARFIELD WITH MULTI-DEPTH SCROLL PARALLAX & GRAVITATIONAL COLLAPSE
      stars.forEach((star) => {
        // Normal parallax position
        const parallaxY = (star.y - smoothScroll * star.depth * 0.35) % (height + 20);
        let drawY = parallaxY < -10 ? parallaxY + height + 20 : parallaxY;
        let drawX = star.x + mouse.x * star.depth;

        // GRAVITATIONAL COLLAPSE INTO THE BLACK HOLE
        if (collapseIntensity > 0.02) {
          const cdx = bhX - drawX;
          const cdy = bhY - drawY;
          const cdist = Math.hypot(cdx, cdy);

          if (cdist > 6) {
            // Relativistic suction force toward event horizon
            const pull = Math.min((1400 / (cdist + 30)) * collapseIntensity * (3.2 + domP * 3.5), 48);
            const swirl = pull * (1.35 + domP * 1.6);

            // Spiral trajectories (radial pull + angular swirl)
            star.x += (cdx / cdist) * pull - (cdy / cdist) * swirl * 0.25;
            star.y += (cdy / cdist) * pull + (cdx / cdist) * swirl * 0.25;

            // Spaghettification light streak when being sucked in fast
            if (collapseIntensity > 0.25 && pull > 3) {
              ctx.strokeStyle = star.color;
              ctx.lineWidth = star.radius * 0.8;
              ctx.globalAlpha = Math.min(1.0, star.baseAlpha * 1.5);
              ctx.beginPath();
              ctx.moveTo(drawX, drawY);
              ctx.lineTo(drawX - (cdx / cdist) * pull * 2.5, drawY - (cdy / cdist) * pull * 2.5);
              ctx.stroke();
            }

            // Consume matter crossing event horizon
            if (cdist < 46 * collapseIntensity) {
              // Re-seed at far perimeter
              star.x = Math.random() < 0.5 ? -30 : width + 30;
              star.y = Math.random() * height * 2;
            }
          }
        }

        const twinkle = Math.sin(frame * star.twinkleSpeed + star.twinklePhase);
        const alpha = Math.max(0.1, star.baseAlpha + twinkle * 0.28);

        ctx.fillStyle = star.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(drawX, drawY, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // 2. ANDROMEDA GALAXY (M31) with gravitational distortion
      const andromedaBaseX = width * 0.82 + mouse.x * 0.4;
      const andromedaBaseY = height * 0.24 - smoothScroll * 0.12 + mouse.y * 0.4;
      const andromedaX = andromedaBaseX + (bhX - andromedaBaseX) * (collapseIntensity * 0.5);
      const andromedaY = andromedaBaseY + (bhY - andromedaBaseY) * (collapseIntensity * 0.5);
      const andromedaRotation = -0.42 + smoothScroll * 0.0003 + frame * 0.0008 + collapseIntensity * 0.8;
      drawAndromeda(andromedaX, andromedaY, andromedaRotation);

      // 3. GALACTUS - THE TITANIC DEVOURER OF WORLDS
      // Pulled into the singularity at the final page
      const galactusAnchorX = (width < 768 ? width * 0.65 : width * 0.75) + mouse.x * 0.45;
      const galactusAnchorY = height * 0.62 - smoothScroll * 0.16 + mouse.y * 0.35 + Math.sin(frame * 0.02) * 6;
      const galactusX = galactusAnchorX + (bhX - galactusAnchorX) * (collapseIntensity * 0.5);
      const galactusY = galactusAnchorY + (bhY - galactusAnchorY) * (collapseIntensity * 0.5);
      const galactusScale =
        Math.min(width / 1100, 1.15) *
        (width < 768 ? 0.75 : 1.0) *
        Math.max(0.35, 1 - collapseIntensity * 0.55);
      drawGalactus(galactusX, galactusY, galactusScale);

      // 4. SHOOTING STARS / METEORS (bending into black hole)
      if (Math.random() < 0.012 && meteors.length < 3) {
        spawnMeteor();
      }

      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];

        // Deflected by black hole gravity
        if (collapseIntensity > 0.05) {
          const mdx = bhX - m.x;
          const mdy = bhY - m.y;
          const mdist = Math.hypot(mdx, mdy);
          if (mdist > 10) {
            m.vx += (mdx / mdist) * collapseIntensity * 1.5;
            m.vy += (mdy / mdist) * collapseIntensity * 1.5;
          }
        }

        m.x += m.vx;
        m.y += m.vy;
        m.alpha -= m.decay;

        if (m.alpha <= 0 || m.x > width + 100 || m.y > height + 100) {
          meteors.splice(i, 1);
          continue;
        }

        const grad = ctx.createLinearGradient(
          m.x,
          m.y,
          m.x - (m.vx / 18) * m.length,
          m.y - (m.vy / 18) * m.length
        );
        grad.addColorStop(0, `rgba(255, 255, 255, ${m.alpha})`);
        grad.addColorStop(0.3, `rgba(147, 197, 253, ${m.alpha * 0.7})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = m.width;
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(
          m.x - (m.vx / 18) * m.length,
          m.y - (m.vy / 18) * m.length
        );
        ctx.stroke();
      }

      // 5. SOLAR SYSTEM: SUN & ALL 8 PLANETS (drawn toward singularity)
      const sunAnchorX = width * 0.28 + mouse.x * 0.8;
      const sunAnchorY = height * 0.38 - smoothScroll * 0.22 + mouse.y * 0.8;
      const sunX = sunAnchorX + (bhX - sunAnchorX) * (collapseIntensity * 0.6);
      const sunY = sunAnchorY + (bhY - sunAnchorY) * (collapseIntensity * 0.6);
      const solarTilt = -0.22 + smoothScroll * 0.0002 + collapseIntensity * 0.5;

      drawSolarSystem(sunX, sunY, solarTilt);
      drawSun(sunX, sunY);

      // 6. THE SUPERMASSIVE BLACK HOLE (GARGANTUA SINGULARITY)
      // Drawn as the cosmic center of collapse at the bottom of the site
      drawBlackHole(bhX, bhY, collapseIntensity);

      // 7. ICONIC CAMERA SHUTTER NAVIGATION APERTURE RETICLES
      const reticleX = width * 0.12 + mouse.x * 0.5;
      const reticleY = height * 0.75 - smoothScroll * 0.15;
      drawCameraReticles(reticleX, reticleY);

      if (!reducedMotion.matches) {
        animationId = requestAnimationFrame(render);
      }
    }

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    resize();
    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        id="motion-field"
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-[-2]"
      />
      <div className="grain" aria-hidden="true" />
    </>
  );
}
