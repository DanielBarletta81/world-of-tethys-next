import Link from 'next/link';

export const metadata = {
  title: 'Why Pterosaurs Ruled the Sky | Natural History',
  description: 'A natural history perspective on how pterosaurs dominated prehistoric airspace.',
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Why Pterosaurs Ruled the Sky',
  author: { '@type': 'Person', name: 'D.C. Barletta' },
  about: 'Prehistoric natural history',
};

export default function NaturalHistoryPterosaursPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16 text-stone-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <h1 className="text-4xl font-tethys-volcanic text-stone-50">Why Pterosaurs Ruled the Sky</h1>
      <p className="mt-5 text-stone-300 leading-relaxed">
        Pterosaurs optimized thermal flight, launch efficiency, and route timing in ways that gave
        them system-level control of prehistoric aerial space.
      </p>
      <p className="mt-6 text-stone-200">
        Learn more about the novel World of Tethys <Link href="/world-of-tethys-book-1" className="underline hover:text-orange-300">here</Link>.
      </p>
    </article>
  );
}
