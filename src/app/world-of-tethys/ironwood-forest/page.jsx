import Link from 'next/link';

export const metadata = {
  title: 'Ironwood Forest | World of Tethys Lore',
  description: 'Ironwood Forest in World of Tethys is a high-pressure biome defined by volcanic nutrients, predation, and adaptation.',
};

export default function IronwoodForestPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 text-stone-100">
      <h1 className="text-4xl font-tethys-volcanic text-stone-50">Ironwood Forest - Ecosystem Under Pressure</h1>
      <p className="mt-5 text-stone-300 leading-relaxed">
        Ironwood Forest operates as a volatile edge biome where nutrient pulses and ashfall events
        alter growth cycles and predator density in short time windows.
      </p>
      <p className="mt-4 text-stone-300 leading-relaxed">
        Learn more about the novel World of Tethys <Link href="/world-of-tethys-book-1" className="underline hover:text-orange-300">here</Link>.
      </p>
    </main>
  );
}
