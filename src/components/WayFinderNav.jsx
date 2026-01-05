// src/components/TrifoldNav.jsx
"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, Microscope } from 'lucide-react';

const PATHS = [
  {
    id: 'narrative',
    label: 'The Chronicle',
    href: '/study',
    icon: <BookOpen size={18} />,
    desc: 'For Readers: Books, Bonds & Audio',
    color: 'hover:text-amber-400',
    border: 'hover:border-amber-500/50'
  },
  {
    id: 'mystic',
    label: 'The Veil',
    href: '/mystics',
    icon: <Sparkles size={18} />,
    desc: 'For Mystics: Oracles, Staffs & Paths',
    color: 'hover:text-purple-400',
    border: 'hover:border-purple-500/50'
  },
  {
    id: 'science',
    label: 'Field Station',
    href: '/science',
    icon: <Microscope size={18} />,
    desc: 'For Researchers: Fossils, Data & Maps',
    color: 'hover:text-cyan-400',
    border: 'hover:border-cyan-500/50'
  }
];

export default function WayFinderNav() {
  const pathname = usePathname();

  return (
    <nav className="w-full max-w-4xl mx-auto mb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PATHS.map((path) => {
          const isActive = pathname === path.href;
          return (
            <Link key={path.id} href={path.href} className="group relative">
              <div className={`
                h-full p-6 border rounded-lg transition-all duration-300 flex flex-col items-center text-center gap-3
                bg-[#0f0b09] 
                ${isActive 
                  ? `border-${path.color.split('-')[1]}-500/50 bg-${path.color.split('-')[1]}-900/10` 
                  : `border-stone-800 ${path.border}`
                }
              `}>
                <div className={`transition-colors duration-300 ${isActive ? path.color.replace('hover:', '') : 'text-stone-500'} group-hover:${path.color.replace('hover:', '')}`}>
                  {path.icon}
                </div>
                
                <div>
                  <h3 className={`font-serif text-lg tracking-widest uppercase transition-colors ${isActive ? 'text-stone-100' : 'text-stone-400 group-hover:text-stone-200'}`}>
                    {path.label}
                  </h3>
                  <p className="text-[10px] uppercase tracking-wider text-stone-600 mt-1 font-mono group-hover:text-stone-500">
                    {path.desc}
                  </p>
                </div>

                {/* Active Indicator Pulse */}
                {isActive && (
                  <motion.div 
                    layoutId="activeGlow"
                    className={`absolute inset-0 rounded-lg border-2 opacity-20 ${path.color.replace('hover:text', 'border')}`}
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