import Link from 'next/link';

export const metadata = {
  title: 'Life After the Permian Extinction',
  description:
    'A look at ecological recovery after the Permian extinction and why deep-time rebounds matter for speculative fiction.',
};

export default function LifeAfterPermianPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16 text-stone-100">
      <h1 className="text-4xl font-tethys-volcanic text-stone-50">Life After the Permian Extinction</h1>
      <p className="mt-5 text-stone-300 leading-relaxed">
        The Permian extinction reset biosphere complexity at planetary scale, but recovery was not a
        simple rebound. Ecosystems reassembled through unstable phases, where low-diversity systems
        were highly vulnerable to additional shocks.
      </p>
      <p className="mt-4 text-stone-300 leading-relaxed">
        That pattern matters for fiction set in unstable worlds: resilience is gradual, and dominant
        lineages are temporary. World of Tethys applies this principle by treating ecological order
        as dynamic rather than permanent.
      </p>
      <p className="mt-8 text-stone-200">
        Learn more about the novel World of Tethys <Link href="/world-of-tethys-book-1" className="underline hover:text-orange-300">here</Link>.
      </p>
    </article>
  );
}
