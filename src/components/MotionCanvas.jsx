import React, { useEffect, useRef } from 'react';

export default function MotionCanvas({ theme = 'cosmic' }) {
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
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0, clientX: window.innerWidth * 0.5, clientY: window.innerHeight * 0.5 };

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    // ==========================================
    // CAMERA RED THEME DATA
    // ==========================================
    let bokeh = [];
    let cameraIcons = [];
    let afBox = { x: 0, y: 0, targetX: 0, targetY: 0 };

    function initCameraTheme() {
      // 1. Optical Bokeh Spheres (drifting with depth and soft blur)
      bokeh = Array.from({ length: 30 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height * 2.8,
        radius: 35 + Math.random() * 95,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        pulseSpeed: 0.012 + Math.random() * 0.02,
        pulsePhase: Math.random() * Math.PI * 2,
        baseAlpha: 0.08 + Math.random() * 0.16,
        depth: 0.2 + Math.random() * 0.8,
        color: Math.random() < 0.65 ? '#ff1744' : Math.random() < 0.85 ? '#ff5252' : '#ff9100'
      }));

      // 2. Floating Camera & Optical Glyphs
      cameraIcons = Array.from({ length: 16 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height * 2.6,
        type: ['aperture', 'camera', 'lens', 'crosshair', 'dial'][Math.floor(Math.random() * 5)],
        size: 26 + Math.random() * 38,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.008,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        depth: 0.25 + Math.random() * 0.75,
        alpha: 0.18 + Math.random() * 0.32
      }));
    }

    // ==========================================
    // THEME 3: HI-FI STUDIO & MUSIC DATA (VIVO X300 + JBL + ONEPLUS)
    // ==========================================
    let hifiGlyphs = [];
    let hifiEquaBars = [];
    let hifiSpatialNodes = [];

    function initHiFiTheme() {
      // 1. Floating Acoustic Gear Glyphs (JBL Headphones, OnePlus Buds, 3.5mm Gold Jack, Soundwaves, Hi-Res Badge)
      hifiGlyphs = Array.from({ length: 20 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height * 2.6,
        type: ['headphones', 'earbud', 'jack', 'soundwave', 'hires'][Math.floor(Math.random() * 5)],
        size: 32 + Math.random() * 34,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.006,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        depth: 0.25 + Math.random() * 0.75,
        alpha: 0.16 + Math.random() * 0.32,
        pulseOffset: Math.random() * Math.PI * 2
      }));

      // 2. 48-Band Frequency Equalizer Spectrum
      hifiEquaBars = Array.from({ length: 48 }, (_, i) => ({
        index: i,
        baseHeight: 15 + Math.random() * 45,
        speed: 0.08 + (i % 6) * 0.02,
        phase: Math.random() * Math.PI * 2,
        decay: 0.94
      }));

      // 3. 3D Spatial Audio Sphere Nodes (36 spatial channels distributed on sphere)
      hifiSpatialNodes = [];
      const numNodes = 36;
      for (let i = 0; i < numNodes; i++) {
        const phi = Math.acos(-1 + (2 * i) / numNodes);
        const theta = Math.sqrt(numNodes * Math.PI) * phi;
        hifiSpatialNodes.push({
          x: Math.cos(theta) * Math.sin(phi),
          y: Math.sin(theta) * Math.sin(phi),
          z: Math.cos(phi),
          phase: i * 0.22,
          speed: 0.04 + (i % 4) * 0.015
        });
      }
    }

    // ==========================================
    // THEME 4: CAT REALM (NEKO LUXE) DATA
    // ==========================================
    let catYarnBalls = [];
    let catFishTreats = [];
    let catConstellations = [];
    let catFloatingPaws = [];

    function initCatTheme() {
      // 1. Floating Glowing Yarn Balls with Dynamic String Physics
      const yarnColors = ['#ff85a2', '#f72585', '#ffb703', '#34d399', '#c084fc', '#fb7185', '#38bdf8'];
      catYarnBalls = Array.from({ length: 7 }, (_, i) => ({
        x: (width * (0.12 + i * 0.14)) % width,
        y: (height * (0.18 + i * 0.32)) % (height * 2.5),
        radius: 20 + (i % 3) * 7,
        color: yarnColors[i % yarnColors.length],
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: 0.008 + (i % 2) * 0.006,
        depth: 0.3 + (i % 4) * 0.2
      }));

      // 2. Floating Golden Holographic Fish Treats
      catFishTreats = Array.from({ length: 12 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height * 2.6,
        size: 18 + Math.random() * 16,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.015,
        depth: 0.25 + Math.random() * 0.75,
        alpha: 0.25 + Math.random() * 0.4
      }));

      // 3. Glowing Starlight Cat Constellations
      catConstellations = [
        {
          name: 'Neko Major (Cat Face)',
          cx: width * 0.78,
          cy: height * 0.26,
          points: [
            { x: -35, y: -25 },
            { x: -15, y: -5 },
            { x: 15, y: -5 },
            { x: 35, y: -25 },
            { x: 40, y: 15 },
            { x: 0, y: 35 },
            { x: -40, y: 15 },
            { x: -35, y: -25 }
          ]
        },
        {
          name: 'Neko Minor (Paw Print)',
          cx: width * 0.18,
          cy: height * 0.65,
          points: [
            { x: 0, y: 10 },
            { x: -16, y: -12 },
            { x: -6, y: -22 },
            { x: 8, y: -22 },
            { x: 18, y: -12 }
          ]
        },
        {
          name: 'Luna Neko (Moon & Tail)',
          cx: width * 0.82,
          cy: height * 0.82,
          points: [
            { x: -20, y: -30 },
            { x: 0, y: -15 },
            { x: 15, y: 5 },
            { x: 10, y: 25 },
            { x: -5, y: 35 }
          ]
        }
      ];

      // 4. Floating Ambient Cat Paws in Background
      catFloatingPaws = Array.from({ length: 14 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height * 2.8,
        size: 20 + Math.random() * 26,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.005,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        depth: 0.2 + Math.random() * 0.8,
        alpha: 0.12 + Math.random() * 0.25,
        color: Math.random() < 0.5 ? '#ff85a2' : Math.random() < 0.8 ? '#c084fc' : '#ffb703'
      }));
    }

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
      initCameraTheme();
      initHiFiTheme();
      initCatTheme();
    }

    function onMouseMove(e) {
      mouse.targetX = (e.clientX - width / 2) * 0.035;
      mouse.targetY = (e.clientY - height / 2) * 0.035;
      mouse.clientX = e.clientX;
      mouse.clientY = e.clientY;
    }

    function onMouseLeave() {
      mouse.targetX = 0;
      mouse.targetY = 0;
      mouse.clientX = width * 0.5;
      mouse.clientY = height * 0.5;
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
      if (theme === 'camera-red') {
        lensGrad.addColorStop(0, 'rgba(0, 0, 0, 0.98)');
        lensGrad.addColorStop(0.2, 'rgba(255, 23, 68, 0.42)');
        lensGrad.addColorStop(0.45, 'rgba(225, 29, 72, 0.26)');
        lensGrad.addColorStop(0.7, 'rgba(255, 145, 0, 0.14)');
        lensGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        lensGrad.addColorStop(0, 'rgba(0, 0, 0, 0.98)');
        lensGrad.addColorStop(0.2, 'rgba(249, 115, 22, 0.38)');
        lensGrad.addColorStop(0.45, 'rgba(168, 85, 247, 0.22)');
        lensGrad.addColorStop(0.7, 'rgba(56, 189, 248, 0.12)');
        lensGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      }
      ctx.fillStyle = lensGrad;
      ctx.beginPath();
      ctx.arc(0, 0, diskR * 1.6, 0, Math.PI * 2);
      ctx.fill();

      // 2. Collimated Relativistic Polar Jets (shooting above & below)
      const jetLength = 340 * intensity;
      const jetGrad = ctx.createLinearGradient(0, -jetLength, 0, jetLength);
      if (theme === 'camera-red') {
        jetGrad.addColorStop(0, 'rgba(255, 23, 68, 0)');
        jetGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0.85)');
        jetGrad.addColorStop(0.5, 'rgba(255, 23, 68, 0.95)');
        jetGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0.85)');
        jetGrad.addColorStop(1, 'rgba(255, 23, 68, 0)');
      } else {
        jetGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
        jetGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0.75)');
        jetGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.85)');
        jetGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0.75)');
        jetGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      }

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
      if (theme === 'camera-red') {
        upperWarpGrad.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
        upperWarpGrad.addColorStop(0.25, 'rgba(255, 82, 82, 0.85)');
        upperWarpGrad.addColorStop(0.65, 'rgba(213, 0, 0, 0.45)');
        upperWarpGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        upperWarpGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        upperWarpGrad.addColorStop(0.25, 'rgba(253, 186, 116, 0.8)');
        upperWarpGrad.addColorStop(0.65, 'rgba(234, 88, 12, 0.4)');
        upperWarpGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      }
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
      if (theme === 'camera-red') {
        lowerWarpGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        lowerWarpGrad.addColorStop(0.3, 'rgba(255, 23, 68, 0.7)');
        lowerWarpGrad.addColorStop(0.7, 'rgba(183, 28, 28, 0.3)');
        lowerWarpGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        lowerWarpGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
        lowerWarpGrad.addColorStop(0.3, 'rgba(251, 146, 60, 0.6)');
        lowerWarpGrad.addColorStop(0.7, 'rgba(194, 65, 12, 0.25)');
        lowerWarpGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      }
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
        if (theme === 'camera-red') {
          ringGrad.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
          ringGrad.addColorStop(0.22, 'rgba(255, 82, 82, 0.85)');
          ringGrad.addColorStop(0.5, 'rgba(255, 23, 68, 0.55)');
          ringGrad.addColorStop(0.8, 'rgba(183, 28, 28, 0.25)');
          ringGrad.addColorStop(1, 'rgba(90, 0, 10, 0.1)');
        } else {
          ringGrad.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
          ringGrad.addColorStop(0.22, 'rgba(254, 215, 170, 0.85)');
          ringGrad.addColorStop(0.5, 'rgba(249, 115, 22, 0.45)');
          ringGrad.addColorStop(0.8, 'rgba(194, 65, 12, 0.22)');
          ringGrad.addColorStop(1, 'rgba(124, 45, 18, 0.08)');
        }

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
          ctx.fillStyle =
            theme === 'camera-red'
              ? p % 3 === 0
                ? '#ffffff'
                : p % 3 === 1
                ? '#ff8a80'
                : '#ff1744'
              : p % 3 === 0
              ? '#ffffff'
              : p % 3 === 1
              ? '#fed7aa'
              : '#fb923c';
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
      ctx.strokeStyle = theme === 'camera-red' ? '#ff5252' : '#ffffff';
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
    // RENDER: DYNAMIC CAMERA VIEWFINDER HUD & BOKEH (CAMERA RED THEME)
    // ==========================================
    function drawCameraViewfinder() {
      // 1. Out-of-Focus Optical Bokeh Orbs (soft crimson & amber glowing discs)
      bokeh.forEach((b) => {
        // Move with drift
        b.x += b.vx;
        b.y += b.vy;
        if (b.x < -100) b.x = width + 100;
        if (b.x > width + 100) b.x = -100;
        if (b.y < -100) b.y = height * 2.8;
        if (b.y > height * 2.8) b.y = -100;

        const drawY = (b.y - smoothScroll * b.depth * 0.4) % (height + 150);
        let finalY = drawY < -100 ? drawY + height + 150 : drawY;
        let finalX = b.x + mouse.x * b.depth * 1.2;

        const pulse = Math.sin(frame * b.pulseSpeed + b.pulsePhase);
        const currentAlpha = Math.max(0.04, b.baseAlpha + pulse * 0.05);

        ctx.save();
        const grad = ctx.createRadialGradient(finalX, finalY, b.radius * 0.15, finalX, finalY, b.radius);
        grad.addColorStop(0, b.color === '#ff1744' ? 'rgba(255, 23, 68, 0.45)' : b.color === '#ff5252' ? 'rgba(255, 82, 82, 0.4)' : 'rgba(255, 145, 0, 0.35)');
        grad.addColorStop(0.5, b.color === '#ff1744' ? 'rgba(255, 23, 68, 0.18)' : 'rgba(255, 82, 82, 0.14)');
        grad.addColorStop(0.85, 'rgba(255, 23, 68, 0.04)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(finalX, finalY, b.radius, 0, Math.PI * 2);
        ctx.fill();

        // Thin bokeh rim reflection
        ctx.strokeStyle = b.color;
        ctx.globalAlpha = currentAlpha * 0.4;
        ctx.lineWidth = 0.75;
        ctx.beginPath();
        ctx.arc(finalX, finalY, b.radius * 0.98, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });

      // 2. Floating Camera & Optical Glyphs (Apertures, Retro Cams, Lens Barrels, Crosshairs)
      cameraIcons.forEach((ico) => {
        ico.x += ico.vx;
        ico.y += ico.vy;
        ico.rot += ico.rotSpeed;

        if (ico.x < -60) ico.x = width + 60;
        if (ico.x > width + 60) ico.x = -60;
        if (ico.y < -60) ico.y = height * 2.6;
        if (ico.y > height * 2.6) ico.y = -60;

        const drawY = (ico.y - smoothScroll * ico.depth * 0.35) % (height + 100);
        let finalY = drawY < -60 ? drawY + height + 100 : drawY;
        let finalX = ico.x + mouse.x * ico.depth;

        ctx.save();
        ctx.translate(finalX, finalY);
        ctx.rotate(ico.rot);
        ctx.globalAlpha = ico.alpha;
        ctx.strokeStyle = '#ff1744';
        ctx.fillStyle = 'rgba(255, 23, 68, 0.08)';
        ctx.lineWidth = 1.0;

        if (ico.type === 'aperture') {
          // 6-blade iris aperture
          ctx.beginPath();
          ctx.arc(0, 0, ico.size * 0.5, 0, Math.PI * 2);
          ctx.stroke();
          for (let b = 0; b < 6; b++) {
            ctx.rotate(Math.PI / 3);
            ctx.beginPath();
            ctx.moveTo(ico.size * 0.16, 0);
            ctx.lineTo(ico.size * 0.5, ico.size * 0.12);
            ctx.stroke();
          }
        } else if (ico.type === 'camera') {
          // Minimalist camera silhouette
          const s = ico.size * 0.4;
          ctx.strokeRect(-s, -s * 0.65, s * 2, s * 1.3);
          // Top pentaprism bump
          ctx.beginPath();
          ctx.moveTo(-s * 0.4, -s * 0.65);
          ctx.lineTo(0, -s * 0.95);
          ctx.lineTo(s * 0.4, -s * 0.65);
          ctx.stroke();
          // Lens circle
          ctx.beginPath();
          ctx.arc(0, s * 0.05, s * 0.45, 0, Math.PI * 2);
          ctx.stroke();
        } else if (ico.type === 'lens') {
          // Optical glass element cross-section
          const s = ico.size * 0.45;
          ctx.beginPath();
          ctx.arc(0, 0, s, 0, Math.PI * 2);
          ctx.arc(0, 0, s * 0.65, 0, Math.PI * 2);
          ctx.stroke();
        } else if (ico.type === 'crosshair') {
          // Precise target focus reticle
          const s = ico.size * 0.35;
          ctx.beginPath();
          ctx.arc(0, 0, s, 0, Math.PI * 2);
          ctx.moveTo(-s * 1.3, 0); ctx.lineTo(s * 1.3, 0);
          ctx.moveTo(0, -s * 1.3); ctx.lineTo(0, s * 1.3);
          ctx.stroke();
        } else {
          // Exposure dial / mode dial
          const s = ico.size * 0.4;
          ctx.beginPath();
          ctx.arc(0, 0, s, 0, Math.PI * 2);
          ctx.stroke();
          for (let d = 0; d < 8; d++) {
            ctx.rotate(Math.PI / 4);
            ctx.beginPath();
            ctx.moveTo(s * 0.8, 0);
            ctx.lineTo(s, 0);
            ctx.stroke();
          }
        }
        ctx.restore();
      });

      // 3. Viewfinder Rule-of-Thirds Grid (Crisp Crimson Dashed Overlay)
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 23, 68, 0.12)';
      ctx.lineWidth = 0.8;
      ctx.setLineDash([4, 10]);
      // Vertical grid lines
      const w1 = width / 3;
      const w2 = (width * 2) / 3;
      ctx.beginPath();
      ctx.moveTo(w1, 0); ctx.lineTo(w1, height);
      ctx.moveTo(w2, 0); ctx.lineTo(w2, height);
      // Horizontal grid lines
      const h1 = height / 3;
      const h2 = (height * 2) / 3;
      ctx.moveTo(0, h1); ctx.lineTo(width, h1);
      ctx.moveTo(0, h2); ctx.lineTo(width, h2);
      ctx.stroke();
      ctx.setLineDash([]); // reset

      // 4. Viewfinder 4-Corner Framing Brackets
      const margin = Math.min(36, width * 0.04);
      const bracketLen = Math.min(32, width * 0.06);
      ctx.strokeStyle = 'rgba(255, 23, 68, 0.48)';
      ctx.lineWidth = 1.6;

      // Top-Left
      ctx.beginPath();
      ctx.moveTo(margin + bracketLen, margin);
      ctx.lineTo(margin, margin);
      ctx.lineTo(margin, margin + bracketLen);
      ctx.stroke();

      // Top-Right
      ctx.beginPath();
      ctx.moveTo(width - margin - bracketLen, margin);
      ctx.lineTo(width - margin, margin);
      ctx.lineTo(width - margin, margin + bracketLen);
      ctx.stroke();

      // Bottom-Left
      ctx.beginPath();
      ctx.moveTo(margin, height - margin - bracketLen);
      ctx.lineTo(margin, height - margin);
      ctx.lineTo(margin + bracketLen, height - margin);
      ctx.stroke();

      // Bottom-Right
      ctx.beginPath();
      ctx.moveTo(width - margin - bracketLen, height - margin);
      ctx.lineTo(width - margin, height - margin);
      ctx.lineTo(width - margin, height - margin - bracketLen);
      ctx.stroke();

      // 5. Central Viewfinder Rangefinder Cross & Center Mark
      const cx = width * 0.5;
      const cy = height * 0.5;
      ctx.strokeStyle = 'rgba(255, 23, 68, 0.35)';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(cx - 18, cy); ctx.lineTo(cx - 6, cy);
      ctx.moveTo(cx + 6, cy); ctx.lineTo(cx + 18, cy);
      ctx.moveTo(cx, cy - 18); ctx.lineTo(cx, cy - 6);
      ctx.moveTo(cx, cy + 6); ctx.lineTo(cx, cy + 18);
      ctx.stroke();

      // Center ring
      ctx.beginPath();
      ctx.arc(cx, cy, 32, 0, Math.PI * 2);
      ctx.stroke();

      // 6. Interactive Autofocus Bracket [ AF-C ] smoothly tracking cursor
      const targetAFX = mouse.clientX || width * 0.5;
      const targetAFY = mouse.clientY || height * 0.5;
      afBox.x += (targetAFX - afBox.x) * 0.12;
      afBox.y += (targetAFY - afBox.y) * 0.12;

      const afSize = 24;
      ctx.strokeStyle = '#ff1744';
      ctx.lineWidth = 1.4;
      ctx.shadowColor = 'rgba(255, 23, 68, 0.7)';
      ctx.shadowBlur = 8;

      // 4 corners of AF target box
      ctx.beginPath();
      // TL
      ctx.moveTo(afBox.x - afSize, afBox.y - afSize + 8);
      ctx.lineTo(afBox.x - afSize, afBox.y - afSize);
      ctx.lineTo(afBox.x - afSize + 8, afBox.y - afSize);
      // TR
      ctx.moveTo(afBox.x + afSize - 8, afBox.y - afSize);
      ctx.lineTo(afBox.x + afSize, afBox.y - afSize);
      ctx.lineTo(afBox.x + afSize, afBox.y - afSize + 8);
      // BL
      ctx.moveTo(afBox.x - afSize, afBox.y + afSize - 8);
      ctx.lineTo(afBox.x - afSize, afBox.y + afSize);
      ctx.lineTo(afBox.x - afSize + 8, afBox.y + afSize);
      // BR
      ctx.moveTo(afBox.x + afSize - 8, afBox.y + afSize);
      ctx.lineTo(afBox.x + afSize, afBox.y + afSize);
      ctx.lineTo(afBox.x + afSize, afBox.y + afSize - 8);
      ctx.stroke();

      // AF-C label & lock dot
      ctx.fillStyle = '#ff1744';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillText('AF-C', afBox.x + afSize + 4, afBox.y - afSize + 10);
      ctx.beginPath();
      ctx.arc(afBox.x, afBox.y, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0; // reset

      // 7. Viewfinder Top Telemetry HUD
      // Blinking ● REC indicator
      const blink = Math.floor(frame / 28) % 2 === 0;
      if (blink) {
        ctx.fillStyle = '#ff1744';
        ctx.beginPath();
        ctx.arc(margin + 12, margin + 14, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#ff1744';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillText('REC', margin + 24, margin + 18);

      // Running Timecode
      const totalSec = Math.floor(frame / 60);
      const hrs = '00';
      const mins = String(Math.floor(totalSec / 60) % 60).padStart(2, '0');
      const secs = String(totalSec % 60).padStart(2, '0');
      const frames = String(frame % 60).padStart(2, '0');
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillText(`${hrs}:${mins}:${secs}:${frames}`, margin + 60, margin + 18);

      // Codec & Format Info
      ctx.fillStyle = 'rgba(255, 23, 68, 0.75)';
      ctx.fillText('4K 60P HDR // PRORES 422HQ', margin + 180, margin + 18);

      // Top Right: Battery & Storage Meter
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.fillText('BAT [92%]  •  RAW+FINE [128GB]', width - margin - 220, margin + 18);

      // 8. Viewfinder Bottom Exposure & Dynamic Focal Length Bar
      // Calculates current focal length based on scrollRatio:
      // 0.00-0.25: 24mm (Ultra-Wide, f/1.4)
      // 0.25-0.55: 50mm (Standard Prime, f/1.8)
      // 0.55-0.80: 85mm (Portrait Bokeh, f/1.4)
      // 0.80-1.00: 135mm (Telephoto Compression, f/2.8)
      const docH = document.documentElement.scrollHeight || 1;
      const winH = window.innerHeight || 1;
      const maxSc = Math.max(1, docH - winH);
      const curScrollRatio = Math.min(Math.max(smoothScroll / maxSc, 0), 1);

      let currentFocal = 24;
      let currentAperture = 'f/1.4';
      let focalLabel = 'ULTRA-WIDE';
      if (curScrollRatio < 0.28) {
        currentFocal = Math.round(24 + curScrollRatio * (50 - 24) / 0.28);
        currentAperture = 'f/1.4';
        focalLabel = 'WIDE-ANGLE';
      } else if (curScrollRatio < 0.58) {
        currentFocal = Math.round(50 + (curScrollRatio - 0.28) * (85 - 50) / 0.30);
        currentAperture = 'f/1.8';
        focalLabel = 'STANDARD PRIME';
      } else if (curScrollRatio < 0.82) {
        currentFocal = Math.round(85 + (curScrollRatio - 0.58) * (135 - 85) / 0.24);
        currentAperture = 'f/1.4';
        focalLabel = 'PORTRAIT BOKEH';
      } else {
        currentFocal = Math.round(135 + (curScrollRatio - 0.82) * (200 - 135) / 0.18);
        currentAperture = 'f/2.8';
        focalLabel = 'TELEPHOTO COMP';
      }

      const bY = height - margin - 8;
      ctx.fillStyle = '#ff1744';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillText(currentAperture, margin + 10, bY);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.fillText('1/8000s', margin + 60, bY);
      ctx.fillText('ISO 100', margin + 125, bY);
      ctx.fillText('EV +0.0', margin + 185, bY);
      ctx.fillText('WB 5600K', margin + 245, bY);

      // Dynamic Animated Lens Focal Dial Markings
      ctx.save();
      const dialX = margin + 330;
      ctx.fillStyle = '#ff1744';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillText(`${currentFocal}mm`, dialX, bY);

      ctx.fillStyle = 'rgba(255, 23, 68, 0.55)';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillText(`[ ${focalLabel} ]`, dialX + 48, bY);

      // Rotating Lens Barrel Tick Marks
      const dialTickOffset = (smoothScroll * 0.15) % 16;
      ctx.strokeStyle = 'rgba(255, 23, 68, 0.4)';
      ctx.lineWidth = 1;
      for (let t = -3; t <= 3; t++) {
        const tx = dialX + 175 + t * 14 - dialTickOffset;
        if (tx > dialX + 140 && tx < dialX + 215) {
          ctx.beginPath();
          ctx.moveTo(tx, bY - 10);
          ctx.lineTo(tx, bY);
          ctx.stroke();
        }
      }
      ctx.restore();

      ctx.fillStyle = 'rgba(255, 23, 68, 0.85)';
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.fillText('[ VIVO X300 OPTICS ]', width - margin - 265, bY);

      // 9. Live Real-Time RGB Waveform / Histogram Monitor (Bottom Right)
      const histX = width - margin - 90;
      const histY = bY - 16;
      const histW = 80;
      const histH = 22;

      // Monitor background
      ctx.fillStyle = 'rgba(10, 2, 4, 0.65)';
      ctx.fillRect(histX, histY, histW, histH);
      ctx.strokeStyle = 'rgba(255, 23, 68, 0.35)';
      ctx.lineWidth = 0.8;
      ctx.strokeRect(histX, histY, histW, histH);

      // Dynamic Waveform peaks
      ctx.beginPath();
      ctx.strokeStyle = '#ff1744';
      ctx.lineWidth = 1.0;
      for (let i = 0; i < histW; i += 3) {
        const hVal = Math.sin(frame * 0.12 + i * 0.2) * 5 + Math.cos(frame * 0.08 + i * 0.35) * 4 + 11;
        if (i === 0) ctx.moveTo(histX + i, histY + histH - hVal);
        else ctx.lineTo(histX + i, histY + histH - hVal);
      }
      ctx.stroke();

      // Green & Blue sub-traces
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 145, 0, 0.5)';
      ctx.lineWidth = 0.7;
      for (let i = 0; i < histW; i += 4) {
        const hVal2 = Math.cos(frame * 0.14 + i * 0.18) * 4 + 9;
        if (i === 0) ctx.moveTo(histX + i, histY + histH - hVal2);
        else ctx.lineTo(histX + i, histY + histH - hVal2);
      }
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 23, 68, 0.8)';
      ctx.font = '7px "JetBrains Mono", monospace';
      ctx.fillText('RGB WAVE', histX + 4, histY + 8);

      // 10. Fast-Scroll Anamorphic Lens Flare & Optical Streaks
      const scrollVel = Math.abs(targetScroll - smoothScroll);
      if (scrollVel > 12) {
        const streakAlpha = Math.min(0.4, (scrollVel - 12) * 0.015);
        ctx.save();
        ctx.strokeStyle = `rgba(255, 23, 68, ${streakAlpha})`;
        ctx.lineWidth = 1.2;
        ctx.shadowColor = '#ff1744';
        ctx.shadowBlur = 10;
        const streakY = (frame * 18) % height;
        ctx.beginPath();
        ctx.moveTo(0, streakY);
        ctx.lineTo(width, streakY);
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore();
    }

    // ==========================================
    // THEME 3: FUTURISTIC 3D HI-FI STUDIO & MUSIC ENGINE (VIVO X300 + JBL + ONEPLUS)
    // ==========================================
    function drawHiFiStudio(scrollRatio = 0) {
      const cx = width * 0.5;
      const cy = height * 0.48;

      // 3D Perspective Rotation Matrix (Mouse Gyro + Frame Harmonic Drift)
      const yaw = ((mouse.clientX - cx) / Math.max(1, width)) * 0.45 + Math.sin(frame * 0.012) * 0.08;
      const pitch = ((mouse.clientY - cy) / Math.max(1, height)) * 0.35 + 0.12;
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const cosP = Math.cos(pitch);
      const sinP = Math.sin(pitch);

      function project3D(px, py, pz, ox = cx, oy = cy) {
        // Rotate Y
        const x1 = px * cosY + pz * sinY;
        const z1 = -px * sinY + pz * cosY;
        // Rotate X
        const y2 = py * cosP - z1 * sinP;
        const z2 = py * sinP + z1 * cosP + 500;
        if (z2 <= 30) return null;
        const scale = 420 / z2;
        return {
          x: ox + x1 * scale,
          y: oy + y2 * scale,
          scale,
          z: z2
        };
      }

      ctx.save();

      // Four Stage Morphing Weights based on scroll progression:
      // Stage 1 (0.00 - 0.28): Hero - Vivo X300 Flagship Hologram + 3D Orbital Gyro Rings
      // Stage 2 (0.20 - 0.56): Selected Work - 3D Cyber Bass Terrain Mesh & JBL Resonance Tunnel
      // Stage 3 (0.48 - 0.78): Gallery / Retouch - 3D OnePlus Spatial Audio Soundfield Sphere
      // Stage 4 (0.72 - 1.00): Contact - 3D Studio Master Equalizer Deck & DAC Floor
      const w1 = Math.max(0, 1 - scrollRatio / 0.28);
      const w2 = Math.max(0, Math.min(1, (scrollRatio - 0.18) / 0.1) * Math.min(1, (0.56 - scrollRatio) / 0.1));
      const w3 = Math.max(0, Math.min(1, (scrollRatio - 0.46) / 0.1) * Math.min(1, (0.78 - scrollRatio) / 0.1));
      const w4 = Math.max(0, (scrollRatio - 0.70) / 0.15);

      // ----------------------------------------------------
      // STAGE 1: VIVO X300 3D HOLOGRAPHIC FLAGSHIP POD
      // ----------------------------------------------------
      if (w1 > 0.01) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, w1);

        const phoneY = cy - 20 + Math.sin(frame * 0.04) * 12;

        // 3D Gyroscopic Concentric Sound Orbitals encircling the Vivo X300
        const gyroAngles = [
          { r: 160, tiltX: 1.1, rotSpeed: 0.018, color: '#00e676', dash: [8, 14] },
          { r: 220, tiltX: -0.85, rotSpeed: -0.014, color: '#06b6d4', dash: [4, 18] },
          { r: 290, tiltX: 0.65, rotSpeed: 0.01, color: '#ff6d00', dash: [12, 24] }
        ];

        gyroAngles.forEach((gyro, gIdx) => {
          const gRot = frame * gyro.rotSpeed + gIdx * 1.2;
          ctx.save();
          ctx.translate(cx, phoneY);
          ctx.rotate(gRot);
          ctx.scale(1, Math.cos(gyro.tiltX) * 0.65);
          ctx.strokeStyle = gyro.color;
          ctx.lineWidth = 1.4;
          ctx.setLineDash(gyro.dash);
          ctx.shadowColor = gyro.color;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(0, 0, gyro.r, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.restore();
        });

        // Acoustic Radiation Beams from Phone DAC
        for (let b = 0; b < 6; b++) {
          const bAngle = (b / 6) * Math.PI * 2 + frame * 0.008;
          const bLen = 170 + Math.sin(frame * 0.06 + b) * 45;
          const bx = cx + Math.cos(bAngle) * bLen;
          const by = phoneY + Math.sin(bAngle) * (bLen * 0.5);
          ctx.strokeStyle = b % 2 === 0 ? 'rgba(0, 230, 118, 0.25)' : 'rgba(6, 182, 212, 0.25)';
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.moveTo(cx, phoneY);
          ctx.lineTo(bx, by);
          ctx.stroke();

          // Satellite beacon dot
          ctx.fillStyle = b % 2 === 0 ? '#00e676' : '#06b6d4';
          ctx.beginPath();
          ctx.arc(bx, by, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // 3D Center Acoustic Nexus Core (Inside Gyro Rings)
        const coreR = Math.max(16, 26 + Math.sin(frame * 0.08) * 8);
        const coreGrad = ctx.createRadialGradient(cx, phoneY, 2, cx, phoneY, coreR * 2.4);
        coreGrad.addColorStop(0, 'rgba(0, 230, 118, 0.75)');
        coreGrad.addColorStop(0.45, 'rgba(6, 182, 212, 0.35)');
        coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(cx, phoneY, coreR * 2.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#00e676';
        ctx.lineWidth = 1.4;
        ctx.shadowColor = '#00e676';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(cx, phoneY, coreR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Animated circular soundwave pulse
        const pulseR = coreR + ((frame * 1.5) % 80);
        const pulseAlpha = Math.max(0, 0.5 - (pulseR - coreR) / 80);
        ctx.strokeStyle = `rgba(0, 230, 118, ${pulseAlpha})`;
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.arc(cx, phoneY, pulseR, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#00e676';
        ctx.font = 'bold 10px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('384kHz DAC', cx, phoneY - 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillText('LOSSLESS', cx, phoneY + 11);
        ctx.textAlign = 'left';

        ctx.restore();
      }

      // ----------------------------------------------------
      // STAGE 2: 3D CYBER-ACOUSTIC WAVEFORM TERRAIN GRID (JBL BASS TUNNEL)
      // ----------------------------------------------------
      if (w2 > 0.01) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, w2);

        const cols = 22;
        const rows = 14;
        const gridPoints = [];

        for (let r = 0; r < rows; r++) {
          gridPoints[r] = [];
          for (let c = 0; c < cols; c++) {
            const gx = (c - cols * 0.5) * 55;
            const gz = r * 50 + 40;
            // Undulating harmonic JBL bass wave
            const bassWave = Math.sin(frame * 0.08 + c * 0.45) * 28 + Math.cos(frame * 0.05 + r * 0.5) * 22;
            const gy = 110 + bassWave;
            const p = project3D(gx, gy, gz);
            gridPoints[r][c] = p;
          }
        }

        // Draw horizontal perspective wave lines
        for (let r = 0; r < rows; r++) {
          const depthAlpha = Math.max(0.05, 1 - (r / rows) * 0.85);
          ctx.strokeStyle = r % 2 === 0 ? `rgba(0, 230, 118, ${depthAlpha * 0.8})` : `rgba(6, 182, 212, ${depthAlpha * 0.8})`;
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          let started = false;
          for (let c = 0; c < cols; c++) {
            const pt = gridPoints[r][c];
            if (!pt) continue;
            if (!started) { ctx.moveTo(pt.x, pt.y); started = true; }
            else ctx.lineTo(pt.x, pt.y);
          }
          ctx.stroke();
        }

        // Draw longitudinal perspective tunnel lines
        for (let c = 0; c < cols; c += 2) {
          ctx.strokeStyle = `rgba(0, 230, 118, 0.35)`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          let started = false;
          for (let r = 0; r < rows; r++) {
            const pt = gridPoints[r][c];
            if (!pt) continue;
            if (!started) { ctx.moveTo(pt.x, pt.y); started = true; }
            else ctx.lineTo(pt.x, pt.y);
          }
          ctx.stroke();
        }

        // 3D JBL Subwoofer Bass Tunnel Arches
        for (let a = 1; a <= 4; a++) {
          const archZ = (a * 150 + frame * 1.5) % 650 + 50;
          const archCenter = project3D(0, 40, archZ);
          if (archCenter) {
            const archR = 180 * archCenter.scale;
            ctx.strokeStyle = '#00e676';
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.arc(archCenter.x, archCenter.y, Math.max(6, archR), Math.PI * 0.9, Math.PI * 2.1);
            ctx.stroke();
          }
        }

        ctx.restore();
      }

      // ----------------------------------------------------
      // STAGE 3: 3D ONEPLUS SPATIAL AUDIO SOUNDFIELD SPHERE
      // ----------------------------------------------------
      if (w3 > 0.01) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, w3);

        const sphereRad = Math.min(width * 0.25, 230);
        const projectedNodes = [];

        // Project 36 spatial audio coordinate channels
        hifiSpatialNodes.forEach((node, nIdx) => {
          const orbitAngle = frame * node.speed + node.phase;
          const ox = Math.cos(orbitAngle) * (node.x * sphereRad);
          const oy = node.y * sphereRad;
          const oz = Math.sin(orbitAngle) * (node.z * sphereRad);

          const proj = project3D(ox, oy, oz);
          if (proj) {
            projectedNodes.push({ ...proj, nIdx });
          }
        });

        // Draw spatial constellation laser links between nearest channels
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.22)';
        ctx.lineWidth = 0.8;
        for (let i = 0; i < projectedNodes.length; i++) {
          for (let j = i + 1; j < Math.min(i + 4, projectedNodes.length); j++) {
            const p1 = projectedNodes[i];
            const p2 = projectedNodes[j];
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Draw spatial channel nodes with dynamic audio pulse
        projectedNodes.forEach((p) => {
          const pulse = Math.sin(frame * 0.12 + p.nIdx) * 1.5;
          const r = Math.max(2, 3.5 * p.scale + pulse);

          ctx.fillStyle = p.nIdx % 2 === 0 ? '#00e676' : '#06b6d4';
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fill();

          // Outer acoustic halo
          ctx.strokeStyle = 'rgba(0, 230, 118, 0.4)';
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r * 2.2, 0, Math.PI * 2);
          ctx.stroke();
        });

        // Center -48dB Smart Adaptive ANC Phase Cancellation Beacon
        const ancR = (frame * 1.2) % 140;
        const ancAlpha = Math.max(0, 0.4 - ancR / 140);
        ctx.strokeStyle = `rgba(0, 230, 118, ${ancAlpha})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(cx, cy, ancR, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#00e676';
        ctx.font = 'bold 10px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('ONEPLUS SPATIAL AUDIO • -48dB ANC MATRIX', cx, cy + 8);
        ctx.textAlign = 'left';

        ctx.restore();
      }

      // ----------------------------------------------------
      // STAGE 4: 3D STUDIO MASTER EQUALIZER DECK & DAC FLOOR
      // ----------------------------------------------------
      if (w4 > 0.01) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, w4);

        // 3D Isometric Audio Equalizer Towers rising from floor
        const numTowers = 24;
        for (let t = 0; t < numTowers; t++) {
          const tx = (t - numTowers * 0.5) * 36;
          const tz = 260 + (t % 3) * 45;
          const tWave = Math.sin(frame * 0.1 + t * 0.35);
          const tH = 30 + Math.abs(tWave) * 90;

          // Tower Base and Top in 3D
          const b1 = project3D(tx - 12, 140, tz);
          const b2 = project3D(tx + 12, 140, tz);
          const top1 = project3D(tx - 12, 140 - tH, tz);
          const top2 = project3D(tx + 12, 140 - tH, tz);

          if (b1 && b2 && top1 && top2) {
            ctx.fillStyle = t % 2 === 0 ? 'rgba(0, 230, 118, 0.45)' : 'rgba(6, 182, 212, 0.45)';
            ctx.beginPath();
            ctx.moveTo(b1.x, b1.y);
            ctx.lineTo(b2.x, b2.y);
            ctx.lineTo(top2.x, top2.y);
            ctx.lineTo(top1.x, top1.y);
            ctx.closePath();
            ctx.fill();

            // Peak cap needle
            ctx.fillStyle = '#ff6d00';
            ctx.fillRect(top1.x, top1.y - 4, (top2.x - top1.x), 2.5);
          }
        }

        ctx.restore();
      }

      // ----------------------------------------------------
      // FLOATING 3D ACOUSTIC GEAR SILHOUETTES (JBL & ONEPLUS)
      // ----------------------------------------------------
      hifiGlyphs.forEach((g) => {
        g.x += g.vx;
        g.y += g.vy;
        g.rot += g.rotSpeed;

        if (g.x < -60) g.x = width + 60;
        if (g.x > width + 60) g.x = -60;
        if (g.y < -60) g.y = height * 2.6;
        if (g.y > height * 2.6) g.y = -60;

        const drawY = (g.y - smoothScroll * g.depth * 0.35) % (height + 100);
        let finalY = drawY < -60 ? drawY + height + 100 : drawY;
        let finalX = g.x + mouse.x * g.depth * 1.2;

        ctx.save();
        ctx.translate(finalX, finalY);
        ctx.rotate(g.rot);
        ctx.globalAlpha = g.alpha * 0.75;
        ctx.strokeStyle = '#00e676';
        ctx.fillStyle = 'rgba(0, 230, 118, 0.08)';
        ctx.lineWidth = 1.0;

        const s = g.size * 0.45;

        if (g.type === 'headphones') {
          // JBL Over-Ear Headphone Silhouette
          ctx.beginPath();
          ctx.arc(0, -s * 0.3, s * 0.9, Math.PI * 0.9, Math.PI * 2.1);
          ctx.lineWidth = 2.0;
          ctx.stroke();
          ctx.lineWidth = 1.0;
          ctx.strokeRect(-s * 1.1, -s * 0.2, s * 0.45, s * 0.95);
          ctx.strokeRect(s * 0.65, -s * 0.2, s * 0.45, s * 0.95);
          ctx.fillStyle = '#ff6d00';
          ctx.beginPath();
          ctx.arc(-s * 0.88, s * 0.28, 2.5, 0, Math.PI * 2);
          ctx.arc(s * 0.88, s * 0.28, 2.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (g.type === 'earbud') {
          // OnePlus In-Ear Driver + Metallic Stem
          ctx.beginPath();
          ctx.arc(-s * 0.1, -s * 0.3, s * 0.48, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(-s * 0.1, -s * 0.05);
          ctx.lineTo(s * 0.15, s * 0.9);
          ctx.lineWidth = 2.4;
          ctx.stroke();
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.arc(-s * 0.45, -s * 0.3, s * 0.22, 0, Math.PI * 2);
          ctx.stroke();
        } else if (g.type === 'jack') {
          // 3.5mm Gold-Plated Audio Jack Plug
          ctx.fillStyle = '#fbbf24';
          ctx.fillRect(-s * 0.18, -s * 0.8, s * 0.36, s * 0.85);
          ctx.strokeStyle = '#00e676';
          ctx.strokeRect(-s * 0.3, 0, s * 0.6, s * 0.8);
          ctx.fillStyle = '#05080c';
          ctx.fillRect(-s * 0.2, -s * 0.48, s * 0.4, 2);
          ctx.fillRect(-s * 0.2, -s * 0.25, s * 0.4, 2);
        } else if (g.type === 'soundwave') {
          for (let b = -3; b <= 3; b++) {
            const bh = (s * 0.85) * (1 - Math.abs(b) * 0.25) * (0.6 + Math.sin(frame * 0.1 + b) * 0.4);
            ctx.fillRect(b * (s * 0.26), -bh * 0.5, s * 0.16, bh);
          }
        } else {
          ctx.strokeStyle = '#fbbf24';
          ctx.strokeRect(-s * 0.8, -s * 0.55, s * 1.6, s * 1.1);
          ctx.fillStyle = '#fbbf24';
          ctx.font = 'bold 8px "JetBrains Mono", monospace';
          ctx.fillText('Hi-Res', -s * 0.55, s * 0.15);
        }
        ctx.restore();
      });

      // ----------------------------------------------------
      // BOTTOM 48-BAND FREQUENCY SPECTRUM EQUALIZER
      // ----------------------------------------------------
      const margin = Math.min(36, width * 0.04);
      const eqY = Math.max(50, height - margin - 24);
      const eqWidth = Math.min(Math.max(280, width - margin * 2), 780);
      const eqStartX = (width - eqWidth) * 0.5;
      const barW = Math.max(2, (eqWidth / 48) - 3);

      const mx = typeof mouse.clientX === 'number' && Number.isFinite(mouse.clientX) ? mouse.clientX : (width * 0.5);

      if (!hifiEquaBars || hifiEquaBars.length === 0) {
        initHiFiTheme();
      }

      ctx.save();
      for (let i = 0; i < 48; i++) {
        const bar = (hifiEquaBars && hifiEquaBars[i]) ? hifiEquaBars[i] : { speed: 0.1, phase: i * 0.1, baseHeight: 25 };
        const wave = Math.sin(frame * bar.speed + bar.phase);
        const mouseProx = Math.max(0, 1 - Math.abs(mx - (eqStartX + i * (barW + 3))) / 200);
        const barH = Math.max(6, (bar.baseHeight || 20) * (0.6 + wave * 0.4) + mouseProx * 45);

        const bx = eqStartX + i * (barW + 3);
        const by = eqY - barH;

        if (Number.isFinite(by) && Number.isFinite(eqY) && by < eqY) {
          const barGrad = ctx.createLinearGradient(0, eqY, 0, by);
          barGrad.addColorStop(0, 'rgba(0, 230, 118, 0.4)');
          barGrad.addColorStop(0.65, '#00e676');
          barGrad.addColorStop(0.88, '#06b6d4');
          barGrad.addColorStop(1, '#ff6d00');

          ctx.fillStyle = barGrad;
          ctx.fillRect(bx, by, barW, barH);
        } else {
          ctx.fillStyle = '#00e676';
          ctx.fillRect(bx, eqY - barH, barW, barH);
        }

        // Peak floating cap
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(bx, by - 2.5, barW, 1.5);
      }
      ctx.restore();

      // ----------------------------------------------------
      // TOP HI-FI TELEMETRY HUD BANNER
      // ----------------------------------------------------
      ctx.save();
      const topY = margin + 18;

      const blink = Math.floor(frame / 26) % 2 === 0;
      if (blink) {
        ctx.fillStyle = '#00e676';
        ctx.beginPath();
        ctx.arc(margin + 12, topY - 3, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#00e676';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillText('HI-RES AUDIO', margin + 24, topY);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText('32-BIT // 384KHZ LOSSLESS DAC', margin + 130, topY);

      ctx.fillStyle = 'rgba(6, 182, 212, 0.85)';
      ctx.fillText('•  LHDC 5.0 SPATIAL  •  ANC [-48dB]', margin + 350, topY);

      ctx.fillStyle = '#00e676';
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.fillText('GEAR: [ VIVO X300 × JBL × ONEPLUS ]', width - margin - 280, topY);

      // Bottom Studio Master Readout
      ctx.fillStyle = '#00e676';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillText('MASTER EQ: +3.5dB BASS BOOST', margin + 10, height - margin);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.fillText('DYNAMIC RANGE: 128dB', margin + 225, height - margin);
      ctx.fillText('LATENCY: 18ms ULTRA-LOW', margin + 400, height - margin);
      ctx.fillStyle = 'rgba(0, 230, 118, 0.85)';
      ctx.fillText('[ STEREO SOUNDSTAGE: WIDE ]', width - margin - 220, height - margin);

      ctx.restore();
    }

    // ==========================================
    // RENDER: THEME 4 - CAT REALM (NEKO LUXE)
    // ==========================================
    function drawCatRealm(scrollRatio) {
      ctx.save();

      // 1. Velvet Midnight Nebula Atmosphere
      const bgNebula = ctx.createRadialGradient(
        width * 0.5 + mouse.x * 0.4,
        height * 0.45 - smoothScroll * 0.15,
        50,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.75
      );
      bgNebula.addColorStop(0, 'rgba(45, 27, 78, 0.35)');
      bgNebula.addColorStop(0.4, 'rgba(26, 15, 48, 0.22)');
      bgNebula.addColorStop(0.8, 'rgba(13, 7, 24, 0.12)');
      bgNebula.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = bgNebula;
      ctx.fillRect(0, 0, width, height);

      // 2. Glowing Starlight Cat Constellations
      catConstellations.forEach((constellation, cIdx) => {
        ctx.save();
        const constParallaxY = (constellation.cy - smoothScroll * 0.18) % (height + 200);
        const constY = constParallaxY < -100 ? constParallaxY + height + 200 : constParallaxY;
        const constX = constellation.cx + mouse.x * 0.3;

        ctx.translate(constX, constY);

        // Draw starlight lines between points
        ctx.strokeStyle = cIdx === 0 ? 'rgba(255, 133, 162, 0.35)' : cIdx === 1 ? 'rgba(52, 211, 153, 0.35)' : 'rgba(192, 132, 252, 0.35)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        constellation.points.forEach((pt, i) => {
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw glowing star nodes
        constellation.points.forEach((pt, i) => {
          const starTwinkle = Math.sin(frame * 0.04 + i * 0.8) * 0.3 + 0.7;
          ctx.fillStyle = i % 2 === 0 ? '#ffccd5' : '#a7f3d0';
          ctx.shadowColor = '#ff85a2';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, (2.2 + starTwinkle * 1.5), 0, Math.PI * 2);
          ctx.fill();
        });

        // Constellation label
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(255, 204, 213, 0.45)';
        ctx.font = '8px "JetBrains Mono", monospace';
        ctx.fillText(constellation.name.toUpperCase(), -30, 52);
        ctx.restore();
      });

      // 3. Ambient Floating Cat Paws with gentle pulsing toe beans
      catFloatingPaws.forEach((paw) => {
        paw.x += paw.vx;
        paw.y += paw.vy;
        paw.rot += paw.rotSpeed;
        if (paw.x < -60) paw.x = width + 60;
        if (paw.x > width + 60) paw.x = -60;
        if (paw.y < -60) paw.y = height * 2.8;
        if (paw.y > height * 2.8) paw.y = -60;

        const drawY = (paw.y - smoothScroll * paw.depth * 0.3) % (height + 100);
        const finalY = drawY < -60 ? drawY + height + 100 : drawY;
        const finalX = paw.x + mouse.x * paw.depth * 0.6;

        ctx.save();
        ctx.translate(finalX, finalY);
        ctx.rotate(paw.rot);
        ctx.globalAlpha = paw.alpha;
        ctx.fillStyle = paw.color;

        const s = paw.size;
        // Main Pad
        ctx.beginPath();
        ctx.ellipse(0, s * 0.15, s * 0.38, s * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();

        // 4 Toe beans
        const toeOffsets = [
          { x: -s * 0.32, y: -s * 0.18, r: s * 0.12 },
          { x: -s * 0.12, y: -s * 0.34, r: s * 0.14 },
          { x: s * 0.12, y: -s * 0.34, r: s * 0.14 },
          { x: s * 0.32, y: -s * 0.18, r: s * 0.12 }
        ];
        toeOffsets.forEach((t) => {
          ctx.beginPath();
          ctx.arc(t.x, t.y, t.r, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.restore();
      });

      // 4. Floating Glowing Yarn Balls with Trailing Dynamic String Curves
      catYarnBalls.forEach((yarn, idx) => {
        yarn.x += yarn.vx;
        yarn.y += yarn.vy;
        yarn.rot += yarn.rotSpeed;

        if (yarn.x < -100) yarn.x = width + 100;
        if (yarn.x > width + 100) yarn.x = -100;
        if (yarn.y < -100) yarn.y = height * 2.6;
        if (yarn.y > height * 2.6) yarn.y = -100;

        const drawY = (yarn.y - smoothScroll * yarn.depth * 0.35) % (height + 140);
        const finalY = drawY < -100 ? drawY + height + 140 : drawY;
        const finalX = yarn.x + mouse.x * yarn.depth * 0.8;

        ctx.save();
        ctx.translate(finalX, finalY);

        // Trailing yarn string waving behind
        ctx.strokeStyle = yarn.color;
        ctx.lineWidth = 1.8;
        ctx.globalAlpha = 0.55;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        const stringLen = 70;
        const wave = Math.sin(frame * 0.05 + idx) * 16;
        ctx.bezierCurveTo(
          -25, wave * 0.5,
          -50, -wave,
          -stringLen, wave * 0.8
        );
        ctx.stroke();

        // Yarn Ball Outer Glow
        const yarnGrad = ctx.createRadialGradient(0, 0, yarn.radius * 0.3, 0, 0, yarn.radius * 1.5);
        yarnGrad.addColorStop(0, '#ffffff');
        yarnGrad.addColorStop(0.3, yarn.color);
        yarnGrad.addColorStop(0.8, `${yarn.color}44`);
        yarnGrad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.globalAlpha = 0.85;
        ctx.fillStyle = yarnGrad;
        ctx.beginPath();
        ctx.arc(0, 0, yarn.radius * 1.5, 0, Math.PI * 2);
        ctx.fill();

        // Yarn Ball Body with winding yarn thread lines
        ctx.rotate(yarn.rot);
        ctx.fillStyle = yarn.color;
        ctx.beginPath();
        ctx.arc(0, 0, yarn.radius, 0, Math.PI * 2);
        ctx.fill();

        // Overlapping yarn texture threads
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.4;
        ctx.globalAlpha = 0.45;
        for (let t = 0; t < 5; t++) {
          ctx.beginPath();
          ctx.ellipse(0, 0, yarn.radius * 0.9, yarn.radius * (0.2 + t * 0.15), t * (Math.PI / 5), 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.restore();
      });

      // 5. Floating Golden Holographic Fish Treats
      catFishTreats.forEach((fish) => {
        fish.x += fish.vx;
        fish.y += fish.vy;
        fish.rot += fish.rotSpeed;

        if (fish.x < -80) fish.x = width + 80;
        if (fish.x > width + 80) fish.x = -80;
        if (fish.y < -80) fish.y = height * 2.6;
        if (fish.y > height * 2.6) fish.y = -80;

        const drawY = (fish.y - smoothScroll * fish.depth * 0.32) % (height + 120);
        const finalY = drawY < -80 ? drawY + height + 120 : drawY;
        const finalX = fish.x + mouse.x * fish.depth * 0.7;

        ctx.save();
        ctx.translate(finalX, finalY);
        ctx.rotate(fish.rot);
        ctx.globalAlpha = fish.alpha;

        const s = fish.size;
        // Fish Body Oval
        ctx.fillStyle = '#ffb703';
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.ellipse(0, 0, s * 0.5, s * 0.3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Fish Tail Triangle
        ctx.beginPath();
        ctx.moveTo(s * 0.45, 0);
        ctx.lineTo(s * 0.85, -s * 0.35);
        ctx.lineTo(s * 0.85, s * 0.35);
        ctx.closePath();
        ctx.fill();

        // Fish Eye
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#1e1b4b';
        ctx.beginPath();
        ctx.arc(-s * 0.28, -s * 0.08, s * 0.07, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      // 6. Whiskers Laser Grid in Background (Sweeping angled rays)
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 133, 162, 0.12)';
      ctx.lineWidth = 1;
      const rayBaseX = width * 0.5 + mouse.x * 0.5;
      const rayBaseY = height * 0.4 - smoothScroll * 0.1;
      for (let w = -3; w <= 3; w++) {
        if (w === 0) continue;
        const angle = (w > 0 ? 0 : Math.PI) + (w * 0.08) + Math.sin(frame * 0.015 + w) * 0.02;
        ctx.beginPath();
        ctx.moveTo(rayBaseX, rayBaseY);
        ctx.lineTo(rayBaseX + Math.cos(angle) * width * 0.9, rayBaseY + Math.sin(angle) * height * 0.7);
        ctx.stroke();
      }
      ctx.restore();

      // 7. Cyber Neko HUD Telemetry
      const margin = 32;
      const topY = margin + 18;

      ctx.save();
      const blink = Math.floor(frame / 24) % 2 === 0;
      if (blink) {
        ctx.fillStyle = '#ff85a2';
        ctx.beginPath();
        ctx.arc(margin + 12, topY - 3, 5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#ff85a2';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillText('NEKO REALM // CYBER LUXE', margin + 24, topY);

      ctx.fillStyle = 'rgba(255, 204, 213, 0.75)';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText('PURR FREQ: 32Hz LOSSLESS  •  9 LIVES ACTIVE', margin + 210, topY);

      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.fillText('HAPPINESS: 99% BLISS', width - margin - 200, topY);

      // Bottom Readout
      ctx.fillStyle = 'rgba(255, 133, 162, 0.85)';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.fillText('CAT COMPANION ENGINE: ONLINE', margin + 10, height - margin);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.fillText('YARN NODES: 7 ACTIVE', margin + 250, height - margin);
      ctx.fillText('INTERACTIVE LASER: READY', margin + 420, height - margin);
      ctx.fillStyle = '#ffb703';
      ctx.fillText('[ FELINE SYMPHONY ]', width - margin - 180, height - margin);

      ctx.restore();

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
      const domP = window.__domCollapseProgress || 0;
      const collapseIntensity = Math.min(1.5, Math.min(Math.max((scrollRatio - 0.65) / 0.35, 0), 1) + domP * 0.5);

      // Black hole position: emerges in center/lower-center, locked firmly at center when DOM collapses
      const bhX = width * 0.5 + mouse.x * 0.25 * (1 - domP * 0.9);
      const bhY = height * 0.55 + (1 - Math.min(1, collapseIntensity)) * 260 + mouse.y * 0.25 * (1 - domP * 0.9);

      // Clear full canvas (transparent on pure black body)
      ctx.clearRect(0, 0, width, height);

      // ==========================================
      // BRANCH: CAMERA RED VS HI-FI STUDIO VS CAT REALM VS COSMIC THEME
      // ==========================================
      if (theme === 'camera-red') {
        // Render Camera-Centric Viewfinder & Bokeh Environment (Black hole strictly disabled in camera theme)
        drawCameraViewfinder();
      } else if (theme === 'hifi-studio') {
        // Render Theme 3: Futuristic 3D Cyber Hi-Fi Studio (Vivo X300 × JBL × OnePlus)
        drawHiFiStudio(scrollRatio);
      } else if (theme === 'cat-realm') {
        // Render Theme 4: Feline Galaxy & Cyber Neko Realm (Yarn Balls, Constellations, Fish Treats)
        drawCatRealm(scrollRatio);
      } else {
        // Render Cosmic Singularity Environment (Original Theme)
        // 1. STARFIELD WITH MULTI-DEPTH SCROLL PARALLAX & GRAVITATIONAL COLLAPSE
        stars.forEach((star) => {
          const parallaxY = (star.y - smoothScroll * star.depth * 0.35) % (height + 20);
          let drawY = parallaxY < -10 ? parallaxY + height + 20 : parallaxY;
          let drawX = star.x + mouse.x * star.depth;

          // GRAVITATIONAL COLLAPSE INTO THE BLACK HOLE
          if (collapseIntensity > 0.02) {
            const cdx = bhX - drawX;
            const cdy = bhY - drawY;
            const cdist = Math.hypot(cdx, cdy);

            if (cdist > 6) {
              const pull = Math.min((1400 / (cdist + 30)) * collapseIntensity * (3.2 + domP * 3.5), 48);
              const swirl = pull * (1.35 + domP * 1.6);

              star.x += (cdx / cdist) * pull - (cdy / cdist) * swirl * 0.25;
              star.y += (cdy / cdist) * pull + (cdx / cdist) * swirl * 0.25;

              if (collapseIntensity > 0.25 && pull > 3) {
                ctx.strokeStyle = star.color;
                ctx.lineWidth = star.radius * 0.8;
                ctx.globalAlpha = Math.min(1.0, star.baseAlpha * 1.5);
                ctx.beginPath();
                ctx.moveTo(drawX, drawY);
                ctx.lineTo(drawX - (cdx / cdist) * pull * 2.5, drawY - (cdy / cdist) * pull * 2.5);
                ctx.stroke();
              }

              if (cdist < 46 * collapseIntensity) {
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

        // 5. SOLAR SYSTEM: SUN & ALL 8 PLANETS
        const sunAnchorX = width * 0.28 + mouse.x * 0.8;
        const sunAnchorY = height * 0.38 - smoothScroll * 0.22 + mouse.y * 0.8;
        const sunX = sunAnchorX + (bhX - sunAnchorX) * (collapseIntensity * 0.6);
        const sunY = sunAnchorY + (bhY - sunAnchorY) * (collapseIntensity * 0.6);
        const solarTilt = -0.22 + smoothScroll * 0.0002 + collapseIntensity * 0.5;

        drawSolarSystem(sunX, sunY, solarTilt);
        drawSun(sunX, sunY);

        // 6. THE SUPERMASSIVE BLACK HOLE
        drawBlackHole(bhX, bhY, collapseIntensity);

        // 7. CAMERA SHUTTER APERTURE RETICLE
        const reticleX = width * 0.12 + mouse.x * 0.5;
        const reticleY = height * 0.75 - smoothScroll * 0.15;
        drawCameraReticles(reticleX, reticleY);
      }

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
  }, [theme]);

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
