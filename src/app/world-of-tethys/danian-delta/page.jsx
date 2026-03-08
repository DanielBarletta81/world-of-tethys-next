import Link from 'next/link';

export const metadata = {
  title: 'Danian Delta | World of Tethys Lore',
  description: 'Danian Delta is a shifting estuarine frontier in the World of Tethys, where tides, silt, and predation shape survival.',
};

export default function DanianDeltaPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 text-stone-100">
      <h1 className="text-4xl font-tethys-volcanic text-stone-50">Danian Delta - The Shifting Estuary of Tethys</h1>
      <p className="mt-5 text-stone-300 leading-relaxed">
        The Danian Delta is a constantly reworked edge-zone where tide pulses, sediment plumes,
        and predator routes force settlements to adapt with each cycle.
      </p>
      <p className="mt-4 text-stone-300 leading-relaxed">
        Learn more about the novel World of Tethys <Link href="/world-of-tethys-book-1" className="underline hover:text-orange-300">here</Link>.
      </p>
    </main>
  );
}
