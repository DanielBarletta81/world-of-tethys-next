'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { db, hasFirebaseConfig } from '@/lib/firebase';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  runTransaction,
  increment
} from 'firebase/firestore';
import { DEFAULT_PLAYER_PROFILE } from '@/lib/player-defaults';
import { BESTIARY } from '@/data/bestiary';

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

const IMPRINT_DECAY_STEPS = 4;
const ACCESS_LOCK_STEPS = 2;
const STAFF_RELIABILITY_MIN = 0.2;
const STAFF_RELIABILITY_MAX = 1;
const HAZARD_LOCATIONS = [
  'the_ledge',
  'watcher_volcano',
  'watcher_flats',
  'purgess',
  'cambria_ruins',
  'iron-sands'
];
const ASH_LOCATIONS = ['watcher_volcano', 'watcher_flats', 'purgess', 'cambria_ruins'];
const BOND_CHECK_MS = 1000 * 60 * 60 * 24;
const BOND_BASE_CHANCE = 0.12;
const BOND_MIN_MOVES = 2;
const BOND_COOLDOWN_MIN_DAYS = 3;
const BOND_COOLDOWN_MAX_DAYS = 7;
const BOND_FORBIDDEN_LOCATIONS = new Set([
  'sky-city',
  'sky_city',
  'cambria',
  'cambria_ruins',
  'pteros',
  'pteros_island'
]);
const FLAT_BESTIARY = BESTIARY.flatMap((era) =>
  (era.entries || []).map((entry) => ({
    ...entry,
    era: era.era || 'wild'
  }))
);

function toSlug(value = '') {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
}

function pickBondCreature() {
  if (!FLAT_BESTIARY.length) return null;
  return FLAT_BESTIARY[Math.floor(Math.random() * FLAT_BESTIARY.length)];
}

export function TethysProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.uid || 'guest_node';
  const isGuest = !user;

  // --- STATE ---
  const [currentLocation, setCurrentLocation] = useState('pteros');
  const [locationHistory, setLocationHistory] = useState([]);
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
  const [eventCount, setEventCount] = useState(0);
  const [rumorCount, setRumorCount] = useState(0);
  const guestSnapshotTimerRef = useRef(null);
 
  const hasOnboarded = Boolean(equippedStaff || playerProfile?.onboarding?.status === 'complete');

  // --- 1. LOAD DATA ---
  useEffect(() => {
    async function loadData() {
      setLoadingData(true);
      const loadGuestFallback = () => {
        if (typeof window === 'undefined') return;
        const saved = localStorage.getItem(`tethys_data_guest`);
        if (saved) {
          try {
            applyData(JSON.parse(saved));
          } catch (error) {
            console.warn('Guest cache parse failed:', error);
          }
        }
      };
      const persistGuestSnapshot = (data) => {
        if (typeof window === 'undefined' || !data) return;
        try {
          localStorage.setItem(`tethys_data_guest`, JSON.stringify(data));
        } catch (error) {
          console.warn('Guest cache write failed:', error);
        }
      };

      if (!hasFirebaseConfig || !db) {
        loadGuestFallback();
        setLoadingData(false);
        return;
      }
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        loadGuestFallback();
        setLoadingData(false);
        return;
      }
      if (!isGuest && !userId) {
        loadGuestFallback();
        setLoadingData(false);
        return;
      }

      if (isGuest) {
        loadGuestFallback();
      } else {
        try {
          const docRef = doc(db, "players", userId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            applyData(data);
            persistGuestSnapshot(data);
            setPlayerProfile(prev => ({ ...DEFAULT_PLAYER_PROFILE, ...data }));
            try {
              const creatureSnap = await getDocs(collection(db, "players", userId, "creatures"));
              const cList = [];
              creatureSnap.forEach((c) => cList.push({ id: c.id, ...c.data() }));
              setCreatures(cList);
            } catch (error) {
              console.warn('Creature sync failed:', error);
            }
            try {
              const eventSnap = await getDocs(collection(db, "players", userId, "events"));
              const eList = [];
              eventSnap.forEach((ev) => eList.push({ id: ev.id, ...ev.data() }));
              setEvents(eList);
              if (data?.eventCount == null) {
                setEventCount(eventSnap.size);
              }
            } catch (error) {
              console.warn('Event sync failed:', error);
            }
          } else {
            const initialData = {
              stats: DEFAULT_STATS,
              inventory: [],
              unlockedNodes: ['pteros'],
              unlockedAssets: [],
              currentLocation: 'pteros',
              lastHarvestDate: null,
              eventCount: 0,
              rumorCount: 0,
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
            persistGuestSnapshot(initialData);
            setPlayerProfile(initialData);
            setCreatures([]);
            setEvents([]);
          }
        } catch (error) {
          console.warn("Cloud Sync Error:", error);
          loadGuestFallback();
        }
      }
      setLoadingData(false);
    }
    loadData();
  }, [userId, isGuest, user?.displayName]);

  const buildGuestSnapshot = useCallback(
    () => ({
      stats,
      inventory,
      unlockedNodes,
      unlockedAssets,
      currentLocation,
      lastHarvestDate,
      eventCount,
      rumorCount,
      equippedStaff,
      staff: playerProfile?.staff,
      locationHistory,
      creatures,
      events,
      playerProfile
    }),
    [
      stats,
      inventory,
      unlockedNodes,
      unlockedAssets,
      currentLocation,
      lastHarvestDate,
      eventCount,
      rumorCount,
      equippedStaff,
      locationHistory,
      creatures,
      events,
      playerProfile
    ]
  );

  useEffect(() => {
    if (loadingData || typeof window === 'undefined') return;
    if (!isGuest && userId) return;
    if (guestSnapshotTimerRef.current) {
      clearTimeout(guestSnapshotTimerRef.current);
    }
    const snapshot = buildGuestSnapshot();
    guestSnapshotTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(`tethys_data_guest`, JSON.stringify(snapshot));
      } catch (error) {
        console.warn('Guest cache write failed:', error);
      }
    }, 1200);
    return () => {
      if (guestSnapshotTimerRef.current) {
        clearTimeout(guestSnapshotTimerRef.current);
      }
    };
  }, [buildGuestSnapshot, isGuest, loadingData, userId]);

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
    if (data.playerProfile) {
      setPlayerProfile((prev) => ({ ...DEFAULT_PLAYER_PROFILE, ...data.playerProfile }));
    }
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
    if (data.locationHistory) {
      setLocationHistory(data.locationHistory);
    } else if (data.currentLocation) {
      setLocationHistory([data.currentLocation]);
    }
    if (data.eventCount != null) setEventCount(data.eventCount);
    if (data.rumorCount != null) setRumorCount(data.rumorCount);
  };

  const updateImprintList = (list, value) => {
    const next = Array.isArray(list) ? [...list] : [];
    const filtered = next.filter((item) => item !== value);
    filtered.push(value);
    return filtered.slice(-5);
  };

  const recordImprint = useCallback((type, value) => {
    if (!type || !value) return;
    setPlayerProfile((prev) => {
      const current = prev?.survivorship?.imprints || { bruises: [], tracks: [] };
      if (type === 'track') {
        return {
          ...prev,
          survivorship: {
            ...prev.survivorship,
            imprints: {
              ...current,
              tracks: updateImprintList(current.tracks, value)
            }
          }
        };
      }
      if (type === 'bruise') {
        return {
          ...prev,
          survivorship: {
            ...prev.survivorship,
            imprints: {
              ...current,
              bruises: updateImprintList(current.bruises, value)
            }
          }
        };
      }
      return prev;
    });
  }, []);

  const adjustStaffReliability = useCallback((delta) => {
    setPlayerProfile((prev) => {
      const staff = prev?.staff || {};
      const stats = staff.stats || {};
      const current = stats.reliability ?? STAFF_RELIABILITY_MAX;
      const next = Math.max(
        STAFF_RELIABILITY_MIN,
        Math.min(STAFF_RELIABILITY_MAX, current + delta)
      );
      return {
        ...prev,
        staff: {
          ...staff,
          stats: {
            ...stats,
            reliability: next
          }
        }
      };
    });
    setEquippedStaff((prev) => {
      if (!prev) return prev;
      const stats = prev.stats || {};
      const current = stats.reliability ?? STAFF_RELIABILITY_MAX;
      const next = Math.max(
        STAFF_RELIABILITY_MIN,
        Math.min(STAFF_RELIABILITY_MAX, current + delta)
      );
      return {
        ...prev,
        stats: {
          ...stats,
          reliability: next
        }
      };
    });
  }, []);

  const tickAccessLocks = useCallback(() => {
    setPlayerProfile((prev) => {
      const path = prev?.path || {};
      const accessLocks = path.accessLocks || {};
      const nextLocks = {};
      Object.entries(accessLocks).forEach(([key, value]) => {
        const remaining = Math.max(0, (value?.remaining || 0) - 1);
        if (remaining > 0) {
          nextLocks[key] = { ...value, remaining };
        }
      });
      return {
        ...prev,
        path: {
          ...path,
          accessLocks: nextLocks
        }
      };
    });
  }, []);

  const lockAccess = useCallback((locationId, steps = ACCESS_LOCK_STEPS) => {
    if (!locationId) return;
    setPlayerProfile((prev) => {
      const path = prev?.path || {};
      const accessLocks = path.accessLocks || {};
      return {
        ...prev,
        path: {
          ...path,
          accessLocks: {
            ...accessLocks,
            [locationId]: {
              remaining: steps,
              lockedAt: new Date().toISOString()
            }
          }
        }
      };
    });
  }, []);

  const isAccessLocked = useCallback(
    (locationId) => {
      const locks = playerProfile?.path?.accessLocks || {};
      return (locks[locationId]?.remaining || 0) > 0;
    },
    [playerProfile?.path?.accessLocks]
  );

  const maybeGrantStaffOrnament = useCallback(
    (nextMoveCount) => {
      setPlayerProfile((prev) => {
        const staff = prev?.staff || {};
        const ornaments = Array.isArray(staff.ornaments) ? [...staff.ornaments] : [];
        const has = new Set(ornaments.map((o) => o.id));
        const nowIso = new Date().toISOString();
        const additions = [];

        if (nextMoveCount >= 5 && !has.has('ornament_wayfinder_thread')) {
          additions.push({ id: 'ornament_wayfinder_thread', label: 'Wayfinder Thread', at: nowIso });
        }
        if (eventCount >= 10 && !has.has('ornament_archive_ring')) {
          additions.push({ id: 'ornament_archive_ring', label: 'Archive Ring', at: nowIso });
        }
        if (nextMoveCount >= 12 && !has.has('ornament_embershard')) {
          additions.push({ id: 'ornament_embershard', label: 'Embershard', at: nowIso });
        }

        if (!additions.length) return prev;

        const nextOrnaments = [...ornaments, ...additions];
        return {
          ...prev,
          staff: {
            ...staff,
            ornaments: nextOrnaments
          }
        };
      });
      setEquippedStaff((prev) => {
        if (!prev) return prev;
        const ornaments = Array.isArray(prev.ornaments) ? [...prev.ornaments] : [];
        const has = new Set(ornaments.map((o) => o.id));
        const nowIso = new Date().toISOString();
        const additions = [];
        if (nextMoveCount >= 5 && !has.has('ornament_wayfinder_thread')) {
          additions.push({ id: 'ornament_wayfinder_thread', label: 'Wayfinder Thread', at: nowIso });
        }
        if (eventCount >= 10 && !has.has('ornament_archive_ring')) {
          additions.push({ id: 'ornament_archive_ring', label: 'Archive Ring', at: nowIso });
        }
        if (nextMoveCount >= 12 && !has.has('ornament_embershard')) {
          additions.push({ id: 'ornament_embershard', label: 'Embershard', at: nowIso });
        }
        if (!additions.length) return prev;
        return {
          ...prev,
          ornaments: [...ornaments, ...additions]
        };
      });
    },
    [eventCount]
  );

  const maybeGrantStaffVariant = useCallback((locationId, nextMoveCount) => {
    if (!locationId || nextMoveCount < 3) return;
    setPlayerProfile((prev) => {
      const staff = prev?.staff || {};
      const variants = Array.isArray(staff.variants) ? [...staff.variants] : [];
      if (variants.find((v) => v.regionId === locationId)) return prev;
      const nowIso = new Date().toISOString();
      return {
        ...prev,
        staff: {
          ...staff,
          variants: [...variants, { id: `variant_${locationId}`, regionId: locationId, at: nowIso }]
        }
      };
    });
    setEquippedStaff((prev) => {
      if (!prev) return prev;
      const variants = Array.isArray(prev.variants) ? [...prev.variants] : [];
      if (variants.find((v) => v.regionId === locationId)) return prev;
      const nowIso = new Date().toISOString();
      return {
        ...prev,
        variants: [...variants, { id: `variant_${locationId}`, regionId: locationId, at: nowIso }]
      };
    });
  }, []);

  const maybeSpawnBondEncounter = useCallback(
    (locationId) => {
      if (!hasOnboarded || !locationId) return;
      setPlayerProfile((prev) => {
        const encounter = prev.survivorship?.bondEncounter || {};
        const now = Date.now();
        if (encounter.state === 'active') return prev;
        if (encounter.cooldownUntil && now < encounter.cooldownUntil) return prev;
        if (encounter.lastCheckAt && now - encounter.lastCheckAt < BOND_CHECK_MS) return prev;
        if (BOND_FORBIDDEN_LOCATIONS.has(locationId)) {
          return {
            ...prev,
            survivorship: {
              ...prev.survivorship,
              bondEncounter: { ...encounter, lastCheckAt: now }
            }
          };
        }
        const moveCount = prev.survivorship?.moveCount || 0;
        if (moveCount < BOND_MIN_MOVES || (unlockedNodes?.length || 0) < 2) {
          return {
            ...prev,
            survivorship: {
              ...prev.survivorship,
              bondEncounter: { ...encounter, lastCheckAt: now }
            }
          };
        }
        let chance = BOND_BASE_CHANCE;
        const stillness = prev.perception?.stillness || 0;
        if (stillness >= 0.7) chance += 0.03;
        if (HAZARD_LOCATIONS.includes(locationId)) chance += 0.05;
        if ((eventCount || 0) >= 5) chance += 0.02;
        if (Math.random() > chance) {
          return {
            ...prev,
            survivorship: {
              ...prev.survivorship,
              bondEncounter: { ...encounter, lastCheckAt: now }
            }
          };
        }
        return {
          ...prev,
          survivorship: {
            ...prev.survivorship,
            bondEncounter: {
              ...encounter,
              state: 'active',
              regionId: locationId,
              seed: toSlug(`${locationId}_${now}`),
              spawnedAt: now,
              lastCheckAt: now
            }
          }
        };
      });
    },
    [eventCount, hasOnboarded, unlockedNodes]
  );

  const decayImprintsOnTravel = useCallback(() => {
    setPlayerProfile((prev) => {
      const survivorship = prev?.survivorship || {};
      const imprints = survivorship.imprints || { bruises: [], tracks: [] };
      const moveCount = (survivorship.moveCount || 0) + 1;
      let nextBruises = imprints.bruises || [];
      let nextTracks = imprints.tracks || [];
      if (moveCount % IMPRINT_DECAY_STEPS === 0) {
        nextBruises = nextBruises.slice(1);
        nextTracks = nextTracks.slice(1);
      }
      return {
        ...prev,
        survivorship: {
          ...survivorship,
          moveCount,
          imprints: {
            ...imprints,
            bruises: nextBruises,
            tracks: nextTracks
          }
        }
      };
    });
  }, []);

  const buildLoadoutItems = useCallback((itemIds = [], source = {}) => {
    const nowIso = new Date().toISOString();
    return itemIds.map((id) => ({
      id,
      name: id
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase()),
      type: 'starter',
      rarity: 'common',
      qty: 1,
      source: { kind: 'path', refId: source.pathId, at: nowIso },
      createdAt: nowIso,
      updatedAt: nowIso,
      icon: '🧭',
      effect: 'Provision'
    }));
  }, []);

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
      currentLocation,
      locationHistory,
      eventCount,
      rumorCount,
      history: playerProfile?.history,
      progression: playerProfile?.progression,
      path: playerProfile?.path,
      onboarding: playerProfile?.onboarding,
      survivorship: playerProfile?.survivorship
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
          locationHistory,
          staff: playerProfile.staff,
          history: playerProfile?.history,
          progression: playerProfile?.progression,
          path: playerProfile?.path,
          onboarding: playerProfile?.onboarding,
          survivorship: playerProfile?.survivorship,
          daily: playerProfile.daily,
          eventCount,
      rumorCount,
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
  }, [
    inventory,
    equippedStaff,
    stats,
    lastHarvestDate,
    unlockedNodes,
    unlockedAssets,
    currentLocation,
    locationHistory,
    userId,
    isGuest,
    loadingData,
    playerProfile.daily,
    playerProfile.staff,
    playerProfile.history,
    playerProfile.progression,
    playerProfile.path,
    playerProfile.onboarding,
    playerProfile.survivorship,
    eventCount,
    rumorCount
  ]);

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
        await runTransaction(db, async (tx) => {
          const eventRef = doc(collection(db, 'players', userId, 'events'));
          const playerRef = doc(db, 'players', userId);
          tx.set(eventRef, stamped);
          tx.set(playerRef, { eventCount: increment(1) }, { merge: true });
        });
        setEventCount((prev) => prev + 1);
      } catch (e) {
        console.warn('Event log failed', e);
      }
    } else {
      setEventCount((prev) => prev + 1);
    }
    return stamped;
  }, [isGuest, userId]);

  const consumeMedia = useCallback(
    async (mediaId, type = 'video', rewardStats = {}) => {
      if (!mediaId) return { success: false, message: 'Missing media id.' };
      const history = playerProfile?.history?.mediaConsumed || [];
      if (history.includes(mediaId)) {
        return { success: false, message: 'Memory already integrated.' };
      }
      const staff = playerProfile?.staff || {};
      const stats = staff.stats || {};
      const nextStats = { ...stats };
      Object.entries(rewardStats || {}).forEach(([key, value]) => {
        const numeric = Number(value) || 0;
        nextStats[key] = (nextStats[key] || 0) + numeric;
      });

      const updatedProfile = {
        ...playerProfile,
        staff: {
          ...staff,
          stats: nextStats,
          updatedAt: new Date().toISOString()
        },
        history: {
          ...playerProfile?.history,
          mediaConsumed: [...history, mediaId]
        }
      };

      setPlayerProfile(updatedProfile);
      if (equippedStaff?.id) {
        setEquippedStaff((prev) =>
          prev
            ? {
                ...prev,
                stats: nextStats,
                updatedAt: new Date().toISOString()
              }
            : prev
        );
      }

      await logEvent({
        type: 'MEDIA_CONSUMED',
        mediaId,
        mediaType: type,
        delta: { stats: rewardStats },
        at: new Date().toISOString()
      });

      return { success: true, message: 'Knowledge integrated.', stats: nextStats };
    },
    [equippedStaff?.id, logEvent, playerProfile]
  );

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

  const resolveBondCooldownUntil = useCallback(() => {
    const days =
      BOND_COOLDOWN_MIN_DAYS +
      Math.floor(Math.random() * (BOND_COOLDOWN_MAX_DAYS - BOND_COOLDOWN_MIN_DAYS + 1));
    return Date.now() + days * 24 * 60 * 60 * 1000;
  }, []);

  const attemptBondEncounter = useCallback(async () => {
    const encounter = playerProfile?.survivorship?.bondEncounter;
    if (!encounter || encounter.state !== 'active') {
      return { ok: false, reason: 'inactive' };
    }
    const reliability = playerProfile?.staff?.stats?.reliability ?? 0.6;
    const chance = Math.min(0.8, 0.25 + reliability * 0.35);
    const success = Math.random() <= chance;
    const nowIso = new Date().toISOString();
    const cooldownUntil = resolveBondCooldownUntil();

    let creature = null;
    if (success) {
      const pick = pickBondCreature();
      if (pick) {
        const creatureId = `bond_${toSlug(pick.name)}`;
        creature = await upsertCreatureBond({
          creatureId,
          archetype: pick.tag || pick.era || 'wild',
          givenName: pick.name,
          temperament: { brave: 2, wary: 2, loyal: 2 },
          bondLevel: 1,
          bondXp: 0,
          growth: { stage: 'wild', lastFedAt: null, lastTrainedAt: null },
          adornments: [],
          notes: pick.niche || '',
          createdAt: nowIso
        });
      }
    }

    setPlayerProfile((prev) => ({
      ...prev,
      survivorship: {
        ...prev.survivorship,
        bond: success
          ? {
              focusType: 'creature',
              strength: 1,
              lastBondAt: nowIso,
              notes: creature?.givenName || 'Bond stirred'
            }
          : prev.survivorship?.bond,
        bondEncounter: {
          ...prev.survivorship?.bondEncounter,
          state: 'cooldown',
          regionId: null,
          lastOutcome: success ? 'bonded' : 'withdrew',
          lastResolvedAt: nowIso,
          cooldownUntil
        }
      }
    }));

    await logEvent({
      type: success ? 'BOND_FORMED' : 'BOND_WITHDREW',
      regionId: encounter.regionId || currentLocation,
      at: nowIso
    });

    return { ok: true, success, creature };
  }, [currentLocation, logEvent, playerProfile, resolveBondCooldownUntil, upsertCreatureBond]);

  const withdrawBondEncounter = useCallback(async () => {
    const encounter = playerProfile?.survivorship?.bondEncounter;
    if (!encounter || encounter.state !== 'active') {
      return { ok: false, reason: 'inactive' };
    }
    const nowIso = new Date().toISOString();
    const cooldownUntil = resolveBondCooldownUntil();
    setPlayerProfile((prev) => ({
      ...prev,
      survivorship: {
        ...prev.survivorship,
        bondEncounter: {
          ...prev.survivorship?.bondEncounter,
          state: 'cooldown',
          regionId: null,
          lastOutcome: 'withdrawn',
          lastResolvedAt: nowIso,
          cooldownUntil
        }
      }
    }));
    await logEvent({
      type: 'BOND_WITHDRAWN',
      regionId: encounter.regionId || currentLocation,
      at: nowIso
    });
    return { ok: true, success: false };
  }, [currentLocation, logEvent, playerProfile, resolveBondCooldownUntil]);

  const logRumorEntry = useCallback(async (entry) => {
    const stamped = {
      ...entry,
      at: entry.at || new Date().toISOString(),
      createdAt: entry.createdAt || serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    if (!isGuest && userId) {
      try {
        await runTransaction(db, async (tx) => {
          const rumorRef = doc(collection(db, 'players', userId, 'rumorLog'));
          const playerRef = doc(db, 'players', userId);
          tx.set(rumorRef, stamped);
          tx.set(playerRef, { rumorCount: increment(1) }, { merge: true });
        });
        setRumorCount((prev) => prev + 1);
      } catch (e) {
        console.warn('Rumor log failed', e);
      }
    } else {
      setRumorCount((prev) => prev + 1);
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

      const rawItemIds = overrides.items || template.rules?.giveItems || [];
      const starterItems = buildLoadoutItems(rawItemIds, { pathId: pathPrimary });

      const staffDoc = {
        ...playerProfile.staff,
        activeStaffId: staffSeed,
        name: overrides.staffName || `${template.name || 'Starter'} Staff`,
        desc: overrides.staffDesc || 'An issued staff aligned to your path.',
        power: overrides.power || 10,
        stats: {
          ...playerProfile.staff.stats,
          ...baseStats,
          reliability: playerProfile.staff.stats?.reliability ?? STAFF_RELIABILITY_MAX
        },
        path: overrides.staffPath || playerProfile.staff.path || 'pteros',
        seed: staffSeed,
        updatedAt: nowIso
      };

      const updatedProfile = {
        ...playerProfile,
        onboarding: {
          ...playerProfile.onboarding,
          status: 'complete',
          hatchedAt: nowIso,
          starterLoadoutId: template.templateId
        },
        path: {
          ...playerProfile.path,
          primary: pathPrimary,
          declaredAt: playerProfile.path.declaredAt || nowIso,
          mapAccess: overrides.mapAccess ?? playerProfile.path.mapAccess,
          history: [...(playerProfile.path.history || []), { id: pathPrimary, at: nowIso }]
        },
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
    [buildLoadoutItems, isGuest, loadStarterTemplate, logEvent, playerProfile, upsertCreatureBond, userId]
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
    if (!locationId) return { blocked: true, reason: 'invalid' };
    if (isAccessLocked(locationId)) {
      return { blocked: true, reason: 'locked' };
    }
    setCurrentLocation(locationId);
    setLocationHistory((prev) => {
      const next = prev.filter((loc) => loc !== locationId);
      next.push(locationId);
      return next.slice(-5);
    });
    decayImprintsOnTravel();
    recordImprint('track', locationId);
    if (HAZARD_LOCATIONS.includes(locationId)) {
      recordImprint('bruise', locationId);
      adjustStaffReliability(-0.08);
    }
    if (ASH_LOCATIONS.includes(locationId)) {
      recordImprint('bruise', 'ash');
    }
    if (!HAZARD_LOCATIONS.includes(locationId)) {
      adjustStaffReliability(0.02);
    }
    tickAccessLocks();
    const nextMoveCount = (playerProfile?.survivorship?.moveCount || 0) + 1;
    maybeGrantStaffOrnament(nextMoveCount);
    maybeGrantStaffVariant(locationId, nextMoveCount);
    if (HAZARD_LOCATIONS.includes(locationId) && !unlockedNodes.includes(locationId)) {
      lockAccess(locationId, ACCESS_LOCK_STEPS);
    }
    maybeSpawnBondEncounter(locationId);
    if (!unlockedNodes.includes(locationId)) {
      setUnlockedNodes(prev => [...prev, locationId]);
    }
    return { blocked: false };
  };

  const awardWatchBonus = useCallback(
    (thresholdSeconds) => {
      const reward = thresholdSeconds >= 60 ? 20 : thresholdSeconds >= 30 ? 12 : 5;
      setStats((prev) => ({ ...prev, resin: (prev.resin || 0) + reward }));
      logEvent({
        type: 'WATCH_BONUS',
        threshold: thresholdSeconds,
        reward,
        at: new Date().toISOString(),
      });
      return reward;
    },
    [logEvent]
  );

  const value = {
    userId,
    isGuest,
    loadingData,
    currentLocation,
    locationHistory,
    inventory,
    equippedStaff,
    stats,
    unlockedNodes,
    unlockedAssets,
    canHarvest,
    performDailyHarvest,
    purchaseAsset,
    travelTo,
    isAccessLocked,
    lockAccess,
    playerProfile,
    bondEncounter: playerProfile?.survivorship?.bondEncounter,
    attemptBondEncounter,
    withdrawBondEncounter,
    consumeMedia,
    setPlayerProfile,
    setEquippedStaff,
    addInventoryItem,
    creatures,
    upsertCreatureBond,
    removeCreatureBond,
    events,
    logEvent,
    logRumorEntry,
    logDailyClaim,
    loadStarterTemplate,
    hatchFromTemplate,
    claimDailyReward,
    hasOnboarded,
    awardWatchBonus
  };

  return <TethysContext.Provider value={value}>{children}</TethysContext.Provider>;
}

export function useTethys() { return useContext(TethysContext); }
// World of Tethys || D.C. Barletta
