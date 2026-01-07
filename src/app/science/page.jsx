'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Map, Dna, Box, MonitorPlay, FileJson } from 'lucide-react';
import TriFoldNav from '@/components/TriFoldNav';
import PterosDashboard from '@/components/PterosDashboard';
import PaleoRealityCheck from '@/components/PaleoRealityCheck';
import PaleoGIS from '@/components/PaleoGIS'; // The new GIS
import VRConsole from '@/components/VRConsole'; // The new Bridge
import AssetCrate from '@/components/AssetCrate';
import CinematicTerminal from '@/components/CinematicTerminal';
import { ASSET_MANIFEST } from '@/lib/assets-manifest'; // Ensure this file exists

export default function FieldStationPage() {
  const [activeTab, setActiveTab] = useState('telemetry');

  return (
    <main className="min-h-screen bg-[#080a0c] text-cyan-50 font-sans selection:bg-cyan-900 selection:text-white pb-24">
      
      {/* 1. Header: The Lab Interface */}
      <header className="pt-28 pb-12 px-6 border-b border-cyan-900/20 bg-[#050607]">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-xs font-mono text-cyan-600 uppercase tracking-[0.3em] mb-2">
            Sector 4: Research & Analysis
          </p>
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-cyan-100 to-cyan-900 uppercase tracking-tighter mb-8">
            Field Station Alpha
          </h1>
          <TriFoldNav />
        </div>
      </header>

      {/* 2. The Control Deck (Tabs) */}
      <div className="sticky top-0 z-40 bg-[#080a0c]/90 backdrop-blur border-b border-cyan-900/30 mb-12">
        <div className="max-w-5xl mx-auto flex justify-start md:justify-center gap-2 p-2 overflow-x-auto hide-scrollbar">
          <TabButton id="telemetry" label="Telemetry" icon={<Activity size={14} />} active={activeTab} onClick={setActiveTab} />
          <TabButton id="geo" label="Paleo-GIS" icon={<Map size={14} />} active={activeTab} onClick={setActiveTab} />
          <TabButton id="paleo" label="Validator" icon={<Dna size={14} />} active={activeTab} onClick={setActiveTab} />
          <TabButton id="archives" label="Assets" icon={<Box size={14} />} active={activeTab} onClick={setActiveTab} />
          <TabButton id="vr" label="VR Link" icon={<FileJson size={14} />} active={activeTab} onClick={setActiveTab} />
        </div>
      </div>

      {/* 3. Main Display Port */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 min-h-[60vh]">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: LIVE TELEMETRY */}
          {activeTab === 'telemetry' && (
            <motion.div 
              key="telemetry"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-12"
            >
              <PterosDashboard />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 border-t border-cyan-900/30 pt-12">
                <div>
                  <h3 className="text-xl text-cyan-400 font-display uppercase tracking-widest mb-4 flex items-center gap-2">
                    <MonitorPlay size={18} /> Recovered Footage
                  </h3>
                  <p className="text-sm text-cyan-700/80 mb-6 max-w-md leading-relaxed">
                    Drone feeds recovered from the '98 expedition. Most files corrupted. 
                    Audio analysis suggests biological interference.
                  </p>
                </div>
                <CinematicTerminal 
                  videoId="aAbtMoKsNw4" 
                  title="Expedition Log: The Weep" 
                  thumbnail="/img/bg/obsidian-coast-4k.jpg" 
                />
              </div>
            </motion.div>
          )}

          {/* TAB 2: GEO-SPATIAL (GIS) */}
          {activeTab === 'geo' && (
            <motion.div 
              key="geo"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-6"
            >
              <div className="bg-cyan-950/10 border border-cyan-900/30 p-4 rounded text-center mb-6">
                <p className="text-cyan-400 text-xs font-mono uppercase tracking-widest">
                  // IMMERSION BREAK DETECTED // ACCESSING REAL-WORLD DATABASE
                </p>
              </div>
              <PaleoGIS />
            </motion.div>
          )}

          {/* TAB 3: PALEO-VALIDATOR */}
          {activeTab === 'paleo' && (
            <motion.div 
              key="paleo"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="max-w-4xl mx-auto"
            >
              <PaleoRealityCheck />
            </motion.div>
          )}

          {/* TAB 4: ASSETS */}
          {activeTab === 'archives' && (
            <motion.div 
              key="archives"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ASSET_MANIFEST.map((asset) => (
                  <AssetCrate key={asset.id} asset={asset} />
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 5: VR CONSOLE */}
          {activeTab === 'vr' && (
            <motion.div 
              key="vr"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="max-w-3xl mx-auto space-y-6"
            >
              <div className="text-center space-y-2 mb-8">
                <h3 className="text-2xl font-display text-white uppercase tracking-widest">Neural Link</h3>
                <p className="text-stone-400 text-sm">
                  Export your Tethys Metadata for use in external engines (Unreal/Unity).
                </p>
              </div>
              <VRConsole />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </main>
  );
}

// Helper for Tabs
function TabButton({ id, label, icon, active, onClick }) {
  const isActive = active === id;
  return (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 px-6 py-3 text-[10px] md:text-xs uppercase tracking-[0.15em] font-bold transition-all border rounded-sm whitespace-nowrap
        ${isActive 
          ? 'bg-cyan-900/20 border-cyan-500 text-cyan-100 shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
          : 'bg-[#0c0e12] border-cyan-900/30 text-cyan-700 hover:text-cyan-400 hover:border-cyan-700'
        }`}
    >
      {icon}
      {label}
    </button>
  );
}