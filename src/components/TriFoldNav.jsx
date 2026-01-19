'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

const PATHS = [
  {
    id: 'world',
    label: 'World',
    color: 'emerald',
    items: [
      { id: 'map', label: 'Atlas', href: '/map' },
      { id: 'weather', label: 'Atmosphere', href: '/science' },
      { id: 'cycle', label: 'Cycle', href: '/study' }
    ]
  },
  {
    id: 'bond',
    label: 'Bond',
    color: 'rose',
    items: [
      { id: 'characters', label: 'Peek', href: '/peek' },
      { id: 'forge', label: 'Bond Forge', href: '/mystics' }
    ]
  },
  {
    id: 'lore',
    label: 'Lore',
    color: 'amber',
    items: [
      { id: 'cambria', label: 'Cambria Archive', href: '/cambria' },
      { id: 'books', label: 'Chronicle', href: '/bookstore' }
    ]
  }
];

export default function TriFoldNav({ onSelect }) {
  const [open, setOpen] = useState(null);
  const colorStyles = {
    emerald: 'text-emerald-400 hover:bg-emerald-900/10',
    rose: 'text-rose-400 hover:bg-rose-900/10',
    amber: 'text-amber-400 hover:bg-amber-900/10'
  };

  return (
    <nav className="absolute left-0 top-0 bottom-0 w-16 hover:w-56 transition-all duration-300 bg-[#0c0a09]/90 border-r border-stone-800 z-40">
      <div className="flex flex-col pt-20 gap-2">
        {PATHS.map(path => {
          const isOpen = open === path.id;
          const headerClass = colorStyles[path.color] || 'text-stone-300 hover:bg-stone-900/30';
          return (
            <div key={path.id}>
              {/* PATH HEADER */}
              <button
                onClick={() => setOpen(isOpen ? null : path.id)}
                className={`flex items-center justify-between w-full px-4 py-3 ${headerClass} transition`}
              >
                <span className="uppercase tracking-[0.3em] text-[10px] font-mono">
                  {path.label}
                </span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* PATH ITEMS */}
              {isOpen && (
                <div className="pl-6 pb-2 flex flex-col gap-1">
                  {path.items.map(item => {
                    const linkProps = item.href ? { href: item.href } : { href: '#' };
                    return (
                      <Link
                        key={item.id}
                        {...linkProps}
                        onClick={(e) => {
                          if (onSelect) {
                            e.preventDefault();
                            onSelect(item.id);
                          }
                        }}
                        className="text-left text-xs text-stone-300 hover:text-white py-1"
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
// World of Tethys || D.C. Barletta
