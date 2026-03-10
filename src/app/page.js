import Link from 'next/link';
import Image from 'next/image';
import { BACKGROUND_IMAGE_URLS, BOOK1_COVER_URL } from '@/lib/site-assets';
import BookCoverImage from '@/components/content/BookCoverImage';

const AMAZON_URL = 'https://www.amazon.com/dp/B0GRHBR1HJ';
const WORLD_SITE_URL = process.env.NEXT_PUBLIC_WORLD_SITE_URL || 'https://worldoftethys.com';

export const metadata = {
  title: 'World of Tethys - A Prehistoric Epic by D.C. Barletta',
  description:
    'Discover the world of Tethys, a prehistoric epic novel by D.C. Barletta featuring volcanic landscapes, ancient forests, and flying predators.',
  keywords: [
    'world of tethys',
    'dc barletta',
    'prehistoric fiction',
    'evolutionary fantasy',
    'dinosaur-era world',
  ],
};

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Author Hub', href: '/author' },
  { label: 'World Hub', href: '/world' },
  { label: 'Books', href: '/world-of-tethys-book-1' },
  { label: 'World of Tethys', href: '/world-of-tethys' },
  { label: 'Natural History', href: '/natural-history' },
  { label: 'About', href: '/about-dc-barletta' },
  { label: 'Blog', href: '/blog' },
  { label: 'Press Kit', href: '/press-kit' },
  { label: 'Contact', href: '/contact' },
];

const featuredLore = [
  { label: 'Sky City', href: '/world-of-tethys/sky-city' },
  { label: 'Stryker - Sky Predator', href: '/world-of-tethys/stryker' },
  { label: 'The Watcher Volcano', href: '/world-of-tethys/the-watcher-volcano' },
  { label: 'Ironwood Forest', href: '/world-of-tethys/ironwood-forest' },
];

const articlePreviews = [
  { title: 'Could Humans Survive the Age of Dinosaurs?', href: '/blog/could-humans-survive-age-of-dinosaurs' },
  { title: 'Why Pterosaurs Ruled the Ancient Sky', href: '/blog/why-pterosaurs-ruled-the-ancient-sky' },
  { title: 'Life After the Permian Extinction', href: '/blog/life-after-the-permian-extinction' },
  { title: 'Volcanic Forest Ecosystems', href: '/blog/ecology-of-volcanic-forests' },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10 md:py-16 text-stone-100">
      <nav className="rounded-lg border border-stone-700 p-4">
        <ul className="flex flex-wrap gap-3 text-sm">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="rounded-md border border-stone-600 px-3 py-2 hover:border-orange-300">
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href={WORLD_SITE_URL}
              target="_blank"
              rel="noreferrer"
              className="rounded-md border border-stone-600 px-3 py-2 hover:border-orange-300"
            >
              Explore World Atlas
            </a>
          </li>
        </ul>
      </nav>

      <section
        className="relative mt-10 grid gap-10 rounded-lg border border-stone-700 bg-cover bg-center p-6 md:grid-cols-[1fr_1.1fr] md:p-8 items-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(5,4,3,0.82), rgba(5,4,3,0.88)), url(${BACKGROUND_IMAGE_URLS.homepage})`,
        }}
      >
        <div className="ash-noise-layer" />
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-tethys-volcanic leading-tight text-stone-50">
            World of Tethys - A Prehistoric Epic by D.C. Barletta
          </h1>
          <p className="text-lg text-stone-200 max-w-2xl">
            An epic survival story set in a volcanic world of ancient forests, flying predators, and evolving ecosystems.
          </p>
          <a href={AMAZON_URL} className="inline-flex items-center justify-center rounded-md bg-orange-500 px-6 py-3 font-semibold text-black hover:bg-orange-400">
            Read World of Tethys on Amazon
          </a>
        </div>

        <div className="mx-auto w-full max-w-md">
          <BookCoverImage
            primarySrc={BOOK1_COVER_URL}
            fallbackSrc="/img/books/book1-cover.png"
            alt="World of Tethys prehistoric volcanic landscape"
            width={720}
            height={1080}
            className="h-auto w-full rounded-lg border border-stone-700 shadow-2xl"
            priority
          />
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-3xl font-semibold text-stone-100">The World of Tethys</h2>
        <p className="mt-4 max-w-4xl text-stone-300 leading-relaxed">
          World of Tethys is prehistoric fiction rooted in evolutionary fantasy and deep-time survival.
          A dinosaur-era world of volcanic terrain, ancient ecosystems, and aerial predators tests every
          settlement against ecological reality.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/world" className="inline-flex rounded-md border border-stone-500 px-5 py-2 font-semibold hover:border-orange-300">
            Enter the World Hub
          </Link>
          <a
            href={WORLD_SITE_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-md border border-stone-500 px-5 py-2 font-semibold hover:border-orange-300"
          >
            Open worldoftethys.com
          </a>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-3xl font-semibold text-stone-100">Featured Lore</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {featuredLore.map((entry) => (
            <Link key={entry.href} href={entry.href} className="rounded-lg border border-stone-700 p-5 hover:border-orange-300">
              <h3 className="text-xl font-semibold">{entry.label}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-6 md:grid-cols-[220px_1fr] items-start rounded-lg border border-stone-700 p-6">
        <Image
          src="/ray_smile.jpg"
          alt="Author D.C. Barletta"
          width={400}
          height={400}
          className="h-auto w-full rounded-md border border-stone-700"
        />
        <div>
          <h2 className="text-3xl font-semibold text-stone-100">About the Author</h2>
          <p className="mt-3 text-stone-300 leading-relaxed">
            Author D.C. Barletta writes the World of Tethys series as prehistoric science fiction built on
            biology, behavior, and environmental pressure.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/author" className="inline-flex rounded-md border border-stone-500 px-5 py-2 font-semibold hover:border-orange-300">
              Author Hub
            </Link>
            <a
              href="https://www.amazon.com/stores/author/B0G5LM24FM"
              target="_blank"
              rel="noreferrer"
              className="inline-flex rounded-md border border-stone-500 px-5 py-2 font-semibold hover:border-orange-300"
            >
              Visit Amazon Author Page
            </a>
            <Link href="/about-dc-barletta" className="inline-flex rounded-md border border-stone-500 px-5 py-2 font-semibold hover:border-orange-300">
              About the Author
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-16 rounded-lg border border-stone-700 p-6 md:p-8">
        <h2 className="text-2xl font-semibold text-stone-100">The Natural History of Tethys</h2>
        <p className="mt-3 text-stone-300">
          Documentary-style world breakdowns that connect biology, lore, and story arcs.
        </p>
        <a href="https://www.youtube.com/@worldoftethysauthor" className="mt-4 inline-flex rounded-md border border-stone-500 px-5 py-2 font-semibold hover:border-orange-300">
          Watch on YouTube
        </a>
      </section>

      <section className="mt-16">
        <h2 className="text-3xl font-semibold text-stone-100">Blog and Articles</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {articlePreviews.map((article) => (
            <Link key={article.href} href={article.href} className="rounded-lg border border-stone-700 p-5 hover:border-orange-300">
              <h3 className="text-lg font-semibold">{article.title}</h3>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
