import Link from 'next/link';
import cdn from '@/lib/cdn';
import GoodreadsWidget from '@/components/content/GoodreadsWidget';
import KindleGiveawayBanner from '@/components/content/KindleGiveawayBanner';
import { BACKGROUND_IMAGE_URLS } from '@/lib/site-assets';
import { TETHYS_OCEAN_RESEARCH_BRIEF, TETHYS_OCEAN_WRITING_ANGLES } from '@/data/tethys-ocean-research';

export const metadata = {
  title: 'World of Tethys | Atlas and Civilization History',
  description:
    'Explore the full history of civilization in World of Tethys with the interactive atlas, regional lore, archive records, and ecosystem deep dives.',
};

const worldPathways = [
  {
    href: '/world/map',
    title: 'Interactive Atlas',
    description: 'Track terrain fractures, choke points, migration corridors, and route pressure.',
    cta: 'Open atlas',
    image: '/img/map/epic_map_hero.PNG',
  },
  {
    href: '/world-of-tethys',
    title: 'Regional Lore',
    description: 'Enter Sky City, Stryker, Ironwood, Danian Delta, and Watcher corridors in detail.',
    cta: 'Browse regions',
    image: '/img/locations/sky_city_terrace_hero.PNG',
  },
  {
    href: '/archive',
    title: 'Archive Records',
    description: 'Read chronicle fragments, field memos, and political traces across major eras.',
    cta: 'Read archive',
    image: '/img/locations/archive_hero.PNG',
  },
  {
    href: '/natural-history',
    title: 'Natural History',
    description: 'Study species adaptation, food webs, and evolutionary pressure in Tethys biomes.',
    cta: 'Study ecology',
    image: '/img/locations/mystic-ironwoods.jpg',
  },
  {
    href: '/natural-history/tethys-ocean',
    title: 'Tethys Ocean Research',
    description: 'Ground world sea routes in Aptian-Albian climate, current systems, and anoxic ocean dynamics.',
    cta: 'Read sea brief',
    image: '/img/bg/obsidian-coast-4k.jpg',
  },
];

const civilizationEras = [
  {
    label: 'Era I',
    title: 'Ashwake Foundations',
    summary: 'First permanent enclaves formed around geothermal shelter and fractured river mouths.',
  },
  {
    label: 'Era II',
    title: 'Sky Compact Ascension',
    summary: 'Sky City and lower tiers stabilized governance, trade lines, and pressure diplomacy.',
  },
  {
    label: 'Era III',
    title: 'Faultline Schisms',
    summary: 'Resource conflict and volcanic cycles split alliances across Stryker and Watcher fronts.',
  },
  {
    label: 'Era IV',
    title: 'Present Signal Age',
    summary: 'Atlas telemetry, oracle channels, and expeditions rewrite the accepted canon in real time.',
  },
];

const deepDiveLinks = [
  { href: '/timeline', label: 'Deep Time Timeline' },
  { href: '/creatures', label: 'Creature Registry' },
  { href: '/science', label: 'Field Research Station' },
  { href: '/signals', label: 'Signal Broadcasts' },
  { href: '/archive/cambria', label: 'Cambria Fragments' },
  { href: '/natural-history/tethys-ocean', label: 'Tethys Ocean Brief' },
];

export default function WorldHubPage() {
  return (
    <main
      className="relative mx-auto max-w-6xl overflow-hidden rounded-lg border border-stone-700 bg-cover bg-center px-6 py-14 text-stone-100 parallax-subtle md:py-20"
      style={{
        backgroundImage: `radial-gradient(1200px 340px at 50% 112%, rgba(84,164,188,0.24), rgba(84,164,188,0) 62%), radial-gradient(920px 280px at 10% -10%, rgba(255,114,61,0.16), rgba(255,114,61,0) 62%), linear-gradient(to bottom, rgba(5,4,3,0.84), rgba(5,4,3,0.9)), url(${BACKGROUND_IMAGE_URLS.worldAtlas})`,
      }}
    >
      <div className="ash-noise-layer" />
      <section className="relative z-10">
        <p className="text-[11px] uppercase tracking-[0.3em] text-amber-300/80">World of Tethys • 2026 Atlas</p>
        <h1 className="mt-4 text-4xl font-tethys-volcanic text-stone-50 md:text-6xl">Civilization World Hub</h1>
        <p className="mt-5 max-w-3xl leading-relaxed text-stone-300">
          Explore the full history of civilization in the World of Tethys, from early ashline settlements to modern
          signal-age expeditions. This hub is the deep-dive center for map intelligence, regional lore, and archive
          records.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/world/map"
            className="rounded-full border border-orange-400/40 bg-orange-500/20 px-6 py-3 text-sm font-semibold tracking-[0.04em] text-orange-100 transition hover:border-orange-300 hover:bg-orange-500/30"
          >
            Enter Interactive Atlas
          </Link>
          <Link
            href="/world-of-tethys"
            className="rounded-full border border-stone-500/60 bg-black/40 px-6 py-3 text-sm font-semibold tracking-[0.04em] text-stone-200 transition hover:border-stone-300"
          >
            Open Regional Lore Hub
          </Link>
        </div>
      </section>

      <KindleGiveawayBanner className="relative z-10 mt-8" />

      <section className="relative z-10 mt-10 grid gap-4 md:grid-cols-2">
        {worldPathways.map((entry) => (
          <Link
            key={entry.href}
            href={entry.href}
            className="group rounded-2xl border border-stone-700/80 bg-black/35 p-5 transition hover:-translate-y-0.5 hover:border-orange-300/70"
          >
            <div className="flex gap-4">
              <div
                className="h-16 w-16 shrink-0 rounded-xl border border-stone-600 bg-cover bg-center md:h-20 md:w-20"
                style={{ backgroundImage: `url(${cdn(entry.image)})` }}
              />
              <div>
                <h2 className="text-xl font-semibold text-stone-100">{entry.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-stone-300">{entry.description}</p>
                <p className="mt-3 text-sm font-semibold tracking-[0.03em] text-orange-200 group-hover:text-orange-100">
                  {entry.cta} →
                </p>
              </div>
            </div>
          </Link>
        ))}
      </section>

      <section className="relative z-10 mt-10 rounded-2xl border border-stone-700/80 bg-black/30 p-6">
        <h2 className="text-2xl font-tethys-volcanic text-stone-100 md:text-3xl">Civilization Timeline Lenses</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-stone-300">
          Use these narrative lenses to structure major events, factions, and historical transitions across the canon.
        </p>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {civilizationEras.map((era) => (
            <article key={era.title} className="rounded-xl border border-stone-700/80 bg-black/35 p-4">
              <p className="text-[10px] uppercase tracking-[0.28em] text-amber-300/80">{era.label}</p>
              <h3 className="mt-2 text-lg font-semibold text-stone-100">{era.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-300">{era.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative z-10 mt-10 rounded-2xl border border-cyan-500/20 bg-black/35 p-6">
        <p className="text-[10px] uppercase tracking-[0.28em] text-cyan-200/80">Paleoceanography Layer</p>
        <h2 className="mt-2 text-2xl font-tethys-volcanic text-stone-100 md:text-3xl">
          Tethys Ocean Research Signals
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-stone-300">
          Treat the sea as a live system, not a static backdrop. These research-derived signals keep your dark,
          reflective, volcanic-water aesthetic tethered to real Earth history.
        </p>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {TETHYS_OCEAN_RESEARCH_BRIEF.slice(0, 4).map((entry) => (
            <article key={entry.title} className="rounded-xl border border-stone-700/80 bg-black/30 p-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-200/85">{entry.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-300">{entry.summary}</p>
              <p className="mt-3 text-xs leading-relaxed text-stone-200/90">
                <span className="font-semibold text-cyan-100">World signal:</span> {entry.worldSignal}
              </p>
            </article>
          ))}
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {TETHYS_OCEAN_WRITING_ANGLES.slice(0, 2).map((entry) => (
            <article key={entry.label} className="rounded-xl border border-stone-700/80 bg-black/25 p-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-orange-200">{entry.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-300">{entry.guidance}</p>
            </article>
          ))}
        </div>
        <div className="mt-5">
          <Link
            href="/natural-history/tethys-ocean"
            className="inline-flex rounded-full border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-xs uppercase tracking-[0.16em] text-cyan-100 transition hover:border-cyan-300 hover:bg-cyan-500/25"
          >
            Open full ocean research briefing
          </Link>
        </div>
      </section>

      <section className="relative z-10 mt-10">
        <h2 className="text-xl font-semibold text-stone-100">Continue the Deep Dive</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {deepDiveLinks.map((entry) => (
            <Link
              key={entry.href}
              href={entry.href}
              className="rounded-full border border-stone-600/70 bg-black/35 px-4 py-2 text-xs uppercase tracking-[0.18em] text-stone-200 transition hover:border-orange-300/70 hover:text-orange-100"
            >
              {entry.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="relative z-10 mt-10 rounded-2xl border border-stone-700/80 bg-black/30 p-6">
        <p className="text-[10px] uppercase tracking-[0.28em] text-amber-300/80">Book First</p>
        <h2 className="mt-2 text-2xl font-tethys-volcanic text-stone-100 md:text-3xl">Reader Reviews</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-stone-300">
          Keep the reading entry point clear, then branch visitors into atlas and lore exploration.
        </p>
        <div className="mt-3">
          <GoodreadsWidget />
        </div>
      </section>
    </main>
  );
}
