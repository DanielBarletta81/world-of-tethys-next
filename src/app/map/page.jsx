'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import BreadcrumbTrail from '@/components/layout/BreadcrumbTrail';
import LoreRevealPanel from '@/components/features/map/LoreRevealPanel';
import IdentityAirLock from '@/components/forms/IdentityAirLock';
import { getRegion } from '@/data/region-registry';
import { useDwellTracker } from '@/hooks/useDwellTracker';
import { useVolcanoStatus } from '@/hooks/useVolcanoStatus';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

// TethysNexus relies on MapLibre (browser-only) — load client-side only
const TethysNexus = dynamic(
  () => import('@/components/features/map/TethysNexus'),
  { ssr: false, loading: () => <MapSkeleton /> }
);

const MAP_BREADCRUMB = [
  { label: 'Home', href: '/' },
  { label: 'Atlas', href: '/map', current: true },
];

function MapSkeleton() {
  return (
    <div className="w-full h-[80vh] rounded-2xl bg-[#050505] border border-stone-800 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-stone-500">
        <div className="w-10 h-10 rounded-full border-2 border-stone-700 border-t-amber-600 animate-spin" />
        <span className="text-[11px] uppercase tracking-[0.3em] font-mono">
          Loading Atlas
        </span>
      </div>
    </div>
  );
}

export default function MapPage() {
  const { user } = useAuth();
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [currentLocation, setCurrentLocation] = useState('pteros');
  const [panelOpen, setPanelOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [unlockedHidden, setUnlockedHidden] = useState(new Set()); // e.g. Set(['oracle-pool'])
  const [stillnessLevel, setStillnessLevelState] = useState(0);

  const handleHiddenUnlock = useCallback((regionId, locationId) => {
    setUnlockedHidden((prev) => new Set([...prev, locationId]));
  }, []);

  const { onRegionChange, onStillnessChange: rawOnStillnessChange, onLorePanelOpen } = useDwellTracker({
    userId: user?.uid ?? null,
    onHiddenUnlock: handleHiddenUnlock,
  });

  const onStillnessChange = useCallback((level) => {
    setStillnessLevelState(level);
    rawOnStillnessChange(level);
  }, [rawOnStillnessChange]);

  const { tethys: volcanoTethys, merapi, loading: volcanoLoading } = useVolcanoStatus();

  const handleTravel = useCallback((region) => {
    setCurrentLocation(region);
    setSelectedRegion(region);
    setPanelOpen(true);
    onRegionChange(region);
  }, [onRegionChange]);

  const handleInspect = useCallback((region) => {
    setSelectedRegion(region);
    setPanelOpen(true);
    onRegionChange(region);
  }, [onRegionChange]);

  const handleLorePanelOpen = useCallback((regionId) => {
    onLorePanelOpen(regionId);
  }, [onLorePanelOpen]);

  const selectedFragment = getRegion(selectedRegion);
  const [mycorrhizalActive, setMycorrhizalActive] = useState(false);
  const [foodWebActive, setFoodWebActive] = useState(false);

  return (
    <div className="min-h-screen bg-[#050403] text-slate-100 overflow-x-hidden">
      {/* Skip nav */}
      <a
        href="#map-canvas"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-orange-600 focus:text-white focus:rounded"
      >
        Skip to map
      </a>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/5 bg-[#050403]/90 backdrop-blur-md px-4 py-3 flex items-center justify-between gap-4">
        <BreadcrumbTrail trail={MAP_BREADCRUMB} />
        <Link
          href="/"
          className="text-[10px] uppercase tracking-[0.3em] font-mono text-stone-500 hover:text-amber-300 transition-colors"
        >
          ← Portal
        </Link>
      </header>

      {/* Title band */}
      <section className="px-4 pt-8 pb-4 max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-amber-300 via-orange-400 to-red-600 mb-1">
          Tethys Atlas
        </h1>
        <p className="text-[13px] text-stone-400 font-mono tracking-wide max-w-2xl">
          Navigate regions, unlock lore fragments, and trace the living geology
          of the Cretaceous Tethys. Click a marker to explore.
        </p>
      </section>

      {/* Map + panel layout */}
      <main
        id="map-canvas"
        className="max-w-7xl mx-auto px-4 pb-16 grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4 items-start"
      >
        {/* Map canvas */}
        <div className="w-full">
          <TethysNexus
            currentLocation={currentLocation}
            onTravel={handleTravel}
            onInspect={handleInspect}
            onStillnessChange={onStillnessChange}
            mycorrhizalActive={mycorrhizalActive}
            foodWebActive={foodWebActive}
            rumbleIntensity={volcanoTethys.rumbleIntensity}
            stormFrontActive={volcanoTethys.stormFrontActive}
            stormFrontIntensity={volcanoTethys.stormFrontIntensity}
            cloudIntensity={volcanoTethys.cloudIntensity}
            weatherMistBoost={volcanoTethys.weatherMistBoost}
          />

          {/* Region hint bar */}
          {selectedFragment && (
            <div className="mt-3 flex items-center gap-3 rounded-xl border border-stone-800 bg-[#0a0908]/80 px-4 py-2.5 text-[12px] font-mono text-stone-300">
              <span className="text-amber-400 tracking-wider uppercase text-[10px]">
                {selectedFragment.lore.era}
              </span>
              <span className="text-white font-semibold">{selectedFragment.label}</span>
              <span className="text-stone-500 text-[11px] hidden sm:inline">{selectedFragment.sublabel}</span>
              {selectedFragment.coords && (
                <span className="ml-auto text-stone-600 text-[10px]">
                  {selectedFragment.coords.lat.toFixed(1)}° /{' '}
                  {selectedFragment.coords.lng.toFixed(1)}°
                </span>
              )}
            </div>
          )}
          {/* Live Watcher status strip */}
          {!volcanoLoading && merapi && (
            <div className={`mt-2 flex items-center gap-3 rounded-xl border px-4 py-2 text-[11px] font-mono transition-colors ${
              merapi.alertLevel >= 4 ? 'border-red-700/60 bg-red-950/30 text-red-300' :
              merapi.alertLevel >= 3 ? 'border-orange-700/60 bg-orange-950/30 text-orange-300' :
              merapi.alertLevel >= 2 ? 'border-amber-700/60 bg-amber-950/30 text-amber-300' :
              'border-stone-800 bg-stone-900/40 text-stone-500'
            }`}>
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                merapi.alertLevel >= 4 ? 'bg-red-500 animate-pulse' :
                merapi.alertLevel >= 3 ? 'bg-orange-500 animate-pulse' :
                merapi.alertLevel >= 2 ? 'bg-amber-400' : 'bg-stone-600'
              }`} />
              <span className="uppercase tracking-[0.2em] text-[9px]">Watcher ·</span>
              <span>{volcanoTethys.label}</span>
              {merapi.ashColumnM > 0 && (
                <span className="text-stone-500">· {merapi.ashColumnM.toLocaleString()}m ash</span>
              )}
              <span className="ml-auto text-stone-700 text-[9px] hidden md:inline truncate max-w-xs">{volcanoTethys.tethysLore}</span>
            </div>
          )}        </div>

        {/* Lore reveal panel */}
        <aside
          className={`transition-all duration-500 xl:sticky xl:top-[64px] ${
            panelOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none xl:opacity-100 xl:translate-y-0 xl:pointer-events-auto'
          }`}
        >
          <LoreRevealPanel
            selectedRegionId={selectedRegion}
            onRegionOpen={handleLorePanelOpen}
            onSignIn={() => setShowLogin(true)}
            mycorrhizalActive={mycorrhizalActive}
            onMycorrhizalChange={setMycorrhizalActive}
            foodWebActive={foodWebActive}
            onFoodWebChange={setFoodWebActive}
            unlockedHidden={unlockedHidden}
            stillnessLevel={stillnessLevel}
            rumbleIntensity={volcanoTethys.rumbleIntensity}
            stormFrontActive={volcanoTethys.stormFrontActive}
          />
        </aside>
      </main>

      {/* IdentityAirLock — only opens when triggered from panel auth nudge */}
      <IdentityAirLock isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
}
// World of Tethys || D.C. Barletta
