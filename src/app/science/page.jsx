// src/app/science/page.jsx
'use client';

import React, { useState } from 'react';
import TriFoldNav from '@/components/TriFoldNav';
import PaleoRealityCheck from '@/components/PaleoRealityCheck';
import PterosDashboard from '@/components/PterosDashboard'; // Ensure this export exists
import MineralMap from '@/components/MineralMap';
import FungalProxyPanel from '@/components/FungalProxyPanel';
import CinematicTerminal from '@/components/CinematicTerminal';
import AssetCrate from '@/components/AssetCrate'; // Or Terminal
import { FlaskConical, Globe, Dna } from 'lucide-react';


import { ASSET_MANIFEST } from '@/lib/asset-manifest';

export default function SciencePage() {
  const [activeTab, setActiveTab] = useState('data'); // data, map, fossil

  return (
    <main className="min-h-screen bg-[#0c0a09] text-[#e7e5e4] font-sans pt-20 pb-12 px-6">
      
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-black text-cyan-500 uppercase tracking-tighter mb-4">
          Field Station Alpha
        </h1>
        <p className="text-stone-400 text-sm max-w-xl mx-auto">
          For the researchers. Compare Tethys lore against the fossil record, monitor real-time estuary data, and analyze the mineral anchors.
        </p>
      </header>

      <TriFoldNav />

      {/* Internal Science Nav */}
      <div className="flex justify-center gap-4 mb-8">
        <button onClick={() => setActiveTab('data')} className={`px-4 py-2 text-xs uppercase tracking-widest border rounded ${activeTab === 'data' ? 'border-cyan-500 text-cyan-400' : 'border-stone-800 text-stone-500'}`}>
          <FlaskConical size={14} className="inline mr-2" /> Live Telemetry
        </button>
        <button onClick={() => setActiveTab('map')} className={`px-4 py-2 text-xs uppercase tracking-widest border rounded ${activeTab === 'map' ? 'border-cyan-500 text-cyan-400' : 'border-stone-800 text-stone-500'}`}>
          <Globe size={14} className="inline mr-2" /> Geo-Spatial
        </button>
        <button onClick={() => setActiveTab('fossil')} className={`px-4 py-2 text-xs uppercase tracking-widest border rounded ${activeTab === 'fossil' ? 'border-cyan-500 text-cyan-400' : 'border-stone-800 text-stone-500'}`}>
          <Dna size={14} className="inline mr-2" /> Paleo-Validator
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        {activeTab === 'data' && (
          <div className="space-y-12 animate-in fade-in">
            <PterosDashboard />
            <div className="grid md:grid-cols-2 gap-8">
            <section className="mb-12">
  <h2 className="text-2xl text-cyan-500 font-display mb-6">Classified Footage</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <CinematicTerminal 
      videoId="YOUR_YOUTUBE_ID" // e.g. dQw4w9WgXcQ
      title="The Weep: Surveillance Log 4"
      thumbnail="/img/video-thumb-1.jpg"
    />
  </div>
</section>



// ... inside your page layout
<section>
  <h2 className="text-2xl text-cyan-500 font-display mb-6 border-b border-stone-800 pb-2">
    Restricted Archive Access
  </h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {ASSET_MANIFEST.map((asset) => (
      <AssetCrate key={asset.id} asset={asset} />
    ))}
  </div>
</section>




               <div className="bg-[#1c1917] p-6 rounded border border-stone-800">
                 <h3 className="text-cyan-600 font-bold uppercase text-xs tracking-widest mb-4">Real-World Mycology</h3>
                 <FungalProxyPanel />
               </div>
               {/* Placeholder for future Atmospheric Data */}
               <div className="bg-[#1c1917] p-6 rounded border border-stone-800 flex items-center justify-center text-stone-600 text-xs uppercase tracking-widest">
                 Atmospheric Sensors Offline
               </div>
            </div>
          </div>
        )}

        {activeTab === 'map' && (
          <div className="animate-in fade-in">
            <MineralMap />
          </div>
        )}

        {activeTab === 'fossil' && (
          <div className="animate-in fade-in max-w-4xl mx-auto">
            <PaleoRealityCheck />
          </div>
        )}
      </div>

    </main>
  );
}