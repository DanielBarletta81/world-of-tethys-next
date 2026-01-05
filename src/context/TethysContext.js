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
  resin: 0 
};

export function TethysProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.uid || 'guest_node';
  const isGuest = !user;

  // --- STATE ---
  const [currentLocation, setCurrentLocation] = useState('pteros');
  const [unlockedNodes, setUnlockedNodes] = useState(['pteros', 'sky-city']); // <--- Ensure this exists
  const [unlockedAssets, setUnlockedAssets] = useState([]); // <--- Ensure this exists
  const [inventory, setInventory] = useState([]);
  const [equippedStaff, setEquippedStaff] = useState(null);
  const [lastHarvestDate, setLastHarvestDate] = useState(null);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [canHarvest, setCanHarvest] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // --- 1. DATA SYNC (LOAD) ---
  useEffect(() => {
    async function loadData() {
      setLoadingData(true);

      if (isGuest) {
        // --- LOAD FROM LOCAL STORAGE (Guest) ---
        if (typeof window !== 'undefined') {
          const saved = localStorage.getItem(`tethys_data_guest`);
          if (saved) {
            const parsed = JSON.parse(saved);
            applyData(parsed);
          }
        }
      } else {
        // --- LOAD FROM FIRESTORE (User) ---
        try {
          const docRef = doc(db, "users", userId);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            applyData(docSnap.data());
          } else {
            // New user? Create default doc
            const initialData = {
              stats: DEFAULT_STATS,
              inventory: [],
              unlockedNodes: ['pteros', 'sky-city'],
              unlockedAssets: [],
              currentLocation: 'pteros'
            };
            await setDoc(docRef, initialData);
            applyData(initialData);
          }
        } catch (error) {
          console.error("Tethys Cloud Sync Failed:", error);
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

  // --- 2. DATA SYNC (SAVE) ---
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
          console.warn("Cloud save pending...");
        }
      }
    };

    const timeout = setTimeout(save, 1000); 
    return () => clearTimeout(timeout);

  }, [inventory, equippedStaff, stats, lastHarvestDate, unlockedNodes, unlockedAssets, currentLocation, userId, isGuest, loadingData]);


  // --- ACTIONS ---
  
  const performDailyHarvest = useCallback((newStaff, newItems, newStats) => {
    if (!canHarvest) return false;

    const now = new Date().toISOString();
    setEquippedStaff(newStaff);
    setInventory(newItems);
    
    const resinReward = Math.floor(Math.random() * 40) + 10;
    setStats(prev => ({ 
      ...prev, 
      ...newStats,
      resin: (prev.resin || 0) + resinReward 
    }));

    setLastHarvestDate(now);
    setCanHarvest(false);
    return true;
  }, [canHarvest]);

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
    userId,
    isGuest,
    loadingData,
    currentLocation,
    inventory,
    equippedStaff,
    stats,
    unlockedNodes, // <--- THIS WAS MISSING
    unlockedAssets, // <--- Added this for the crate system
    canHarvest,
    performDailyHarvest,
    purchaseAsset,
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
