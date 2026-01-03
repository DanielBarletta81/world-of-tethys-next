// Base API for real-world biodiversity
const INATURALIST_API = "https://api.inaturalist.org/v1/observations?iconic_taxa=Fungi&per_page=10&photos=true&order_by=observed_on";

// --- THE TETHYS MUTATION MATRIX ---
// We map real Genus/Family names to Fantasy Effects & Lore
const MUTATION_MAP = {
  // PSYCHEDELICS / VISIONS
  "Psilocybe": {
    tethysName: "Veil-Piercer",
    effect: "Vision",
    lore: "Used by the Mystics to see the magnetic field lines of the planet.",
    rarity: "Rare",
    toxicity: "Moderate (Psychic Strain)"
  },
  "Amanita": {
    tethysName: "Berserker's Grail",
    effect: "Strength / Delirium",
    lore: "Induces a state of rage. Often found growing on the bones of large Theropods.",
    rarity: "Uncommon",
    toxicity: "High"
  },
  // POISONS / TRAPS
  "Galerina": {
    tethysName: "Widow's Rot",
    effect: "Lethal Toxin",
    lore: "Dissolves organic matter into sludge within hours. Used in arrow tips.",
    rarity: "Common",
    toxicity: "Fatal"
  },
  // BIOLUMINESCENCE / UTILITY
  "Mycena": {
    tethysName: "Star-Bleed",
    effect: "Light Source",
    lore: "Glows with a frequency that repels insects. Essential for deep-cave traversal.",
    rarity: "Common",
    toxicity: "Low"
  },
  "Omphalotus": {
    tethysName: "Jack's Lantern",
    effect: "False Light",
    lore: "Lures prey into sinkholes with a comforting orange glow.",
    rarity: "Uncommon",
    toxicity: "Moderate"
  },
  // HEALING / BUFFS
  "Ganoderma": {
    tethysName: "Iron-Bark Conk",
    effect: "Armor Boost",
    lore: "Chewing this tough bracket fungus hardens the skin like leather.",
    rarity: "Uncommon",
    toxicity: "None"
  },
  "Trametes": {
    tethysName: "Tail-Feather",
    effect: "Stamina",
    lore: "Increases oxygen efficiency in the blood. A staple for messengers.",
    rarity: "Common",
    toxicity: "None"
  }
};

// Fallback for unmapped fungi
const UNKNOWN_MUTATION = {
  tethysName: "Proto-Spore Variant",
  effect: "Unknown Mutation",
  lore: "A species that defies the current codex. Handle with extreme caution.",
  rarity: "Unknown",
  toxicity: "Variable"
};

// --- THE ENGINE ---
export async function fetchFungalProxy() {
  try {
    // 1. Fetch random recent fungi observations from the real world
    const response = await fetch(INATURALIST_API);
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) return null;

    // 2. Process and Mutate
    const specimens = data.results.map(obs => {
      const taxon = obs.taxon;
      const realName = taxon.name || "Unknown Fungi";
      const commonName = taxon.preferred_common_name || "Unidentified";
      const genus = taxon.name.split(" ")[0]; // Get the first part of latin name
      
      // 3. Find Tethys Analog
      // Check if we have a specific map, or default to unknown
      const mutation = MUTATION_MAP[genus] || UNKNOWN_MUTATION;

      // 4. Speculative Evolution (The "100 Million Year Headstart")
      // We randomly assign a "Growth Substrate" to make it feel ancient/alien
      const substrates = ["Obsidian Glass", "Dinosaur Bone", "Volcanic Ash", "Living Flesh", "Petrified Wood"];
      const substrate = substrates[Math.floor(Math.random() * substrates.length)];

      return {
        id: obs.id,
        realWorld: {
          scientificName: realName,
          commonName: commonName,
          location: obs.place_guess || "Unknown Coordinates",
          imageUrl: obs.photos[0]?.url.replace('square', 'medium') || null, // Get higher res
          wikiLink: taxon.wikipedia_url
        },
        tethys: {
          name: mutation.tethysName,
          genus: genus,
          effect: mutation.effect,
          lore: mutation.lore,
          rarity: mutation.rarity,
          toxicity: mutation.toxicity,
          substrate: substrate
        }
      };
    });

    return specimens;

  } catch (error) {
    console.error("Mycology Uplink Failed:", error);
    return [];
  }
}