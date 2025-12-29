# Tethys Project Bible

Authoritative reference for the World of Tethys headless build. Use this document when modeling WordPress data, designing UI, or writing in-world copy. Voice stays observational, restrained, ominous. No hype, no slang, no emojis.

---

## I. Narrative Foundation

- **The World** – Tethys is a living survival ecology. Water and acoustic resonance (“Sync”) govern every decision. Technology is biological, not mechanical.
- **Primary Eras**
  - **Ancient Cambria (111 MYA)** – A biotechnical city-state beneath the Tethys Ocean. DNA, not iron, powers civilization.
  - **Sky City (Book I timeline)** – Post-Inundation survivors in a sunken Venice analogue. They inherit relics from Cambria without full comprehension.
- **The Incident – The Great Inundation**
  - **Trigger**: Slip along the Wallace-Rift pulls the Cimmerian Sea into Garial City, submerging the archipelago.
  - **Scientific Failure**: Sync Frequency dropped 40% after Eradicationist experiments with Dissonant Salt (NaCl\*). Resonance collapsed before engineers could recalibrate.
  - **Survival**: Rosa-Lyn and Shly-Den initiate “Mitosis Overdrive,” tripling cellular wall density in four hours, keeping Sky City afloat while Cambria falls.
  - **Legacy**: The Cambria Archive charts (composition, survival, radar, instability) visualize tension vs resilience across the eras.

---

## II. The Cambrian Nine (Primary Cast)

| Name | Archetype | Function |
| --- | --- | --- |
| **Bol (The Muralist)** | Megalithic giant | Uses low-frequency pigments to stabilize archipelago infrastructure. Sync color: `sync-violet`. |
| **Rosa-Lyn (The Engineer)** | Rosalind Franklin analogue | Masters X-ray cave diffraction and bathymetric mapping. Manages X-ray tunnels, sluice systems, and emergency Mitosis Overdrive. |
| **Melden (The Geneticist)** | Mendel analogue | Runs Punnett raceways. Models inheritance in striped bass hybrids. Public cover: aquaculture overseer. |
| **Shly-Den (The Architect)** | Schleiden analogue | Builds living concrete, guides cellular wall fortifications. Controls city-scale mitosis triggers. |
| **Kith (The Weaver)** | Elias Magnus Fries analogue | See §III. Maintains fungal intelligence network. Silent communicator via spore-drop packets. |
| **Jairo** | Glider pilot and political courier | Bridges Sky City factions, reports on Sync fluctuations in modern timeline. |
| **Kel** | Systems tactician | Monitors energy ledgers, ensures Rosa-Lyn’s data reaches field teams. |
| **Herc** | Thalassic sovereign | Pliosaur visitor whose presence resets dominance hierarchies in the shallows. |
| **Ravel** | Woods mystic healer | Listener who understands Cambric marginalia. Interfaces with Kith network when humans cannot. |

---

## III. Biological Entities

### 1. Glow Tide
Seasonal convergence of bioluminescent plankton, bacterial mats, and mineral runoff. Signals nutrient abundance, safe spawning windows, and predator deterrence. Quote: _“Aquael memora.”_

### 2. Mega-Oysters (Lithaqua Conchera)
Reef-building filter giants. Shells capture driftwood, bone fragments, mineral layers. Provide thermal buffering and larval redistribution. Status badging: **Observed**.

### 3. Spat (Estuarine Stegosaur Hybrid)
REGNUM: Littorolithica; ORDO: Stegosauria Aquatica; FORMA: Estuarine Camouflage; VARIANTIA: Spat. Moves slowly, distributing oyster larvae and creating nutrient eddies. Misclassified as terrain. Cambric: _“Non dominat. Sustén.”_

### 4. Kith (The Weaver)
- **Reference**: Elias Magnus Fries (fungal taxonomy).
- **Role**: Manages planetary mycorrhizal symbiosis. Breaks Eradicationist “Static” into nitrogen for raceways.
- **Secret**: Kith’s neural network carries the reincarnated data-stream of Fri-Es. Communicates through “Spore-Drops,” encrypted data packets passed via fungal threads. He is the recycle bin of Tethys, transmuting toxins into biofuel precursors.

### 5. Nute
Hybrid of titanosaur, theropod, and amphibian. Acts as natural purifier and field medic. Monitors Sync frequency. Color tie: `nute-emerald`.

### 6. Striped Bass (Model Organism)
Used in Punnett raceways for food and Omega-Sync oil research. Provides reproducible Mendelian traits for student simulators.

### 7. Dissonant Salt (NaCl\*)
Eradicationist chemical weapon that disrupts osmoregulation and Sync resonance. Appears in UI as `dissonant-red`.

---

## IV. Real-World Science Links

| Historical Figure | Tethys Analog | Mechanic |
| --- | --- | --- |
| **Nikola Tesla** | Tesla-Nodes | Wireless resonance towers broadcasting Sync frequencies. |
| **Rosalind Franklin** | Rosa-Lyn | X-ray diffraction, structural biology, bathymetric maps. |
| **Alfred Russel Wallace** | Wallace Line | Biogeographical boundary that fractures when the Inundation begins. |
| **Linus Pauling** | Bond Integrity | Chemistry of living concrete and osteoderm plating. |
| **Louis Pasteur** | Swan-Neck Flask Sidebar | Germ theory analog. Sidebar UI fills like a flask as users read. |
| **Elias Magnus Fries** | Kith | Fungal communication networks. |

---

## V. Systems & UI Mapping

### Tailwind Palette (Sync + Bioluminescence)
- `tethys.bg` `#020617` – Deep Sea Abyss
- `tethys.card` `#0f172a` – Obsidian slate
- `tethys.muted` `#334155` – Wet basalt
- `tethys.cyan` `#22d3ee` – Rosa-Lyn’s glow
- `tethys.violet` `#8b5cf6` – Bol’s pigment
- `tethys.emerald` `#10b981` – Kith/Nute vitality
- `tethys.rose` `#f43f5e` – Dissonant red
- `tethys.gold` `#fbbf24` – Founder legacy accents
- Additional Sync accents: `sync-violet #8b5cf6`, `sync-glow #22d3ee`, `nute-emerald #10b981`, `dissonant-red #ef4444`, `vitrified-glass rgba(255,255,255,0.1)`

### Motion Patterns
- **Anaphase Transition** – Framer Motion layout that scales on the Y axis and draws spindle fibers (`bg-tethys-cyan/20` lines) when navigating to major routes (e.g., `/history`). Easing `[0.45, 0.05, 0.55, 0.95]`.
- **Cymatic Cursor** – Global click handler spawns Chladni-style ripple SVGs. Ripple count tied to `syncFrequency` state.
- **Glassmorphism** – Use `vitrified-glass` for card borders/backgrounds. Cards fade/shift color on hover.
- **Lore Cards** – `LoreCard` component showcases type, title, excerpt with subtle border animation.

### Layout Components
- **Timeline** – `/history` route renders vertical Chart.js data with Tailwind classes: `relative pl-8 pb-12 border-l border-tethys-gold/30`.
- **Geode Grid** – Gallery layout `grid grid-cols-1 md:grid-cols-3 gap-6` using `bg-tethys-slate` and hover border glow.
- **Punnett Raceway Simulator** – React client component using Framer Motion to animate allele combinations. Variables below.

---

## VI. Data Modeling & GraphQL

### Custom Post Types (CPT UI)
1. **Characters** – GraphQL Single `character`. Fields: `characterDetails { faction, age, homeworld }`.
2. **Creatures** – GraphQL `creature`. Fields: taxonomy (regnum/ordo/forma/variantia), Cambric snippets.
3. **Events** – GraphQL `event`. Fields: `eventDetails { timelineDate, impactLevel }`.
4. **Locations** – GraphQL `location`. Fields: coordinates, environmental notes, associated geodes.
5. **Geodes** – GraphQL `geode`. Fields: `geodeDetails { rarity, resonantFrequency, originLocation { nodes { ...LocationFields } } }`. Relationship field created via ACF (Origin Location).

### GraphQL Queries
- **Get Character** – `character(id: $id, idType: SLUG) { title content characterDetails { ... } }`
- **Get Events** – `events(where: { orderby: { field: DATE, order: ASC } }) { nodes { title content eventDetails { timelineDate impactLevel } } }`
- **Get Geodes** – `geodes { nodes { title excerpt geodeDetails { rarity resonantFrequency originLocation { nodes { databaseId title slug } } } } }`
- **Search palette** (future) – combine union of characters, locations, geodes, events with minimal fields for command palette indexing.

### Punnett Raceway (Inheritance Variables)
1. **Resonant Scales (Bio-Fuel)**
   - Alleles: `R` (Hum-Vein) / `r` (Silent-Vein).
   - Yields: `RR = 100% Omega-Sync Oil`, `Rr = 50%`, `rr = 0% (System Alert)`.
2. **Dorsal Fin Structure (Hydrodynamics)**
   - Alleles: `F` (Fan-Fin) / `f` (Spine-Fin).
   - Flow: `FF` or `Ff` = smooth sluice transport; `ff` = laminar breakdown, increases risk during Inundation recreation.

Expose these in the React simulator so students can mix parent genotypes and watch oil yield + flow stability gauges.

---

## VII. Governance

### The Triumvirate
- **Purpose** – Balance Resonance (Tesla-Nodes), Architecture (Walls), and Biology (Raceways) within Sky City.
- **Melden (The Martyr)** – Oversees biological strata, striped bass raceways, and Omega-Sync oil yields. Believes Sync is a shared biological gift.
- **Vane (Architect of Silence)** – Commands structural integrity and defense. Descended from Eradicationist priesthood; favors “Dead Stone” and synthetic frequencies.
- **Kross (Frequency Purist)** – Controls Tesla-Nodes and energy distribution. Advocates “Pure Note” elitism; lower tiers kept in “Static” to remain subservient.

### The Triumvirate Purge
- **Incident** – Transition from Resonant Era to Static Era; Melden framed as a biological liability.
- **Method** – Bio-assassination using concentrated NaCl\* injected into tea, inducing osmotic collapse (“suspicious heart failure”).
- **Aftermath** – Resonance flatlines; System Alerts announce “Melden-Node Offline.”

### Execution of Igzier
- **Mechanism** – Judicial exile via The Weep waterfall.
- **Physics** – Igzier employs a Vitrified Staff to deliver kinetic thrust, clearing jagged basalt stakes and hitting the aerated cavitation pocket (Leidenfrost Cushion).
- **Result** – First recorded instance of Kinetic Diffraction; Igzier reaches Sub-Basalt Cave System and carries the Founders’ Codex into exile.

---

## VIII. Architecture

### Tesla-Node (Broadcast Core)
- **Frequency Range** – 396 Hz (Root Channel) through 852 Hz (Crown Channel).
- **Standard Operating Tone** – 528 Hz. Golden ratio resonance keeps airborne infrastructure suspended.
- **Materiality** – Vitrified bio-silicon core wrapped in gold-leaf lattice. Suspended via permanent standing wave (acoustic levitation).
- **Failure State** – Below 417 Hz (“Static Threshold”) the node enters acoustic cavitation; turbulence fractures walls and destabilizes nearby Tesla pylons.
- **UI Mapping** – `TeslaNode` component visualizes resonance gap; laminar rings indicate Sync, jagged rings signal dissonant static.

---

## IX. Tactics

### Ionic Veil Protocol
- **Mechanism** – Combined galvanic induction (eel discharge) + birefringence of manta membranes produces a liquid Faraday cage.
- **Effect** – Renders squads invisible to light, sonar, and electroreception by sustaining a conductive shell around the unit.
- **Limitation** – Requires constant Refractive Sync (`n = 1.33`). Rapid movement breaks laminar slip and collapses the veil.
- **UI Hook** – `IonicVeilCard` component uses shimmer overlays/backdrop blur to show activation; hover reveals the Faraday scanline.

### Stealth Science Reference
- **Real-World Basis** – Faraday cages cancel electromagnetic fields by redistributing charge; ionic seawater acts as the conductor.
- **Tethys Echo** – Seris’ eels emit tuned pulses, while Eldora’s manta-field maintains the refractive geometry. Together they create the “Conductive Shell” used in infiltration missions.

---

## X. Sociology

### The Root-Healer Insurgency
- **Philosophy** – Saprotrophic ecology: life through decay, composting oppressive systems instead of direct conquest.
- **Deity** – Kith (The Weaver); worship through tending fungal networks.
- **Rite of Suture** – Live mycelial hyphae used as stitches; healing doubles as resonance retuning.
- **Objective** – Allow Triumvirate “Static Era” to rot until structures collapse under their own dissonance; then re-root Sync in soil.

### Manifesto of the Root-Healers
1. **Fallacy of the Peak** – Sky City without earth cannot die or be reborn; aerial thrones are parasites.
2. **Melden-Sacrifice** – Melden was “harvested”; his Omega-Sync-saturated blood feeds the estuary despite assassination.
3. **Law of the Mycelium** – No creature stands alone; dissonant isolation is the Eradicationist dream.
4. **Great Reset** – Goal is composting the city; waiting until Static shatters their walls.
5. **Igzier Clause** – The exile bridges sky and root; mud in wounds keeps his bones together.

### The Weep Mythology
- **Weep Simulator** – Map-bridge mini experience where players adjust trajectory sliders to clear jagged stakes and land in aerated pocket.
- **Leidenfrost Cushion** – Aerated water reduces density (~600 kg/m³) to survive terminal velocity impacts. UI toggles between Sync view and Root-Healer view (nutrient density, spore saturation, heartbeat audio).

---

## XI. Anatomy

### Mycorrhizal Survival (Post-Exile)
- **Injury Profile** – Multi-system trauma, internal hemorrhage, basalt-shatter fractures, hypovolemic shock.
- **Treatment** – Root Healer applies Lyco-Spore coagulants, mycelial splints, and glucose-sharing hyphae (Pulse-Wrap).
- **Outcome** – Igzier becomes partially myco-integrated; neural pathways now tuned to Kith network, perceiving Tesla-Nodes as cranial pressure.
- **UI Hook** – “Stabilization Monitor” component shows spore-heart pulses, blood-root bars, and Earth-Sync health readouts.

---

## XII. Historical Record: The Great Inundation

- **Trigger** – Wallace-Rift slip, Cimmerian Sea surge.
- **Early Warning** – Glow Tide patterns drifted 12 hours earlier than recorded norms. Sync Frequency logs show phased drop from 88% → 48% within 36 hours.
- **Eradicationist Action** – Dissonant Salt clouds seeded near Tesla-Nodes, amplifying resonance decay.
- **Mitigation** – Mitosis Overdrive triggered by Rosa-Lyn & Shly-Den, thickening wall tissues by 300% in four hours. Cambria loses contact with reef-state guardians; Sky City inherits surviving Tesla-Nodes.
- **Aftermath** – Camria Archive charts show Genetic Instability Index hitting 98 as Technological Output plummets. History route should mirror these data points for continuity.

---

## XIII. Theology

### Law of Conservation of Information
- **Concept** – Information cannot be destroyed, only transformed. The Primordial “Flash” scattered pure data into biological vessels.
- **The Mysterious Nine (Pre-Flash)** – Non-corporeal archetypes embodying Absolute Zero, Entanglement, Laminar Intent, Incompressibility, Chromatic Shift, Catalysis, Universal Script, Dissonance, and Gravity.
- **The Flash Event** – Forced the entangled consciousness into oceanic refuges, later manifesting as the Cambrian Nine.
- **Overseer Goal** – Collect Cambrian, Silurian, Bonded, and Mythic cards to re-entangle the original data stream.
- **UI Hook** – `MythicCard` uses mix-blend exclusion + negative space to display the Pre-Flash entities as “holes” in reality.

---

## XIV. UI / UX Directives

1. **Navigation** – Wordmark-only header. Links: Records, Characters, Creatures, Mystics, Humans, Registry, Listen, History, Book I (Amazon).
2. **Sidebar** – Swan-Neck Flask concept. Fill level tied to scroll depth or time-on-page. Use gradient from `tethys.violet` to `tethys.cyan`.
3. **Cursor** – Chladni ripple pattern triggered on click. Rings count bound to `syncFrequency`.
4. **Archive Strip** – Thin horizontal band showing silhouettes/maps/runes. No captions.
5. **Footer** – Seal + `© 2025 D.C. Barletta`. Tone remains institutional.

---

## XV. Content Rules

- **Voice** – Observational, restrained, ominous. “No monsters recorded. Only organisms adapting under pressure.”
- **Themes** – Each artifact/post must hit at least one pillar: Survival over morality; Adaptation over dominance; Observation over judgment; Scale humbles all intelligence.
- **Credit Standard** – Always: `© 2025 D.C. Barletta · World of Tethys`.
- **Expansion Rule** – World may grow, but it never explains itself louder than it observes.

---

## XVI. Implementation Checklist

1. **Tailwind/PostCSS** – Install Tailwind CLI/postcss config, import base styles into `globals.css`. Extend with Sync palette, clip-path utilities.
2. **Cambria Route** – Move HTML mockup into `/history` (or `/history/cambria`). Use server component for layout + client component for Chart.js.
3. **Anaphase Layout** – Wrap top-level layout or specific routes with `AnaphaseLayout` to animate transitions.
4. **Punnett Raceway Component** – Build `PunnettRacewaySimulator` as client component with Framer Motion pulses.
5. **Geode CPT** – Confirm GraphQL relationship fields (geode → location). Create `/geodes` route with glassmorphic grid.
6. **Command Palette** – Implement Cmd/Ctrl+K command palette after data relationships are confirmed.

---

Everything in this Bible is canon until superseded by a higher version. Increment version numbers (`v1.0`, `v1.1`, etc.) when revising. Lock tone, lock taxonomy, and keep the archive authoritative.***
