import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, ExternalLink, SlidersHorizontal, Eye, Sparkles, ZoomIn, Play, Film } from 'lucide-react';
import { personalInfo, photos as defaultPhotos } from '../data/portfolioData';
import { galleryPhotos } from '../data/galleryPhotos';
import { galleryVideos } from '../data/galleryVideos';

export default function CreativeGallery({ onSelectPhoto, playShutterSound }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Combine videos and photos (2 edited videos + 19 base64 photos + 4 default portfolio photos)
  const allPhotos = useMemo(() => {
    return [...galleryVideos, ...galleryPhotos, ...defaultPhotos];
  }, []);

  // Compute available categories dynamically with Videos / Edits prioritized
  const categories = useMemo(() => {
    const set = new Set();
    allPhotos.forEach((p) => {
      if (p.category) {
        if (p.category.includes('/')) {
          set.add(p.category.trim());
        } else {
          set.add(p.category.trim());
        }
      }
    });
    const list = Array.from(set).filter((c) => c !== 'Video / Edit');
    return ['All', 'Video / Edit', ...list];
  }, [allPhotos]);

  // Filtered photos & videos
  const filteredPhotos = useMemo(() => {
    if (selectedCategory === 'All') return allPhotos;
    return allPhotos.filter(
      (p) =>
        p.category?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        p.badge?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        (selectedCategory.toLowerCase().includes('video') && (p.type === 'video' || p.videoSrc))
    );
  }, [allPhotos, selectedCategory]);

  return (
    <section className="section-band" id="gallery">
      <div className="gallery-header-row">
        <motion.div
          className="section-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <div className="eyebrow-pill small">
            <Sparkles size={13} className="inline-icon" />
            <span className="eyebrow-text">{allPhotos.length} Master Captures</span>
          </div>
          <h2>Photographic craft through <span className="text-gradient-cyan">light, lens & contrast.</span></h2>
        </motion.div>

        <a
          href={personalInfo.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="insta-pill-btn"
          onClick={() => playShutterSound()}
        >
          <Camera size={16} />
          <span>{personalInfo.instagramHandle}</span>
          <ExternalLink size={13} />
        </a>
      </div>

      {/* Dynamic Filter Tabs */}
      <div className="gallery-filters" role="tablist">
        {categories.map((cat) => {
          const count =
            cat === 'All'
              ? allPhotos.length
              : allPhotos.filter((p) =>
                  p.category?.toLowerCase().includes(cat.toLowerCase())
                ).length;

          if (count === 0 && cat !== 'All') return null;

          return (
            <button
              key={cat}
              className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => {
                playShutterSound();
                setSelectedCategory(cat);
              }}
              role="tab"
              aria-selected={selectedCategory === cat}
            >
              <span>{cat}</span>
              <span className="filter-count-badge">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Gallery Cards Grid */}
      <motion.div layout className="gallery-grid">
        <AnimatePresence>
          {filteredPhotos.map((item, idx) => {
            const isVideo = item.type === 'video' || !!item.videoSrc;

            return (
              <motion.div
                layout
                key={item.id || item.filename || idx}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.35, delay: Math.min(idx * 0.03, 0.3) }}
                className={`gallery-card ${isVideo ? 'gallery-video-card' : ''}`}
                onClick={() => {
                  playShutterSound();
                  onSelectPhoto(item, idx, filteredPhotos);
                }}
                title={isVideo ? 'Click to play edited video reel in Full HD' : 'Click to enlarge in high resolution'}
              >
                <div className={`gallery-image-box ${isVideo ? 'gallery-video-box' : ''}`}>
                  {isVideo ? (
                    <>
                      <video
                        src={`${item.videoSrc}#t=${item.thumbTime || 0.5}`}
                        preload="metadata"
                        muted
                        playsInline
                        className="gallery-img gallery-video-thumb"
                      />
                      <div className="gallery-video-play-center">
                        <div className="video-play-glass-disc">
                          <Play size={22} fill="white" className="play-icon-glow" />
                        </div>
                      </div>
                      <div className="gallery-video-badge-tag">
                        <Film size={12} />
                        <span>{item.software || 'Edited Reel'}</span>
                      </div>
                    </>
                  ) : (
                    <img
                      src={item.src}
                      alt={item.alt || item.title}
                      loading="lazy"
                      className="gallery-img"
                    />
                  )}

                  <div className="gallery-hover-overlay">
                    <span className={`gallery-zoom-badge ${isVideo ? 'video-play-badge' : ''}`}>
                      {isVideo ? (
                        <>
                          <Play size={14} fill="currentColor" /> Watch HD Reel
                        </>
                      ) : (
                        <>
                          <ZoomIn size={15} /> Click to Enlarge
                        </>
                      )}
                    </span>
                  </div>
                </div>

                <div className="gallery-card-footer">
                  <div>
                    <h4 className="gallery-card-title">{item.title}</h4>
                    <span className="gallery-card-cat">{item.category}</span>
                  </div>
                  <span className={`gallery-card-badge ${isVideo ? 'video-badge-accent' : ''}`}>
                    {isVideo && <Film size={11} className="inline-icon" />}
                    {item.badge || 'Shot'}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
