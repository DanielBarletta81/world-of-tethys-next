import Link from 'next/link';
import { BACKGROUND_IMAGE_URLS } from '@/lib/site-assets';

const GOODREADS_PROFILE_URL = 'https://www.goodreads.com/author/show/63851248.D_C_Barletta';
const PINTEREST_PROFILE_URL = process.env.NEXT_PUBLIC_PINTEREST_PROFILE_URL;
const GOODREADS_GIVEAWAY_URL = 'https://www.goodreads.com/giveaway/show/435539';
const AMAZON_AUTHOR_URL = 'https://www.amazon.com/stores/D.C.-Barletta/author/B0G5LM24FM';

export const metadata = {
  title: 'Author | D.C. Barletta',
  description: 'Author hub for D.C. Barletta and the World of Tethys series.',
};

export default function AuthorHubPage() {
  return (
    <main
      className="relative mx-auto max-w-5xl rounded-lg border border-stone-700 bg-cover bg-center px-6 py-16 md:py-24 text-stone-100 overflow-hidden parallax-subtle"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(5,4,3,0.84), rgba(5,4,3,0.9)), url(${BACKGROUND_IMAGE_URLS.authorHub})`,
      }}
    >
      <div className="ash-noise-layer" />
      <h1 className="text-4xl md:text-5xl font-tethys-volcanic text-stone-50">Author Hub</h1>
      <p className="mt-5 max-w-3xl text-stone-300 leading-relaxed">
        D.C. Barletta writing notes, publishing updates, and entry points into World of Tethys.
      </p>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <Link href="/about-dc-barletta" className="rounded-lg border border-stone-700 p-5 hover:border-orange-300">
          <h2 className="text-xl font-semibold text-stone-100">About D.C. Barletta</h2>
        </Link>
        <Link href="/world-of-tethys-book-1" className="rounded-lg border border-stone-700 p-5 hover:border-orange-300">
          <h2 className="text-xl font-semibold text-stone-100">Book One</h2>
        </Link>
        <a
          href="https://www.youtube.com/@WorldofTethys"
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-stone-700 p-5 hover:border-orange-300"
        >
          <h2 className="text-xl font-semibold text-stone-100">YouTube Channel</h2>
        </a>
        <a
          href={GOODREADS_PROFILE_URL}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-stone-700 p-5 hover:border-orange-300"
        >
          <h2 className="text-xl font-semibold text-stone-100">Goodreads Profile</h2>
        </a>
        <a
          href={GOODREADS_GIVEAWAY_URL}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-stone-700 p-5 hover:border-orange-300"
        >
          <h2 className="text-xl font-semibold text-stone-100">Goodreads Giveaway</h2>
        </a>
        {PINTEREST_PROFILE_URL ? (
          <a
            href={PINTEREST_PROFILE_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-stone-700 p-5 hover:border-orange-300"
          >
            <h2 className="text-xl font-semibold text-stone-100">Pinterest Profile</h2>
          </a>
        ) : null}
        <a
          href={AMAZON_AUTHOR_URL}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-stone-700 p-5 hover:border-orange-300"
        >
          <h2 className="text-xl font-semibold text-stone-100">Amazon Author Page</h2>
        </a>
      </section>
    </main>
  );
}
