// src/components/LandingSequence.jsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FastForward } from 'lucide-react';
import useSoundFX from '@/app/hooks/useSoundFX'; 

// SEQUENCE CONFIGURATION
// add a 'flashType' to specific steps to trigger visual jolts
const SEQUENCE_STEPS = [
  { 
    text: 'Only if...', 
    sub: 'The Roots Remember',
    duration: 3000,
    flashType: null 
  },
  { 
    text: 'Root Signal Found', 
    sub: 'Ravel hum detected at 43.7 Hz', 
    duration: 3500,
    flashType: 'signal' // Will flash a waveform/static color
  },
  { 
    text: 'Seal Opened', 
    sub: 'Welcome to Tethys. War Horns Detected', 
    duration: 5000,
    flashType: 'seal' // Will flash coin image
  }
];

export default function LandingSequence({ onComplete }) {
  const [step, setStep] = useState(0);
  const [showFlash, setShowFlash] = useState(false);
  
  // We keep a ref to the drone audio so we can fade it out manually
  const droneRef = useRef(null);
  
  const { playDrone, playHorns, playLogoHit, playTextGlitch } = useSoundFX();

  const handleSkip = (e) => {
    e.stopPropagation(); // Prevent clicking through
    
    // 1. Fade out audio immediately
    if (droneRef.current) {
      const fadeOut = setInterval(() => {
        if (droneRef.current.volume > 0.1) {
          droneRef.current.volume -= 0.1;
        } else {
          droneRef.current.pause();
          clearInterval(fadeOut);
        }
      }, 50);
    }
    
    //  End sequence
    onComplete();
  };

  // 1. START THE DRONE (With Ref Capture)
  useEffect(() => {
    // We assume playDrone returns the Audio object (update useSoundFX if needed)
    // If useSoundFX is fire-and-forget, this ref logic is a "Nice to Have"
    const audioInstance = playDrone(); 
    if (audioInstance) {
      droneRef.current = audioInstance;
    }
    
    // Cleanup: Stop sound if component unmounts abruptly
    return () => {
      if (droneRef.current) {
        droneRef.current.pause();
        droneRef.current.currentTime = 0;
      }
    };
  }, [playDrone]);

  // 2. THE SEQUENCE ENGINE
  useEffect(() => {
    // -- END OF SEQUENCE --
    if (step >= SEQUENCE_STEPS.length) {
      playLogoHit(); // The Big Boom
      
      // FADE OUT DRONE (The "Safety Net")
      if (droneRef.current) {
        const fadeOut = setInterval(() => {
          if (droneRef.current.volume > 0.05) {
            droneRef.current.volume -= 0.05;
          } else {
            droneRef.current.pause();
            clearInterval(fadeOut);
          }
        }, 100); // Lowers volume every 100ms
      }

      // Wait 1.5s for the Boom to hit, then tell Parent we are done
      const finishTimer = setTimeout(() => onComplete?.(), 1500);
      return () => clearTimeout(finishTimer);
    }

    // -- ACTIVE STEP --
    const currentConfig = SEQUENCE_STEPS[step];

    // Audio Cues
    playTextGlitch(); 
    if (step === 2) { 
      // Play Horns slightly delayed (200ms) so they hit *after* text appears
      setTimeout(() => playHorns(), 200); 
    }

    // Visual Flashes
    if (currentConfig.flashType) {
      setShowFlash(true);
      setTimeout(() => setShowFlash(false), 150); // Flash duration
    }

    // Timer to Next Step
    const timer = setTimeout(() => {
      setStep((prev) => prev + 1);
    }, currentConfig.duration);

    return () => clearTimeout(timer);
  }, [step, onComplete, playHorns, playLogoHit, playTextGlitch]);

  return (
    <AnimatePresence>
      {step < SEQUENCE_STEPS.length + 1 && (
        <motion.div
          key="landing-container"
          className="fixed inset-0 z-[9999] bg-[#050403] flex flex-col items-center justify-center font-serif overflow-hidden cursor-none"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 2.0, ease: "easeInOut" } }}
        >
          {/* Background Pulse */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-black via-[#1a0f0a] to-black"
            animate={{ opacity: [0.6, 0.8, 0.6] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none" />

          {/* Flash Overlay */}
          <AnimatePresence>
            {showFlash && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                className="absolute inset-0 z-20 flex items-center justify-center bg-orange-900/30 mix-blend-color-dodge"
              >
                {SEQUENCE_STEPS[step]?.flashType === 'seal' && (
                  <div className="relative w-96 h-96 opacity-50 scale-150 blur-sm">
                     <Image src="/img/tethys-seal.jpg" alt="Seal" fill className="object-contain" />
                  </div>
                )}
                {SEQUENCE_STEPS[step]?.flashType === 'signal' && (
                  <div className="w-full h-2 bg-white/50 blur-md" />
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* NEW: THE SKIP BUTTON */}
          <button 
            onClick={handleSkip}
            className="absolute bottom-8 right-8 z-50 text-stone-600 hover:text-orange-500 transition-colors flex items-center gap-2 text-[10px] uppercase tracking-widest font-mono group"
          >
            <span>Skip Sequence</span>
            <FastForward size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Text Layer */}
          <AnimatePresence mode="wait">
            {step < SEQUENCE_STEPS.length && (
              <motion.div
                key={step}
                initial={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="relative z-10 text-center space-y-8 max-w-4xl px-6"
              >
                <h1 className="text-4xl md:text-7xl font-light tracking-[0.25em] uppercase text-transparent bg-clip-text bg-gradient-to-b from-[#e7e5e4] to-[#78716c] drop-shadow-2xl">
                  {SEQUENCE_STEPS[step].text}
                </h1>
                <div className="h-[1px] w-24 bg-orange-700/60 mx-auto shadow-[0_0_10px_#ea580c]" />
                <p className="text-xs md:text-sm text-orange-900/80 font-mono tracking-[0.5em] uppercase">
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