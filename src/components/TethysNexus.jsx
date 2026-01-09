'use client';

import { useEffect, useMemo, useState } from 'react';
import MapViewport from '@/components/MapViewport';
import MapFragments from '@/components/MapFragments';
import useMapPhysics from '@/components/MapPhysics';
import { loadKnowledge, saveKnowledge } from '@/app/hooks/useKnowledgeStore';
import { useTorchCursor } from '@/app/hooks/useTorchSVG';


function getWatcherIntensity(currentLocation) {
  // temporary: region lookup (replace later with distances)
  const r = currentLocation?.regionId || currentLocation;
  if (!r) return "far";
  if (["watcher_volcano", "watcher_flats", "purgess", "the_ledge"].includes(r)) return "near";
  if (["mystic_woods", "sky_city", "cambria_ruins"].includes(r)) return "mid";
  if (["thals", "mount_shastea", "ironwood", "gargantua_archipelago", "pteros_island", "danian"].includes(r)) return "far";
  return "far";
}

export default function TethysNexus({ onStillnessChange, activeView, currentLocation, pathMode = "wild" }) {
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
    if (pathMode === "mystic") {
      return { relief: 0.55, mist: 0.35, ember: 0.55, ash: 0.45 };
    }
    if (pathMode === "city") {
      return { relief: 0.18, mist: 0.12, ember: 0.25, ash: 0.15 };
    }
    // wild
    return { relief: 0.28, mist: 0.22, ember: 0.45, ash: 0.25 };
  }, [pathMode]);

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

  const { TorchLayer } = useTorchCursor(true, envPressure);

  return (
    <div
      className="relative w-full h-[560px]"
      onPointerDown={physics.handlers.onPointerDown}
      onPointerMove={physics.handlers.onPointerMove}
      onPointerUp={physics.handlers.onPointerUp}
      onWheel={physics.handlers.onWheel}
    >
      <div className="torchMode-real">
        {TorchLayer}
      </div>

      <MapViewport
        atlasUrl="/maps/tethys-atlas-clean.webp"
        reliefUrl="/maps/tethys-relief-ghost.webp"
        mistUrl="/maps/tethys-mist-noise.webp"
        emberUrl="/maps/tethys-ember-scar.webp"
        ashUrl="/maps/tethys-mist-noise.webp"
        transform={physics}
        fogPoints={fogPoints}
        mode={pathMode}
        watcherIntensity={watcherIntensity}
        truthProfile={truthProfile}
        envPressure={envPressure}
      >
        <MapFragments
          fragmentsConfig={MAP_FRAGMENTS}
          stillnessReady={physics.stillnessLevel > 0.85}
          cambriaActive={activeView === 'cambria'}
          mode={pathMode}
          watcherIntensity={watcherIntensity}
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
    icon: '/img/icons/pteros_island.svg'
  },
  {
    id: 'cambria_ruins',
    label: 'Cambria Ruins',
    region: 'cambria_ruins',
    anchor: { x: 0.55, y: 0.48 },
    icon: '/img/icons/cambria_ruins.svg'
  },
  {
    id: 'mystic_listen',
    label: 'Mystic Veil',
    region: 'mystic_woods',
    anchor: { x: 0.43, y: 0.35 },
    icon: '/img/icons/mystic_listen.svg'
  },
  {
    id: 'mount_shastea',
    label: 'Shastea Peak',
    region: 'mount_shastea',
    anchor: { x: 0.71, y: 0.35 },
    icon: '/img/icons/shastea_peak.svg'
  },
  {
    id: 'iron_sands',
    label: 'Iron Sands',
    region: 'iron-sands',
    anchor: { x: 0.62, y: 0.7 },
    icon: '/img/icons/iron_sands.svg'
  }
];
// World of Tethys || D.C. Barletta
