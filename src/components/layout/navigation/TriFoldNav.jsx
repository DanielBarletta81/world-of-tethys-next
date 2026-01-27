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
      { id: 'signals', label: 'Signals', href: '/signals' },
      { id: 'books', label: 'Chronicle', href: '/bookstore' }
    ]
  }
];

export default function TriFoldNav({ onSelect, className = '', sticky = true }) {
  const [open, setOpen] = useState(null);
  const colorStyles = {
    emerald: 'text-emerald-400 hover:bg-emerald-900/10',
    rose: 'text-rose-400 hover:bg-rose-900/10',
    amber: 'text-amber-400 hover:bg-amber-900/10'
  };
  const stickyClass = sticky ? 'sticky top-20' : 'relative';

  return (
    <nav
      className={`${stickyClass} self-start w-56 bg-[#0c0a09]/80 border border-stone-800 rounded-xl shadow-lg backdrop-blur-md z-30 px-2 py-3 ${className}`}
      role="navigation"
      aria-label="Atlas quick links"
    >
      <div className="flex flex-col gap-2">
        {PATHS.map(path => {
          const isOpen = open === path.id;
          const headerClass = colorStyles[path.color] || 'text-stone-300 hover:bg-stone-900/30';
          return (
            <div key={path.id}>
              {/* PATH HEADER */}
              <button
                onClick={() => setOpen(isOpen ? null : path.id)}
                aria-expanded={isOpen}
                aria-controls={`tri-path-${path.id}`}
                className={`flex items-center justify-between w-full px-4 py-2 rounded-lg ${headerClass} transition`}
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

              <div
                id={`tri-path-${path.id}`}
                className={`pl-6 pb-2 flex flex-col gap-1 transition-opacity duration-150 ${
                  isOpen
                    ? 'opacity-100 visible pointer-events-auto'
                    : 'opacity-0 invisible h-0 overflow-hidden pointer-events-none'
                }`}
              >
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
            </div>
          );
        })}
      </div>
    </nav>
  );
}
// World of Tethys || D.C. Barletta
