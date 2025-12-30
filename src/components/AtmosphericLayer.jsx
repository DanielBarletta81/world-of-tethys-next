'use client';

import { useEffect } from 'react';

/**
 * Global atmospheric overlays for vellum mask + torchlight glow.
 * Tracks mouse to move the algae/torch gradient.
 */
export default function AtmosphericLayer() {
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      document.documentElement.style.setProperty('--mouse-x', `${x}%`);
      document.documentElement.style.setProperty('--mouse-y', `${y}%`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <div className="algae-glow" aria-hidden />
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="inkBleed">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" />
        </filter>
      </svg>
    </>
  );
}
