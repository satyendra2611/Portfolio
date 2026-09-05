import React from 'react';
import { motion } from 'framer-motion';
import { personalInfo } from '../data/portfolioData';
import { Compass, Sparkles, Terminal, Camera } from 'lucide-react';

export default function Profile() {
  const highlights = [
    { icon: Terminal, title: 'Algorithmic Discipline', desc: 'Python, Java, C foundations, OOP logic & clean architecture' },
    { icon: Camera, title: 'Visual Composition', desc: 'Deep understanding of exposure, framing & dynamic color grading' },
    { icon: Compass, title: 'Real-World Focus', desc: 'Building practical tools that solve immediate user pain points' },
    { icon: Sparkles, title: 'Storytelling & Motion', desc: 'Blending video sequence pacing with sleek interface interaction' }
  ];

  return (
    <section className="section-band intro-band" id="profile">
      <motion.div
        className="section-heading"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
      >
        <p className="eyebrow">Profile</p>
        <h2>Creative systems, <span className="text-gradient-cyan">clean execution.</span></h2>
      </motion.div>

      <motion.p
        className="section-text"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {personalInfo.profileText}
      </motion.p>

      <div className="profile-highlights-grid">
        {highlights.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <motion.div
              key={item.title}
              className="highlight-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              whileHover={{ y: -4 }}
            >
              <div className="highlight-icon-box">
                <IconComponent size={20} />
              </div>
              <h3 className="highlight-title">{item.title}</h3>
              <p className="highlight-desc">{item.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
