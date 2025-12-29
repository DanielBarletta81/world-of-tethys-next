'use client';

import { motion } from 'framer-motion';

export default function MythicCard({ entity }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative w-80 h-[450px] rounded-[3rem] border-2 border-white/30 bg-transparent flex items-center justify-center overflow-hidden group"
    >
      <div className="absolute inset-0 bg-white mix-blend-exclusion pointer-events-none" />

      <div className="z-10 text-center p-8 space-y-6">
        <span className="text-[10px] font-mono text-black uppercase tracking-[0.6em]">Era: Pre-Flash</span>
        <h3 className="text-4xl font-thin text-black uppercase tracking-tight">{entity?.name || 'Mythic Entity'}</h3>
        <div className="text-6xl text-black opacity-80">{entity?.symbol || '∞'}</div>
        <p className="text-[10px] text-black font-mono leading-relaxed italic">“{entity?.trait || 'Origin trait pending'}”</p>
      </div>

      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 40 - 20, 0],
            opacity: [0, 1, 0]
          }}
          transition={{ duration: Math.random() * 5 + 2, repeat: Infinity }}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
        />
      ))}
    </motion.div>
  );
}
