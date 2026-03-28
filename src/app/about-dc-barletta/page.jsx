import Link from 'next/link';
import { Compass, Feather, Microscope, Waves } from 'lucide-react';

export const metadata = {
  title: 'About D.C. Barletta',
  description:
    'About D.C. Barletta, author of World of Tethys, with a focus on biology, natural history, deep-time systems, Cambria, and prehistoric science-fantasy storytelling.',
  keywords: ['about dc barletta', 'world of tethys author', 'prehistoric fiction author', 'natural history storytelling'],
};

const buildPillars = [
  {
    title: 'Biology in the frame',
    body: 'Predator dynamics, migration, and environmental pressure are not decoration. They help determine what the world can do.',
    Icon: Microscope,
  },
  {
    title: 'Systems under strain',
    body: 'Cities, routes, food webs, and resource logic all matter because pressure changes what people choose and what survives.',
    Icon: Waves,
  },
  {
    title: 'Wonder with consequence',
    body: 'The aim is a world that still feels mythic and uncanny, but behaves as if it has history, cost, weight, and buried layers like Cambria.',
    Icon: Compass,
  },
];

export default function AboutDcBarlettaPage() {
  const worldSiteUrl = process.env.NEXT_PUBLIC_WORLD_SITE_URL || 'https://worldoftethys.com';
  const authorSiteUrl = process.env.NEXT_PUBLIC_AUTHOR_SITE_URL || 'https://dcbarletta.com';
  const authorSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'D.C. Barletta',
    url: `${authorSiteUrl.replace(/\/$/, '')}/about-dc-barletta`,
    jobTitle: 'Author',
    knowsAbout: ['Prehistoric fiction', 'Natural history storytelling', 'Science fiction'],
  };

  return (
    <main className="mx-auto max-w-5xl px-6 py-14 md:py-20 text-[#2a1f17]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(authorSchema) }} />

      <section className="relative overflow-hidden rounded-[2.2rem] border border-[#8e765b]/20 bg-[linear-gradient(145deg,rgba(252,247,239,0.98),rgba(236,225,206,0.94))] px-8 py-8 shadow-[0_24px_60px_rgba(35,20,8,0.12)] md:px-10 md:py-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(118,181,175,0.16),transparent_30%),radial-gradient(circle_at_88%_10%,rgba(185,119,66,0.16),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.18),transparent_22%)]" />
        <div className="relative z-10">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#8e765b]/18 bg-white/55 px-4 py-2 text-[11px] uppercase tracking-[0.3em] text-[#6f4f38]">
            <Feather className="h-3.5 w-3.5" />
            About The Author
          </p>
          <h1 className="mt-4 text-4xl font-tethys-volcanic text-[#2f1f14] md:text-6xl">
            D.C. Barletta writes prehistoric science-fantasy under pressure.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-[#3f3024] md:text-lg">
            The work is shaped by biology, natural history, and the logic of systems that fail,
            adapt, or mutate over time. <em>World of Tethys</em> grows out of that tension: living
            environments, engineered order, older civilizations like Cambria, and people trying to
            survive where clean stories rarely hold.
          </p>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {buildPillars.map((item) => {
          const Icon = item.Icon;

          return (
            <article
              key={item.title}
              className="rounded-[1.55rem] border border-[#8e765b]/20 bg-[linear-gradient(180deg,rgba(255,250,244,0.96),rgba(242,232,216,0.92))] p-5 shadow-[0_10px_24px_rgba(33,20,10,0.08)]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#8e765b]/18 bg-white/65 text-[#6f4f38]">
                <Icon className="h-4 w-4" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-[#2f2015]">{item.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#4f3c30]">{item.body}</p>
            </article>
          );
        })}
      </section>

      <section className="mt-8 rounded-[1.95rem] border border-[#8e765b]/20 bg-[linear-gradient(180deg,rgba(250,244,235,0.96),rgba(239,229,211,0.92))] p-6 shadow-[0_12px_28px_rgba(33,20,10,0.08)] md:p-8">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#6f4f38]">How Tethys Gets Built</p>
        <h2 className="mt-2 text-2xl font-semibold text-[#2f2015]">The world works because the underlying logic works</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#4f3c30]">
          Tethys is not meant to feel random. Ecologies, routes, climate tension, institutional
          control, and the residue of older civilizations such as Cambria all push on the same
          characters at once. That is where the narrative pressure comes from. The fantasy opens
          up because the underlying system feels stable enough to be worth breaking.
        </p>
      </section>

      <section className="mt-8 rounded-[1.95rem] border border-[#8e765b]/20 bg-[linear-gradient(180deg,rgba(250,244,235,0.96),rgba(239,229,211,0.92))] p-6 shadow-[0_12px_28px_rgba(33,20,10,0.08)] md:p-8">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#6f4f38]">Key Routes</p>
        <h2 className="mt-2 text-2xl font-semibold text-[#2f2015]">Use the route that fits the moment</h2>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/world-of-tethys-book-1"
            className="rounded-full border border-[#6d4c36] bg-[#2f2219] px-5 py-2 text-xs uppercase tracking-[0.14em] text-[#f7eee2] transition hover:-translate-y-0.5 hover:bg-[#20160f]"
          >
            Book One
          </Link>
          <Link
            href="/blog"
            className="rounded-full border border-[#7a8b8d]/30 bg-[#eef4f1] px-5 py-2 text-xs uppercase tracking-[0.14em] text-[#264041] transition hover:-translate-y-0.5 hover:bg-[#e3efea]"
          >
            Essays
          </Link>
          <Link
            href="/press-kit"
            className="rounded-full border border-[#8d5b36] bg-[#f2e2cd] px-5 py-2 text-xs uppercase tracking-[0.14em] text-[#3a2617] transition hover:-translate-y-0.5 hover:bg-[#e8d2b7]"
          >
            Press Kit
          </Link>
          <a
            href={worldSiteUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-[#8b6b53] bg-[#f8f2e8] px-5 py-2 text-xs uppercase tracking-[0.14em] text-[#3b2a1f] transition hover:-translate-y-0.5 hover:bg-[#efe4d3]"
          >
            World Site
          </a>
        </div>
      </section>
    </main>
  );
}
