'use client';
import StaffSequencer from '@/components/StaffSequencer';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function RegistryPage() {
  return (
    <div className="min-h-screen bg-[#0c0a09] text-stone-200 pt-24 pb-12 px-6">
      
      {/* 1. HEADER: The Vault Vibe */}
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif text-white tracking-widest uppercase drop-shadow-2xl">
          Artifact Registry
        </h1>
        <p className="mt-4 text-stone-500 font-mono text-xs uppercase tracking-[0.3em]">
          User Identification & Equipment Fabrication
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* LEFT COL: The Staff (The Hero) */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-500">
              Active Schematic
            </h2>
          </div>
          
          {/* THE COMPONENT WE JUST MADE */}
          <StaffSequencer />

          <p className="mt-6 text-xs text-stone-600 font-mono italic text-center max-w-md mx-auto">
            * This weapon is procedurally generated based on your reading habits and exploration path.
          </p>
        </motion.div>

        {/* RIGHT COL: The Inventory (The Collection) */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8"
        >
          {/* Inventory Grid */}
          <div className="bg-[#1c1917] p-8 rounded-xl border border-stone-800">
            <h3 className="text-stone-400 font-serif text-xl mb-6 border-b border-stone-800 pb-2">
              Backpack Storage
            </h3>
            
            <div className="grid grid-cols-4 gap-4">
              {/* Slot 1: The Book (Always there if they clicked buy) */}
              <InventorySlot icon="📖" label="The Spark" rarity="Legendary" />
              
              {/* Slot 2: Map Fragment (From Exploration) */}
              <InventorySlot icon="🗺️" label="S4 Map" rarity="Rare" />
              
              {/* Slot 3: Empty */}
              <InventorySlot empty />
              <InventorySlot empty />
              <InventorySlot empty />
              <InventorySlot empty />
              <InventorySlot empty />
              <InventorySlot empty />
            </div>
          </div>

          {/* Player Stats Summary */}
          <div className="bg-[#1c1917] p-8 rounded-xl border border-stone-800 relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-5"></div>
             <h3 className="text-stone-400 font-serif text-xl mb-4">
              Clearance Level
             </h3>
             <div className="flex items-end gap-4">
               <span className="text-5xl font-mono text-white font-bold">04</span>
               <span className="text-xs uppercase tracking-widest text-stone-500 mb-2">/ Warden Class</span>
             </div>
             <div className="w-full bg-stone-800 h-1 mt-4 rounded-full overflow-hidden">
               <div className="bg-amber-600 h-full w-[65%]"></div>
             </div>
          </div>

        </motion.div>
      </div>
      
      {/* FOOTER LINK */}
      <div className="mt-20 text-center">
        <Link href="/" className="text-stone-600 hover:text-stone-400 text-xs uppercase tracking-widest transition-colors">
          &larr; Return to Hub
        </Link>
      </div>

    </div>
  );
}

// Helper Component for Slots
function InventorySlot({ icon, label, rarity, empty }) {
  if (empty) {
    return (
      <div className="aspect-square bg-stone-900/50 border border-dashed border-stone-800 rounded flex items-center justify-center opacity-50">
        <span className="text-stone-700 text-xs">+</span>
      </div>
    );
  }

  const colors = {
    Common: 'border-stone-600',
    Rare: 'border-cyan-600 shadow-[0_0_10px_rgba(8,145,178,0.2)]',
    Legendary: 'border-amber-600 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
  };

  return (
    <div className={`aspect-square bg-stone-900 border ${colors[rarity] || colors.Common} rounded flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform group relative`}>
      <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">{icon}</span>
      <span className="text-[8px] uppercase tracking-wide text-stone-400 text-center leading-none px-1">{label}</span>
    </div>
  );
}