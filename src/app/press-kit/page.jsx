import Link from 'next/link';

const AMAZON_URL = 'https://www.amazon.com/dp/B0GRHBR1HJ';
const WORLD_SITE_URL = process.env.NEXT_PUBLIC_WORLD_SITE_URL || 'https://worldoftethys.com';

export const metadata = {
  title: 'Press Kit | D.C. Barletta',
  description: 'Press kit for D.C. Barletta and World of Tethys with author bio, book details, and media links.',
};

export default function PressKitPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16 text-stone-100">
      <h1 className="text-4xl md:text-5xl font-tethys-volcanic text-stone-50">Press Kit</h1>
      <p className="mt-4 text-stone-300 leading-relaxed">
        D.C. Barletta writes prehistoric science fiction in the World of Tethys series. Core themes include
        ecological survival, deep-time adaptation, and volcanic world systems.
      </p>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Book</h2>
        <p className="mt-3 text-stone-300">World of Tethys - Book One (ASIN: B0GRHBR1HJ)</p>
        <a href={AMAZON_URL} className="mt-4 inline-flex rounded-md bg-orange-500 px-5 py-2 font-semibold text-black hover:bg-orange-400">
          Buy on Amazon
        </a>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Author Bio</h2>
        <p className="mt-3 text-stone-300 leading-relaxed">
          D.C. Barletta builds fiction around natural history logic, using environmental pressure and
          species interaction as central narrative forces.
        </p>
        <p className="mt-3 text-stone-300">
          Full author page: <Link href="/about-dc-barletta" className="underline hover:text-orange-300">About D.C. Barletta</Link>
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">World Resources</h2>
        <p className="mt-3 text-stone-300">
          Immersive atlas and archive: <a href={WORLD_SITE_URL} target="_blank" rel="noreferrer" className="underline hover:text-orange-300">worldoftethys.com</a>
        </p>
      </section>
    </main>
  );
}
