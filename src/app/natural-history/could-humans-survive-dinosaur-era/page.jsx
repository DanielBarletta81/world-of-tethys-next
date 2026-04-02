import Link from 'next/link';
import {
  HUMANS_SURVIVE_RESEARCH_BRIEF,
  HUMANS_SURVIVE_WRITING_ANGLES,
  HUMANS_SURVIVE_SOURCE_NOTES,
} from '@/data/humans-survive-research';
import { HERO_IMAGE_URLS } from '@/lib/site-assets';
import { getConfiguredSiteUrls, getSiteVariantFromConfig } from '@/lib/site-variant';

export function generateMetadata() {
  const siteVariant = getSiteVariantFromConfig();
  const isAuthorSite = siteVariant === 'author';
  const { worldSiteUrl, authorSiteUrl } = getConfiguredSiteUrls();
  const canonicalUrl = `${(isAuthorSite ? authorSiteUrl : worldSiteUrl).replace(/\/$/, '')}/natural-history/could-humans-survive-dinosaur-era`;

  return {
    title: isAuthorSite
      ? 'Could Humans Survive Dinosaur Era Ecosystems? | D.C. Barletta'
      : 'Could Humans Survive Dinosaur Era Ecosystems? | World of Tethys',
    description:
      'A survival analysis grounded in Cretaceous ecology: predator density, aerial threats, refuge engineering, disease, and the Cambrian response that solved the same problems.',
    alternates: {
      canonical: canonicalUrl,
    },
    keywords: [
      'dinosaur era survival',
      'Cretaceous ecology',
      'Hatzegopteryx',
      'prehistoric predators',
      'natural history',
      'survival ecology',
      'World of Tethys',
    ],
  };
}

export default function NaturalHistoryHumansPage() {
  const siteVariant = getSiteVariantFromConfig();
  const isAuthorSite = siteVariant === 'author';
  const sectionCardClass = isAuthorSite
    ? 'rounded-2xl border border-amber-900/25 bg-[#f8f2e8]/95 p-5 shadow-[0_10px_24px_rgba(33,20,10,0.08)]'
    : 'rounded-2xl border border-stone-700/80 bg-black/35 p-5';
  const titleClass = isAuthorSite ? 'text-[#2f2015]' : 'text-stone-100';
  const bodyClass = isAuthorSite ? 'text-[#4f3c30]' : 'text-stone-300';

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Could Humans Survive Dinosaur Era Ecosystems?',
    author: { '@type': 'Person', name: 'D.C. Barletta' },
    about: [
      'Cretaceous survival ecology',
      'Prehistoric predator behavior',
      'Refuge architecture',
      'Worldbuilding research',
    ],
  };

  return (
    <article
      className={`relative mx-auto max-w-6xl overflow-hidden rounded-lg border px-6 py-14 md:py-20 ${
        isAuthorSite ? 'border-amber-900/25 text-[#2a1f17]' : 'border-stone-700 text-stone-100'
      }`}
      style={{
        backgroundImage: isAuthorSite
          ? `radial-gradient(1000px 320px at 50% 110%, rgba(76,130,146,0.2), rgba(76,130,146,0) 62%), radial-gradient(900px 260px at 8% -8%, rgba(162,95,45,0.14), rgba(162,95,45,0) 62%), linear-gradient(to bottom, rgba(251,246,238,0.94), rgba(233,218,197,0.96)), url(${HERO_IMAGE_URLS.naturalHistory})`
          : `radial-gradient(1000px 320px at 50% 110%, rgba(90,171,194,0.22), rgba(90,171,194,0) 62%), radial-gradient(900px 260px at 8% -8%, rgba(255,117,63,0.16), rgba(255,117,63,0) 62%), linear-gradient(to bottom, rgba(5,4,3,0.84), rgba(5,4,3,0.9)), url(${HERO_IMAGE_URLS.naturalHistory})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <div className={isAuthorSite ? 'ash-noise-layer opacity-[0.05]' : 'ash-noise-layer'} />

      <p
        className={`relative z-10 text-[11px] uppercase tracking-[0.3em] ${
          isAuthorSite ? 'text-[#6f4f38]' : 'text-amber-300/80'
        }`}
      >
        Natural History • Survival Ecology
      </p>
      <h1 className={`relative z-10 mt-4 text-4xl font-tethys-volcanic md:text-6xl ${titleClass}`}>
        Could Humans Survive the Dinosaur Era?
      </h1>
      <p className={`relative z-10 mt-5 max-w-4xl leading-relaxed ${bodyClass}`}>
        The question is usually posed as adventure. It is actually an architecture problem. Cambria
        solved it — not with weapons, but with information systems, vertical living, acoustic mirrors,
        and a pharmacology built from 400 years of failed first contact. This is what they knew. This
        is what modern science confirms.
      </p>

      <section className="relative z-10 mt-10 grid gap-4 md:grid-cols-2">
        {HUMANS_SURVIVE_RESEARCH_BRIEF.map((item) => (
          <article key={item.title} className={sectionCardClass}>
            <h2 className={`text-xl font-semibold ${titleClass}`}>{item.title}</h2>
            <p className={`mt-2 text-sm leading-relaxed ${bodyClass}`}>{item.summary}</p>
            <p
              className={`mt-3 rounded-lg border px-3 py-2 text-xs leading-relaxed ${
                isAuthorSite
                  ? 'border-amber-900/25 bg-[#fff8ef] text-[#5b4330]'
                  : 'border-stone-700/80 bg-black/30 text-stone-200'
              }`}
            >
              <span className="font-semibold">Cambrian Record:</span> {item.worldSignal}
            </p>
          </article>
        ))}
      </section>

      <section className={`relative z-10 mt-10 ${sectionCardClass}`}>
        <h2 className={`text-2xl font-tethys-volcanic md:text-3xl ${titleClass}`}>The Operating Parameters</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {HUMANS_SURVIVE_WRITING_ANGLES.map((entry) => (
            <article
              key={entry.label}
              className={`rounded-xl border p-4 ${
                isAuthorSite ? 'border-amber-900/25 bg-[#fff8ef]' : 'border-stone-700/80 bg-black/30'
              }`}
            >
              <h3 className={`text-sm font-semibold uppercase tracking-[0.16em] ${isAuthorSite ? 'text-[#6f4f38]' : 'text-amber-300/80'}`}>
                {entry.label}
              </h3>
              <p className={`mt-2 text-sm leading-relaxed ${bodyClass}`}>{entry.guidance}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={`relative z-10 mt-10 ${sectionCardClass}`}>
        <h2 className={`text-2xl font-tethys-volcanic md:text-3xl ${titleClass}`}>Sources</h2>
        <ul className="mt-4 space-y-2">
          {HUMANS_SURVIVE_SOURCE_NOTES.map((source) => (
            <li key={source} className={`text-sm leading-relaxed ${bodyClass}`}>
              • {source}
            </li>
          ))}
        </ul>
      </section>

      <section className="relative z-10 mt-10 flex flex-wrap gap-3">
        <Link
          href="/natural-history"
          className={`rounded-full border px-5 py-2 text-xs uppercase tracking-[0.16em] transition ${
            isAuthorSite
              ? 'border-[#6d4c36] bg-[#2f2219] text-[#f7eee2] hover:bg-[#20160f]'
              : 'border-orange-400/50 bg-orange-500/20 text-orange-100 hover:border-orange-300 hover:bg-orange-500/30'
          }`}
        >
          Natural History
        </Link>
        <Link
          href="/world-of-tethys-book-1"
          className={`rounded-full border px-5 py-2 text-xs uppercase tracking-[0.16em] transition ${
            isAuthorSite
              ? 'border-[#8d5b36] bg-[#f2e2cd] text-[#3a2617] hover:bg-[#e8d2b7]'
              : 'border-stone-600/70 bg-black/35 text-stone-200 hover:border-orange-300/70 hover:text-orange-100'
          }`}
        >
          Book One
        </Link>
      </section>
    </article>
  );
}
