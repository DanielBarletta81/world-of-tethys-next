'use client';

import { motion } from 'framer-motion';

const cambrianNine = [
  { name: 'Bol', role: 'The Muralist', archetype: 'Witness', color: 'text-sync-violet' },
  { name: 'Rosa-Lyn', role: 'The Engineer', archetype: 'Architect', color: 'text-sync-glow' },
  { name: 'Melden', role: 'The Geneticist', archetype: 'Archivist', color: 'text-ancient-gold' },
  { name: 'Kith Weaver', role: 'Mycelial Oracle', archetype: 'Symbiote', color: 'text-ancient-teal' },
  { name: 'Orrix', role: 'Sky Cartographer', archetype: 'Navigator', color: 'text-ancient-accent' }
];

export default function CharacterCarousel() {
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
              <img src="/vercel.svg" alt={`${char.name} sigil`} className="w-20 h-20" />
            </div>
            <div className="border-t border-ancient-ink/20 pt-3 text-center">
              <p className="text-[11px] font-mono uppercase tracking-[0.3em]">{char.role}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
