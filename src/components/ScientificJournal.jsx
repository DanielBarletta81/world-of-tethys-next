'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Sprout, Anchor, Dna, FlaskConical, FileText, MapPin, Quote } from 'lucide-react';

const JOURNAL_ENTRIES = [
    {
        id: 'oysters',
        title: 'Benthic Recruitment & Substrates',
        icon: <Anchor size={18} />,
        color: 'text-cyan-400',
        border: 'border-cyan-500/30',
        realScience: {
            headline: "Substrate Selection in Urbanized Estuaries",
            source: "Barletta, D.C. & Govenar, B. (BioNES 2014)",
            summary: "Larval oysters (spat) require specific hard substrates and chemical cues to settle. In the Providence River, recruitment is limited by hypoxia and lack of structure. Artificial reefs (like the Cannes submerged statues) provide both structure and filtration services.",
            citation: "Barletta, D.C. (2015). Eastern Oyster Recruitment and Genetic Population Connectivity in Narragansett Bay.",
            doi: "10.13140/RG.2.1.3847.6329",
            year: 2015,
            journal: "University of Rhode Island Marine Biology Thesis"
        },
        tethysLore: {
            character: "The Lower Tiers",
            artifact: "The Weeping Sentinels",
            narrative: "Sky City's 'Statues of the Lost' are not just art—they are biological engines. Giant oysters cluster on the submerged stone faces, filtering the Danian runoff. Melden designed them to recruit spat from the estuary, turning a memorial into a food source for the poor."
        }
    },
    {
        id: 'genetics',
        title: 'Heterozygote Advantage & Selection',
        icon: <Dna size={18} />,
        color: 'text-rose-400',
        border: 'border-rose-500/30',
        realScience: {
            headline: "Balancing Selection in Populations",
            source: "Genetic Final / Sickle-Cell Data",
            summary: "Deleterious alleles (like Sickle Cell or CF) persist because they confer survival advantages (Malaria/Cholera resistance) to carriers. Evolution balances the risk of disease against the immediate threat of infection.",
            citation: "GeneticFinal1.pdf: 'The force of balancing selection is evident in populations with high heterozygote carriers.'",
            year: 2024,
            journal: "Course Materials - Population Genetics"
        },
        tethysLore: {
            character: "Cohab Codes",
            artifact: "The Ledger",
            narrative: "The Triumvirate's 'Cohab Codes' are a crude attempt to engineer this advantage. They forbid dating to force genetic diversity, trying to breed resistance to the jungle's toxins. They call it 'Purity.' Melden called it 'Playing God with a dull knife.'"
        }
    },
    {
        id: 'mycology',
        title: 'Psilocybin & Neural Plasticity',
        icon: <Sprout size={18} />,
        color: 'text-purple-400',
        border: 'border-purple-500/30',
        realScience: {
            headline: "Disrupting Rigid Thought Patterns",
            source: "Nature Medicine / Neuro-Psychiatry",
            summary: "Psilocybin promotes neuroplasticity, allowing the brain to bypass rigid pathways associated with depression and migraines. It acts as a 'reset' for the Default Mode Network, treating the root cause of ruminative grief.",
            citation: "Carhart-Harris, R.L., et al. (2016). Psilocybin for treatment-resistant depression.",
            doi: "10.1016/S2215-0366(16)30065-7",
            year: 2016,
            journal: "The Lancet Psychiatry"
        },
        tethysLore: {
            character: "Ravel",
            artifact: "Clarity Tincture",
            narrative: "Ravel treats Igzier's grief not with comfort, but with chemistry. His fungal pastes force neuro-genesis, physically preventing Igzier's brain from rutting into a depression loop. In the jungle, a mopey loverboy is just slow meat."
        }
    },
    {
        id: 'forest',
        title: 'Anadromous Nutrient Transport',
        icon: <FlaskConical size={18} />,
        color: 'text-emerald-400',
        border: 'border-emerald-500/30',
        realScience: {
            headline: "Marine-Derived Nitrogen in Forests",
            source: "Reimchen et al. / RIDEM Publications",
            summary: "Isotopes of Nitrogen-15 found in ancient tree rings prove that forests rely on nutrients carried upstream by fish (salmon, shad). Predators deposit carcasses inland, effectively fertilizing the forest with the ocean's energy.",
            citation: "Fernandes, S., Edwards, P., & Barletta, D.C. (RIDEM). Largemouth Bass Mortality in Rhode Island Ponds.",
            year: 2013,
            journal: "Rhode Island Department of Environmental Management"
        },
        tethysLore: {
            character: "Ironwoods",
            artifact: "The Green-Gold Cycle",
            narrative: "The Ironwoods are fed by the Danian River. The 'Boil' at the straits isn't just violence; it's a fertilizer pump. The giant trees exist only because the river delivers the ocean's blood to their roots via the fish runs."
        }
    }
];

export default function ScientificJournal() {
  const [activeEntry, setActiveEntry] = useState(JOURNAL_ENTRIES[0]);

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 p-4 font-sans text-stone-200">
      
      {/* LEFT: TABLE OF CONTENTS */}
      <div className="lg:col-span-4 space-y-4">
        <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-stone-500 mb-4 ml-2">
          Field Notes: D.C. Barletta
        </h3>
        {JOURNAL_ENTRIES.map((entry) => (
          <button
            key={entry.id}
            onClick={() => setActiveEntry(entry)}
            className={`w-full text-left p-4 rounded-lg border transition-all duration-300 flex items-center gap-4 group ${
              activeEntry.id === entry.id 
                ? `bg-black ${entry.border} shadow-[0_0_20px_rgba(0,0,0,0.5)]` 
                : 'bg-[#0c0a09] border-stone-800 hover:border-stone-600'
            }`}
          >
            <div className={`p-2 rounded-full bg-[#1c1917] ${entry.color} group-hover:scale-110 transition-transform`}>
              {entry.icon}
            </div>
            <div>
              <div className={`text-sm font-bold uppercase tracking-wide ${activeEntry.id === entry.id ? 'text-white' : 'text-stone-400 group-hover:text-stone-200'}`}>
                {entry.title}
              </div>
              <div className="text-[10px] text-stone-600 font-mono mt-1 truncate">
                Ref: {entry.realScience.source}
              </div>
            </div>
          </button>
        ))}

        {/* AUTHOR CITATIONS CARD */}
        <div className="mt-8 p-6 bg-[#161311] border border-stone-800 rounded-lg">
          <div className="flex items-center gap-2 mb-4 text-stone-400">
            <FileText size={16} />
            <span className="text-xs uppercase tracking-widest font-bold">Author Publications</span>
          </div>
          <ul className="space-y-3 text-[10px] text-stone-500 font-mono leading-relaxed">
            <li className="pl-3 border-l-2 border-stone-700">
              <strong className="text-stone-300">Barletta, D.C. & Govenar, B.</strong><br/>
              Environmental Monitoring for Site Selection of Oyster Recruitment. <em>BioNES 2014.</em>
            </li>
            <li className="pl-3 border-l-2 border-stone-700">
              <strong className="text-stone-300">Fernandes, S., Edwards, P., & Barletta, D.C.</strong><br/>
              Largemouth Bass Mortality in Rhode Island Ponds. <em>R.I.D.E.M.</em>
            </li>
          </ul>
        </div>
      </div>

      {/* RIGHT: THE SPLIT BRAIN DISPLAY */}
      <div className="lg:col-span-8 bg-[#080a0c] border border-stone-800 rounded-xl overflow-hidden relative min-h-[600px] flex flex-col shadow-2xl">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10 pointer-events-none" />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeEntry.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col h-full"
          >
            {/* Header */}
            <div className="p-8 border-b border-stone-800 bg-gradient-to-r from-[#0c0a09] to-transparent">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${activeEntry.border} bg-black/50 mb-4`}>
                <span className={`text-xs font-bold ${activeEntry.color}`}>{activeEntry.id.toUpperCase()}</span>
                <span className="text-[10px] text-stone-500">|</span>
                <span className="text-[10px] text-stone-400">CLASSIFIED</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif text-stone-100">{activeEntry.title}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 flex-1 divide-y md:divide-y-0 md:divide-x divide-stone-800">
              
              {/* COL 1: THE FACT (Real Science) */}
              <div className="p-8 space-y-6">
                <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-600 flex items-center gap-2">
                  <MapPin size={14} /> Real World Data
                </h4>
                <div>
                  <h5 className="text-lg font-bold text-stone-200 mb-2">{activeEntry.realScience.headline}</h5>
                  <p className="text-sm text-stone-400 leading-relaxed text-justify">
                    {activeEntry.realScience.summary}
                  </p>
                </div>
                <div className="pt-4 border-t border-stone-800/50">
                  <p className="text-[10px] text-stone-500 italic">
                    "{activeEntry.realScience.citation}"
                  </p>
                </div>
              </div>

              {/* COL 2: THE FICTION (Tethys Lore) */}
              <div className="p-8 space-y-6 bg-[#0c0a09]/50 relative overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] rounded-full opacity-20 ${activeEntry.id === 'mycology' ? 'bg-purple-600' : 'bg-amber-600'}`} />
                
                <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-amber-600 flex items-center gap-2 relative z-10">
                  <BookOpen size={14} /> Narrative Translation
                </h4>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-stone-800 rounded-full flex items-center justify-center border border-stone-700">
                      <span className="text-lg">⚡</span>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-stone-200">{activeEntry.tethysLore.character}</div>
                      <div className="text-[10px] text-stone-500 uppercase">{activeEntry.tethysLore.artifact}</div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-amber-100/80 leading-relaxed font-serif italic border-l-2 border-amber-900/30 pl-4">
                    "{activeEntry.tethysLore.narrative}"
                  </p>
                </div>

                <div className="absolute bottom-6 right-6 opacity-30">
                  {activeEntry.icon}
                </div>
              </div>

            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* EVOLUTIONARY DIRECTIVE FOOTER */}
      <div className="lg:col-span-12 mt-8 p-8 border border-stone-800 rounded-xl bg-stone-950/50 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-stone-700 to-transparent"></div>
        <Quote size={24} className="mx-auto text-stone-700 mb-4" />
        <p className="text-lg font-serif text-stone-300 italic max-w-3xl mx-auto leading-relaxed">
          "Nothing gets 'better.' It simply gets to the next generation. Fitness is not strength or speed—it is the strategy of the survivor. In Tethys, the slow and dumb are fuel. Only the calculated remain."
        </p>
        <p className="text-[10px] font-mono text-stone-600 uppercase tracking-[0.2em] mt-4">
          — Evolutionary Directive: The Cutting Edge of Adversity
        </p>
      </div>

    </div>
  );
}
// World of Tethys || D.C. Barletta
