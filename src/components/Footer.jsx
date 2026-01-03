'use client';

import React from 'react';
import { Skull } from 'lucide-react';

export default function Footer({ theme = 'volcanic' }) {
  // Theme Logic: Adapts colors based on the biome
  const isVernal = theme === 'vernal';
  
  const styles = {
    border: isVernal ? 'border-teal-900/30' : 'border-[#1c1917]',
    bg: isVernal ? 'transparent' : 'bg-[#050404]',
    quote: isVernal ? 'text-emerald-900/60' : 'text-[#292524]',
    copy: isVernal ? 'text-teal-900/50' : 'text-[#44403c]',
    icon: isVernal ? 'text-teal-900/20' : 'text-[#1c1917]'
  };

  return (
    <footer className={`border-t ${styles.border} ${styles.bg} py-24 text-center relative overflow-hidden font-serif`}>
      
      {/* Background Watermark */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center select-none">
         <Skull size={300} className={`opacity-50 ${styles.icon}`} />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 px-4">
        
        {/* The Memento Mori Quote */}
        <blockquote className={`text-lg md:text-xl italic ${styles.quote} max-w-lg leading-relaxed`}>
          "99.9% of all species that have ever lived are extinct.<br/>
          We are just the current ghosts."
        </blockquote>

        <div className={`w-12 h-[1px] ${isVernal ? 'bg-teal-900/30' : 'bg-[#292524]'}`}></div>

        {/* Copyright & Legal */}
        <div className={`text-[10px] font-sans uppercase tracking-[0.25em] ${styles.copy} space-y-2`}>
          <p>© {new Date().getFullYear()} World of Tethys</p>
          <p>D.C. Barletta</p>
        </div>

      </div>
    </footer>
  );
}