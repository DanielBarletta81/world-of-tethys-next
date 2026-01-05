// src/app/page.jsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTethys } from "@/context/TethysContext";
import { MagmaButton } from "@/components/MagmaUI";
import { Gem, Map, Shield, User } from "lucide-react";
import LandingSequence from '@/components/LandingSequence';
import TriFoldNav from "@/components/TriFoldNav";
import Link from "next/link";
import MarineShowcase from "@/components/MarineShowcase";

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const { stats, isGuest, loadingData } = useTethys();
  const [introFinished, setIntroFinished] = useState(false);
  const router = useRouter();

  // Redirect to login if absolutely no auth state is found after load
  useEffect(() => {
    if (!authLoading && !user && !loadingData) {
      // Optional: Uncomment to force login on home
      // router.push("/login");
    }
  }, [user, authLoading, loadingData, router]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-serif overflow-hidden relative">
      
      {/* 1. Intro Sequence (Plays once) */}
      {!introFinished && (
        <LandingSequence onComplete={() => setIntroFinished(true)} />
      )}

      {/* 2. Main Hub UI */}
      {introFinished && (
        <div className="animate-in fade-in duration-1000">
       
          {/* Background Atmosphere */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-900/20 rounded-full blur-[128px]"></div>
             <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10"></div>
          </div>
             <TriFoldNav />

          {/* Navigation Bar */}
          <nav className="relative z-20 flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border border-orange-600 bg-orange-900/20 flex items-center justify-center rounded">
                <span className="font-header text --forge-700 font-bold text-xl">W.O.T.</span>
              </div>
              <h1 className="text-xl font-bold tracking-widest text-slate-200 uppercase hidden md:block">
                World of Tethys
              </h1>
            </div>

            <div className="flex items-center gap-6">
              {/* Resin Counter (Live Data) */}
              <div className="flex items-center gap-2 px-4 py-2 border border-slate-800 bg-black/40 rounded-full">
                <Gem size={14} className="text-orange-500" />
                <span className="font-mono text-sm text-orange-100">{loadingData ? '...' : stats.resin}</span>
              </div>
              
              {/* User Status */}
              <div className="flex items-center gap-2">
                <User size={16} className={isGuest ? "text-slate-500" : "text-emerald-500"} />
                <span className="text-xs uppercase tracking-widest text-slate-400">
                  {authLoading ? '...' : (isGuest ? 'Guest Uplink' : user.displayName || 'Commander')}
                </span>
              </div>
            </div>
          </nav>

          {/* Content Grid */}
          <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* HERO CARD */}
            <div className="lg:col-span-2 p-8 border border-slate-800 bg-slate-900/50 rounded-xl shadow-2xl relative overflow-hidden group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-red-600 opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
              <div className="relative z-10">
                <h2 className="text-4xl font-header text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-4">
                  The Ash Age
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed mb-8">
                  The surface is silent. The Undercity wakes. Your resin stores are synced to the magma core.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/map">
                    <MagmaButton>Enter The Atlas</MagmaButton>
                  </Link>
                  <Link href="/creatures">
                    <button className="px-6 py-3 border border-slate-600 text-slate-300 hover:border-orange-500 hover:text-orange-500 uppercase tracking-widest text-sm rounded transition-all">
                      View Bestiary
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* STATS / STATUS CARD */}
            <div className="p-6 border border-slate-800 bg-black/40 rounded-xl flex flex-col gap-6">
              <h3 className="text-xs uppercase tracking-[0.3em] text-orange-500 font-bold border-b border-slate-800 pb-4">
                Vital Signs
              </h3>
              
              <div className="space-y-4">
                <StatRow label="Sanity" value={stats.sanity + "%"} icon={<Shield size={14} className="text-emerald-500"/>} />
                <StatRow label="Kith Affinity" value={stats.kith} icon={<Map size={14} className="text-cyan-500"/>} />
                <StatRow label="Igzier Bond" value={stats.igzier} icon={<Gem size={14} className="text-purple-500"/>} />
              </div>

              {isGuest && (
                <div className="mt-auto p-4 bg-orange-900/10 border border-orange-900/30 rounded text-center">
                  <p className="text-[10px] text-orange-400 uppercase tracking-widest mb-2">Comms Volatile</p>
                  <Link href="/login" className="text-xs text-white underline hover:text-orange-400">
                    Secure Roots (Login)
                  </Link>
                </div>
              )}
            </div>

          </div>
          <MarineShowcase />
        </div>
      )}
    </main>
  );
}

function StatRow({ label, value, icon }) {
  return (
    <div className="flex justify-between items-center group">
      <div className="flex items-center gap-3 text-slate-400 group-hover:text-white transition-colors">
        {icon}
        <span className="text-sm font-serif">{label}</span>
      </div>
      <span className="font-mono text-slate-200">{value}</span>
    </div>
  );
}