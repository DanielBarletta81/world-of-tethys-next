 'use client';

import BioChimeraLab from '@/components/BioChimeraLab';
import SluiceGatePuzzle from '@/components/SluiceGatePuzzle';
import PunnettScrambler from '@/components/PunnettScrambler';
import TheBlankSlate from '@/components/TheBlankSlate';


const anchors = [
  {
    concept: 'Rosa-Lyn — The Engineer',
    real: 'Rosalind Franklin',
    foundation: 'X-ray diffraction proves bone-ash lattices in Sky City.'
  },
  {
    concept: 'Melden — The Geneticist',
    real: 'Gregor Mendel',
    foundation: 'Punnett raceways simulate RR/Rr/rr oil-yield phenotypes.'
  },
  {
    concept: 'Kith Weaver — Mycelial Order',
    real: 'Elias Magnus Fries',
    foundation: 'Mycorrhizal networks explain the Aethel-silk data uplink.'
  },
  {
    concept: 'Mitosis Overdrive',
    real: 'Cell Division Stress Response',
    foundation: 'Silurian lungs trigger rapid chromosomal repair under heat.'
  }
];

export default function ScienceAnnex() {
  const geminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

  return (

    <section className="section-shell">
    <TheBlankSlate className="artifact-card" />
      <header className="mb-12">
        <p className="eyebrow">Scientific Annex</p>
        <h1 className="text-4xl font-display">The Genetics of Tethys</h1>
        <p className="lede">
          A reference guide for students of Cambrian biology linking each field discovery to the real-world
          research that inspired it.
        </p>
      </header>

      <div className="artifact-card bg-black/20 mb-12">
        <h2 className="text-2xl font-display mb-4">Cambria Synthesis Engine</h2>
        <p className="text-sm text-ancient-ink/70 mb-6 max-w-2xl">
          Design your own Bio-Chimera using real paleontology, Punnett math, and the Gemini-powered logic that
          feeds the Dinosaur Factory. Every hybrid references a real species or researcher cited in Book I.
        </p>
        <BioChimeraLab apiKey={geminiKey} />
      </div>

      <section className="extinction-container py-20">
        <blockquote className="extinction-quote mb-12 max-w-3xl mx-auto text-center text --forge-intense">
          &quot;99.9% of all life that has ever graced this Earth has vanished into the silt. The records we hold are
          fragments of a ghost story. My renditions are not just fiction—they are the probable echoes of a world fossils
          were never meant to tell.&quot;
        </blockquote>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {anchors.map((anchor) => (
          <article key={anchor.concept} className="artifact-card">
            <h3 className="font-display text-xl text-ancient-accent">{anchor.concept}</h3>
            <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-ancient-ink/70">
              Real-world anchor: {anchor.real}
            </p>
            <p className="text-sm text-ancient-ink/80 mt-4">{anchor.foundation}</p>
          </article>
        ))}
      </div>

      <div className="border-t border-ancient-ink/20 pt-12">
        <h2 className="text-2xl font-display mb-6">Field Simulations</h2>
        <p className="text-sm text-ancient-ink/70 mb-6 max-w-3xl">
          These classroom instruments tie the lore to measurable biology. The Punnett Raceway predicts Omega Oil
          outputs, while the sluice puzzle trains reflexes for Mitosis Overdrive drills.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="artifact-card">
            <h3 className="font-display text-xl mb-4">Punnett Raceway Simulator</h3>
            <PunnettScrambler />
          </div>
          <div className="artifact-card">
            <h3 className="font-display text-xl mb-4">Sluice Gate Reflex Drill</h3>
            <SluiceGatePuzzle />
          </div>
        </div>
      </div>

      <div className="border-t border-ancient-ink/20 pt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TheBlankSlate />
     
      </div>
    </section>
  );
}
