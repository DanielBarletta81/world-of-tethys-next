"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTethys } from "@/context/TethysContext";
import LandingSequence from '@/components/LandingSequence';
import BookCarousel from '@/components/content/BookCarousel';
import IdentityAirLock from '@/components/forms/IdentityAirLock';
import IntroOverlay from '@/components/overlays/IntroOverlay';
import CaveWallTerminal from '@/components/page-specific/science/CaveWallTerminal';
import OnboardingRitual from '@/components/features/onboarding/OnboardingRitual';
import GoodreadsWidget from '@/components/content/GoodreadsWidget';
import KindleGiveawayBanner from '@/components/content/KindleGiveawayBanner';
import { Gem, User, Activity, Globe, Zap, Power, Sprout, Trash2 } from "lucide-react";
import Link from "next/link";
import cdn from "@/lib/cdn";

const WORLD_MAP_URL = `${(process.env.NEXT_PUBLIC_WORLD_SITE_URL || 'https://worldoftethys.com').replace(/\/$/, '')}/map`;

export default function Home() {
  const { user, loading: authLoading, logout, deleteAccount } = useAuth();
  const { stats, isGuest, loadingData, hasOnboarded, playerProfile } = useTethys();
  
  // State Management
  const [hasInteracted, setHasInteracted] = useState(false); // Gatekeeper state
  const [introFinished, setIntroFinished] = useState(false); // Sequence state
  const [showLogin, setShowLogin] = useState(false);         // Airlock state
  const [slateText, setSlateText] = useState("");
  const [slates, setSlates] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("tethys_slates_v1")) || [];
      setSlates(saved.slice(0, 5));
    } catch {
      setSlates([]);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const skipIntro = params.get('skipIntro');
    const stored = localStorage.getItem('tethys_intro_complete');
    const onHomeRoute = window.location.pathname === '/home';
    if (skipIntro === '1' || stored === '1' || onHomeRoute) {
      setHasInteracted(true);
      setIntroFinished(true);
      try {
        localStorage.setItem('tethys_intro_complete', '1');
      } catch {
        /* ignore */
      }
    }
  }, []);

  const submitSlate = () => {
    const banned = ['http', 'www', 'sex', 'hate', 'kill']; // simple guard
    const cleaned = slateText.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim();
    if (!cleaned) return;
    if (banned.some((w) => cleaned.toLowerCase().includes(w))) {
      setSlateText("");
      return;
    }
    if (slates.some((s) => s.text === cleaned)) {
      setSlateText("");
      return;
    }
    const entry = {
      id: crypto.randomUUID?.() ?? `s-${Date.now()}`,
      text: cleaned.slice(0, 140),
      at: Date.now()
    };
    const next = [entry, ...slates].slice(0, 5);
    setSlates(next);
    setSlateText("");
    try {
      localStorage.setItem("tethys_slates_v1", JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const handleDeleteAccount = async () => {
    if (!deleteAccount) return;
    const confirmed = window.confirm(
      "Delete your account? This removes your sign-in but keeps in-world records. You can create a new signal later."
    );
    if (!confirmed) return;
    try {
      await deleteAccount();
    } catch (error) {
      console.error("Account deletion failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#050403] text-slate-100 font-serif overflow-x-hidden relative selection:bg-emerald-900 selection:text-white">

      {/* 1. THE GATEKEEPER (Forces Audio Unlock) */}
      {!hasInteracted && (
        <IntroOverlay onStart={() => setHasInteracted(true)} />
      )}

      {/* 2. THE CINEMATIC (Only plays AFTER interaction) */}
      {hasInteracted && !introFinished && (
        <LandingSequence
          onComplete={() => {
            setIntroFinished(true);
            try {
              localStorage.setItem('tethys_intro_complete', '1');
            } catch {
              /* ignore */
            }
          }}
        />
   )}

      {/* 3. THE MAIN SITE */}
      {introFinished && (
        <>
          {/* Skip Navigation Link for Screen Readers */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-orange-600 focus:text-white focus:rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            Skip to main content
          </a>

          {/* Login Modal (Lives on top of UI) */}
          <IdentityAirLock isOpen={showLogin} onClose={() => setShowLogin(false)} />

          {/* Main Interface Wrapper (Fades in together) */}
          <div className="animate-in fade-in duration-[2000ms] relative z-10">
            
            {/* CINEMATIC BACKGROUND */}
            <div className="fixed inset-0 z-0">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-50 mix-blend-screen"
                style={{ backgroundImage: `url(${cdn('/img/locations/pteros_island_hero.png')})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#050403] via-transparent to-[#050403]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#050403_90%)]" />
              <div
                className="absolute inset-0 opacity-35 mix-blend-screen"
                style={{ backgroundImage: `url(${cdn('/img/watcher-ashfall.svg')})` }}
              />
            </div>

            {/* TOP BAR */}
            <header role="banner" className="fixed top-0 inset-x-0 z-[10000] border-b border-white/5 bg-[#050403]/90 backdrop-blur-md shadow-2xl">
              <nav role="navigation" aria-label="Main navigation" className="flex flex-wrap md:flex-nowrap items-center justify-between px-4 md:px-6 py-4">
              
              {/* BRAND */}
              <div className="flex items-center gap-4 shrink-0">
                <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-magma-burn font-tethys-volcanic italic transform -skew-x-6 drop-shadow-[0_0_20px_rgba(234,88,12,0.6)]">
                  W.O.T.
                </h1>
                <div className="hidden md:block h-8 w-[1px] bg-white/10" />
              </div>

              {/* BOOK CAROUSEL (Desktop) */}
              <div className="hidden lg:block flex-1 mx-8 max-w-xl opacity-80 hover:opacity-100 transition-opacity">
                <BookCarousel
                  compact
                  className="rounded-full bg-gradient-to-r from-orange-500/20 via-orange-500/10 to-transparent backdrop-blur-sm shadow-lg"
                />
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
                    <button
                      onClick={handleDeleteAccount}
                      className="text-stone-600 hover:text-red-400 transition-colors"
                      title="Delete Account"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
              </nav>
            </header>

            {/* MAIN CONTENT AREA */}
            <main role="main" id="main-content" className="relative z-10 pt-32 pb-24 max-w-7xl mx-auto px-4 md:px-6 space-y-20">
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

              <KindleGiveawayBanner className="max-w-5xl mx-auto" />

              {!hasOnboarded && (
                <OnboardingRitual />
              )}

              {/* ONBOARDING QUICK START */}
              <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <QuickAction
                  title={!user ? "Weave your signal" : hasOnboarded ? "Open the Atlas" : "Hatch your guide"}
                  desc={!user ? "Connect to unlock map and journals." : hasOnboarded ? "Jump straight to the live map." : "Break the seal in the hatchery to begin."}
                  href={!user ? "#login" : hasOnboarded ? "/map" : "/map"}
                  icon={<Activity size={16} />}
                  accent="from-emerald-500/20 via-emerald-500/10 to-transparent"
                  onClickOverride={() => {
                    if (!user) setShowLogin(true);
                  }}
                />
                <QuickAction
                  title="Research Station"
                  desc="Telemetry, paleo-GIS, VR link, recovered assets."
                  href="/science"
                  icon={<Globe size={16} />}
                  accent="from-cyan-500/20 via-cyan-500/10 to-transparent"
                />
                <QuickAction
                  title="Mystic Channel"
                  desc="Oracle pool, whispers, and the listening paths."
                  href="/mystics"
                  icon={<Zap size={16} />}
                  accent="from-purple-500/20 via-purple-500/10 to-transparent"
                />
              </div>

              <section className="max-w-5xl mx-auto rounded-2xl border border-stone-700/80 bg-black/35 p-5 md:p-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-amber-300/80">Book First</p>
                  <h3 className="mt-1 text-xl font-semibold text-stone-100">Reader Reviews</h3>
                </div>
                <div className="mt-3">
                  <GoodreadsWidget />
                </div>
              </section>

              {/* DASHBOARD GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Map Lens */}
                <div className="lg:col-span-8 group relative aspect-video rounded-xl border border-stone-800 overflow-hidden shadow-2xl bg-black">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[3s] group-hover:scale-105 opacity-60 group-hover:opacity-100"
                    style={{ backgroundImage: `url(${cdn('/img/map/epic_map_hero.PNG')})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050403] via-transparent to-transparent" />
                  {!hasOnboarded && (
                    <>
                      <div
                        className="absolute inset-0 opacity-85 mix-blend-screen"
                        style={{ backgroundImage: `url(${cdn('/img/noise.svg')})` }}
                      />
                      <div className="absolute inset-0 bg-[#050403]/70 backdrop-blur-[2px]" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="px-4 py-2 border border-amber-700/40 rounded-full bg-black/60 text-[10px] uppercase tracking-[0.3em] text-amber-300">
                          Atlas sealed until hatch
                        </div>
                      </div>
                    </>
                  )}
                  
                  <div className="absolute bottom-6 left-6 space-y-1">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono uppercase tracking-widest">
                      <Activity size={14} className="animate-pulse" /> Live Feed
                    </div>
                    <h3 className="text-2xl md:text-3xl font-display text-white">The Rookery: Pteros Estuary</h3>
                    <p className="text-stone-400 text-xs md:text-sm max-w-md hidden sm:block">Turbulence detected in the West Strait. Biological assets deployed.</p>
                  </div>

                  <a href={WORLD_MAP_URL} className="absolute inset-0 z-20 focus:outline-none" aria-label="Enter Map">
                     <span className="sr-only">Enter</span>
                  </a>
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
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{ backgroundImage: `url(${cdn('/img/locations/pteros-island-sun.png')})` }}
                    />
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-600 to-red-900 blur-3xl animate-pulse opacity-20 group-hover:opacity-40 transition-opacity" />
                    <div className="relative z-10 space-y-1">
                      <span className="text-[10px] uppercase tracking-[0.3em] text-orange-500 font-mono">Albian Age</span>
                      <span className="text-3xl md:text-4xl font-mono text-white tracking-tighter">111<span className="text-lg text-stone-600 ml-1">MYA</span></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cinematic Feature + Audio */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CaveWallTerminal
                    mediaId="world_of_tethys_book_trailer"
                    title="World of Tethys — Book Trailer"
                    type="video"
                    src="https://world-of-tethys-site.s3.us-east-1.amazonaws.com/video/World-of-Tethys+10.MOV"
                    thumbnail={cdn('/img/books/books/book1-hero.png')}
                    rewards={{ lore: 5 }}
                  />
                  <CaveWallTerminal
                    mediaId="trailer_tethys_ravel"
                    title="Tethys: Ravel"
                    type="video"
                    src="https://world-of-tethys-site.s3.us-east-1.amazonaws.com/video/Trailer-Tethys-Ravel.MOV"
                    thumbnail={cdn('/img/books/books/ravel-paperback.png')}
                    rewards={{ lore: 5 }}
                  />
                  <CaveWallTerminal
                    mediaId="trailer_world_of_tethys_9"
                    title="World of Tethys — Trailer 9"
                    type="video"
                    src="https://world-of-tethys-site.s3.us-east-1.amazonaws.com/video/WorldOfTethys_Trailer9.MOV"
                    thumbnail={cdn('/img/locations/watcher_hero4.png')}
                    rewards={{ lore: 5 }}
                  />
                  <CaveWallTerminal
                    mediaId="trailer_sky_city_melden"
                    title="Sky City: Melden"
                    type="video"
                    src="https://world-of-tethys-site.s3.us-east-1.amazonaws.com/video/Sky-City-Melden.MP4"
                    thumbnail={cdn('/img/locations/A_Cambria_Seal.png')}
                    rewards={{ lore: 5 }}
                  />
                </div>
                <div className="lg:col-span-4 space-y-3 bg-black/40 border border-stone-800 rounded-xl p-4">
                  <div className="text-xs uppercase tracking-[0.3em] text-stone-500 font-mono">Archive Audio</div>
                  <h3 className="text-xl text-stone-100 font-serif">Ashwind Sample</h3>
                  <audio controls className="w-full">
                    <source src={cdn("/audio/bush-rustle.mp3")} type="audio/mpeg" />
                  </audio>
                  <p className="text-xs text-stone-500">Short field clip; watching or listening quietly may yield small artifact bonuses.</p>
                </div>
              </div>

              {/* Slate Microfooter */}
              <div id="slate" className="relative mt-10">
                <div className="flex items-start gap-3 bg-black/40 border border-stone-800 rounded-xl p-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full border border-stone-700 bg-stone-900 flex items-center justify-center text-stone-500">
                    T
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="text-xs uppercase tracking-[0.3em] text-stone-500 font-mono">Leave a slate</div>
                    <div className="flex gap-2">
                      <textarea
                        value={slateText}
                        onChange={(e) => setSlateText(e.target.value)}
                        placeholder="Chisel a short message..."
                        className="flex-1 bg-black/30 border border-stone-800 rounded p-2 text-sm text-stone-200 resize-none focus:outline-none focus:border-amber-500"
                        rows={2}
                        maxLength={140}
                      />
                      <button
                        onClick={submitSlate}
                        className="px-3 py-2 bg-amber-900/40 border border-amber-700/50 text-amber-100 text-xs uppercase tracking-widest rounded hover:bg-amber-800/60 transition-colors"
                      >
                        Chisel
                      </button>
                    </div>
                    {slates.length ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-stone-400">
                        {slates.map((s) => (
                          <div key={s.id} className="bg-black/30 border border-stone-800 rounded p-2 line-clamp-2">
                            {s.text}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-[11px] text-stone-600">Ledger is clean.</div>
                    )}
                  </div>
                </div>
              </div>

            </main>
          </div>
        </>
      )}
    </div>
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

function QuickAction({ title, desc, href, icon, accent, onClickOverride }) {
  const body = (
    <div className="relative overflow-hidden rounded-xl border border-white/5 bg-white/5 p-4 hover:border-white/15 transition-colors h-full">
      <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-70`} />
      <div className="relative z-10 flex items-start gap-3">
        <div className="p-2 rounded-full bg-black/30 text-white/80">
          {icon}
        </div>
        <div className="space-y-1 text-left">
          <h3 className="text-sm font-bold uppercase tracking-wide text-stone-100">{title}</h3>
          <p className="text-xs text-stone-400 leading-snug">{desc}</p>
        </div>
      </div>
    </div>
  );

  if (onClickOverride) {
    return (
      <button onClick={onClickOverride} className="text-left">
        {body}
      </button>
    );
  }

  return (
    <Link href={href} className="block">
      {body}
    </Link>
  );
}
// World of Tethys || D.C. Barletta
