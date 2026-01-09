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

  const physics = useMapPhysics({ cfg, mode: pathMode, watcherIntensity });

  useEffect(() => {
    saveKnowledge(knowledge);
  }, [knowledge]);

  useEffect(() => {
    onStillnessChange?.(physics.stillnessLevel);
  }, [physics.stillnessLevel, onStillnessChange]);

  const { TorchLayer } = useTorchCursor(true);

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

// Minimal placeholder fragments; replace with your real anchors/ids
const MAP_FRAGMENTS = [
  { id: 'frag_pteros', region: 'pteros_island', anchor: { x: 0.32, y: 0.62 } },
  { id: 'frag_cambria', region: 'cambria_ruins', anchor: { x: 0.55, y: 0.48 } },
  { id: 'frag_shastea', region: 'mount_shastea', anchor: { x: 0.71, y: 0.35 } },
];

