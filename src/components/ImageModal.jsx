import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Camera, Download, Layers, Film, Play } from 'lucide-react';

export default function ImageModal({ photo, onClose, onNext, onPrev, currentIndex, totalCount }) {
  const isVideo = photo?.type === 'video' || !!photo?.videoSrc;

  useEffect(() => {
    if (!photo) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [photo, onClose, onNext, onPrev]);

  if (!photo) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={`modal-content ${isVideo ? 'modal-video-mode' : ''}`}
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Bar Actions */}
          <div className="modal-top-bar">
            {totalCount ? (
              <span className="modal-counter">
                {isVideo ? <Film size={13} /> : <Layers size={13} />} {currentIndex + 1} / {totalCount}
              </span>
            ) : <span />}

            <div className="modal-top-actions">
              <button
                className="modal-icon-btn"
                onClick={onClose}
                aria-label="Close media modal"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Navigation Controls */}
          {onPrev && (
            <button
              className="modal-nav-btn prev"
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              aria-label="Previous media"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {onNext && (
            <button
              className="modal-nav-btn next"
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              aria-label="Next media"
            >
              <ChevronRight size={24} />
            </button>
          )}

          {/* Media Display Wrapper (Video or Image) */}
          <div className={`modal-image-wrapper ${isVideo ? 'modal-video-wrapper' : ''}`}>
            {isVideo ? (
              <video
                key={photo.id || photo.videoSrc}
                src={photo.videoSrc}
                controls
                autoPlay
                playsInline
                className="modal-video-element"
              >
                Your browser does not support HTML5 video streaming.
              </video>
            ) : (
              <motion.img
                key={photo.id || photo.src}
                src={photo.src}
                alt={photo.alt}
                className="modal-image"
                initial={{ opacity: 0.6, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
              />
            )}
          </div>

          {/* Metadata Bar */}
          <div className="modal-meta">
            <div className="modal-meta-left">
              <span className={`modal-badge ${isVideo ? 'video-badge-accent' : ''}`}>
                {photo.badge || (isVideo ? 'Edited Video' : photo.category)}
              </span>
              <h3 className="modal-title">{photo.title || 'Perspective'}</h3>
              <p className="modal-caption">{photo.description || photo.alt || photo.filename}</p>
            </div>
            <div className="modal-meta-right">
              <span className="modal-camera-tag">
                {isVideo ? <Film size={14} /> : <Camera size={14} />}
                {photo.software ? `Edited with ${photo.software}` : 'Satyendra Portfolio Visuals'}
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
