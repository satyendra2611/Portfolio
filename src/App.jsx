import React, { useState, useCallback } from 'react';
import MotionCanvas from './components/MotionCanvas';
import CursorGlow from './components/CursorGlow';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Profile from './components/Profile';
import SelectedWork from './components/SelectedWork';
import GitHubActivity from './components/GitHubActivity';
import CreativeGallery from './components/CreativeGallery';
import BeforeAfterRetouch from './components/BeforeAfterRetouch';
import Skills from './components/Skills';
import Education from './components/Education';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ImageModal from './components/ImageModal';
import ScrollProgress from './components/ScrollProgress';
import SingularityDOMCollapse from './components/SingularityDOMCollapse';
import BigBangIntro from './components/BigBangIntro';
import ToolsMarquee from './components/ToolsMarquee';

export default function App() {
  const [bigBangDone, setBigBangDone] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoList, setPhotoList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Synthesize realistic subtle camera shutter click using Web Audio API
  const playShutterSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Shutter click 1 (mirror lift / mechanical snap)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(900, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);

      // Shutter click 2 (aperture release slightly delayed)
      setTimeout(() => {
        try {
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();

          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(650, ctx.currentTime);
          osc2.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.035);

          gain2.gain.setValueAtTime(0.08, ctx.currentTime);
          gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

          osc2.connect(gain2);
          gain2.connect(ctx.destination);

          osc2.start();
          osc2.stop(ctx.currentTime + 0.035);
        } catch (_) {}
      }, 40);
    } catch (_) {}
  }, [soundEnabled]);

  const handleSelectPhoto = useCallback((photo, index = 0, list = [photo]) => {
    setSelectedPhoto(photo);
    setCurrentIndex(index);
    setPhotoList(list);
  }, []);

  const handleNextPhoto = useCallback(() => {
    if (photoList.length === 0) return;
    playShutterSound();
    const nextIdx = (currentIndex + 1) % photoList.length;
    setCurrentIndex(nextIdx);
    setSelectedPhoto(photoList[nextIdx]);
  }, [currentIndex, photoList, playShutterSound]);

  const handlePrevPhoto = useCallback(() => {
    if (photoList.length === 0) return;
    playShutterSound();
    const prevIdx = (currentIndex - 1 + photoList.length) % photoList.length;
    setCurrentIndex(prevIdx);
    setSelectedPhoto(photoList[prevIdx]);
  }, [currentIndex, photoList, playShutterSound]);

  return (
    <div className="app-root">
      {/* Big Bang Cosmic Origin Opening Animation */}
      {!bigBangDone && (
        <BigBangIntro
          onComplete={() => setBigBangDone(true)}
          soundEnabled={soundEnabled}
        />
      )}

      {/* Scroll Progress Bar at the Top */}
      <ScrollProgress />

      {/* Interactive Cursor Spotlight Glow */}
      <CursorGlow />

      {/* Dynamic Shutter & Particle Canvas Field */}
      <MotionCanvas />

      {/* The Collapsible Universe: Every block, card, and text collapses into the black hole */}
      <div id="collapsible-universe" className="collapsible-universe">
        {/* Sticky Glassmorphism Header */}
        <Navbar
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          playShutterSound={playShutterSound}
        />

        {/* Main Portfolio Sections */}
        <main>
          <Hero
            onSelectPhoto={handleSelectPhoto}
            playShutterSound={playShutterSound}
          />

          <ToolsMarquee
            playShutterSound={playShutterSound}
          />

          <Profile />

          <SelectedWork
            playShutterSound={playShutterSound}
          />

          <GitHubActivity
            playShutterSound={playShutterSound}
          />

          <CreativeGallery
            onSelectPhoto={handleSelectPhoto}
            playShutterSound={playShutterSound}
          />

          <BeforeAfterRetouch
            playShutterSound={playShutterSound}
          />

          <Skills
            playShutterSound={playShutterSound}
          />

          <Education />

          <Contact
            playShutterSound={playShutterSound}
          />
        </main>

        {/* Footer */}
        <Footer
          playShutterSound={playShutterSound}
        />
      </div>

      {/* Deep Singularity Scroll Zone & Gravitational DOM Collapse Controller */}
      <SingularityDOMCollapse
        playShutterSound={playShutterSound}
      />

      {/* Lightbox Modal for High-Res Image Preview */}
      {selectedPhoto && (
        <ImageModal
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          onNext={photoList.length > 1 ? handleNextPhoto : null}
          onPrev={photoList.length > 1 ? handlePrevPhoto : null}
          currentIndex={currentIndex}
          totalCount={photoList.length}
        />
      )}
    </div>
  );
}
