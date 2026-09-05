import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, Copy, Check, Send, Sparkles, ArrowUpRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { InstagramIcon, LinkedinIcon, GithubIcon } from './SocialIcons';
import confetti from 'canvas-confetti';
import { personalInfo } from '../data/portfolioData';

export default function Contact({ playShutterSound }) {
  const [copiedItem, setCopiedItem] = useState(null);
  const [formMsg, setFormMsg] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sentStatus, setSentStatus] = useState(null); // 'success' | 'error' | null
  const [statusMessage, setStatusMessage] = useState('');

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#f7f7f2', '#ffffff', '#b9b9b4', '#3b82f6', '#10b981']
    });
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(type);
    playShutterSound();
    triggerConfetti();
    setTimeout(() => setCopiedItem(null), 2500);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!formMsg.name || !formMsg.email || !formMsg.message) return;

    setLoading(true);
    setSentStatus(null);
    setStatusMessage('');

    try {
      // Send direct email to sk.patel86150@gmail.com using FormSubmit AJAX API
      const response = await fetch(`https://formsubmit.co/ajax/${personalInfo.email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formMsg.name,
          email: formMsg.email,
          message: formMsg.message,
          _subject: `New Portfolio Direct Note from ${formMsg.name}`,
          _template: 'table',
          _captcha: 'false'
        })
      });

      const data = await response.json();

      if (response.ok && (data.success === 'true' || data.success === true || response.status === 200)) {
        playShutterSound();
        triggerConfetti();
        setSentStatus('success');
        setStatusMessage('Your note has been sent directly to Satyendra\'s email!');
        setFormMsg({ name: '', email: '', message: '' });
      } else {
        throw new Error(data.message || 'Submission failed');
      }
    } catch (err) {
      // Fallback gracefully to mailto if offline or blocked
      console.warn('Direct send encountered an issue, fallback available:', err);
      const subject = `Portfolio Inquiry from ${formMsg.name}`;
      const body = `Hi Satyendra,\n\n${formMsg.message}\n\nFrom: ${formMsg.name} (${formMsg.email})`;
      window.open(
        `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(personalInfo.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
        '_blank'
      );
      setSentStatus('success');
      setStatusMessage('Note prepared in your Gmail compose window for sending!');
    } finally {
      setLoading(false);
      setTimeout(() => {
        setSentStatus(null);
        setStatusMessage('');
      }, 7000);
    }
  };

  return (
    <section className="section-band contact-band" id="contact">
      <div className="contact-heading-wrap">
        <motion.div
          className="section-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <p className="eyebrow">Contact & Connect</p>
          <h2>Let's build something <span className="text-gradient-cyan">sharp, useful, and memorable.</span></h2>
        </motion.div>
      </div>

      <div className="contact-main-grid">
        {/* Contact direct link cards */}
        <div className="contact-grid">
          {/* Phone */}
          <motion.div
            className="contact-card"
            whileHover={{ y: -4 }}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="contact-card-header">
              <span className="contact-card-icon"><Phone size={18} /></span>
              <button
                className="copy-badge-btn"
                onClick={() => copyToClipboard(personalInfo.phone, 'phone')}
                title="Copy phone number"
              >
                {copiedItem === 'phone' ? <Check size={13} className="text-emerald" /> : <Copy size={13} />}
                <span>{copiedItem === 'phone' ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <a href={`tel:${personalInfo.phone}`} className="contact-card-link">
              <span className="contact-type">Direct Phone</span>
              <strong className="contact-val">{personalInfo.phone}</strong>
            </a>
          </motion.div>

          {/* Email */}
          <motion.div
            className="contact-card"
            whileHover={{ y: -4 }}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.08 }}
          >
            <div className="contact-card-header">
              <span className="contact-card-icon"><Mail size={18} /></span>
              <button
                className="copy-badge-btn"
                onClick={() => copyToClipboard(personalInfo.email, 'email')}
                title="Copy email address"
              >
                {copiedItem === 'email' ? <Check size={13} className="text-emerald" /> : <Copy size={13} />}
                <span>{copiedItem === 'email' ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <a
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(personalInfo.email)}&su=${encodeURIComponent('Collaboration / Inquiry - Satyendra Kumar')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card-link"
              title="Open in Gmail"
            >
              <span className="contact-type">Email Address</span>
              <strong className="contact-val">{personalInfo.email}</strong>
            </a>
          </motion.div>

          {/* Instagram */}
          <motion.div
            className="contact-card"
            whileHover={{ y: -4 }}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.16 }}
          >
            <div className="contact-card-header">
              <span className="contact-card-icon"><InstagramIcon size={18} /></span>
              <a
                href={personalInfo.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="open-badge-btn"
              >
                <ArrowUpRight size={13} />
              </a>
            </div>
            <a href={personalInfo.instagram} target="_blank" rel="noopener noreferrer" className="contact-card-link">
              <span className="contact-type">Instagram Photography</span>
              <strong className="contact-val">{personalInfo.instagramHandle}</strong>
            </a>
          </motion.div>

          {/* LinkedIn */}
          <motion.div
            className="contact-card"
            whileHover={{ y: -4 }}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.24 }}
          >
            <div className="contact-card-header">
              <span className="contact-card-icon"><LinkedinIcon size={18} /></span>
              <a
                href={personalInfo.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="open-badge-btn"
              >
                <ArrowUpRight size={13} />
              </a>
            </div>
            <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="contact-card-link">
              <span className="contact-type">LinkedIn Network</span>
              <strong className="contact-val">{personalInfo.linkedinHandle}</strong>
            </a>
          </motion.div>

          {/* GitHub */}
          <motion.div
            className="contact-card"
            whileHover={{ y: -4 }}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.32 }}
          >
            <div className="contact-card-header">
              <span className="contact-card-icon"><GithubIcon size={18} /></span>
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="open-badge-btn"
                title="Open GitHub Profile"
              >
                <ArrowUpRight size={13} />
              </a>
            </div>
            <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="contact-card-link">
              <span className="contact-type">GitHub Code Repositories</span>
              <strong className="contact-val">{personalInfo.githubHandle}</strong>
            </a>
          </motion.div>
        </div>

        {/* Quick Message Box */}
        <motion.form
          className="quick-message-form"
          onSubmit={handleSendMessage}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="form-header">
            <Sparkles size={18} className="form-sparkle" />
            <div>
              <h3>Send a Direct Note</h3>
              <p className="form-sub-header">Delivered straight to Satyendra's email</p>
            </div>
          </div>

          {statusMessage && (
            <div className={`form-status-banner ${sentStatus === 'success' ? 'success' : 'error'}`}>
              {sentStatus === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{statusMessage}</span>
            </div>
          )}

          <div className="form-inputs-row">
            <input
              type="text"
              placeholder="Your Name"
              required
              disabled={loading}
              value={formMsg.name}
              onChange={(e) => setFormMsg({ ...formMsg, name: e.target.value })}
              className="form-input"
            />
            <input
              type="email"
              placeholder="Your Email"
              required
              disabled={loading}
              value={formMsg.email}
              onChange={(e) => setFormMsg({ ...formMsg, email: e.target.value })}
              className="form-input"
            />
          </div>
          <textarea
            placeholder="Tell me about your project, idea, or collaboration..."
            rows={3}
            required
            disabled={loading}
            value={formMsg.message}
            onChange={(e) => setFormMsg({ ...formMsg, message: e.target.value })}
            className="form-textarea"
          />
          <button
            type="submit"
            className="button primary form-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="spin-icon" />
                <span>Sending Note...</span>
              </>
            ) : (
              <>
                <Send size={15} />
                <span>Send Note to Email</span>
              </>
            )}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
