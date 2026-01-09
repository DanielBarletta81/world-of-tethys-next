'use client';
import { useEffect, useRef } from 'react';

const SFX_MANIFEST = {
  // UI Sounds
  hover_torch: '/sfx/hover_torch.mp3',
  click_torch: '/sfx/click_torch.mp3',
  
  // Immersion Sounds
 // rumble_volcano: '/sfx/sub-bass-rumble.mp3',
 // high_pitch_whine: '/sfx/mosquito-whine.mp3', // For Stranger Cards
  
  // The Cinematic Intro Suite
  intro_drone: '/sfx/intro_drone.mp3',       // 15s Ambient Bed
  war_horns: '/sfx/war_horns.mp3',           // Deep Braam/Horn (3-4s)
  logo_hit: '/sfx/logo_hit.mp3',             // Heavy Slam (2s)
  text_glitch: '/sfx/text_glitch.mp3'        // Short Click (0.5s)
};

export default function useSoundFX() {
  const audioCache = useRef({});

  // 1. Preload Audio on Mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      Object.entries(SFX_MANIFEST).forEach(([key, src]) => {
        // Create audio objects but don't play them yet
        const audio = new Audio(src);
        audio.volume = 0.5;
        audioCache.current[key] = audio;
      });
    }
  }, []);

  // 2. The Play Engine
  const play = (key, volume = 0.5, loop = false) => {
    const audio = audioCache.current[key];
    
    if (audio) {
      // Reset logic to allow rapid re-firing
      audio.currentTime = 0;
      audio.volume = volume;
      audio.loop = loop;
      
      // Play and catch errors (like user interaction requirements)
      audio.play().catch((e) => {
        // Silent failure is okay; usually means user hasn't clicked yet
        console.warn(`Audio blocked [${key}]:`, e);
      });

      // CRITICAL: Return the instance so we can fade it out externally
      return audio;
    }
    return null;
  };

  return {
    // UI
    playHover: () => play('hover_torch', 0.1),
    playClick: () => play('click_torch', 0.3),
    
    // Atmosphere
    playRumble: () => play('rumble_volcano', 0.4),
    //playWhine: () => play('high_pitch_whine', 0.05),
    //playShriek: () => play('high_pitch_whine', 0.2), // Re-using whine for now, or add specific shriek

    // Cinematic Intro
    playDrone: () => play('intro_drone', 0.4, true), // Looping just in case
    playHorns: () => play('war_horns', 0.6),
    playLogoHit: () => play('logo_hit', 1.0),
    playTextGlitch: () => play('text_glitch', 0.15),
  };
}
// World of Tethys || D.C. Barletta
