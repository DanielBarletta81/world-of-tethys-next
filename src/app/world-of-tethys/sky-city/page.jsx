import Link from 'next/link';

export const metadata = {
  title: 'Sky City | World of Tethys Lore',
  description: 'Sky City in World of Tethys: an elevated stronghold balancing trade, surveillance, and aerial defense.',
};

export default function SkyCityPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 text-stone-100">
      <h1 className="text-4xl font-tethys-volcanic text-stone-50">Sky City - The Elevated Citadel of Tethys</h1>
      <p className="mt-5 text-stone-300 leading-relaxed">
        Sky City sits above unstable terrain where altitude becomes strategy. Its architecture,
        watchlines, and trade corridors are designed around thermal drift, ashfall, and recurrent
        predator pressure.
      </p>
      <p className="mt-4 text-stone-300 leading-relaxed">
        Learn more about the novel World of Tethys <Link href="/world-of-tethys-book-1" className="underline hover:text-orange-300">here</Link>.
      </p>
    </main>
  );
}
