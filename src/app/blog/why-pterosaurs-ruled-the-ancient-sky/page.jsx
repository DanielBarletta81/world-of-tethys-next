import Link from 'next/link';

export const metadata = {
  title: 'Why Pterosaurs Ruled the Ancient Sky',
  description:
    'How pterosaurs dominated ancient aerial ecosystems through wing structure, thermal exploitation, and adaptive behavior.',
};

export default function WhyPterosaursRuledPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16 text-stone-100">
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
