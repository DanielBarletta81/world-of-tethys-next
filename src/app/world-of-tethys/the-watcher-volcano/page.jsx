import Link from 'next/link';

export const metadata = {
  title: 'The Watcher Volcano | World of Tethys Lore',
  description: 'The Watcher Volcano is a central geologic force in World of Tethys, driving ashfall, migration shifts, and conflict.',
};

export default function WatcherVolcanoPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 text-stone-100">
      <h1 className="text-4xl font-tethys-volcanic text-stone-50">The Watcher Volcano - Geologic Core of Tethys</h1>
      <p className="mt-5 text-stone-300 leading-relaxed">
        The Watcher is more than scenery. Eruptive cycles alter water chemistry, visibility, and
        migration timing, creating recurring stress on settlements and supply routes.
      </p>
      <p className="mt-4 text-stone-300 leading-relaxed">
        Learn more about the novel World of Tethys <Link href="/world-of-tethys-book-1" className="underline hover:text-orange-300">here</Link>.
      </p>
    </main>
  );
}
