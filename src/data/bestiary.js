// Relative import for Node/SSR contexts (avoids path alias issues during scripts)
import cdn from '../lib/cdn.js';

export const BESTIARY = [
  {
    era: 'Apex Predators',
    subtitle: 'Theropods that ruled the deltas and coastlines',
    entries: [
      {
        name: 'Carcharodontosaurus',
        tag: 'Shark-Toothed Lizard',
        niche: 'City Breakers — high-speed pursuit predators with serrated blades built to shred symbiotic armor.',
        science: 'Larger than T. rex, lighter build, serrated slicing teeth; fossils across North Africa along the Tethys shore.',
        realWorldAnalog: 'Carcharodontosaurus (Carcharodontosauridae)',
        bio: 'If it enters the estuary, everything goes silent.',
        image: cdn('/img/creatures/carcharodontosaurus.png')
      },
      {
        name: 'Suchomimus',
        tag: 'River Sentinel',
        niche: 'Canal guardians and fish-gripping hunters patrolling Cambria’s waterways.',
        science: 'Long snout, conical teeth, massive claws, semi-aquatic; lived in Niger deltas feeding the Tethys.',
        realWorldAnalog: 'Suchomimus (Spinosauridae)',
        bio: 'River teeth that never leave the shallows.',
        image: cdn('/img/creatures/suchomimus.png')
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
        realWorldAnalog: 'Sauroposeidon (Titanosauriformes)',
        bio: 'The skyline moves and the birds avoid it.',
        image: cdn('/img/creatures/sauroposeidon.png')
      },
      {
        name: 'Nigersaurus',
        tag: 'Bio-Harvester',
        niche: 'Vacuum-mouth grazer modified to strip algae or process toxic sludge.',
        science: 'Short neck, hundreds of dental batteries; a “Mesozoic cow” from Tethys-adjacent floodplains.',
        realWorldAnalog: 'Nigersaurus (Rebbachisauridae)',
        bio: 'A mouth made to erase fields.',
        image: cdn('/img/creatures/nigersaurus.png')
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
        realWorldAnalog: 'Tapejara (Tapejaridae)',
        bio: 'Carries news and venom in the same breath.',
        image: cdn('/img/creatures/tapejara.png')
      },
      {
        name: 'Tropeognathus',
        tag: 'Aerial Bomber',
        niche: 'Carries payloads or symbiotic parasites; snaps fish mid-flight with keel-toothed jaws.',
        science: '27 ft wingspan marine hunter; prowled the Tethys sea lanes.',
        realWorldAnalog: 'Tropeognathus (Ornithocheiridae)',
        bio: 'Shadow blade with a fish-hook jaw.',
        image: cdn('/img/creatures/tropeognathus.png')
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
        realWorldAnalog: 'Kronosaurus (Pliosauridae)',
        bio: 'Deep water that learned to bite.',
        image: cdn('/img/creatures/kronosaurus.png')
      },
      {
        name: 'Protostegid Titan',
        tag: 'Troop Carrier',
        niche: 'Giant turtle analog with platformed shell for cargo or squads.',
        science: '15 ft shell proto-Archelons surfacing in warm Cretaceous seas.',
        realWorldAnalog: 'Protostegidae (early sea turtles)',
        bio: 'A city raft that never beaches.',
        image: cdn('/img/creatures/protostegid.png')
      }
    ]
  },
  {
    era: 'Sulfidic Guilds',
    subtitle: 'Food‑web engineers of the shallow sulfur basins',
    entries: [
      {
        id: 'kuphus_tube_king',
        name: 'Kuphus (Tube-King)',
        tag: 'Chemosymbiotic Bivalve',
        niche: 'Tubeworm-like reef builder anchoring the sulfur web; shelters microbial mats and smaller grazers.',
        science: 'Giant shipworm-bivalve adapted to sulfidic muds; hosts sulfur-oxidizing symbionts.',
        realWorldAnalog: 'Kuphus polythalamia',
        bio: 'Stone tube, sulfur breath, patient hunger.',
        image: cdn('/img/creatures/kuphus_tube.png')
      },
      {
        id: 'necrocarcinid_crab',
        name: 'Necrocarcinid Crabs',
        tag: 'Mud Hyenas',
        niche: 'Scavenge Frenelopsis litter and cracked tube mouths; patrol the mangrove flats.',
        science: 'Mangrove-dwelling crabs associated with Cretaceous coastal ecosystems.',
        realWorldAnalog: 'Necrocarcinidae',
        bio: 'Mud hyenas waiting for resin cracks.',
        image: cdn('/img/creatures/necrocarcinid_crab.png')
      },
      {
        id: 'ptychodus_shell_crusher',
        name: 'Ptychodus',
        tag: 'Shell-Crusher',
        niche: 'Durophagous hunter that breaks armored clams and exposed tube ends.',
        science: 'Cretaceous shark with crushing teeth, convergent with shell‑crushing reptiles.',
        realWorldAnalog: 'Ptychodus',
        bio: 'Crunch heard before the wave.',
        image: cdn('/img/creatures/ptychodus.png')
      },
      {
        id: 'spinosaurid_tide_hunter',
        name: 'Spinosaurid Tide Hunter',
        tag: 'Edge Apex',
        niche: 'Shoreline hunter at tide turns; pries soft bodies from tube reefs in slack water.',
        science: 'Semi‑aquatic spinosaurids hunted fish along the Tethys margins.',
        realWorldAnalog: 'Spinosauridae',
        bio: 'Edge of tide, edge of fight.',
        image: cdn('/img/creatures/spinosaurid_tide_hunter.png')
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
        realWorldAnalog: 'Acipenseridae (sturgeons)',
        bio: 'Armor that remembers old rivers.',
        image: cdn('/img/creatures/ironback_sturgeon.png')
      },
      {
        name: 'Silt-Hunter (Hybodont Shark)',
        tag: 'Scavenger of Dier',
        niche: 'Trash-compactor swarms that strip wrecks and drowned beasts; cephalic spines double as deterrent.',
        science: 'Ancient sharks with dual tooth sets and head spines; opportunists that survived the Permian wipeout.',
        realWorldAnalog: 'Hybodontiformes (hybodont sharks)',
        bio: 'Scavenger with ancient teeth.',
        image: cdn('/img/creatures/silt_hunter.png')
      },
      {
        name: 'Void-Shell (Sea Turtle)',
        tag: 'Living Raft',
        niche: 'Platformed shells carved with current maps; immune to the psionic static of trench depths.',
        science: 'Protostegid analogs with fenestrated shells to save weight; early sea turtles like Santanachelys.',
        realWorldAnalog: 'Protostegidae / Santanachelys',
        bio: 'Carries maps carved in salt.',
        image: cdn('/img/creatures/void_shell.png')
      },
      {
        name: 'Mud-Wing (Skate & Ray)',
        tag: 'Minefield',
        niche: 'Thousands bury in the mudflats; a step triggers bio-electric shock to power devices or stun intruders.',
        science: 'Sediment-hiding rays with acute electroreception; flattened bodies optimized for ambush.',
        realWorldAnalog: 'Batoidea (skates & rays)',
        bio: 'Lies under the silt like a trap.',
        image: cdn('/img/creatures/mud_wing.png')
      }
    ]
  }
];
// World of Tethys || D.C. Barletta
