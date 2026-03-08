import Link from 'next/link';

export const metadata = {
  title: 'Life After the Permian Extinction | Natural History',
  description: 'How ecosystems rebuilt after Earth’s largest extinction event.',
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Life After the Permian Extinction',
  author: { '@type': 'Person', name: 'D.C. Barletta' },
  about: 'Mass extinction recovery',
};

export default function NaturalHistoryPermianPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16 text-stone-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <h1 className="text-4xl font-tethys-volcanic text-stone-50">Life After the Permian Extinction</h1>
      <p className="mt-5 text-stone-300 leading-relaxed">
        Recovery after the Permian event happened through unstable ecological phases where resilience
        emerged gradually rather than instantly.
      </p>
      <p className="mt-6 text-stone-200">
        Learn more about the novel World of Tethys <Link href="/world-of-tethys-book-1" className="underline hover:text-orange-300">here</Link>.
      </p>
    </article>
  );
}
