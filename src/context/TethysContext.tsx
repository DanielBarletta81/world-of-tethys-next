'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import {
  fetchPlayerBootstrap,
  savePlayerSnapshot,
  saveWorldState,
  logPlayerEvent,
  logPlayerRumor,
  logPlayerDaily,
  upsertPlayerCreature,
  deletePlayerCreature,
  fetchStarterTemplate
} from '@/lib/playerApi';
import { DEFAULT_PLAYER_PROFILE } from '@/lib/player-defaults';
import { applyPlayerAction as applyProgressionAction } from '@/lib/player-progression';
import { evolvePlayerDna } from '@/lib/player-dna-evolve';
import { BESTIARY } from '@/data/bestiary';

const TethysContext = createContext<any>(null);

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
  'the-ledge',
  'watcher-volcano',
  'watcher-flats',
  'purgess',
  'cambria-ruins',
  'iron-sands'
];
const ASH_LOCATIONS = ['watcher-volcano', 'watcher-flats', 'purgess', 'cambria-ruins'];
const BOND_CHECK_MS = 1000 * 60 * 60 * 24;
const BOND_BASE_CHANCE = 0.12;
const BOND_MIN_MOVES = 2;
const BOND_COOLDOWN_MIN_DAYS = 3;
const BOND_COOLDOWN_MAX_DAYS = 7;
const BOND_FORBIDDEN_LOCATIONS = new Set([
  'sky-city',
  'sky-city',
  'cambria',
  'cambria-ruins',
  'pteros',
  'pteros'
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

export function TethysProvider({ children }: { children: React.ReactNode }) {
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
  const [atmosphereTelemetry, setAtmosphereTelemetry] = useState(null);
  const [oracleLive, setOracleLive] = useState(null);
  const [lastHarvestDate, setLastHarvestDate] = useState(null);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [canHarvest, setCanHarvest] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [playerProfile, setPlayerProfile] = useState(DEFAULT_PLAYER_PROFILE);
  const [worldState, setWorldState] = useState({});
  const [creatures, setCreatures] = useState([]);
  const [events, setEvents] = useState([]);
  const [eventCount, setEventCount] = useState(0);
  const [rumorCount, setRumorCount] = useState(0);
  const guestSnapshotTimerRef = useRef(null);
  const engagementTimerRef = useRef(null);
  const dnaPulseRef = useRef(0);
  const worldStateSaveRef = useRef(null);
 
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
          const bootstrap = await fetchPlayerBootstrap();
          const data = bootstrap?.profile || {};
          applyData(data);
          persistGuestSnapshot(data);
          setPlayerProfile((prev) => ({ ...DEFAULT_PLAYER_PROFILE, ...data }));
          const cList = Array.isArray(bootstrap?.creatures) ? bootstrap.creatures : [];
          const eList = Array.isArray(bootstrap?.events) ? bootstrap.events : [];
          setCreatures(cList);
          setEvents(eList);
          if (data?.eventCount == null) {
            setEventCount(eList.length);
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
      playerProfile,
      worldState
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
      playerProfile,
      worldState
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

  const updatePlayerDna = useCallback((event = {}) => {
    setPlayerProfile((prev) => {
      const nextDna = evolvePlayerDna(prev?.dna, {
        ...event,
        pathMode: event.pathMode || prev?.path?.primary || 'wild'
      });
      return { ...prev, dna: nextDna };
    });
  }, []);

  useEffect(() => {
    if (loadingData || typeof window === 'undefined') return;
    if (engagementTimerRef.current) clearInterval(engagementTimerRef.current);
    engagementTimerRef.current = setInterval(() => {
      setPlayerProfile((prev) => {
        const nextTime = (prev?.progress?.timeOnSiteMs || 0) + 15000;
        return {
          ...prev,
          progress: {
            ...prev.progress,
            timeOnSiteMs: nextTime
          }
        };
      });

      const now = Date.now();
      if (now - dnaPulseRef.current > 120000) {
        dnaPulseRef.current = now;
        updatePlayerDna({
          action: 'site_retention',
          region: currentLocation,
          envPressure: 0.05
        });
      }
    }, 15000);
    return () => {
      if (engagementTimerRef.current) clearInterval(engagementTimerRef.current);
    };
  }, [loadingData, updatePlayerDna, currentLocation]);

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
    if (data.worldState) {
      setWorldState(data.worldState);
    } else if (data.playerProfile?.worldState) {
      setWorldState(data.playerProfile.worldState);
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
      worldState,
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
          await savePlayerSnapshot({
            inventory,
            equippedStaff,
            stats,
            lastHarvestDate,
            unlockedNodes,
            unlockedAssets,
            currentLocation,
            locationHistory,
            worldState,
            staff: playerProfile.staff,
            history: playerProfile?.history,
            progression: playerProfile?.progression,
            path: playerProfile?.path,
            onboarding: playerProfile?.onboarding,
            survivorship: playerProfile?.survivorship,
            daily: playerProfile.daily,
            eventCount,
            rumorCount
          });
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
    worldState,
    eventCount,
    rumorCount
  ]);

  // --- 2B. ORACLE LIVE POLL (weather + volcano + lore) ---
  const scanAtmosphere = useCallback(async () => {
    try {
      const res = await fetch('/api/oracle-live', { cache: 'no-store' });
      if (!res.ok) return null;
      const data = await res.json();

      const threat = Number(data?.threat_level || 1);
      let condition = 'clear';
      let visibility = 0.9;

      if (threat >= 5) {
        condition = 'storm';
        visibility = 0.3;
      } else if (threat === 4) {
        condition = 'rain';
        visibility = 0.5;
      } else if (threat === 3) {
        condition = 'fog';
        visibility = 0.6;
      }

      const nowSec = Math.floor(Date.now() / 1000);
      const nextTelemetry = {
        weather: {
          dt: nowSec,
          visibility: Math.round(visibility * 10000),
          weather: [{ main: condition, description: condition }],
          wind: { speed: threat * 2 },
          main: { temp: 22, pressure: 1013, humidity: 60 }
        },
        tethys: {
          metrics: {
            spineFlow: threat * 10,
            veilPressure: 1013,
            siltBreath: visibility * 10,
            brimVein: threat * 2
          }
        },
        condition,
        visibility,
        aiBrief: data?.atmosphere,
        whispers: data?.whispers,
        lastScanAt: new Date().toISOString()
      };

      setOracleLive(data);
      setAtmosphereTelemetry(nextTelemetry);
      return nextTelemetry;
    } catch (err) {
      console.warn('Oracle Connection Severed:', err);
      return null;
    }
  }, []);

  useEffect(() => {
    let active = true;
    let timer;

    const pollOracle = async () => {
      try {
        const next = await scanAtmosphere();
        if (active && next) {
          setAtmosphereTelemetry(next);
        }
      } finally {
        timer = setTimeout(pollOracle, 1000 * 60 * 5);
      }
    };

    pollOracle();
    return () => {
      active = false;
      if (timer) clearTimeout(timer);
    };
  }, []);

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

  const removeInventoryItem = useCallback((itemId) => {
    if (!itemId) return;
    setInventory((prev) => {
      const index = prev.findIndex((item) => item.id === itemId);
      if (index === -1) return prev;
      const next = [...prev];
      const target = next[index];
      if (target?.qty && target.qty > 1) {
        next[index] = { ...target, qty: target.qty - 1, updatedAt: new Date().toISOString() };
      } else {
        next.splice(index, 1);
      }
      return next;
    });
  }, []);

  const markNodeHarvested = useCallback((regionId, instanceId) => {
    if (!regionId && regionId !== 0) return;
    if (instanceId == null) return;
    setWorldState((prev) => {
      const existing = Array.isArray(prev?.[regionId]) ? prev[regionId] : [];
      if (existing.includes(instanceId)) return prev;
      const nextState = {
        ...prev,
        [regionId]: [...existing, instanceId]
      };
      setPlayerProfile((profile) => ({
        ...profile,
        worldState: nextState
      }));
      if (!isGuest && userId) {
        if (worldStateSaveRef.current) {
          clearTimeout(worldStateSaveRef.current);
        }
        worldStateSaveRef.current = setTimeout(() => {
          saveWorldState({ worldState: nextState }).catch((error) => {
            console.warn('World state save failed', error);
          });
        }, 1500);
      }
      return nextState;
    });
  }, [isGuest, userId]);

  const logEvent = useCallback(async (event) => {
    const nowIso = new Date().toISOString();
    const stamped = {
      ...event,
      at: event.at || nowIso,
      createdAt: event.createdAt || nowIso,
      updatedAt: nowIso,
    };
    setEvents((prev) => [...prev.slice(-99), stamped]); // keep recent 100
    if (!isGuest && userId) {
      try {
        await logPlayerEvent(stamped);
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

      updatePlayerDna({
        action: type === 'video' ? 'video_watch' : 'lore_read',
        region: currentLocation,
        envPressure: 0.05
      });

      return { success: true, message: 'Knowledge integrated.', stats: nextStats };
    },
    [equippedStaff?.id, logEvent, playerProfile, updatePlayerDna, currentLocation]
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
      await upsertPlayerCreature(stamped).catch((e) => console.warn('Creature sync failed', e));
    }
    return stamped;
  }, [isGuest, userId]);

  const removeCreatureBond = useCallback(async (creatureId) => {
    setCreatures((prev) => prev.filter((c) => c.creatureId !== creatureId && c.id !== creatureId));
    if (!isGuest && userId) {
      await deletePlayerCreature(creatureId).catch((e) => console.warn('Creature delete failed', e));
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
    const nowIso = new Date().toISOString();
    const stamped = {
      ...entry,
      at: entry.at || nowIso,
      createdAt: entry.createdAt || nowIso,
      updatedAt: nowIso,
    };
    if (!isGuest && userId) {
      try {
        await logPlayerRumor(stamped);
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
      claimedAt: payload?.claimedAt || new Date().toISOString(),
    };
    if (!isGuest && userId) {
      await logPlayerDaily(stamped).catch((e) => console.warn('Daily log failed', e));
    } else if (typeof window !== 'undefined') {
      const key = `tethys_daily_${dateKey}`;
      localStorage.setItem(key, JSON.stringify(stamped));
    }
    return stamped;
  }, [isGuest, userId]);


  const applyPlayerAction = useCallback(
    async (action = {}) => {
      let result = null;
      setPlayerProfile((prev) => {
        result = applyProgressionAction(prev, action);
        return result.profile;
      });

      if (result?.profile?.staff?.adornments?.length && equippedStaff?.id) {
        setEquippedStaff((prev) =>
          prev ? { ...prev, adornments: result.profile.staff.adornments } : prev
        );
      }

      if (result?.delta) {
        await logEvent({
          type: 'PLAYER_ACTION',
          action: action.type || action.id || 'unknown',
          repeated: result.delta.repeated,
          leveledUp: result.delta.leveledUp,
          delta: {
            xp: result.delta.xp,
            drift: result.delta.drift,
            aura: result.delta.aura,
            protection: result.delta.protection,
            adornmentsUnlocked: result.delta.adornmentsUnlocked
          },
          at: action.at || new Date().toISOString()
        });
      }

      updatePlayerDna({
        action: action.type || action.id || 'interaction',
        region: action.region || currentLocation,
        envPressure: action.envPressure ?? playerProfile?.perception?.stillness ?? 0
      });

      return result;
    },
    [equippedStaff?.id, logEvent, updatePlayerDna, currentLocation, playerProfile?.perception?.stillness]
  );

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
        const template = await fetchStarterTemplate(templateId);
        if (template) return template;
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
      const guideSigil = overrides.sigilId || template.rules?.sigilId || 'starter_sigil';
      const guideAvatar = overrides.avatarType || 'sigil';
      const guideCreatureId =
        guideAvatar === 'creature'
          ? overrides.creatureId || playerProfile.guide?.creatureId || null
          : null;
      const guideAdornments = Array.from(
        new Set([...(playerProfile.guide?.adornments || []), 'sigil_hatched'])
      );

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
          lastFound: { label: 'Starter Cache', regionId: 'pteros', at: nowIso }
        },
        guide: {
          sigilId: guideSigil,
          hatchedAt: playerProfile?.guide?.hatchedAt || nowIso,
          avatarType: guideAvatar,
          creatureId: guideCreatureId,
          swaps: playerProfile?.guide?.swaps || [],
          adornments: guideAdornments,
          level: playerProfile?.guide?.level || 1
        },
        progress: {
          ...playerProfile.progress,
          hatchActions: (playerProfile.progress?.hatchActions || 0) + 1
        },
        adornmentUnlockedAt: {
          ...(playerProfile.adornmentUnlockedAt || {}),
          sigil_hatched: playerProfile?.adornmentUnlockedAt?.sigil_hatched || nowIso
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
        regionId: 'pteros',
        at: nowIso,
        delta: {
          staffStats: baseStats,
          inventoryAdded: starterItems.map((i) => i.id)
        },
        guide: { sigilId: guideSigil, avatarType: guideAvatar, creatureId: guideCreatureId },
        vr: { atlas: { x: 0.5, y: 0.6, heading: 1.0 }, world: { x: 0, y: 0, z: 0, yaw: 1.0 } }
      });

      await logEvent({
        type: 'GUIDE_HATCH',
        regionId: 'pteros',
        at: nowIso,
        guide: { sigilId: guideSigil, avatarType: guideAvatar, creatureId: guideCreatureId }
      });

      return { template, staff: staffDoc, items: starterItems, profile: updatedProfile };
    },
    [buildLoadoutItems, loadStarterTemplate, logEvent, playerProfile, upsertCreatureBond]
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

      const nextStreak = (playerProfile.daily?.streak || 0) + 1;
      if (nextStreak >= 2) {
        updatePlayerDna({
          action: 'daily_streak',
          region: currentLocation,
          envPressure: 0.04
        });
      }

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
        regionId: opts.regionId || 'pteros',
        at: now.toISOString(),
        delta: { staffStats: { lore: +1 }, inventoryAdded: itemsGranted },
        vr: opts.vr || { atlas: { x: 0.5, y: 0.5, heading: 0 }, world: { x: 0, y: 0, z: 0, yaw: 0 } }
      });

      return { success: true, dateKey, staffAfter, itemsGranted };
    },
    [canHarvest, logDailyClaim, logEvent, playerProfile.daily?.streak, playerProfile.staff?.stats, updatePlayerDna, currentLocation]
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
    updatePlayerDna({
      action: 'travel',
      region: locationId,
      locationId,
      envPressure: playerProfile?.perception?.stillness ?? 0,
      pathMode: playerProfile?.path?.primary
    });
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

  const forgeStaff = useCallback((newStaff) => {
    if (!newStaff) return;
    setEquippedStaff(newStaff);
    setPlayerProfile((prev) => {
      const history = prev?.history || {};
      return {
        ...prev,
        history: {
          ...history,
          lastForged: newStaff.name || history.lastForged,
          techTier: (history.techTier || 0) + 1
        }
      };
    });
    if (typeof window !== 'undefined') {
      const discoveryPayload = {
        id: `forge_${newStaff.id || 'staff'}`,
        type: 'tech_unlock',
        label: `Forged: ${newStaff.name || 'Staff'}`,
        rarity: newStaff.rarity || 'common'
      };
      window.dispatchEvent(
        new CustomEvent('tethys:discovery', { detail: discoveryPayload })
      );
    }
  }, []);

  const applyStatus = useCallback((statusId, payload = {}) => {
    if (!statusId) return;
    const nowIso = new Date().toISOString();
    setPlayerProfile((prev) => {
      const statuses = Array.isArray(prev?.survivorship?.statuses) ? prev.survivorship.statuses : [];
      const existing = statuses.find((s) => s.id === statusId);
      const nextStatus = existing
        ? { ...existing, ...payload, updatedAt: nowIso }
        : { id: statusId, createdAt: nowIso, updatedAt: nowIso, ...payload };
      const nextStatuses = existing
        ? statuses.map((s) => (s.id === statusId ? nextStatus : s))
        : [...statuses, nextStatus];
      return {
        ...prev,
        survivorship: {
          ...prev.survivorship,
          statuses: nextStatuses
        }
      };
    });
  }, []);

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
    removeInventoryItem,
    atmosphereTelemetry,
    setAtmosphereTelemetry,
    scanAtmosphere,
    oracleLive,
    worldState,
    markNodeHarvested,
    creatures,
    upsertCreatureBond,
    removeCreatureBond,
    events,
    logEvent,
    logRumorEntry,
    logDailyClaim,
    applyPlayerAction,
    updatePlayerDna,
    loadStarterTemplate,
    hatchFromTemplate,
    claimDailyReward,
    hasOnboarded,
    awardWatchBonus,
    forgeStaff,
    applyStatus
  };

  return <TethysContext.Provider value={value}>{children}</TethysContext.Provider>;
}

export function useTethys() {
  const ctx = useContext(TethysContext);
  if (!ctx) {
    throw new Error('useTethys must be used within TethysProvider');
  }
  return ctx;
}
// World of Tethys || D.C. Barletta
