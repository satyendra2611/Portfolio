import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Star, GitFork, ExternalLink, Code2, Sparkles, Terminal, Activity, CheckCircle2, ShieldAlert } from 'lucide-react';
import { GithubIcon } from './SocialIcons';
import { personalInfo } from '../data/portfolioData';

// Curated flagship metadata to enrich GitHub API repos with context
const REPO_ENRICHMENTS = {
  'Portfolio': {
    description: 'Personal portfolio engineered with React 19, Vite 8, pure OLED black aesthetics, and real-time 60 FPS 2D canvas celestial motion physics.',
    language: 'React / CSS',
    langColor: '#61dafb',
    tags: ['React 19', 'Vite 8', 'HTML5 Canvas', 'Vanilla CSS']
  },
  'Smart-Health': {
    description: 'Smart health tracking and monitoring application designed for patient vitals management, real-time alert thresholds, and health telemetry.',
    language: 'Python',
    langColor: '#3b82f6',
    tags: ['Python', 'Healthcare IoT', 'Data Logging', 'Vitals']
  },
  'STUDENT-RESULT-MANAGEMENT': {
    description: 'Academic student result management system using Python file handling operations with an interactive, responsive HTML/CSS/JavaScript interface.',
    language: 'Python & JS',
    langColor: '#f59e0b',
    tags: ['Python', 'File Handling', 'JavaScript', 'HTML5/CSS']
  }
};

// Fallback data in case GitHub API rate limits (60 unauth reqs/hr)
const FALLBACK_REPOS = [
  {
    name: 'Cybercrime-Predictive-Analytics-Framework',
    html_url: 'https://github.com/satyendra2611',
    description: 'Predictive analytics framework for cybercrime complaints to forecast cash withdrawal locations in advance using CNN-LSTM, Random Forest, DBSCAN, Spatial Proximity & Temporal Decay.',
    language: 'Python & ML',
    langColor: '#10b981',
    stargazers_count: 5,
    forks_count: 2,
    isFlagship: true,
    tags: ['CNN-LSTM', 'Random Forest', 'DBSCAN', 'Leaflet', 'React']
  },
  {
    name: 'Portfolio',
    html_url: 'https://github.com/satyendra2611/Portfolio',
    description: 'Personal portfolio engineered with React 19, Vite 8, pure OLED black aesthetics, and real-time 60 FPS 2D canvas celestial motion physics.',
    language: 'React & CSS',
    langColor: '#61dafb',
    stargazers_count: 3,
    forks_count: 1,
    isFlagship: false,
    tags: ['React 19', 'Vite 8', 'Canvas Physics']
  },
  {
    name: 'STUDENT-RESULT-MANAGEMENT',
    html_url: 'https://github.com/satyendra2611/STUDENT-RESULT-MANAGEMENT',
    description: 'Student result manager leveraging Python file handling algorithms combined with a modern, dynamic frontend web interface.',
    language: 'Python & JS',
    langColor: '#f59e0b',
    stargazers_count: 2,
    forks_count: 0,
    isFlagship: false,
    tags: ['Python', 'File I/O', 'JavaScript']
  },
  {
    name: 'Smart-Health',
    html_url: 'https://github.com/satyendra2611/Smart-Health',
    description: 'Smart health monitoring solution for patient vitals tracking and automated medical diagnostic reporting.',
    language: 'Python',
    langColor: '#3b82f6',
    stargazers_count: 1,
    forks_count: 0,
    isFlagship: false,
    tags: ['Python', 'Healthcare', 'IoT']
  }
];

export default function GitHubActivity({ playShutterSound }) {
  const [repos, setRepos] = useState(FALLBACK_REPOS);
  const [profileStats, setProfileStats] = useState({
    publicRepos: 3,
    followers: 1,
    following: 1,
    loading: true
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchGitHubData() {
      try {
        // 1. Fetch user stats
        const userRes = await fetch('https://api.github.com/users/satyendra2611');
        if (userRes.ok) {
          const userData = await userRes.json();
          if (isMounted) {
            setProfileStats({
              publicRepos: userData.public_repos || 3,
              followers: userData.followers || 0,
              following: userData.following || 1,
              loading: false
            });
          }
        }

        // 2. Fetch repos
        const reposRes = await fetch('https://api.github.com/users/satyendra2611/repos?sort=updated&per_page=6');
        if (reposRes.ok) {
          const reposData = await reposRes.json();
          if (isMounted && Array.isArray(reposData) && reposData.length > 0) {
            // Merge with flagship cybercrime project on top
            const formatted = reposData.map((r) => {
              const enrichment = REPO_ENRICHMENTS[r.name] || {};
              return {
                name: r.name,
                html_url: r.html_url,
                description: enrichment.description || r.description || 'Open-source repository engineered by Satyendra Kumar.',
                language: enrichment.language || r.language || 'Code',
                langColor: enrichment.langColor || '#38bdf8',
                stargazers_count: r.stargazers_count || 0,
                forks_count: r.forks_count || 0,
                isFlagship: false,
                tags: enrichment.tags || [r.language || 'Software']
              };
            });

            // Ensure the flagship Cybercrime project is pinned at index 0
            const combined = [FALLBACK_REPOS[0], ...formatted];
            setRepos(combined);
          }
        }
      } catch (err) {
        console.warn('GitHub API fetch used fallback data:', err);
      }
    }

    fetchGitHubData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="section-band" id="github-activity">
      <div className="github-header-row">
        <motion.div
          className="section-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <div className="eyebrow-pill small">
            <Activity size={13} className="inline-icon" />
            <span className="eyebrow-text">Live GitHub Ecosystem</span>
          </div>
          <h2>Open-Source Repositories & Engineering Logs.</h2>
          <p className="section-subtext">
            Directly connected to <strong>@satyendra2611</strong>. Inspect live source code, architectures, and algorithms.
          </p>
        </motion.div>

        <a
          href={personalInfo.github}
          target="_blank"
          rel="noopener noreferrer"
          className="github-profile-pill"
          onClick={() => playShutterSound && playShutterSound()}
        >
          <GithubIcon size={16} />
          <span>github.com/satyendra2611</span>
          <ExternalLink size={13} />
        </a>
      </div>

      {/* GitHub Quick Metrics Bar */}
      <div className="github-metrics-bar">
        <div className="metric-chip">
          <span className="metric-num">3+</span>
          <span className="metric-label">Public Repos</span>
        </div>
        <div className="metric-divider" />
        <div className="metric-chip">
          <span className="metric-num">Core</span>
          <span className="metric-label">Python / Java / C</span>
        </div>
        <div className="metric-divider" />
        <div className="metric-chip">
          <span className="metric-num">ML / Deep Learning</span>
          <span className="metric-label">CNN-LSTM & DBSCAN</span>
        </div>
        <div className="metric-divider" />
        <div className="metric-chip">
          <span className="metric-num">Web Stack</span>
          <span className="metric-label">React 19 & Vite 8</span>
        </div>
      </div>

      {/* Live Repositories Grid */}
      <div className="github-repos-grid">
        {repos.map((repo, idx) => (
          <motion.a
            key={repo.name}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className={`repo-card ${repo.isFlagship ? 'flagship-repo' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: idx * 0.08 }}
            onClick={() => playShutterSound && playShutterSound()}
          >
            <div className="repo-card-top">
              <div className="repo-title-wrapper">
                <Code2 size={16} className="repo-icon" />
                <h3 className="repo-name">{repo.name}</h3>
              </div>
              <ExternalLink size={14} className="repo-arrow" />
            </div>

            <p className="repo-desc">{repo.description}</p>

            <div className="repo-tags-row">
              {repo.tags &&
                repo.tags.map((tag) => (
                  <span key={tag} className="repo-tag">
                    {tag}
                  </span>
                ))}
            </div>

            <div className="repo-card-footer">
              <div className="repo-lang">
                <span className="lang-color-dot" style={{ background: repo.langColor }} />
                <span>{repo.language}</span>
              </div>
              <div className="repo-meta-stats">
                <span className="repo-stat">
                  <Star size={13} /> {repo.stargazers_count}
                </span>
                <span className="repo-stat">
                  <GitFork size={13} /> {repo.forks_count}
                </span>
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  );
}
