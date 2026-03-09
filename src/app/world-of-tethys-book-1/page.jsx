import Link from 'next/link';
import { BACKGROUND_IMAGE_URLS, BOOK1_COVER_URL } from '@/lib/site-assets';
import BookCoverImage from '@/components/content/BookCoverImage';

const AMAZON_URL = 'https://www.amazon.com/dp/B0GRHBR1HJ';
const WORLD_SITE_URL = process.env.NEXT_PUBLIC_WORLD_SITE_URL || 'https://worldoftethys.com';

export const metadata = {
  title: 'World of Tethys Book 1 - Prehistoric Epic by D.C. Barletta',
  description:
    'Discover the world of Tethys, a prehistoric epic novel by D.C. Barletta featuring volcanic landscapes, ancient forests, and flying predators.',
  keywords: ['world of tethys book 1', 'prehistoric fiction', 'dinosaur survival novel', 'evolutionary fantasy'],
};

const bookSchema = {
  '@context': 'https://schema.org',
  '@type': 'Book',
  name: 'World of Tethys',
  author: { '@type': 'Person', name: 'D.C. Barletta' },
  asin: 'B0GRHBR1HJ',
  url: 'https://dcbarletta.com/world-of-tethys-book-1',
  sameAs: 'https://www.amazon.com/dp/B0GRHBR1HJ',
};

const characters = ['Igzier', 'Karys', 'Ravel', 'Stryker', 'Jairo'];

export default function WorldOfTethysBookOnePage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 md:py-24 text-stone-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bookSchema) }} />

      <header
        className="grid gap-8 rounded-lg border border-stone-700 bg-cover bg-center p-6 md:grid-cols-[1fr_320px] md:p-8 items-start"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(5,4,3,0.82), rgba(5,4,3,0.9)), url(${BACKGROUND_IMAGE_URLS.bookPage})`,
        }}
      >
        <div>
          <h1 className="text-4xl md:text-5xl font-tethys-volcanic text-stone-50">World of Tethys - Book One</h1>
          <p className="mt-4 text-stone-300 leading-relaxed">
            The first volume of a prehistoric epic where biology, conflict, and terrain are tightly linked.
          </p>
        </div>
        <BookCoverImage
          primarySrc={BOOK1_COVER_URL}
          fallbackSrc="/img/books/book1-hero-3.png"
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
        <a href={AMAZON_URL} className="mt-4 inline-flex rounded-md bg-orange-500 px-6 py-3 font-semibold text-black hover:bg-orange-400">
          Buy World of Tethys on Amazon
        </a>
      </section>
    </main>
  );
}
