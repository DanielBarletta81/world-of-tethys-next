'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

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

export default function CharacterCarousel() {
  const [bondedChar, setBondedChar] = useState(null);

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
        {cambrianNine.map((char) => (
          <motion.div key={char.name} className="artifact-card min-w-[260px] max-w-[300px] h-[380px] flex flex-col justify-between">
            <div className="border-b border-ancient-ink/20 pb-3">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-ancient-ink/60">{char.archetype}</span>
              <h3 className={`text-3xl font-display mt-2 ${char.color}`}>{char.name}</h3>
            </div>
            <div className="flex-grow flex items-center justify-center grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={char.image} alt={`${char.name} portrait`} className="w-36 h-36 object-cover rounded-md border border-ancient-ink/30 shadow-lg" />
            </div>
            <div className="border-t border-ancient-ink/20 pt-3 text-center">
              <p className="text-[11px] font-mono uppercase tracking-[0.3em]">{char.role}</p>
              <button
                onClick={() => handleBond(char.name)}
                className="mt-4 w-full py-2 text-[10px] font-mono uppercase tracking-widest border-t border-ancient-ink/10 hover:bg-ancient-ink/5 transition-colors"
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
