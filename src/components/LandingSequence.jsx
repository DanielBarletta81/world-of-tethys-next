// src/components/LandingSequence.jsx
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
    // 1. If we are still stepping through the text array...
    if (step < SEQUENCE_STEPS.length) {
      // SLOWED DOWN: 2000ms (2 seconds) per step instead of 900ms
      const timer = setTimeout(() => setStep((prev) => prev + 1), 2000);
      return () => clearTimeout(timer);
    }
    
    // 2. Once steps are done, wait a moment before unmounting
    const finishTimer = setTimeout(() => onComplete?.(), 1000);
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
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0f0c09] to-black" />
          
          {/* Text Container */}
          <AnimatePresence mode="wait">
            {step < SEQUENCE_STEPS.length && (
              <motion.div
                key={step}
                initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
                transition={{ duration: 1.0 }} // Slower fade in/out
                className="relative z-10 text-center space-y-6"
              >
                <h1 className="text-4xl md:text-6xl text-ancient-gold tracking-[0.2em] uppercase text-forge-orange">
                  {SEQUENCE_STEPS[step].text}
                </h1>
                <div className="h-[1px] w-24 bg-ancient-accent mx-auto opacity-50" />
                <p className="text-sm md:text-base text-stone-400 font-mono tracking-[0.4em] uppercase">
                  {SEQUENCE_STEPS[step].sub}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}