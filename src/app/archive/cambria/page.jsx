import Link from 'next/link';
import { CAMBRIA_FRAGMENTS } from '@/data/cambria-fragments';

export const metadata = {
  title: 'Cambria Fragments | Deep Archive',
  description:
    'Recovered clay and slate fragments from Cambria: great storms, lost peoples, route knowledge, and first-person discovery records from the World of Tethys.',
};

const fragmentSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Cambria Fragments',
  about: [
    'World of Tethys historical fragments',
    'Cambria archive',
    'Hypercane storm records',
    'Lost peoples of Tethys',
  ],
};

export default function CambriaArchivePage() {
  return (
    <main className="relative min-h-screen bg-[#0c0a09] bg-stone-grain px-6 py-12 text-[#e7e5e4]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(fragmentSchema) }} />

      <div className="mx-auto max-w-6xl">
        <nav className="mb-8">
          <Link
            href="/archive"
            className="text-xs uppercase tracking-[0.24em] text-stone-500 transition hover:text-amber-400"
          >
            Back to Archive
          </Link>
        </nav>

        <header className="rounded-2xl border border-stone-700/80 bg-black/30 p-6 md:p-8">
          <p className="text-[10px] uppercase tracking-[0.3em] text-amber-300/80">Cambria Shelf Vault</p>
          <h1 className="mt-3 text-4xl font-tethys-volcanic text-stone-100 md:text-6xl">Fragments of Tethys History</h1>
          <p className="mt-4 max-w-4xl leading-relaxed text-stone-300">
            Read as discovery, not certainty. These clay and slate recoveries track great storms, lost peoples,
            contested places, and the practical knowledge that held Cambria together when coastlines moved faster than
            law. This is a witness perspective: many were gathered in Cambria once, and the sea decided who remained.
          </p>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          {CAMBRIA_FRAGMENTS.map((fragment) => (
            <article key={fragment.id} className="rounded-2xl border border-stone-700/80 bg-black/35 p-5">
              <p className="text-[10px] uppercase tracking-[0.24em] text-amber-300/75">
                {fragment.sigil} • {fragment.focus} • {fragment.location}
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-stone-100">{fragment.title}</h2>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-stone-500">{fragment.era}</p>
              <p className="mt-3 text-sm leading-relaxed text-stone-300">{fragment.excerpt}</p>

              <details className="mt-4 group rounded-xl border border-stone-700/80 bg-black/25 p-4">
                <summary className="cursor-pointer list-none text-xs uppercase tracking-[0.2em] text-amber-200/90 transition group-open:text-amber-100">
                  Read recovered slate
                </summary>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-stone-300">
                  {fragment.paragraphs.map((paragraph, index) => (
                    <p key={`${fragment.id}-${index}`}>{paragraph}</p>
                  ))}
                </div>
              </details>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-2xl border border-stone-700/80 bg-black/30 p-6">
          <p className="text-[10px] uppercase tracking-[0.24em] text-amber-300/80">Archive Note</p>
          <p className="mt-3 max-w-4xl text-sm leading-relaxed text-stone-300">
            Cambria records were preserved in dual form: clay for flood memory, slate for fire memory. Where
            contradictions appear, witness voice is retained alongside formal ledger language by design.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/world"
              className="rounded-full border border-orange-400/50 bg-orange-500/20 px-4 py-2 text-xs uppercase tracking-[0.16em] text-orange-100 transition hover:border-orange-300 hover:bg-orange-500/30"
            >
              Return to World Hub
            </Link>
            <Link
              href="/natural-history/tethys-ocean"
              className="rounded-full border border-cyan-400/40 bg-cyan-500/15 px-4 py-2 text-xs uppercase tracking-[0.16em] text-cyan-100 transition hover:border-cyan-300 hover:bg-cyan-500/25"
            >
              Tethys Ocean Research
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
