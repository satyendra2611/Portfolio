import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Globe, Cpu, Camera, Terminal, Check, Sparkles } from 'lucide-react';
import { skillCategories } from '../data/portfolioData';

const liveDailyTools = [
  { name: "VS Code", cat: "IDE" },
  { name: "Python 3.12", cat: "Language" },
  { name: "Java JDK 21", cat: "OOP" },
  { name: "Git", cat: "VCS" },
  { name: "GitHub", cat: "CI/CD" },
  { name: "PostgreSQL", cat: "Database" },
  { name: "React 19", cat: "Frontend" },
  { name: "Vite", cat: "Bundler" },
  { name: "Linux Bash", cat: "Terminal" },
  { name: "Postman", cat: "API Testing" },
  { name: "Vivo X300", cat: "Primary Optics" },
  { name: "Adobe Lightroom", cat: "RAW Grade" },
  { name: "Snapseed", cat: "Tonal Edit" },
  { name: "Light Distortion", cat: "Optical FX" },
  { name: "CapCut", cat: "Video Flow" },
  { name: "VN", cat: "Keyframe Cuts" },
  { name: "InShot", cat: "Reel Motion" },
  { name: "Docker", cat: "DevOps" }
];

export default function Skills({ playShutterSound }) {
  const [activeCategory, setActiveCategory] = useState(null);

  const categoryIcons = {
    Code2,
    Globe,
    Cpu,
    Camera
  };

  // Duplicate for seamless 50% translation marquee
  const tickerItems = [...liveDailyTools, ...liveDailyTools];

  return (
    <section className="section-band split-band" id="skills">
      <motion.div
        className="section-heading"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
      >
        <p className="eyebrow">Skills</p>
        <h2>Code, composition, and production.</h2>
      </motion.div>

      <div className="skill-grid">
        {skillCategories.map((cat, idx) => {
          const IconComp = categoryIcons[cat.icon] || Terminal;
          const isSelected = activeCategory === cat.title;

          return (
            <motion.article
              key={cat.title}
              className={`skill-card ${isSelected ? 'active' : ''}`}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
              onClick={() => {
                playShutterSound();
                setActiveCategory(isSelected ? null : cat.title);
              }}
              whileHover={{ y: -4 }}
            >
              <div className="skill-card-top">
                <div className="skill-icon-wrap">
                  <IconComp size={20} />
                </div>
                <h3 className="skill-cat-title">{cat.title}</h3>
              </div>

              <div className="skill-items-list">
                {cat.skills.map((skill) => (
                  <div key={skill.name} className="skill-item">
                    <div className="skill-info">
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-percentage">{skill.level}%</span>
                    </div>
                    <div className="skill-bar-track">
                      <motion.div
                        className="skill-bar-fill"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, delay: 0.2 + idx * 0.05 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.article>
          );
        })}
      </div>

      {/* Embedded Live Tooling Stream Marquee */}
      <div className="skills-tooling-ticker-wrap">
        <div className="ticker-badge">
          <Sparkles size={13} className="sparkle-accent" />
          <span>Active Daily Tooling</span>
        </div>
        <div className="skills-marquee-outer">
          <div className="skills-marquee-fade left" />
          <div className="skills-marquee-fade right" />
          <div className="skills-ticker-track">
            {tickerItems.map((item, idx) => (
              <span
                key={`tick-${item.name}-${idx}`}
                className="skills-ticker-chip"
                onMouseEnter={() => playShutterSound && playShutterSound()}
              >
                <span className="ticker-chip-dot" />
                <span className="ticker-chip-name">{item.name}</span>
                <span className="ticker-chip-cat">{item.cat}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
