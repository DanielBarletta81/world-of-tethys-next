import Link from 'next/link';

export const metadata = {
  title: 'Could Humans Survive Dinosaur Era Ecosystems? | Natural History',
  description: 'A survival analysis of human viability in dinosaur-era ecosystems.',
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Could Humans Survive Dinosaur Era Ecosystems?',
  author: { '@type': 'Person', name: 'D.C. Barletta' },
  about: 'Prehistoric survival ecology',
};

export default function NaturalHistoryHumansPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16 text-stone-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <h1 className="text-4xl font-tethys-volcanic text-stone-50">Could Humans Survive Dinosaur Era Ecosystems?</h1>
      <p className="mt-5 text-stone-300 leading-relaxed">
        Human survival would depend on information discipline, mobility, and elevated refuges more than
        strength alone, especially in predator-rich migration corridors.
      </p>
      <p className="mt-6 text-stone-200">
        Learn more about the novel World of Tethys <Link href="/world-of-tethys-book-1" className="underline hover:text-orange-300">here</Link>.
      </p>
    </article>
  );
}
