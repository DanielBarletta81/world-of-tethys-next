'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Bookmark, Skull, Stamp } from 'lucide-react';
import useSoundFX from '@/app/hooks/useSoundFX';
import Image from 'next/image';
import cdn from '@/lib/cdn';

export default function FieldNotebook({ bestiary = [] }) {
  const [activeEraIdx, setActiveEraIdx] = useState(0);
  const [activeEntryIdx, setActiveEntryIdx] = useState(0);
  const [direction, setDirection] = useState(0);
  const { playClick } = useSoundFX();

  const activeEra = bestiary[activeEraIdx] || { entries: [] };
  const activeEntry = activeEra.entries[activeEntryIdx];

  const changeEra = (idx) => {
    if (idx === activeEraIdx) return;
    playClick?.();
    setDirection(idx > activeEraIdx ? 1 : -1);
    setActiveEraIdx(idx);
    setActiveEntryIdx(0);
  };

  const changePage = (newIdx) => {
    if (newIdx < 0 || newIdx >= activeEra.entries.length) return;
    playClick?.();
    setDirection(newIdx > activeEntryIdx ? 1 : -1);
    setActiveEntryIdx(newIdx);
  };

  if (!activeEntry) {
    return (
      <div className="border border-stone-800 rounded-xl p-6 text-stone-500">
        No field notes available.
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-6xl mx-auto aspect-[16/10] md:aspect-[2/1] bg-[#e3dcd2] rounded-r-2xl rounded-l-md shadow-2xl flex flex-col md:flex-row overflow-hidden border-r-8 border-b-8 border-[#2a231d]">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-60" />
        <div className="absolute top-10 right-20 w-32 h-32 bg-[#8c735a] rounded-full opacity-10 blur-xl mix-blend-multiply" />
        <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-16 -translate-x-1/2 bg-gradient-to-r from-transparent via-[#b5a693]/40 to-transparent" />
      </div>

      <div className="absolute -left-12 top-12 flex flex-col gap-2 z-20">
        {bestiary.map((era, i) => (
          <button
            key={era.era}
            onClick={() => changeEra(i)}
            className={`group relative pl-14 pr-4 py-2 text-left transition-all duration-300 ${activeEraIdx === i ? 'translate-x-4' : 'hover:translate-x-2'}`}
          >
            <div className={`absolute inset-0 skew-x-12 rounded-r-md border border-[#5c4f43] shadow-md ${activeEraIdx === i ? 'bg-[#8a3c23]' : 'bg-[#2a231d]'}`} />
            <span className={`relative z-10 text-[10px] font-mono uppercase tracking-widest ${activeEraIdx === i ? 'text-[#e3dcd2]' : 'text-[#8c735a]'}`}>
              {era.era}
            </span>
          </button>
        ))}
      </div>

      <div className="relative z-10 flex-1 flex flex-col md:flex-row p-8 md:p-12 gap-12 items-center">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={`${activeEraIdx}-${activeEntryIdx}`}
            custom={direction}
            initial={{ opacity: 0, x: direction * 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -50 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="w-full h-full flex flex-col md:flex-row gap-12"
          >
            <div className="flex-1 flex flex-col justify-center relative">
              <div className="relative bg-white p-3 shadow-lg rotate-[-2deg] border border-[#d6cfc2]">
                <div className="aspect-square relative overflow-hidden grayscale contrast-125 sepia-[0.3]">
                  {activeEntry.image ? (
                    <Image src={activeEntry.image} alt={activeEntry.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#2a231d] flex items-center justify-center text-[#5c4f43]">
                      <Skull size={48} />
                    </div>
                  )}
                  <div
                    className="absolute inset-0 opacity-30 mix-blend-overlay"
                    style={{ backgroundImage: `url(${cdn('/noise.svg')})` }}
                  />
                </div>
                <div className="pt-4 pb-2 text-center">
                  <p className="font-hand text-2xl text-[#2a231d]">{activeEntry.name}</p>
                </div>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-[#e3dcd2]/80 backdrop-blur-sm rotate-2 shadow-sm border-l border-r border-white/50" />
              </div>

              <div className="absolute bottom-0 right-0 opacity-60 rotate-[-15deg] mix-blend-multiply">
                <div className="border-4 border-[#8a3c23] rounded-full p-2 w-24 h-24 flex flex-col items-center justify-center text-[#8a3c23]">
                  <Stamp size={24} />
                  <span className="text-[8px] font-mono uppercase tracking-widest mt-1">Verified</span>
                  <span className="text-[10px] font-bold">111 MYA</span>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col font-serif text-[#2a231d] space-y-6">
              <div className="border-b-2 border-[#b5a693]/50 pb-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#8c735a]">
                    Subject {activeEntryIdx + 1}/{activeEra.entries.length}
                  </span>
                  <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#8a3c23]">
                    {activeEntry.tag}
                  </span>
                </div>
                <h2 className="text-4xl font-bold mt-2 text-[#1a1510]">{activeEntry.name}</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-mono text-[10px] uppercase tracking-widest text-[#8c735a] mb-1">Ecological Niche</h4>
                  <p className="font-hand text-2xl leading-relaxed text-[#2a231d] -rotate-1 origin-left">
                    "{activeEntry.niche}"
                  </p>
                </div>

                <div className="bg-[#d6cfc2]/30 p-4 rounded border border-[#b5a693]/30">
                  <h4 className="font-mono text-[10px] uppercase tracking-widest text-[#5c4f43] mb-2 flex items-center gap-2">
                    <Bookmark size={12} /> Scientific Archive
                  </h4>
                  <p className="text-sm italic leading-relaxed opacity-90">
                    {activeEntry.science}
                  </p>
                </div>
              </div>

              <div className="mt-auto flex justify-between items-center pt-8">
                <button
                  onClick={() => changePage(activeEntryIdx - 1)}
                  disabled={activeEntryIdx === 0}
                  className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#8c735a] hover:text-[#8a3c23] disabled:opacity-30 transition-colors"
                >
                  <ChevronLeft size={16} /> Prev
                </button>

                <span className="font-hand text-xl text-[#b5a693]">
                  - {activeEraIdx + 1}.{activeEntryIdx + 1} -
                </span>

                <button
                  onClick={() => changePage(activeEntryIdx + 1)}
                  disabled={activeEntryIdx === activeEra.entries.length - 1}
                  className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#8c735a] hover:text-[#8a3c23] disabled:opacity-30 transition-colors"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <style jsx>{`
        :global(.font-hand) {
          font-family: var(--font-hand), 'Nanum Pen Script', cursive;
        }
      `}</style>
    </div>
  );
}
