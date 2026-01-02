'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Import your components
import LandingSequence from '@/components/LandingSequence';
import MagmaCarousel from '@/components/MagmaCarousel';
import CharacterCarousel from '@/components/CharacterCarousel';

export default function Home() {
  const [introFinished, setIntroFinished] = useState(false);

  return (
    <div className="min-h-screen pb-32">
      
      {/* 1. THE INTRO SEQUENCE */}
      {/* Only show the rest of the page once this finishes */}
      <AnimatePresence mode="wait">
        {!introFinished && (
          <LandingSequence onComplete={() => setIntroFinished(true)} />
        )}
      </AnimatePresence>

      {/* 2. MAIN CONTENT (Reveals after intro) */}
      {introFinished && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          {/* A. HERO SECTION */}
          <section className="relative h-[80vh] flex flex-col items-center justify-center text-center px-6">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              <h1 className="text-7xl md:text-9xl font-header tracking-widest mb-6 text-forge-intense animate-forge-pulse">
                IRONWOOD
              </h1>
              <p className="max-w-xl mx-auto text-stone-400 text-lg md:text-xl italic mb-10">
                "The sky is choked with soot, but the heat beneath our feet... that is where the life is."
              </p>
              
              <Link 
                href="/map" 
                className="px-8 py-3 border border-forge-orange/50 text-forge-orange hover:bg-forge-orange/10 hover:border-forge-orange uppercase tracking-[0.2em] text-xs transition-all"
              >
                Open The Atlas
              </Link>
            </motion.div>
          </section>

          {/* B. THE BESTIARY (Magma Carousel) */}
          <section className="relative py-24 border-t border-stone-800 bg-[#141210]">
             <div className="max-w-7xl mx-auto px-6 mb-12">
               <h2 className="text-3xl font-header text-stone-100">
                 Native Fauna
               </h2>
               <div className="w-24 h-1 bg-gradient-to-r from-forge-orange to-transparent mt-2"></div>
             </div>
             {/* The Carousel Component */}
             <MagmaCarousel />
          </section>

          {/* C. THE CAMBRIAN NINE (Character Carousel) */}
          <section className="relative py-24 border-t border-stone-800 bg-[#0c0a09]">
             <div className="max-w-7xl mx-auto px-6 mb-8 text-right">
               <h2 className="text-3xl font-header text-stone-100">
                 The Cambrian Nine
               </h2>
               <p className="text-stone-500 font-mono text-xs uppercase tracking-widest mt-2">
                 Choose a bond to inherit their traits
               </p>
             </div>
             {/* The Character Component */}
             <CharacterCarousel />
          </section>

        </motion.div>
      )}
    </div>
  );
}