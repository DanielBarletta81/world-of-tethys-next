'use client';

import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';

const cambrianNine = [
  { name: 'Melden', role: 'Legendary Geneticist', archetype: 'Archivist', color: 'text-amber-glow', image: '/img/characters/marros_hero2.PNG' },
  { name: 'Igzier', role: 'Apprentice • Exile', archetype: 'Survivor', color: 'text-emerald-glow', image: '/img/characters/Igzier_Stryker_hero2.png' },
  { name: 'Karys', role: 'Greenhouse Engineer', archetype: 'Cohort', color: 'text-rose-glow', image: '/img/characters/karys_hero.png' },
  { name: 'Ravel', role: 'Root Whisperer • Mystic', archetype: 'Symbiote', color: 'text-emerald-glow', image: '/img/characters/marros_hero.PNG' },
  { name: 'The Weep', role: 'Exile Rite • Chance at Air', archetype: 'Faction', color: 'text-cyan-glow', image: '/img/locations/the_weep_hero.png' },
  { name: 'Stryker', role: 'Ash Raptor Bond', archetype: 'Guardian', color: 'text-amber-glow', image: '/img/characters/stryker_hero_alt1.PNG' },
  { name: 'Shadehound Handler', role: 'Caravan Peace-Sign', archetype: 'Witness', color: 'text-violet-glow', image: '/img/characters/jairo_hero.png' },
  { name: 'Triumvirate Ledger', role: 'Ledger Sovereign', archetype: 'Regime', color: 'text-amber-glow', image: '/img/characters/jairo_hero2.PNG' },
  { name: 'Ravel’s Map', role: 'Bad Ideas, Good Timing', archetype: 'Guide', color: 'text-cyan-glow', image: '/img/locations/archive_hero.PNG' }
];

export default function CharacterCarousel({ characters }) {
  const [bondedChar, setBondedChar] = useState(null);
  const roster = useMemo(() => (characters && characters.length ? characters : cambrianNine), [characters]);

  const handleBond = (name) => {
    setBondedChar((prev) => (prev === name ? null : name));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('tethys:bond', { detail: { name } }));
    }
  };

  return (
    <div className="w-full overflow-hidden py-12 px-4">
      <motion.div
        drag="x"
        dragConstraints={{ left: -600, right: 0 }}
        className="flex gap-6 cursor-grab active:cursor-grabbing"
      >
        {roster.map((char) => (
          <motion.div 
            key={char.name} 
            className="artifact-card min-w-[260px] max-w-[320px] h-[420px] flex flex-col justify-between rounded-xl overflow-hidden border border-ancient-ink/30 bg-gradient-to-b from-[#0f0b09] via-[#14100e] to-[#0c0a09] shadow-[0_15px_35px_rgba(0,0,0,0.45)] group"
          >
            <div className="relative h-56 w-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={char.image}
                alt={`${char.name} portrait`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-3 left-4 z-20">
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-amber-300/70">
                  {char.archetype}
                </span>
                <h3 className={`text-3xl font-display mt-1 drop-shadow-lg ${char.color || 'text-stone-100'}`}>
                  {char.name}
                </h3>
              </div>
            </div>

            <div className="flex-1 flex flex-col px-4 pb-5 pt-4">
              <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-stone-400 text-center">{char.role}</p>
              {char.desc && (
                <p className="text-sm text-stone-400/90 mt-2 text-center px-2">{char.desc}</p>
              )}
              <button
                onClick={() => handleBond(char.name)}
                className="mt-auto w-full py-2.5 text-[10px] font-mono uppercase tracking-widest border border-ancient-ink/20 rounded-sm hover:bg-ancient-ink/10 transition-colors"
              >
                {bondedChar === char.name ? 'Bond Active' : 'Initiate Bond'}
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
