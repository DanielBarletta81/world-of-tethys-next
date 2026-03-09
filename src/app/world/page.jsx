import Link from 'next/link';
import { BACKGROUND_IMAGE_URLS } from '@/lib/site-assets';

export const metadata = {
  title: 'World | Tethys Atlas',
  description: 'World hub for the deep-dive atlas, map, lore, and ecosystem pages for Tethys.',
};

const worldEntries = [
  { href: '/world/map', title: 'Interactive Map' },
  { href: '/world-of-tethys', title: 'Lore Hub' },
  { href: '/natural-history', title: 'Natural History' },
  { href: '/creatures', title: 'Creatures' },
];

export default function WorldHubPage() {
  return (
    <main
      className="relative mx-auto max-w-5xl rounded-lg border border-stone-700 bg-cover bg-center px-6 py-16 md:py-24 text-stone-100 overflow-hidden parallax-subtle"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(5,4,3,0.84), rgba(5,4,3,0.9)), url(${BACKGROUND_IMAGE_URLS.worldAtlas})`,
      }}
    >
      <div className="ash-noise-layer" />
      <h1 className="text-4xl md:text-5xl font-tethys-volcanic text-stone-50">World Hub</h1>
      <p className="mt-5 max-w-3xl text-stone-300 leading-relaxed">
        Deep-dive world content, map systems, and regional ecology for World of Tethys.
      </p>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        {worldEntries.map((entry) => (
          <Link key={entry.href} href={entry.href} className="rounded-lg border border-stone-700 p-5 hover:border-orange-300">
            <h2 className="text-xl font-semibold text-stone-100">{entry.title}</h2>
          </Link>
        ))}
      </section>
    </main>
  );
}
