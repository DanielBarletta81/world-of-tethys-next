import Link from 'next/link';
import cdn from '@/lib/cdn';
import { HERO_IMAGE_URLS } from '@/lib/site-assets';

export const metadata = {
  title: 'World of Tethys Regions | Lore Encyclopedia',
  description:
    'Explore Sky City, Stryker, the Watcher Volcano, Ironwood Forest, and Danian Delta with region-specific lore, faction pressure, and ecosystem context.',
};

const lorePages = [
  {
    href: '/world-of-tethys/sky-city',
    title: 'Sky City',
    description: 'Political summit zone across upper tiers, terraces, and brittle alliances.',
    image: '/img/locations/sky_city_terrace_hero.PNG',
  },
  {
    href: '/world-of-tethys/stryker',
    title: 'Stryker',
    description: 'Industrial faultline frontier shaped by extraction, unrest, and hard adaptation.',
    image: '/img/characters/stryker_hero_alt1.PNG',
  },
  {
    href: '/world-of-tethys/the-watcher-volcano',
    title: 'The Watcher Volcano',
    description: 'Volcanic pressure engine whose cycles rewrite routes, weather, and settlement logic.',
    image: '/img/locations/watcher_mountain_hero.png',
  },
  {
    href: '/world-of-tethys/ironwood-forest',
    title: 'Ironwood Forest',
    description: 'Dense fungal and root systems where mystic channels and biological drift converge.',
    image: '/img/locations/mystic-ironwoods.jpg',
  },
  {
    href: '/world-of-tethys/danian-delta',
    title: 'Danian Delta',
    description: 'Hydraulic chokepoint linking river civilizations to contested estuary corridors.',
    image: '/img/map/tethys-ember-scar.png',
  },
];

const worldNextLinks = [
  { href: '/world/map', label: 'Open Interactive Atlas' },
  { href: '/archive', label: 'Read Archive Memos' },
  { href: '/timeline', label: 'View Deep Time Timeline' },
];

export default function WorldOfTethysHubPage() {
  return (
    <main
      className="relative mx-auto max-w-6xl overflow-hidden rounded-lg border border-stone-700 bg-cover bg-center px-6 py-14 text-stone-100 parallax-subtle md:py-20"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(5,4,3,0.84), rgba(5,4,3,0.9)), url(${HERO_IMAGE_URLS.worldHub})`,
      }}
    >
      <div className="ash-noise-layer" />
      <p className="relative z-10 text-[11px] uppercase tracking-[0.3em] text-amber-300/80">Regional Encyclopedia</p>
      <h1 className="relative z-10 mt-4 text-4xl font-tethys-volcanic text-stone-50 md:text-6xl">The World of Tethys</h1>
      <p className="relative z-10 mt-5 max-w-3xl leading-relaxed text-stone-300">
        Deep region profiles for civilization pressure, faction movement, ecology, and conflict pathways across the
        canon.
      </p>

      <section className="relative z-10 mt-10 grid gap-4 md:grid-cols-2">
        {lorePages.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className="group rounded-2xl border border-stone-700/80 bg-black/35 p-5 transition hover:-translate-y-0.5 hover:border-orange-300/70"
          >
            <div className="flex gap-4">
              <div
                className="h-16 w-16 shrink-0 rounded-xl border border-stone-600 bg-cover bg-center md:h-20 md:w-20"
                style={{ backgroundImage: `url(${cdn(page.image)})` }}
              />
              <div>
                <h2 className="text-xl font-semibold text-stone-100">{page.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-stone-300">{page.description}</p>
                <p className="mt-3 text-sm font-semibold tracking-[0.03em] text-orange-200 group-hover:text-orange-100">
                  Open region dossier →
                </p>
              </div>
            </div>
          </Link>
        ))}
      </section>

      <section className="relative z-10 mt-10 rounded-2xl border border-stone-700/80 bg-black/30 p-6">
        <h2 className="text-2xl font-tethys-volcanic text-stone-100 md:text-3xl">Continue World Research</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-stone-300">
          Move between the civilization hub, atlas routes, and archive canon as you build the complete world model.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          {worldNextLinks.map((entry) => (
            <Link
              key={entry.href}
              href={entry.href}
              className="rounded-full border border-stone-600/70 bg-black/35 px-4 py-2 text-xs uppercase tracking-[0.18em] text-stone-200 transition hover:border-orange-300/70 hover:text-orange-100"
            >
              {entry.label}
            </Link>
          ))}
          <Link
            href="/world-of-tethys-book-1"
            className="rounded-full border border-orange-400/50 bg-orange-500/20 px-4 py-2 text-xs uppercase tracking-[0.18em] text-orange-100 transition hover:border-orange-300 hover:bg-orange-500/30"
          >
            View Book One
          </Link>
        </div>
      </section>
    </main>
  );
}
