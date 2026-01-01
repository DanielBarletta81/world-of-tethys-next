'use client';
import React from 'react';
import { useState } from 'react';
import PteroIntro from '@/components/PteroIntro';
import AshCloudNav from '@/components/AshCloudNav';
import SeedVisualizer from '@/components/SeedVisualizer';
import { motion } from 'framer-motion';

export default function Home() {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <main className="min-h-screen bg-slate-950 text-stone-200 overflow-hidden">
      
      {/* 1. THE INTRO (Plays once on load) */}
      {!introComplete && (
        <PteroIntro onComplete={() => setIntroComplete(true)} />
      )}

      {/* 2. THE MAIN UI (Only visible after intro) */}
      {introComplete && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 1 }}
          className="relative"
        >
          <AshCloudNav />
          
          <div className="flex flex-col items-center justify-center pt-32 px-4">
            
            <h1 className="text-6xl font-serif mb-12 animate-fade-in-up">
              Sky City
            </h1>

            {/* The Visualizer sits here, waiting for data */}
            <SeedVisualizer initialSeed="H-9284" scores={{ lore: 10, creature: 5, geology: 0 }} />
            
            {/* Rest of your landing page content... */}

          </div>
        </motion.div>
      )}
    </main>
  );
}