/// src/components/TriFoldNav.jsx
'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Sparkles, Microscope } from 'lucide-react';
import { motion } from 'framer-motion';
import MagmaSeal from './MagmaSeal';

const PATHS = [
  {
    id: 'narrative',
    label: 'The Chronicle',
    href: '/study',
    icon: <BookOpen size={18} />,
   
    color: 'hover:text-amber-400',
    border: 'hover:border-amber-500/50'
  },
  {
    id: 'mystic',
    label: 'The Veil',
    href: '/mystics',
    icon: <Sparkles size={18} />,
   
    color: 'hover:text-purple-400',
    border: 'hover:border-purple-500/50'
  },
  {
    id: 'science',
    label: 'Field Station',
    href: '/science',
    icon: <Microscope size={18} />,
   
    color: 'hover:text-cyan-400',
    border: 'hover:border-cyan-500/50'
  }
];

export default function TriFoldNav() {
  const pathname = usePathname();

  return (
    <nav className="w-full max-w-5xl mx-auto mb-12 relative z-20">
      
      {/* HEADER ROW with SEAL */}
      <div className="flex justify-center items-center gap-6 mb-8">
        <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-stone-800"></div>
        <MagmaSeal />
        <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-stone-800"></div>
      </div>

      {/* NAVIGATION GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PATHS.map((path) => {
          const isActive = pathname === path.href;
          const colorClass = path.color.split(':')[1];

          return (
            <Link key={path.id} href={path.href} className="group relative">
              <div className={`
                h-full p-4 border rounded-lg transition-all duration-300 flex flex-col items-center text-center gap-2
                bg-[#0f0b09] 
                ${isActive 
                  ? `border-${colorClass.split('-')[1]}-500/50 bg-${colorClass.split('-')[1]}-900/10` 
                  : `border-stone-800 ${path.border}`
                }
              `}>
                <div className={`transition-colors duration-300 ${isActive ? colorClass : 'text-stone-500'} group-hover:${colorClass}`}>
                  {path.icon}
                </div>
                
                <div>
                  <h3 className={`font-serif text-lg tracking-widest uppercase transition-colors ${isActive ? 'text-stone-100' : 'text-stone-400 group-hover:text-stone-200'}`}>
                    {path.label}
                  </h3>
                 
                </div>

                {isActive && (
                  <motion.div 
                    layoutId="activeGlow"
                    className={`absolute inset-0 rounded-lg border-2 opacity-20 border-${colorClass.split('-')[1]}-500`}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}