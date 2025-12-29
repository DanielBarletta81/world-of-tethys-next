'use client';

import { motion } from 'framer-motion';
import { useTethys } from '@/context/TethysContext';

export default function NutePulse() {
  const { oilLevel, isNuteRoaring } = useTethys();
  const pulseColor = isNuteRoaring ? 'rgba(239,68,68,0.4)' : 'rgba(16,185,129,0.35)';

  return (
    <div className="relative w-full max-w-sm mx-auto p-6 bg-black/40 border border-nute-emerald/30 rounded-[2rem]">
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(16,185,129,0.08),transparent_70%)] pointer-events-none" />

      <div className="flex flex-col items-center gap-4">
        <motion.div
          animate={{ scale: [1, 1.07, 1], filter: ['blur(0px)', 'blur(1px)', 'blur(0px)'] }}
          transition={{ duration: isNuteRoaring ? 0.8 : 2.4, repeat: Infinity }}
          className="w-28 h-28 rounded-full border-4 border-dashed border-nute-emerald/80 flex items-center justify-center"
          style={{ boxShadow: `0 0 20px ${pulseColor}` }}
        >
          <span className="text-3xl font-black text-nute-emerald">{oilLevel}</span>
          <span className="text-xs text-gray-400 ml-1">%</span>
        </motion.div>

        <div className="text-center">
          <h3 className="text-nute-emerald font-mono text-[10px] tracking-[0.4em] uppercase">Nute Pulse</h3>
          <p className="text-gray-500 text-xs mt-1 italic">{isNuteRoaring ? 'CAVITATION DETECTED' : 'HEART RATE STABLE'}</p>
        </div>

        <div className="w-full h-1 bg-gray-900 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${oilLevel}%` }}
            transition={{ duration: 1.4 }}
            className="h-full bg-gradient-to-r from-dissonant-red via-sync-glow to-nute-emerald shadow-[0_0_15px_rgba(16,185,129,0.6)]"
          />
        </div>
      </div>
    </div>
  );
}
