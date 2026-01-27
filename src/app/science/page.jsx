'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Map, Dna, Box, FileJson, FileText, Terminal, ArrowLeft, Cloud, Leaf, Waves, Library } from 'lucide-react';
import Link from 'next/link';
import PterosDashboard from '@/components/page-specific/science/PterosDashboard';
import PaleoRealityCheck from '@/components/page-specific/science/PaleoRealityCheck';
import PaleoGIS from '@/components/page-specific/science/PaleoGIS';
import VRConsole from '@/components/page-specific/science/VRConsole';
import AssetCrate from '@/components/page-specific/science/AssetCrate';
import ScientificJournal from '@/components/content/ScientificJournal';
import HerbariumArchive from '@/components/content/HerbariumArchive';
import CaveWallTerminal from '@/components/page-specific/science/CaveWallTerminal';
import ProxyCityWeatherPanel from '@/components/weather/ProxyCityWeatherPanel';
import { ASSET_MANIFEST } from '@/lib/assets-manifest';
import cdn from '@/lib/cdn';
import PrimaryNav from '@/components/layout/navigation/PrimaryNav';
import BreadcrumbTrail from '@/components/layout/BreadcrumbTrail';
import TriFoldNav from '@/components/layout/navigation/TriFoldNav';
import ArtifactViewer from '@/components/features/vr/ArtifactViewer';
import { selectLoreSeeds, getDefaultLoreContext, getOrganismAnalogs } from '@/lib/lore-seed-runtime';
import { TETHYS_FOOD_WEB_ANALOGS } from '@/data/tethys-food-web';

const TAB_CONFIG = [
  { id: 'telemetry', label: 'LIVE FEED', icon: Activity, panelId: 'panel-telemetry' },
  { id: 'weather', label: 'WEATHER', icon: Cloud, panelId: 'panel-weather' },
  { id: 'geo', label: 'GIS MAP', icon: Map, panelId: 'panel-geo' },
  { id: 'paleo', label: 'VALIDATOR', icon: Dna, panelId: 'panel-paleo' },
  { id: 'foodweb', label: 'FOOD WEB', icon: Waves, panelId: 'panel-foodweb' },
  { id: 'analogs', label: 'ANALOGS', icon: Library, panelId: 'panel-analogs' },
  { id: 'herbarium', label: 'HERBARIUM', icon: Leaf, panelId: 'panel-herbarium' },
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
  const loreContext = useMemo(() => getDefaultLoreContext(), []);
  const foodWebSeeds = useMemo(
    () =>
      selectLoreSeeds({
        ui: 'science',
        context: loreContext,
        cluster: 'tethys-food-web',
        limit: 10
      }),
    [loreContext]
  );
  const analogs = useMemo(() => getOrganismAnalogs(), []);
  const [analogRegion, setAnalogRegion] = useState('all');
  const [analogSort, setAnalogSort] = useState('tethys');
  const analogRegions = useMemo(() => {
    const regionSet = new Set();
    analogs.forEach((analog) => (analog.regions || []).forEach((r) => regionSet.add(r)));
    return Array.from(regionSet).sort();
  }, [analogs]);
  const filteredAnalogs = useMemo(() => {
    const base =
      analogRegion === 'all'
        ? analogs
        : analogs.filter((analog) => (analog.regions || []).includes(analogRegion));
    const sorted = [...base];
    if (analogSort === 'region') {
      sorted.sort((a, b) => {
        const ar = (a.regions || [])[0] || '';
        const br = (b.regions || [])[0] || '';
        return ar.localeCompare(br) || (a.tethys || '').localeCompare(b.tethys || '');
      });
    } else {
      sorted.sort((a, b) => (a.tethys || '').localeCompare(b.tethys || ''));
    }
    return sorted;
  }, [analogRegion, analogSort, analogs]);

  useEffect(() => {
    const timer = setTimeout(() => setBooted(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const scrollToTab = (tabId) => {
    if (typeof window === 'undefined') return;
    const target = document.getElementById(`panel-${tabId}`);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash?.replace('#', '');
    if (!hash) return;
    const exists = TAB_CONFIG.some((entry) => entry.id === hash);
    if (!exists) return;
    setActiveTab(hash);
    requestAnimationFrame(() => scrollToTab(hash));
  }, []);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (typeof window === 'undefined') return;
    window.history.replaceState(null, '', `#${tabId}`);
    scrollToTab(tabId);
  };

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
                  onClick={handleTabChange}
                />
              ))}
          </nav>
        </header>

        <main role="main" id="main-content" className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <section className="mb-8 rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/40 via-black/60 to-black/40 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-400 font-bold">
                    Tethys Timeline
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold text-cyan-100 mt-2">
                    Deep Time → Estuary Descent
                  </h2>
                  <p className="text-sm text-cyan-300/80 mt-3 max-w-2xl">
                    An animated geological arc that compresses Earth’s deep time and resolves at 111 MYA.
                    The sequence transitions into the Tethys estuary.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href="/timeline"
                    className="px-5 py-2 rounded-full border border-cyan-400/60 text-xs uppercase tracking-[0.25em] text-cyan-200 hover:bg-cyan-400/10 transition-colors"
                  >
                    View Timeline
                  </Link>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-cyan-500">
                    Opener
                  </span>
                </div>
              </div>
            </section>
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
                            mediaId="trailer_sky_city_melden"
                            title="Sky City: Melden"
                            type="video"
                            src="https://world-of-tethys-site.s3.us-east-1.amazonaws.com/video/Sky-City-Melden.MP4"
                            thumbnail={cdn('/img/locations/A_Cambria_Seal.png')}
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

                  {activeTab === 'foodweb' && (
                    <div className="space-y-8">
                      <div className="rounded-2xl border border-cyan-900/40 bg-black/60 p-6">
                        <h3 className="text-xs uppercase tracking-[0.3em] text-cyan-400 font-bold mb-4">
                          Sulfidic Tethys Food Web
                        </h3>
                        <p className="text-sm text-cyan-300/80 max-w-3xl">
                          Analog nodes derived from shallow Tethys sulfur basins. Use these to anchor
                          creature behavior, hazards, and traversal rules in the map.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="border border-cyan-900/40 bg-black/60 rounded-2xl p-6">
                          <h4 className="text-[10px] uppercase tracking-[0.3em] text-cyan-500 mb-4">
                            Food Web Nodes
                          </h4>
                          <div className="space-y-4 text-sm text-cyan-200/80">
                            {TETHYS_FOOD_WEB_ANALOGS.map((node) => (
                              <div key={node.id} className="border border-cyan-900/30 rounded-lg p-4">
                                <p className="text-cyan-100 font-semibold">{node.tethys}</p>
                                <p className="text-[11px] text-cyan-500 mt-1">
                                  Analog: {node.realWorld}
                                </p>
                                <p className="text-[11px] text-cyan-300/80 mt-2">
                                  {node.role}
                                </p>
                                <div className="mt-3 flex flex-wrap gap-2 text-[9px] uppercase tracking-[0.25em] text-cyan-500">
                                  {node.regions.map((region) => (
                                    <span key={`${node.id}-${region}`} className="border border-cyan-900/40 px-2 py-1 rounded-full">
                                      {region.replace(/_/g, ' ')}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="border border-cyan-900/40 bg-black/60 rounded-2xl p-6">
                          <h4 className="text-[10px] uppercase tracking-[0.3em] text-cyan-500 mb-4">
                            Field Notes (111 MYA)
                          </h4>
                          <div className="space-y-3 text-[11px] text-cyan-200/80">
                            {foodWebSeeds.length ? (
                              foodWebSeeds.map((seed) => (
                                <div key={seed.id} className="border-l border-cyan-800/60 pl-3">
                                  {seed.text}
                                </div>
                              ))
                            ) : (
                              <div className="text-cyan-500/70">No food web packets loaded.</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'analogs' && (
                    <div className="space-y-8">
                      <div className="rounded-2xl border border-cyan-900/40 bg-black/60 p-6">
                        <h3 className="text-xs uppercase tracking-[0.3em] text-cyan-400 font-bold mb-4">
                          Real‑World Analogs
                        </h3>
                        <p className="text-sm text-cyan-300/80 max-w-3xl">
                          Direct lineage anchors for Tethys organisms, biomes, and medicines.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-3 text-[10px] uppercase tracking-[0.25em] text-cyan-400">
                          <label className="flex items-center gap-2 border border-cyan-900/40 px-3 py-2 rounded-full">
                            Region
                            <select
                              value={analogRegion}
                              onChange={(e) => setAnalogRegion(e.target.value)}
                              className="bg-transparent text-cyan-200 outline-none"
                            >
                              <option value="all">All</option>
                              {analogRegions.map((region) => (
                                <option key={region} value={region}>
                                  {region}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label className="flex items-center gap-2 border border-cyan-900/40 px-3 py-2 rounded-full">
                            Sort
                            <select
                              value={analogSort}
                              onChange={(e) => setAnalogSort(e.target.value)}
                              className="bg-transparent text-cyan-200 outline-none"
                            >
                              <option value="tethys">Tethys A–Z</option>
                              <option value="region">Region A–Z</option>
                            </select>
                          </label>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredAnalogs.map((analog) => (
                          <div
                            key={analog.id}
                            className="border border-cyan-900/40 bg-black/60 rounded-2xl p-5"
                          >
                            <div className="text-[11px] uppercase tracking-[0.25em] text-cyan-500">
                              {analog.tethys}
                            </div>
                            <div className="mt-2 text-cyan-100 font-semibold">
                              {analog.realWorld}
                            </div>
                            {analog.note ? (
                              <p className="mt-2 text-[11px] text-cyan-300/80">
                                {analog.note}
                              </p>
                            ) : null}
                            <div className="mt-3 flex flex-wrap gap-2 text-[9px] uppercase tracking-[0.25em] text-cyan-500">
                              {(analog.regions || []).map((region) => (
                                <span
                                  key={`${analog.id}-${region}`}
                                  className="border border-cyan-900/40 px-2 py-1 rounded-full"
                                >
                                  {region.replace(/_/g, ' ')}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'herbarium' && (
                    <div className="max-w-6xl mx-auto">
                      <HerbariumArchive />
                    </div>
                  )}

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
                    <div className="max-w-5xl mx-auto space-y-8">
                      <div className="border border-cyan-900/40 bg-black/60 rounded-2xl p-6">
                        <h3 className="text-xs uppercase tracking-[0.3em] text-cyan-400 font-bold mb-4">
                          Living Artifact Viewer
                        </h3>
                        <ArtifactViewer />
                        <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-600 mt-4">
                          Model: /public/models/staff_base.glb
                        </p>
                      </div>
                      <div className="border-t border-cyan-900/40 pt-6">
                        <h3 className="text-xs uppercase tracking-widest text-cyan-600 mb-4 font-mono">
                          Raw Metadata Stream
                        </h3>
                        <VRConsole />
                      </div>
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
