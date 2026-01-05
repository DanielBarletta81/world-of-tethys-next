// src/components/LandingSequence.jsx
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSoundFX from '@/app/hooks/useSoundFX'; // Import the audio hook

const SEQUENCE_STEPS = [
  { text: 'Descent Confirmed', sub: 'Ash corridor stable. Brace.' },
  { text: 'Root Signal Found', sub: 'Ravel hum detected at 43.7 Hz' },
  { text: 'Seal Opened', sub: 'Welcome to Tethys. Watch your footing.' }
];

export default function LandingSequence({ onComplete }) {
  const [step, setStep] = useState(0);
  //const { playDrone, playHorns, playLogoHit, playTextGlitch } = useSoundFX();

  // 1. Start the Ominous Drone immediately
 // useEffect(() => {
   //// playDrone();
//  }, []);

  // 2. Step Sequencer
  useEffect(() => {
    // Play subtle text glitch on every new step
   // if (step < SEQUENCE_STEPS.length) {


    // SPECIAL FX TRIGGERS
    if (step === 1) {
      // Step 1 (Root Signal): Maybe a low pulse?
    }
    
    if (step === 2) {
      // Step 2 (Seal Opened): Queue the War Horns
      // We play them slightly before the text fully settles for dramatic effect
   //   setTimeout(() => playHorns(), 500); 
    }

    if (step < SEQUENCE_STEPS.length) {
      const timer = setTimeout(() => setStep((prev) => prev + 1), 2500); // 2.5s pacing
      return () => clearTimeout(timer);
    }
    
    // SEQUENCE FINISHED -> TRIGGER HERO LANDING
    const finishTimer = setTimeout(() => {
    //  playLogoHit(); // <--- THE BIG BOOM (Audio Logo)
      onComplete?.();
    }, 1000);
    
    return () => clearTimeout(finishTimer);
  }, [step, onComplete]);

  return (
    <AnimatePresence>
      {step <= SEQUENCE_STEPS.length && (
        <motion.div
          key="landing"
          className="fixed inset-0 z-[9999] bg-[#0a0806] flex flex-col items-center justify-center font-display overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 2.0, ease: 'easeInOut' } }} // Slower fade out to let the Boom resonate
        >
          {/* Pulsing Background for the Drone */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-black via-[#1a0f0a] to-black"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          
          <AnimatePresence mode="wait">
            {step < SEQUENCE_STEPS.length && (
              <motion.div
                key={step}
                initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
                transition={{ duration: 1.2 }}
                className="relative z-10 text-center space-y-6"
              >
                <h1 className="text-4xl md:text-6xl tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-b from-orange-100 to-red-900 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                  {SEQUENCE_STEPS[step].text}
                </h1>
                
                <div className="h-[1px] w-24 bg-orange-700/50 mx-auto" />
                
                <p className="text-sm md:text-base text-stone-500 font-mono tracking-[0.4em] uppercase">
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