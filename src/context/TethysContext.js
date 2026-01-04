'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const TethysContext = createContext();

export function TethysProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.uid || 'guest_node';

  // --- STATE ---
  const [currentLocation, setCurrentLocation] = useState('pteros');
  const [unlockedNodes, setUnlockedNodes] = useState(['pteros', 'sky-city']);
  
  // Inventory & Stats
  const [inventory, setInventory] = useState([]);
  const [equippedStaff, setEquippedStaff] = useState(null);
  const [lastHarvestDate, setLastHarvestDate] = useState(null);
  
  // Stats (Added 'resin' specifically)
  const [stats, setStats] = useState({ 
    kith: 50,    
    igzier: 50,  
    sanity: 100,
    resin: 0 // The currency
  });
  
  const [canHarvest, setCanHarvest] = useState(false);

  // --- STORAGE KEY ---
  const STORAGE_KEY = `tethys_data_v1_${userId}`;

  // --- LOAD DATA ---
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setInventory(parsed.inventory || []);
      setEquippedStaff(parsed.equippedStaff || null);
      setStats(prev => ({ ...prev, ...(parsed.stats || {}) })); // Merge to ensure new keys like 'resin' exist
      setLastHarvestDate(parsed.lastHarvestDate || null);
    }
  }, [userId, STORAGE_KEY]);

  // --- SAVE DATA ---
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Only save if we have data to prevent overwriting with defaults on initial hydration
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      inventory,
      equippedStaff,
      stats,
      lastHarvestDate
    }));
  }, [inventory, equippedStaff, stats, lastHarvestDate, userId, STORAGE_KEY]);

  // --- HARVEST CHECKER ---
  useEffect(() => {
    if (!lastHarvestDate) {
      setCanHarvest(true);
      return;
    }
    const now = new Date();
    const last = new Date(lastHarvestDate);
    
    // Check if it's a different calendar day
    const isToday = now.getDate() === last.getDate() && 
                    now.getMonth() === last.getMonth() && 
                    now.getFullYear() === last.getFullYear();
    
    setCanHarvest(!isToday);
  }, [lastHarvestDate]);

  // --- ACTIONS ---
  
  const performDailyHarvest = useCallback((newStaff, newItems, newStats) => {
    // 1. Hard Check: If UI is out of sync, stop here.
    if (!canHarvest) {
      console.warn("Harvest attempted but currently locked.");
      return false;
    }

    const now = new Date().toISOString();

    // 2. Update State
    setEquippedStaff(newStaff);
    setInventory(newItems);
    
    // 3. Add Resin Reward (e.g., +10 to +50 random)
    const resinReward = Math.floor(Math.random() * 40) + 10;
    
    setStats(prev => ({ 
      ...prev, 
      ...newStats,
      resin: (prev.resin || 0) + resinReward 
    }));

    // 4. Lock immediately
    setLastHarvestDate(now);
    setCanHarvest(false);
    return true;
  }, [canHarvest]);

  const travelTo = (locationId) => {
    setCurrentLocation(locationId);
    if (!unlockedNodes.includes(locationId)) {
      setUnlockedNodes(prev => [...prev, locationId]);
    }
  };

  const value = {
    userId,
    currentLocation,
    inventory,
    equippedStaff,
    stats,
    canHarvest,
    performDailyHarvest,
    travelTo
  };

  return (
    <TethysContext.Provider value={value}>
      {children}
    </TethysContext.Provider>
  );
}

export function useTethys() {
  return useContext(TethysContext);
}
