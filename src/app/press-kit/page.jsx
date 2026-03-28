import Link from 'next/link';

const AMAZON_URL = 'https://www.amazon.com/dp/B0GRHBR1HJ';
const WORLD_SITE_URL = process.env.NEXT_PUBLIC_WORLD_SITE_URL || 'https://worldoftethys.com';

export const metadata = {
  title: 'Press | D.C. Barletta',
  description: 'A thin record for D.C. Barletta and World of Tethys.',
};

export default function PressKitPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-14 md:py-20 text-[#2a1f17]">
      <section className="rounded-3xl border border-amber-900/30 bg-[linear-gradient(145deg,#fbf6ee,#e9dac5)] p-8 shadow-[0_20px_46px_rgba(35,20,8,0.14)] md:p-10">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#6f4f38]">Record</p>
        <h1 className="mt-3 text-4xl md:text-5xl font-tethys-volcanic text-[#2f1f14]">Press</h1>
        <p className="mt-4 leading-relaxed text-[#3f3024]">
          A few details above deeper water.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-amber-900/25 bg-[#f8f2e8]/95 p-6 shadow-[0_10px_24px_rgba(33,20,10,0.08)]">
        <h2 className="text-2xl font-semibold text-[#2f2015]">Book One</h2>
        <p className="mt-3 text-[#4f3c30]">World of Tethys. ASIN: B0GRHBR1HJ.</p>
        <a
          href={AMAZON_URL}
          className="mt-4 inline-flex rounded-full border border-[#c6854e] bg-[#d28b4f] px-5 py-2 text-sm font-semibold tracking-[0.04em] text-[#2a1a10] transition hover:-translate-y-0.5 hover:bg-[#bf7a42]"
        >
          Amazon
        </a>
      </section>

      <section className="mt-6 rounded-2xl border border-amber-900/25 bg-[#f8f2e8]/95 p-6 shadow-[0_10px_24px_rgba(33,20,10,0.08)]">
        <h2 className="text-2xl font-semibold text-[#2f2015]">The Name</h2>
        <p className="mt-3 leading-relaxed text-[#4f3c30]">
          Biology. Deep time. Pressure.
        </p>
        <p className="mt-3 text-[#4f3c30]">
          More at{' '}
          <Link href="/about-dc-barletta" className="underline text-[#7a4f30] transition hover:text-[#5f3c23]">
            The Author
          </Link>
        </p>
      </section>

      <section className="mt-6 rounded-2xl border border-amber-900/25 bg-[#f8f2e8]/95 p-6 shadow-[0_10px_24px_rgba(33,20,10,0.08)]">
        <h2 className="text-2xl font-semibold text-[#2f2015]">Below</h2>
        <p className="mt-3 text-[#4f3c30]">
          The larger ruin lives at{' '}
          <a
            href={WORLD_SITE_URL}
            target="_blank"
            rel="noreferrer"
            className="underline text-[#7a4f30] transition hover:text-[#5f3c23]"
          >
            worldoftethys.com
          </a>
        </p>
      </section>
    </main>
  );
}
