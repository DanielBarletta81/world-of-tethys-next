'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SEQUENCE_STEPS = [
  { text: 'Judicial Exile: Initiated', sub: 'Watcher Volcano /// Ashfall Heavy' },
  { text: 'Approaching The Weep', sub: 'Velocity: Terminal' },
  { text: 'Clearing Basalt Stakes', sub: 'Deploying Vitrified Staff...' },
  { text: 'Impact: Leidenfrost Cushion', sub: 'Welcome to the Bone-Rookery' }
];

export default function LandingSequence({ onComplete }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step < SEQUENCE_STEPS.length) {
      const timer = setTimeout(() => setStep((prev) => prev + 1), 1200);
      return () => clearTimeout(timer);
    }
    const finishTimer = setTimeout(() => onComplete?.(), 800);
    return () => clearTimeout(finishTimer);
  }, [step, onComplete]);

  return (
    <AnimatePresence>
      {step <= SEQUENCE_STEPS.length && (
        <motion.div
          key="landing"
          className="fixed inset-0 z-[9999] bg-[#0a0806] flex flex-col items-center justify-center font-display overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.5, ease: 'circIn' } }}
        >
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage: `url('/watcher-ashfall.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'sepia(0.5) contrast(1.2)'
            }}
            animate={{ backgroundPosition: ['50% 50%', '50% 48%', '50% 50%'], opacity: [0.35, 0.5, 0.35] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.div
            className="absolute inset-0 flex items-end justify-between px-10 opacity-30"
            initial={{ y: 200 }}
            animate={{ y: step > 1 ? -100 : 200 }}
            transition={{ duration: 2, ease: 'anticipate' }}
          >
            <div className="w-24 h-96 bg-ancient-ink clip-path-pyramid" />
            <div className="w-32 h-64 bg-ancient-ink clip-path-pyramid" />
            <div className="w-16 h-80 bg-ancient-ink clip-path-pyramid" />
          </motion.div>

          <AnimatePresence mode="wait">
            {step < SEQUENCE_STEPS.length && (
              <motion.div
                key={step}
                initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
                transition={{ duration: 0.5 }}
                className="relative z-10 text-center space-y-4"
              >
                <h1 className="text-4xl md:text-6xl text-ancient-gold tracking-[0.2em] uppercase">
                  {SEQUENCE_STEPS[step].text}
                </h1>
                <div className="h-[1px] w-12 bg-ancient-accent mx-auto" />
                <p className="text-sm md:text-base text-ancient-accent font-mono tracking-[0.4em] uppercase">
                  {SEQUENCE_STEPS[step].sub}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {step === 3 && (
            <motion.div
              className="absolute inset-0 bg-white mix-blend-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0] }}
              transition={{ duration: 0.2, repeat: 1 }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
