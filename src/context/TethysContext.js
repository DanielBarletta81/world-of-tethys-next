"use client";

import { createContext, useContext, useState } from 'react';

// 1. Create the Context
const TethysContext = createContext();

// 2. Create the Provider (Wraps your app)
export function TethysProvider({ children }) {
  const [worldState, setWorldState] = useState('dormant'); 
  const [energyLevel, setEnergyLevel] = useState(0);

  return (
    <TethysContext.Provider value={{ worldState, setWorldState, energyLevel, setEnergyLevel }}>
      {children}
    </TethysContext.Provider>
  );
}

// 3. Export the Hook (This is what you are trying to import)
export function useTethys() {
  return useContext(TethysContext);
}