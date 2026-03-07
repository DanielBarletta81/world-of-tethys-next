// src/app/(archive)/map/page.jsx
'use client';

import React, { useCallback, useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useTethys } from '@/context/TethysContext';
import { useAudio } from '@/context/AudioContext';
import { useAuth } from '@/context/AuthContext';
import IdentityAirlock from '@/components/forms/IdentityAirLock';
import TethysNexus, { MAP_FRAGMENTS } from '@/components/features/map/TethysNexus';
import StaffSequencer from '@/components/features/onboarding/StaffSequencer';
import Incubator from '@/components/features/onboarding/Incubator';
import StatusBar from '@/components/features/player/StatusBar';
import RelayLog from '@/components/RelayLog';
import RavelWeatherOracle from '@/components/weather/RavelWeatherOracle';
import StaffVisualizer from '@/components/StaffVisualizer';
import StaffWorkbench from '@/components/features/forge/StaffWorkbench';
import PrimaryNav from '@/components/layout/navigation/PrimaryNav';
import BreadcrumbTrail from '@/components/layout/BreadcrumbTrail';
import cdn from '@/lib/cdn';
import Satchel from '@/components/features/player/Satchel';
import LoreRevealPanel from '@/components/features/map/LoreRevealPanel';
import SporeSatchel from '@/components/features/player/SporeSatchel';
import RavelToolkit from '@/components/content/RavelToolkit';
import { SKY_CITY_VARIABLE_AGENTS } from '@/data/skycity-variable-agents';
import { IRONWOOD_COUNTER_DOCS } from '@/data/ironwood-counter-docs';
import { selectLoreSeeds, getDefaultLoreContext } from '@/lib/lore-seed-runtime';
import { logMapInteraction } from '@/lib/playerApi';


const PATH_CONFIG = [
  {
    id: 'sky-city',
    label: 'The Triumvirate',
    src: cdn('/img/icons/sky-city.svg'),
    blurb: 'Order, record, and controlled ascent through the City lattice.',
    items: ['compass', 'surveyor_lens', 'ledger_page'],
    unlocks: ['sky-city'],
    mapAccess: true
  },
  {
    id: 'stryker',
    label: 'Stryker',
    src: cdn('/img/icons/stryker.svg'),
    blurb: 'Heat, wind, and survival across unstable margins.',
    items: ['climbing_hooks', 'ember_talisman', 'ash_wrap'],
    unlocks: ['the-weep', 'pteros'],
    mapAccess: true
  },
  {
    id: 'mystics',
    label: 'Mystics',
    src: cdn('/symbols/mystics_seal.png'),
    blurb: 'Ritual listening, hidden paths, and myth pressure.',
    items: ['kith_spore', 'fungal_lantern'],
    unlocks: ['mystic-woods'],
    mapAccess: true
  },
  {
    id: 'cambria',
    label: 'Cambria',
    src: cdn('/img/locations/A_Cambria_Symb1.png'),
    blurb: 'Archive ingress and scholastic access through the Field Station.',
    items: ['archive_key', 'cambria_tablet'],
    unlocks: ['cambria'],
    mapAccess: false,
    redirect: '/science'
  }
];

const BASE_STAFF_STATS = { geology: 4, creature: 4, lore: 4, human: 4 };
const STAFF_INVENTORY_OVERRIDE = ['Map_fragment'];

const MAP_BREADCRUMB = [
  { label: 'Home', href: '/' },
  { label: 'Atlas', href: '/map', current: true },
];

function resolvePathMode(pathId) {
  if (pathId === 'mystics' || pathId === 'mystic') return 'mystic';
  if (pathId === 'sky-city') return 'city';
  return 'wild';
}

export default function MapPage() {
  const {
    equippedStaff,
    travelTo,
    currentLocation,
    hasOnboarded,
    loadingData,
    stats,
    playerProfile,
    unlockedNodes,
    worldState,
    atmosphereTelemetry,
    oracleLive,
    bondEncounter,
    attemptBondEncounter,
    setPlayerProfile,
    setEquippedStaff,
    hatchFromTemplate,
    applyPlayerAction
  } = useTethys();
  const { user, loading: authLoading } = useAuth();
  const { playTrack } = useAudio();
  const [viewState, setViewState] = useState('loading'); // loading, egg, sigil, forge, map, scholar
  const [mapHovered, setMapHovered] = useState(false);
  const [hoveredSigil, setHoveredSigil] = useState(null);
  const hasRavelKnowledge = Boolean(
    playerProfile?.history?.metRavel || (playerProfile?.staff?.stats?.kith ?? 0) > 20
  );
  const mapCondition = (worldState?.condition || atmosphereTelemetry?.condition || '').toLowerCase();
  const mapWeatherProfile = useMemo(() => {
    const base = (() => {
      if (mapCondition === 'storm') {
        return { mistBoost: 0.24, cloudIntensity: 0.8 };
      }
      if (mapCondition === 'rain') {
        return { mistBoost: 0.18, cloudIntensity: 0.6 };
      }
      if (mapCondition === 'fog') {
        return { mistBoost: 0.22, cloudIntensity: 0.65 };
      }
      return { mistBoost: 0.08, cloudIntensity: 0.35 };
    })();

    const regionMods = {
      'the-weep': { mist: 0.16, cloud: 0.2, storm: 0.2 },
      'the-ledge': { mist: 0.12, cloud: 0.15, storm: 0.25 },
      'mystic-woods': { mist: 0.1, cloud: 0.1, storm: 0.05 },
      ironwoods: { mist: 0.06, cloud: 0.08, storm: 0.05 },
      'amber-plains': { mist: -0.04, cloud: -0.08, storm: -0.05 },
      'mt-cinder': { mist: 0.08, cloud: 0.1, storm: 0.15 },
      'sky-city': { mist: -0.06, cloud: -0.05, storm: 0.05 }
    };
    const mod = regionMods[currentLocation] || { mist: 0, cloud: 0, storm: 0 };

    const threatRaw = Number(
      oracleLive?.threat_level ?? worldState?.threat_level ?? atmosphereTelemetry?.threat_level
    );
    const threatLevel = Number.isFinite(threatRaw) ? Math.max(1, Math.min(5, threatRaw)) : null;
    const rumbleIntensity = threatLevel ? 0.1 + ((threatLevel - 1) / 4) * 0.8 : 0.12;
    const stormFrontActive = (mapCondition === 'storm') || (threatLevel ? threatLevel >= 4 : false);
    const stormFrontIntensity = Math.min(0.9, 0.35 + (threatLevel ? (threatLevel - 1) * 0.12 : 0) + mod.storm);

    return {
      mistBoost: Math.max(0, base.mistBoost + mod.mist),
      cloudIntensity: Math.max(0.15, base.cloudIntensity + mod.cloud),
      rumbleIntensity,
      stormFrontActive,
      stormFrontIntensity
    };
  }, [mapCondition, currentLocation, oracleLive?.threat_level, worldState?.threat_level, atmosphereTelemetry?.threat_level]);
  const [selectedSigil, setSelectedSigil] = useState(null);
  const [pendingSigil, setPendingSigil] = useState(null);
  const [airlockOpen, setAirlockOpen] = useState(false);
  const [lockNotice, setLockNotice] = useState(null);
  const [stillnessLevel, setStillnessLevel] = useState(0);
  const [mapPresenceMs, setMapPresenceMs] = useState(0);
  const [subMapRegion, setSubMapRegion] = useState(null);
  const [subMapTransform, setSubMapTransform] = useState({ x: 0, y: 0, scale: 1.1 });
  const [satchelOpen, setSatchelOpen] = useState(false);
  const [sporeSatchelOpen, setSporeSatchelOpen] = useState(false);
  const [mycorrhizalActive, setMycorrhizalActive] = useState(false);
  const [foodWebActive, setFoodWebActive] = useState(false);
  const subMapRef = useRef(null);
  const subMapStateRef = useRef({
    isDragging: false,
    lastX: 0,
    lastY: 0,
    lastT: 0,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    scale: 1.1
  });
  const lastVoRef = useRef(null);
  const lastStillnessRef = useRef(0);
  const lastStillnessAtRef = useRef(0);
  const bondAttemptRef = useRef(null);
  const presenceCarryRef = useRef(0);
  const mapLogRef = useRef({ key: '', at: 0 });
  const mapOpenLoggedRef = useRef(false);
  const router = useRouter();
  const satchelStorageKey = useMemo(() => {
    const userKey = user?.uid || user?.id || 'guest';
    return `tethys_satchel_open:${userKey}`;
  }, [user?.id, user?.uid]);

  const sporeSaturation = useMemo(() => {
    const kith = Math.max(0, Math.min(100, stats?.kith ?? 0));
    const base = kith / 100;
    const pathBoost = playerProfile?.path?.primary === 'mystics' ? 0.2 : 0;
    const regionBoost = currentLocation?.includes('mystic') ? 0.25 : 0;
    const guideBoost = playerProfile?.guide?.adornments?.includes('sigil_hatched') ? 0.05 : 0;
    const total = Math.min(1, base + pathBoost + regionBoost + guideBoost);
    return total;
  }, [currentLocation, playerProfile?.guide?.adornments, playerProfile?.path?.primary, stats?.kith]);

  const quietEffects = useMemo(() => {
    const statuses = playerProfile?.survivorship?.statuses || [];
    return statuses.slice(-2);
  }, [playerProfile?.survivorship?.statuses]);

  const recordMapInteraction = useCallback(
    async (action, locationId) => {
      if (!user || authLoading) return;
      if (!action || !locationId) return;
      const now = Date.now();
      const key = `${action}:${locationId}`;
      if (mapLogRef.current.key === key && now - mapLogRef.current.at < 3000) return;
      mapLogRef.current = { key, at: now };
      try {
        await logMapInteraction({
          action,
          locationId,
          worldYear: worldState?.worldYear,
          cyclePhase: worldState?.cyclePhase
        });
      } catch (error) {
        console.warn('Map interaction log failed', error);
      }
    },
    [authLoading, user, worldState?.worldYear, worldState?.cyclePhase]
  );

  const loreContext = useMemo(
    () =>
      getDefaultLoreContext({
        stillness: stillnessLevel,
        sporeSaturation,
        factions: playerProfile?.path?.primary
          ? [playerProfile.path.primary]
          : null
      }),
    [playerProfile?.path?.primary, sporeSaturation, stillnessLevel]
  );

  const mapLoreSeeds = useMemo(
    () =>
      selectLoreSeeds({
        regionId: currentLocation,
        ui: 'map',
        context: loreContext,
        limit: 4
      }),
    [currentLocation, loreContext]
  );

  const syncEquippedStaff = useCallback(() => {
    const activeStaffId = playerProfile?.staff?.activeStaffId;
    if (!activeStaffId) return;
    setEquippedStaff({
      ...playerProfile.staff,
      name: playerProfile.staff?.name || 'Issued Staff',
      id: activeStaffId
    });
  }, [playerProfile?.staff, setEquippedStaff]);

  useEffect(() => {
    if (!authLoading && !user) {
      setAirlockOpen(true);
    }
  }, [authLoading, user]);

  useEffect(() => {
    if (viewState !== 'map') {
      mapOpenLoggedRef.current = false;
    }
  }, [viewState]);

  // 1. Determine Initial State based on User Progress
  useEffect(() => {
    if (loadingData) {
      setViewState('loading');
      return;
    }
    if (!equippedStaff && playerProfile?.staff?.activeStaffId) {
      syncEquippedStaff();
    }
    if (playerProfile?.path?.primary === 'cambria' && !playerProfile?.path?.mapAccess) {
      setViewState('scholar');
      return;
    }
    if (hasOnboarded || equippedStaff) {
      setViewState('map');
    } else if (playerProfile?.staff?.activeStaffId) {
      setViewState('map');
    } else {
      setViewState('egg');
    }
  }, [
    equippedStaff,
    hasOnboarded,
    loadingData,
    playerProfile?.staff?.activeStaffId,
    playerProfile?.path?.primary,
    playerProfile?.path?.mapAccess,
    syncEquippedStaff
  ]);

  // 1a. Voiceover cues per phase (skips if muted)
  useEffect(() => {
    if (loadingData) return;
    if (playerProfile?.voice?.muteVoiceovers) return;
    const cueByState = {
      egg: 'vo_hatch_intro',
      forge: 'vo_forge_primer',
      map: 'vo_atlas_open'
    };
    const nextCue = cueByState[viewState];
    if (!nextCue) return;
    if (lastVoRef.current === nextCue) return;
    lastVoRef.current = nextCue;
    playTrack(nextCue);
  }, [viewState, loadingData, playerProfile?.voice?.muteVoiceovers, playTrack]);

  useEffect(() => {
    if (viewState !== 'map') return;
    if (mapOpenLoggedRef.current) return;
    mapOpenLoggedRef.current = true;
    recordMapInteraction('map_open', 'atlas');
    const timer = setInterval(() => {
      applyPlayerAction({
        id: 'map_retention',
        type: 'restorative',
        intensity: 0.4,
        xp: 1,
        repeatPenalty: false,
        envPressure: 0.05,
        region: currentLocation
      });
    }, 90000);
    return () => clearInterval(timer);
  }, [viewState, applyPlayerAction, recordMapInteraction]);

  useEffect(() => {
    const storedUi = playerProfile?.ui?.map?.satchelOpen;
    if (storedUi === true) {
      setSatchelOpen(true);
      return;
    }
    if (storedUi === false) {
      setSatchelOpen(false);
      return;
    }
    if (typeof window === 'undefined') return;
    const stored = window.sessionStorage.getItem(satchelStorageKey);
    if (stored === '1') {
      setSatchelOpen(true);
    }
  }, [playerProfile?.ui?.map?.satchelOpen, satchelStorageKey]);

  useEffect(() => {
    if (viewState !== 'map') return;
    const handleKey = (event) => {
      if (event.defaultPrevented) return;
      const target = event.target;
      const tag = target?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || target?.isContentEditable) return;
      if (event.key?.toLowerCase() === 'i') {
        setSatchelOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [viewState]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.sessionStorage.setItem(satchelStorageKey, satchelOpen ? '1' : '0');
  }, [satchelOpen, satchelStorageKey]);

  useEffect(() => {
    if (!user) return;
    setPlayerProfile((profile) => ({
      ...profile,
      ui: {
        ...(profile?.ui || {}),
        map: {
          ...(profile?.ui?.map || {}),
          satchelOpen
        }
      }
    }));
  }, [satchelOpen, setPlayerProfile, user]);

  useEffect(() => {
    if (user) return;
    setSatchelOpen(false);
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(satchelStorageKey);
    }
  }, [satchelStorageKey, user]);

  useEffect(() => {
    if (!subMapRegion) return;
    setSubMapView('2d');
  }, [subMapRegion]);

  useEffect(() => {
    if (viewState !== 'map') return;
    const initialMs = playerProfile?.perception?.mapTimeMs || 0;
    setMapPresenceMs(initialMs);
    let lastTick = Date.now();
    const timer = setInterval(() => {
      const now = Date.now();
      const delta = now - lastTick;
      lastTick = now;
      setMapPresenceMs((prev) => prev + delta);
      presenceCarryRef.current += delta;
      if (presenceCarryRef.current >= 60000) {
        const carry = presenceCarryRef.current;
        presenceCarryRef.current = 0;
        setPlayerProfile((prev) => ({
          ...prev,
          perception: {
            ...prev.perception,
            mapTimeMs: (prev.perception?.mapTimeMs || 0) + carry,
            lastMapAt: new Date().toISOString()
          }
        }));
      }
    }, 10000);
    return () => clearInterval(timer);
  }, [setPlayerProfile, playerProfile?.perception?.mapTimeMs, viewState]);

  // 2. Progression Handlers
  const onEggHatch = () => {
    setViewState('sigil');
  };

  const onSigilSelect = (sigilId) => {
    if (selectedSigil) return;
    setSelectedSigil(sigilId);
    setTimeout(() => {
      setViewState('forge');
    }, 700);
  };

  const onStaffComplete = async (profile) => {
    const config = PATH_CONFIG.find((entry) => entry.id === selectedSigil) || PATH_CONFIG[0];
    await hatchFromTemplate('starter_v1', {
      path: config.id,
      items: config.items,
      mapAccess: config.mapAccess
    });

    setEquippedStaff(profile);
    setPlayerProfile((prev) => ({
      ...prev,
      staff: {
        ...prev.staff,
        activeStaffId: profile?.id || prev.staff?.activeStaffId,
        name: profile?.name || prev.staff?.name,
        updatedAt: new Date().toISOString()
      }
    }));

    config.unlocks.forEach((node) => travelTo(node));

    if (config.redirect) {
      router.push(config.redirect);
      return;
    }

    setViewState('map');
  };

  const handleMapSelect = useCallback(
    (regionId) => {
      if (!regionId) return;
      const canAccessMap = hasOnboarded || equippedStaff || playerProfile?.staff?.activeStaffId;
      if (!canAccessMap) {
        setLockNotice({
          regionId,
          message: 'The atlas remains sealed until your staff is forged.',
          at: Date.now()
        });
        return;
      }
      const outcome = travelTo(regionId);
      if (outcome?.blocked) {
        const message =
          outcome.reason === 'locked'
            ? 'The air thickens. Your staff pulls you back.'
            : 'Your footing slips. The path refuses you.';
        setLockNotice({ regionId, message, at: Date.now() });
        return;
      }
      recordMapInteraction('node_travel', regionId);
      if (regionId === 'pteros') {
        router.push('/pteros');
      }
    },
    [router, travelTo, hasOnboarded, equippedStaff, playerProfile?.staff?.activeStaffId, recordMapInteraction]
  );

  useEffect(() => {
    if (!lockNotice) return;
    const timer = setTimeout(() => {
      setLockNotice(null);
    }, 2200);
    return () => clearTimeout(timer);
  }, [lockNotice]);

  const handleStillnessChange = useCallback(
    (level) => {
      const now = Date.now();
      if (now - lastStillnessAtRef.current < 2200) return;
      if (Math.abs(level - lastStillnessRef.current) < 0.08) return;
      lastStillnessRef.current = level;
      lastStillnessAtRef.current = now;
      setStillnessLevel(level);
      setPlayerProfile((prev) => ({
        ...prev,
        perception: {
          ...prev.perception,
          stillness: level,
          lastStillnessAt: new Date().toISOString()
        }
      }));
    },
    [setPlayerProfile]
  );

  useEffect(() => {
    if (!bondEncounter || bondEncounter.state !== 'active') return;
    if (bondEncounter.regionId !== currentLocation) return;
    if (stillnessLevel < 0.88) {
      if (bondAttemptRef.current) {
        clearTimeout(bondAttemptRef.current);
        bondAttemptRef.current = null;
      }
      return;
    }
    if (bondAttemptRef.current) return;
    bondAttemptRef.current = setTimeout(async () => {
      await attemptBondEncounter();
      bondAttemptRef.current = null;
    }, 2400);
    return () => {
      if (bondAttemptRef.current) {
        clearTimeout(bondAttemptRef.current);
        bondAttemptRef.current = null;
      }
    };
  }, [attemptBondEncounter, bondEncounter, currentLocation, stillnessLevel]);

  const pathMode = resolvePathMode(playerProfile?.path?.primary);
  const accessLocks = playerProfile?.path?.accessLocks || {};
  const lockedRegions = Object.entries(accessLocks)
    .filter(([, value]) => (value?.remaining || 0) > 0)
    .map(([key]) => key);
  const atlasUrl = cdn('/img/map/tethys-atlas-canon.png');
  const subMapConfig = useMemo(() => {
    if (!subMapRegion) return null;
    const fragment = MAP_FRAGMENTS.find((entry) => entry.region === subMapRegion);
    if (!fragment) return null;
    const forcedLock = subMapRegion === 'permian-desert';
    return {
      ...fragment,
      isLocked: forcedLock || lockedRegions.includes(subMapRegion)
    };
  }, [lockedRegions, subMapRegion]);
  const subMapSatellite = subMapConfig?.satellite?.url ? cdn(subMapConfig.satellite.url) : null;
  const subMapSatelliteOpacity = subMapConfig?.satellite?.opacity ?? 0.6;
  const subMapSatelliteBlend = subMapConfig?.satellite?.blend ?? 'soft-light';
  const subMapSatelliteSize = subMapConfig?.satellite?.size ?? 'cover';
  const subMapSatellitePosition = subMapConfig?.satellite?.position ?? '50% 50%';
  const showPermianOverlay = subMapConfig?.region === 'permian-desert';
  const showKarstOverlay = subMapConfig?.region === 'karst-drains';
  const showSkyCityExcerpts = subMapConfig?.region === 'sky-city';
  const showIronwoodExcerpts = subMapConfig?.region === 'ironwoods';
  const showTraderRouteNote = (subMapConfig?.region === 'karst-drains' || subMapConfig?.region === 'the-weep')
    && stillnessLevel >= 0.6;
  const showLowerTierAlert = (subMapConfig?.region === 'pteros' || subMapConfig?.region === 'straits-of-dier')
    && stillnessLevel >= 0.6;
  const subMapFoodSeeds = useMemo(() => {
    if (!subMapConfig) return [];
    const direct = selectLoreSeeds({
      regionId: subMapConfig.region,
      ui: 'map',
      context: loreContext,
      cluster: 'tethys-food-web',
      limit: 3
    });
    if (direct.length) return direct;
    return selectLoreSeeds({
      ui: 'map',
      context: loreContext,
      cluster: 'tethys-food-web',
      limit: 3
    });
  }, [loreContext, subMapConfig]);

  useEffect(() => {
    if (!subMapConfig) return;
    const next = { x: 0, y: 0, scale: 1.1 };
    subMapStateRef.current = { ...subMapStateRef.current, ...next };
    setSubMapTransform(next);
    setFoodWebActive(false);
  }, [subMapConfig]);

  const handleSubMapPointerDown = (event) => {
    const state = subMapStateRef.current;
    state.isDragging = true;
    state.lastX = event.clientX;
    state.lastY = event.clientY;
    state.lastT = Date.now();
    state.vx = 0;
    state.vy = 0;
  };

  const handleSubMapPointerMove = (event) => {
    const state = subMapStateRef.current;
    if (!state.isDragging) return;
    const now = Date.now();
    const dt = Math.max(1, now - state.lastT);
    const dx = event.clientX - state.lastX;
    const dy = event.clientY - state.lastY;
    state.lastX = event.clientX;
    state.lastY = event.clientY;
    state.lastT = now;
    state.x += dx;
    state.y += dy;
    state.vx = (dx / dt) * 16;
    state.vy = (dy / dt) * 16;
    setSubMapTransform({ x: state.x, y: state.y, scale: state.scale });
  };

  const handleSubMapPointerUp = () => {
    subMapStateRef.current.isDragging = false;
  };

  const handleSubMapWheel = (event) => {
    event.preventDefault();
    const state = subMapStateRef.current;
    const zoom = event.deltaY < 0 ? 1.06 : 0.94;
    const nextScale = Math.max(1, Math.min(2.8, state.scale * zoom));
    state.scale = nextScale;
    setSubMapTransform({ x: state.x, y: state.y, scale: state.scale });
  };

  useEffect(() => {
    if (!subMapConfig) return;
    let raf = 0;
    const tick = () => {
      const state = subMapStateRef.current;
      const container = subMapRef.current;
      if (!container) {
        raf = requestAnimationFrame(tick);
        return;
      }

      if (!state.isDragging) {
        state.x += state.vx;
        state.y += state.vy;
        state.vx *= 0.9;
        state.vy *= 0.9;
      }

      const boundsX = (container.clientWidth * (state.scale - 1)) / 2;
      const boundsY = (container.clientHeight * (state.scale - 1)) / 2;
      const clampX = Math.max(-boundsX, Math.min(boundsX, state.x));
      const clampY = Math.max(-boundsY, Math.min(boundsY, state.y));
      if (clampX !== state.x) state.vx *= 0.4;
      if (clampY !== state.y) state.vy *= 0.4;
      state.x = clampX;
      state.y = clampY;

      if (Math.abs(state.vx) < 0.05) state.vx = 0;
      if (Math.abs(state.vy) < 0.05) state.vy = 0;

      setSubMapTransform({ x: state.x, y: state.y, scale: state.scale });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [subMapConfig]);

  const pendingConfig = pendingSigil
    ? PATH_CONFIG.find((entry) => entry.id === pendingSigil)
    : null;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0c0a09] p-8 flex items-center justify-center">
        <div className="text-stone-400 animate-pulse uppercase tracking-widest text-xs">
          Verifying Identity...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0c0a09] text-stone-200 p-6 pt-32 relative overflow-hidden font-mono">
        <IdentityAirlock isOpen={airlockOpen} onClose={() => setAirlockOpen(false)} />
      </div>
    );
  }

  const ghostedUi = viewState === 'map';
  const mapFocusActive = ghostedUi && mapHovered;
  const mapUiFrost = mapFocusActive ? 'opacity-45' : ghostedUi ? 'opacity-70 hover:opacity-100' : '';
  const mapSideOpacity = mapFocusActive ? 'opacity-40' : ghostedUi ? 'opacity-70 hover:opacity-100' : '';

  return (
    <div className="min-h-screen bg-[#0c0a09] text-stone-200 font-mono">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-orange-600 focus:text-white focus:rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
      >
        Skip to main content
      </a>

      <main role="main" id="main-content" className="p-6 pt-32 relative overflow-hidden">
        <PrimaryNav
          className={`max-w-7xl mx-auto px-4 md:px-6 mb-4 transition-opacity ${mapUiFrost}`}
        />
        <BreadcrumbTrail
          trail={MAP_BREADCRUMB}
          className={`max-w-7xl mx-auto px-4 md:px-6 mb-6 transition-opacity ${mapUiFrost}`}
        />
        {viewState === 'map' && (
          <div className={mapUiFrost ? `${mapUiFrost} transition-opacity` : ''}>
            <StatusBar />
          </div>
        )}
        {/* HEADER */}
        <header
          role="banner"
          className={`max-w-7xl mx-auto mb-8 flex flex-wrap items-end justify-between gap-4 relative z-10 transition-opacity ${mapUiFrost}`}
        >
        <Link href="/?skipIntro=1" className="text-xs text-stone-500 hover:text-white uppercase tracking-widest flex items-center gap-2 mb-4 transition-colors">
          <ArrowLeft size={14} />
          Return to Hub
        </Link>
        <div className="flex items-end gap-4">
          <div>
            <h1 className="text-4xl font-serif text-white">
            {viewState === 'map' ? 'The Atlas' : 'Pteros Hatchery'}
            </h1>
            {viewState === 'map' && (
              <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500 mt-2">
                Shift+Click a marker to unfold a sub-map
              </p>
            )}
          </div>
          {viewState === 'map' && (
            <div
              className={`h-fit px-3 py-2 border rounded-sm text-[9px] uppercase tracking-[0.3em] transition-all duration-500 ${
                mapHovered
                  ? 'border-stone-400/80 text-stone-200 bg-black/40'
                  : 'border-stone-700/60 text-stone-500 bg-black/20'
              }`}
            >
              Map focus {mapHovered ? 'active' : 'idle'}
            </div>
          )}
          {viewState !== 'map' && (
            <div className="flex gap-2">
              <StepIndicator label="Incubate" active={viewState === 'egg'} completed={viewState !== 'egg'} />
              <div className="w-8 h-[1px] bg-stone-800 self-center" />
              <StepIndicator label="Sigil" active={viewState === 'sigil'} completed={viewState === 'forge'} />
              <div className="w-8 h-[1px] bg-stone-800 self-center" />
              <StepIndicator label="Forge" active={viewState === 'forge'} completed={false} />
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          {/* PHASE 0: LOADING */}
          {viewState === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center py-12 text-stone-500"
            >
              <div className="w-10 h-10 border-2 border-stone-800 border-t-stone-500 rounded-full animate-spin mb-4" />
              <p className="text-sm uppercase tracking-[0.2em]">Syncing your gear...</p>
            </motion.div>
          )}
          
          {/* PHASE 1: THE EGG */}
          {viewState === 'egg' && (
            <motion.div
              key="egg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              className="flex flex-col items-center py-12"
            >
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-serif text-stone-200 mb-2">The Hatchery</h2>
                <p className="text-stone-500 text-sm">Step 1 of 3: Awaken Your Guide</p>
              </div>
              <Incubator onHatch={onEggHatch} />
              <p className="mt-12 text-stone-500 max-w-md text-center text-sm font-serif italic">
                "The map is silent until you hatch a guide. Break the seal to begin."
              </p>
            </motion.div>
          )}

          {viewState === 'sigil' && (
            <motion.div
              key="sigil"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-serif text-stone-200 mb-2">Choose Your Path</h2>
                <p className="text-stone-500 text-sm">Step 2 of 3: Select Your Entry Sigil</p>
                <p className="text-stone-400 text-xs mt-2 max-w-lg mx-auto">Each path unlocks different regions and abilities. Click a sigil to learn more.</p>
              </div>
              <div className="relative h-[600px] w-full rounded-2xl overflow-hidden border border-stone-800/60"
            >
              <div
                className="absolute inset-0 bg-cover bg-center opacity-70"
                style={{ backgroundImage: `url(${cdn('/img/locations/pteros_island_hero.png')})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-[#0c0a09]/70 to-[#0c0a09]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full border border-stone-500/20 blur-sm scale-150" />
                  <div className="absolute inset-0 rounded-full border border-stone-700/40 scale-125" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border border-stone-500/40 bg-[#0c0a09] flex items-center justify-center shadow-[0_0_20px_rgba(120,113,108,0.18)]">
                      <Image
                        src={cdn('/img/icons/pteros_island.svg')}
                        alt="Pteros Island"
                        width={24}
                        height={24}
                        className="w-6 h-6"
                        unoptimized
                      />
                    </div>
                  </div>
                  <div className="sigil-orbit grid grid-cols-2 gap-6">
                    {PATH_CONFIG.map((sigil) => (
                      <button
                        key={sigil.id}
                        type="button"
                        onClick={() => setPendingSigil(sigil.id)}
                        onMouseEnter={() => setHoveredSigil(sigil.id)}
                        onMouseLeave={() => setHoveredSigil(null)}
                        onFocus={() => setHoveredSigil(sigil.id)}
                        onBlur={() => setHoveredSigil(null)}
                        aria-label={sigil.label}
                        className={`sigil-button sigil-${sigil.id} w-28 h-28 rounded-full border bg-[#0c0a09] flex items-center justify-center transition-colors ${
                          selectedSigil === sigil.id
                            ? 'border-stone-400/80 shadow-[0_0_30px_rgba(120,113,108,0.22)]'
                            : 'border-stone-700/60 hover:border-stone-500/60'
                        }`}
                      >
                        <Image
                          src={
                            sigil.id === 'mystics' && (hoveredSigil === 'mystics' || selectedSigil === 'mystics')
                              ? cdn('/img/icons/mystics-coin.svg')
                              : sigil.src
                          }
                          alt={sigil.label}
                          width={64}
                          height={64}
                          className={`sigil-icon w-16 h-16 object-contain ${
                            selectedSigil === sigil.id ? 'sigil-animate' : ''
                          }`}
                          unoptimized
                        />
                      </button>
                    ))}
                  </div>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                    <Image
                      src={cdn('/icons/hybrid_seal.svg')}
                      alt="Maker's mark"
                      width={40}
                      height={40}
                      className="w-10 h-10 opacity-70"
                      unoptimized
                    />
                  </div>
                </div>
              </div>

              {pendingConfig && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                  <div className="max-w-md w-full mx-4 bg-[#0c0a09] border border-stone-700/50 rounded-xl p-6 space-y-4">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400">
                      Seal Selection
                    </p>
                    <h3 className="text-2xl font-serif text-white">
                      {pendingConfig.label}
                    </h3>
                    {pendingConfig.blurb && (
                      <p className="text-sm text-stone-300 italic">
                        {pendingConfig.blurb}
                      </p>
                    )}
                    <p className="text-sm text-stone-400">
                      This path forges your first access pattern. You can return
                      later, but the first seal defines your initial route.
                    </p>
                    <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] text-stone-500">
                      <span>Unlocks:</span>
                      {pendingConfig.unlocks.map((node) => (
                        <span key={node} className="px-2 py-1 bg-stone-900 rounded">
                          {node}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setPendingSigil(null)}
                        className="px-4 py-2 border border-stone-700 text-stone-400 text-[10px] uppercase tracking-[0.2em] rounded hover:text-stone-200 hover:border-stone-500 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onSigilSelect(pendingConfig.id);
                          setPendingSigil(null);
                        }}
                        className="px-4 py-2 border border-stone-600 text-stone-300 text-[10px] uppercase tracking-[0.2em] rounded hover:text-stone-200 hover:border-stone-400 transition-colors"
                      >
                        Confirm Seal
                      </button>
                    </div>
                  </div>
                </div>
              )}
              </div>
            </motion.div>
          )}

          {/* PHASE 2: THE FORGE */}
          {viewState === 'forge' && (
            <motion.div
              key="forge"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-serif text-stone-200 mb-2">The Forge</h2>
                <p className="text-stone-500 text-sm">Step 3 of 3: Craft Your Staff</p>
              </div>
              <div className="mb-6 p-4 bg-emerald-900/10 border border-emerald-900/50 rounded flex items-center gap-3 text-emerald-400 text-xs uppercase tracking-widest">
                <CheckCircle size={16} />
                <span>Lifeform Detected. Syncing Staff Sequencer...</span>
              </div>
              <StaffSequencer
                initialStats={BASE_STAFF_STATS}
                inventoryOverride={STAFF_INVENTORY_OVERRIDE}
                onFinalize={onStaffComplete}
              />
            </motion.div>
          )}

          {/* PHASE 3: THE MAP */}
          {viewState === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div
                className={`lg:col-span-2 relative rounded-2xl border border-stone-800/60 bg-black/20 transition-all duration-700 cursor-crosshair ${
                  mapHovered
                    ? 'border-stone-500/80 shadow-[0_0_40px_rgba(148,163,184,0.25)]'
                    : 'shadow-[0_0_0_rgba(0,0,0,0)]'
                }`}
                onMouseEnter={() => setMapHovered(true)}
                onMouseLeave={() => setMapHovered(false)}
              >
                <div
                  className={`pointer-events-none absolute inset-0 rounded-2xl border border-stone-600/20 transition-opacity duration-700 z-20 ${
                    mapHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                />
                <div
                  className={`pointer-events-none absolute top-6 right-6 text-[10px] uppercase tracking-[0.35em] text-stone-300/80 transition-opacity duration-700 z-30 ${
                    mapHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  Map interface active
                </div>
                <LoreRevealPanel
                  mycorrhizalActive={mycorrhizalActive}
                  onMycorrhizalChange={setMycorrhizalActive}
                  foodWebActive={foodWebActive}
                  onFoodWebChange={setFoodWebActive}
                />
                {foodWebActive && (
                  <div className="absolute top-6 left-6 z-40 group">
                    <div className="h-9 w-9 rounded-full border border-cyan-900/60 bg-black/70 shadow-[0_10px_30px_rgba(0,0,0,0.55)] backdrop-blur flex items-center justify-center text-cyan-300 text-xs">
                      ⛯
                    </div>
                    <div className="absolute left-0 top-11 w-60 rounded-xl border border-cyan-900/60 bg-black/80 px-3 py-2 text-[10px] text-cyan-200 shadow-[0_16px_40px_rgba(0,0,0,0.55)] opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="uppercase tracking-[0.3em] text-cyan-300 text-[9px]">
                        Food Web Mode
                      </div>
                      <div className="mt-1 text-cyan-200/80">
                        Hover a pin to reveal sulfur‑web analogs. Creature IDs appear in brackets.
                      </div>
                    </div>
                  </div>
                )}
                <TethysNexus
                  pathMode={pathMode}
                  lockedRegions={lockedRegions}
                  currentLocation={currentLocation}
                  equippedStaff={equippedStaff}
                  unlockedNodes={unlockedNodes}
                  mapPresenceMs={mapPresenceMs}
                  showStaffOverlay={Boolean(equippedStaff)}
                  rootTunnelVisible={hasRavelKnowledge}
                  weatherMistBoost={mapWeatherProfile.mistBoost}
                  cloudIntensity={mapWeatherProfile.cloudIntensity}
                  rumbleIntensity={mapWeatherProfile.rumbleIntensity}
                  stormFrontActive={mapWeatherProfile.stormFrontActive}
                  stormFrontIntensity={mapWeatherProfile.stormFrontIntensity}
                  onInspect={(regionId) => {
                    if (!regionId) return;
                    setSubMapRegion(regionId);
                    recordMapInteraction('node_focus', regionId);
                  }}
                  bondAmbientLevel={
                    bondEncounter?.state === 'active' &&
                    bondEncounter.regionId === currentLocation
                      ? Math.min(1, stillnessLevel)
                    : 0
                  }
                  weatherUnlocked={Boolean(playerProfile?.progression?.weatherUnlocked)}
                  mycorrhizalActive={mycorrhizalActive}
                  sporeSaturation={sporeSaturation}
                  foodWebActive={foodWebActive}
                  onStillnessChange={handleStillnessChange}
                  onTravel={handleMapSelect}
                />
                <AnimatePresence>
                  {lockNotice && (
                    <motion.div
                      key={lockNotice.at}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="pointer-events-none absolute left-6 bottom-6 max-w-sm bg-black/70 border border-stone-700/60 rounded-lg px-4 py-3 text-xs text-stone-200"
                    >
                      <div className="text-[10px] uppercase tracking-[0.2em] text-stone-400 mb-1">
                        Fatigue
                      </div>
                      <p className="text-sm text-stone-200">{lockNotice.message}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className={`space-y-6 transition-opacity ${mapSideOpacity}`}>
                {/* Weather Oracle */}
                <RavelWeatherOracle focus="pteros" className="mb-6" />
                
                <RelayLog focus="all" />

                {/* Your Staff (Inventory Display) */}
                <div className="bg-[#1c1917] p-6 border border-stone-800 rounded-lg">
                  <h3 className="text-stone-400 text-xs uppercase tracking-widest mb-4">Equipped Artifact</h3>
                  {equippedStaff ? (
                    <div>
                      <div className="mb-4">
                        <StaffVisualizer staffData={equippedStaff} heightClass="h-[200px]" />
                      </div>
                      <div className="text-xl font-serif text-white">{equippedStaff.name}</div>
                      <div className="text-xs text-stone-500 font-mono mt-1">{equippedStaff.id}</div>
                      <div className="mt-4 flex gap-2">
                        <span className="px-2 py-1 bg-stone-800 text-stone-300 text-[10px] uppercase rounded">
                          {equippedStaff.rarity}
                        </span>
                        <span className="px-2 py-1 bg-stone-800 text-stone-300 text-[10px] uppercase rounded">
                          Power: {equippedStaff.stats?.power || 0}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSatchelOpen(true)}
                        className="mt-4 w-full px-4 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded text-[10px] uppercase tracking-[0.25em] text-stone-300 transition-colors"
                      >
                        Open Satchel
                      </button>
                      <button
                        type="button"
                        onClick={() => setSporeSatchelOpen(true)}
                        className="mt-2 w-full px-4 py-2 bg-emerald-950/30 hover:bg-emerald-900/30 border border-emerald-900/40 rounded text-[10px] uppercase tracking-[0.25em] text-emerald-200 transition-colors"
                      >
                        Open Spore Satchel
                      </button>
                    </div>
                  ) : (
                    <div className="text-stone-600 italic">No artifact synced.</div>
                  )}
                </div>

                <StaffWorkbench />

                <RavelToolkit
                  compact
                  onSelect={(item) => setSporeSatchelOpen(true)}
                />

                {mapLoreSeeds.length > 0 && (
                  <div className="bg-[#11100f] p-6 border border-stone-800 rounded-lg">
                    <h3 className="text-stone-400 text-xs uppercase tracking-widest mb-4">
                      Field Signals
                    </h3>
                    <div className="space-y-3 text-[11px] text-stone-400">
                      {mapLoreSeeds.map((seed) => (
                        <div key={seed.id} className="border-l border-stone-700/60 pl-3">
                          <p className="text-stone-300">{seed.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {quietEffects.length > 0 && (
                  <div className="group bg-black/30 border border-stone-800 rounded-lg px-3 py-2 inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500/60" />
                    <span className="text-[10px] uppercase tracking-[0.3em] text-stone-600">
                      Quiet
                    </span>
                    <span className="text-[11px] text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {quietEffects.map((effect) => effect.note || effect.type).join(' · ')}
                    </span>
                  </div>
                )}

                {/* Quick Nav */}
                <div className="bg-[#1c1917] p-6 border border-stone-800 rounded-lg">
                  <h3 className="text-cyan-500 text-xs uppercase tracking-widest mb-4">System Access</h3>
                  <div className="space-y-2">
                    <Link href="/pteros" className="block px-4 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded text-xs text-stone-300 transition-colors">
                      Pteros Terminal &rarr;
                    </Link>
                    <Link href="/science" className="block px-4 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded text-xs text-stone-300 transition-colors">
                      Open Field Station &rarr;
                    </Link>
                    <Link href="/mystics" className="block px-4 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded text-xs text-stone-300 transition-colors">
                      Consult The Veil &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
      <AnimatePresence>
        {subMapConfig && (
          <motion.div
            key={subMapConfig.region}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            onClick={() => setSubMapRegion(null)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(event) => event.stopPropagation()}
              className="relative w-full max-w-5xl rounded-3xl border border-stone-800 bg-[#0b0a09] shadow-[0_30px_80px_rgba(0,0,0,0.6)] overflow-hidden"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-800 px-6 py-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.35em] text-stone-500">Sub-map</p>
                  <h2 className="text-2xl font-serif text-stone-100">{subMapConfig.label || subMapConfig.id}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-widest px-3 py-1 rounded border bg-stone-900/30 border-stone-600 text-stone-200">
                    Chart
                  </span>
                  <button
                    type="button"
                    onClick={() => setFoodWebActive((prev) => !prev)}
                    className={`text-[10px] uppercase tracking-widest px-3 py-1 rounded border ${
                      foodWebActive
                        ? 'bg-cyan-900/30 border-cyan-500 text-cyan-200'
                        : 'border-stone-700 text-stone-500'
                    }`}
                  >
                    Food Web
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubMapRegion(null)}
                    className="text-[10px] uppercase tracking-[0.3em] text-stone-400 border border-stone-700 px-4 py-2 rounded-full hover:text-stone-200 hover:border-stone-500 transition-colors ml-2"
                  >
                    Close
                  </button>
                </div>
              </div>
              <div className="relative">
                <div
                  className="h-[60vh] w-full bg-[#050403] overflow-hidden"
                  ref={subMapRef}
                  onPointerDown={handleSubMapPointerDown}
                  onPointerMove={handleSubMapPointerMove}
                  onPointerUp={handleSubMapPointerUp}
                  onPointerLeave={handleSubMapPointerUp}
                  onWheel={handleSubMapWheel}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      transform: `translate3d(${subMapTransform.x}px, ${subMapTransform.y}px, 0) scale(${subMapTransform.scale})`,
                      transformOrigin: 'center',
                      transition: subMapStateRef.current.isDragging ? 'none' : 'transform 80ms linear'
                    }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: showKarstOverlay
                          ? 'radial-gradient(circle at 30% 40%, rgba(16,185,129,0.2), transparent 55%), radial-gradient(circle at 70% 60%, rgba(34,197,94,0.15), transparent 60%), linear-gradient(180deg, #050403 0%, #0b0a09 70%)'
                          : `url(${atlasUrl})`,
                        backgroundSize: showKarstOverlay ? 'cover' : '240%',
                        backgroundPosition: showKarstOverlay
                          ? 'center'
                          : `${(subMapConfig.anchor?.x ?? 0.5) * 100}% ${(subMapConfig.anchor?.y ?? 0.5) * 100}%`,
                        filter: subMapConfig.isLocked ? 'grayscale(1) brightness(0.5)' : 'none'
                      }}
                    />
                    {subMapSatellite && (
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage: `url(${subMapSatellite})`,
                          backgroundSize: subMapSatelliteSize,
                          backgroundPosition: subMapSatellitePosition,
                          opacity: subMapSatelliteOpacity,
                          mixBlendMode: subMapSatelliteBlend,
                          filter: 'saturate(0.85) contrast(1.05)'
                        }}
                      />
                    )}
                    {showPermianOverlay && (
                      <>
                        <div
                          className="absolute inset-0"
                          style={{
                            backgroundImage: `radial-gradient(circle at 18% 22%, rgba(248, 250, 252, 0.32), transparent 45%), radial-gradient(circle at 72% 64%, rgba(226, 232, 240, 0.24), transparent 46%), radial-gradient(circle at 48% 78%, rgba(148, 163, 184, 0.18), transparent 55%), linear-gradient(120deg, rgba(120, 113, 108, 0.08), rgba(41, 37, 36, 0.18))`,
                            mixBlendMode: 'screen',
                            opacity: 0.6
                          }}
                        />
                        <div
                          className="absolute inset-0"
                          style={{
                            backgroundImage: `url(${cdn('/noise.svg')})`,
                            mixBlendMode: 'soft-light',
                            opacity: 0.35
                          }}
                        />
                      </>
                    )}
                    {foodWebActive && (
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage:
                            'radial-gradient(circle at 20% 30%, rgba(34, 211, 238, 0.2), transparent 45%), radial-gradient(circle at 70% 70%, rgba(16, 185, 129, 0.16), transparent 50%), linear-gradient(120deg, rgba(6, 182, 212, 0.08), rgba(2, 132, 199, 0.05))',
                          mixBlendMode: 'screen',
                          opacity: 0.7
                        }}
                      />
                    )}
                    {showKarstOverlay && (
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage: `radial-gradient(circle at 45% 50%, rgba(34,197,94,0.35), transparent 55%), url(${cdn('/noise.svg')})`,
                          mixBlendMode: 'screen',
                          opacity: 0.4
                        }}
                      />
                    )}
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/70" />
                <div className="absolute bottom-6 left-6 max-w-md rounded-xl border border-stone-800 bg-black/60 px-4 py-3 text-xs text-stone-300">
                  <p className="uppercase tracking-[0.25em] text-[10px] text-stone-500">Status</p>
                  <p className="mt-1">
                    {subMapConfig.isLocked
                      ? 'The detail layer is sealed. The archive resists your sight.'
                      : showKarstOverlay
                        ? 'Karst conduits detected. Spore density rising.'
                        : 'Detail layer active. Scroll to deepen the reveal.'}
                  </p>
                  {showLowerTierAlert && (
                    <div className="mt-3 border border-rose-900/50 bg-rose-950/20 px-3 py-2 text-[10px] uppercase tracking-[0.25em] text-rose-300">
                      STATUS: CRITICAL. Melden-Node Offline.
                    </div>
                  )}
                  {showTraderRouteNote && (
                    <div className="mt-3 text-[10px] text-stone-400 italic">
                      Wind-cut ledges ahead. Cambrian exhausts bruise the air.
                    </div>
                  )}
                  {foodWebActive && (
                    <div className="mt-3 space-y-2 text-[10px] text-cyan-200/80">
                      <div className="uppercase tracking-[0.25em] text-cyan-300 text-[9px]">
                        Food Web Overlay
                      </div>
                      {subMapFoodSeeds.length ? (
                        subMapFoodSeeds.map((seed) => (
                          <div key={seed.id} className="text-stone-300">
                            {seed.text}
                          </div>
                        ))
                      ) : (
                        <div className="text-stone-500">
                          No sulfur web signals in this basin.
                        </div>
                      )}
                    </div>
                  )}
                  {showSkyCityExcerpts && (
                    <details className="mt-3 text-[10px] text-stone-400">
                      <summary className="cursor-pointer uppercase tracking-[0.25em] text-stone-500">
                        Variable Agents (Withdrawn)
                      </summary>
                      <div className="mt-2 space-y-2">
                        {SKY_CITY_VARIABLE_AGENTS.map((entry) => (
                          <div key={entry.title}>
                            <div className="text-[9px] uppercase tracking-[0.2em] text-stone-500">
                              {entry.title}
                            </div>
                            <div className="mt-1 text-[10px] text-stone-400 italic">
                              {entry.lines.join(' ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                  {showIronwoodExcerpts && (
                    <details className="mt-3 text-[10px] text-stone-400">
                      <summary className="cursor-pointer uppercase tracking-[0.25em] text-stone-500">
                        Ironwood Counter-Notes
                      </summary>
                      <div className="mt-2 space-y-2">
                        {IRONWOOD_COUNTER_DOCS.map((entry) => (
                          <div key={entry.title}>
                            <div className="text-[9px] uppercase tracking-[0.2em] text-stone-500">
                              {entry.title}
                            </div>
                            <div className="mt-1 text-[10px] text-stone-400 italic">
                              {entry.lines.join(' ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
                {!subMapConfig.isLocked && (
                  <div className="absolute top-5 right-6 text-[10px] uppercase tracking-[0.3em] text-stone-500">
                    Drag to pan
                  </div>
                )}
                <div className="absolute bottom-6 right-6 h-28 w-28 rounded-xl border border-stone-800 bg-black/50 overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.4)]">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${atlasUrl})`,
                      backgroundSize: '240%',
                      backgroundPosition: `${(subMapConfig.anchor?.x ?? 0.5) * 100}% ${(subMapConfig.anchor?.y ?? 0.5) * 100}%`,
                      opacity: 0.6,
                      filter: 'grayscale(0.5)'
                    }}
                  />
                  <div
                    className="absolute border border-stone-400/60"
                    style={{
                      left: `${Math.max(0, Math.min(1, 0.5 - subMapTransform.x / (subMapRef.current?.clientWidth * subMapTransform.scale || 1))) * 100 - (50 / (subMapTransform.scale || 1))}%`,
                      top: `${Math.max(0, Math.min(1, 0.5 - subMapTransform.y / (subMapRef.current?.clientHeight * subMapTransform.scale || 1))) * 100 - (50 / (subMapTransform.scale || 1))}%`,
                      width: `${100 / (subMapTransform.scale || 1)}%`,
                      height: `${100 / (subMapTransform.scale || 1)}%`
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Satchel isOpen={satchelOpen} onClose={() => setSatchelOpen(false)} />
      <SporeSatchel isOpen={sporeSatchelOpen} onClose={() => setSporeSatchelOpen(false)} />
      <style jsx>{`
        @keyframes sigil-spin-glow {
          0% {
            transform: rotate(0deg) scale(1);
            filter: drop-shadow(0 0 0 rgba(120, 113, 108, 0));
          }
          50% {
            transform: rotate(12deg) scale(1.06);
            filter: drop-shadow(0 0 12px rgba(120, 113, 108, 0.35));
          }
          100% {
            transform: rotate(0deg) scale(1.02);
            filter: drop-shadow(0 0 18px rgba(120, 113, 108, 0.45));
          }
        }
        .sigil-animate {
          animation: sigil-spin-glow 0.7s ease-out;
        }
      `}</style>
      </main>
    </div>
  );
}

function StepIndicator({ label, active, completed }) {
  return (
    <div
      className={`flex items-center gap-2 text-[10px] uppercase tracking-widest ${
        active ? 'text-white' : completed ? 'text-emerald-500' : 'text-stone-600'
      }`}
    >
      <div
        className={`w-2 h-2 rounded-full ${
          active ? 'bg-white animate-pulse' : completed ? 'bg-emerald-500' : 'bg-stone-700'
        }`}
      />
      {label}
    </div>
  );
}

// World of Tethys || D.C. Barletta
