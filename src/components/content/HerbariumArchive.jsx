'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Leaf, Info, Shield, Beaker } from 'lucide-react';
import { HERBARIUM_REGISTRY } from '@/data/herbarium-registry';
import { cdn } from '@/lib/cdn';

export default function HerbariumArchive() {
  const keys = Object.keys(HERBARIUM_REGISTRY);
  const [selectedId, setSelectedId] = useState(keys[0]);
  const activePlant = HERBARIUM_REGISTRY[selectedId];

  const background = activePlant?.background || cdn('/img/bg/mystical-view.png');

  return (
    <div className="relative flex flex-col lg:flex-row gap-8 bg-[#050403] border border-stone-800 p-8 rounded-sm font-serif overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-cover bg-center opacity-[0.15]" style={{ backgroundImage: `url(${background})` }} />
        <div className="absolute inset-0 mix-blend-overlay" style={{ backgroundImage: `url(${cdn('/noise.svg')})`, opacity: 'var(--tethys-noise-opacity, 0.1)' }} />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.06), transparent 60%)', opacity: 'var(--tethys-fog-opacity, 0.14)' }} />
      </div>
      <aside className="w-full lg:w-64 space-y-2">
        <h3 className="text-[10px] uppercase tracking-[0.4em] text-stone-500 mb-6 font-mono">
          Botanical Index // 111-Ma
        </h3>
        {Object.entries(HERBARIUM_REGISTRY).map(([key, plant]) => (
          <button
            key={key}
            type="button"
            onClick={() => setSelectedId(key)}
            className={`w-full text-left p-4 border transition-all flex items-center justify-between group ${
              selectedId === key
                ? 'bg-emerald-950/20 border-emerald-500/50 text-emerald-400'
                : 'border-stone-900 text-stone-600 hover:border-stone-700'
            }`}
          >
            <span className="text-xs uppercase tracking-widest">{plant.name}</span>
            <Leaf size={14} className={selectedId === key ? 'opacity-100' : 'opacity-0 group-hover:opacity-30'} />
          </button>
        ))}
      </aside>

      <main className="flex-1 space-y-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            <header className="border-b border-stone-800 pb-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[9px] font-mono text-emerald-600 mb-1">{activePlant.id}</p>
                  <h2 className="text-3xl md:text-4xl font-display text-stone-100 uppercase tracking-tight italic">
                    {activePlant.name}
                  </h2>
                  <p className="text-sm text-stone-500 mt-2">Lineage: {activePlant.lineage}</p>
                  <p className="text-xs text-stone-600 mt-1">Era: {activePlant.era}</p>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                  <span className="text-[8px] text-emerald-500 font-bold uppercase tracking-widest">Observed</span>
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-black/40 border border-stone-800 rounded-sm">
                <Shield size={16} className="text-emerald-600 mb-3" />
                <h4 className="text-[10px] text-stone-400 uppercase tracking-widest mb-2 font-bold">Survival Role</h4>
                <p className="text-xs text-stone-300 leading-relaxed italic">
                  "{activePlant.survivalRole}"
                </p>
              </div>
              <div className="p-4 bg-black/40 border border-stone-800 rounded-sm">
                <Beaker size={16} className="text-cyan-600 mb-3" />
                <h4 className="text-[10px] text-stone-400 uppercase tracking-widest mb-2 font-bold">Core Material</h4>
                <p className="text-xs text-stone-300 font-mono">{activePlant.material}</p>
              </div>
              <div className="p-4 bg-black/40 border border-stone-800 rounded-sm">
                <Info size={16} className="text-amber-600 mb-3" />
                <h4 className="text-[10px] text-stone-400 uppercase tracking-widest mb-2 font-bold">Environmental Status</h4>
                <p className="text-xs text-stone-300">Stable // High CO2 adaptive</p>
              </div>
            </div>

            <section className="bg-emerald-950/5 border-l-2 border-emerald-900/40 p-6">
              <h4 className="text-[10px] text-emerald-700 uppercase tracking-[0.3em] mb-3 font-bold">
                Archive Metadata
              </h4>
              <p className="text-stone-400 text-sm leading-relaxed">
                {activePlant.lore}
              </p>
              {activePlant.bio ? (
                <p className="mt-3 text-xs italic text-emerald-200/80">
                  "{activePlant.bio}"
                </p>
              ) : null}
            </section>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
// World of Tethys || D.C. Barletta
