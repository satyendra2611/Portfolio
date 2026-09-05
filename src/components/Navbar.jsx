import React, { useState, useEffect } from 'react';
import { Menu, X, Volume2, VolumeX, Sparkles, Camera, Headphones, Cat } from 'lucide-react';

export default function Navbar({ soundEnabled, setSoundEnabled, playShutterSound, theme, toggleTheme }) {
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
          {/* Theme Switcher Toggle */}
          <button
            className={`theme-toggle-btn ${
              theme === 'cat-realm'
                ? 'active-cat'
                : theme === 'hifi-studio'
                ? 'active-hifi'
                : theme === 'camera-red'
                ? 'active-camera'
                : 'active-cosmic'
            }`}
            onClick={() => {
              playShutterSound();
              toggleTheme();
            }}
            title={
              theme === 'cosmic'
                ? 'Switch to Camera Red Theme'
                : theme === 'camera-red'
                ? 'Switch to Hi-Fi Studio Theme'
                : theme === 'hifi-studio'
                ? 'Switch to Cat Realm Theme'
                : 'Switch to Cosmic Theme'
            }
            aria-label="Toggle Portfolio Theme"
          >
            {theme === 'cat-realm' ? (
              <>
                <Cat size={15} className="theme-toggle-icon cat-icon" />
                <span className="theme-toggle-text">Neko Realm</span>
              </>
            ) : theme === 'hifi-studio' ? (
              <>
                <Headphones size={15} className="theme-toggle-icon hifi-icon" />
                <span className="theme-toggle-text">Hi-Fi Studio</span>
              </>
            ) : theme === 'camera-red' ? (
              <>
                <Camera size={15} className="theme-toggle-icon red-icon" />
                <span className="theme-toggle-text">Camera Red</span>
              </>
            ) : (
              <>
                <Sparkles size={15} className="theme-toggle-icon cyan-icon" />
                <span className="theme-toggle-text">Cosmic</span>
              </>
            )}
          </button>

          {/* Sound FX Toggle */}
          <button
            className="sound-toggle-btn"
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              if (next) playShutterSound();
            }}
            title={soundEnabled ? 'Disable sound FX' : 'Enable sound FX'}
            aria-label="Toggle sound effects"
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

            <div className="mobile-drawer-actions">
              <button
                className={`theme-toggle-btn mobile ${
                  theme === 'cat-realm'
                    ? 'active-cat'
                    : theme === 'hifi-studio'
                    ? 'active-hifi'
                    : theme === 'camera-red'
                    ? 'active-camera'
                    : 'active-cosmic'
                }`}
                onClick={() => {
                  playShutterSound();
                  toggleTheme();
                }}
              >
                {theme === 'cat-realm' ? (
                  <>
                    <Cat size={15} className="theme-toggle-icon cat-icon" />
                    <span>Neko Realm</span>
                  </>
                ) : theme === 'hifi-studio' ? (
                  <>
                    <Headphones size={15} className="theme-toggle-icon hifi-icon" />
                    <span>Hi-Fi Studio Theme</span>
                  </>
                ) : theme === 'camera-red' ? (
                  <>
                    <Camera size={15} className="theme-toggle-icon red-icon" />
                    <span>Camera Red Theme</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={15} className="theme-toggle-icon cyan-icon" />
                    <span>Cosmic Theme</span>
                  </>
                )}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
