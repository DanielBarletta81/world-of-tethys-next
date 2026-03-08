import Link from 'next/link';

export const metadata = {
  title: 'Pterosaurs of Tethys | World of Tethys Lore',
  description: 'Pterosaurs in World of Tethys dominate thermal lanes and influence settlement behavior, defense, and travel timing.',
};

export default function PterosaursPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 text-stone-100">
      <h1 className="text-4xl font-tethys-volcanic text-stone-50">Pterosaurs of Tethys - Masters of the Ancient Sky</h1>
      <p className="mt-5 text-stone-300 leading-relaxed">
        Pterosaurs in Tethys exploit wind corridors, thermal updrafts, and coastal turbulence to
        dominate the sky. Their behavior directly shapes security doctrine and civilian movement.
      </p>
      <p className="mt-4 text-stone-300 leading-relaxed">
        Learn more about the novel World of Tethys <Link href="/world-of-tethys-book-1" className="underline hover:text-orange-300">here</Link>.
      </p>
    </main>
  );
}
