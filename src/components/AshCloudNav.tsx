'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NAV_ITEMS = [
  { name: 'Home', path: '/' },
  { name: 'Creatures', path: '/creatures' },
  { name: 'Bonds', path: '/bookstore' },
  { name: 'Characters', path: '/characters' }
];

export default function AshCloudNav() {
  const pathname = usePathname();
  const [hoveredPath, setHoveredPath] = useState(pathname);

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-24 pointer-events-none flex justify-center">
      <div className="pointer-events-auto relative mt-4 px-8 py-3 rounded-full overflow-hidden bg-slate-900/80 backdrop-blur-md border border-slate-700/50 shadow-[0_10px_40px_rgba(0,0,0,0.5)] group">
        <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('/noise.svg')] animate-[spin_60s_linear_infinite] scale-[2]" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl" />

        <nav className="relative z-10 flex items-center space-x-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.path === pathname;
            return (
              <Link
                key={item.path}
                href={item.path}
                className="relative px-6 py-2 rounded-full transition-colors group/link"
                onMouseEnter={() => setHoveredPath(item.path)}
              >
                <span
                  className={`relative z-10 text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${
                    isActive
                      ? 'text-cyan-200 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]'
                      : 'text-slate-400 group-hover/link:text-white'
                  }`}
                >
                  {item.name}
                </span>

                {isActive && (
                  <motion.div
                    layoutId="nav-lightning"
                    className="absolute inset-0 rounded-full border border-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  >
                    <div className="absolute top-0 left-1/4 w-1/2 h-px bg-cyan-200 blur-[1px]" />
                    <div className="absolute bottom-0 right-1/4 w-1/2 h-px bg-cyan-200 blur-[1px]" />
                  </motion.div>
                )}

                <div className="absolute inset-0 bg-white/5 rounded-full scale-75 opacity-0 group-hover/link:opacity-100 group-hover/link:scale-100 transition-all duration-300" />
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
