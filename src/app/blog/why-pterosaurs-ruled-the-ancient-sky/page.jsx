import Link from 'next/link';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_WORLD_SITE_URL || 'https://worldoftethys.com';
const PAGE_PATH = '/blog/why-pterosaurs-ruled-the-ancient-sky';
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;

export const metadata = {
  title: 'Why Pterosaurs Ruled the Ancient Sky',
  description:
    'How pterosaurs dominated ancient aerial ecosystems through wing structure, thermal exploitation, and adaptive behavior.',
  alternates: {
    canonical: PAGE_PATH,
  },
  openGraph: {
    type: 'article',
    url: PAGE_URL,
    title: 'Why Pterosaurs Ruled the Ancient Sky',
    description:
      'How pterosaurs dominated ancient aerial ecosystems through wing structure, thermal exploitation, and adaptive behavior.',
  },
};

export default function WhyPterosaursRuledPage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Why Pterosaurs Ruled the Ancient Sky',
    description:
      'How pterosaurs dominated ancient aerial ecosystems through wing structure, thermal exploitation, and adaptive behavior.',
    author: { '@type': 'Person', name: 'D.C. Barletta' },
    publisher: { '@type': 'Person', name: 'D.C. Barletta' },
    mainEntityOfPage: PAGE_URL,
    url: PAGE_URL,
  };

  return (
    <article className="mx-auto max-w-3xl px-6 py-16 text-stone-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <h1 className="text-4xl font-tethys-volcanic text-stone-50">Why Pterosaurs Ruled the Ancient Sky</h1>
      <p className="mt-5 text-stone-300 leading-relaxed">
        Pterosaurs exploited atmospheric structure with high efficiency. Long-distance soaring,
        thermal riding, and selective launch behavior gave them range advantages over terrestrial
        hunters. In fragmented volcanic landscapes, control of the air translates into control of
        access, visibility, and pressure.
      </p>
      <p className="mt-4 text-stone-300 leading-relaxed">
        In World of Tethys, aerial predators are not just creatures but system-level constraints.
        They influence where people build, how they travel, and when they move resources.
      </p>
      <p className="mt-8 text-stone-200">
        Learn more about the novel World of Tethys <Link href="/world-of-tethys-book-1" className="underline hover:text-orange-300">here</Link>.
      </p>
    </article>
  );
}
