'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useTethys } from '@/context/TethysContext';

export default function TeslaNode() {
  const { syncFrequency } = useTethys();
  const resonanceGap = Math.abs(528 - syncFrequency);
  const isDissonant = resonanceGap > 50;

  return (
    <div className="relative flex items-center justify-center w-[320px] h-[320px] md:w-[400px] md:h-[400px]">
      <motion.div
        animate={{
          scale: isDissonant ? [1, 1.1, 1] : [1, 1.05, 1],
          boxShadow: isDissonant ? '0 0 40px rgba(239,68,68,0.6)' : '0 0 60px rgba(34,211,238,0.4)'
        }}
        transition={{ duration: isDissonant ? 0.2 : 2, repeat: Infinity }}
        className={`w-10 h-10 md:w-12 md:h-12 rounded-full z-20 ${isDissonant ? 'bg-dissonant-red' : 'bg-sync-glow'}`}
      />

      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            rotate: 360,
            borderRadius: isDissonant ? ['30% 70% 70% 30%', '70% 30% 30% 70%', '30% 70% 70% 30%'] : ['50%', '48% 52% 50% 50%', '50%'],
            scale: [1, 1.3 + i * 0.18, 1]
          }}
          transition={{
            duration: (10 / (i + 1)) * (isDissonant ? 0.5 : 1),
            repeat: Infinity,
            ease: 'linear'
          }}
          className={`absolute border pointer-events-none opacity-30 ${isDissonant ? 'border-dissonant-red/70' : 'border-sync-violet/70'}`}
          style={{
            width: `${(i + 1) * 90}px`,
            height: `${(i + 1) * 90}px`
          }}
        />
      ))}

      <AnimatePresence>
        {!isDissonant && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.2, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-0 bg-[radial-gradient(circle,rgba(34,211,238,0.2)_0%,transparent_70%)]"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
