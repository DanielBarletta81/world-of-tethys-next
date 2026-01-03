'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Microscope, Dna, Leaf, AlertTriangle, ScanEye, RefreshCw } from 'lucide-react';
// Relative import to the file created above
import { fetchFungalProxy } from '../../lib/mycology-engine';

export default function FungalProxyTerminal() {
  const [specimens, setSpecimens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecimen, setSelectedSpecimen] = useState(null);
  const detailRef = useRef(null); // Ref for auto-scrolling on mobile

  const loadData = async () => {
    setLoading(true);
    const data = await fetchFungalProxy();
    if (data && data.length > 0) {
      setSpecimens(data);
      setSelectedSpecimen(data[0]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelect = (spec) => {
    setSelectedSpecimen(spec);
    // On mobile, scroll to the detail view so the user sees the update
    if (window.innerWidth < 768 && detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <div className="w-full h-96 bg-[#050a08] border border-teal-900/30 flex flex-col items-center justify-center text-teal-500/50 font-mono animate-pulse">
        <Microscope size={48} className="mb-4" />
        <span className="uppercase tracking-widest text-xs">Scanning Biomass...</span>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#050a08] border border-teal-900/30 shadow-[0_0_50px_rgba(20,184,166,0.05)] rounded-lg overflow-hidden font-sans text-[#e7e5e4] relative">
      
      {/* HEADER */}
      <div className="bg-[#0f172a] p-4 border-b border-teal-900/30 flex justify-between items-center">
        <h3 className="text-teal-400 text-xs uppercase tracking-[0.2em] flex items-center gap-2 font-bold">
          <Dna size={14} /> Mycology Analog Engine
        </h3>
        <button 
          onClick={loadData} 
          className="text-teal-700 hover:text-teal-400 transition-colors"
          title="Refresh Samples"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      <div className="flex flex-col md:flex-row h-[800px] md:h-[600px]">
        
        {/* LEFT: LIST (The Samples) */}
        <div className="w-full md:w-1/3 h-1/3 md:h-full border-b md:border-b-0 md:border-r border-teal-900/30 overflow-y-auto bg-[#020617]">
          {specimens.map((spec) => (
            <button
              key={spec.id}
              onClick={() => handleSelect(spec)}
              className={`w-full text-left p-4 border-b border-teal-900/20 transition-all hover:bg-teal-950/30 flex items-center gap-3 ${selectedSpecimen?.id === spec.id ? 'bg-teal-950/50 border-l-4 border-l-teal-500' : 'border-l-4 border-l-transparent'}`}
            >
              <div className="w-10 h-10 rounded bg-black border border-teal-900/50 overflow-hidden shrink-0">
                {spec.realWorld.imageUrl ? (
                  <img src={spec.realWorld.imageUrl} alt="Fungi" className="w-full h-full object-cover opacity-80" />
                ) : (
                  <Leaf className="w-full h-full p-2 text-teal-900" />
                )}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-teal-100 truncate">{spec.tethys.name}</div>
                <div className="text-[9px] text-teal-600 uppercase tracking-wider truncate">
                  Base: {spec.realWorld.scientificName}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* RIGHT: DETAIL VIEW (The Analysis) */}
        {selectedSpecimen && (
          <div ref={detailRef} className="w-full md:w-2/3 h-2/3 md:h-full relative bg-[#050a08] flex flex-col">
            
            {/* HERO IMAGE */}
            <div className="h-1/2 relative overflow-hidden group shrink-0">
              {selectedSpecimen.realWorld.imageUrl && (
                <img 
                  src={selectedSpecimen.realWorld.imageUrl} 
                  alt="Specimen" 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700"
                />
              )}
              {/* Overlay Grid */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-20 pointer-events-none"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#050a08] via-transparent to-transparent"></div>
              
              <div className="absolute bottom-4 left-4">
                <div className="bg-black/60 backdrop-blur border border-teal-500/30 px-3 py-1 text-[10px] text-teal-300 uppercase tracking-widest inline-flex items-center gap-2">
                  <ScanEye size={12} /> Visual Match: 99.9%
                </div>
              </div>
            </div>

            {/* DATA PANEL */}
            <div className="flex-1 p-6 md:p-8 overflow-y-auto">
              
              {/* Tethys Identity */}
              <div className="mb-8">
                <h2 className="text-3xl font-serif text-teal-100 mb-2">{selectedSpecimen.tethys.name}</h2>
                <p className="text-emerald-100/60 italic leading-relaxed text-sm border-l-2 border-teal-900/50 pl-4">
                  "{selectedSpecimen.tethys.lore}"
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-[#0f172a] p-3 border border-teal-900/30 rounded">
                  <div className="text-[9px] text-teal-600 uppercase tracking-widest mb-1">Effect</div>
                  <div className="text-sm font-bold text-teal-200">{selectedSpecimen.tethys.effect}</div>
                </div>
                <div className="bg-[#0f172a] p-3 border border-teal-900/30 rounded">
                  <div className="text-[9px] text-purple-600 uppercase tracking-widest mb-1">Toxicity</div>
                  <div className="text-sm font-bold text-purple-300 flex items-center gap-2">
                    {selectedSpecimen.tethys.toxicity === 'Fatal' && <AlertTriangle size={12} />}
                    {selectedSpecimen.tethys.toxicity}
                  </div>
                </div>
                <div className="bg-[#0f172a] p-3 border border-teal-900/30 rounded">
                  <div className="text-[9px] text-amber-700 uppercase tracking-widest mb-1">Growth Substrate</div>
                  <div className="text-sm font-bold text-amber-500">{selectedSpecimen.tethys.substrate}</div>
                </div>
                <div className="bg-[#0f172a] p-3 border border-teal-900/30 rounded">
                  <div className="text-[9px] text-stone-500 uppercase tracking-widest mb-1">Real Analog</div>
                  <div className="text-xs font-mono text-stone-400 truncate" title={selectedSpecimen.realWorld.scientificName}>
                    {selectedSpecimen.realWorld.scientificName}
                  </div>
                </div>
              </div>

              {/* Source Link */}
              <div className="text-right">
                <a 
                  href={`https://www.inaturalist.org/observations/${selectedSpecimen.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[9px] text-teal-800 hover:text-teal-500 uppercase tracking-widest transition-colors"
                >
                  View Original Specimen Data &rarr;
                </a>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}