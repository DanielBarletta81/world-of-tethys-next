export const TETHYS_CRUCIBLE_BLOCKS = [
  {
    id: 'crucible_corridor_engine',
    base: 'The corridor current carried heat westward, but the maze of plates broke it into eddies.',
    variants: {
      low: 'The corridor current carried heat westward, but the maze of plates broke it into eddies.',
      mid: 'The throughflow carried warmth, though its path fractured around the drifting plates.',
      high: 'Some say the current never ran clean at all, only splintered into restless loops.'
    },
    myths: ['tethys-throughflow'],
    regions: ['apulian_rise', 'pontide_channel'],
    signals: {
      beliefs: ['heat_engine'],
      epistemics: { certainty: 0.52, witness: 'indirect' }
    }
  },
  {
    id: 'crucible_fragmented_ocean',
    base: 'The Apulian Rise held the shallows while the Pontide Margin ground and lifted stone.',
    variants: {
      low: 'The Apulian Rise held the shallows while the Pontide Margin ground and lifted stone.',
      mid: 'Shallow shelves kept life close while the northern margin shifted and cracked.',
      high: 'The shelves were said to float, and the margin to move when no one watched.'
    },
    myths: ['apulian-rise', 'pontide-margin'],
    regions: ['apulian_rise', 'pontide_margin'],
    signals: {
      beliefs: ['fragmented_ocean'],
      epistemics: { certainty: 0.48, witness: 'recorded' }
    }
  },
  {
    id: 'crucible_firechain_ash',
    base: 'Ash from the Firechain fell without warning and fed blooms that were never gentle.',
    variants: {
      low: 'Ash from the Firechain fell without warning and fed blooms that were never gentle.',
      mid: 'The Firechain left ash on the wind, and the water answered with sudden growth.',
      high: 'Some claimed the ash chose its timing, and the blooms followed like a breath.'
    },
    myths: ['kohistan-firechain'],
    regions: ['kohistan_firechain', 'dras_glassfields'],
    signals: {
      beliefs: ['volcanic_pulse'],
      epistemics: { certainty: 0.42, witness: 'direct' }
    }
  },
  {
    id: 'crucible_cold_snap',
    base: 'Heat ruled the seasons until a brief cooling sharpened the edges of the year.',
    variants: {
      low: 'Heat ruled the seasons until a brief cooling sharpened the edges of the year.',
      mid: 'Warmth dominated, then a sudden coolness made the seasons bite.',
      high: 'Some remembered a cold that did not belong there, brief but decisive.'
    },
    myths: ['cold-snap'],
    regions: ['tethys_throughflow', 'frenel_thickets'],
    signals: {
      beliefs: ['seasonality'],
      epistemics: { certainty: 0.4, witness: 'indirect' }
    }
  },
  {
    id: 'crucible_purple_lull',
    base: 'The water turned violet in places, bright at the surface and dead beneath.',
    variants: {
      low: 'The water turned violet in places, bright at the surface and dead beneath.',
      mid: 'There were basins where the surface glowed and the depths went silent.',
      high: 'Stories spoke of purple water and breathless depths, and no one could say where it began.'
    },
    myths: ['purple-lull', 'black-horizons'],
    regions: ['ionian_deep', 'shadow_basin'],
    signals: {
      beliefs: ['euxinia'],
      epistemics: { certainty: 0.33, witness: 'ritual' }
    }
  },
  {
    id: 'crucible_rudist_dominion',
    base: 'Rudist meadows replaced the old reefs, upright and stubborn against the surge.',
    variants: {
      low: 'Rudist meadows replaced the old reefs, upright and stubborn against the surge.',
      mid: 'Where corals waned, the shelled towers took their place.',
      high: 'Some said the reefs never fell, only changed their names.'
    },
    myths: ['rudist-dominion'],
    regions: ['apulian_rise'],
    signals: {
      beliefs: ['reef_turnover'],
      epistemics: { certainty: 0.45, witness: 'recorded' }
    }
  },
  {
    id: 'crucible_night_luminescence',
    base: 'At night the water answered movement with light, a thin blue-green alarm.',
    variants: {
      low: 'At night the water answered movement with light, a thin blue-green alarm.',
      mid: 'The surface flashed when disturbed, as if warning itself.',
      high: 'They said the sea glowed to betray what moved within it.'
    },
    myths: ['bioluminescence'],
    regions: ['tethys_throughflow'],
    signals: {
      beliefs: ['nocturnal_lure'],
      epistemics: { certainty: 0.5, witness: 'direct' }
    }
  },
  {
    id: 'crucible_frenel_thickets',
    base: 'Frenel thickets held the estuary, resinous and ready to burn.',
    variants: {
      low: 'Frenel thickets held the estuary, resinous and ready to burn.',
      mid: 'Salt-thick groves guarded the flats and burned when seasons turned.',
      high: 'Some called them mangroves, others called them a fuse.'
    },
    myths: ['frenel-thickets'],
    regions: ['frenel_thickets', 'pontide_channel'],
    signals: {
      beliefs: ['coastal_fire'],
      epistemics: { certainty: 0.46, witness: 'direct' }
    }
  },
  {
    id: 'crucible_firechain_case',
    base: 'The Firechain islands shuddered, and the reef edge brightened before it broke.',
    variants: {
      low: 'The Firechain islands shuddered, and the reef edge brightened before it broke.',
      mid: 'The islands trembled; the reef flashed; then the shore was gone.',
      high: 'Some said the islands warned no one, and the reef answered too late.'
    },
    myths: ['kohistan-firechain'],
    regions: ['kohistan_firechain'],
    signals: {
      beliefs: ['stealth_eruption'],
      epistemics: { certainty: 0.37, witness: 'direct' }
    }
  }
];
