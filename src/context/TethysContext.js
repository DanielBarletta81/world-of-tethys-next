'use client';

import { createContext, useContext, useMemo, useState } from 'react';

const TethysContext = createContext(null);

export function TethysProvider({ children }) {
  const [syncFrequency, setSyncFrequency] = useState(528);
  const [oilLevel, setOilLevel] = useState(72);
  const [harvestPressure, setHarvestPressure] = useState(3);

  const isNuteRoaring = syncFrequency < 410 || harvestPressure > 7;

  const value = useMemo(
    () => ({
      syncFrequency,
      setSyncFrequency,
      oilLevel,
      setOilLevel,
      harvestPressure,
      setHarvestPressure,
      isNuteRoaring
    }),
    [syncFrequency, oilLevel, harvestPressure, isNuteRoaring]
  );

  return <TethysContext.Provider value={value}>{children}</TethysContext.Provider>;
}

export function useTethys() {
  const context = useContext(TethysContext);
  if (!context) {
    throw new Error('useTethys must be used within a TethysProvider');
  }
  return context;
}
