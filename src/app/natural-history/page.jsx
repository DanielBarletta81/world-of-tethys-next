import Link from 'next/link';
import { HERO_IMAGE_URLS } from '@/lib/site-assets';

export const metadata = {
  title: 'Natural History | D.C. Barletta',
  description: 'Natural history essays on pterosaurs, mass extinctions, volcanic forest ecology, and prehistoric coastal systems.',
};

const articles = [
  { href: '/natural-history/tethys-ocean', title: 'Tethys Ocean Research Brief (Aptian-Albian)' },
  { href: '/natural-history/pterosaurs', title: 'Why Pterosaurs Ruled the Sky' },
  { href: '/natural-history/life-after-the-permian-extinction', title: 'Evolution After Mass Extinction' },
  { href: '/natural-history/could-humans-survive-dinosaur-era', title: 'Could Humans Survive Dinosaur Era Ecosystems?' },
];

export default function NaturalHistoryPage() {
  return (
    <main
      className="relative mx-auto max-w-5xl rounded-lg border border-stone-700 bg-cover bg-center px-6 py-16 text-stone-100 overflow-hidden parallax-subtle"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(5,4,3,0.84), rgba(5,4,3,0.9)), url(${HERO_IMAGE_URLS.naturalHistory})`,
      }}
    >
      <div className="ash-noise-layer" />
      <h1 className="text-4xl md:text-5xl font-tethys-volcanic text-stone-50">Natural History</h1>
      <p className="mt-4 max-w-3xl text-stone-300">
        Essays on prehistoric biology, ecological stress, and deep-time adaptation.
      </p>
      <section className="mt-8 grid gap-4">
        {articles.map((article) => (
          <Link key={article.href} href={article.href} className="rounded-lg border border-stone-700 p-5 hover:border-orange-300">
            <h2 className="text-xl font-semibold">{article.title}</h2>
          </Link>
        ))}
      </section>
    </main>
  );
}
