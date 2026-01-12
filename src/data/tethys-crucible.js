export const TETHYS_CRUCIBLE_MAPPINGS = [
  {
    real: 'Adria / Apulia Platform',
    lore: 'Apulian Rise',
    type: 'carbonate platform',
    notes: 'Shallow tropical shelf; insular habitat; tidal flats and lagoons.',
    terrain: {
      substrate: 'lime-mud, oolite shoals, tidal flats',
      color: 'chalk-ivory, amber-silt',
      hazards: ['salinity spikes', 'tidal resonance'],
      scent: 'brine, sun-baked shell',
      sound: 'wind over flats, distant surf'
    },
    vr: {
      fog: 'low',
      light: 'high glare, white sheen',
      audio: 'flat surf + distant gull',
      triggers: ['low-tide reveal', 'salt crust shimmer']
    }
  },
  {
    real: 'Ionian Basin',
    lore: 'Ionian Deep',
    type: 'pelagic basin',
    notes: 'Deep-water sedimentation; anoxic intervals.',
    terrain: {
      substrate: 'black mud, radiolarite drifts',
      color: 'ink-black, violet sheen',
      hazards: ['anoxia', 'toxic upwelling'],
      scent: 'sulfur, wet stone',
      sound: 'low rumble, muffled churn'
    },
    vr: {
      fog: 'high',
      light: 'low, purple tint',
      audio: 'sub-bass hum',
      triggers: ['euxinic bloom', 'black water rise']
    }
  },
  {
    real: 'Sakarya / Pontide Terranes',
    lore: 'Pontide Margin',
    type: 'active continental margin',
    notes: 'Northern boundary; subduction-influenced basins.',
    terrain: {
      substrate: 'basalt ribs, slate ledges',
      color: 'cold slate, iron red',
      hazards: ['rockfall', 'micro-quakes'],
      scent: 'cold dust, metal',
      sound: 'stone tick, wind shear'
    },
    vr: {
      fog: 'mid',
      light: 'blue-grey',
      audio: 'canyon wind + stone chime',
      triggers: ['seismic pulse']
    }
  },
  {
    real: 'Intra-Pontide Ocean',
    lore: 'Pontide Channel',
    type: 'restricted seaway',
    notes: 'Gate between marginal basins; stratification prone.',
    terrain: {
      substrate: 'silt troughs, brackish ledges',
      color: 'green-grey, tannin',
      hazards: ['stratified currents'],
      scent: 'river tannin, algae',
      sound: 'slow surge'
    },
    vr: {
      fog: 'mid-high',
      light: 'diffuse green',
      audio: 'low tide wash',
      triggers: ['current reversal']
    }
  },
  {
    real: 'Kohistan–Ladakh Arc',
    lore: 'Kohistan Firechain',
    type: 'intra-oceanic volcanic arc',
    notes: 'Explosive volcanism; ash + CO2 pulses; island chain.',
    terrain: {
      substrate: 'andesite, pumice, black sand',
      color: 'ember basalt, ash white',
      hazards: ['stealth eruptions', 'ashfall', 'pyroclast'],
      scent: 'sulfur, hot stone',
      sound: 'far thunder, glass hiss'
    },
    vr: {
      fog: 'ash haze',
      light: 'orange-grey',
      audio: 'distant boom + ash hiss',
      triggers: ['ash plume', 'shockwave ripple']
    }
  },
  {
    real: 'Dras Volcanics',
    lore: 'Dras Glassfields',
    type: 'volcanic sequence',
    notes: 'Basalt to rhyolite flows; explosive deposits.',
    terrain: {
      substrate: 'glass breccia, welded tuff',
      color: 'smoke glass, rust',
      hazards: ['razor glass', 'heat vents'],
      scent: 'ozone, scorched pumice',
      sound: 'crackle, brittle crunch'
    },
    vr: {
      fog: 'low',
      light: 'hard specular glint',
      audio: 'glass chime',
      triggers: ['heat shimmer']
    }
  },
  {
    real: 'Pindos Ocean',
    lore: 'Pindos Trench',
    type: 'deep oceanic basin',
    notes: 'Radiolarite deposition; deep-water stagnation.',
    terrain: {
      substrate: 'siliceous ooze, red clay',
      color: 'deep rust, indigo',
      hazards: ['pressure faults'],
      scent: 'cold iron',
      sound: 'deep current'
    },
    vr: {
      fog: 'high',
      light: 'very low',
      audio: 'low moan',
      triggers: ['pressure groan']
    }
  },
  {
    real: 'Proto–Black Sea',
    lore: 'Shadow Basin',
    type: 'marginal sea',
    notes: 'Restricted exchange; prone to dysoxia.',
    terrain: {
      substrate: 'mud drapes, anoxic pockets',
      color: 'green-black',
      hazards: ['sulfide vents'],
      scent: 'rotten egg',
      sound: 'soft churn'
    },
    vr: {
      fog: 'high',
      light: 'green-grey',
      audio: 'submerged hiss',
      triggers: ['sulfide pulse']
    }
  },
  {
    real: 'Circum‑Equatorial Current',
    lore: 'Tethys Throughflow',
    type: 'current system',
    notes: 'Primary heat transport; westward flow.',
    terrain: {
      substrate: 'open water',
      color: 'teal to cobalt',
      hazards: ['shear lines', 'eddies'],
      scent: 'salt, ozone',
      sound: 'wind-stitched surface'
    },
    vr: {
      fog: 'low',
      light: 'bright scatter',
      audio: 'surface rush',
      triggers: ['eddy swirl']
    }
  },
  {
    real: 'OAE 1b (anoxic event)',
    lore: 'Purple Lull',
    type: 'biogeochemical state',
    notes: 'Anoxia + photic zone euxinia; purple waters.',
    terrain: {
      substrate: 'black mud',
      color: 'violet milk, pink sheen',
      hazards: ['toxic gas', 'fish kills'],
      scent: 'sulfur bloom',
      sound: 'muffled water'
    },
    vr: {
      fog: 'colored haze',
      light: 'violet-pink',
      audio: 'subtle fizz',
      triggers: ['sulfide venting', 'surface discoloration']
    }
  },
  {
    real: 'Frenelopsis (mangrove-like forests)',
    lore: 'Frenel Thickets',
    type: 'coastal biome',
    notes: 'Salt‑tolerant conifer thickets; resinous; wildfire prone.',
    terrain: {
      substrate: 'tidal mud, salt crust',
      color: 'olive green, amber resin',
      hazards: ['wildfire', 'smoke'],
      scent: 'resin, brine',
      sound: 'dry crackle, insect hum'
    },
    vr: {
      fog: 'low to mid',
      light: 'warm green',
      audio: 'insect chorus',
      triggers: ['resin flare', 'smoke veil']
    }
  },
  {
    real: 'Jacob / Paquier / Urbino Horizons',
    lore: 'Black Horizons',
    type: 'event layers',
    notes: 'Black shale pulses; dead-bottom intervals.',
    terrain: {
      substrate: 'laminated black shale',
      color: 'tar black',
      hazards: ['toxic seep'],
      scent: 'bitumen',
      sound: 'silence'
    },
    vr: {
      fog: 'low light',
      light: 'near-black',
      audio: 'near silence',
      triggers: ['surface oil sheen']
    }
  }
];

export const TETHYS_CRUCIBLE_DOSSIER = {
  title: 'The Tethyan Crucible',
  subtitle: 'Aptian-Albian Transition ~111 MYA',
  canonYear: '111.4 MYA',
  framing: 'science-fantasy',
  sections: [
    {
      id: 'intro_corridor',
      title: 'The Corridor Engine',
      summary:
        'The Tethys Throughflow regulates heat while the microplate maze fractures circulation. The world is warm by default, but volatility dominates. This is a system that forgets slowly and breaks suddenly.',
      loreRefs: ['Tethys Throughflow', 'Apulian Rise', 'Pontide Channel'],
      terrainHooks: ['tidal resonance', 'eddy shear', 'salinity spikes'],
      vrHooks: ['surface rush', 'salt crust shimmer']
    },
    {
      id: 'geodynamics_mosaic',
      title: 'Fragmented Ocean',
      summary:
        'The Apulian Rise and Pontide Margin form the shallow-tropical and active-margin extremes. The Kohistan Firechain seeds ash and instability. The Pindos Trench and Shadow Basin trap stagnation.',
      loreRefs: [
        'Apulian Rise',
        'Pontide Margin',
        'Kohistan Firechain',
        'Pindos Trench',
        'Shadow Basin'
      ],
      terrainHooks: ['andesite arcs', 'radiolarite drifts', 'silt troughs'],
      vrHooks: ['ash haze', 'pressure groan', 'current reversal']
    },
    {
      id: 'climate_paradox',
      title: 'The Cold Snap Inside Heat',
      summary:
        'Heat saturates the world until the silicate drawdown bites back. Hyper-storms form over warm basins, then a transient cooling sharpens seasonality. The shoreline swings between deluge and ash-clear sky.',
      loreRefs: ['Tethys Throughflow', 'Frenel Thickets'],
      terrainHooks: ['storm scour', 'salt crust', 'seasonal burn'],
      vrHooks: ['wind shear', 'smoke veil']
    },
    {
      id: 'anoxia_purple',
      title: 'Purple Lull',
      summary:
        'Stratification locks the depths. Oxygen disappears. In the photic zone, sulfur blooms stain the water violet and pink. The surface looks alive while the bottom goes dead.',
      loreRefs: ['Purple Lull', 'Black Horizons', 'Ionian Deep'],
      terrainHooks: ['toxic upwelling', 'sulfide venting'],
      vrHooks: ['violet haze', 'subtle fizz']
    },
    {
      id: 'biosphere_turnover',
      title: 'Rudist Dominion and Apex Guild',
      summary:
        'Rudist meadows replace coral frameworks. Plankton blooms shimmer by night. Ichthyosaurs persist in the open, while serpentine hunters slip through the shallows.',
      loreRefs: ['Apulian Rise', 'Frenel Thickets'],
      terrainHooks: ['rudist thickets', 'bioluminescent surf'],
      vrHooks: ['neon surf flicker', 'reef edge current']
    },
    {
      id: 'coastal_botany',
      title: 'Frenel Thickets',
      summary:
        'Salt-tolerant conifer thickets line the estuaries. Resinous stems burn easily; ash returns to the mud. These shores are alive, flammable, and loud with insects.',
      loreRefs: ['Frenel Thickets'],
      terrainHooks: ['resin flare', 'tidal mud'],
      vrHooks: ['insect chorus', 'amber glow']
    },
    {
      id: 'case_kohistan',
      title: 'The Firechain Case',
      summary:
        'A volcanic island chain hums with stealth eruptions. Ash feeds blooms; pyroclasts erase shorelines without warning. The reef edge is brilliant and lethal.',
      loreRefs: ['Kohistan Firechain', 'Dras Glassfields'],
      terrainHooks: ['ashfall', 'glass breccia', 'black sand'],
      vrHooks: ['glass chime', 'ash hiss', 'shockwave ripple']
    }
  ]
};
