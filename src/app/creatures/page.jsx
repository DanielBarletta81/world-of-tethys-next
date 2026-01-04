'use client';

import React from 'react';
import BookBanner from '@/components/BookBanner';
import WayFinderNav from '@/components/WayFinderNav';
import Footer from '@/components/Footer';

const BESTIARY = [
  {
    era: 'Apex Predators',
    subtitle: 'Theropods that ruled the deltas and coastlines',
    entries: [
      {
        name: 'Carcharodontosaurus',
        tag: 'Shark-Toothed Lizard',
        niche: 'City Breakers — high-speed pursuit predators with serrated blades built to shred symbiotic armor.',
        science: 'Larger than T. rex, lighter build, serrated slicing teeth; fossils across North Africa along the Tethys shore.',
        image: '/img/creatures/carcharodontosaurus.png'
      },
      {
        name: 'Suchomimus',
        tag: 'River Sentinel',
        niche: 'Canal guardians and fish-gripping hunters patrolling Cambria’s waterways.',
        science: 'Long snout, conical teeth, massive claws, semi-aquatic; lived in Niger deltas feeding the Tethys.',
        image: '/img/creatures/suchomimus.png'
      }
    ]
  },
  {
    era: 'Titans',
    subtitle: 'Sauropod giants repurposed as living architecture',
    entries: [
      {
        name: 'Sauroposeidon',
        tag: 'Living Crane',
        niche: 'Biological elevators and lookout towers with air-sacked necks for altitude.',
        science: '60+ tons, absurdly long neck with air sacs; kin to Tethys titanosaurs like Paralititan.',
        image: '/img/creatures/sauroposeidon.png'
      },
      {
        name: 'Nigersaurus',
        tag: 'Bio-Harvester',
        niche: 'Vacuum-mouth grazer modified to strip algae or process toxic sludge.',
        science: 'Short neck, hundreds of dental batteries; a “Mesozoic cow” from Tethys-adjacent floodplains.',
        image: '/img/creatures/nigersaurus.png'
      }
    ]
  },
  {
    era: 'Sky',
    subtitle: 'Pterosaur couriers and bombers',
    entries: [
      {
        name: 'Tapejara',
        tag: 'Messenger',
        niche: 'Bioluminescent crest rigs for long-distance signaling and fruit relay.',
        science: 'Huge colorful crests; agile flyers and fruit eaters that dominated Aptian skies.',
        image: '/img/creatures/tapejara.png'
      },
      {
        name: 'Tropeognathus',
        tag: 'Aerial Bomber',
        niche: 'Carries payloads or symbiotic parasites; snaps fish mid-flight with keel-toothed jaws.',
        science: '27 ft wingspan marine hunter; prowled the Tethys sea lanes.',
        image: '/img/creatures/tropeognathus.png'
      }
    ]
  },
  {
    era: 'The Deep',
    subtitle: 'Marine reptiles—true rulers of the Tethys',
    entries: [
      {
        name: 'Kronosaurus',
        tag: 'Abyssal Guard',
        niche: 'Anti-submersible strike beast with a nine-foot skull and brutal bite force.',
        science: 'Short neck, massive skull; fossils in Australia tied to Tethys sea corridors.',
        image: '/img/creatures/kronosaurus.png'
      },
      {
        name: 'Protostegid Titan',
        tag: 'Troop Carrier',
        niche: 'Giant turtle analog with platformed shell for cargo or squads.',
        science: '15 ft shell proto-Archelons surfacing in warm Cretaceous seas.',
        image: '/img/creatures/protostegid.png'
      }
    ]
  },
  {
    era: 'Tethys Survivors',
    subtitle: 'Ancient lineages that endured every cataclysm',
    entries: [
      {
        name: 'Iron-Back (Sturgeon)',
        tag: 'Canal Dredger',
        niche: 'Armored bottom-feeders that clear Sky City intake valves and donate scutes for lightweight shields.',
        science: 'Living fossils armored with bony scutes; electro-sensitive barbels patrol the mud for centuries-old migrations.',
        image: '/img/creatures/ironback_sturgeon.png'
      },
      {
        name: 'Silt-Hunter (Hybodont Shark)',
        tag: 'Scavenger of Dier',
        niche: 'Trash-compactor swarms that strip wrecks and drowned beasts; cephalic spines double as deterrent.',
        science: 'Ancient sharks with dual tooth sets and head spines; opportunists that survived the Permian wipeout.',
        image: '/img/creatures/silt_hunter.png'
      },
      {
        name: 'Void-Shell (Sea Turtle)',
        tag: 'Living Raft',
        niche: 'Platformed shells carved with current maps; immune to the psionic static of trench depths.',
        science: 'Protostegid analogs with fenestrated shells to save weight; early sea turtles like Santanachelys.',
        image: '/img/creatures/void_shell.png'
      },
      {
        name: 'Mud-Wing (Skate & Ray)',
        tag: 'Minefield',
        niche: 'Thousands bury in the mudflats; a step triggers bio-electric shock to power devices or stun intruders.',
        science: 'Sediment-hiding rays with acute electroreception; flattened bodies optimized for ambush.',
        image: '/img/creatures/mud_wing.png'
      }
    ]
  }
];

function CreatureCard({ entry }) {
  return (
    <div className="border border-[#2c241f] bg-[#100d0b] rounded-xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.45)]">
      <div className="relative h-48 w-full bg-gradient-to-br from-[#1f130e] to-[#0c0a09] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {entry.image ? (
          <img src={entry.image} alt={entry.name} className="w-full h-full object-cover opacity-80" />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
        <div className="absolute bottom-3 left-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-amber-400 font-mono">{entry.tag}</p>
          <h3 className="text-2xl font-display text-stone-100 drop-shadow-lg">{entry.name}</h3>
        </div>
      </div>
      <div className="p-4 space-y-2">
        <p className="text-sm text-stone-200 leading-relaxed">{entry.niche}</p>
        <p className="text-[12px] text-stone-500 font-mono leading-relaxed">{entry.science}</p>
      </div>
    </div>
  );
}

export default function CreaturesPage() {
  return (
    <main className="min-h-screen bg-[#0c0a09] text-[#e7e5e4] font-serif selection:bg-amber-900 selection:text-white relative overflow-x-hidden">
      <WayFinderNav />
      <div className="pt-20">
        <BookBanner />
        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center mb-10">
            <p className="text-[10px] uppercase tracking-[0.3em] text-amber-500 font-mono">The Tethys Bestiary</p>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-orange-500 to-red-800">Fossil Analogs, 111 MYA</h1>
            <p className="text-sm text-stone-400 mt-3 max-w-3xl mx-auto">Early Cretaceous (Aptian/Albian). Shores and depths of the Tethys. Use these profiles for creatures, hybrids, and faction fauna.</p>
          </div>

          <div className="space-y-12">
            {BESTIARY.map((section) => (
              <div key={section.era}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-stone-500 font-mono">{section.subtitle}</p>
                    <h2 className="text-2xl md:text-3xl font-serif text-stone-100">{section.era}</h2>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {section.entries.map((entry) => (
                    <CreatureCard key={entry.name} entry={entry} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
