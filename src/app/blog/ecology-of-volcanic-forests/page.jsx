import Link from 'next/link';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_WORLD_SITE_URL || 'https://worldoftethys.com';
const PAGE_PATH = '/blog/ecology-of-volcanic-forests';
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;

export const metadata = {
  title: 'The Ecology of Volcanic Forests',
  description:
    'Understand how volcanic forests function through nutrient pulses, disturbance cycles, and rapid adaptation.',
  alternates: {
    canonical: PAGE_PATH,
  },
  openGraph: {
    type: 'article',
    url: PAGE_URL,
    title: 'The Ecology of Volcanic Forests',
    description:
      'Understand how volcanic forests function through nutrient pulses, disturbance cycles, and rapid adaptation.',
  },
};

export default function EcologyOfVolcanicForestsPage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'The Ecology of Volcanic Forests',
    description:
      'Understand how volcanic forests function through nutrient pulses, disturbance cycles, and rapid adaptation.',
    author: { '@type': 'Person', name: 'D.C. Barletta' },
    publisher: { '@type': 'Person', name: 'D.C. Barletta' },
    mainEntityOfPage: PAGE_URL,
    url: PAGE_URL,
  };

  return (
    <article className="mx-auto max-w-4xl px-6 py-14 md:py-20 text-[#2a1f17]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <section className="rounded-3xl border border-amber-900/30 bg-[linear-gradient(145deg,#fbf6ee,#e9dac5)] p-8 shadow-[0_20px_46px_rgba(35,20,8,0.14)] md:p-10">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#6f4f38]">Blog Essay</p>
        <h1 className="mt-3 text-4xl font-tethys-volcanic text-[#2f1f14]">The Ecology of Volcanic Forests</h1>
        <p className="mt-5 leading-relaxed text-[#3f3024]">
          Volcanic forests are disturbance-driven systems. Ashfall, heat pulses, and mineral deposition periodically
          reset local conditions, favoring organisms that can colonize quickly and exploit transient resource windows.
        </p>
        <p className="mt-4 leading-relaxed text-[#3f3024]">
          For storytelling, this creates a world where geography is active and decisions have ecological consequences.
          World of Tethys uses volcanic ecology as a structural force behind conflict, movement, and alliance.
        </p>
      </section>

      <section className="mt-6 rounded-2xl border border-amber-900/25 bg-[#f8f2e8]/95 p-6 shadow-[0_10px_24px_rgba(33,20,10,0.08)]">
        <h2 className="text-2xl font-semibold text-[#2f2015]">Continue Reading</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/world-of-tethys-book-1"
            className="rounded-full border border-[#6d4c36] bg-[#2f2219] px-5 py-2 text-xs uppercase tracking-[0.14em] text-[#f7eee2] transition hover:-translate-y-0.5 hover:bg-[#20160f]"
          >
            Book One
          </Link>
          <Link
            href="/blog"
            className="rounded-full border border-[#8b6b53] bg-[#f8f2e8] px-5 py-2 text-xs uppercase tracking-[0.14em] text-[#3b2a1f] transition hover:-translate-y-0.5 hover:bg-[#efe4d3]"
          >
            Blog Index
          </Link>
          <Link
            href="/press-kit"
            className="rounded-full border border-[#8d5b36] bg-[#f2e2cd] px-5 py-2 text-xs uppercase tracking-[0.14em] text-[#3a2617] transition hover:-translate-y-0.5 hover:bg-[#e8d2b7]"
          >
            Press Kit
          </Link>
        </div>
      </section>
    </article>
  );
}
