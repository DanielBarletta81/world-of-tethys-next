'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SEQUENCE_STEPS = [
  { text: 'Descent Confirmed', sub: 'Ash corridor stable. Brace.' },
  { text: 'Root Signal Found', sub: 'Ravel hum detected at 43.7 Hz' },
  { text: 'Seal Opened', sub: 'Welcome to Tethys. Watch your footing.' }
];

export default function LandingSequence({ onComplete }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step < SEQUENCE_STEPS.length) {
      const timer = setTimeout(() => setStep((prev) => prev + 1), 900);
      return () => clearTimeout(timer);
    }
    const finishTimer = setTimeout(() => onComplete?.(), 400);
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
          <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0f0c09] to-black" />
          <motion.div
            className="absolute inset-0 opacity-30 pointer-events-none"
            animate={{ background: ['radial-gradient(circle at 50% 40%, rgba(255,125,40,0.08), transparent 45%)', 'radial-gradient(circle at 55% 45%, rgba(59,130,246,0.08), transparent 45%)', 'radial-gradient(circle at 50% 40%, rgba(255,125,40,0.08), transparent 45%)'] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />

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
