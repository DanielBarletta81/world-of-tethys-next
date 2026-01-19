'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import useMapPhysics from '@/components/features/map/MapPhysics';
import MapViewport from '@/components/features/map/MapViewport';
import MapFragments from '@/components/features/map/MapFragments';
import cdn from '@/lib/cdn';
import StaffVisualizer from '@/components/StaffVisualizer';

const FRAGMENTS = [
  { id: 'skycity', label: 'Sky City', region: 'sky_city', anchor: { x: 0.26, y: 0.84 }, icon: '/img/icons/sky-city.svg' },
  { id: 'cimmerian', label: 'Cimmerian Mtns', region: 'cimmerian_mtns', anchor: { x: 0.16, y: 0.73 }, showPin: false, clickable: false },
  { id: 'denisova', label: 'Denisova', region: 'denisova', anchor: { x: 0.28, y: 0.56 }, showPin: false, clickable: false },
  { id: 'siluria', label: 'Siluria', region: 'siluria', anchor: { x: 0.18, y: 0.44 }, icon: '/img/icons/silurian.svg', clickable: false },
  { id: 'younger', label: 'Younger Woods', region: 'younger_woods', anchor: { x: 0.3, y: 0.22 }, showPin: false, clickable: false },
  { id: 'ironwoods', label: 'Ironwoods', region: 'ironwoods', anchor: { x: 0.62, y: 0.2 }, icon: '/img/icons/ironwood.svg' },
  { id: 'straits', label: 'Straits of Dier', region: 'straits-of-dier', anchor: { x: 0.43, y: 0.48 }, icon: '/img/icons/straits-of-dier.svg' },
  { id: 'pteros', label: 'Pteros Island', region: 'pteros_island', anchor: { x: 0.46, y: 0.56 }, icon: '/img/icons/pteros_island.svg' },
  { id: 'mammoth', label: 'Mammoth Island', region: 'mammoth-hand-island', anchor: { x: 0.72, y: 0.46 }, icon: '/img/icons/mammoth-hand-island.svg' },
  { id: 'thal', label: 'Thal Territory', region: 'thal_territory', anchor: { x: 0.74, y: 0.51 }, showPin: false, clickable: false, labelOffset: { x: 7, y: 7 } },
  { id: 'tethys-sea', label: 'Tethys Sea', region: 'tethys_sea', anchor: { x: 0.53, y: 0.64 }, showPin: false, clickable: false },
  { id: 'rogue', label: 'Rogue Island', region: 'rogue_island', anchor: { x: 0.74, y: 0.73 }, showPin: false, clickable: false },
  { id: 'new-tethys', label: 'New Tethys', region: 'new_tethys', anchor: { x: 0.78, y: 0.9 }, showPin: false, clickable: false }
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
  if (['watcher_volcano', 'watcher_flats', 'purgess', 'the_ledge'].includes(regionId)) return 'near';
  if (['mystic_woods', 'sky_city', 'cambria_ruins'].includes(regionId)) return 'mid';
  return 'far';
}

export default function TethysNexus({
  onStillnessChange,
  currentLocation = 'pteros_island',
  pathMode = 'wild',
  lockedRegions = [],
  weatherUnlocked = false,
  onTravel,
  equippedStaff = null,
  showStaffOverlay = false
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
          transform={{ tx: physics.tx, ty: physics.ty, scale: physics.scale }}
          fogPoints={[]}
          bleedPoints={[]}
          mode={pathMode}
          truthProfile={truthProfile}
          watcherIntensity={watcherIntensity}
          envPressure={0}
          fogBoost={fogBoost}
        >
          <MapFragments
            fragmentsConfig={FRAGMENTS}
            stillnessReady={stillnessReady}
            cambriaActive={pathMode === 'mystic'}
            lockedRegions={lockedRegions}
            onTravel={onTravel}
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
