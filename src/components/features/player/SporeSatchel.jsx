'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Activity, Beaker } from 'lucide-react';
import { useMemo } from 'react';
import { useTethys } from '@/context/TethysContext';

const BIO_KEYWORDS = ['spore', 'fungus', 'mycelium', 'resin', 'moss', 'algae', 'kelp', 'puff', 'choir'];
const BIO_TYPES = new Set(['spore', 'fungus', 'mycelium', 'resin', 'botanical']);

function isBioItem(item) {
  const id = (item?.id || '').toString().toLowerCase();
  const name = (item?.name || '').toString().toLowerCase();
  const type = (item?.type || '').toString().toLowerCase();
  return BIO_TYPES.has(type) || BIO_KEYWORDS.some((kw) => id.includes(kw) || name.includes(kw) || type.includes(kw));
}

export default function SporeSatchel({ isOpen, onClose }) {
  const { inventory = [] } = useTethys();
  const bioItems = useMemo(() => inventory.filter(isBioItem), [inventory]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="fixed right-0 top-0 h-full w-80 bg-[#0a0a05] border-l border-[#10b981]/30 z-[100] p-6 shadow-2xl"
        >
          <div className="flex justify-between items-center mb-8 border-b border-[#10b981]/20 pb-4">
            <h2 className="text-[#10b981] font-mono text-xs uppercase tracking-widest flex items-center gap-2">
              <Activity size={14} /> Myco-Inventory
            </h2>
            <button onClick={onClose} className="text-stone-500 hover:text-white">✕</button>
          </div>

          <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-180px)] pr-2">
            {bioItems.length > 0 ? (
              bioItems.map((item, i) => (
                <div
                  key={`${item.id || item.name || 'bio'}-${i}`}
                  className="p-3 bg-[#110f0e] border border-stone-800 rounded group hover:border-[#10b981]/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-stone-200 font-bold text-sm">
                      {item.name || item.id || 'Unknown Culture'}
                    </span>
                    <Beaker size={12} className="text-[#10b981] opacity-50" />
                  </div>
                  <p className="text-[10px] text-stone-500 italic mb-2 line-clamp-2">
                    {item.lore || 'A product of the Great Decomposition.'}
                  </p>
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 bg-[#10b981]/10 text-[#10b981] text-[8px] uppercase border border-[#10b981]/20">
                      {item.rarity || 'common'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-stone-700 text-[10px] uppercase tracking-widest">
                No active cultures detected
              </div>
            )}
          </div>

          <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#10b981]/5 border border-[#10b981]/20 rounded-sm">
            <p className="text-[9px] text-[#10b981] uppercase mb-2 font-bold">Protocol: Rite of Suture</p>
            <p className="text-[10px] text-stone-400 leading-relaxed">
              Use Lyco-Spore coagulants to re-tune resonance in fractured bodies.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
// World of Tethys || D.C. Barletta
