import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sliders, Sparkles, Layers, Aperture, Check, Camera } from 'lucide-react';

const PRESETS = [
  {
    id: 'tractor',
    title: 'Rural Harvest Motion',
    subtitle: 'Golden Hour Dust & Dynamic Tone Curve',
    src: '/tractor.jpg',
    camera: '50mm • f/2.8 • 1/800s • ISO 100',
    software: 'Lightroom Classic / Camera RAW',
    edits: {
      exposure: '+0.55 EV',
      contrast: '+28',
      highlights: '-42',
      shadows: '+50',
      vibrance: '+26',
      warmth: '5600K (+8)'
    },
    rawStyle: {
      filter: 'saturate(0.55) contrast(0.82) brightness(1.08) sepia(0.08)'
    },
    gradedStyle: {
      filter: 'saturate(1.22) contrast(1.14) brightness(1.02)'
    }
  },
  {
    id: 'car',
    title: 'Monochrome Rain Drive',
    subtitle: 'High-Contrast Noir & Asphalt Reflections',
    src: '/car.jpg',
    camera: '35mm • f/1.8 • 1/400s • ISO 400',
    software: 'Photoshop Camera RAW / B&W Mix',
    edits: {
      exposure: '+0.20 EV',
      contrast: '+45',
      highlights: '+30',
      shadows: '-25',
      clarity: '+35',
      grain: 'Fine (18%)'
    },
    rawStyle: {
      filter: 'grayscale(0.65) contrast(0.8) brightness(1.12)'
    },
    gradedStyle: {
      filter: 'grayscale(1) contrast(1.35) brightness(0.96)'
    }
  },
  {
    id: 'butterfly',
    title: 'Flora & Wings Macro',
    subtitle: 'Petal Isolation & Micro-Texture Boost',
    src: '/butterfly.jpg',
    camera: '90mm Macro • f/4.0 • 1/1200s • ISO 200',
    software: 'Lightroom Color Grading / HSL Mix',
    edits: {
      exposure: '+0.35 EV',
      contrast: '+18',
      highlights: '-30',
      shadows: '+38',
      saturation: '+24',
      clarity: '+22'
    },
    rawStyle: {
      filter: 'saturate(0.62) contrast(0.86) brightness(1.05)'
    },
    gradedStyle: {
      filter: 'saturate(1.28) contrast(1.12) brightness(1.04)'
    }
  }
];

export default function BeforeAfterRetouch({ playShutterSound }) {
  const [activePreset, setActivePreset] = useState(PRESETS[0]);
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 to 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clamped = Math.max(0, Math.min(rect.width, x));
    const percent = (clamped / rect.width) * 100;
    setSliderPos(percent);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  }, [handleMove]);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    const onMouseMoveWindow = (e) => {
      if (isDragging) handleMove(e.clientX);
    };
    const onMouseUpWindow = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMoveWindow);
      window.addEventListener('mouseup', onMouseUpWindow);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMoveWindow);
      window.removeEventListener('mouseup', onMouseUpWindow);
    };
  }, [isDragging, handleMove]);

  return (
    <section className="section-band" id="retouch-studio">
      <motion.div
        className="section-heading"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
      >
        <div className="eyebrow-pill small">
          <Sliders size={13} className="inline-icon" />
          <span className="eyebrow-text">Interactive Studio Lab</span>
        </div>
        <h2>RAW vs. Color Grade: <span className="text-gradient-amber">The Art of Post-Processing.</span></h2>
        <p className="section-subtext">
          Drag the slider to compare unedited flat sensor data against precision color grading and tonal calibration.
        </p>
      </motion.div>

      {/* Preset Selectors */}
      <div className="retouch-presets-row" role="tablist">
        {PRESETS.map((preset) => {
          const isActive = activePreset.id === preset.id;
          return (
            <button
              key={preset.id}
              className={`preset-btn ${isActive ? 'active' : ''}`}
              onClick={() => {
                if (playShutterSound) playShutterSound();
                setActivePreset(preset);
                setSliderPos(50);
              }}
              role="tab"
              aria-selected={isActive}
            >
              <Aperture size={15} />
              <span>{preset.title}</span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Comparison Stage */}
      <div className="retouch-stage-grid">
        <div
          ref={containerRef}
          className="retouch-viewer"
          onMouseDown={handleMouseDown}
          onTouchMove={handleTouchMove}
          onClick={(e) => handleMove(e.clientX)}
        >
          {/* Base Layer: RAW Unedited */}
          <div className="retouch-image-layer raw-layer" style={activePreset.rawStyle}>
            <img
              src={activePreset.src}
              alt={`${activePreset.title} - RAW`}
              className="retouch-img"
              draggable="false"
            />
            <span className="retouch-badge raw-badge">
              <span>RAW // FLAT SENSOR PROFILE</span>
            </span>
          </div>

          {/* Top Layer: Final Color-Graded (Clipped to slider position) */}
          <div
            className="retouch-image-layer graded-layer"
            style={{
              clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
              ...activePreset.gradedStyle
            }}
          >
            <img
              src={activePreset.src}
              alt={`${activePreset.title} - Color Graded`}
              className="retouch-img"
              draggable="false"
            />
            <span className="retouch-badge graded-badge">
              <span>FINAL // COLOR GRADED</span>
            </span>
          </div>

          {/* Draggable Divider Line & Knob */}
          <div
            className="retouch-divider"
            style={{ left: `${sliderPos}%` }}
            aria-label="Drag slider to compare RAW and Color Graded"
          >
            <div className="divider-line" />
            <div className="divider-handle">
              <span className="handle-chevron">‹</span>
              <span className="handle-chevron">›</span>
            </div>
            <div className="divider-line" />
          </div>
        </div>

        {/* Telemetry & Color Grading Parameters Box */}
        <div className="retouch-telemetry-panel">
          <div className="telemetry-header">
            <div className="telemetry-title-block">
              <h3 className="telemetry-title">{activePreset.title}</h3>
              <p className="telemetry-subtitle">{activePreset.subtitle}</p>
            </div>
            <span className="camera-pill">
              <Camera size={13} />
              <span>{activePreset.camera}</span>
            </span>
          </div>

          <div className="telemetry-specs-grid">
            {Object.entries(activePreset.edits).map(([key, val]) => (
              <div key={key} className="telemetry-spec-card">
                <span className="spec-label">{key.toUpperCase()}</span>
                <span className="spec-value">{val}</span>
              </div>
            ))}
          </div>

          <div className="telemetry-software-row">
            <Layers size={14} className="software-icon" />
            <span>Mastered in <strong>{activePreset.software}</strong> with custom S-curve tonal distribution.</span>
          </div>

          <div className="telemetry-quick-hint">
            <span className="hint-pill">Interactive Tip</span>
            <span>Click or drag anywhere on the frame to sweep across the grading timeline.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
