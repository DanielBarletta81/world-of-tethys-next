'use client';

import { useEffect, useMemo, useState } from 'react';
import useMapPhysics from '@/components/features/map/MapPhysics';
import MapViewport from '@/components/features/map/MapViewport';
import MapFragments from '@/components/features/map/MapFragments';
import cdn from '@/lib/cdn';

const FRAGMENTS = [
  { id: 'pteros', label: 'Pteros', region: 'pteros_island', anchor: { x: 0.52, y: 0.68 }, icon: '/img/icons/pteros_island.svg' },
  { id: 'watcher', label: 'Watcher Volcano', region: 'watcher_volcano', anchor: { x: 0.62, y: 0.35 }, icon: '/img/icons/watcher-volcano.svg' },
  { id: 'cambria', label: 'Cambria', region: 'cambria_ruins', anchor: { x: 0.42, y: 0.45 }, icon: '/img/icons/cambria.svg' },
  { id: 'gargantua', label: 'Gargantua', region: 'gargantua_archipelago', anchor: { x: 0.24, y: 0.32 }, icon: '/img/icons/mammoth-hand-island.svg' },
  { id: 'skycity', label: 'Sky City', region: 'sky_city', anchor: { x: 0.48, y: 0.18 }, icon: '/img/icons/sky-city.svg' }
];

const MAP_FALLBACK = {
  atlas: '/img/map/tethys-atlas-clean.png',
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
  onTravel
}) {
  const watcherIntensity = watcherIntensityFor(currentLocation);
  const cfg = useMemo(
    () => ({ STILL_DELAY: 1800, STILL_FULL: 2600, MIN_SCALE: 0.9, MAX_SCALE: 2.4 }),
    []
  );
  const physics = useMapPhysics({ cfg, mode: pathMode, watcherIntensity, envPressure: 0 });
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

  return (
    <div
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
    </div>
  );
}
