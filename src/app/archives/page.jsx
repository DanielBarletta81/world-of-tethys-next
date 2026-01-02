'use client';

import { useTethys } from '@/context/TethysContext';
import AncientArchive from '@/components/AncientArchive';

// Temporary Mock Data (Until your WP CPT is fully populated)
const ARTIFACTS = [
  { 
    id: 101, 
    title: "Jairo's Last Confession", 
    type: "audio", 
    cost: 25, 
    url: "/audio/jairo_log.mp3" // Ensure this file exists in public/audio/
  },
  { 
    id: 102, 
    title: "Sector 4: Deep Sluice Map", 
    type: "document", 
    cost: 50, 
    url: "/docs/sector-4-map.pdf" 
  }
];

export default function ArchivesPage() {
  const { resin, unlockedArtifacts, burnResin } = useTethys();

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-[#3d3834] pb-6">
        <div>
          <h1 className="text-4xl md:text-6xl font-header text-forge-intense mb-2">
            Recovered History
          </h1>
          <p className="text-stone-500 font-serif italic">
            "Knowledge requires sacrifice. Burn your resin to see the truth."
          </p>
        </div>
        
        {/* RESIN BALANCE DISPLAY */}
        <div className="mt-6 md:mt-0 text-right">
          <div className="text-[10px] uppercase tracking-widest text-stone-500 mb-1">Spirit Resin Pouch</div>
          <div className="text-3xl font-mono text-forge-orange drop-shadow-md">
            {resin} <span className="text-sm align-middle opacity-50">R</span>
          </div>
        </div>
      </div>

      {/* THE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {ARTIFACTS.map((item) => (
          <AncientArchive
            key={item.id}
            {...item}
            userBalance={resin}
            isUnlocked={unlockedArtifacts.includes(item.id)}
            onUnlock={() => burnResin(item.cost, item.id)}
          />
        ))}
      </div>

    </div>
  );
}