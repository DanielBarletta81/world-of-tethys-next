import Link from 'next/link';

export const metadata = {
  title: 'World of Tethys Blog | Prehistoric Fiction and Natural History',
  description:
    'Explore the World of Tethys blog archive: prehistoric survival, pterosaurs, deep time ecology, and volcanic worldbuilding.',
};

const posts = [
  {
    href: '/blog/could-humans-survive-age-of-dinosaurs',
    title: 'Could Humans Survive the Age of Dinosaurs?',
  },
  {
    href: '/blog/why-pterosaurs-ruled-the-ancient-sky',
    title: 'Why Pterosaurs Ruled the Ancient Sky',
  },
  {
    href: '/blog/life-after-the-permian-extinction',
    title: 'Life After the Permian Extinction',
  },
  {
    href: '/blog/ecology-of-volcanic-forests',
    title: 'The Ecology of Volcanic Forests',
  },
];

export default function BlogPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 text-stone-100">
      <h1 className="text-4xl md:text-5xl font-tethys-volcanic text-stone-50">World of Tethys Blog and Archive</h1>
      <p className="mt-5 text-stone-300 max-w-3xl">
        Articles connecting prehistoric science, ecological fiction, and the worldbuilding behind
        World of Tethys.
      </p>
      <div className="mt-5 flex flex-wrap gap-2 text-xs uppercase tracking-wide text-stone-300">
        <span className="rounded-full border border-stone-600 px-3 py-1">Natural History</span>
        <span className="rounded-full border border-stone-600 px-3 py-1">Worldbuilding</span>
        <span className="rounded-full border border-stone-600 px-3 py-1">Writing Process</span>
        <span className="rounded-full border border-stone-600 px-3 py-1">Tethys Lore</span>
      </div>

      <section className="mt-10 grid gap-4">
        {posts.map((post) => (
          <Link key={post.href} href={post.href} className="rounded-lg border border-stone-700 p-5 hover:border-orange-300">
            <h2 className="text-xl font-semibold">{post.title}</h2>
          </Link>
        ))}
      </section>

      <p className="mt-12 text-stone-200">
        Learn more about the novel World of Tethys <Link href="/world-of-tethys-book-1" className="underline hover:text-orange-300">here</Link>.
      </p>
    </main>
  );
}
