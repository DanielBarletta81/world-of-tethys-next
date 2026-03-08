import Link from 'next/link';

export const metadata = {
  title: 'Stryker - The Sky Predator of Tethys',
  description: 'Stryker is a dominant aerial predator in World of Tethys, shaping movement, fear, and tactical response.',
};

export default function StrykerPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 text-stone-100">
      <h1 className="text-4xl font-tethys-volcanic text-stone-50">Stryker - The Sky Predator of Tethys</h1>
      <p className="mt-5 text-stone-300 leading-relaxed">
        Stryker defines the aerial threat model of the region. Its attack windows align with thermal
        shifts, forcing settlements and travelers to rethink timing, route choice, and exposure.
      </p>
      <p className="mt-4 text-stone-300 leading-relaxed">
        Learn more about the novel World of Tethys <Link href="/world-of-tethys-book-1" className="underline hover:text-orange-300">here</Link>.
      </p>
    </main>
  );
}
