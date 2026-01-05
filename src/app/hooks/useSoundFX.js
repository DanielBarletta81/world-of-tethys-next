// src/hooks/useSoundFX.js
'use client';
import { useEffect, useRef } from 'react';

const SFX_MANIFEST = {
  // UI / Interaction
  hover_geiger: '/sfx/geiger-tick.mp3',       // Light map hover
  click_heavy: '/sfx/heavy-switch.mp3',       // Tab clicks
  
  // The User's Specific Requests
  rumble_volcano: '/sfx/sub-bass-rumble.mp3', // Asset Crate unlock / Heavy transitions
  dino_shriek: '/sfx/raptor-call.mp3',        // Danger nodes / Bestiary
  stranger_whine: '/sfx/synth-whine-high.mp3' // Stranger Card hover (The "Upside Down" sound)
};

export default function useSoundFX() {
  const audioCache = useRef({});

  useEffect(() => {
    // Preload sounds on mount
    Object.entries(SFX_MANIFEST).forEach(([key, src]) => {
      const audio = new Audio(src);
      audio.volume = 0.4; // Default volume
      audioCache.current[key] = audio;
    });
  }, []);

  const play = (key, volume = 0.4) => {
    const audio = audioCache.current[key];
    if (audio) {
      audio.currentTime = 0; // Rewind to start for rapid firing
      audio.volume = volume;
      audio.play().catch(e => console.log('Audio play blocked:', e));
    }
  };

  return {
    playHover: () => play('hover_geiger', 0.1),
    playClick: () => play('click_heavy', 0.5),
    playRumble: () => play('rumble_volcano', 0.6),
    playShriek: () => play('dino_shriek', 0.3),
    playWhine: () => play('stranger_whine', 0.2), // Keep low to avoid annoyance
  };
}