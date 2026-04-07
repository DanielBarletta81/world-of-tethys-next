import Link from 'next/link';
import InteractiveSurvivalPanels from './InteractiveSurvivalPanels';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_WORLD_SITE_URL || 'https://worldoftethys.com';
const PAGE_PATH = '/blog/could-humans-survive-age-of-dinosaurs';
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;

export const metadata = {
  title: 'Could Humans Survive the Age of Dinosaurs?',
  description:
    'An authorial natural-history essay on human survival in dinosaur-era ecosystems through the lens of the World of Tethys.',
  alternates: {
    canonical: PAGE_PATH,
  },
  openGraph: {
    type: 'article',
    url: PAGE_URL,
    title: 'Could Humans Survive the Age of Dinosaurs?',
    description:
      'An authorial natural-history essay on human survival in dinosaur-era ecosystems through the lens of the World of Tethys.',
  },
};

export default function CouldHumansSurvivePage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'Could Humans Survive the Age of Dinosaurs?',
    description:
      'An authorial natural-history essay on human survival in dinosaur-era ecosystems through the lens of the World of Tethys.',
    author: { '@type': 'Person', name: 'D.C. Barletta' },
    publisher: { '@type': 'Person', name: 'D.C. Barletta' },
    mainEntityOfPage: PAGE_URL,
    url: PAGE_URL,
  };

  return (
    <article className="mx-auto max-w-4xl px-6 py-14 md:py-20 text-[#2a1f17]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <section className="rounded-3xl border border-amber-900/30 bg-[linear-gradient(145deg,#fbf6ee,#e9dac5)] p-8 shadow-[0_20px_46px_rgba(35,20,8,0.14)] md:p-10">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[#6f4f38]">Field Note</p>
        <h1 className="mt-3 text-4xl font-tethys-volcanic text-[#2f1f14]">Could Humans Survive the Age of Dinosaurs?</h1>
        <p className="mt-5 leading-relaxed text-[#3f3024]">
          The short answer is yes, but only if we abandon the modern fantasy that intelligence alone guarantees
          dominance. In a true Mesozoic ecology, muscle mass and tooth length set the opening terms of every
          encounter. Human survival would have to come from a different axis of power: information, timing, terrain,
          and collective memory.
        </p>
        <p className="mt-4 leading-relaxed text-[#3f3024]">
          That is why this thought experiment sits at the core of World of Tethys. The question is not whether humans
          can outfight dinosaurs. It is whether culture can evolve fast enough to read the landscape before the
          landscape kills everyone who reads it too slowly.
        </p>
        <p className="mt-4 text-sm uppercase tracking-[0.16em] text-[#6f4f38]">
          Adapted from the original essay:{' '}
          <a
            href="https://www.dcbarletta.com/blog/could-humans-survive-age-of-dinosaurs"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-[#8d5b36] underline-offset-4 hover:text-[#2f2015]"
          >
            dcbarletta.com/blog/could-humans-survive-age-of-dinosaurs
          </a>
        </p>
      </section>

      <section className="mt-6 rounded-2xl border border-amber-900/25 bg-[#f8f2e8]/95 p-6 md:p-8 shadow-[0_10px_24px_rgba(33,20,10,0.08)]">
        <h2 className="text-2xl font-semibold text-[#2f2015]">I. The Crucible at 111 Ma</h2>
        <p className="mt-4 leading-relaxed text-[#3f3024]">
          In the Tethyan record, around 111 million years ago, the sea did not merely rise. It arrived as a system
          shock. Coastal corridors vanished beneath sudden inundation, and entire settlements were erased between one
          season and the next. Early survivors did not discover a miracle technology; they discovered elevation.
          Habitable life concentrated on S-shaped clinoform ridges where water velocity dropped and predator approach
          paths became legible.
        </p>
        <p className="mt-4 leading-relaxed text-[#3f3024]">
          This is the first hard law of Mesozoic human survival: static ground-level civilization is a trap. The
          environment, not the apex predator, is the primary executioner.
        </p>
      </section>

      <section className="mt-6 rounded-2xl border border-amber-900/25 bg-[#f8f2e8]/95 p-6 md:p-8 shadow-[0_10px_24px_rgba(33,20,10,0.08)]">
        <h2 className="text-2xl font-semibold text-[#2f2015]">II. Bottlenecks, Then Divergence</h2>
        <p className="mt-4 leading-relaxed text-[#3f3024]">
          Once the first coastal networks fractured, human populations were stranded into ecological islands. In that
          kind of pressure cooker, adaptation stops being abstract. It becomes immediate and visible across generations.
          Lineages pushed into dense marsh systems trended toward compact, fast, water-capable bodies. Populations in
          isolated, resource-rich archipelagos could swing the opposite direction, selecting for larger frames where
          competition and megafauna pressure rewarded mass.
        </p>
        <p className="mt-4 leading-relaxed text-[#3f3024]">
          In Tethys terms, this is where the story of the Mynz and the giant island lines matters. Biology and culture
          were never separate tracks. Every shift in morphology changed logistics, and every logistical innovation fed
          back into selection.
        </p>
      </section>

      <section className="mt-6 rounded-2xl border border-amber-900/25 bg-[#f8f2e8]/95 p-6 md:p-8 shadow-[0_10px_24px_rgba(33,20,10,0.08)]">
        <h2 className="text-2xl font-semibold text-[#2f2015]">III. Logistics Beats Brute Force</h2>
        <p className="mt-4 leading-relaxed text-[#3f3024]">
          If one idea defines long-term survival in the dinosaur age, it is this: information has to move faster than
          danger. Early-warning relays, neutral communication eyries, standardized travel units, and timing protocols
          did more for survival than any single weapon ever could. You do not defeat a migration corridor. You predict
          it, route around it, and live to trade another day.
        </p>
        <p className="mt-4 leading-relaxed text-[#3f3024]">
          Cambria embodied that logic in its strongest form, and later high-elevation settlements inherited it. Every
          durable human enclave in Tethys is, at heart, a data institution disguised as a city.
        </p>
      </section>

      <section className="mt-6 rounded-2xl border border-amber-900/25 bg-[#f8f2e8]/95 p-6 md:p-8 shadow-[0_10px_24px_rgba(33,20,10,0.08)]">
        <h2 className="text-2xl font-semibold text-[#2f2015]">Conclusion</h2>
        <p className="mt-4 leading-relaxed text-[#3f3024]">
          Could humans survive the age of dinosaurs? Yes, but only as planners, scouts, signalers, and builders of
          systems. Not as conquerors. Survival belongs to the cultures that treat ecology as law and adaptation as a
          daily discipline.
        </p>
      </section>

      <InteractiveSurvivalPanels />

      <section className="mt-6 rounded-2xl border border-amber-900/25 bg-[#f8f2e8]/95 p-6 shadow-[0_10px_24px_rgba(33,20,10,0.08)]">
        <h2 className="text-2xl font-semibold text-[#2f2015]">Elsewhere</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/world-of-tethys-book-1"
            className="rounded-full border border-[#6d4c36] bg-[#2f2219] px-5 py-2 text-xs uppercase tracking-[0.14em] text-[#f7eee2] transition hover:-translate-y-0.5 hover:bg-[#20160f]"
          >
            Book One
          </Link>
          <Link
            href="/blog"
            className="rounded-full border border-[#8b6b53] bg-[#f8f2e8] px-5 py-2 text-xs uppercase tracking-[0.14em] text-[#3b2a1f] transition hover:-translate-y-0.5 hover:bg-[#efe4d3]"
          >
            Archive
          </Link>
          <Link
            href="/press-kit"
            className="rounded-full border border-[#8d5b36] bg-[#f2e2cd] px-5 py-2 text-xs uppercase tracking-[0.14em] text-[#3a2617] transition hover:-translate-y-0.5 hover:bg-[#e8d2b7]"
          >
            Press
          </Link>
        </div>
      </section>
    </article>
  );
}
