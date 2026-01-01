'use client';


export default function MapPlaceholder() {
  return (
    <div className="relative w-full h-[500px] bg-slate-950 overflow-hidden rounded-xl border border-stone-800 group">
      {/* Background grid / texture */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(68, 64, 60, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(68, 64, 60, 0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-slate-950/80 to-black opacity-90" />

      {/* Spires / hubs */}
      <div className="absolute top-10 left-10 sm:left-20 w-24 sm:w-32 h-40 sm:h-48 bg-stone-900 rounded-t-lg border-x border-t border-stone-700 shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-hidden">
        <div className="absolute bottom-0 h-1/2 w-full bg-gradient-to-t from-amber-900/30 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8px] text-stone-600 font-mono text-center opacity-60">
          SPIRE
          <br />
          ALPHA
        </div>
      </div>

      <div className="absolute bottom-12 right-10 sm:right-24 w-32 sm:w-40 h-24 sm:h-32 bg-stone-900 rounded-b-lg border-x border-b border-stone-700 shadow-[0_0_30px_rgba(0,0,0,0.8)] overflow-hidden">
        <div className="absolute bottom-0 h-full w-full bg-gradient-to-t from-red-900/20 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8px] text-stone-600 font-mono text-center opacity-60">
          FOUNDRY
          <br />
          DISTRICT
        </div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-64 sm:h-64 bg-stone-800 rounded-full border-8 border-stone-900 shadow-[0_0_50px_rgba(180,83,9,0.3)] flex items-center justify-center group-hover:shadow-[0_0_70px_rgba(251,191,36,0.4)] transition-shadow duration-700">
        <div className="w-32 h-32 sm:w-48 sm:h-48 rounded-full bg-slate-950 border-2 border-dashed border-amber-900/50 flex items-center justify-center animate-[spin_60s_linear_infinite]">
          <span className="text-amber-500/80 font-bold tracking-widest text-[10px] sm:text-xs animate-pulse">
            THE CORE
          </span>
        </div>
      </div>

      {/* Bridges */}
      <div className="absolute top-[20%] left-[25%] w-[20%] h-0.5 bg-stone-700 rotate-[25deg] opacity-30 origin-left" />
      <div className="absolute top-[60%] left-[60%] w-[20%] h-0.5 bg-stone-700 rotate-[15deg] opacity-30 origin-left" />

      {/* Overlay labels */}
      <div className="absolute bottom-4 left-4 bg-black/60 p-3 rounded border border-stone-800 backdrop-blur-sm z-10">
        <div className="text-amber-400 text-xs font-bold uppercase tracking-widest drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]">
          Undercity Schematic
        </div>
        <div className="text-stone-500 text-[10px] font-mono mt-1">Status: Dormant • Depth: Level 4</div>
      </div>

      {/* Hover hint */}
      <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none flex items-center justify-center">
        <span className="bg-black/80 text-amber-300 px-4 py-2 rounded border border-amber-500/50 text-xs uppercase tracking-widest transform scale-90 group-hover:scale-100 transition-transform">
          Access Full Atlas →
        </span>
      </div>

      {/* Noise */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-10 pointer-events-none mix-blend-overlay" />
    </div>
  );
}
