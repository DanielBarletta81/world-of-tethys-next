'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const TethysContext = createContext();

const DEFAULT_STATS = { 
  kith: 50,    
  igzier: 50,  
  sanity: 100,
  resin: 0,
  loginStreak: 0 
};

export function TethysProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.uid || 'guest_node';
  const isGuest = !user;

  // --- STATE ---
  const [currentLocation, setCurrentLocation] = useState('pteros');
  const [unlockedNodes, setUnlockedNodes] = useState(['pteros', 'sky-city']);
  const [unlockedAssets, setUnlockedAssets] = useState([]); // <--- ADDED
  const [inventory, setInventory] = useState([]);
  const [equippedStaff, setEquippedStaff] = useState(null);
  const [lastHarvestDate, setLastHarvestDate] = useState(null);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [canHarvest, setCanHarvest] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // --- 1. LOAD DATA ---
  useEffect(() => {
    async function loadData() {
      setLoadingData(true);
      if (isGuest) {
        if (typeof window !== 'undefined') {
          const saved = localStorage.getItem(`tethys_data_guest`);
          if (saved) applyData(JSON.parse(saved));
        }
      } else {
        try {
          const docRef = doc(db, "users", userId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            applyData(docSnap.data());
          } else {
            // New user init
            const initialData = {
              stats: DEFAULT_STATS,
              inventory: [],
              unlockedNodes: ['pteros', 'sky-city'],
              unlockedAssets: [],
              currentLocation: 'pteros',
              lastHarvestDate: null
            };
            await setDoc(docRef, initialData);
            applyData(initialData);
          }
        } catch (error) {
          console.error("Cloud Sync Error:", error);
        }
      }
      setLoadingData(false);
    }
    loadData();
  }, [userId, isGuest]);

  const applyData = (data) => {
    if (data.inventory) setInventory(data.inventory);
    if (data.equippedStaff) setEquippedStaff(data.equippedStaff);
    if (data.stats) setStats(prev => ({ ...prev, ...data.stats }));
    if (data.lastHarvestDate) setLastHarvestDate(data.lastHarvestDate);
    if (data.unlockedNodes) setUnlockedNodes(data.unlockedNodes);
    if (data.unlockedAssets) setUnlockedAssets(data.unlockedAssets);
  };

  // --- 2. SAVE DATA ---
  useEffect(() => {
    if (loadingData) return;

    const dataToSave = {
      inventory,
      equippedStaff,
      stats,
      lastHarvestDate,
      unlockedNodes,
      unlockedAssets,
      currentLocation
    };

    const save = async () => {
      if (isGuest) {
        localStorage.setItem(`tethys_data_guest`, JSON.stringify(dataToSave));
      } else {
        try {
          const docRef = doc(db, "users", userId);
          await updateDoc(docRef, dataToSave);
        } catch (e) {
          console.warn("Save pending...");
        }
      }
    };

    const timeout = setTimeout(save, 2000);
    return () => clearTimeout(timeout);
  }, [inventory, equippedStaff, stats, lastHarvestDate, unlockedNodes, unlockedAssets, currentLocation, userId, isGuest, loadingData]);

  // --- 3. ACTIONS ---

  const performDailyHarvest = useCallback((newStaff, newItems, bonusStats) => {
    if (!canHarvest) return false;

    const now = new Date();
    // Streak Logic
    let newStreak = (stats.loginStreak || 0) + 1;
    const last = lastHarvestDate ? new Date(lastHarvestDate) : new Date(0);
    const hoursSince = (now - last) / (1000 * 60 * 60);
    if (hoursSince > 48) newStreak = 1;

    // Map Unlock Logic
    const newNodes = [...unlockedNodes];
    if (newStreak >= 3 && !newNodes.includes('iron-sands')) newNodes.push('iron-sands');

    const resinReward = 50 + (newStreak * 10);

    setStats(prev => ({ 
      ...prev, 
      ...bonusStats,
      resin: (prev.resin || 0) + resinReward,
      loginStreak: newStreak
    }));
    
    if (newStaff) setEquippedStaff(newStaff);
    if (newItems) setInventory(newItems);
    setUnlockedNodes(newNodes);
    setLastHarvestDate(now.toISOString());
    setCanHarvest(false);
    return { success: true, resin: resinReward };
  }, [canHarvest, stats.loginStreak, unlockedNodes, lastHarvestDate]);

  // The function your AssetCrate is trying to call
  const purchaseAsset = (assetId, cost) => {
    if (unlockedAssets.includes(assetId)) return { success: true, message: "Already Owned" };
    if (stats.resin < cost) return { success: false, message: "Insufficient Resin" };

    setStats(prev => ({ ...prev, resin: prev.resin - cost }));
    setUnlockedAssets(prev => [...prev, assetId]);
    return { success: true, message: "Asset Decrypted" };
  };

  const travelTo = (locationId) => {
    setCurrentLocation(locationId);
    if (!unlockedNodes.includes(locationId)) {
      setUnlockedNodes(prev => [...prev, locationId]);
    }
  };

  const value = {
    userId, isGuest, loadingData, currentLocation,
    inventory, equippedStaff, stats, unlockedNodes, unlockedAssets, canHarvest,
    performDailyHarvest, purchaseAsset, travelTo
  };

  return <TethysContext.Provider value={value}>{children}</TethysContext.Provider>;
}

export function useTethys() { return useContext(TethysContext); }