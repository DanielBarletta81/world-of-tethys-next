'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';

const TethysContext = createContext();

const DEFAULT_READING = {
  human: 25,
  creature: 40,
  lore: 30,
  geography: 35,
  geology: 28,
  hybrid: 5
};

const loadJSON = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export function TethysProvider({ children }) {
  const [worldState, setWorldState] = useState('dormant');
  const [syncFrequency, setSyncFrequency] = useState(440);
  const [oilLevel, setOilLevel] = useState(20);
  const [harvestPressure, setHarvestPressure] = useState(0);
  const [isNuteRoaring, setIsNuteRoaring] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);

  const [resin, setResin] = useState(() => (typeof window === 'undefined' ? 500 : Number(window.localStorage.getItem('tethys_resin')) || 500));
  const [unlockedArtifacts, setUnlockedArtifacts] = useState(() => loadJSON('tethys_unlocks', []));
  const [readingStats, setReadingStats] = useState(() => loadJSON('tethys_stats', DEFAULT_READING));
  const [mode, setMode] = useState(() => (typeof window === 'undefined' ? 'explore' : window.localStorage.getItem('tethys_mode') || 'explore'));

  const audioCtxRef = useRef(null);

  // Persist core fields
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('tethys_resin', String(resin));
    window.localStorage.setItem('tethys_unlocks', JSON.stringify(unlockedArtifacts));
    window.localStorage.setItem('tethys_stats', JSON.stringify(readingStats));
    window.localStorage.setItem('tethys_mode', mode);
  }, [resin, unlockedArtifacts, readingStats, mode]);

  // Audio unlock on first gesture
  useEffect(() => {
    const handleInteraction = () => {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        if (!audioCtxRef.current) audioCtxRef.current = new AudioCtx();
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume().then(() => setAudioUnlocked(true));
        } else {
          setAudioUnlocked(true);
        }
      } catch (err) {
        console.warn('Audio unlock failed:', err);
      } finally {
        ['click', 'keydown', 'touchstart'].forEach((evt) => window.removeEventListener(evt, handleInteraction));
      }
    };
    ['click', 'keydown', 'touchstart'].forEach((evt) => window.addEventListener(evt, handleInteraction));
    return () => {
      ['click', 'keydown', 'touchstart'].forEach((evt) => window.removeEventListener(evt, handleInteraction));
    };
  }, []);

  // Economy helpers
  const earnResin = (amount = 0, source = 'action') => {
    const val = Math.max(0, Math.floor(amount));
    setResin((prev) => prev + val);
    return true;
  };

  const spendResin = (amount = 0, artifactId) => {
    const cost = Math.max(0, Math.floor(amount));
    let success = false;
    setResin((prev) => {
      if (prev < cost) return prev;
      success = true;
      return prev - cost;
    });
    if (success && artifactId) {
      setUnlockedArtifacts((prev) => (prev.includes(artifactId) ? prev : [...prev, artifactId]));
    }
    return success;
  };

  const burnResin = (amount, artifactId) => spendResin(amount, artifactId); // alias for legacy calls

  const incrementStats = (updates = {}) => {
    setReadingStats((prev) => {
      const next = { ...prev };
      Object.entries(updates).forEach(([k, v]) => {
        next[k] = (next[k] || 0) + (Number(v) || 0);
      });
      return next;
    });
  };

  const setModeChoice = (next) => {
    setMode(next);
    if (typeof window !== 'undefined') window.localStorage.setItem('tethys_mode', next);
  };

  return (
    <TethysContext.Provider
      value={{
        worldState,
        setWorldState,
        syncFrequency,
        setSyncFrequency,
        oilLevel,
        setOilLevel,
        harvestPressure,
        setHarvestPressure,
        isNuteRoaring,
        setIsNuteRoaring,
        audioUnlocked,
        resin,
        earnResin,
        spendResin,
        burnResin,
        unlockedArtifacts,
        readingStats,
        incrementStats,
        mode,
        setModeChoice
      }}
    >
      {children}
    </TethysContext.Provider>
  );
}

export function useTethys() {
  return useContext(TethysContext);
}
