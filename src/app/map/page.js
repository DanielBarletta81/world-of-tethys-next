// src/app/map/page.js
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useTethys } from '@/context/TethysContext';
import TethysNexus from '@/components/TethysNexus';
import StaffSequencer from '@/components/StaffSequencer';
import Incubator from '@/components/Incubator';
import TriFoldNav from '@/components/TrifoldNav';

export default function MapPage() {
  const { equippedStaff, unlockedNodes, travelTo } = useTethys();
  const [viewState, setViewState] = useState('loading'); // loading, egg, forge, map



  // 1. Determine Initial State based on User Progress
  useEffect(() => {
    if (equippedStaff) {
      setViewState('map');
    } else {
      setViewState('egg');
    }
  }, [equippedStaff]);

  // 2. Progression Handlers
  const onEggHatch = () => {
    // Egg hatches -> Move to Forge
    setViewState('forge');
  };

  const onStaffComplete = (profile) => {
    // Forge done -> Unlock Map Node -> Move to Map
    // We unlock 'sky-city' as the reward for finishing the tutorial
    travelTo('sky-city'); 
    setViewState('map');
  };

  return (
    <div className="min-h-screen bg-[#0c0a09] text-stone-200 p-6 pt-32 relative overflow-hidden font-mono">
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8 flex justify-between items-end relative z-10">
      <TriFoldNav/>
        <div>
          <Link href="/" className="text-xs text-stone-500 hover:text-white uppercase tracking-widest flex items-center gap-2 mb-4 transition-colors">
            <ArrowLeft size={14} /> Return to Hub
          </Link>
          <h1 className="text-4xl font-serif text-white">
            {viewState === 'map' ? 'The Atlas' : 'Pteros Hatchery'}
          </h1>
        </div>
        
        {/* Progress Stepper (Visible during tutorial) */}
        {viewState !== 'map' && (
          <div className="flex gap-2">
            <StepIndicator label="Incubate" active={viewState === 'egg'} completed={viewState === 'forge'} />
            <div className="w-8 h-[1px] bg-stone-800 self-center" />
            <StepIndicator label="Forge" active={viewState === 'forge'} completed={false} />
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          
          {/* PHASE 1: THE EGG */}
          {viewState === 'egg' && (
            <motion.div
              key="egg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              className="flex flex-col items-center py-12"
            >
              <Incubator onHatch={onEggHatch} />
              <p className="mt-12 text-stone-500 max-w-md text-center text-sm font-serif italic">
                "The map is silent until you hatch a guide. Break the seal to begin."
              </p>
            </motion.div>
          )}

          {/* PHASE 2: THE FORGE */}
          {viewState === 'forge' && (
            <motion.div
              key="forge"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto"
            >
              <div className="mb-6 p-4 bg-emerald-900/10 border border-emerald-900/50 rounded flex items-center gap-3 text-emerald-400 text-xs uppercase tracking-widest">
                <CheckCircle size={16} />
                <span>Lifeform Detected. Syncing Staff Sequencer...</span>
              </div>
              <StaffSequencer onProfile={onStaffComplete} />
            </motion.div>
          )}

          {/* PHASE 3: THE MAP */}
          {viewState === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2">
                <TethysNexus />
              </div>
              
              <div className="space-y-6">
                {/* Your Staff (Inventory Display) */}
                <div className="bg-[#1c1917] p-6 border border-stone-800 rounded-lg">
                  <h3 className="text-amber-500 text-xs uppercase tracking-widest mb-4">Equipped Artifact</h3>
                  {equippedStaff ? (
                    <div>
                      <div className="text-xl font-serif text-white">{equippedStaff.name}</div>
                      <div className="text-xs text-stone-500 font-mono mt-1">{equippedStaff.id}</div>
                      <div className="mt-4 flex gap-2">
                        <span className="px-2 py-1 bg-stone-800 text-stone-300 text-[10px] uppercase rounded">
                          {equippedStaff.rarity}
                        </span>
                        <span className="px-2 py-1 bg-stone-800 text-stone-300 text-[10px] uppercase rounded">
                          Power: {equippedStaff.stats?.power || 0}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-stone-600 italic">No artifact synced.</div>
                  )}
                </div>

                {/* Quick Nav */}
                <div className="bg-[#1c1917] p-6 border border-stone-800 rounded-lg">
                  <h3 className="text-cyan-500 text-xs uppercase tracking-widest mb-4">System Access</h3>
                  <div className="space-y-2">
                    <Link href="/science" className="block px-4 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded text-xs text-stone-300 transition-colors">
                      Open Field Station &rarr;
                    </Link>
                    <Link href="/mystics" className="block px-4 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded text-xs text-stone-300 transition-colors">
                      Consult The Veil &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

// UI Helper
function StepIndicator({ label, active, completed }) {
  return (
    <div className={`flex items-center gap-2 text-[10px] uppercase tracking-widest ${active ? 'text-white' : completed ? 'text-emerald-500' : 'text-stone-600'}`}>
      <div className={`w-2 h-2 rounded-full ${active ? 'bg-white animate-pulse' : completed ? 'bg-emerald-500' : 'bg-stone-700'}`} />
      {label}
    </div>
  );
}