import React from 'react';
import {
  Code2,
  Cpu,
  Binary,
  Globe,
  Zap,
  Database,
  Server,
  Compass,
  GitBranch,
  Box,
  Terminal,
  Settings,
  Layers,
  Palette,
  Sliders,
  Image,
  Film,
  Camera,
  Eye,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { engineeringTools, creativeTools } from '../data/portfolioData';

const iconMap = {
  Code2,
  Cpu,
  Binary,
  Globe,
  Zap,
  Database,
  Server,
  Compass,
  GitBranch,
  Box,
  Terminal,
  Settings,
  Layers,
  Palette,
  Sliders,
  Image,
  Film,
  Camera,
  Eye,
  Sparkles,
  RotateCcw
};

function ToolCard({ tool, playShutterSound }) {
  const IconComp = iconMap[tool.icon] || Code2;

  return (
    <div
      className="marquee-tool-card"
      onMouseEnter={() => playShutterSound && playShutterSound()}
      title={`${tool.name} • ${tool.category}`}
    >
      <div
        className="tool-icon-box"
        style={{
          color: tool.color,
          backgroundColor: `${tool.color}15`,
          borderColor: `${tool.color}35`
        }}
      >
        <IconComp size={18} />
      </div>
      <div className="tool-info">
        <div className="tool-name-row">
          <span className="tool-name">{tool.name}</span>
          <span
            className="tool-badge"
            style={{
              borderColor: `${tool.color}30`,
              color: tool.color
            }}
          >
            {tool.badge}
          </span>
        </div>
        <span className="tool-category">{tool.category}</span>
      </div>
    </div>
  );
}

export default function ToolsMarquee({ playShutterSound }) {
  // Clone arrays to achieve seamless 50% infinite translation loop
  const engTrack = [...engineeringTools, ...engineeringTools];
  const creativeTrack = [...creativeTools, ...creativeTools, ...creativeTools, ...creativeTools];

  return (
    <section className="tools-marquee-section" id="tools" aria-label="Tools and Technologies Marquee">
      <div className="tools-marquee-header">
        <div className="eyebrow-pill small">
          <span className="live-pulse" />
          <span className="eyebrow-text">Production Ecosystem</span>
        </div>
        <h2 className="tools-marquee-title">
          The Engineering & Creative Arsenal
        </h2>
        <p className="tools-marquee-lead">
          Continuous toolchain spanning low-level algorithms, reactive web frameworks, RAW color grading, and optical camera systems.
        </p>
      </div>

      <div className="marquee-wrapper">
        {/* Track 1: Engineering & Web Architecture (Scrolls Left) */}
        <div className="marquee-row-wrapper" title="Engineering & Code Tools (Hover to pause)">
          <div className="marquee-track-label">
            <span className="track-dot blue" />
            <span>DEV & SYSTEMS ARCHITECTURE</span>
          </div>
          <div className="marquee-strip-container">
            <div className="marquee-gradient-fade left" />
            <div className="marquee-gradient-fade right" />
            <div className="marquee-track scroll-left">
              {engTrack.map((tool, idx) => (
                <ToolCard
                  key={`eng-${tool.name}-${idx}`}
                  tool={tool}
                  playShutterSound={playShutterSound}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Track 2: Photography & Creative Production (Scrolls Right) */}
        <div className="marquee-row-wrapper" title="Photography & Creative Tools (Hover to pause)">
          <div className="marquee-track-label">
            <span className="track-dot amber" />
            <span>OPTICS, COLOR SCIENCE & CINEMATOGRAPHY // VIVO X300 & EDITING SUITE</span>
          </div>
          <div className="marquee-strip-container">
            <div className="marquee-gradient-fade left" />
            <div className="marquee-gradient-fade right" />
            <div className="marquee-track scroll-right">
              {creativeTrack.map((tool, idx) => (
                <ToolCard
                  key={`crt-${tool.name}-${idx}`}
                  tool={tool}
                  playShutterSound={playShutterSound}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
