"use client";
import { createContext, useContext, useEffect, useState, useRef } from 'react';

const TethysContext = createContext();

export function TethysProvider({ children }) {
  // --- 1. WORLD STATE (With Persistence) ---
  const [worldState, setWorldState] = useState('dormant');
  
  // Default values
  const [energyLevel, setEnergyLevel] = useState(50);
  const [harvestPressure, setHarvestPressure] = useState(0); 
  const [oilLevel, setOilLevel] = useState(20);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  // Keep a reference to the AudioContext so we don't garbage collect it
  const audioCtxRef = useRef(null);

  // --- 2. HYDRATION (Load from LocalStorage) ---
  useEffect(() => {
    // Check if we are in the browser
    if (typeof window !== 'undefined') {
      const savedEnergy = localStorage.getItem('tethys_energy');
      const savedOil = localStorage.getItem('tethys_oil');
      
      if (savedEnergy) setEnergyLevel(parseInt(savedEnergy));
      if (savedOil) setOilLevel(parseInt(savedOil));
    }
  }, []);

  // --- 3. AUTO-SAVE (Save to LocalStorage) ---
  useEffect(() => {
    localStorage.setItem('tethys_energy', energyLevel.toString());
    localStorage.setItem('tethys_oil', oilLevel.toString());
  }, [energyLevel, oilLevel]);

  // --- 4. AUDIO UNLOCK (Enhanced for Mobile) ---
  useEffect(() => {
    const handleInteraction = () => {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;

        // Only create if it doesn't exist
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioCtx();
        }

        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume().then(() => {
            console.log("Tethys Audio Engine: Online");
            setAudioUnlocked(true);
          });
        } else {
          setAudioUnlocked(true);
        }
      } catch (err) {
        console.warn('Audio unlock failed:', err);
      } finally {
        // Clean up listeners immediately to avoid double-firing
        ['click', 'keydown', 'touchstart'].forEach(evt => 
          window.removeEventListener(evt, handleInteraction)
        );
      }
    };

    // Add touchstart for better mobile support
    ['click', 'keydown', 'touchstart'].forEach(evt => 
      window.addEventListener(evt, handleInteraction)
    );

    return () => {
      ['click', 'keydown', 'touchstart'].forEach(evt => 
        window.removeEventListener(evt, handleInteraction)
      );
    };
  }, []);

  // Optional: A helper to play sound effects using the unlocked context
  const playGlobalSound = (url) => {
    if (!audioUnlocked) return;
    const audio = new Audio(url);
    audio.play().catch(e => console.warn("Audio blocked", e));
  };

  return (
    <TethysContext.Provider value={{ 
      worldState, setWorldState, 
      energyLevel, setEnergyLevel,
      harvestPressure, setHarvestPressure,
      oilLevel, setOilLevel,
      audioUnlocked,
      playGlobalSound // Exported helper
    }}>
      {children}
    </TethysContext.Provider>
  );
}

export function useTethys() {
  return useContext(TethysContext);
}