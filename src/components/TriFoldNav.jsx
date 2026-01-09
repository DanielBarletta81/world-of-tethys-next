'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const PATHS = [
  {
    id: 'world',
    label: 'World',
    color: 'emerald',
    items: [
      { id: 'map', label: 'Atlas' },
      { id: 'weather', label: 'Atmosphere' },
      { id: 'cycle', label: 'Cycle' }
    ]
  },
  {
    id: 'bond',
    label: 'Bond',
    color: 'rose',
    items: [
      { id: 'characters', label: 'Figures' },
      { id: 'forge', label: 'Bond Forge' }
    ]
  },
  {
    id: 'lore',
    label: 'Lore',
    color: 'amber',
    items: [
      { id: 'cambria', label: 'Cambria Archive' },
      { id: 'books', label: 'Chronicle' }
    ]
  }
];

export default function TriFoldNav({ onSelect }) {
  const [open, setOpen] = useState(null);

  return (
    <nav className="absolute left-0 top-0 bottom-0 w-16 hover:w-56 transition-all duration-300 bg-[#0c0a09]/90 border-r border-stone-800 z-40">
      <div className="flex flex-col pt-20 gap-2">
        {PATHS.map(path => {
          const isOpen = open === path.id;
          return (
            <div key={path.id}>
              {/* PATH HEADER */}
              <button
                onClick={() => setOpen(isOpen ? null : path.id)}
                className={`flex items-center justify-between w-full px-4 py-3 text-${path.color}-400 hover:bg-${path.color}-900/10 transition`}
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
                  {path.items.map(item => (
                    <button
                      key={item.id}
                      onClick={() => onSelect(item.id)}
                      className="text-left text-xs text-stone-300 hover:text-white py-1"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
