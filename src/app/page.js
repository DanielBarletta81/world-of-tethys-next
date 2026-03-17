import Link from 'next/link';
import { BACKGROUND_IMAGE_URLS, BOOK1_COVER_URL } from '@/lib/site-assets';
import BookCoverImage from '@/components/content/BookCoverImage';

const AMAZON_URL = 'https://www.amazon.com/dp/B0GRHBR1HJ';
const WORLD_SITE_URL = process.env.NEXT_PUBLIC_WORLD_SITE_URL || 'https://worldoftethys.com';

export const metadata = {
  title: 'D.C. Barletta | Author Site',
  description:
    'Author site for D.C. Barletta with book pages, essays, press information, and a direct path into the World of Tethys archive.',
  keywords: [
    'd.c. barletta',
    'world of tethys',
    'author site',
    'prehistoric fiction',
    'natural history writing',
  ],
};

const navItems = [
  { label: 'Author', href: '/author' },
  { label: 'Book', href: '/world-of-tethys-book-1' },
  { label: 'Essays', href: '/blog' },
  { label: 'Press', href: '/press-kit' },
  { label: 'Contact', href: '/contact' },
];

const authorSections = [
  {
    title: 'Author Hub',
    body: 'Background, links, and the through-line behind the World of Tethys project.',
    href: '/author',
  },
  {
    title: 'Book Page',
    body: 'The clean sales and story entry point for World of Tethys Book One.',
    href: '/world-of-tethys-book-1',
  },
  {
    title: 'Essays and Articles',
    body: 'Writing-first natural history and speculative worldbuilding pieces.',
    href: '/blog',
  },
];

const essayPreviews = [
  { title: 'Could Humans Survive the Age of Dinosaurs?', href: '/blog/could-humans-survive-age-of-dinosaurs' },
  { title: 'Why Pterosaurs Ruled the Ancient Sky', href: '/blog/why-pterosaurs-ruled-the-ancient-sky' },
  { title: 'Life After the Permian Extinction', href: '/blog/life-after-the-permian-extinction' },
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
          backgroundImage: `linear-gradient(to bottom, rgba(5,4,3,0.82), rgba(5,4,3,0.88)), url(${BACKGROUND_IMAGE_URLS.authorHub})`,
        }}
      >
        <div className="ash-noise-layer" />
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-tethys-volcanic leading-tight text-stone-50">
            D.C. Barletta writes prehistoric fiction shaped by ecology, tension, and deep time.
          </h1>
          <p className="text-lg text-stone-200 max-w-2xl">
            This site stays focused on the author, the book, and the writing. The heavier map, archive, and immersive world systems live at `worldoftethys.com`.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/author" className="inline-flex items-center justify-center rounded-md bg-orange-500 px-6 py-3 font-semibold text-black hover:bg-orange-400">
              Enter Author Hub
            </Link>
            <Link href="/world-of-tethys-book-1" className="inline-flex items-center justify-center rounded-md border border-stone-500 px-6 py-3 font-semibold hover:border-orange-300">
              Open Book Page
            </Link>
          </div>
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
        <h2 className="text-3xl font-semibold text-stone-100">What Lives Here</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {authorSections.map((entry) => (
            <Link key={entry.title} href={entry.href} className="rounded-lg border border-stone-700 p-5 hover:border-orange-300">
              <h3 className="text-xl font-semibold">{entry.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-stone-300">{entry.body}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-lg border border-stone-700 p-6 md:p-8">
        <h2 className="text-3xl font-semibold text-stone-100">World of Tethys Lives on Its Own Domain</h2>
        <p className="mt-4 max-w-4xl text-stone-300 leading-relaxed">
          The immersive atlas, world archive, natural-history layers, and player systems are moving onto `worldoftethys.com`.
          This author site stays leaner: book context, creator information, essays, and clear paths into the world project.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href={WORLD_SITE_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-md border border-stone-500 px-5 py-2 font-semibold hover:border-orange-300"
          >
            Open worldoftethys.com
          </a>
          <Link href="/world-of-tethys-book-1" className="inline-flex rounded-md border border-stone-500 px-5 py-2 font-semibold hover:border-orange-300">
            View the Book
          </Link>
          <Link href="/press-kit" className="inline-flex rounded-md border border-stone-500 px-5 py-2 font-semibold hover:border-orange-300">
            Press Kit
          </Link>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-3xl font-semibold text-stone-100">Recent Writing Paths</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {essayPreviews.map((entry) => (
            <Link key={entry.href} href={entry.href} className="rounded-lg border border-stone-700 p-5 hover:border-orange-300">
              <h3 className="text-xl font-semibold">{entry.title}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-6 rounded-lg border border-stone-700 p-6 md:grid-cols-[1fr_220px]">
        <div>
          <h2 className="text-3xl font-semibold text-stone-100">Core Links</h2>
          <p className="mt-3 text-stone-300 leading-relaxed">
            Keep the author site clean and fast. Use it to explain the work, route people to the book, and send readers into the larger world archive when they want depth.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href={AMAZON_URL} className="inline-flex rounded-md border border-stone-500 px-5 py-2 font-semibold hover:border-orange-300">
              View the Book
            </a>
            <Link href="/world-of-tethys-book-1" className="inline-flex rounded-md border border-stone-500 px-5 py-2 font-semibold hover:border-orange-300">
              Open Book Page
            </Link>
            <a href={WORLD_SITE_URL} target="_blank" rel="noreferrer" className="inline-flex rounded-md border border-stone-500 px-5 py-2 font-semibold hover:border-orange-300">
              Explore the World Site
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
