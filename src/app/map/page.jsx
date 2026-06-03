'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import BreadcrumbTrail from '@/components/layout/BreadcrumbTrail';
import LoreRevealPanel from '@/components/features/map/LoreRevealPanel';
import { MAP_FRAGMENTS } from '@/components/features/map/TethysNexus';
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
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [currentLocation, setCurrentLocation] = useState('pteros');
  const [panelOpen, setPanelOpen] = useState(false);

  const handleTravel = useCallback((region) => {
    setCurrentLocation(region);
    setSelectedRegion(region);
    setPanelOpen(true);
  }, []);

  const handleInspect = useCallback((region) => {
    setSelectedRegion(region);
    setPanelOpen(true);
  }, []);

  const selectedFragment = MAP_FRAGMENTS.find(
    (f) => f.region === selectedRegion
  );

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
          />

          {/* Region hint bar */}
          {selectedFragment && (
            <div className="mt-3 flex items-center gap-3 rounded-xl border border-stone-800 bg-[#0a0908]/80 px-4 py-2.5 text-[12px] font-mono text-stone-300">
              <span className="text-amber-400 tracking-wider uppercase text-[10px]">
                Viewing
              </span>
              <span className="text-white font-semibold">{selectedFragment.label}</span>
              {selectedFragment.coords && (
                <span className="ml-auto text-stone-600 text-[10px]">
                  {selectedFragment.coords.lat.toFixed(1)}°N /{' '}
                  {selectedFragment.coords.lng.toFixed(1)}°E
                </span>
              )}
            </div>
          )}
        </div>

        {/* Lore reveal panel */}
        <aside
          className={`transition-all duration-500 xl:sticky xl:top-[64px] ${
            panelOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none xl:opacity-100 xl:translate-y-0 xl:pointer-events-auto'
          }`}
        >
          <LoreRevealPanel />
        </aside>
      </main>
    </div>
  );
}
// World of Tethys || D.C. Barletta
