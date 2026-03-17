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
    <article className="mx-auto max-w-3xl px-6 py-16 text-stone-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <h1 className="text-4xl font-tethys-volcanic text-stone-50">The Ecology of Volcanic Forests</h1>
      <p className="mt-5 text-stone-300 leading-relaxed">
        Volcanic forests are disturbance-driven systems. Ashfall, heat pulses, and mineral deposition
        periodically reset local conditions, favoring organisms that can colonize quickly and exploit
        transient resource windows.
      </p>
      <p className="mt-4 text-stone-300 leading-relaxed">
        For storytelling, this creates a world where geography is active and decisions have ecological
        consequences. World of Tethys uses volcanic ecology as a structural force behind conflict,
        movement, and alliance.
      </p>
      <p className="mt-8 text-stone-200">
        Learn more about the novel World of Tethys <Link href="/world-of-tethys-book-1" className="underline hover:text-orange-300">here</Link>.
      </p>
    </article>
  );
}
