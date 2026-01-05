/// src/hooks/useSoundFX.js
'use client';


// SILENT MODE: Allows the site to run without audio files
export default function useSoundFX() {
  return {
    playHover: () => {},      // Do nothing
    playClick: () => {},      // Do nothing
    playRumble: () => {},     // Do nothing
    playShriek: () => {},     // Do nothing
    playWhine: () => {},      // Do nothing
    playDrone: () => {},      // Do nothing
    playHorns: () => {},      // Do nothing
    playLogoHit: () => {},    // Do nothing
    playTextGlitch: () => {}, // Do nothing
  };
}