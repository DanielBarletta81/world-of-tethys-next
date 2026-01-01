'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function PteroIntro({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // The sequence lasts 3.5 seconds, then we dismiss it
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 1000); // Tell parent we are done fading out
    }, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center overflow-hidden"
          exit={{ opacity: 0, transition: { duration: 1.5 } }} // Slow fade out
        >
          {/* 1. Background Atmosphere (Fog) */}
          <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 animate-pulse"></div>

          {/* 2. THE PTERO FLOCK (Silhouettes flying past) */}
          {/* Ptero 1: Large, close, fast */}
          <motion.img
            src="/img/ptero-silhouette.png" // Make sure this exists, or use a placeholder shape
            alt="Ptero"
            className="absolute w-96 opacity-10 blur-sm top-1/3"
            initial={{ x: '-20vw', y: 50, scale: 1.5 }}
            animate={{ x: '120vw', y: -100 }}
            transition={{ duration: 3, ease: "easeInOut", delay: 0.2 }}
          />

          {/* Ptero 2: Small, distant, flock */}
          <motion.img
            src="/img/ptero-silhouette.png"
            className="absolute w-32 opacity-30 top-1/4"
            initial={{ x: '-10vw', rotate: 10 }}
            animate={{ x: '110vw' }}
            transition={{ duration: 4, ease: "linear", delay: 0.5 }}
          />

          {/* 3. Initial Title Pulse */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ duration: 2 }}
            className="relative z-10 text-center"
          >
            <h1 className="text-4xl md:text-6xl font-serif text-stone-100 tracking-widest drop-shadow-2xl">
              ENTERING TETHYS
            </h1>
            <div className="mt-4 h-0.5 w-24 mx-auto bg-amber-500 shadow-[0_0_15px_#f59e0b] animate-pulse"></div>
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}