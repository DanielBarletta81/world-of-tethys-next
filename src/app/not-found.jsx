'use client';

import Link from 'next/link';
import { Bone, Mountain, Waves } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0c0a09] text-stone-200 flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background fossil haze */}
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10 pointer-events-none" />
      <div className="absolute -top-24 left-10 w-72 h-72 bg-amber-900/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-900/10 blur-[140px] rounded-full" />

      {/* Fossil marker */}
      <div className="relative mb-8 group">
        <div className="absolute inset-0 bg-amber-900/10 blur-3xl rounded-full animate-pulse" />
        <div className="w-32 h-32 rounded-full border-2 border-amber-700/40 bg-[#1c1917] flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.15)] relative z-10">
          <Bone className="w-14 h-14 text-amber-400 group-hover:text-amber-200 transition-colors duration-500" />
        </div>
        <div className="absolute top-0 right-0 -mr-4 -mt-4 text-amber-400 font-mono text-xs uppercase tracking-widest border border-amber-700/50 px-2 py-1 bg-black/80 rotate-6">
          Fossil Trail
        </div>
      </div>

      {/* Copy */}
      <div className="text-center space-y-4 max-w-xl relative z-10">
        <p className="text-[10px] uppercase tracking-[0.35em] text-amber-500 font-mono">Path Not Found</p>
        <h1 className="text-4xl md:text-5xl font-header text-stone-100">This trail eroded in the Ash Age</h1>
        <p className="text-stone-400 text-sm md:text-base">
          The page you sought has fossilized or slipped beneath the dunes. Follow the river back to the living map.
        </p>
        <div className="flex items-center justify-center gap-3 text-xs uppercase tracking-widest text-stone-500">
          <span className="flex items-center gap-1"><Mountain className="w-4 h-4" /> Uplift</span>
          <span className="flex items-center gap-1"><Waves className="w-4 h-4" /> Erosion</span>
        </div>
      </div>

      {/* Action */}
      <div className="mt-8 relative z-10">
        <Link
          href="/"
          className="px-6 py-3 border border-amber-700/60 text-amber-200 bg-amber-900/10 hover:bg-amber-900/30 rounded-sm uppercase tracking-[0.2em] text-xs transition-all"
        >
          Return to the Atlas
        </Link>
      </div>
    </div>
  );
}
