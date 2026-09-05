import React from 'react';
import { ArrowUp } from 'lucide-react';
import { InstagramIcon, LinkedinIcon, GithubIcon } from './SocialIcons';
import { personalInfo } from '../data/portfolioData';

export default function Footer({ playShutterSound, theme = 'cosmic' }) {
  const scrollToTop = () => {
    playShutterSound();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-left">
          <div className="footer-brand">
            <span className="brand-mark small">SK</span>
            <span className="footer-name">{personalInfo.name}</span>
          </div>
          <p className="footer-desc">
            B.Tech CSE & Visual Creator • Engineered with React 19 & Vite 8
          </p>
          <div className="footer-social-row">
            <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="footer-social-link" title="GitHub" onClick={playShutterSound}>
              <GithubIcon size={16} />
            </a>
            <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="footer-social-link" title="LinkedIn" onClick={playShutterSound}>
              <LinkedinIcon size={16} />
            </a>
            <a href={personalInfo.instagram} target="_blank" rel="noopener noreferrer" className="footer-social-link" title="Instagram" onClick={playShutterSound}>
              <InstagramIcon size={16} />
            </a>
          </div>
        </div>

        <div className="footer-right">
          <div className="footer-status">
            <span className="status-ping" />
            <span>Open for collaborations & tech roles</span>
          </div>

          <button
            className="back-to-top-btn"
            onClick={scrollToTop}
            aria-label="Scroll back to top"
          >
            <span>Back to top</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <span>© {new Date().getFullYear()} Satyendra Kumar. All rights reserved.</span>
      </div>

      {theme === 'cosmic' && (
        <div className="footer-event-horizon-hint" aria-hidden="true">
          <span className="hint-pulse-orb" />
          <span className="hint-text">SCROLL DEEPER TO ENTER EVENT HORIZON</span>
          <span className="hint-arrow">⌄</span>
        </div>
      )}
    </footer>
  );
}
