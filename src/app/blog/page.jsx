import Link from 'next/link';

export const metadata = {
  title: 'World of Tethys Blog | Prehistoric Fiction and Natural History',
  description:
    'Field notes from the waterline of Tethys.',
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
    <main className="mx-auto max-w-5xl px-6 py-14 md:py-20 text-[#2a1f17]">
      <section className="rounded-3xl border border-amber-900/30 bg-[linear-gradient(145deg,#fbf6ee,#e9dac5)] p-8 shadow-[0_20px_46px_rgba(35,20,8,0.14)] md:p-10">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#6f4f38]">Field Notes</p>
        <h1 className="mt-3 text-4xl md:text-5xl font-tethys-volcanic text-[#2f1f14]">Fragments from the edge.</h1>
        <p className="mt-5 max-w-3xl text-[#3f3024] leading-relaxed">
          Teeth, weather, ash, and older systems.
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-xs uppercase tracking-wide text-[#5b4432]">
          <span className="rounded-full border border-amber-900/25 bg-[#f8f2e8]/95 px-3 py-1">Natural History</span>
          <span className="rounded-full border border-amber-900/25 bg-[#f8f2e8]/95 px-3 py-1">Tethys Lore</span>
        </div>
      </section>

      <section className="mt-8 grid gap-4">
        {posts.map((post) => (
          <Link
            key={post.href}
            href={post.href}
            className="group rounded-2xl border border-amber-900/25 bg-[#f8f2e8]/95 p-5 shadow-[0_10px_24px_rgba(33,20,10,0.08)] transition duration-200 hover:-translate-y-1 hover:border-[#b07646]/45 hover:bg-[#fff8ef] hover:shadow-[0_18px_32px_rgba(33,20,10,0.14)]"
          >
            <h2 className="text-xl font-semibold text-[#312115] transition-colors group-hover:text-[#24170f]">{post.title}</h2>
          </Link>
        ))}
      </section>

      <section className="mt-8 rounded-2xl border border-amber-900/25 bg-[#f8f2e8]/95 p-6 shadow-[0_10px_24px_rgba(33,20,10,0.08)]">
        <h2 className="text-2xl font-semibold text-[#2f2015]">Elsewhere</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/world-of-tethys-book-1"
            className="rounded-full border border-[#6d4c36] bg-[#2f2219] px-5 py-2 text-xs uppercase tracking-[0.14em] text-[#f7eee2] transition hover:-translate-y-0.5 hover:bg-[#20160f]"
          >
            Book One
          </Link>
          <Link
            href="/press-kit"
            className="rounded-full border border-[#8d5b36] bg-[#f2e2cd] px-5 py-2 text-xs uppercase tracking-[0.14em] text-[#3a2617] transition hover:-translate-y-0.5 hover:bg-[#e8d2b7]"
          >
            Press
          </Link>
        </div>
      </section>
    </main>
  );
}
