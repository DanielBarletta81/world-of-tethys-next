import Link from 'next/link';
import { HERO_IMAGE_URLS } from '@/lib/site-assets';

export const metadata = {
  title: 'The World of Tethys | Lore Encyclopedia',
  description: 'Explore Sky City, Stryker, the Watcher Volcano, Ironwood Forest, and Danian Delta in the World of Tethys lore hub.',
};

const lorePages = [
  { href: '/world-of-tethys/sky-city', title: 'Sky City' },
  { href: '/world-of-tethys/stryker', title: 'Stryker' },
  { href: '/world-of-tethys/the-watcher-volcano', title: 'The Watcher Volcano' },
  { href: '/world-of-tethys/ironwood-forest', title: 'Ironwood Forest' },
  { href: '/world-of-tethys/danian-delta', title: 'Danian Delta' },
];

export default function WorldOfTethysHubPage() {
  return (
    <main
      className="mx-auto max-w-5xl rounded-lg border border-stone-700 bg-cover bg-center px-6 py-16 md:py-24 text-stone-100"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(5,4,3,0.84), rgba(5,4,3,0.9)), url(${HERO_IMAGE_URLS.worldHub})`,
      }}
    >
      <h1 className="text-4xl md:text-5xl font-tethys-volcanic text-stone-50">The World of Tethys</h1>
      <p className="mt-5 max-w-3xl text-stone-300 leading-relaxed">
        Encyclopedia entries for key regions, species, and pressures in the world.
      </p>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        {lorePages.map((page) => (
          <Link key={page.href} href={page.href} className="rounded-lg border border-stone-700 p-5 hover:border-orange-300">
            <h2 className="text-xl font-semibold text-stone-100">{page.title}</h2>
          </Link>
        ))}
      </section>

      <p className="mt-12 text-stone-200">
        Learn more about the novel World of Tethys <Link href="/world-of-tethys-book-1" className="underline hover:text-orange-300">here</Link>.
      </p>
    </main>
  );
}
