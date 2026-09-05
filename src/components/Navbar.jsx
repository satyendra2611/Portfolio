import React, { useState, useEffect } from 'react';
import { Menu, X, Volume2, VolumeX, Sparkles } from 'lucide-react';

export default function Navbar({ soundEnabled, setSoundEnabled, playShutterSound }) {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = [
        { id: 'contact', parent: 'contact' },
        { id: 'education', parent: 'education' },
        { id: 'skills', parent: 'skills' },
        { id: 'retouch-studio', parent: 'gallery' },
        { id: 'gallery', parent: 'gallery' },
        { id: 'github-activity', parent: 'work' },
        { id: 'work', parent: 'work' },
        { id: 'home', parent: 'home' }
      ];
      const scrollPos = window.scrollY + 180;

      for (let i = 0; i < sections.length; i++) {
        const el = document.getElementById(sections[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i].parent);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#work', label: 'Work' },
    { href: '#gallery', label: 'Gallery' },
    { href: '#skills', label: 'Skills' },
    { href: '#education', label: 'Education' },
    { href: '#contact', label: 'Contact' }
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    playShutterSound();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`site-header ${scrolled ? 'header-scrolled' : ''}`}>
      <div className="header-container">
        <a
          href="#home"
          className="brand"
          onClick={(e) => handleNavClick(e, '#home')}
          aria-label="Satyendra Kumar home"
        >
          <span className="brand-mark">SK</span>
          <span className="brand-name">
            Satyendra Kumar
            <span className="brand-sub">CS & Visuals</span>
          </span>
        </a>

        <nav className="site-nav desktop-nav" aria-label="Primary navigation">
          {navLinks.map((link) => {
            const sectionId = link.href.replace('#', '');
            const isActive = activeSection === sectionId;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`nav-link ${isActive ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, link.href)}
              >
                {link.label}
                {isActive && <span className="active-dot" />}
              </a>
            );
          })}
        </nav>

        <div className="header-actions">
          <button
            className="sound-toggle-btn"
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              if (next) playShutterSound();
            }}
            title={soundEnabled ? 'Disable camera sound' : 'Enable camera sound'}
            aria-label="Toggle camera shutter sound effects"
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span className="sound-toggle-text">{soundEnabled ? 'FX On' : 'FX Off'}</span>
          </button>

          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <nav className="mobile-nav">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="mobile-nav-link"
                onClick={(e) => handleNavClick(e, link.href)}
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
