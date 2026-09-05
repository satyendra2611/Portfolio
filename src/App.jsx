import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import CameraFlashTransition from './components/CameraFlashTransition';
import CameraClickBurst from './components/CameraClickBurst';
import VivoX300AudioWidget from './components/VivoX300AudioWidget';
import CatSwipeTransition from './components/CatSwipeTransition';
import CatPawTrail from './components/CatPawTrail';
import CatCompanionWidget from './components/CatCompanionWidget';
import { HIFI_AMBIENT_MUSIC_BASE64 } from './assets/hifiAmbientMusicBase64';

export default function App() {
  const [bigBangDone, setBigBangDone] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoList, setPhotoList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('portfolio-theme') || 'cosmic';
  });
  const [cameraFlashActive, setCameraFlashActive] = useState(false);
  const [catSwipeActive, setCatSwipeActive] = useState(false);
  const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
  const [ambientMuted, setAmbientMuted] = useState(false);
  const ambientAudioRef = useRef(null);

  // Synthesize realistic acoustic headphone plug-in / bass pop sound
  const playHiFiPluginSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // 1. Dual Jack Connect Clicks
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(420, now);
      osc1.frequency.exponentialRampToValueAtTime(80, now + 0.04);
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.04);

      // 2. JBL Deep Bass Subwoofer Pulse (60Hz -> 35Hz thump)
      setTimeout(() => {
        try {
          const bassOsc = ctx.createOscillator();
          const bassGain = ctx.createGain();
          bassOsc.type = 'sine';
          bassOsc.frequency.setValueAtTime(65, ctx.currentTime);
          bassOsc.frequency.exponentialRampToValueAtTime(32, ctx.currentTime + 0.35);
          bassGain.gain.setValueAtTime(0.28, ctx.currentTime);
          bassGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
          bassOsc.connect(bassGain);
          bassGain.connect(ctx.destination);
          bassOsc.start(ctx.currentTime);
          bassOsc.stop(ctx.currentTime + 0.35);

          // 3. Hi-Res 384kHz DAC Acoustic Chime (two pristine harmonic frequencies)
          const chime = ctx.createOscillator();
          const chimeGain = ctx.createGain();
          chime.type = 'sine';
          chime.frequency.setValueAtTime(1046.5, ctx.currentTime); // C6
          chimeGain.gain.setValueAtTime(0.08, ctx.currentTime);
          chimeGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
          chime.connect(chimeGain);
          chimeGain.connect(ctx.destination);
          chime.start(ctx.currentTime);
          chime.stop(ctx.currentTime + 0.4);
        } catch (_) {}
      }, 50);
    } catch (_) {}
  }, [soundEnabled]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      let next;
      if (prev === 'cosmic') {
        // Switching to Camera Red: Trigger dramatic camera & flash transition!
        setCameraFlashActive(true);
        next = 'camera-red';
      } else if (prev === 'camera-red') {
        // Switching to Hi-Fi Studio: Trigger deep bass & DAC plug sound!
        playHiFiPluginSound();
        next = 'hifi-studio';
      } else if (prev === 'hifi-studio') {
        // Switching to Cat Realm: Trigger glowing cat paw swipe transition!
        setCatSwipeActive(true);
        next = 'cat-realm';
      } else {
        // Back to Cosmic Galaxy
        next = 'cosmic';
      }
      localStorage.setItem('portfolio-theme', next);
      return next;
    });
  }, [playHiFiPluginSound]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Continuous low-volume ambient music in Base64 for Hi-Fi Studio theme
  useEffect(() => {
    let cleanupListeners = () => {};

    if (theme === 'hifi-studio' && soundEnabled && !ambientMuted) {
      if (!ambientAudioRef.current) {
        const audio = new Audio(HIFI_AMBIENT_MUSIC_BASE64);
        audio.loop = true;
        audio.volume = 0.14; // Low sound as requested
        ambientAudioRef.current = audio;
      } else {
        ambientAudioRef.current.volume = 0.14;
        ambientAudioRef.current.loop = true;
      }

      const playAudio = () => {
        if (!ambientAudioRef.current || theme !== 'hifi-studio' || !soundEnabled || ambientMuted) return;
        const p = ambientAudioRef.current.play();
        if (p !== undefined) {
          p.then(() => {
            setIsAmbientPlaying(true);
          }).catch(() => {
            // Autoplay waiting for user gesture
            setIsAmbientPlaying(false);
          });
        }
      };

      playAudio();

      // Fallback for browsers requiring user gesture
      const handleUserInteraction = () => {
        playAudio();
      };

      window.addEventListener('click', handleUserInteraction, { once: true });
      window.addEventListener('keydown', handleUserInteraction, { once: true });
      window.addEventListener('touchstart', handleUserInteraction, { once: true });

      cleanupListeners = () => {
        window.removeEventListener('click', handleUserInteraction);
        window.removeEventListener('keydown', handleUserInteraction);
        window.removeEventListener('touchstart', handleUserInteraction);
      };
    } else {
      if (ambientAudioRef.current) {
        ambientAudioRef.current.pause();
        if (theme !== 'hifi-studio') {
          ambientAudioRef.current.currentTime = 0;
        }
        setIsAmbientPlaying(false);
      }
    }

    return () => {
      cleanupListeners();
      if (ambientAudioRef.current && theme !== 'hifi-studio') {
        ambientAudioRef.current.pause();
        ambientAudioRef.current.currentTime = 0;
      }
    };
  }, [theme, soundEnabled, ambientMuted]);

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
    <div className={`app-root theme-${theme}`}>
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
      <CursorGlow theme={theme} />

      {/* Interactive Cat Paw Trails & Click Pounces (Cat Realm Theme) */}
      <CatPawTrail
        theme={theme}
        soundEnabled={soundEnabled}
      />

      {/* Dynamic Shutter & Particle Canvas Field */}
      <MotionCanvas theme={theme} />

      {/* The Collapsible Universe: Every block, card, and text collapses into the black hole */}
      <div id="collapsible-universe" className="collapsible-universe">
        {/* Sticky Glassmorphism Header */}
        <Navbar
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          playShutterSound={playShutterSound}
          theme={theme}
          toggleTheme={toggleTheme}
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
          theme={theme}
        />
      </div>

      {/* Deep Singularity Scroll Zone & Gravitational DOM Collapse Controller (Cosmic Theme Only) */}
      <SingularityDOMCollapse
        playShutterSound={playShutterSound}
        theme={theme}
      />

      {/* Cinematic Camera Materialize & Flash Burst Transition (When switching to Camera Red) */}
      <CameraFlashTransition
        active={cameraFlashActive}
        onComplete={() => setCameraFlashActive(false)}
        soundEnabled={soundEnabled}
      />

      {/* Laser Shutter Click Micro-Burst & Sound FX (Camera Red Theme) */}
      <CameraClickBurst
        theme={theme}
        soundEnabled={soundEnabled}
      />

      {/* Vivo X300 384kHz DAC & Hi-Fi Audio Station Dock Widget (Hi-Fi Studio Theme) */}
      <VivoX300AudioWidget
        theme={theme}
        soundEnabled={soundEnabled}
        isAmbientPlaying={isAmbientPlaying}
        ambientMuted={ambientMuted}
        onToggleAmbientMute={() => setAmbientMuted((prev) => !prev)}
      />

      {/* Playful Cat Paw Swipe Transition (When switching to Cat Realm Theme) */}
      <CatSwipeTransition
        active={catSwipeActive}
        onComplete={() => setCatSwipeActive(false)}
        soundEnabled={soundEnabled}
      />

      {/* Interactive Virtual Neko / Cyber Cat Companion Widget (Cat Realm Theme) */}
      <CatCompanionWidget
        theme={theme}
        soundEnabled={soundEnabled}
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
