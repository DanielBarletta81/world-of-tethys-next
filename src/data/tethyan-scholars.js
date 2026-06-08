/**
 * TETHYAN SCHOLARS — historical figures, pterosaur lineages, maritime technology,
 * and human speciation data.
 *
 * Primary source: "The Tethyan Crucible: Pterosaur Evolution, Marine Ecology,
 * and the Origins of Anthropogenic Seafaring in the Aptian-Albian Transition"
 * (Scholar Hyster / Eyrie Charter cross-reference)
 *
 * This data enriches:
 *  - Eyrie Charter (Horster role, clickline navigation)
 *  - Silurian lineage (biological speciation — PDE10A, BDKRB2)
 *  - Sky City / Stryker faction (aerial defense, Silurian harmonics)
 *  - Pteros / maritime regions (ship tech, navigation systems)
 *  - Bestiary (pterosaur species)
 */

// ── THE SCHOLAR HYSTER ────────────────────────────────────────────────────────
// Hyster is the primary source for pterosaur behavioral science and city aerial
// defense doctrine. His records are the closest thing to a unified technical
// manual for Tethyan survival. His portal access to the Nine gave him knowledge
// that should have taken generations — it arrived in a single career.

export const SCHOLAR_HYSTER = {
  id: 'hyster',
  name: 'Hyster',
  faction: 'Cambrian Archive — neutral scholar, city guest',
  role: 'Pterosaur behaviorist, aerial defense architect, ship design consultant',
  contributions: [
    'Identified the pterosaur flocculus as the target for Silurian harmonic disorientation arrays',
    'Described the Stryker hybrid pterosaur line and its tactical role in city defense',
    'Documented the Pliosaur-mimic ship hull design and its visual deterrence mechanism',
    'Codified Pteroswift relay protocols that became the foundation of the Eyrie Charter',
    'Observed human Bajau-analog diving physiology and linked it to Silurian lineage genetics',
  ],
  portal: {
    description: 'Non-local data conduit — knowledge transmitted from the Nine. Hyster could not control when or what came through.',
    knowledgeTypes: ['pterosaur neuroanatomy', 'city-scale aerial defense', 'Silurian harmonics', 'ship biomimicry'],
    ninePrinciples: 'energy, knowledge, technology, wisdom — collective intelligence providing operational "software patches"',
  },
  archiveNote: 'Hyster\'s records are stored in the Cambrian Codex. The Age of Ragnarus destroyed his library but not the practical knowledge his students had already implemented.',
};

// ── PTEROSAUR LINEAGES ────────────────────────────────────────────────────────
// From Hyster's neuroanatomical research. These are the known Tethyan pterosaur
// types with game-relevant behavioral data.

export const PTEROSAUR_LINEAGES = [
  {
    id: 'stryker-hybrid',
    label: 'Stryker Line',
    class: 'Volcanic Jungle Hybrid',
    scientificBasis: 'Short-necked azhdarchid analog — convergent with Vectidraco / Tethyan island forms',
    description: 'The Stryker is the most tactically significant pterosaur in the Tethyan world. Canopy glider capable of high-altitude soaring, but distinguished by exceptional terrestrial proficiency. Uses the "quad-launch" — a vaulting mechanism using forelimb power to reach flight speed in under a second.',
    brainAdaptations: {
      flocculus: 'Hyper-enlarged — integrates wing-surface sensory data; precision ocular stabilization during storm maneuvers',
      opticLobes: 'Lateralized — high-fidelity visual tracking through volcanic smoke',
      hemispheres: 'Globular, modest size but high connectivity — sophisticated social bonding and tactical coordination',
      cerebellum: 'Expanded — facilitates quad-launch motor coordination',
    },
    physiology: {
      metabolism: 'Endothermic — warm-blooded; flow-through air sac respiratory system',
      bones: 'Paper-thin, hollowed by air sacs',
      neck: 'Short, stocky vertebrae — torsion/compression resistant for high-impact landings on basaltic flows',
      limbs: 'Parasagittal gait — competent terrestrial quadruped',
    },
    flight: {
      style: 'High-altitude soaring + sudden dive; quad-launch from ground',
      range: '8,000–12,000 mile nonstop migration capable',
      landingZone: 'Jagged volcanic cliffs and basaltic flows',
    },
    tacticalRole: 'City guardian — launch platform birds for patrol and aerial defense against rogue swarms',
    connectionToFaction: 'The Stryker human faction takes its name from its bond with this line. Stryker scouts use the birds for aerial reconnaissance and perimeter patrol above Sky City.',
    regionPresence: ['sky-city', 'watcher-volcano', 'mt-cinder', 'arnn-ridge'],
  },
  {
    id: 'pteroswift',
    label: 'Pteroswift',
    class: 'Eyrie Relay Courier',
    scientificBasis: 'Mid-size ornithocheirid — long-distance endurance specialists',
    description: 'The courier backbone of the Eyrie Charter relay network. Not combat animals — they carry reed-bone message tubes and are trained for homing across island-arc distances. Flight is timed using clicklines.',
    tacticalRole: 'Neutral courier relay — no faction owns Pteroswifts; they belong to the Eyrie Charter',
    regionPresence: ['pteros', 'sky-city', 'mystic-woods', 'arnn-ridge', 'northern-mountains'],
    eyrieNote: 'Pteroswifts are rested, fed, and re-equipped at each Eyrie waystation. The Horster manages imprinting and welfare.',
  },
  {
    id: 'anurognathid',
    label: 'Forest Whisper (Anurognathidae)',
    class: 'Canopy Early-Warning Scout',
    scientificBasis: 'Anurognathidae / Nemicolopterus',
    description: 'Diminutive hidden forest dwellers. Fed on insects in the canopy. Hyster kept these around settlements as early-warning systems — their alarm behavior precedes pterosaur swarm approaches by 4–8 minutes.',
    tacticalRole: 'Passive early-warning — no harness required; responds to infrasound and electromagnetic disturbance',
    regionPresence: ['mystic-woods', 'ironwoods', 'sky-city'],
    mechanicNote: 'Mystic players with Kith resonance can read Forest Whisper alarm patterns — extends early-warning range.',
  },
  {
    id: 'monkeydactyl',
    label: 'Monkeydactyl (Kunpengopterus)',
    class: 'Arboreal Object Handler',
    scientificBasis: 'Kunpengopterus antipollicatus — true opposable thumbs',
    description: 'Unprecedented for pterosaurs — opposable thumbs allow climbing and object handling. Hyster called these a "new line." Their cognitive flexibility made them candidates for carrying non-tube payloads and interacting with human-built structures.',
    tacticalRole: 'Experimental — Hyster\'s "new lines" research subject; potential tool-user bond',
    regionPresence: ['mystic-woods', 'ironwoods'],
    hysterNote: 'These represent the "new lines" Hyster believed the Nine seeded — experimental hominid-adjacent intelligence nodes.',
  },
];

// ── HUMAN BIOLOGICAL SPECIATION ───────────────────────────────────────────────
// The Tethyan humans were biologically distinct from modern Homo sapiens.
// These traits directly ground the Silurian lineage's core biological adaptations
// in real evolutionary science (Bajau Sea Nomads analog).

export const TETHYAN_HUMAN_SPECIATION = {
  atmosphericContext: {
    CO2_ppm: 'up to 4,000 ppm (vs. 420 ppm modern)',
    O2_percent: 'up to 30% (vs. 21% modern)',
    note: 'High O2 + high CO2 required biochemical compensation. Long-term exposure lethal for modern Homo sapiens.',
  },
  physiologicalMarkers: [
    {
      marker: 'Spleen Volume',
      tethyanValue: '+50–60% above baseline',
      selectiveDriver: 'Deep subsistence diving — spleen stores oxygenated red blood cells as biological scuba tank',
      geneAssociation: 'PDE10A — increased thyroid hormone, enlarged spleen',
      lineageMapping: 'Silurian — sil-breath-hold trait direct basis',
    },
    {
      marker: 'Diving Reflex',
      tethyanValue: 'Enhanced peripheral vasoconstriction',
      selectiveDriver: 'Preserving oxygen for vital organs during dives >70m',
      geneAssociation: 'BDKRB2 — bradykinin receptor enhancement',
      lineageMapping: 'Silurian — sil-breath-hold tier 2',
    },
    {
      marker: 'Serum Bicarbonate',
      tethyanValue: 'Elevated',
      selectiveDriver: 'Compensation for high atmospheric CO₂',
      geneAssociation: 'Carbonic anhydrase variants',
      lineageMapping: 'Silurian — passive environmental tolerance',
    },
    {
      marker: 'Hemoglobin Affinity',
      tethyanValue: 'High — enhanced O₂ binding',
      selectiveDriver: 'High-altitude refugia and 30% O₂ atmosphere — required buffering',
      geneAssociation: 'HBB/HBA variants',
      lineageMapping: 'Triumvirate — high-altitude Sky City tiers',
    },
    {
      marker: 'Melanosome Density',
      tethyanValue: 'High',
      selectiveDriver: 'Intense tropical UV exposure at surface + bioluminescence display patterns',
      geneAssociation: 'MC1R variants',
      lineageMapping: 'Thal — visual display markers on amber plains',
    },
  ],
  divingDepth: '>70 meters — navigating rudist meadow crevices where aigialosaurs and snakes hid',
  bajauAnalog: 'Identical selective pressure to modern Bajau Sea Nomads; convergent evolution of same genetic pathway',
};

// ── MARITIME TECHNOLOGY ───────────────────────────────────────────────────────
// Tethyan boats were mobile fortresses, not merely transport.
// Each design element was a direct response to a specific predator or environment.

export const MARITIME_TECHNOLOGY = {
  hullMaterial: {
    source: 'Frenelopsis conifer — halophytic, segmented succulent stems, high resin content',
    properties: 'Naturally resistant to corrosive saline air and H₂S from Purple Ocean events',
    construction: 'Hollowed-out trunks or bundled stems, lashed with vine-fibers, sealed with hot Cheirolepidiaceae resin',
    flexibility: 'Resilient enough to absorb charging pliosaur impact or hypercane battering (500 mph wind capable)',
  },
  defensiveSystems: [
    {
      id: 'pliosaur-mimic-hull',
      label: 'Pliosaur-Profile Hull',
      mechanism: 'Visual deterrence and mimicry — wide, low-slung beam silhouette resembles apex predator when viewed from below',
      target: 'Territorial deep-water pliosaurs',
      psychologicalBasis: 'Projects appearance of a larger, more formidable territorial rival — same mechanism as Viking longship intimidation',
    },
    {
      id: 'gunwale-stakes',
      label: 'Gunwale Stakes',
      mechanism: 'Fire-hardened, resin-tipped vertical stakes along the gunwale — physical landing denial',
      target: 'Pterosaurs attempting deck-snatching attacks',
      note: 'Forces pterosaurs to remain aloft where they can be neutralized by harmonic deterrents',
    },
    {
      id: 'silurian-harmonics-ship',
      label: 'Silurian Harmonics (Mobile)',
      mechanism: 'Tonal frequencies targeting pterosaur flocculus — neural/vestibular disorientation',
      target: 'Coordinated aerial swarm attacks',
      source: 'Hyster\'s identification of the precise flocculus-disorienting frequency bands',
    },
    {
      id: 'frenelopsis-resin-seal',
      label: 'Frenelopsis Resin Seal',
      mechanism: 'Hydrophobic and toxin-resistant bond on all hull seams',
      target: 'Corrosive saline/sulfidic water ingress during Purple Ocean events',
    },
    {
      id: 'upwind-decoy-beacons',
      label: 'Upwind Decoy Beacons',
      mechanism: 'Visual steering and scent masking — redirects predator detection away from vessel',
      target: 'Initial predator detection and approach',
    },
  ],
};

// ── ENVIRONMENTAL NAVIGATION ──────────────────────────────────────────────────
// How nomads moved across the fragmented Tethyan archipelago.

export const NAVIGATION_METHODS = [
  {
    id: 'bioluminescent-tracking',
    label: 'Death Glimmer Navigation',
    description: 'Dinoflagellate bioluminescent blooms tracked at night to read current patterns. The same "Death Glimmer" that signals OAE onset also reveals safe current corridors for crossing.',
    mechanicNote: 'During Purple Ocean map events, this navigation method becomes MORE accurate, not less — the Silurian food web expansion creates predictable bioluminescence lanes.',
  },
  {
    id: 'star-path',
    label: 'Star Path Navigation',
    description: 'Stellar navigation for moving between distant island arcs of the circum-equatorial current. Required memorization of star paths by Pteroswift relay riders.',
  },
  {
    id: 'clicklines',
    label: 'Clicklines',
    description: 'Measured rhythmic tensions in current-stabilized cables stretched between Eyrie waystation buoys. Timing the "click" interval allowed calculation of crossing windows.',
    eyrieConnection: 'Pteroswift flight timing was calculated using clickline readings at each Eyrie.',
  },
  {
    id: 'earth-tune',
    label: 'Earth Tune',
    description: 'Seismic and infrasonic bone-conduction reading of tectonic and volcanic activity. Thal lineage specialty — evolved as a migration-memory system, applied to maritime route safety.',
    lineageBonus: 'Thal players with migration-memory tier 3+ can read Earth Tune signals on the map as a hazard overlay.',
  },
  {
    id: 'matsu-knot',
    label: 'Matsu-Knot Authentication',
    description: 'Unique scar patterns and knotline slipcodes used to authenticate courier messages across Eyrie stations. Each relay is verified by the Horster before onward dispatch.',
  },
];

// ── EYRIE HORSTER ROLE ────────────────────────────────────────────────────────
// Expands the Eyrie Charter with the specific Horster function.

export const HORSTER_ROLE = {
  title: 'Horster',
  description: 'Master handler at each Eyrie waystation. Responsible for Pteroswift welfare, imprinting, and tactical coordination of the Stryker city guardian lines.',
  responsibilities: [
    'Imprinting Pteroswifts to specific relay routes — neural bonding that cannot be forced',
    'Managing the fletchwrights who engineer aerodynamic harnesses and message tubes',
    'Enforcing the Eyrie Charter prohibition on weaponized payloads',
    'Maintaining clickline infrastructure for Pteroswift flight timing',
    'Coordinating Stryker guardian lines during city defense events',
  ],
  charterNote: 'The Horster holds Eyrie-neutral status — no faction can compel a Horster to break the relay charter. This is the only professional class protected by all four factions simultaneously.',
  lineageAffinities: {
    primary: 'mystic',   // Kith resonance enhances Pteroswift imprinting
    secondary: 'thal',   // Creature bond mechanics apply
  },
};

// ── CITY AERIAL DEFENSE — SILURIAN HARMONICS ─────────────────────────────────
// The most advanced defensive tech described by Hyster.
// Sky City and volcanic arc settlements used stone resonator arrays.

export const SILURIAN_HARMONICS = {
  id: 'silurian-harmonics-defense',
  label: 'Silurian Harmonic Arrays',
  description: 'Stone resonator arrays built into city walls. Produce specific tonal frequencies that interfere with the pterosaur flocculus — the "flight computer" responsible for ocular stabilization. Disorients attacking rogue swarms, forces abort-dive and crash on volcanic slopes.',
  targetMechanism: 'Pterosaur flocculus — disrupts wing-surface sensory integration, causing loss of ocular stabilization',
  regionPresence: ['sky-city', 'arnn-ridge', 'watcher-volcano'],
  constructionNote: 'Arrays must be tuned to species-specific flocculus resonance frequency. Hyster provided the calibration data through his portal access. Re-tuning required if rogue swarm lineage changes.',
  gameplayMechanic: 'Triumvirate players with Compact Authority tier 2+ can access Silurian Harmonics as a map event — activates during aerial threat events in Sky City region.',
};
