import Link from 'next/link';
import { BACKGROUND_IMAGE_URLS, BOOK1_COVER_URL } from '@/lib/site-assets';
import BookCoverImage from '@/components/content/BookCoverImage';
import { getSiteVariantFromConfig } from '@/lib/site-variant';
import DynxEvent from '@/components/ads/DynxEvent';

const AMAZON_URL = 'https://www.amazon.com/dp/B0GRHBR1HJ';
const WORLD_SITE_URL = process.env.NEXT_PUBLIC_WORLD_SITE_URL || 'https://worldoftethys.com';
const BOOK_PATH = '/world-of-tethys-book-1';

export const metadata = {
  title: 'World of Tethys Book 1 - Prehistoric Epic by D.C. Barletta',
  description:
    'World of Tethys Book One. Sky City above. Older stone below.',
  alternates: {
    canonical: BOOK_PATH,
  },
};

const characters = ['Igzier', 'Karys', 'Ravel', 'Stryker', 'Jairo'];
const authorBookMarks = [
  { label: 'First', value: 'Book One' },
  { label: 'Above', value: 'Sky City' },
  { label: 'Below', value: 'Cambria' },
];

export default function WorldOfTethysBookOnePage() {
  const siteVariant = getSiteVariantFromConfig();
  const isAuthorSite = siteVariant === 'author';
  const siteUrl =
    (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_WORLD_SITE_URL || 'https://worldoftethys.com').replace(
      /\/$/,
      ''
    );
  const pageUrl = `${siteUrl}${BOOK_PATH}`;
  const bookSchema = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: 'World of Tethys',
    author: { '@type': 'Person', name: 'D.C. Barletta' },
    asin: 'B0GRHBR1HJ',
    url: pageUrl,
    sameAs: AMAZON_URL,
  };

  if (isAuthorSite) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-14 md:py-20 text-[#2a1f17]">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bookSchema) }} />
        <DynxEvent itemId="book-1" pageType="product" />

        <header className="grid gap-8 rounded-3xl border border-amber-900/30 bg-[linear-gradient(145deg,#fbf6ee,#e9dac5)] p-8 shadow-[0_24px_60px_rgba(35,20,8,0.14)] md:grid-cols-[1fr_320px] md:p-10">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#6f4f38]">First Opening</p>
            <h1 className="mt-3 text-4xl font-tethys-volcanic text-[#2f1f14] md:text-5xl">World of Tethys — Book One</h1>
            <p className="mt-4 max-w-2xl leading-relaxed text-[#3f3024]">
              Sky City hangs above the fracture. Something older waits below.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={AMAZON_URL}
                className="rounded-full border border-[#c6854e] bg-[#d28b4f] px-6 py-3 text-sm font-medium tracking-[0.04em] text-[#2a1a10] transition hover:-translate-y-0.5 hover:bg-[#bf7a42]"
              >
                Amazon
              </a>
              <Link
                href="/press-kit"
                className="rounded-full border border-[#8d5b36] bg-[#f2e2cd] px-6 py-3 text-sm font-medium tracking-[0.04em] text-[#3a2617] transition hover:-translate-y-0.5 hover:bg-[#e8d2b7]"
              >
                Press
              </Link>
              <a
                href={WORLD_SITE_URL}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-[#8b6b53] bg-[#f8f2e8] px-6 py-3 text-sm font-medium tracking-[0.04em] text-[#3b2a1f] transition hover:-translate-y-0.5 hover:bg-[#efe4d3]"
              >
                World
              </a>
            </div>
            <div className="mt-6 grid max-w-2xl gap-3 sm:grid-cols-3">
              {authorBookMarks.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[1.3rem] border border-amber-900/18 bg-white/55 px-4 py-4"
                >
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#7c6250]">{item.label}</p>
                  <p className="mt-2 text-sm font-semibold text-[#2f1f14]">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <BookCoverImage
            primarySrc={BOOK1_COVER_URL}
            fallbackSrc={BOOK1_COVER_URL}
            alt="World of Tethys Book 1 cover"
            width={720}
            height={1080}
            className="h-auto w-full rounded-2xl border border-amber-900/25 shadow-[0_14px_30px_rgba(33,20,10,0.14)]"
          />
        </header>

        <section className="mt-8 rounded-2xl border border-amber-900/25 bg-[#f8f2e8]/95 p-6 shadow-[0_10px_24px_rgba(33,20,10,0.08)]">
          <h2 className="text-2xl font-semibold text-[#2f2015]">The Fracture</h2>
          <p className="mt-3 leading-relaxed text-[#4f3c30]">
            Alliances bend. Hunger closes in. The terrain remembers.
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-amber-900/25 bg-[#f8f2e8]/95 p-6 shadow-[0_10px_24px_rgba(33,20,10,0.08)]">
          <h2 className="text-2xl font-semibold text-[#2f2015]">The Ledge</h2>
          <p className="mt-3 leading-relaxed text-[#4f3c30]">
            Sky City, ironwood dark, the Watcher, and older stone beneath them.
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-amber-900/25 bg-[#f8f2e8]/95 p-6 shadow-[0_10px_24px_rgba(33,20,10,0.08)]">
          <h2 className="text-2xl font-semibold text-[#2f2015]">The Names</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {characters.map((name) => (
              <div
                key={name}
                className="rounded-xl border border-amber-900/20 bg-[#fdf9f2] px-4 py-3 text-[#3d2b1d] transition duration-200 hover:-translate-y-0.5 hover:border-[#b07646]/45 hover:bg-[#fff8ef]"
              >
                {name}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-amber-900/25 bg-[#f8f2e8]/95 p-6 shadow-[0_10px_24px_rgba(33,20,10,0.08)]">
          <h2 className="text-2xl font-semibold text-[#2f2015]">Below</h2>
          <p className="mt-3 leading-relaxed text-[#4f3c30]">
            Ash. thermals. migration. pressure.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/world-of-tethys/sky-city"
              className="rounded-full border border-[#8b6b53] bg-[#f8f2e8] px-5 py-2 text-xs uppercase tracking-[0.14em] text-[#3b2a1f] transition hover:-translate-y-0.5 hover:bg-[#efe4d3]"
            >
              Sky City
            </Link>
            <Link
              href="/world-of-tethys/ironwood-forest"
              className="rounded-full border border-[#8b6b53] bg-[#f8f2e8] px-5 py-2 text-xs uppercase tracking-[0.14em] text-[#3b2a1f] transition hover:-translate-y-0.5 hover:bg-[#efe4d3]"
            >
              Ironwood
            </Link>
            <Link
              href="/world-of-tethys/the-watcher-volcano"
              className="rounded-full border border-[#8b6b53] bg-[#f8f2e8] px-5 py-2 text-xs uppercase tracking-[0.14em] text-[#3b2a1f] transition hover:-translate-y-0.5 hover:bg-[#efe4d3]"
            >
              Watcher
            </Link>
            <Link
              href="/archive/cambria"
              className="rounded-full border border-[#8b6b53] bg-[#f8f2e8] px-5 py-2 text-xs uppercase tracking-[0.14em] text-[#3b2a1f] transition hover:-translate-y-0.5 hover:bg-[#efe4d3]"
            >
              Cambria
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 md:py-24 text-stone-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bookSchema) }} />
      <DynxEvent itemId="book-1" pageType="product" />

      <header
        className="relative grid gap-8 rounded-lg border border-stone-700 bg-cover bg-center p-6 md:grid-cols-[1fr_320px] md:p-8 items-start overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(5,4,3,0.82), rgba(5,4,3,0.9)), url(${BACKGROUND_IMAGE_URLS.bookPage})`,
        }}
      >
        <div className="ash-noise-layer" />
        <div>
          <h1 className="text-4xl md:text-5xl font-tethys-volcanic text-stone-50">World of Tethys - Book One</h1>
          <p className="mt-4 text-stone-300 leading-relaxed">
            The first volume of a prehistoric epic where biology, conflict, and terrain are tightly linked.
          </p>
        </div>
        <BookCoverImage
          primarySrc={BOOK1_COVER_URL}
          fallbackSrc={BOOK1_COVER_URL}
          alt="World of Tethys Book 1 cover"
          width={720}
          height={1080}
          className="h-auto w-full rounded-lg border border-stone-700"
        />
      </header>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold">About the Book</h2>
        <p className="mt-3 text-stone-300 leading-relaxed">
          In a world shaped by volcanic cycles and aerial predation, survivors navigate unstable alliances,
          fractured terrain, and escalating ecological pressure.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">The Setting</h2>
        <p className="mt-3 text-stone-300 leading-relaxed">
          Sky City, Ironwood forests, the Watcher volcano, and ancient ecosystems establish a setting where
          environmental shifts and migration corridors drive political decisions.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Characters</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {characters.map((name) => (
            <div key={name} className="rounded-md border border-stone-700 px-4 py-3 text-stone-200">
              {name}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Ecology of Tethys</h2>
        <p className="mt-3 text-stone-300 leading-relaxed">
          Ecosystem logic shapes the narrative: ashfall windows, thermal routes, and predator-prey dynamics
          influence strategy and survival.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <Link href="/world-of-tethys/sky-city" className="underline hover:text-orange-300">Sky City</Link>
          <Link href="/world-of-tethys/ironwood-forest" className="underline hover:text-orange-300">Ironwood Forest</Link>
          <Link href="/world-of-tethys/the-watcher-volcano" className="underline hover:text-orange-300">The Watcher Volcano</Link>
        </div>
        <a
          href={WORLD_SITE_URL}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex rounded-md border border-stone-500 px-5 py-2 font-semibold hover:border-orange-300"
        >
          Explore the Full Atlas at worldoftethys.com
        </a>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">Buy</h2>
        <p className="mt-3 text-stone-300">Available on Amazon Kindle and Paperback.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href={AMAZON_URL} className="inline-flex rounded-md bg-orange-500 px-6 py-3 font-semibold text-black hover:bg-orange-400">
            Buy World of Tethys on Amazon
          </a>
          <Link
            href="/press-kit"
            className="inline-flex rounded-md border border-stone-500 px-5 py-3 font-semibold text-stone-100 hover:border-orange-300 hover:text-orange-100"
          >
            Press
          </Link>
        </div>
      </section>
    </main>
  );
}
