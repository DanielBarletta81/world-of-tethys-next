import Link from 'next/link';
import { HERO_IMAGE_URLS } from '@/lib/site-assets';
import { getSiteVariantFromConfig } from '@/lib/site-variant';

export function generateMetadata() {
  const siteVariant = getSiteVariantFromConfig();
  const isAuthorSite = siteVariant === 'author';
  return {
    title: isAuthorSite ? 'Natural History | D.C. Barletta' : 'Natural History | World of Tethys',
    description:
      'Natural history essays on pterosaurs, mass extinctions, oceanic systems, and prehistoric survival — grounded in Cretaceous science and Cambrian discovery.',
  };
}

const articles = [
  {
    href: '/natural-history/pterosaurs',
    label: 'Pterosaurs',
    title: 'Why Pterosaurs Ruled the Sky',
    summary:
      'For 160 million years, no vertebrate challenged their dominance. The architecture of hollow bones, thermal corridors, and neural superiority — and the Cambrian engineering response to living beneath them.',
  },
  {
    href: '/natural-history/flora-and-fauna',
    label: 'Flora & Fauna',
    title: 'The Green Architecture of Tethys',
    summary:
      'Cycads, ferns, and early angiosperms constructed the lowland canopy. But the Ironwood Groves — still carrying markers of Permian origin — represent something older, more resilient, and fiercely territorial.',
  },
  {
    href: '/natural-history/fungi',
    label: 'Fungi',
    title: 'Kingdom of Decomposition',
    summary:
      'The unseen infrastructure. Mycorrhizal networks, wood-rot specialists, and the enigmatic Veil Spore — a fungal lineage that predates most flowering plants and may trace to a Permian origin no modern taxonomy can confirm.',
  },
  {
    href: '/natural-history/marine-life',
    label: 'Marine Life',
    title: 'Tethys Beneath the Surface',
    summary:
      'Mosasaurs, pliosaurs, ammonites, and the glass rays of the continental shelf. An ocean layered by oxygen zones, carbonate chemistry, and predator hierarchies — where some lineages still whisper of Permian origin.',
  },
  {
    href: '/natural-history/food-web',
    label: 'Ecosystem',
    title: 'The Architecture of Energy Flow',
    summary:
      'Producer, consumer, decomposer — the trophic cascade that sustains a greenhouse world. But certain nodes in the web defy placement: relict species, anachronistic survivors, lineages that predate the Triassic rebound.',
  },
  {
    href: '/natural-history/life-after-the-permian-extinction',
    label: 'Mass Extinction',
    title: 'Life After the Permian Extinction',
    summary:
      'The Great Dying eliminated 96% of marine species. What followed was not recovery but five million years of failed stabilization — pulse extinctions, monoculture, and the Carnian Pluvial reset.',
  },
  {
    href: '/natural-history/could-humans-survive-dinosaur-era',
    label: 'Survival Ecology',
    title: 'Could Humans Survive the Dinosaur Era?',
    summary:
      'An architecture problem, not an adventure premise. Predator density, aerial threats, refuge engineering, unfamiliar pathogens, and the vertical survival logic Cambria solved over 400 years.',
  },
  {
    href: '/natural-history/tethys-ocean',
    label: 'Tethys Ocean',
    title: 'Aptian-Albian Tethys Ocean Brief',
    summary:
      'Greenhouse seas, anoxic dead zones, carbonate platform chokepoints, and the Earth-system dynamics that defined navigation, civilization pressure, and water-line ecology in World of Tethys.',
  },
];

export default function NaturalHistoryPage() {
  const siteVariant = getSiteVariantFromConfig();
  const isAuthorSite = siteVariant === 'author';
  const titleClass = isAuthorSite ? 'text-[#2f2015]' : 'text-stone-50';
  const bodyClass = isAuthorSite ? 'text-[#4f3c30]' : 'text-stone-300';
  const cardClass = isAuthorSite
    ? 'group rounded-2xl border border-amber-900/25 bg-[#f8f2e8]/95 p-6 shadow-[0_10px_24px_rgba(33,20,10,0.08)] transition hover:border-amber-700/50'
    : 'group rounded-2xl border border-stone-700 bg-black/30 p-6 transition hover:border-orange-300/60';
  const labelClass = isAuthorSite ? 'text-[#6f4f38]' : 'text-amber-300/80';
  const linkClass = isAuthorSite
    ? 'mt-4 inline-block text-xs uppercase tracking-[0.16em] text-[#6f4f38] transition group-hover:text-[#3a2617]'
    : 'mt-4 inline-block text-xs uppercase tracking-[0.16em] text-amber-300/70 transition group-hover:text-orange-300';

  return (
    <main
      className={`relative mx-auto max-w-6xl overflow-hidden rounded-lg border px-6 py-16 ${
        isAuthorSite ? 'border-amber-900/25 text-[#2a1f17]' : 'border-stone-700 text-stone-100'
      }`}
      style={{
        backgroundImage: isAuthorSite
          ? `radial-gradient(900px 260px at 8% -8%, rgba(162,95,45,0.12), rgba(162,95,45,0) 62%), linear-gradient(to bottom, rgba(251,246,238,0.95), rgba(233,218,197,0.97)), url(${HERO_IMAGE_URLS.naturalHistory})`
          : `linear-gradient(to bottom, rgba(5,4,3,0.84), rgba(5,4,3,0.9)), url(${HERO_IMAGE_URLS.naturalHistory})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className={isAuthorSite ? 'ash-noise-layer opacity-[0.05]' : 'ash-noise-layer'} />
      <p className={`relative z-10 text-[11px] uppercase tracking-[0.3em] ${labelClass}`}>
        D.C. Barletta • Natural History
      </p>
      <h1 className={`relative z-10 mt-4 text-4xl md:text-5xl font-tethys-volcanic ${titleClass}`}>
        Natural History
      </h1>
      <p className={`relative z-10 mt-4 max-w-3xl leading-relaxed ${bodyClass}`}>
        Prehistoric biology, ecological stress, and deep-time adaptation. Each essay is grounded in
        the scientific record and carries a signal from Cambria — where scholars documented these
        same systems long before modern paleontology recovered the bone.
      </p>
      <section className="relative z-10 mt-10 grid gap-5 md:grid-cols-2">
        {articles.map((article) => (
          <Link key={article.href} href={article.href} className={cardClass}>
            <p className={`text-[10px] uppercase tracking-[0.25em] ${labelClass}`}>{article.label}</p>
            <h2 className={`mt-2 text-xl font-semibold leading-snug ${titleClass}`}>{article.title}</h2>
            <p className={`mt-2 text-sm leading-relaxed ${bodyClass}`}>{article.summary}</p>
            <span className={linkClass}>Read essay →</span>
          </Link>
        ))}
      </section>
    </main>
  );
}
