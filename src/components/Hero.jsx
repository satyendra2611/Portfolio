import React, { useState, useEffect } from 'react';
import { Mail, ArrowUpRight, Sparkles, Camera, Code, ChevronDown } from 'lucide-react';
import { InstagramIcon, LinkedinIcon, GithubIcon } from './SocialIcons';
import { personalInfo, photos } from '../data/portfolioData';

export default function Hero({ onSelectPhoto, playShutterSound }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const roles = [
    "Computer Science Engineer",
    "Photographer & Cinematographer",
    "AI & Predictive Analytics Developer",
    "Vivo X300 Mobile Visual Artist"
  ];
  const [roleIndex, setRoleIndex] = useState(0);
  const [roleVisible, setRoleVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setRoleVisible(false);
      setTimeout(() => {
        setRoleIndex((prev) => (prev + 1) % roles.length);
        setRoleVisible(true);
      }, 320);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = (e) => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <section className="hero" id="home">
      <div className="hero-copy">
        <div className="hero-copy-inner">
          <div className="eyebrow-pill">
            <span className="live-pulse" />
            <span className={`eyebrow-text role-morph-text ${roleVisible ? 'is-visible' : 'is-hidden'}`}>
              {roles[roleIndex]}
            </span>
          </div>

          <h1 className="hero-title">
            <span className="hero-title-gradient">{personalInfo.name}</span>
          </h1>

          <p className="lead">
            B.Tech Computer Science student with a <span className="highlight-chip chip-amber">photographer's eye</span> and an <span className="highlight-chip chip-cyan">engineer's discipline</span>, building practical digital solutions through <span className="highlight-code-token">Python, Java, C</span>, modern web systems, and creative <span className="highlight-chip chip-purple">Vivo X300 mobile cinematography</span>.
          </p>

          {/* Quick Stats Grid */}
          <div className="stats-row">
            {personalInfo.stats.map((stat) => (
              <div
                key={stat.label}
                className="stat-card"
              >
                <div className="stat-val-wrapper">
                  <span className="stat-value text-glow-stat">{stat.value}</span>
                  <span className="stat-suffix">{stat.suffix}</span>
                </div>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="hero-actions" aria-label="Contact and profile links">
            <a
              className="button primary"
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(personalInfo.email)}&su=${encodeURIComponent('Collaboration / Inquiry - Satyendra Kumar')}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Email Satyendra Kumar via Gmail at ${personalInfo.email}`}
              onClick={() => playShutterSound()}
            >
              <Mail size={16} />
              <span>Email Me</span>
              <ArrowUpRight size={13} className="btn-corner-icon" />
            </a>

            <a
              className="button"
              href={personalInfo.instagram}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playShutterSound()}
            >
              <InstagramIcon size={16} />
              <span>Instagram</span>
              <ArrowUpRight size={13} className="btn-corner-icon" />
            </a>

            <a
              className="button"
              href={personalInfo.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playShutterSound()}
            >
              <LinkedinIcon size={16} />
              <span>LinkedIn</span>
              <ArrowUpRight size={13} className="btn-corner-icon" />
            </a>

            <a
              className="button"
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playShutterSound()}
            >
              <GithubIcon size={16} />
              <span>GitHub</span>
              <ArrowUpRight size={13} className="btn-corner-icon" />
            </a>
          </div>

          <button
            className="hero-scroll-btn"
            onClick={() => {
              playShutterSound();
              document.getElementById('profile')?.scrollIntoView({ behavior: 'smooth' });
            }}
            aria-label="Scroll down to explore"
          >
            <ChevronDown size={15} className="mouse-scroll-icon" />
            <span>Scroll to explore</span>
          </button>
        </div>
      </div>

      {/* 3D Tilt Visual Grid */}
      <div
        className="hero-visual"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`
        }}
        aria-label="Interactive creative portfolio preview"
      >
        <div className="photo-grid">
          {photos.map((p, idx) => {
            const tileClass =
              p.size === 'large'
                ? 'tile-large'
                : p.size === 'wide'
                ? 'tile-wide'
                : '';
            return (
              <figure
                key={p.id}
                className={`photo-tile ${tileClass}`}
                onClick={() => {
                  playShutterSound();
                  onSelectPhoto(p);
                }}
                title="Click to expand high-res photo"
              >
                <img
                  src={p.src}
                  alt={p.alt}
                  decoding="async"
                  loading={idx === 0 ? 'eager' : 'lazy'}
                />
                <div className="tile-overlay">
                  <span className="tile-badge">{p.badge}</span>
                  <span className="tile-zoom-indicator">
                    <Camera size={13} /> View
                  </span>
                </div>
              </figure>
            );
          })}
        </div>

        {/* Animated Lens Aperture Rings */}
        <div className="lens-ring" aria-hidden="true">
          <span />
          <span />
        </div>
      </div>
    </section>
  );
}
