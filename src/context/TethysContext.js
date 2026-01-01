"use client";
import { createContext, useContext, useEffect, useState } from 'react';

const TethysContext = createContext();

export function TethysProvider({ children }) {
  // Global World States
  const [worldState, setWorldState] = useState('dormant');
  
  // Resources & Puzzle States (The missing pieces)
  const [energyLevel, setEnergyLevel] = useState(50);
  const [harvestPressure, setHarvestPressure] = useState(0); // For Sluice Gate
  const [oilLevel, setOilLevel] = useState(20);             // For Sluice Gate
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  // Unlock AudioContext on first user gesture
  useEffect(() => {
    const handleInteraction = () => {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') ctx.resume();
        setAudioUnlocked(true);
      } catch (err) {
        console.warn('Audio unlock failed:', err);
      } finally {
        window.removeEventListener('click', handleInteraction);
        window.removeEventListener('keydown', handleInteraction);
      }
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  return (
    <TethysContext.Provider value={{ 
      worldState, setWorldState, 
      energyLevel, setEnergyLevel,
      harvestPressure, setHarvestPressure, // Exporting these is crucial
      oilLevel, setOilLevel,               // Exporting these is crucial
      audioUnlocked
    }}>
      {children}
    </TethysContext.Provider>
  );
}

export function useTethys() {
  return useContext(TethysContext);
}
