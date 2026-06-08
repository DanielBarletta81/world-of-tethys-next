'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowDown, Activity, Radio } from 'lucide-react';
import cdn from '@/lib/cdn';

const ATLAS_MAP_BG = cdn('/img/map/tethys-atlas-clean.png');

export default function ArchiveLog({ context, activeSection, sectionMeta }) {
  const depth = sectionMeta?.depth ?? context?.startDepth;
  const pressure = sectionMeta?.pressure ?? 'Normal';
  const location = sectionMeta?.location ?? context?.region;

  return (
    <div className="space-y-6 opacity-80 hover:opacity-100 transition-opacity">
      <div className="p-1 rounded-2xl bg-gradient-to-b from-stone-800 to-stone-900 border border-stone-800 shadow-xl">
        <div className="relative h-48 rounded-xl bg-black overflow-hidden group">
          <div className="absolute inset-0 bg-cover bg-center opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700" style={{ backgroundImage: `url(${ATLAS_MAP_BG})` }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              key={location}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              <div className="w-3 h-3 bg-amber-500 rounded-full shadow-[0_0_15px_#f59e0b]" />
              <div className="absolute -inset-2 border border-amber-500/50 rounded-full animate-ping" />
            </motion.div>
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 text-[10px] text-amber-500 font-mono uppercase tracking-widest mb-1">
              <MapPin size={12} />
              Sector Scan
            </div>
            <div className="text-white font-display tracking-wide">{location}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-[10px] text-stone-500 font-mono uppercase tracking-widest mb-2">
            <ArrowDown size={12} /> Elevation
          </div>
          <div className="text-2xl font-mono text-stone-200">
            {depth}
            <span className="text-sm text-stone-600 ml-1">m</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-[10px] text-stone-500 font-mono uppercase tracking-widest mb-2">
            <Activity size={12} /> Pressure
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={pressure}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className={`text-lg font-sans font-bold ${
                pressure === 'Critical' ? 'text-red-500' : 'text-emerald-400'
              }`}
            >
              {pressure}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="p-5 rounded-xl border border-dashed border-stone-700 bg-stone-900/20">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[9px] uppercase tracking-[0.2em] text-stone-500 font-mono">
            Active Bond
          </span>
          <Radio size={14} className="text-stone-600 animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-xl">
            👤
          </div>
          <div>
            <div className="text-sm text-stone-200 font-bold">{context?.characterPair}</div>
            <div className="text-[10px] text-stone-500">Resonance: Stable</div>
          </div>
        </div>
      </div>
    </div>
  );
}
