import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Award, Calendar, BookOpen } from 'lucide-react';
import { education } from '../data/portfolioData';

export default function Education() {
  return (
    <section className="section-band" id="education">
      <motion.div
        className="section-heading"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
      >
        <p className="eyebrow">Education</p>
        <h2>Academic foundations & learning journey.</h2>
      </motion.div>

      <div className="timeline">
        {education.map((item, index) => (
          <motion.article
            key={item.period + item.degree}
            className="timeline-item"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: index * 0.12 }}
          >
            <div className="timeline-marker">
              <div className="timeline-dot" />
              {index < education.length - 1 && <div className="timeline-line" />}
            </div>

            <div className="timeline-content">
              <div className="timeline-header-row">
                <time className="timeline-time">
                  <Calendar size={13} /> {item.period}
                </time>
                <span className={`status-pill ${item.status === 'Current' ? 'current' : ''}`}>
                  {item.status}
                </span>
              </div>

              <h3 className="timeline-degree">{item.degree}</h3>
              <p className="timeline-institution">
                <GraduationCap size={15} /> {item.institution}
              </p>

              <div className="timeline-meta-bar">
                <span className="timeline-affiliation">{item.affiliation}</span>
                <span className="timeline-score">
                  <Award size={14} /> {item.score}
                </span>
              </div>

              {item.highlights && (
                <p className="timeline-highlights">{item.highlights}</p>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
