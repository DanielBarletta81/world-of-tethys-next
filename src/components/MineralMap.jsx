'use client';

import React from 'react';

const minerals = [
  { name: 'Amethyst / Quartz Geodes', location: 'Ural Mountains, Russia', lat: 60.0, lon: 60.0, color: '#06b6d4' },
  { name: 'Rock Crystal Quartz', location: 'Swiss Alps, Switzerland', lat: 46.8, lon: 8.0, color: '#38bdf8' },
  { name: 'Celestine Geodes', location: 'Sidi Chennane, Morocco', lat: 32.5, lon: -5.0, color: '#8b5cf6' },
  { name: 'Halite / Gypsum Evaporites', location: 'Dead Sea Basin, Jordan/Israel', lat: 31.5, lon: 35.5, color: '#10b981' },
  { name: 'Emerald Crystals', location: 'Panjshir Valley, Afghanistan', lat: 35.5, lon: 70.0, color: '#f43f5e' },
  { name: 'Garnet / Eclogite Pods', location: 'Bohemian Massif, Czechia', lat: 49.8, lon: 15.0, color: '#f97316' },
  { name: 'Turquoise Veins', location: 'Sinai Peninsula, Egypt', lat: 29.0, lon: 33.5, color: '#06b6d4' },
  { name: 'Gypsum (Selenite) Crystals', location: 'Sicily, Italy', lat: 37.5, lon: 14.0, color: '#10b981' },
  { name: 'Malachite / Copper Carbonates', location: 'Katanga Belt, DRC', lat: -10.7, lon: 25.0, color: '#22c55e' },
  { name: 'Banded Iron (Oolitic)', location: 'Wadi Sawawin, Saudi Arabia', lat: 28.0, lon: 35.0, color: '#facc15' },
  { name: 'Sulfur Sublimates', location: 'Aeolian Arc, Italy', lat: 38.5, lon: 14.9, color: '#f59e0b' }
];

function project(lat, lon) {
  // crude equirectangular projection to percentage for CSS positioning
  const x = ((lon + 180) / 360) * 100;
  const y = ((90 - lat) / 180) * 100;
  return { left: `${x}%`, top: `${y}%` };
}

export default function MineralMap() {
  return (
    <section className="relative py-12 border border-amber-800/30 rounded-xl bg-[#0e0c0b] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,120,60,0.08),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(37,99,235,0.06),transparent_40%)] opacity-70 pointer-events-none" />
      <div className="max-w-6xl mx-auto px-4 relative z-10 space-y-6">
        <header className="text-center space-y-2">
          <p className="text-[10px] uppercase tracking-[0.3em] text-amber-500 font-mono">Cambria Reference Grid</p>
          <h2 className="text-3xl font-header text-stone-100">Mineral Deposits of the Ancient Tethys Margin</h2>
          <p className="text-stone-400 text-sm max-w-2xl mx-auto">
            Key geodes, evaporites, and metamorphic pods along the Alpine-Himalayan belt—anchors for Cambria’s caches without breaking geologic truth.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2 relative aspect-[16/9] bg-gradient-to-br from-[#0b1224] via-[#111827] to-[#0a0f1f] border border-[#1f2937] rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_60%)] pointer-events-none" />
            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10 mix-blend-soft-light pointer-events-none" />
            <div className="absolute inset-0">
              {minerals.map((m) => {
                const pos = project(m.lat, m.lon);
                return (
                  <div
                    key={`${m.name}-${m.location}`}
                    className="absolute group"
                    style={pos}
                  >
                    <div
                      className="w-3 h-3 rounded-full shadow-[0_0_12px_currentColor] border border-white/30"
                      style={{ backgroundColor: m.color, color: m.color }}
                    />
                    <div className="absolute top-4 left-0 w-48 max-w-xs pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="bg-[#0c0a09]/90 border border-stone-700 rounded p-2 shadow-lg">
                        <p className="text-xs text-stone-200 font-semibold">{m.name}</p>
                        <p className="text-[11px] text-stone-500">{m.location}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0c0a09] to-transparent h-12 pointer-events-none" />
          </div>

          {/* Legend */}
          <div className="bg-[#0c0a09] border border-amber-800/30 rounded-lg p-4 space-y-3 shadow-inner">
            <h3 className="text-xl font-header text-stone-100">Mineral Types</h3>
            <ul className="space-y-2 text-sm text-stone-300">
              <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#06b6d4]" /> Quartz / Amethyst (energy stores)</li>
              <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#10b981]" /> Evaporites (Halite, Gypsum)</li>
              <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#f43f5e]" /> Emerald / Garnet (high-pressure pods)</li>
              <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#f59e0b]" /> Sulfur / Iron Oolites</li>
              <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#22c55e]" /> Copper Carbonates (Malachite)</li>
              <li className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#38bdf8]" /> Turquoise Veins</li>
            </ul>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Anchored to real deposits along the former Tethys margins to keep the world mysterious but geologically plausible.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
