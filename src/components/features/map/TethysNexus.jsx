'use client';

import { useEffect, useMemo, useState } from 'react';
import MapViewport from '@/components/features/map/MapViewport';
import MapFragments from '@/components/features/map/MapFragments';
import MapPhysics from '@/components/features/map/MapPhysics';
import { loadKnowledge, saveKnowledge } from '@/app/hooks/useKnowledgeStore';
import { useTorchCursor } from '@/app/hooks/useTorchSVG';
import cdn from '@/lib/cdn';


function getWatcherIntensity(currentLocation) {
  // temporary: region lookup (replace later with distances)
  const r = currentLocation?.regionId || currentLocation;
  if (!r) return "far";
  if (["watcher_volcano", "watcher_flats", "purgess", "the_ledge"].includes(r)) return "near";
  if (["mystic_woods", "sky_city", "cambria_ruins"].includes(r)) return "mid";
  if (["thals", "mount_shastea", "ironwood", "gargantua_archipelago", "pteros_island", "danian"].includes(r)) return "far";
  return "far";
}

export default function TethysNexus({
  onStillnessChange,
  activeView,
  currentLocation,
  pathMode = "wild",
  lockedRegions = [],
  bondAmbientLevel = 0,
  weatherUnlocked = false,
  onTravel
}) {
  const cfg = {
    STILL_DELAY: 1800,
    STILL_FULL: 2600,
    MIN_SCALE: 0.9,
    MAX_SCALE: 2.4
  };


  const [fogPoints, setFogPoints] = useState([]);
  const [knowledge, setKnowledge] = useState(() => loadKnowledge());
  const [envPressure, setEnvPressure] = useState(0); // 0 -> calm, 1 -> imminent


  
  const watcherIntensity = useMemo(
    () => getWatcherIntensity(currentLocation),
    [currentLocation]
  );

  // truth profile = how visible each layer is (one place to tune)
  const truthProfile = useMemo(() => {
    const lockedBoost = weatherUnlocked ? 0 : 0.18;
    if (pathMode === "mystic") {
      return { relief: 0.55, mist: 0.35 + lockedBoost, ember: 0.55, ash: 0.45 };
    }
    if (pathMode === "city") {
      return { relief: 0.18, mist: 0.12 + lockedBoost, ember: 0.25, ash: 0.15 };
    }
    // wild
    return { relief: 0.28, mist: 0.22 + lockedBoost, ember: 0.45, ash: 0.25 };
  }, [pathMode, weatherUnlocked]);

  const unlockRegion = (region, fractured = false) => {
    setKnowledge(k => {
      const prev = k.regions?.[region] ?? {};
      return {
        ...k,
        regions: {
          ...(k.regions || {}),
          [region]: {
            clean: fractured ? (prev.clean ?? false) : true,
            fractured: fractured ? true : (prev.fractured ?? false),
            firstUnlockedAt: prev.firstUnlockedAt ?? Date.now()
          }
        }
      };
    });
  };

  const physics = useMapPhysics({ cfg, mode: pathMode, watcherIntensity, envPressure });

  useEffect(() => {
    saveKnowledge(knowledge);
  }, [knowledge]);

  useEffect(() => {
    onStillnessChange?.(physics.stillnessLevel);
  }, [physics.stillnessLevel, onStillnessChange]);

  useEffect(() => {
    const hazard = watcherIntensity === "near" ? 0.55 : watcherIntensity === "mid" ? 0.35 : 0.15;
    setEnvPressure(Math.min(1, physics.stillnessLevel * hazard * 1.8));
  }, [physics.stillnessLevel, watcherIntensity]);

  const [torchActive, setTorchActive] = useState(false);
  const { TorchLayer } = useTorchCursor(torchActive, envPressure);
  const fogBoost = (pathMode === "city" ? 0.04 : 0.08) + (weatherUnlocked ? 0 : 0.12);
  const mapCdnBase = process.env.NEXT_PUBLIC_MAP_CDN_BASE || '';
  const preferCdn = Boolean(mapCdnBase);
  const fallbackAssets = useMemo(
    () => ({
      atlas: '/img/map/tethys-atlas-clean.png',
      relief: '/img/map/tethys-relief-ghost.png',
      mist: '/img/map/tethys-mist-noise.png',
      ember: '/img/map/tethys-ember-scar.png',
      ash: '/img/map/tethys-mist-noise.png'
    }),
    []
  );
  const cdnAssets = useMemo(
    () => ({
      atlas: mapCdnBase ? `${mapCdnBase.replace(/\/$/, '')}/img/map/tethys-atlas-clean.png` : '',
      relief: mapCdnBase ? `${mapCdnBase.replace(/\/$/, '')}/img/map/tethys-relief-ghost.png` : '',
      mist: mapCdnBase ? `${mapCdnBase.replace(/\/$/, '')}/img/map/tethys-mist-noise.png` : '',
      ember: mapCdnBase ? `${mapCdnBase.replace(/\/$/, '')}/img/map/tethys-ember-scar.png` : '',
      ash: mapCdnBase ? `${mapCdnBase.replace(/\/$/, '')}/img/map/tethys-mist-noise.png` : ''
    }),
    [mapCdnBase]
  );
  const [mapAssets, setMapAssets] = useState(() => (preferCdn ? cdnAssets : fallbackAssets));

  useEffect(() => {
    if (!preferCdn) {
      setMapAssets(fallbackAssets);
      return;
    }

    setMapAssets(cdnAssets);
    let cancelled = false;
    const preloadTargets = Object.entries(cdnAssets).filter(([, url]) => url);

    preloadTargets.forEach(([key, url]) => {
      const img = new Image();
      img.onerror = () => {
        if (cancelled) return;
        setMapAssets((prev) => {
          if (!prev || prev[key] === fallbackAssets[key]) return prev;
          return { ...prev, [key]: fallbackAssets[key] };
        });
      };
      img.src = url;
    });

    return () => {
      cancelled = true;
    };
  }, [cdnAssets, fallbackAssets, preferCdn]);

  return (
    <div
      className="relative w-full h-[560px]"
      onPointerDown={physics.handlers.onPointerDown}
      onPointerMove={physics.handlers.onPointerMove}
      onPointerUp={physics.handlers.onPointerUp}
      onWheel={physics.handlers.onWheel}
      onMouseEnter={() => setTorchActive(true)}
      onMouseLeave={() => setTorchActive(false)}
      style={{
        filter: bondAmbientLevel > 0 ? `saturate(${1 - bondAmbientLevel * 0.14}) brightness(${1 - bondAmbientLevel * 0.08})` : 'none',
        transition: 'filter 2.6s ease'
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: Math.min(0.35, bondAmbientLevel * 0.35),
          background: 'radial-gradient(circle at 30% 20%, rgba(120, 180, 140, 0.25), transparent 55%)',
          transition: 'opacity 2.6s ease'
        }}
        aria-hidden="true"
      />
      <div
        className="torchMode-real"
        style={{
          opacity: torchActive ? 1 : 0,
          transition: 'opacity 420ms ease'
        }}
      >
        {TorchLayer}
      </div>

      <MapViewport
        atlasUrl={mapAssets.atlas}
        reliefUrl={mapAssets.relief}
        mistUrl={mapAssets.mist}
        emberUrl={mapAssets.ember}
        ashUrl={mapAssets.ash}
        transform={physics}
        fogPoints={fogPoints}
        mode={pathMode}
        watcherIntensity={watcherIntensity}
        truthProfile={truthProfile}
        envPressure={envPressure}
        fogBoost={fogBoost}
      >
        <MapFragments
          fragmentsConfig={MAP_FRAGMENTS}
          stillnessReady={physics.stillnessLevel > 0.85}
          cambriaActive={activeView === 'cambria'}
          mode={pathMode}
          watcherIntensity={watcherIntensity}
          lockedRegions={lockedRegions}
          onTravel={onTravel}
          onUnlock={(region) => unlockRegion(region, false)}
          onFracture={(region) => unlockRegion(region, true)}
        />
      </MapViewport>
    </div>
  );
}

// Icon overlay anchors (update coordinates to match your atlas)
const MAP_FRAGMENTS = [
  {
    id: 'pteros_island',
    label: 'Pteros Isle',
    region: 'pteros_island',
    anchor: { x: 0.32, y: 0.62 },
    icon: cdn('/img/icons/pteros_island.svg')
  },
  {
    id: 'cambria_ruins',
    label: 'Cambria Ruins',
    region: 'cambria_ruins',
    anchor: { x: 0.55, y: 0.48 },
    icon: cdn('/img/icons/cambria_ruins.svg')
  },
  {
    id: 'mystic_listen',
    label: 'Mystic Veil',
    region: 'mystic_woods',
    anchor: { x: 0.43, y: 0.35 },
    icon: cdn('/img/icons/mystic_listen.svg')
  },
  {
    id: 'mount_shastea',
    label: 'Shastea Peak',
    region: 'mount_shastea',
    anchor: { x: 0.71, y: 0.35 },
    icon: cdn('/img/icons/shastea_peak.svg')
  },
  {
    id: 'iron_sands',
    label: 'Iron Sands',
    region: 'iron-sands',
    anchor: { x: 0.62, y: 0.7 },
    icon: cdn('/img/icons/iron_sands.svg')
  }
];
// World of Tethys || D.C. Barletta
