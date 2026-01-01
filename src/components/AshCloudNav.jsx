'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { getAmazonBookUrl } from '@/lib/links'; // Ensure you have this helper or hardcode it

// THE BIG 4 (Immersive Paths)
const NAV_ITEMS = [
  { name: 'Hub', path: '/' },
  { name: 'Atlas', path: '/map' },
  { name: 'Factions', path: '/factions' },
  { name: 'Echoes', path: '/listen' },
];

export default function AshCloudNav() {
  const pathname = usePathname();
  const [hoveredPath, setHoveredPath] = useState(pathname);
  const amazonUrl = getAmazonBookUrl() || '#'; // Fallback if link missing

  return (
    <header className="fixed top-6 inset-x-0 z-50 flex justify-center pointer-events-none">
      
      {/* THE CLOUD CONTAINER */}
      <div className="pointer-events-auto relative px-2 py-2 rounded-full flex items-center gap-4 bg-[#0c0a09]/80 backdrop-blur-xl border border-stone-800 shadow-2xl transition-all duration-300 hover:border-stone-600">
        
        {/* 1. SMOKE & LIGHTNING EFFECTS */}
        <div className="absolute inset-0 rounded-full overflow-hidden opacity-20 pointer-events-none">
             <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-30 animate-pulse"></div>
        </div>

        {/* 2. MAIN NAVIGATION (The Big 4) */}
        <nav className="flex items-center">
          {NAV_ITEMS.map((item) => {
            const isActive = item.path === pathname;
            return (
              <Link 
                key={item.path} 
                href={item.path}
                className="relative px-4 py-2 rounded-full transition-all group/link"
                onMouseEnter={() => setHoveredPath(item.path)}
              >
                <span className={`relative z-10 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors duration-300 
                  ${isActive ? 'text-cyan-200 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]' : 'text-stone-500 group-hover/link:text-stone-200'}`}
                >
                  {item.name}
                </span>

                {/* Active "Zap" Border */}
                {isActive && (
                  <motion.div
                    layoutId="nav-lightning"
                    className="absolute inset-0 rounded-full border border-cyan-500/30 shadow-[0_0_10px_rgba(34,211,238,0.1)]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* 3. THE SPLITTER (Vertical Line) */}
        <div className="h-6 w-px bg-stone-800"></div>

        {/* 4. THE "BUY BOOK" BUTTON (High Contrast) */}
        <a 
          href={amazonUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="relative px-5 py-2 rounded-full bg-amber-700 hover:bg-amber-600 border border-amber-600/50 group/buy overflow-hidden transition-all"
        >
          {/* Inner Glow Animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/30 to-transparent translate-x-[-100%] group-hover/buy:translate-x-[100%] transition-transform duration-700"></div>
          
          <div className="relative flex items-center gap-2">
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-amber-50 drop-shadow-md">
              Get The Book
            </span>
            {/* Tiny External Link Icon */}
            <svg className="w-3 h-3 text-amber-200 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </div>
        </a>

      </div>
    </header>
  );
}