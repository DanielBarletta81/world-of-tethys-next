import Link from 'next/link';

export const metadata = {
  title: 'The Ecology of Volcanic Forests',
  description:
    'Understand how volcanic forests function through nutrient pulses, disturbance cycles, and rapid adaptation.',
};

export default function EcologyOfVolcanicForestsPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16 text-stone-100">
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
