'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const TethysContext = createContext();

export function TethysProvider({ children }) {
  // Default to 500 Resin (The "Starter" Pack)
  const [resin, setResin] = useState(500);
  const [unlockedArtifacts, setUnlockedArtifacts] = useState([]);

  // Load from LocalStorage on boot
  useEffect(() => {
    const savedResin = localStorage.getItem('tethys_resin');
    const savedUnlocks = localStorage.getItem('tethys_unlocks');
    
    if (savedResin) setResin(parseInt(savedResin));
    if (savedUnlocks) setUnlockedArtifacts(JSON.parse(savedUnlocks));
  }, []);

  // Save changes automatically
  useEffect(() => {
    localStorage.setItem('tethys_resin', resin);
    localStorage.setItem('tethys_unlocks', JSON.stringify(unlockedArtifacts));
  }, [resin, unlockedArtifacts]);

  // The "Burn" Action
  const burnResin = (amount, artifactId) => {
    if (resin >= amount) {
      setResin((prev) => prev - amount);
      setUnlockedArtifacts((prev) => [...prev, artifactId]);
      return true; // Success
    }
    return false; // Not enough funds
  };

  return (
    <TethysContext.Provider value={{ resin, unlockedArtifacts, burnResin }}>
      {children}
    </TethysContext.Provider>
  );
}

export function useTethys() {
  return useContext(TethysContext);
}