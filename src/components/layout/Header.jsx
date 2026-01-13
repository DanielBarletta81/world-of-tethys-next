'use client';

import { useMemo } from 'react';
import { useTethys } from '@/context/TethysContext';
import CelestialDisk from './CelestialDisk';

export default function Header({
  activeView,          // 'map' | 'forge' | 'cambria' | etc.
  stillnessLevel = 0,  // 0..1 (from map or global store)
  pressure = 0,        // 0..1 (optional; future)
}) {
  const { currentLocation, identity, scars } = useTethys();

  const tone = useMemo(() => {
    if (stillnessLevel > 0.85) return 'calm';
    if (pressure > 0.6) return 'tense';
    return 'neutral';
  }, [stillnessLevel, pressure]);

  function PathPill({ view }) {
  const map = {
    map: 'World',
    forge: 'Bond',
    cambria: 'Lore',
  };

  return (
    <div className="px-2 py-1 rounded-md text-[10px] uppercase tracking-[0.3em]
                    bg-stone-900/60 text-stone-400">
      {map[view] ?? ''}
    </div>
  );
}

function LocationWhisper({ location }) {
  if (!location) return null;

  return (
    <div className="text-[11px] text-stone-500 italic">
      {location.replace('-', ' ')}
    </div>
  );
}


function IdentityMark({ identity, scars = [] }) {
  if (!identity) return null;

  const scarCount = scars.length;

  return (
    <div className="flex items-center gap-2">
      <div
        className="w-2 h-2 rounded-full"
        style={{
          background:
            identity === 'mystic' ? '#22c55e' :
            identity === 'thal' ? '#ef4444' :
            identity === 'ironwood' ? '#a16207' :
            '#94a3b8',
          opacity: 0.85
        }}
      />
      <div className="text-[10px] uppercase tracking-[0.25em] text-stone-400">
        {identity}
      </div>
      {scarCount > 0 && (
        <div className="text-[10px] text-stone-600">
          {scarCount}
        </div>
      )}
    </div>
  );
}


  return (
    <header
      className={`sticky top-0 z-50 h-14
        bg-gradient-to-b from-[#0d0f12]/90 to-[#0d0f12]/60
        backdrop-blur-md border-b border-stone-800/60`}
    >
      <div className="h-full grid grid-cols-3 items-center px-4">

        {/* LEFT — WORLD ORIENTATION */}
        <div className="flex items-center gap-3 text-stone-300">
          <PathPill view={activeView} />
          <LocationWhisper location={currentLocation} />
        </div>

        {/* CENTER — TIME / STATE */}
        <div className="flex justify-center">
          <CelestialDisk
            tone={tone}
            stillness={stillnessLevel}
            size={36}
          />
        </div>

        {/* RIGHT — IDENTITY / BOND */}
        <div className="flex items-center justify-end gap-3">
          <IdentityMark identity={identity} scars={scars} />
        </div>

      </div>
    </header>
  );
}
// World of Tethys || D.C. Barletta
