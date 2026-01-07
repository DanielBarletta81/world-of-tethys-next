"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTethys } from "@/context/TethysContext";
import LandingSequence from '@/components/LandingSequence';
import TriFoldNav from "@/components/TriFoldNav";
import MarineShowcase from "@/components/MarineShowcase";
import BookCarousel from "@/components/BookCarousel";
import IdentityAirLock from "@/components/IdentityAirLock"; // Corrected spelling
import IntroOverlay from "@/components/IntroOverlay";
import { Gem, User, Activity, Globe, Zap, Power, Sprout, LogIn } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { user, loading: authLoading, logout } = useAuth();
  const { stats, isGuest, loadingData } = useTethys();
  
  // State Management
  const [hasInteracted, setHasInteracted] = useState(false); // Gatekeeper state
  const [introFinished, setIntroFinished] = useState(false); // Sequence state
  const [showLogin, setShowLogin] = useState(false);         // Airlock state

  return (
    <main className="min-h-screen bg-[#050403] text-slate-100 font-serif overflow-x-hidden relative selection:bg-emerald-900 selection:text-white">
      
      {/* 1. THE GATEKEEPER (Forces Audio Unlock) */}
      {!hasInteracted && (
        <IntroOverlay onStart={() => setHasInteracted(true)} />
      )}

      {/* 2. THE CINEMATIC (Only plays AFTER interaction) */}
      {hasInteracted && !introFinished && (
        <LandingSequence onComplete={() => setIntroFinished(true)} />
      )}

      {/* 3. THE MAIN SITE */}
      {introFinished && (
        <>
          {/* Login Modal (Lives on top of UI) */}
          <IdentityAirLock isOpen={showLogin} onClose={() => setShowLogin(false)} />

          {/* Main Interface Wrapper (Fades in together) */}
          <div className="animate-in fade-in duration-[2000ms] relative z-10">
            
            {/* CINEMATIC BACKGROUND */}
            <div className="fixed inset-0 z-0">
              <div className="absolute inset-0 bg-[url('/img/bg/magma-forge-hero.jpg')] bg-cover bg-center opacity-40 mix-blend-screen" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#050403] via-transparent to-[#050403]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050403_90%)]" />
            </div>

            {/* TOP BAR */}
            <nav className="fixed top-0 inset-x-0 z-50 flex flex-wrap md:flex-nowrap items-center justify-between px-4 md:px-6 py-4 border-b border-white/5 bg-[#050403]/90 backdrop-blur-md shadow-2xl">
              
              {/* BRAND */}
              <div className="flex items-center gap-4 shrink-0">
                <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-magma-burn font-sans italic transform -skew-x-6 drop-shadow-[0_0_20px_rgba(234,88,12,0.6)]">
                  W.O.T.
                </h1>
                <div className="hidden md:block h-8 w-[1px] bg-white/10" />
              </div>

              {/* BOOK CAROUSEL (Desktop) */}
              <div className="hidden lg:block flex-1 mx-8 max-w-xl opacity-80 hover:opacity-100 transition-opacity">
                 <div className="scale-75 origin-left">
                   <BookCarousel />
                 </div>
              </div>

              {/* RIGHT: RESIN & AUTH */}
              <div className="flex items-center gap-3 md:gap-6 ml-auto md:ml-0">
                
                {/* Resin Counter */}
                <div className="flex items-center gap-2 px-3 py-1.5 border border-orange-900/30 bg-orange-950/40 rounded-full shadow-[inset_0_0_10px_rgba(234,88,12,0.2)]">
                  <Gem size={14} className="text-orange-500 animate-pulse" />
                  <span className="font-mono text-xs md:text-sm font-bold text-orange-100">{loadingData ? '...' : stats.resin}</span>
                </div>
                
                {/* Auth Button */}
                {authLoading ? (
                  <span className="text-xs text-stone-500 animate-pulse">Sensing...</span>
                ) : !user ? (
                  <button 
                    onClick={() => setShowLogin(true)}
                    className="group relative flex items-center gap-2 px-5 py-2 bg-emerald-900/10 border border-emerald-500/30 rounded text-xs font-bold uppercase tracking-widest text-emerald-400 hover:bg-emerald-900/30 hover:text-white transition-all shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_25px_rgba(16,185,129,0.3)]"
                  >
                    <Sprout size={14} />
                    <span>Weave Signal</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-3 bg-stone-900/50 px-3 py-1.5 rounded border border-stone-800">
                    <div className="flex items-center gap-2 text-[10px] md:text-xs font-mono uppercase tracking-widest text-emerald-400">
                      <User size={14} />
                      {user?.displayName || 'Warden'}
                    </div>
                    <div className="w-[1px] h-4 bg-stone-700"></div>
                    <button onClick={logout} className="text-stone-500 hover:text-red-400 transition-colors" title="Sever Connection">
                      <Power size={14} />
                    </button>
                  </div>
                )}
              </div>
            </nav>

            {/* MAIN CONTENT AREA */}
            <div className="relative z-10 pt-32 pb-24 max-w-7xl mx-auto px-4 md:px-6 space-y-20">
              
              {/* HERO SECTION */}
              <section className="text-center space-y-6 mt-8">
                <h2 className="text-4xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-stone-100 to-stone-600 tracking-tight uppercase leading-[0.9]">
                  The Inner <span className="text-orange-600 block md:inline">World of Tethys</span>
                </h2>
                <p className="max-w-2xl mx-auto text-sm md:text-lg text-stone-400 leading-relaxed font-sans">
                  The surface is silent, but the <span className="text-orange-400 font-bold">Magma Layer</span> is active. 
                  Choose your vector: Science, Mysticism, or the Chronicle.
                </p>
              </section>

              {/* NAVIGATION GATEWAY */}
              <TriFoldNav />

              {/* DASHBOARD GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Map Lens */}
                <div className="lg:col-span-8 group relative aspect-video rounded-xl border border-stone-800 overflow-hidden shadow-2xl bg-black">
                  <div className="absolute inset-0 bg-[url('/img/map/epic_map_hero.PNG')] bg-cover bg-center transition-transform duration-[3s] group-hover:scale-105 opacity-60 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050403] via-transparent to-transparent" />
                  
                  <div className="absolute bottom-6 left-6 space-y-1">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono uppercase tracking-widest">
                      <Activity size={14} className="animate-pulse" /> Live Feed
                    </div>
                    <h3 className="text-2xl md:text-3xl font-display text-white">The Rookery: Pteros Estuary</h3>
                    <p className="text-stone-400 text-xs md:text-sm max-w-md hidden sm:block">Turbulence detected in the West Strait. Biological assets deployed.</p>
                  </div>

                  <Link href="/map" className="absolute inset-0 z-20 focus:outline-none" aria-label="Enter Map">
                     <span className="sr-only">Enter</span>
                  </Link>
                </div>

                {/* Status Modules */}
                <div className="lg:col-span-4 flex flex-col gap-4">
                  <StatusCard 
                    label="Field Station" 
                    value="Active" 
                    icon={<Globe size={16} />} 
                    color="text-cyan-400" 
                    href="/science"
                  />
                  <StatusCard 
                    label="The Veil" 
                    value="Thinning" 
                    icon={<Zap size={16} />} 
                    color="text-purple-400" 
                    href="/mystics"
                  />
                  
                  {/* Core Temp */}
                  <div className="flex-1 min-h-[120px] bg-orange-950/10 border border-orange-900/20 rounded-xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('/img/locations/pteros-island-sun.png')] opacity-20" />
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-600 to-red-900 blur-3xl animate-pulse opacity-20 group-hover:opacity-40 transition-opacity" />
                    <div className="relative z-10 space-y-1">
                      <span className="text-[10px] uppercase tracking-[0.3em] text-orange-500 font-mono">Albian Age</span>
                      <span className="text-3xl md:text-4xl font-mono text-white tracking-tighter">111<span className="text-lg text-stone-600 ml-1">MYA</span></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Creature Showcase */}
              <MarineShowcase />

            </div>
          </div>
        </>
      )}
    </main>
  );
}

function StatusCard({ label, value, icon, color, href }) {
  return (
    <Link href={href} className="group glass-obsidian p-5 rounded-xl flex items-center justify-between hover:border-white/20 transition-all cursor-pointer">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full bg-white/5 ${color} group-hover:text-white transition-colors`}>
          {icon}
        </div>
        <span className="text-xs md:text-sm font-bold uppercase tracking-wide text-stone-300 group-hover:text-white">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`w-1.5 h-1.5 rounded-full ${color.replace('text', 'bg')} animate-pulse`} />
        <span className="text-xs font-mono text-stone-500 group-hover:text-stone-300">{value}</span>
      </div>
    </Link>
  );
}