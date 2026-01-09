'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp, collection, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { DEFAULT_PLAYER_PROFILE } from '@/lib/player-defaults';

const TethysContext = createContext();

const DEFAULT_STATS = { 
  kith: 50,    
  igzier: 50,  
  sanity: 100,
  resin: 0,
  loginStreak: 0 
};

const DEFAULT_STARTER_TEMPLATE = {
  templateId: 'starter_v1',
  name: 'Starter v1',
  rules: {
    staffSeedMode: 'random',
    baseStaffStats: { geology: 0, creature: 0, lore: 0, human: 0 },
    giveItems: ['item_wrap_sinew_01', 'item_pouch_ash_01'],
    defaultCreatureArchetype: 'none'
  }
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
  const [playerProfile, setPlayerProfile] = useState(DEFAULT_PLAYER_PROFILE);
  const [creatures, setCreatures] = useState([]);
  const [events, setEvents] = useState([]);
 
  const hasOnboarded = Boolean(equippedStaff || playerProfile?.onboarding?.status === 'complete');

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
          const docRef = doc(db, "players", userId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            applyData(docSnap.data());
            setPlayerProfile(prev => ({ ...DEFAULT_PLAYER_PROFILE, ...docSnap.data() }));
            // Load creature bonds (subcollection)
            const creatureSnap = await getDocs(collection(db, "players", userId, "creatures"));
            const cList = [];
            creatureSnap.forEach((c) => cList.push({ id: c.id, ...c.data() }));
            setCreatures(cList);
            const eventSnap = await getDocs(collection(db, "players", userId, "events"));
            const eList = [];
            eventSnap.forEach((ev) => eList.push({ id: ev.id, ...ev.data() }));
            setEvents(eList);
          } else {
            // New user init
            const initialData = {
              stats: DEFAULT_STATS,
              inventory: [],
              unlockedNodes: ['pteros', 'sky-city'],
              unlockedAssets: [],
              currentLocation: 'pteros',
              lastHarvestDate: null,
              ...DEFAULT_PLAYER_PROFILE,
              identity: {
                ...DEFAULT_PLAYER_PROFILE.identity,
                handle: user?.displayName || 'Ghost Ward',
                title: 'Ghost Ward'
              },
              createdAt: serverTimestamp(),
              lastLoginAt: serverTimestamp()
            };
            await setDoc(docRef, initialData);
            applyData(initialData);
            setPlayerProfile(initialData);
            setCreatures([]);
            setEvents([]);
          }
        } catch (error) {
          console.error("Cloud Sync Error:", error);
        }
      }
      setLoadingData(false);
    }
    loadData();
  }, [userId, isGuest, user?.displayName]);

  // compute harvest availability
  useEffect(() => {
    if (loadingData) return;
    if (!lastHarvestDate) {
      setCanHarvest(true);
      return;
    }
    const hoursSince = (Date.now() - new Date(lastHarvestDate).getTime()) / (1000 * 60 * 60);
    setCanHarvest(hoursSince >= 24);
  }, [lastHarvestDate, loadingData]);


  const getHarvestCooldown = (lastDate) => {
  if (!lastDate) return { canHarvest: true, hoursLeft: 0 };
  const diff = Date.now() - new Date(lastDate).getTime();
  const hours = diff / (1000 * 60 * 60);
  return {
    canHarvest: hours >= 24,
    hoursLeft: Math.max(0, 24 - hours)
  };
};


  const applyData = (data) => {
    if (data.inventory) {
      const inv = Array.isArray(data.inventory) ? data.inventory : Object.values(data.inventory);
      setInventory(inv);
    }
    if (data.equippedStaff) {
      setEquippedStaff(data.equippedStaff);
    } else if (data.staff?.activeStaffId) {
      setEquippedStaff({
        ...data.staff,
        name: data.staff.name || 'Issued Staff',
        id: data.staff.activeStaffId
      });
    }
    if (data.stats) setStats(prev => ({ ...prev, ...data.stats }));
    if (data.lastHarvestDate) setLastHarvestDate(data.lastHarvestDate);
    if (data.unlockedNodes) setUnlockedNodes(data.unlockedNodes);
    if (data.unlockedAssets) setUnlockedAssets(data.unlockedAssets);
    if (data.currentLocation) setCurrentLocation(data.currentLocation);
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
  const docRef = doc(db, "players", userId);
  await setDoc(
    docRef,
    {
      inventory,
      equippedStaff,
      stats,
      lastHarvestDate,
      unlockedNodes,
      unlockedAssets,
      currentLocation,
      staff: playerProfile.staff,
      daily: playerProfile.daily,
      lastLoginAt: serverTimestamp(),
    },
    { merge: true }
  );
} catch (error) {
          console.error("Cloud Save Error:", error);
        }
      }
    };

    const timeout = setTimeout(save, 2000);
    return () => clearTimeout(timeout);
  }, [inventory, equippedStaff, stats, lastHarvestDate, unlockedNodes, unlockedAssets, currentLocation, userId, isGuest, loadingData, playerProfile.daily, playerProfile.staff]);

  // --- 3. ACTIONS ---

  const addInventoryItem = useCallback((item) => {
    const stamped = {
      ...item,
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: item.updatedAt || new Date().toISOString()
    };
    setInventory((prev) => [...prev, stamped]);
    return stamped;
  }, []);

  const upsertCreatureBond = useCallback(async (creature) => {
    const stamped = {
      ...creature,
      createdAt: creature.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCreatures((prev) => {
      const existing = prev.find((c) => c.creatureId === stamped.creatureId);
      if (existing) {
        return prev.map((c) => (c.creatureId === stamped.creatureId ? { ...c, ...stamped } : c));
      }
      return [...prev, stamped];
    });

    if (!isGuest && userId) {
      const ref = doc(db, 'players', userId, 'creatures', stamped.creatureId || stamped.id || Date.now().toString());
      await setDoc(ref, stamped, { merge: true }).catch((e) => console.warn('Creature sync failed', e));
    }
    return stamped;
  }, [isGuest, userId]);

  const removeCreatureBond = useCallback(async (creatureId) => {
    setCreatures((prev) => prev.filter((c) => c.creatureId !== creatureId && c.id !== creatureId));
    if (!isGuest && userId) {
      const ref = doc(db, 'players', userId, 'creatures', creatureId);
      await deleteDoc(ref).catch((e) => console.warn('Creature delete failed', e));
    }
  }, [isGuest, userId]);

  const logEvent = useCallback(async (event) => {
    const stamped = {
      ...event,
      at: event.at || new Date().toISOString(),
      createdAt: event.createdAt || serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    setEvents((prev) => [...prev.slice(-99), stamped]); // keep recent 100
    if (!isGuest && userId) {
      try {
        await addDoc(collection(db, 'players', userId, 'events'), stamped);
      } catch (e) {
        console.warn('Event log failed', e);
      }
    }
    return stamped;
  }, [isGuest, userId]);

  const logDailyClaim = useCallback(async (dateKey, payload) => {
    if (!dateKey) return;
    const stamped = {
      ...payload,
      date: dateKey,
      claimedAt: payload?.claimedAt || serverTimestamp(),
    };
    if (!isGuest && userId) {
      const ref = doc(db, 'players', userId, 'daily', dateKey);
      await setDoc(ref, stamped, { merge: true }).catch((e) =>
        console.warn('Daily log failed', e)
      );
    } else if (typeof window !== 'undefined') {
      const key = `tethys_daily_${dateKey}`;
      localStorage.setItem(key, JSON.stringify(stamped));
    }
    return stamped;
  }, [isGuest, userId]);

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

  const loadStarterTemplate = useCallback(
    async (templateId = DEFAULT_STARTER_TEMPLATE.templateId) => {
      try {
        const ref = doc(db, 'templates', 'starterLoadouts', templateId);
        const snap = await getDoc(ref);
        if (snap.exists()) return { templateId, ...snap.data() };
      } catch (e) {
        console.warn('Starter template lookup failed, using default', e);
      }
      return DEFAULT_STARTER_TEMPLATE;
    },
    []
  );

  const hatchFromTemplate = useCallback(
    async (templateId = DEFAULT_STARTER_TEMPLATE.templateId, overrides = {}) => {
      const template = await loadStarterTemplate(templateId);
      const nowIso = new Date().toISOString();
      const pathPrimary = overrides.path || playerProfile.path.primary || 'mystic';
      const baseStats = template.rules?.baseStaffStats || DEFAULT_STARTER_TEMPLATE.rules.baseStaffStats;
      const staffSeed =
        overrides.staffSeed ||
        template.rules?.staffSeed ||
        `KITH-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

      const starterItems = (template.rules?.giveItems || []).map((id, idx) => ({
        id,
        name: id.replace(/_/g, ' '),
        type: 'starter',
        rarity: 'common',
        qty: 1,
        source: { kind: 'starter', refId: template.templateId, at: nowIso },
        createdAt: nowIso,
        updatedAt: nowIso,
        icon: '🧭',
        effect: 'Provision'
      }));

      const staffDoc = {
        ...playerProfile.staff,
        activeStaffId: staffSeed,
        name: overrides.staffName || `${template.name || 'Starter'} Staff`,
        desc: overrides.staffDesc || 'An issued staff aligned to your path.',
        power: overrides.power || 10,
        stats: { ...playerProfile.staff.stats, ...baseStats },
        path: overrides.staffPath || playerProfile.staff.path || 'pteros',
        seed: staffSeed,
        updatedAt: nowIso
      };

      const updatedProfile = {
        ...playerProfile,
        onboarding: { ...playerProfile.onboarding, status: 'complete', hatchedAt: nowIso, starterLoadoutId: template.templateId },
        path: { ...playerProfile.path, primary: pathPrimary, declaredAt: playerProfile.path.declaredAt || nowIso },
        staff: staffDoc,
        survivorship: {
          ...playerProfile.survivorship,
          lastFound: { label: 'Starter Cache', regionId: 'pteros_island', at: nowIso }
        }
      };

      setInventory(starterItems);
      setEquippedStaff(staffDoc);
      setPlayerProfile(updatedProfile);

      if (template.rules?.defaultCreatureArchetype && template.rules.defaultCreatureArchetype !== 'none') {
        await upsertCreatureBond({
          creatureId: `starter_${template.rules.defaultCreatureArchetype}`,
          archetype: template.rules.defaultCreatureArchetype,
          givenName: template.rules.defaultCreatureArchetype,
          temperament: { brave: 2, wary: 2, loyal: 2 },
          bondLevel: 1,
          bondXp: 0,
          growth: { stage: 'hatchling', lastFedAt: null, lastTrainedAt: null },
          adornments: [],
          vr: { prefabKey: `creature.${template.rules.defaultCreatureArchetype}.01`, scale: 1.0 },
          createdAt: nowIso
        });
      }

      await logEvent({
        type: 'HATCH',
        regionId: 'pteros_island',
        at: nowIso,
        delta: { staffStats: baseStats, inventoryAdded: starterItems.map((i) => i.id) },
        vr: { atlas: { x: 0.5, y: 0.6, heading: 1.0 }, world: { x: 0, y: 0, z: 0, yaw: 1.0 } }
      });

      if (!isGuest && userId) {
        try {
          await setDoc(doc(db, 'players', userId), updatedProfile, { merge: true });
        } catch (e) {
          console.warn('Hatch sync failed', e);
        }
      }

      return { template, staff: staffDoc, items: starterItems, profile: updatedProfile };
    },
    [isGuest, loadStarterTemplate, logEvent, playerProfile, upsertCreatureBond, userId]
  );

  const claimDailyReward = useCallback(
    async (opts = {}) => {
      if (!canHarvest) return { success: false, reason: 'cooldown' };
      const now = new Date();
      const dateKey = opts.dateKey || now.toISOString().slice(0, 10);
      const staffBefore = { ...(playerProfile.staff?.stats || {}) };
      const staffAfter = { ...staffBefore, lore: (staffBefore.lore || 0) + 1 };
      const itemsGranted = opts.itemsGranted || [];

      setPlayerProfile((prev) => ({
        ...prev,
        staff: { ...prev.staff, stats: staffAfter },
        daily: { ...prev.daily, lastClaimAt: now.toISOString(), streak: (prev.daily?.streak || 0) + 1 }
      }));

      setLastHarvestDate(now.toISOString());
      setCanHarvest(false);

      await logDailyClaim(dateKey, {
        date: dateKey,
        claimedAt: now.toISOString(),
        staffBefore,
        staffAfter,
        itemsGranted,
        whisperIds: opts.whisperIds || []
      });

      await logEvent({
        type: 'DAILY_CLAIM',
        regionId: opts.regionId || 'pteros_island',
        at: now.toISOString(),
        delta: { staffStats: { lore: +1 }, inventoryAdded: itemsGranted },
        vr: opts.vr || { atlas: { x: 0.5, y: 0.5, heading: 0 }, world: { x: 0, y: 0, z: 0, yaw: 0 } }
      });

      return { success: true, dateKey, staffAfter, itemsGranted };
    },
    [canHarvest, logDailyClaim, logEvent, playerProfile.staff?.stats]
  );

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
    performDailyHarvest, purchaseAsset, travelTo, playerProfile, setPlayerProfile,
    addInventoryItem, creatures, upsertCreatureBond, removeCreatureBond, events, logEvent, logDailyClaim,
    loadStarterTemplate, hatchFromTemplate, claimDailyReward, hasOnboarded
  };

  return <TethysContext.Provider value={value}>{children}</TethysContext.Provider>;
}

export function useTethys() { return useContext(TethysContext); }
// World of Tethys || D.C. Barletta
