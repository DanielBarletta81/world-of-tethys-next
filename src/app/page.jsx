// src/app/page.jsx
"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTethys } from "@/context/TethysContext";
import LandingSequence from '@/components/LandingSequence';
import TriFoldNav from "@/components/TriFoldNav";
import MarineShowcase from "@/components/MarineShowcase";
import BookCarousel from "@/components/BookCarousel";
import { Gem, User, Activity, Globe, Zap } from "lucide-react";
import Link from "next/link";


export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const { stats, isGuest, loadingData } = useTethys();
  const [introFinished, setIntroFinished] = useState(false);

  return (
    <main className="min-h-screen bg-[#050403] text-slate-100 font-serif overflow-x-hidden relative selection:bg-orange-900 selection:text-white">
      
      {/* 1. INTRO SEQUENCE (Blocking) */}
      {!introFinished && (
        <LandingSequence onComplete={() => setIntroFinished(true)} />
      )}

      {/* 2. THE MAGMA FORGE INTERFACE */}
      {introFinished && (
        <div className="animate-in fade-in duration-[2000ms] relative z-10">
          
          {/* CINEMATIC BACKGROUND */}
          <div className="fixed inset-0 z-0">
            {/* The Getty Image goes here */}
            <div className="absolute inset-0 bg-[url('/img/bg/magma-forge-hero.jpg')] bg-cover bg-center opacity-40 mix-blend-screen" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#050403] via-transparent to-[#050403]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050403_90%)]" />
          </div>

          {/* TOP BAR: SYSTEM STATUS */}
          <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#050403]/80 backdrop-blur-md">
            <div className="flex items-center gap-4">
              {/* THE BRAND: Magma Burn Text */}
              <h1 className="text-4xl font--forge tracking-tighter text-forge font-sans italic transform -skew-x-6">
                W.O.T.
              </h1>
              <div className="hidden md:flex h-6 w-[1px] bg-white/10" />
             <BookCarousel/>
            </div>

            <div className="flex items-center gap-6">
              {/* Resin Output */}
              <div className="flex items-center gap-2 px-3 py-1.5 border border-orange-900/30 bg-orange-950/10 rounded-full">
                <Gem size={12} className="text-orange-500 animate-pulse" />
                <span className="font-mono text-xs text-orange-200">{loadingData ? '...' : stats.resin}</span>
              </div>
              
              {/* User ID */}
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-stone-400">
                <User size={14} className={isGuest ? "text-stone-600" : "text-emerald-500"} />
                {authLoading ? '...' : (isGuest ? 'Guest_Proxy' : user?.displayName || 'Warden')}
              </div>
            </div>
          </nav>

          <div className="relative z-10 pt-32 pb-24 max-w-7xl mx-auto px-6 space-y-20">
            
            {/* HERO SECTION: "Just Getting Started" */}
            <section className="text-center space-y-6">
              <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-stone-100 to-stone-600 tracking-tight uppercase">
                Worlds Within <span className="text-orange-600">The World</span>
              </h2>
              <p className="max-w-2xl mx-auto text-lg text-stone-400 leading-relaxed font-sans">
                The surface is silent, but the <span className="text-orange-400">Magma Layer</span> is active. 
                Choose your vector: Science, Mysticism, or the Chronicle.
              </p>
            </section>

            {/* THE GATEWAY (TriFold) */}
            <TriFoldNav />

            {/* GAMER PATH: IMMERSION DASHBOARD */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* 1. MAP PREVIEW (The Lens) */}
              <div className="lg:col-span-8 group relative aspect-video rounded-xl border border-stone-800 overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-[url('/img/map/epic_map_hero.PNG')] bg-cover bg-center transition-transform duration-[3s] group-hover:scale-105 opacity-60 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050403] via-transparent to-transparent" />
                
                <div className="absolute bottom-6 left-6 space-y-1">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono uppercase tracking-widest">
                    <Activity size={14} className="animate-pulse" /> Live Feed
                  </div>
                  <h3 className="text-3xl font-display text-white">Sector 4: Pteros Estuary</h3>
                  <p className="text-stone-400 text-sm max-w-md">Turbulence detected in the West Strait. Biological assets deployed.</p>
                </div>

                <Link href="/map" className="absolute inset-0 z-20 focus:outline-none" aria-label="Enter Map" />
              </div>

              {/* 2. SYSTEM STATUS (The Data) */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <StatusCard 
                  label="Field Station" 
                  value="Active" 
                  icon={<Globe size={16} />} 
                  color="text-cyan-400" 
                  href="/pteros/science"
                />
                <StatusCard 
                  label="The Veil" 
                  value="Thinning" 
                  icon={<Zap size={16} />} 
                  color="text-purple-400" 
                  href="/mystics"
                />
                
                {/* Visual Filler: The "Core" */}
                <div className="flex-1 bg-orange-950/10 border border-orange-900/20 rounded-xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20" />
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-600 to-red-900 blur-2xl animate-pulse opacity-40" />
                  <div className="relative z-10 space-y-2">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-orange-500 font-mono">Core Temp</span>
                    <span className="text-4xl font-mono text-white">111<span className="text-lg text-stone-500">MYA</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* MARINE SHOWCASE (The Creatures) */}
            <MarineShowcase />

          </div>
        </div>
      )}
    </main>
  );
}

// Micro-Component for the Status Sidebars
function StatusCard({ label, value, icon, color, href }) {
  return (
    <Link href={href} className="group glass-obsidian p-5 rounded-xl flex items-center justify-between hover:border-white/10 transition-all">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full bg-white/5 ${color} group-hover:text-white transition-colors`}>
          {icon}
        </div>
        <span className="text-sm font-bold uppercase tracking-wide text-stone-300 group-hover:text-white">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`w-1.5 h-1.5 rounded-full ${color.replace('text', 'bg')} animate-pulse`} />
        <span className="text-xs font-mono text-stone-500">{value}</span>
      </div>
    </Link>
  );
}