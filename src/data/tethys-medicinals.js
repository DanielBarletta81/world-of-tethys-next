export const TETHYS_MEDICINAL_SYSTEM = {
  designPrinciples: {
    noUniversalCures: true,
    processingRequired: true,
    fungalPlantArmsRace: true,
    timingOverQuantity: true
  },
  items: [
    {
      id: 'fungal_blackgrain_wash',
      tethysName: 'Black-Grain Ash Wash',
      category: 'antidote_hemostatic',
      realWorldAnalog: {
        organism: 'Palaeoclaviceps parasiticus',
        compoundClass: 'ergot alkaloids',
        eraEvidence: 'Mid-Cretaceous amber grass infection'
      },
      sourceEcology: 'fungus_on_early_grasses',
      preparation: {
        required: true,
        method: ['soak_in_ash_water', 'short_heat', 'discard_residue'],
        riskIfIncorrect: ['vasoconstriction', 'limb_necrosis', 'hallucinatory_fever']
      },
      effects: {
        counters: ['thorn_venom_microtoxins', 'vascular_bleeding'],
        secondary: ['uterine_contraction', 'vision_distortion']
      },
      oracleNotes: 'Fire-dust water tames the black bite. Never raw.',
      rarityLogic: 'dangerous_to_prepare'
    },
    {
      id: 'stone_shelf_resin',
      tethysName: 'Stone-Shelf Resin',
      category: 'immune_modulator',
      realWorldAnalog: {
        organism: 'Ganoderma lineage',
        compoundClass: ['triterpenes', 'beta_glucans'],
        eraEvidence: 'Polypore lineage predates angiosperms'
      },
      sourceEcology: 'deadwood_polypore',
      preparation: {
        required: true,
        method: ['long_decoction', 'or_fat_infusion'],
        riskIfIncorrect: ['ineffectiveness']
      },
      effects: {
        counters: ['fungal_spore_fever', 'chronic_inflammation'],
        secondary: ['resistance_to_future_exposure']
      },
      oracleNotes: 'Bitter means working. Weak taste means wrong tree.',
      rarityLogic: 'slow_to_prepare'
    },
    {
      id: 'beetle_bread_paste',
      tethysName: 'Beetle-Bread Paste',
      category: 'topical_antibiotic',
      realWorldAnalog: {
        organism: 'Ambrosia fungi (Raffaelea / Ambrosiella)',
        compoundClass: 'antimicrobial metabolites',
        eraEvidence: 'Ambrosia beetle farming ~100–110 Ma'
      },
      sourceEcology: 'beetle_galleries_in_dead_trees',
      preparation: {
        required: false,
        method: ['harvest_fresh', 'apply_directly'],
        riskIfIncorrect: ['contaminant_fungi']
      },
      effects: {
        counters: ['wound_infection', 'rot_after_thorn_injury'],
        secondary: ['nutrient_support']
      },
      oracleNotes: 'If beetles guard it, it’s medicine.',
      rarityLogic: 'location_specific'
    },
    {
      id: 'dream_lotus_emetic',
      tethysName: 'Dream-Lotus Pull',
      category: 'emetic_sedative',
      realWorldAnalog: {
        organism: 'Nymphaeales (water lily lineage)',
        compoundClass: ['aporphine alkaloids', 'nuciferine'],
        eraEvidence: 'Basal angiosperms established by 122 Ma'
      },
      sourceEcology: 'freshwater_lagoons',
      preparation: {
        required: true,
        method: ['tea_or_fermented_infusion'],
        riskIfIncorrect: ['over_sedation', 'confusion']
      },
      effects: {
        counters: ['plant_poison_ingestion', 'psychic_overload'],
        secondary: ['sleep', 'vision_state']
      },
      oracleNotes: 'First it empties you. Then it quiets you.',
      rarityLogic: 'seasonal'
    },
    {
      id: 'bone_fern_bind',
      tethysName: 'Bone-Fern Bind',
      category: 'wound_and_bone',
      realWorldAnalog: {
        organism: 'Osmunda lineage',
        compoundClass: ['tannins', 'mucilage'],
        eraEvidence: 'Osmundaceae fossil record to Permian'
      },
      sourceEcology: 'fern_understory',
      preparation: {
        required: true,
        method: ['roast_or_boil'],
        riskIfIncorrect: ['thiamine_depletion']
      },
      effects: {
        counters: ['fractures', 'open_wounds'],
        secondary: ['skin_protection', 'burn_relief']
      },
      oracleNotes: 'Raw fern steals the nerve. Fire gives it back.',
      rarityLogic: 'common_but_dangerous'
    }
  ]
};
// World of Tethys || D.C. Barletta
