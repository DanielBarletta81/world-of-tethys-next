"use client";
import { createContext, useContext, useState } from 'react';

const TethysContext = createContext();

export function TethysProvider({ children }) {
  // Global World States
  const [worldState, setWorldState] = useState('dormant');
  
  // Resources & Puzzle States (The missing pieces)
  const [energyLevel, setEnergyLevel] = useState(50);
  const [harvestPressure, setHarvestPressure] = useState(0); // For Sluice Gate
  const [oilLevel, setOilLevel] = useState(20);             // For Sluice Gate

  return (
    <TethysContext.Provider value={{ 
      worldState, setWorldState, 
      energyLevel, setEnergyLevel,
      harvestPressure, setHarvestPressure, // Exporting these is crucial
      oilLevel, setOilLevel                // Exporting these is crucial
    }}>
      {children}
    </TethysContext.Provider>
  );
}

export function useTethys() {
  return useContext(TethysContext);
}