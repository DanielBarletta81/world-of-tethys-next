'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTethys } from '@/context/TethysContext'; // Hook into the economy
import { Compass, Map, Scroll, Users, Diamond, BookOpen, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

const NAV_LINKS = [
  { name: 'Books', path: '#books', icon: <BookOpen size={14} /> },
  { name: 'Join the World', path: '#join', icon: <Sparkles size={14} /> },
  { name: 'Mystics', path: '#mystics', icon: <Scroll size={14} /> },
  { name: 'Creatures', path: '/creatures', icon: <Compass size={14} /> },
  { name: 'Locations', path: '#locations', icon: <Map size={14} /> },
  { name: 'Author Bio', path: '#author', icon: <Users size={14} /> },
];

export default function WayfinderNav() {
  const pathname = usePathname();
  const [hash, setHash] = useState('');
  const { resin } = useTethys(); // Get live balance

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const updateHash = () => setHash(window.location.hash || '');
    updateHash();
    window.addEventListener('hashchange', updateHash);
    return () => window.removeEventListener('hashchange', updateHash);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-16 bg-[#0c0a09]/95 backdrop-blur-md border-b border-[#3d3834] flex items-center justify-center">
      
      {/* 1. TEXTURE OVERLAY (Gritty Feel) */}
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10 pointer-events-none"></div>

      <div className="w-full max-w-7xl px-6 flex items-center justify-between relative z-10">
        
        {/* LEFT: SITE TITLE (The Brand) */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="w-8 h-8 bg-forge-orange/10 border border-forge-orange/30 rounded flex items-center justify-center group-hover:border-forge-orange transition-colors">
            <span className="font-header text-forge-orange text-lg">T</span>
          </div>
          <span className="hidden md:block font-header text-stone-200 tracking-widest text-sm uppercase group-hover:text-white transition-colors">
            World of Tethys
          </span>
        </Link>

        {/* CENTER: THE LINKS (The Compass) */}
        <nav className="flex items-center gap-1 md:gap-2">
          {NAV_LINKS.map((item) => {
            const isActive = item.path.startsWith('#')
              ? hash === item.path
              : pathname === item.path;
            
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className="relative px-3 py-2 group"
              >
                {/* Hover/Active Background */}
                {isActive && (
                  <motion.div 
                    layoutId="nav-bg"
                    className="absolute inset-0 bg-[#2a2622] rounded-sm border border-[#4a423b]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                
                {/* Link Content */}
                <div className="relative z-10 flex items-center gap-2">
                  <span className={`transition-colors duration-300 ${isActive ? 'text-forge-orange' : 'text-stone-500 group-hover:text-stone-300'}`}>
                    {item.icon}
                  </span>
                  <span className={`text-[10px] font-mono uppercase tracking-[0.15em] transition-colors duration-300 ${isActive ? 'text-stone-200' : 'text-stone-500 group-hover:text-stone-300'}`}>
                    {item.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* RIGHT: THE RESIN POUCH (Economy) */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1c1917] border border-[#3d3834] rounded-sm">
            <Diamond size={12} className="text-forge-orange fill-forge-orange/20 animate-pulse" />
            <span className="font-mono text-xs text-stone-300 tabular-nums tracking-widest">
              {resin}
            </span>
          </div>
          
          {/* Mobile Only: Menu Button? (Optional, kept simple for now) */}
        </div>

      </div>

      {/* BOTTOM MAGMA LINE (Visual Flair) */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-forge-orange/20 to-transparent"></div>
    </header>
  );
}
