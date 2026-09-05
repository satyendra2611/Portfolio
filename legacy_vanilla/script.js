const canvas = document.querySelector("#motion-field");
const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;
let dpr = 1;
let particles = [];
let rings = [];
let frame = 0;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

document.querySelectorAll("[data-photo]").forEach((image) => {
  const photo = window.portfolioPhotos?.[image.dataset.photo];
  if (photo) image.src = photo;
});

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const count = Math.max(48, Math.floor((width * height) / 15500));
  particles = Array.from({ length: count }, (_, index) => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.42,
    vy: (Math.random() - 0.5) * 0.42,
    radius: 0.8 + Math.random() * 1.9,
    phase: index * 0.17
  }));

  rings = Array.from({ length: 4 }, (_, index) => ({
    x: width * (0.16 + index * 0.22),
    y: height * (0.2 + (index % 2) * 0.36),
    base: 44 + index * 28,
    speed: 0.012 + index * 0.002
  }));
}

function drawShutter(cx, cy, radius, rotation) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rotation);
  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.stroke();

  for (let i = 0; i < 6; i += 1) {
    ctx.rotate(Math.PI / 3);
    ctx.beginPath();
    ctx.moveTo(radius * 0.2, 0);
    ctx.lineTo(radius, radius * 0.24);
    ctx.stroke();
  }
  ctx.restore();
}

function connectParticles() {
  for (let i = 0; i < particles.length; i += 1) {
    for (let j = i + 1; j < particles.length; j += 1) {
      const a = particles[i];
      const b = particles[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const distance = Math.hypot(dx, dy);

      if (distance < 125) {
        ctx.strokeStyle = `rgba(255,255,255,${0.12 * (1 - distance / 125)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }
}

function draw() {
  frame += 1;
  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = "rgba(255,255,255,0.03)";
  for (let y = 0; y < height; y += 68) {
    ctx.fillRect(0, y + ((frame * 0.2) % 68), width, 1);
  }

  rings.forEach((ring, index) => {
    const pulse = Math.sin(frame * ring.speed + index) * 12;
    drawShutter(ring.x, ring.y, ring.base + pulse, frame * 0.002 * (index + 1));
  });

  particles.forEach((particle) => {
    particle.x += particle.vx + Math.sin(frame * 0.012 + particle.phase) * 0.08;
    particle.y += particle.vy + Math.cos(frame * 0.01 + particle.phase) * 0.08;

    if (particle.x < -10) particle.x = width + 10;
    if (particle.x > width + 10) particle.x = -10;
    if (particle.y < -10) particle.y = height + 10;
    if (particle.y > height + 10) particle.y = -10;

    ctx.fillStyle = "rgba(255,255,255,0.62)";
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fill();
  });

  connectParticles();

  if (!reducedMotion.matches) {
    requestAnimationFrame(draw);
  }
}

window.addEventListener("resize", resize, { passive: true });
resize();
draw();