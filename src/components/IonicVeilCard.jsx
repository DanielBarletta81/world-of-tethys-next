'use client';

import { motion } from 'framer-motion';

export default function IonicVeilCard() {
  return (
    <div className="relative w-80 h-[450px] group cursor-pointer">
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute inset-0 z-20 backdrop-blur-md bg-white/5 border border-white/20 rounded-3xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-sync-glow/20 via-transparent to-transparent" />
        <motion.div
          animate={{ top: ['-10%', '110%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute left-0 right-0 h-[1px] bg-sync-glow shadow-[0_0_15px_#22d3ee]"
        />
      </motion.div>

      <div className="relative w-full h-full p-8 rounded-3xl bg-black/80 border border-white/10 flex flex-col justify-between">
        <header>
          <span className="text-[10px] font-mono text-sync-glow uppercase tracking-[0.4em]">Synergy: Stealth</span>
          <h3 className="text-3xl font-black italic text-white uppercase mt-2">Ionic Veil</h3>
        </header>

        <div className="relative flex justify-center items-center h-48">
          <motion.div animate={{ x: [-5, 5, -5], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 4, repeat: Infinity }} className="absolute text-6xl">
            ⚡
          </motion.div>
          <motion.div
            animate={{ x: [5, -5, 5], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
            className="absolute text-6xl"
          >
            ✨
          </motion.div>
        </div>

        <footer className="z-10">
          <div className="flex gap-2 mb-4">
            <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[8px] text-gray-400">SERIS</span>
            <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[8px] text-gray-400">ELDORA</span>
          </div>
          <p className="text-[10px] text-gray-500 font-mono leading-relaxed">
            “The eels provide the shield; the manta provides the shadow. We do not exist in their eyes.”
          </p>
        </footer>
      </div>
    </div>
  );
}
