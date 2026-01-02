'use client';

import { useState } from 'react';
import { Lock, Unlock, Scroll, Play, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AncientArchive({ 
  id, 
  title, 
  type, // 'audio', 'video', 'document'
  cost, 
  url, 
  userBalance, 
  isUnlocked, 
  onUnlock 
}) {
  const [loading, setLoading] = useState(false);

  const handleOffering = async () => {
    if (userBalance < cost) {
      alert("Your spirit resin is too low. Gather more.");
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500)); // Dramatic pause
    onUnlock(id); 
    setLoading(false);
  };

  return (
    <div className="relative w-full max-w-md bg-[#1c1917] border-2 border-[#3d3834] rounded-sm overflow-hidden font-serif group shadow-xl">
      
      {/* 1. HEADER (The Seal) */}
      <div className="bg-[#0c0a09] px-4 py-3 border-b border-[#3d3834] flex justify-between items-center">
        <span className="text-xs uppercase tracking-[0.2em] text-stone-500 font-mono">
          Artifact #{id}
        </span>
        <div className="flex items-center gap-2">
           {isUnlocked ? <Unlock size={12} className="text-emerald-500"/> : <Lock size={12} className="text-forge-orange"/>}
           <span className={`text-[9px] uppercase tracking-widest ${isUnlocked ? 'text-emerald-500' : 'text-forge-orange'}`}>
             {isUnlocked ? 'Seal Broken' : 'Bound'}
           </span>
        </div>
      </div>

      {/* 2. BODY CONTENT */}
      <div className="p-8 relative min-h-[160px] flex flex-col justify-center items-center text-center">
        
        {/* Background Texture (Old Paper) */}
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 mix-blend-soft-light"></div>

        {isUnlocked ? (
          // === UNLOCKED STATE (The Scroll) ===
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="z-10 w-full space-y-5"
          >
            <h3 className="text-stone-200 font-header text-lg">{title}</h3>
            
            {/* AUDIO PLAYER (Styled Custom) */}
            {type === 'audio' && (
              <div className="w-full bg-stone-900/50 p-2 rounded border border-stone-800">
                <audio controls className="w-full h-8 opacity-60 hover:opacity-100 transition-opacity">
                  <source src={url} type="audio/mpeg" />
                </audio>
              </div>
            )}
            
            {type === 'video' && (
               <video controls className="w-full rounded border border-stone-800 shadow-lg">
                 <source src={url} type="video/mp4" />
               </video>
            )}

            {/* DOWNLOAD BUTTON */}
            {type === 'document' && (
              <a 
                href={url} 
                download 
                className="block w-full py-3 bg-[#2a2622] border border-[#4a423b] text-stone-300 hover:text-white hover:border-emerald-500 hover:bg-emerald-900/20 transition-all uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3"
              >
                <Scroll size={14} /> Unfurl Parchment
              </a>
            )}
          </motion.div>

        ) : (
          
          // === LOCKED STATE (The Binding) ===
          <div className="z-10 space-y-4">
            <h3 className="text-stone-600 font-header text-lg blur-[2px] select-none">
              {title}
            </h3>
            <p className="text-[10px] text-forge-orange font-mono uppercase tracking-[0.2em]">
              Requires Offering
            </p>

            {/* THE "OFFERING" BUTTON */}
            <button 
              onClick={handleOffering}
              disabled={loading}
              className="relative group/btn overflow-hidden px-6 py-3 bg-[#0c0a09] border border-forge-orange/40 text-forge-orange hover:text-white hover:border-forge-orange transition-all"
            >
               {loading ? (
                 <span className="animate-pulse text-xs tracking-widest">MELTING SEAL...</span>
               ) : (
                 <span className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase">
                   <Flame size={12} className="fill-current animate-pulse" />
                   Burn {cost} Resin
                 </span>
               )}
            </button>
            
            <div className="text-[9px] text-stone-600 font-mono">
              Your Pouch: {userBalance} Resin
            </div>
          </div>
        )}
      </div>
    </div>
  );
}