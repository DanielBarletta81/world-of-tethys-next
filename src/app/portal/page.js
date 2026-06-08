'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useTethys } from '@/context/TethysContext';
import IdentityAirLock from '@/components/forms/IdentityAirLock';
import BookCarousel from '@/components/content/BookCarousel';
import CaveWallTerminal from '@/components/page-specific/science/CaveWallTerminal';
import OnboardingRitual from '@/components/features/onboarding/OnboardingRitual';
import GoodreadsWidget from '@/components/content/GoodreadsWidget';
import KindleGiveawayBanner from '@/components/content/KindleGiveawayBanner';
import {
  Gem, User, Activity, Globe, Zap, Power, Sprout, Trash2,
  ChevronRight, BookOpen, Swords,
} from 'lucide-react';
import cdn from '@/lib/cdn';

const FEATURED_DESTINATIONS = [
  {
    id: 'atlas',
    title: 'Interactive Atlas',
    subtitle: 'Navigation Layer',
    description:
      'Real-time terrain fractures, choke points, migration corridors, and route pressure across the Tethys basin. 111 million years of geological memory, rendered live.',
    cta: 'Enter Atlas',
    href: '/map',
    image: cdn('/img/map/epic_map_hero.PNG'),
    badge: 'LIVE SYSTEM',
    badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/60',
  },
  {
    id: 'watcher',
    title: 'The Watcher',
    subtitle: 'Volcanic Shelf',
    description:
      'Active caldera. Ash columns at 14 km. Thermal vents beneath the eastern shelf. Approach corridors sealed by the Compact.',
    cta: 'Approach',
    href: '/world-of-tethys',
    image: cdn('/img/locations/watcher_mountain_hero.png'),
    badge: 'HIGH THREAT',
    badgeColor: 'text-red-400 border-red-500/30 bg-red-950/60',
  },
  {
    id: 'sky-city',
    title: 'Sky City',
    subtitle: 'Upper Tiers',
    description:
      'Seven tiered districts above the ashline. Political compact between Stryker families and the Watcher patrol.',
    cta: 'Enter City',
    href: '/locations',
    image: cdn('/img/locations/sky_city_terrace_hero.PNG'),
    badge: 'TIER 1',
    badgeColor: 'text-amber-400 border-amber-500/30 bg-amber-950/60',
  },
  {
    id: 'archive',
    title: 'The Archive',
    subtitle: 'Chronicle Records',
    description:
      'Fragment records, field memos, and political traces from the early Aptian through the present Signal Age.',
    cta: 'Open Archive',
    href: '/archive',
    image: cdn('/img/locations/archive_hero.PNG'),
    badge: 'RESTRICTED',
    badgeColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/60',
  },
  {
    id: 'ironwoods',
    title: 'Ironwood Spires',
    subtitle: 'Deep Canopy',
    description:
      'Fungal mycorrhizal network at 340 m root depth. No light penetration past mid-canopy. Signal disruption confirmed.',
    cta: 'Descend',
    href: '/locations',
    image: cdn('/img/locations/mystic-ironwoods.jpg'),
    badge: 'SIGNAL DARK',
    badgeColor: 'text-purple-400 border-purple-500/30 bg-purple-950/60',
  },
];

const FEATURED_CREATURES = [
  { id: 'kronosaurus',   name: 'Kronosaurus',   class: 'Marine Predator', image: cdn('/img/creatures/kronosaurus.png') },
  { id: 'sauroposeidon', name: 'Sauroposeidon', class: 'Titanosaur',      image: cdn('/img/creatures/sauroposeidon.png') },
  { id: 'tapejara',      name: 'Tapejara',      class: 'Aerial Scout',    image: cdn('/img/creatures/tapejara.png') },
  { id: 'suchomimus',    name: 'Suchomimus',    class: 'Delta Predator',  image: cdn('/img/creatures/suchomimus.png') },
  { id: 'tropeognathus', name: 'Tropeognathus', class: 'Pterosaur',       image: cdn('/img/creatures/tropeognathus.png') },
  { id: 'void-shell',    name: 'Void Shell',    class: 'Deep Arthropod',  image: cdn('/img/creatures/void_shell.png') },
  { id: 'volcanic-bird', name: 'Volcanic Bird', class: 'Ash Rider',       image: cdn('/img/creatures/volcanic_bird_hero.png') },
  { id: 'glass-ray',     name: 'Glass Ray',     class: 'Shelf Drifter',   image: cdn('/img/creatures/GlassRay_hero.png') },
];

export default function Home() {
  const { user, loading: authLoading, logout, deleteAccount } = useAuth();
  const { stats, loadingData, hasOnboarded } = useTethys();
  const [showLogin, setShowLogin] = useState(false);
  const [slateText, setSlateText] = useState('');
  const [slates, setSlates] = useState([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('tethys_slates_v1')) || [];
      setSlates(saved.slice(0, 5));
    } catch {
      setSlates([]);
    }
  }, []);

  const submitSlate = () => {
    const banned = ['http', 'www', 'sex', 'hate', 'kill'];
    const cleaned = slateText.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim();
    if (!cleaned) return;
    if (banned.some((w) => cleaned.toLowerCase().includes(w))) { setSlateText(''); return; }
    if (slates.some((s) => s.text === cleaned)) { setSlateText(''); return; }
    const entry = { id: crypto.randomUUID?.() ?? `s-${Date.now()}`, text: cleaned.slice(0, 140), at: Date.now() };
    const next = [entry, ...slates].slice(0, 5);
    setSlates(next);
    setSlateText('');
    try { localStorage.setItem('tethys_slates_v1', JSON.stringify(next)); } catch { /* ignore */ }
  };

  const handleDeleteAccount = async () => {
    if (!deleteAccount) return;
    const confirmed = window.confirm(
      'Delete your account? This removes your sign-in but keeps in-world records. You can create a new signal later.',
    );
    if (!confirmed) return;
    try { await deleteAccount(); } catch (err) { console.error('Account deletion failed:', err); }
  };

  return (
    <div className="min-h-screen bg-[#050403] text-slate-100 overflow-x-hidden selection:bg-orange-900/60 selection:text-white">

      <IdentityAirLock isOpen={showLogin} onClose={() => setShowLogin(false)} />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-orange-600 focus:text-white focus:rounded focus:outline-none"
      >
        Skip to main content
      </a>

      {/* ── CINEMATIC HERO ──────────────────────────────────────────────── */}
      <section className="relative flex flex-col justify-end min-h-screen overflow-hidden -mt-24 md:-mt-28">

        <div
          className="absolute inset-0 bg-cover bg-center hero-reveal"
          style={{ backgroundImage: `url(${cdn('/img/bg/obsidian-coast-4k.jpg')})` }}
        />
        <div
          className="absolute inset-0 bg-cover bg-top opacity-25 mix-blend-screen"
          style={{ backgroundImage: `url(${cdn('/img/locations/watcher_mountain_hero.png')})` }}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#050403] via-[#050403]/75 to-[#050403]/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050403] via-transparent to-[#050403]/65" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_50%,transparent_30%,#050403_85%)]" />

        <div
          className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
          style={{ backgroundImage: `url(${cdn('/noise.svg')})` }}
        />

        <div className="relative z-10 px-8 md:px-14 pb-20 md:pb-28 max-w-4xl hero-copy-reveal">
          <p className="text-[10px] uppercase tracking-[0.5em] text-orange-400/70 font-mono mb-5">
            111 Million Years Ago&nbsp;·&nbsp;Aptian-Albian Stage&nbsp;·&nbsp;Tethys Basin
          </p>

          <h1 className="text-[clamp(3.5rem,9vw,7.5rem)] font-tethys-volcanic text-stone-50 leading-[0.88] tracking-tight drop-shadow-[0_4px_48px_rgba(0,0,0,0.9)]">
            World<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-300 to-amber-200">
              of Tethys
            </span>
          </h1>

          <p className="mt-6 text-base md:text-xl text-stone-300/90 max-w-xl leading-relaxed font-light">
            The ocean had a memory.<br className="hidden md:block" />
            This is what it remembered.
          </p>

          <div className="mt-9 flex flex-wrap gap-3 items-center">
            <Link
              href="/map"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-white text-[#050403] text-sm font-bold tracking-[0.06em] uppercase rounded-sm shadow-[0_0_48px_rgba(255,255,255,0.12)] hover:bg-stone-100 transition-all"
            >
              <Activity size={14} />
              Enter Atlas
            </Link>
            <Link
              href="/world-of-tethys-book-1"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-stone-900/70 text-stone-100 text-sm font-bold tracking-[0.06em] uppercase rounded-sm border border-stone-600/50 backdrop-blur-sm hover:bg-stone-800/80 hover:border-stone-400/60 transition-all"
            >
              <BookOpen size={14} />
              Read Book One
            </Link>
            {!authLoading && !user && (
              <button
                onClick={() => setShowLogin(true)}
                className="inline-flex items-center gap-2 px-5 py-4 text-stone-400 text-sm font-semibold tracking-[0.04em] uppercase hover:text-stone-100 transition-colors"
              >
                <Sprout size={14} />
                Weave Signal
              </button>
            )}
          </div>

          {user && (
            <div className="mt-7 flex items-center gap-5 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <User size={11} /> {user?.displayName || 'Warden'}
              </span>
              <span className="flex items-center gap-1.5 text-orange-400/80">
                <Gem size={11} /> {loadingData ? '…' : stats.resin} resin
              </span>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 text-stone-600 hover:text-red-400 transition-colors"
              >
                <Power size={11} /> Disconnect
              </button>
            </div>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#050403] to-transparent pointer-events-none" />
        <div className="absolute bottom-10 right-10 z-10 flex flex-col items-center gap-2 opacity-30 pointer-events-none">
          <div className="w-px h-14 bg-gradient-to-b from-stone-300 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ── KINDLE BANNER ───────────────────────────────────────────────── */}
      <div className="px-6 md:px-12 mt-2">
        <KindleGiveawayBanner className="max-w-7xl mx-auto" />
      </div>

      {!hasOnboarded && (
        <div className="px-6 md:px-12 mt-8 max-w-7xl mx-auto">
          <OnboardingRitual />
        </div>
      )}

      {/* ── CONTENT ROWS ────────────────────────────────────────────────── */}
      <main id="main-content" className="pb-24 mt-14 space-y-16">

        {/* Explore the World */}
        <section className="px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <SectionHeader title="Explore the World" href="/world" />
            <div className="grid grid-cols-1 lg:grid-cols-[1.9fr_1fr] gap-3">
              <DestinationCard item={FEATURED_DESTINATIONS[0]} featured />
              <div className="grid grid-cols-2 gap-3">
                {FEATURED_DESTINATIONS.slice(1, 5).map((item) => (
                  <DestinationCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Creatures of the Basin */}
        <section className="px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <SectionHeader title="Creatures of the Basin" href="/creatures" cta="Registry" />
            <div
              className="flex gap-3 overflow-x-auto pb-3 snap-x snap-mandatory"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {FEATURED_CREATURES.map((c) => (
                <CreatureCard key={c.id} creature={c} />
              ))}
            </div>
          </div>
        </section>

        {/* Field Stations */}
        <section className="px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <SectionHeader title="Active Field Stations" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FieldStationCard label="Research Station" desc="Telemetry, paleo-GIS, VR link, recovered assets from Tethys margin surveys." href="/science" icon={<Globe size={22} />} color="cyan" />
              <FieldStationCard label="Mystic Channel"   desc="Oracle pool, whispers, and the listening paths behind the Watcher Veil."       href="/mystics"  icon={<Zap   size={22} />} color="purple" />
              <FieldStationCard label="Bestiary Registry" desc="Classified species, threat assessments, and behavioral field logs."             href="/creatures" icon={<Swords size={22} />} color="amber" />
            </div>
          </div>
        </section>

        {/* Chronicles */}
        <section className="px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <SectionHeader title="Chronicles" href="/bookstore" cta="All titles" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-stone-800/70 bg-black/30 p-5 md:p-7">
                <p className="text-[10px] uppercase tracking-[0.35em] text-amber-300/70 font-mono">Book First</p>
                <h3 className="mt-1.5 text-lg font-semibold text-stone-100">Reader Echoes</h3>
                <div className="mt-4"><GoodreadsWidget /></div>
              </div>
              <div className="rounded-2xl border border-stone-800/70 bg-black/30 p-5 md:p-7">
                <p className="text-[10px] uppercase tracking-[0.35em] text-amber-300/70 font-mono">Catalog</p>
                <h3 className="mt-1.5 text-lg font-semibold text-stone-100 mb-4">The Library</h3>
                <BookCarousel />
              </div>
            </div>
          </div>
        </section>

        {/* Video Chronicle */}
        <section className="px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <SectionHeader title="Video Chronicle" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <CaveWallTerminal mediaId="world_of_tethys_book_trailer" title="World of Tethys — Book Trailer"  type="video" src="https://world-of-tethys-site.s3.us-east-1.amazonaws.com/video/World-of-Tethys+10.MOV"         thumbnail={cdn('/img/books/books/book1-hero.png')}          rewards={{ lore: 5 }} />
              <CaveWallTerminal mediaId="trailer_tethys_ravel"         title="Tethys: Ravel"                   type="video" src="https://world-of-tethys-site.s3.us-east-1.amazonaws.com/video/Trailer-Tethys-Ravel.MOV"         thumbnail={cdn('/img/books/books/ravel-paperback.png')}    rewards={{ lore: 5 }} />
              <CaveWallTerminal mediaId="trailer_world_of_tethys_9"    title="World of Tethys — Trailer 9"     type="video" src="https://world-of-tethys-site.s3.us-east-1.amazonaws.com/video/WorldOfTethys_Trailer9.MOV"      thumbnail={cdn('/img/locations/watcher_hero4.png')}        rewards={{ lore: 5 }} />
              <CaveWallTerminal mediaId="trailer_sky_city_melden"      title="Sky City: Melden"                type="video" src="https://world-of-tethys-site.s3.us-east-1.amazonaws.com/video/Sky-City-Melden.MP4"              thumbnail={cdn('/img/locations/A_Cambria_Symb1.png')}      rewards={{ lore: 5 }} />
            </div>
          </div>
        </section>

        {/* Slate */}
        <div className="px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-start gap-4 bg-black/40 border border-stone-800/50 rounded-2xl p-5 md:p-6">
              <div className="flex-shrink-0 w-9 h-9 rounded-full border border-stone-700 bg-stone-900 flex items-center justify-center text-stone-500 text-sm font-mono select-none">T</div>
              <div className="flex-1 space-y-3">
                <div className="text-[10px] uppercase tracking-[0.35em] text-stone-500 font-mono">Leave a slate</div>
                <div className="flex gap-2">
                  <textarea
                    value={slateText}
                    onChange={(e) => setSlateText(e.target.value)}
                    placeholder="Chisel a short message…"
                    className="flex-1 bg-black/30 border border-stone-800 rounded-xl p-3 text-sm text-stone-200 resize-none focus:outline-none focus:border-amber-600/50 transition-colors"
                    rows={2}
                    maxLength={140}
                  />
                  <button onClick={submitSlate} className="px-4 py-2 self-end bg-amber-900/40 border border-amber-700/40 text-amber-100 text-xs uppercase tracking-widest rounded-xl hover:bg-amber-800/60 transition-colors">
                    Chisel
                  </button>
                </div>
                {slates.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {slates.map((s) => (
                      <div key={s.id} className="bg-black/30 border border-stone-800/70 rounded-xl p-2.5 text-xs text-stone-400 line-clamp-2">{s.text}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {user && (
          <div className="px-6 md:px-12">
            <div className="max-w-7xl mx-auto flex justify-end">
              <button onClick={handleDeleteAccount} className="flex items-center gap-1.5 text-stone-700 hover:text-red-400 text-xs font-mono transition-colors">
                <Trash2 size={11} /> Delete account
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function SectionHeader({ title, href, cta = 'See all' }) {
  return (
    <div className="flex items-baseline justify-between mb-5">
      <h2 className="text-lg md:text-xl font-bold text-stone-100 tracking-tight">{title}</h2>
      {href && (
        <Link href={href} className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-200 transition-colors">
          {cta}<ChevronRight size={12} />
        </Link>
      )}
    </div>
  );
}

function DestinationCard({ item, featured = false }) {
  return (
    <Link
      href={item.href}
      className={`group relative overflow-hidden rounded-2xl border border-stone-800/50 bg-[#0a0806] block ${
        featured ? 'min-h-[360px] lg:min-h-[460px]' : 'aspect-[4/3]'
      }`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        style={{ backgroundImage: `url(${cdn(item.image)})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050403] via-[#050403]/50 to-transparent" />
      {featured && <div className="absolute inset-0 bg-gradient-to-r from-[#050403]/20 to-transparent" />}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
        <div className={`inline-flex items-center text-[9px] uppercase tracking-[0.3em] font-mono px-2 py-0.5 rounded-sm border mb-2.5 ${item.badgeColor}`}>
          {item.badge}
        </div>
        <h3 className={`font-bold text-stone-50 leading-snug ${featured ? 'text-2xl md:text-3xl' : 'text-base'}`}>{item.title}</h3>
        <p className={`text-stone-400 mt-1.5 leading-snug ${featured ? 'text-sm max-w-lg' : 'text-xs line-clamp-2'}`}>{item.description}</p>
        <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-orange-300 group-hover:text-orange-200 group-hover:gap-2 transition-all">
          {item.cta}<ChevronRight size={12} />
        </span>
      </div>
    </Link>
  );
}

function CreatureCard({ creature }) {
  return (
    <Link
      href="/creatures"
      className="group relative flex-shrink-0 w-40 md:w-48 overflow-hidden rounded-xl border border-stone-800/50 bg-[#0a0806] snap-start block"
    >
      <div
        className="h-48 md:h-60 bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.06]"
        style={{ backgroundImage: `url(${cdn(creature.image)})` }}
      />
      <div className="p-3">
        <div className="text-[9px] uppercase tracking-[0.25em] text-stone-500 font-mono">{creature.class}</div>
        <div className="mt-0.5 text-sm font-semibold text-stone-200 group-hover:text-white transition-colors leading-snug">{creature.name}</div>
      </div>
    </Link>
  );
}

function FieldStationCard({ label, desc, href, icon, color }) {
  const ring   = { cyan: 'border-cyan-800/25 hover:border-cyan-500/40', purple: 'border-purple-800/25 hover:border-purple-500/40', amber: 'border-amber-800/25 hover:border-amber-500/40' };
  const ic     = { cyan: 'text-cyan-400 bg-cyan-950/50',   purple: 'text-purple-400 bg-purple-950/50', amber: 'text-amber-400 bg-amber-950/50' };
  const accent = { cyan: 'text-cyan-400', purple: 'text-purple-400', amber: 'text-amber-400' };
  return (
    <Link href={href} className={`group rounded-2xl border bg-black/25 p-6 flex flex-col gap-5 transition-all duration-300 hover:-translate-y-0.5 hover:bg-black/40 ${ring[color]}`}>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${ic[color]}`}>{icon}</div>
      <div>
        <h3 className="font-bold text-stone-100">{label}</h3>
        <p className="mt-1.5 text-sm text-stone-400 leading-relaxed">{desc}</p>
      </div>
      <span className={`text-xs font-mono uppercase tracking-[0.2em] flex items-center gap-1.5 group-hover:gap-2.5 transition-all ${accent[color]}`}>
        Access <ChevronRight size={11} />
      </span>
    </Link>
  );
}

// World of Tethys || D.C. Barletta
