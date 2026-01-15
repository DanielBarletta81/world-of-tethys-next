'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Map, Dna, Box, FileJson, FileText, Terminal, ArrowLeft, Cloud } from 'lucide-react';
import Link from 'next/link';
import PterosDashboard from '@/components/page-specific/science/PterosDashboard';
import PaleoRealityCheck from '@/components/page-specific/science/PaleoRealityCheck';
import PaleoGIS from '@/components/page-specific/science/PaleoGIS';
import VRConsole from '@/components/page-specific/science/VRConsole';
import AssetCrate from '@/components/page-specific/science/AssetCrate';
import ScientificJournal from '@/components/content/ScientificJournal';
import CaveWallTerminal from '@/components/page-specific/science/CaveWallTerminal';
import ProxyCityWeatherPanel from '@/components/weather/ProxyCityWeatherPanel';
import { ASSET_MANIFEST } from '@/lib/assets-manifest';
import cdn from '@/lib/cdn';
import PrimaryNav from '@/components/layout/navigation/PrimaryNav';
import BreadcrumbTrail from '@/components/layout/BreadcrumbTrail';
import TriFoldNav from '@/components/layout/navigation/TriFoldNav';

const TAB_CONFIG = [
  { id: 'telemetry', label: 'LIVE FEED', icon: Activity, panelId: 'panel-telemetry' },
  { id: 'weather', label: 'WEATHER', icon: Cloud, panelId: 'panel-weather' },
  { id: 'geo', label: 'GIS MAP', icon: Map, panelId: 'panel-geo' },
  { id: 'paleo', label: 'VALIDATOR', icon: Dna, panelId: 'panel-paleo' },
  { id: 'journal', label: 'LOGS', icon: FileText, panelId: 'panel-journal' },
  { id: 'archives', label: 'ASSETS', icon: Box, panelId: 'panel-archives' },
  { id: 'vr', label: 'VR LINK', icon: FileJson, panelId: 'panel-vr' }
];

const SCIENCE_BREADCRUMB = [
  { label: 'Home', href: '/' },
  { label: 'Science', href: '/science', current: true }
];

export default function FieldStationPage() {
  const [activeTab, setActiveTab] = useState('telemetry');
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setBooted(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const currentTabInfo = TAB_CONFIG.find((tab) => tab.id === activeTab);

  return (
    <main className="min-h-screen relative font-mono text-cyan-50 overflow-hidden bg-black selection:bg-cyan-900 selection:text-white">
      <div className="fixed inset-0 z-0">

        <div
          className="absolute inset-0 bg-cover bg-center opacity-60 scale-105"
         // style={{ backgroundImage: `url(${cdn('/img/bg/fossil-lab.jpg')})` }}
        />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-30 mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050607] via-[#050607]/80 to-transparent" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="max-w-7xl mx-auto w-full px-4 md:px-6 space-y-3">
          <PrimaryNav className="mb-4" />
          <BreadcrumbTrail trail={SCIENCE_BREADCRUMB} />
        </div>
        <header role="banner" className="flex flex-col md:flex-row justify-between items-end border-b border-cyan-500/20 bg-[#050607]/80 backdrop-blur-md px-6 py-4 sticky top-0 z-50">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-cyan-600 hover:text-cyan-400 transition-colors" aria-label="Return to home">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold tracking-tighter text-white flex items-center gap-3">
                <Terminal className="text-cyan-500" /> Pteros FIELD STATION
              </h1>
              <p className="text-[10px] text-cyan-400 uppercase tracking-[0.3em] mt-1 flex gap-4">
                <span>// SITE: PTEROS HATCHERY</span>
                <span>// AGE: 111.4 MYA</span>
              </p>
            </div>
          </div>

          <nav
            role="tablist"
            aria-label="Field station sections"
            className="flex gap-1 mt-4 md:mt-0 overflow-x-auto max-w-full hide-scrollbar"
          >
            {TAB_CONFIG.map((tab) => (
              <TabButton
                key={tab.id}
                id={tab.id}
                panelId={tab.panelId}
                label={tab.label}
                icon={<tab.icon size={14} aria-hidden />}
                active={activeTab}
                onClick={setActiveTab}
              />
            ))}
          </nav>
        </header>

        <main role="main" id="main-content" className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              {!booted ? (
                <motion.div
                  key="boot"
                  exit={{ opacity: 0 }}
                  className="h-[60vh] flex items-center justify-center text-cyan-500/50"
                >
                  <div className="flex flex-col items-center gap-4">
                    <Activity size={48} className="animate-pulse" />
                    <span className="text-xs uppercase tracking-[0.5em] animate-pulse">Initializing Systems...</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  role="tabpanel"
                  id={currentTabInfo?.panelId || `panel-${activeTab}`}
                  aria-labelledby={`tab-${activeTab}`}
                  tabIndex={0}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === 'telemetry' && (
                    <div className="space-y-8">
                      <PterosDashboard />

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                          <h3 className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-4 border-l-2 border-cyan-500 pl-3">
                            Latest Recovery
                          </h3>
                          <CaveWallTerminal
                            mediaId="trailer_weep_01"
                            title="Expedition Log: The Weep"
                            type="video"
                            src="https://www.youtube.com/embed/aAbtMoKsNw4?modestbranding=1&rel=0&controls=0"
                            thumbnail={cdn('/img/bg/obsidian-coast-4k.jpg')}
                            rewards={{ lore: 25, kith: 10 }}
                          />
                        </div>

                        <div className="bg-cyan-950/20 border border-cyan-900/30 p-6 rounded-lg flex items-center justify-center text-cyan-700/50 text-xs uppercase tracking-widest font-bold">
                          [ Awaiting Drone Feed 02 ]
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'weather' && (
                    <div
                      className="space-y-6"
                      role="region"
                      aria-live="polite"
                      aria-label="Proxy city weather network"
                    >
                      <div className="bg-cyan-950/20 border border-cyan-500/20 rounded-lg p-6">
                        <h2 className="text-xl font-bold text-cyan-400 mb-2 flex items-center gap-2">
                          <Cloud size={20} />
                          Proxy City Weather Network
                        </h2>
                        <p className="text-xs text-cyan-600 mb-4">
                          Real-world weather conditions from locations mirroring Tethys regions. 
                          Use this data to assess survivability before selecting map locations.
                        </p>
                      </div>
                      <ProxyCityWeatherPanel showAllCities={true} />
                    </div>
                  )}

                  {activeTab === 'geo' && (
                    <div className="h-[75vh] border border-cyan-900/50 rounded-lg overflow-hidden bg-black/80">
                      <PaleoGIS />
                    </div>
                  )}

                  {activeTab === 'journal' && <ScientificJournal />}

                  {activeTab === 'paleo' && (
                    <div className="max-w-4xl mx-auto">
                      <PaleoRealityCheck />
                    </div>
                  )}

                  {activeTab === 'archives' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {ASSET_MANIFEST.map((asset) => (
                        <AssetCrate key={asset.id} asset={asset} />
                      ))}
                    </div>
                  )}

                  {activeTab === 'vr' && (
                    <div className="max-w-3xl mx-auto">
                      <VRConsole />
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </main>
  );
}

function TabButton({ id, panelId, label, icon, active, onClick }) {
  const isActive = active === id;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-controls={panelId}
      id={`tab-${id}`}
      tabIndex={isActive ? 0 : -1}
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 px-5 py-3 text-[10px] uppercase tracking-[0.15em] font-bold transition-all whitespace-nowrap border-t-2 ${
        isActive
          ? 'bg-cyan-950/40 border-cyan-400 text-cyan-100 shadow-[0_10px_20px_-10px_rgba(34,211,238,0.2)]'
          : 'bg-transparent border-transparent text-cyan-700 hover:text-cyan-400 hover:bg-cyan-950/20'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
