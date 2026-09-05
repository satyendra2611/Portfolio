import React, { useEffect, useState } from 'react';

export default function CursorGlow({ theme }) {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };

    const handleLeave = () => setVisible(false);

    window.addEventListener('mousemove', handleMove, { passive: true });
    document.body.addEventListener('mouseleave', handleLeave);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      document.body.removeEventListener('mouseleave', handleLeave);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={`cursor-glow ${
        theme === 'cat-realm'
          ? 'cursor-glow-cat'
          : theme === 'camera-red'
          ? 'cursor-glow-red'
          : theme === 'hifi-studio'
          ? 'cursor-glow-hifi'
          : ''
      }`}
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`
      }}
      aria-hidden="true"
    />
  );
}
