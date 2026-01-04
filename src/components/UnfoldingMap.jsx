'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

// Your Lore Seeds (These match the "points of interest" in your story)
// You will likely need to tweak 'top' and 'left' to match your specific image art.
const MAP_POINTS = [
  { id: 'sky-city', label: 'Sky City', top: '20%', left: '70%' },
  { id: 'lonely-span', label: 'Lonely Span', top: '45%', left: '45%' },
  { id: 'glow-tide', label: 'Glow-Tide', top: '75%', left: '30%' },
  { id: 'strait-of-dier', label: 'Strait of Dier', top: '60%', left: '80%' },
  { id: 'estuary', label: 'The Estuary', top: '50%', left: '20%' },
];

export default function UnfoldingMap({ onPointClick }) {
  return (
    <div className="flex justify-center items-center py-10 perspective-1000">
      <motion.div
        initial={{ rotateX: 10, scale: 0.9, opacity: 0 }}
        whileInView={{ rotateX: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="relative w-full max-w-5xl aspect-[16/9] shadow-2xl rounded-sm overflow-hidden border-4 border-[#3d3834] bg-[#0c0a09]"
      >
        
        {/* === 1. THE MAP ARTIFACT === */}
        {/* Ensure 'epic_map_hero.PNG' is inside your 'public/img/map/' folder */}
        <div className="absolute inset-0">
          <Image 
            src="/img/map/epic_map_hero.PNG" 
            alt="Map of Tethys" 
            fill
            priority
            className="object-cover opacity-90 sepia-[0.3] contrast-125"
          />
        </div>

        {/* Optional: A subtle vignette to darken the edges */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)] pointer-events-none"></div>

        {/* === 2. INTERACTIVE HOTSPOTS === */}
        {MAP_POINTS.map((point) => (
          <button
            key={point.id}
            onClick={() => onPointClick && onPointClick(point)}
            className="absolute z-20 group"
            style={{ top: point.top, left: point.left }}
          >
            {/* The Dot */}
            <div className="relative">
              <div className="w-3 h-3 bg-forge-orange rounded-full border border-stone-900 shadow-[0_0_10px_#f59e0b] animate-pulse group-hover:scale-150 transition-transform duration-300" />
              {/* Ripple Ring */}
              <div className="absolute -inset-4 border border-forge-orange/30 rounded-full animate-ping opacity-50" />
            </div>

            {/* The Tooltip (Lore Style) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 pointer-events-none min-w-[140px] text-center">
              <div className="bg-[#1c1917]/95 backdrop-blur px-4 py-2 border border-[#3d3834] rounded-sm shadow-xl">
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-200 block whitespace-nowrap">
                  {point.label}
                </span>
                <span className="text-[9px] text-forge-orange font-serif italic">
                  Click to survey
                </span>
              </div>
              {/* Connecting Line */}
              <div className="h-3 w-[1px] bg-[#3d3834] mx-auto"></div>
            </div>
          </button>
        ))}

        {/* === 3. DECORATION: COMPASS ROSE === */}
        <div className="absolute bottom-8 right-8 z-10 opacity-60 text-[#3d3834] mix-blend-multiply">
          <svg width="80" height="80" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
             <circle cx="50" cy="50" r="40" />
             <path d="M50 10 L58 42 L90 50 L58 58 L50 90 L42 58 L10 50 L42 42 Z" fill="currentColor" />
          </svg>
        </div>

      </motion.div>
    </div>
  );
}
