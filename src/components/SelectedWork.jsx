import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, GraduationCap, ShieldAlert, CheckCircle2, Layers, Film, Image, Video, Camera, ArrowRight } from 'lucide-react';
import { projects, specialties } from '../data/portfolioData';

export default function SelectedWork({ playShutterSound }) {
  const [activeSpecialty, setActiveSpecialty] = useState(null);

  const specIcons = {
    '01': Camera,
    '02': Video,
    '03': Image,
    '04': Film
  };

  const projectIcons = {
    ShieldAlert,
    GraduationCap,
    Activity
  };

  return (
    <section className="section-band" id="work">
      <motion.div
        className="section-heading"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
      >
        <p className="eyebrow">Selected Work</p>
        <h2>Engineering projects with a <span className="text-gradient-amber">visual maker's mindset.</span></h2>
      </motion.div>

      <div className="work-flow">
        {/* Projects Grid: Flagship on top, 2 secondary projects in 2 columns */}
        <div className="projects-grid">
          {projects.map((proj, idx) => {
            const ProjectIcon = projectIcons[proj.icon] || Activity;
            const isFlagship = idx === 0;

            return (
              <motion.article
                key={proj.title}
                className={`project-card ${isFlagship ? 'flagship-card' : 'standard-card'}`}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: idx * 0.1 }}
              >
                <div className="project-header">
                  <div className="project-tags">
                    <span className="tag">{proj.category}</span>
                    <span className="project-status">
                      <span className="status-indicator" /> {proj.status}
                    </span>
                  </div>
                  <div className="project-icon-glow">
                    <ProjectIcon size={22} />
                  </div>
                </div>

                {isFlagship ? (
                  <div className="flagship-content-grid">
                    <div className="flagship-left">
                      <h3 className="project-title flagship-animated-title">{proj.title}</h3>
                      <p className="project-lead">{proj.lead}</p>
                      <div className="tech-stack-row">
                        {proj.techStack.map((tech) => (
                          <span key={tech} className="tech-badge">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flagship-right">
                      <h4 className="details-heading">Core Engineering Pillars</h4>
                      <ul className="clean-list">
                        {proj.highlights.map((point, i) => (
                          <li key={i}>
                            <CheckCircle2 size={16} className="list-check-icon" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="standard-card-body">
                    <h3 className="project-title">{proj.title}</h3>
                    <p className="project-lead">{proj.lead}</p>

                    <div className="project-details">
                      <h4 className="details-heading">Core Highlights</h4>
                      <ul className="clean-list">
                        {proj.highlights.map((point, i) => (
                          <li key={i}>
                            <CheckCircle2 size={16} className="list-check-icon" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="tech-stack-row">
                      {proj.techStack.map((tech) => (
                        <span key={tech} className="tech-badge">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.article>
            );
          })}
        </div>

        {/* Studio Specialties Row - full width 4-column balanced grid */}
        <div className="specialties-row-wrapper">
          <div className="specialties-subheading">
            <span className="eyebrow small">Creative Disciplines</span>
            <h3 className="specialties-title">Visual Arts & Studio Specialties</h3>
          </div>

          <div className="studio-grid" aria-label="Photography and editing specialties">
            {specialties.map((spec) => {
              const IconComp = specIcons[spec.id] || Camera;
              const isSelected = activeSpecialty === spec.id;

              return (
                <motion.div
                  key={spec.id}
                  className={`studio-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    playShutterSound();
                    setActiveSpecialty(isSelected ? null : spec.id);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="studio-top">
                    <span className="studio-num">{spec.id}</span>
                    <IconComp size={18} className="studio-icon" />
                  </div>
                  <strong className="studio-title">{spec.title}</strong>
                  <p className="studio-desc">{spec.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
