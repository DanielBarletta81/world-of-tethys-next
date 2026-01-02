'use client';

import { useState, useEffect } from 'react';
import { translateWeatherToLore } from '@/lib/weatherTranslator';
import { Wind, Cloud, CloudRain, Sun, Eye, Feather } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AtmosphericTotem({ proxyCity, biome }) {
  const [lore, setLore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!proxyCity) return;

    const consultTheSky = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(`/api/weather?city=${encodeURIComponent(proxyCity)}`);
        if (!res.ok) throw new Error('The winds are silent');
        
        const data = await res.json();
        const translation = translateWeatherToLore(data, biome);
        setLore(translation);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    consultTheSky();
  }, [proxyCity, biome]);

  if (!proxyCity) return null;

  // Choose an icon based on the vibe (purely decorative)
  const getIcon = () => {
    if (loading) return <Eye className="w-5 h-5 text-stone-500 animate-pulse" />;
    if (lore?.status.includes('RAIN') || lore?.status.includes('STORM')) return <CloudRain className="w-6 h-6 text-stone-400" />;
    if (lore?.status.includes('CLEAR') || lore?.status.includes('SUN')) return <Sun className="w-6 h-6 text-stone-400" />;
    return <Wind className="w-6 h-6 text-stone-400" />;
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="absolute top-8 right-8 z-40 max-w-xs"
      >
        {/* THE ARTIFACT CONTAINER */}
        <div className="relative bg-[#1c1917] p-6 rounded-sm border-2 border-[#3d3834] shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          
          {/* DECORATIVE RUST/BLOOD STAINS */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-900/20 to-transparent pointer-events-none rounded-tr-sm"></div>

          {/* 1. THE HEADER (Location Name) */}
          <div className="flex items-center justify-between mb-4 border-b border-[#3d3834] pb-3">
             <div className="flex items-center gap-3">
               {/* The "Connection" Icon (No longer Wifi) */}
               <div className="p-2 bg-[#0c0a09] rounded-full border border-[#292524]">
                 {getIcon()}
               </div>
               <div>
                 <h4 className="font-header text-stone-300 text-sm tracking-widest uppercase">
                   {proxyCity.split(',')[0]}
                 </h4>
                 <span className="text-[10px] text-stone-600 font-serif italic block">
                   Echo from the future
                 </span>
               </div>
             </div>
          </div>

          {/* 2. THE PROPHECY (Weather Status) */}
          {error ? (
            <div className="text-stone-500 font-serif italic text-sm">
              "The mists are too thick. The spirits are silent."
            </div>
          ) : (
            <div className="space-y-2">
              {loading ? (
                <div className="text-stone-500 text-xs font-serif italic animate-pulse flex items-center gap-2">
                  <Feather size={12} className="animate-bounce" />
                  Listening to the winds...
                </div>
              ) : (
                <>
                  <div className={`text-lg font-header uppercase tracking-widest ${lore?.color} drop-shadow-md`}>
                    {lore?.status}
                  </div>
                  <p className="text-xs font-serif leading-relaxed text-stone-400 border-l-2 border-stone-800 pl-3">
                    “{lore?.message}”
                  </p>
                </>
              )}
            </div>
          )}
          
          {/* 3. ANCIENT FOOTER */}
          <div className="mt-4 pt-3 border-t border-[#3d3834] flex justify-between items-center opacity-50">
            <span className="text-[9px] font-mono text-stone-600 uppercase tracking-[0.2em]">
              Scribe: Orrix
            </span>
            {/* Runes / Decoration */}
            <div className="flex gap-1 text-stone-700 text-[8px] tracking-[0.5em]">
              ••• — ••
            </div>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}