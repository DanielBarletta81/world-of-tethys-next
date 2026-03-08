import Link from 'next/link';

export const metadata = {
  title: 'Natural History | D.C. Barletta',
  description: 'Natural history essays on pterosaurs, mass extinctions, volcanic forest ecology, and prehistoric coastal systems.',
};

const articles = [
  { href: '/natural-history/pterosaurs', title: 'Why Pterosaurs Ruled the Sky' },
  { href: '/natural-history/life-after-the-permian-extinction', title: 'Evolution After Mass Extinction' },
  { href: '/natural-history/could-humans-survive-dinosaur-era', title: 'Could Humans Survive Dinosaur Era Ecosystems?' },
];

export default function NaturalHistoryPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 text-stone-100">
      <h1 className="text-4xl md:text-5xl font-tethys-volcanic text-stone-50">Natural History</h1>
      <p className="mt-4 max-w-3xl text-stone-300">
        The science authority zone: essays on prehistoric biology, ecological stress, and deep-time adaptation.
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
