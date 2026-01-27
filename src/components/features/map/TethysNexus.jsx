'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import useMapPhysics from '@/components/features/map/MapPhysics';
import MapViewport from '@/components/features/map/MapViewport';
import MapFragments from '@/components/features/map/MapFragments';
import cdn from '@/lib/cdn';
import StaffVisualizer from '@/components/StaffVisualizer';
import { TETHYS_FOOD_WEB_ANALOGS } from '@/data/tethys-food-web';
import { getOrganismAnalogs } from '@/lib/lore-seed-runtime';

export const MAP_FRAGMENTS = [
  { id: 'skycity', label: 'Sky City', region: 'sky-city', anchor: { x: 0.26, y: 0.84 }, icon: '/img/icons/sky-city.svg' },
  { id: 'cimmerian', label: 'Cimmerian Mtns', region: 'cimmerian-mtns', anchor: { x: 0.16, y: 0.73 }, showPin: false, clickable: false },
  { id: 'denisova', label: 'Denisova', region: 'denisova', anchor: { x: 0.28, y: 0.56 }, showPin: false, clickable: false },
  { id: 'siluria', label: 'Siluria', region: 'siluria', anchor: { x: 0.18, y: 0.44 }, icon: '/img/icons/silurian.svg', clickable: false },
  { id: 'karst', label: 'Karst Drains', region: 'karst-drains', anchor: { x: 0.22, y: 0.3 } },
  { id: 'younger', label: 'Younger Woods', region: 'younger-woods', anchor: { x: 0.3, y: 0.22 }, showPin: false, clickable: false },
  { id: 'ironwoods', label: 'Ironwoods', region: 'ironwoods', anchor: { x: 0.62, y: 0.2 }, icon: '/img/icons/ironwood.svg' },
  { id: 'straits', label: 'Straits of Dier', region: 'straits-of-dier', anchor: { x: 0.43, y: 0.48 }, icon: '/img/icons/straits-of-dier.svg' },
  { id: 'pteros', label: 'Pteros Island', region: 'pteros', anchor: { x: 0.46, y: 0.56 }, icon: '/img/icons/pteros_island.svg' },
  { id: 'mammoth', label: 'Mammoth Island', region: 'mammoth-hand-island', anchor: { x: 0.72, y: 0.46 }, icon: '/img/icons/mammoth-hand-island.svg' },
  { id: 'thal', label: 'Thal Territory', region: 'thal-territory', anchor: { x: 0.74, y: 0.51 }, showPin: false, clickable: false, labelOffset: { x: 7, y: 7 } },
  { id: 'tethys-sea', label: 'Tethys Sea', region: 'tethys-sea', anchor: { x: 0.53, y: 0.64 }, showPin: false, clickable: false },
  { id: 'rogue', label: 'Rogue Island', region: 'rogue-island', anchor: { x: 0.74, y: 0.73 }, showPin: false, clickable: false },
  { id: 'new-tethys', label: 'New Tethys', region: 'new-tethys', anchor: { x: 0.78, y: 0.9 }, showPin: false, clickable: false },
  { id: 'permian-desert', label: 'Permian Desert', region: 'permian-desert', anchor: { x: 0.9, y: 0.9 } }
];

const PTEROS_FOCUS = { x: 0.46, y: 0.56, scale: 1.6 };

const MAP_FALLBACK = {
  atlas: '/img/map/tethys-atlas-canon.png',
  relief: '/img/map/tethys-relief-ghost.png',
  mist: '/img/map/tethys-mist-noise.png',
  ember: '/img/map/tethys-ember-scar.png',
  ash: '/img/map/tethys-mist-noise.png'
};

function watcherIntensityFor(regionId) {
  if (!regionId) return 'far';
  if (['watcher-volcano', 'watcher-flats', 'purgess', 'the-ledge'].includes(regionId)) return 'near';
  if (['mystic-woods', 'sky-city', 'cambria-ruins'].includes(regionId)) return 'mid';
  return 'far';
}

export default function TethysNexus({
  onStillnessChange,
  currentLocation = 'pteros',
  pathMode = 'wild',
  lockedRegions = [],
  unlockedNodes = [],
  mapPresenceMs = 0,
  weatherUnlocked = false,
  onTravel,
  onInspect,
  equippedStaff = null,
  showStaffOverlay = false,
  mycorrhizalActive = false,
  sporeSaturation = 0,
  foodWebActive = false
}) {
  const containerRef = useRef(null);
  const [initialTransform, setInitialTransform] = useState(null);
  const watcherIntensity = watcherIntensityFor(currentLocation);
  const cfg = useMemo(
    () => ({ STILL_DELAY: 1800, STILL_FULL: 2600, MIN_SCALE: 0.9, MAX_SCALE: 2.4 }),
    []
  );
  const physics = useMapPhysics({
    cfg,
    mode: pathMode,
    watcherIntensity,
    envPressure: 0,
    initialTransform
  });
  const [stillnessReady, setStillnessReady] = useState(false);

  useEffect(() => {
    onStillnessChange?.(physics.stillnessLevel);
    setStillnessReady(physics.stillnessLevel >= 0.8);
  }, [physics.stillnessLevel, onStillnessChange]);

  const mapCdnBase = process.env.NEXT_PUBLIC_MAP_CDN_BASE || '';
  const mapAssets = mapCdnBase
    ? {
        atlas: `${mapCdnBase.replace(/\/$/, '')}${MAP_FALLBACK.atlas}`,
        relief: `${mapCdnBase.replace(/\/$/, '')}${MAP_FALLBACK.relief}`,
        mist: `${mapCdnBase.replace(/\/$/, '')}${MAP_FALLBACK.mist}`,
        ember: `${mapCdnBase.replace(/\/$/, '')}${MAP_FALLBACK.ember}`,
        ash: `${mapCdnBase.replace(/\/$/, '')}${MAP_FALLBACK.ash}`
      }
    : MAP_FALLBACK;

  const fogBoost = (pathMode === 'city' ? 0.04 : 0.08) + (weatherUnlocked ? 0 : 0.12);
  const truthProfile = useMemo(() => {
    const lockedBoost = weatherUnlocked ? 0 : 0.18;
    if (pathMode === 'mystic') return { relief: 0.55, mist: 0.35 + lockedBoost, ember: 0.55, ash: 0.45 };
    if (pathMode === 'city') return { relief: 0.18, mist: 0.12 + lockedBoost, ember: 0.25, ash: 0.15 };
    return { relief: 0.28, mist: 0.22 + lockedBoost, ember: 0.45, ash: 0.25 };
  }, [pathMode, weatherUnlocked]);

  const scopedFragments = useMemo(() => {
    const scope = {
      city: new Set(['sky-city', 'pteros', 'straits-of-dier', 'tethys-sea', 'cimmerian-mtns']),
      mystic: new Set([
        'mystic-woods',
        'ironwoods',
        'pteros',
        'straits-of-dier',
        'tethys-sea',
        'mammoth-hand-island',
        'siluria',
        'denisova',
        'permian-desert'
      ]),
      wild: new Set([
        'ironwoods',
        'mammoth-hand-island',
        'pteros',
        'straits-of-dier',
        'tethys-sea',
        'rogue-island',
        'new-tethys',
        'permian-desert'
      ])
    };
    const allowed = scope[pathMode] || scope.wild;
    return MAP_FRAGMENTS.filter((f) => allowed.has(f.region) || f.region === currentLocation);
  }, [currentLocation, pathMode]);

  const mycorrhizalPoints = useMemo(() => {
    if (!mycorrhizalActive) return [];
    const base = Math.max(0.1, Math.min(1, sporeSaturation || 0));
    return scopedFragments.map((fragment) => {
      const isCurrent = fragment.region === currentLocation;
      const isUnlocked = unlockedNodes.includes(fragment.region);
      const intensityBoost = isCurrent ? 0.25 : isUnlocked ? 0.15 : 0;
      const radius = 0.12 + base * 0.18 + intensityBoost * 0.1;
      return {
        x: fragment.anchor?.x ?? 0.5,
        y: fragment.anchor?.y ?? 0.5,
        r: Math.min(0.3, radius),
        intensity: Math.min(1, base + intensityBoost)
      };
    });
  }, [mycorrhizalActive, sporeSaturation, scopedFragments, currentLocation, unlockedNodes]);

  const mycorrhizalVeins = useMemo(() => {
    if (!mycorrhizalActive) return [];
    const intensity = Math.max(0.2, Math.min(1, sporeSaturation || 0));
    return [
      { d: 'M 120 220 Q 220 120 320 260 T 540 280', speed: 6 - intensity * 2 },
      { d: 'M 80 420 C 200 520 320 340 520 420', speed: 7 - intensity * 2.4 },
      { d: 'M 360 80 Q 420 240 300 460', speed: 5.5 - intensity * 1.6 }
    ];
  }, [mycorrhizalActive, sporeSaturation]);

  const foodWebHints = useMemo(() => {
    if (!foodWebActive) return {};
    return TETHYS_FOOD_WEB_ANALOGS.reduce((acc, node) => {
      node.regions.forEach((region) => {
        if (!acc[region]) acc[region] = [];
        acc[region].push({
          id: node.id,
          tethys: node.tethys,
          creatureId: node.creatureId,
          role: node.role
        });
      });
      return acc;
    }, {});
  }, [foodWebActive]);

  const organismAnalogs = useMemo(() => getOrganismAnalogs(), []);
  const analogHints = useMemo(() => {
    if (!organismAnalogs.length) return {};
    return organismAnalogs.reduce((acc, analog) => {
      (analog.regions || []).forEach((region) => {
        if (!acc[region]) acc[region] = [];
        acc[region].push({
          id: analog.id,
          tethys: analog.tethys,
          realWorld: analog.realWorld
        });
      });
      return acc;
    }, {});
  }, [organismAnalogs]);

  const foodWebAliases = useMemo(
    () => ({
      pteros: 'tethys-estuary',
      'straits-of-dier': 'tethys-estuary',
      ironwoods: 'frenel_thickets',
      'karst-drains': 'shadow_basin',
      'mammoth-hand-island': 'lower-reefs'
    }),
    []
  );

  const labelIds = useMemo(() => {
    if (!scopedFragments.length) return [];
    const byRegion = new Map(scopedFragments.map((f) => [f.region, f]));
    const focus = byRegion.get(currentLocation)?.anchor || { x: 0.5, y: 0.5 };
    const timeTier = Math.min(2, Math.floor(mapPresenceMs / 120000));
    const exploreTier = Math.min(2, Math.floor((unlockedNodes?.length || 0) / 2));
    const labelLimit = Math.min(4, Math.max(3, 2 + timeTier + exploreTier));

    return scopedFragments
      .filter((f) => f.label)
      .map((f) => {
        const dx = f.anchor.x - focus.x;
        const dy = f.anchor.y - focus.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const proximityScore = 1 - Math.min(dist, 1);
        const unlockedBoost = unlockedNodes.includes(f.region) ? 0.6 : 0;
        const lockPenalty = lockedRegions.includes(f.region) ? -0.3 : 0;
        const currentBoost = f.region === currentLocation ? 0.8 : 0;
        return { id: f.id, score: proximityScore + unlockedBoost + lockPenalty + currentBoost };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, labelLimit)
      .map((entry) => entry.id);
  }, [currentLocation, lockedRegions, mapPresenceMs, scopedFragments, unlockedNodes]);

  useEffect(() => {
    if (initialTransform || !containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    if (!clientWidth || !clientHeight) return;
    const scale = PTEROS_FOCUS.scale;
    const x = (0.5 - PTEROS_FOCUS.x) * clientWidth * scale;
    const y = (0.5 - PTEROS_FOCUS.y) * clientHeight * scale;
    setInitialTransform({ x, y, scale });
  }, [initialTransform]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[80vh] overflow-hidden bg-[#0a0a0a] rounded-2xl border border-stone-800"
      {...physics.handlers}
    >
      <div
        className="absolute inset-0"
        style={{
          transform: `translate3d(${physics.tx}px, ${physics.ty}px, 0) scale(${physics.scale})`,
          transition: physics.handlers.onPointerDown ? 'transform 40ms linear' : 'none'
        }}
      >
        <MapViewport
          atlasUrl={cdn(mapAssets.atlas)}
          reliefUrl={cdn(mapAssets.relief)}
          mistUrl={cdn(mapAssets.mist)}
          emberUrl={cdn(mapAssets.ember)}
          ashUrl={cdn(mapAssets.ash)}
          backgroundUrl={cdn(mapAssets.atlas)}
          backgroundOpacity={0.1}
          backgroundDelayMs={700}
          stillnessLevel={physics.stillnessLevel}
          transform={{ tx: physics.tx, ty: physics.ty, scale: physics.scale }}
          fogPoints={[]}
          bleedPoints={[]}
          mode={pathMode}
          truthProfile={truthProfile}
          watcherIntensity={watcherIntensity}
          envPressure={0}
          fogBoost={fogBoost}
          mycorrhizalActive={mycorrhizalActive}
          mycorrhizalPoints={mycorrhizalPoints}
          mycorrhizalVeins={mycorrhizalVeins}
        >
          <MapFragments
            fragmentsConfig={scopedFragments}
            stillnessReady={stillnessReady}
            cambriaActive={pathMode === 'mystic'}
            lockedRegions={lockedRegions}
            labelIds={labelIds}
            labelOpacity={0.22}
            ghosted
            foodWebHints={foodWebHints}
            foodWebActive={foodWebActive}
            foodWebAliases={foodWebAliases}
            analogHints={analogHints}
            onTravel={onTravel}
            onInspect={onInspect}
          />
        </MapViewport>
      </div>
      {showStaffOverlay && equippedStaff ? (
        <div className="pointer-events-none absolute bottom-4 right-4 w-[220px] rounded-xl border border-stone-800/80 bg-black/70 p-3 shadow-[0_16px_30px_rgba(0,0,0,0.45)]">
          <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400">Staff Echo</p>
          <StaffVisualizer staffData={equippedStaff} heightClass="h-[200px]" />
        </div>
      ) : null}
    </div>
  );
}
