import Link from 'next/link';
import { Compass, Feather, Microscope, Waves } from 'lucide-react';
import { PAST_RESEARCH } from '@/data/past-research';

export const metadata = {
  title: 'About D.C. Barletta',
  description:
    'D.C. Barletta and the older world behind World of Tethys.',
};

const buildPillars = [
  {
    title: 'Biology',
    body: 'Teeth. migration. hunger.',
    Icon: Microscope,
  },
  {
    title: 'Pressure',
    body: 'Cities fail like organisms.',
    Icon: Waves,
  },
  {
    title: 'Wonder',
    body: 'Myth with a fossil spine.',
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
            The Name
          </p>
          <h1 className="mt-4 text-4xl font-tethys-volcanic text-[#2f1f14] md:text-6xl">
            D.C. Barletta
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-[#3f3024] md:text-lg">
            Biology. Deep time. Pressure.
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
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#6f4f38]">Understructure</p>
        <h2 className="mt-2 text-2xl font-semibold text-[#2f2015]">Teeth, weather, stone.</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#4f3c30]">
          The world holds because its pressures hold.
        </p>
      </section>

      <section className="mt-8 rounded-[1.95rem] border border-[#8e765b]/20 bg-[linear-gradient(180deg,rgba(245,239,230,0.96),rgba(232,223,205,0.92))] p-6 shadow-[0_12px_28px_rgba(33,20,10,0.08)] md:p-8">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#6f4f38]">Past Research</p>
        <h2 className="mt-2 text-2xl font-semibold text-[#2f2015]">Earlier strata.</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#4f3c30]">
          Marine algae. Cell walls. Work before Tethys.
        </p>

        <div className="mt-6 grid gap-4">
          {PAST_RESEARCH.map((entry) => (
            <article
              key={entry.title}
              className="rounded-[1.45rem] border border-[#8e765b]/18 bg-white/60 p-5 shadow-[0_10px_22px_rgba(33,20,10,0.08)]"
            >
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#7c6250]">{entry.label}</p>
              <h3 className="mt-3 text-xl font-semibold text-[#2f2015]">{entry.title}</h3>
              <p className="mt-1 text-sm uppercase tracking-[0.14em] text-[#6f4f38]">{entry.focus}</p>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#4f3c30]">{entry.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {entry.marks.map((mark) => (
                  <span
                    key={mark}
                    className="rounded-full border border-[#8e765b]/18 bg-[#f8f2e8] px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-[#5a4638]"
                  >
                    {mark}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-[1.95rem] border border-[#8e765b]/20 bg-[linear-gradient(180deg,rgba(250,244,235,0.96),rgba(239,229,211,0.92))] p-6 shadow-[0_12px_28px_rgba(33,20,10,0.08)] md:p-8">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#6f4f38]">Foundation</p>
        <h2 className="mt-2 text-2xl font-semibold text-[#2f2015]">Rhode Island College</h2>
        <p className="mt-3 text-sm leading-relaxed text-[#4f3c30]">
          Biology, early 2000s. Where the older systems first became legible.
        </p>
        <a
          href="https://www.ric.edu"
          target="_blank"
          rel="noreferrer noopener"
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#6d8f7a]/40 bg-[#eef4f0] px-5 py-2 text-xs uppercase tracking-[0.14em] text-[#264041] transition hover:-translate-y-0.5 hover:bg-[#e3efea]"
        >
          Rhode Island College
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </section>

      <section className="mt-8 rounded-[1.95rem] border border-[#8e765b]/20 bg-[linear-gradient(180deg,rgba(250,244,235,0.96),rgba(239,229,211,0.92))] p-6 shadow-[0_12px_28px_rgba(33,20,10,0.08)] md:p-8">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#6f4f38]">Openings</p>
        <h2 className="mt-2 text-2xl font-semibold text-[#2f2015]">Only a few names.</h2>
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
            Press
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
