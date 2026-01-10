// src/app/map/page.js
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useTethys } from '@/context/TethysContext';
import { useAudio } from '@/context/AudioContext';
import { useAuth } from '@/context/AuthContext';
import IdentityAirlock from '@/components/IdentityAirLock';
import TethysNexus from '@/components/TethysNexus';
import StaffSequencer from '@/components/StaffSequencer';
import Incubator from '@/components/Incubator';

import TriFoldNav from '@/components/TriFoldNav';
import RelayLog from '@/components/RelayLog';

const PATH_CONFIG = [
  {
    id: 'sky-city',
    label: 'The Triumvirate',
    src: '/img/icons/sky-city.svg',
    items: ['compass', 'surveyor_lens', 'ledger_page'],
    unlocks: ['sky-city'],
    mapAccess: true
  },
  {
    id: 'stryker',
    label: 'Stryker',
    src: '/img/icons/stryker.svg',
    items: ['climbing_hooks', 'ember_talisman', 'ash_wrap'],
    unlocks: ['the-weep', 'pteros'],
    mapAccess: true
  },
  {
    id: 'mystics',
    label: 'Mystics',
    src: '/img/a symbols/mystics_seal.png',
    items: ['kith_spore', 'fungal_lantern'],
    unlocks: ['mystic-woods'],
    mapAccess: true
  },
  {
    id: 'cambria',
    label: 'Cambria',
    src: '/img/locations/A_Cambria_Symb1.png',
    items: ['archive_key', 'cambria_tablet'],
    unlocks: ['cambria'],
    mapAccess: false,
    redirect: '/science'
  }
];

const BASE_STAFF_STATS = { geology: 4, creature: 4, lore: 4, human: 4 };
const STAFF_INVENTORY_OVERRIDE = ['Map_fragment'];

function resolvePathMode(pathId) {
  if (pathId === 'mystics' || pathId === 'mystic') return 'mystic';
  if (pathId === 'sky-city') return 'city';
  return 'wild';
}

export default function MapPage() {
  const {
    equippedStaff,
    travelTo,
    hasOnboarded,
    loadingData,
    playerProfile,
    setPlayerProfile,
    setEquippedStaff,
    hatchFromTemplate
  } = useTethys();
  const { user, loading: authLoading } = useAuth();
  const { playTrack } = useAudio();
  const [viewState, setViewState] = useState('loading'); // loading, egg, sigil, forge, map, scholar
  const [hoveredSigil, setHoveredSigil] = useState(null);
  const [selectedSigil, setSelectedSigil] = useState(null);
  const [airlockOpen, setAirlockOpen] = useState(false);
  const lastVoRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      setAirlockOpen(true);
    }
  }, [authLoading, user]);

  // 1. Determine Initial State based on User Progress
  useEffect(() => {
    if (loadingData) {
      setViewState('loading');
      return;
    }
    if (playerProfile?.path?.primary === 'cambria' && !playerProfile?.path?.mapAccess) {
      setViewState('scholar');
      return;
    }
    if (hasOnboarded || equippedStaff) {
      setViewState('map');
    } else if (playerProfile?.staff?.activeStaffId) {
      setViewState('map');
    } else {
      setViewState('egg');
    }
  }, [equippedStaff, hasOnboarded, loadingData, playerProfile?.staff?.activeStaffId]);

  // 1a. Voiceover cues per phase (skips if muted)
  useEffect(() => {
    if (loadingData) return;
    if (playerProfile?.voice?.muteVoiceovers) return;
    const cueByState = {
      egg: 'vo_hatch_intro',
      forge: 'vo_forge_primer',
      map: 'vo_atlas_open'
    };
    const nextCue = cueByState[viewState];
    if (!nextCue) return;
    if (lastVoRef.current === nextCue) return;
    lastVoRef.current = nextCue;
    playTrack(nextCue);
  }, [viewState, loadingData, playerProfile?.voice?.muteVoiceovers, playTrack]);

  // 2. Progression Handlers
  const onEggHatch = () => {
    setViewState('sigil');
  };

  const onSigilSelect = (sigilId) => {
    if (selectedSigil) return;
    setSelectedSigil(sigilId);
    setTimeout(() => {
      setViewState('forge');
    }, 700);
  };

  const onStaffComplete = async (profile) => {
    const config = PATH_CONFIG.find((entry) => entry.id === selectedSigil) || PATH_CONFIG[0];
    await hatchFromTemplate('starter_v1', {
      path: config.id,
      items: config.items,
      mapAccess: config.mapAccess
    });

    setEquippedStaff(profile);
    setPlayerProfile((prev) => ({
      ...prev,
      staff: {
        ...prev.staff,
        activeStaffId: profile?.id || prev.staff?.activeStaffId,
        name: profile?.name || prev.staff?.name,
        updatedAt: new Date().toISOString()
      }
    }));

    config.unlocks.forEach((node) => travelTo(node));

    if (config.redirect) {
      router.push(config.redirect);
      return;
    }

    setViewState('map');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0c0a09] p-8 flex items-center justify-center">
        <div className="text-amber-600 animate-pulse uppercase tracking-widest text-xs">
          Verifying Identity...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0c0a09] text-stone-200 p-6 pt-32 relative overflow-hidden font-mono">
        <IdentityAirlock isOpen={airlockOpen} onClose={() => setAirlockOpen(false)} />
      </div>
    );
  }

  const pathMode = resolvePathMode(playerProfile?.path?.primary);

  return (
    <div className="min-h-screen bg-[#0c0a09] text-stone-200 p-6 pt-32 relative overflow-hidden font-mono">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-wrap items-end justify-between gap-4 relative z-10">
        <div className="flex items-start gap-4">
          <Link href="/" className="text-xs text-stone-500 hover:text-white uppercase tracking-widest flex items-center gap-2 mb-4 transition-colors">
            <ArrowLeft size={14} />
            Return to Hub
          </Link>
          <TriFoldNav />
        </div>
        <div className="flex items-end gap-4">
          <h1 className="text-4xl font-serif text-white">
            {viewState === 'map' ? 'The Atlas' : 'Pteros Hatchery'}
          </h1>
          {viewState !== 'map' && (
            <div className="flex gap-2">
              <StepIndicator label="Incubate" active={viewState === 'egg'} completed={viewState !== 'egg'} />
              <div className="w-8 h-[1px] bg-stone-800 self-center" />
              <StepIndicator label="Sigil" active={viewState === 'sigil'} completed={viewState === 'forge'} />
              <div className="w-8 h-[1px] bg-stone-800 self-center" />
              <StepIndicator label="Forge" active={viewState === 'forge'} completed={false} />
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          {/* PHASE 0: LOADING */}
          {viewState === 'loading' && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center py-12 text-stone-500"
            >
              <div className="w-10 h-10 border-2 border-stone-800 border-t-amber-500 rounded-full animate-spin mb-4" />
              <p className="text-sm uppercase tracking-[0.2em]">Syncing your gear...</p>
            </motion.div>
          )}
          
          {/* PHASE 1: THE EGG */}
          {viewState === 'egg' && (
            <motion.div
              key="egg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              className="flex flex-col items-center py-12"
            >
              <Incubator onHatch={onEggHatch} />
              <p className="mt-12 text-stone-500 max-w-md text-center text-sm font-serif italic">
                "The map is silent until you hatch a guide. Break the seal to begin."
              </p>
            </motion.div>
          )}

          {viewState === 'sigil' && (
            <motion.div
              key="sigil"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative h-[600px] w-full rounded-2xl overflow-hidden border border-stone-800/60"
            >
              <div
                className="absolute inset-0 bg-cover bg-center opacity-70"
                style={{ backgroundImage: "url('/img/locations/pteros_island_hero.png')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-[#0c0a09]/70 to-[#0c0a09]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full border border-amber-500/20 blur-sm scale-150" />
                  <div className="absolute inset-0 rounded-full border border-stone-700/40 scale-125" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border border-amber-500/40 bg-[#0c0a09] flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                      <img src="/img/icons/pteros_island.svg" alt="Pteros Island" className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="sigil-orbit grid grid-cols-2 gap-6">
                    {PATH_CONFIG.map((sigil) => (
                      <button
                        key={sigil.id}
                        type="button"
                        onClick={() => onSigilSelect(sigil.id)}
                        onMouseEnter={() => setHoveredSigil(sigil.id)}
                        onMouseLeave={() => setHoveredSigil(null)}
                        onFocus={() => setHoveredSigil(sigil.id)}
                        onBlur={() => setHoveredSigil(null)}
                        aria-label={sigil.label}
                        className={`sigil-button sigil-${sigil.id} w-28 h-28 rounded-full border bg-[#0c0a09] flex items-center justify-center transition-colors ${
                          selectedSigil === sigil.id
                            ? 'border-amber-500/80 shadow-[0_0_30px_rgba(245,158,11,0.25)]'
                            : 'border-stone-700/60 hover:border-amber-500/60'
                        }`}
                      >
                        <img
                          src={
                            sigil.id === 'mystics' && (hoveredSigil === 'mystics' || selectedSigil === 'mystics')
                              ? '/img/icons/mystics-coin.svg'
                              : sigil.src
                          }
                          alt={sigil.label}
                          className={`sigil-icon w-16 h-16 object-contain ${
                            selectedSigil === sigil.id ? 'sigil-animate' : ''
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                    <img
                      src="/icons/hybrid_seal.svg"
                      alt="Maker's mark"
                      className="w-10 h-10 opacity-70"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {viewState === 'scholar' && (
            <motion.div
              key="scholar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center py-16 text-center"
            >
              <img src="/img/locations/A_Cambria_Symb1.png" alt="Cambria" className="w-24 h-24 mb-6 opacity-90" />
              <p className="text-xs uppercase tracking-[0.3em] text-stone-500 mb-3">Archive Path</p>
              <p className="text-sm text-stone-400 max-w-md mb-6">
                The atlas is withheld. Continue through the Science path to rejoin the map.
              </p>
              <Link
                href="/science"
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded text-xs text-stone-300 transition-colors uppercase tracking-widest"
              >
                Enter Science Path
              </Link>
            </motion.div>
          )}

          {/* PHASE 2: THE FORGE */}
          {viewState === 'forge' && (
            <motion.div
              key="forge"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto"
            >
              <div className="mb-6 p-4 bg-emerald-900/10 border border-emerald-900/50 rounded flex items-center gap-3 text-emerald-400 text-xs uppercase tracking-widest">
                <CheckCircle size={16} />
                <span>Lifeform Detected. Syncing Staff Sequencer...</span>
              </div>
              <StaffSequencer
                initialStats={BASE_STAFF_STATS}
                inventoryOverride={STAFF_INVENTORY_OVERRIDE}
                onFinalize={onStaffComplete}
              />
            </motion.div>
          )}

          {/* PHASE 3: THE MAP */}
          {viewState === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2">
                  <TethysNexus pathMode={pathMode} />
                </div>
              
              <div className="space-y-6">
                <RelayLog withAi focus="all" />
                {/* Your Staff (Inventory Display) */}
                <div className="bg-[#1c1917] p-6 border border-stone-800 rounded-lg">
                  <h3 className="text-amber-500 text-xs uppercase tracking-widest mb-4">Equipped Artifact</h3>
                  {equippedStaff ? (
                    <div>
                      <div className="text-xl font-serif text-white">{equippedStaff.name}</div>
                      <div className="text-xs text-stone-500 font-mono mt-1">{equippedStaff.id}</div>
                      <div className="mt-4 flex gap-2">
                        <span className="px-2 py-1 bg-stone-800 text-stone-300 text-[10px] uppercase rounded">
                          {equippedStaff.rarity}
                        </span>
                        <span className="px-2 py-1 bg-stone-800 text-stone-300 text-[10px] uppercase rounded">
                          Power: {equippedStaff.stats?.power || 0}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-stone-600 italic">No artifact synced.</div>
                  )}
                </div>

                {/* Quick Nav */}
                <div className="bg-[#1c1917] p-6 border border-stone-800 rounded-lg">
                  <h3 className="text-cyan-500 text-xs uppercase tracking-widest mb-4">System Access</h3>
                  <div className="space-y-2">
                    <Link href="/science" className="block px-4 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded text-xs text-stone-300 transition-colors">
                      Open Field Station &rarr;
                    </Link>
                    <Link href="/mystics" className="block px-4 py-2 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded text-xs text-stone-300 transition-colors">
                      Consult The Veil &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
      <style jsx>{`
        @keyframes sigil-spin-glow {
          0% {
            transform: rotate(0deg) scale(1);
            filter: drop-shadow(0 0 0 rgba(245, 158, 11, 0));
          }
          50% {
            transform: rotate(12deg) scale(1.06);
            filter: drop-shadow(0 0 12px rgba(245, 158, 11, 0.35));
          }
          100% {
            transform: rotate(0deg) scale(1.02);
            filter: drop-shadow(0 0 18px rgba(245, 158, 11, 0.45));
          }
        }
        .sigil-animate {
          animation: sigil-spin-glow 0.7s ease-out;
        }
      `}</style>
    </div>
  );
}

function StepIndicator({ label, active, completed }) {
  return (
    <div
      className={`flex items-center gap-2 text-[10px] uppercase tracking-widest ${
        active ? 'text-white' : completed ? 'text-emerald-500' : 'text-stone-600'
      }`}
    >
      <div
        className={`w-2 h-2 rounded-full ${
          active ? 'bg-white animate-pulse' : completed ? 'bg-emerald-500' : 'bg-stone-700'
        }`}
      />
      {label}
    </div>
  );
}

// World of Tethys || D.C. Barletta
