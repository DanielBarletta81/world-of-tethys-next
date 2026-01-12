export const BOOK1_BLOCKS = [
  {
    id: 'sky_city_trial',
    base: 'The platform was open to the wind, and the charge was held in procedure.',
    variants: {
      low: 'The platform was open to the wind, and the charge was held in procedure.',
      mid: 'The hearing opened with logs and thresholds, not an accusation.',
      high: 'Later accounts say the trial began with process, not truth.'
    },
    myths: ['sky-city-fall'],
    regions: ['sky_city'],
    signals: {
      beliefs: ['procedure', 'judgment'],
      institutions: ['archive', 'council'],
      epistemics: { certainty: 0.45, witness: 'indirect' }
    }
  },
  {
    id: 'sky_city_verdict',
    base: 'He was deemed unsuitable, a risk without a name.',
    variants: {
      low: 'He was deemed unsuitable, a risk without a name.',
      mid: 'The outcome removed clearance and reclassified risk.',
      high: 'Some later framed the verdict as caution, others as erasure.'
    },
    myths: ['sky-city-fall'],
    regions: ['sky_city'],
    signals: {
      beliefs: ['exile', 'continuity'],
      institutions: ['archive', 'council'],
      epistemics: { certainty: 0.4, witness: 'indirect' }
    }
  },
  {
    id: 'b1_ch1_sky_city_before_01',
    base: '',
    variants: { low: '', mid: '', high: '' },
    myths: ['sky-city-fall'],
    regions: ['sky_city'],
    signals: {
      beliefs: ['order', 'authority'],
      institutions: ['archive', 'council'],
      epistemics: { certainty: 0.55, witness: 'indirect' }
    }
  },
  {
    id: 'b1_ch1_sky_city_before_02',
    base: '',
    variants: { low: '', mid: '', high: '' },
    myths: ['sky-city-fall'],
    regions: ['sky_city'],
    signals: {
      beliefs: ['stability', 'record'],
      institutions: ['archive'],
      epistemics: { certainty: 0.5, witness: 'indirect' }
    }
  },
  {
    id: 'b1_ch2_public_judgement_01',
    base: '',
    variants: { low: '', mid: '', high: '' },
    myths: ['sky-city-fall'],
    regions: ['sky_city'],
    signals: {
      beliefs: ['collective', 'verdict'],
      institutions: ['council'],
      epistemics: { certainty: 0.45, witness: 'indirect' }
    }
  },
  {
    id: 'b1_ch2_public_judgement_02',
    base: '',
    variants: { low: '', mid: '', high: '' },
    myths: ['sky-city-fall'],
    regions: ['sky_city'],
    signals: {
      beliefs: ['crowd', 'blame'],
      institutions: ['council'],
      epistemics: { certainty: 0.4, witness: 'indirect' }
    }
  },
  {
    id: 'b1_ch3_listener_ritual_01',
    base: '',
    variants: { low: '', mid: '', high: '' },
    myths: ['watcher-origin'],
    regions: ['sky_city'],
    signals: {
      beliefs: ['ritual', 'signal'],
      institutions: ['archive'],
      epistemics: { certainty: 0.42, witness: 'ritual' }
    }
  },
  {
    id: 'b1_ch3_listener_ritual_02',
    base: '',
    variants: { low: '', mid: '', high: '' },
    myths: ['watcher-origin'],
    regions: ['sky_city'],
    signals: {
      beliefs: ['omen', 'pattern'],
      institutions: ['archive'],
      epistemics: { certainty: 0.38, witness: 'ritual' }
    }
  },
  {
    id: 'b1_ch4_fall_failure_01',
    base: '',
    variants: { low: '', mid: '', high: '' },
    myths: ['sky-city-fall', 'watcher-origin'],
    regions: ['sky_city', 'cambria_ruins'],
    signals: {
      beliefs: ['irreversible', 'loss'],
      institutions: ['archive', 'council'],
      epistemics: { certainty: 0.35, witness: 'indirect' }
    }
  },
  {
    id: 'b1_ch4_fall_failure_02',
    base: '',
    variants: { low: '', mid: '', high: '' },
    myths: ['sky-city-fall'],
    regions: ['sky_city'],
    signals: {
      beliefs: ['cause', 'fault'],
      institutions: ['archive'],
      epistemics: { certainty: 0.33, witness: 'indirect' }
    }
  },
  {
    id: 'b1_ch5_aftermath_01',
    base: '',
    variants: { low: '', mid: '', high: '' },
    myths: ['sky-city-fall'],
    regions: ['sky_city', 'cambria_ruins'],
    signals: {
      beliefs: ['fragmentation', 'recovery'],
      institutions: ['archive'],
      epistemics: { certainty: 0.4, witness: 'indirect' }
    }
  },
  {
    id: 'b1_ch5_aftermath_02',
    base: '',
    variants: { low: '', mid: '', high: '' },
    myths: ['sky-city-fall'],
    regions: ['cambria_ruins'],
    signals: {
      beliefs: ['scarcity', 'survival'],
      institutions: ['archive'],
      epistemics: { certainty: 0.36, witness: 'indirect' }
    }
  },
  {
    id: 'b1_ch6_exile_separation_01',
    base: '',
    variants: { low: '', mid: '', high: '' },
    myths: ['sky-city-fall'],
    regions: ['sky_city', 'cambria_ruins'],
    signals: {
      beliefs: ['division', 'clarification'],
      institutions: ['archive'],
      epistemics: { certainty: 0.42, witness: 'indirect' }
    }
  },
  {
    id: 'b1_ch6_exile_separation_02',
    base: '',
    variants: { low: '', mid: '', high: '' },
    myths: ['sky-city-fall'],
    regions: ['cambria_ruins'],
    signals: {
      beliefs: ['departure', 'silence'],
      institutions: ['archive'],
      epistemics: { certainty: 0.37, witness: 'indirect' }
    }
  },
  {
    id: 'b1_ch7_cambria_fracture_01',
    base: '',
    variants: { low: '', mid: '', high: '' },
    myths: ['watcher-origin'],
    regions: ['cambria_ruins'],
    signals: {
      beliefs: ['fracture', 'echo'],
      institutions: ['archive'],
      epistemics: { certainty: 0.32, witness: 'ritual' }
    }
  },
  {
    id: 'b1_ch7_cambria_fracture_02',
    base: '',
    variants: { low: '', mid: '', high: '' },
    myths: ['watcher-origin'],
    regions: ['cambria_ruins'],
    signals: {
      beliefs: ['instability', 'memory'],
      institutions: ['archive'],
      epistemics: { certainty: 0.3, witness: 'ritual' }
    }
  },
  {
    id: 'b1_final_what_remains_01',
    base: '',
    variants: { low: '', mid: '', high: '' },
    myths: ['sky-city-fall', 'watcher-origin'],
    regions: ['cambria_ruins', 'sky_city'],
    signals: {
      beliefs: ['remnant', 'longing'],
      institutions: ['archive'],
      epistemics: { certainty: 0.4, witness: 'indirect' }
    }
  },
  {
    id: 'b1_final_what_remains_02',
    base: '',
    variants: { low: '', mid: '', high: '' },
    myths: ['sky-city-fall'],
    regions: ['cambria_ruins'],
    signals: {
      beliefs: ['silence', 'continuance'],
      institutions: ['archive'],
      epistemics: { certainty: 0.38, witness: 'indirect' }
    }
  },
  {
    id: 'jairo_verification_order',
    base: 'They called it verification.',
    variants: {
      low: 'They called it verification.',
      mid: 'The order was framed as verification.',
      high: 'Some later said it was never about verification at all.'
    },
    myths: ['city-omission'],
    regions: ['lower-tiers', 'weep-outflow'],
    signals: {
      beliefs: ['procedural_obedience'],
      institutions: ['sky-city'],
      epistemics: { certainty: 0.45, witness: 'indirect' }
    }
  },
  {
    id: 'two_sets_of_tracks',
    base: 'He found two sets of tracks, one booted, one bare.',
    variants: {
      low: 'He found two sets of tracks, one booted, one bare.',
      mid: 'Tracks suggested more than one person, one of them unshod.',
      high: 'Some said there were tracks that did not belong to any soldier.'
    },
    myths: ['hidden-survivors'],
    regions: ['weep-outflow', 'marsh-edge'],
    signals: {
      beliefs: ['presence_of_others'],
      epistemics: { certainty: 0.4, witness: 'direct' }
    }
  },
  {
    id: 'no_body_found',
    base: 'There was no body.',
    variants: {
      low: 'There was no body.',
      mid: 'No remains were recovered.',
      high: 'It was said the river kept what it wanted.'
    },
    myths: ['weep-omens'],
    regions: ['weep-outflow'],
    signals: {
      beliefs: ['river_claims'],
      institutions: ['sky-city'],
      epistemics: { certainty: 0.35, witness: 'direct' }
    }
  },
  {
    id: 'ground_raptor_ambush',
    base: 'A small ground raptor struck low and fast.',
    variants: {
      low: 'A small ground raptor struck low and fast.',
      mid: 'Something low-winged cut in from the rock line.',
      high: 'Some later claimed it was a warning, not a hunt.'
    },
    myths: ['wild-omens'],
    regions: ['marsh-edge', 'lower-reefs'],
    signals: {
      beliefs: ['wild-hostility'],
      epistemics: { certainty: 0.5, witness: 'direct' }
    }
  },
  {
    id: 'kel_finds_jairo',
    base: 'A Silurian boy found him and dressed the wound.',
    variants: {
      low: 'A Silurian boy found him and dressed the wound.',
      mid: 'A quiet boy in ash-stained cloth helped him hide.',
      high: 'Some said he was found by someone who should not have been there.'
    },
    myths: ['silurian-threads'],
    regions: ['marsh-edge', 'silurian-fringe'],
    signals: {
      beliefs: ['hidden-allies'],
      epistemics: { certainty: 0.45, witness: 'direct' }
    }
  },
  {
    id: 'silence_decision',
    base: 'He decided what to report by saying less.',
    variants: {
      low: 'He decided what to report by saying less.',
      mid: 'What he omitted would shape what came next.',
      high: 'Some believed the report became the first lie.'
    },
    myths: ['archive-omission'],
    regions: ['sky-city', 'lower-tiers'],
    signals: {
      beliefs: ['silence_as_choice'],
      institutions: ['sky-city'],
      epistemics: { certainty: 0.3, witness: 'indirect' }
    }
  }
];

export const BOOK1_CHAPTERS = {
  ch1: [
    'b1_ch1_sky_city_before_01',
    'b1_ch1_sky_city_before_02'
  ],
  ch2: [
    'sky_city_trial',
    'sky_city_verdict',
    'b1_ch2_public_judgement_01',
    'b1_ch2_public_judgement_02'
  ],
  ch3: [
    'b1_ch3_listener_ritual_01',
    'b1_ch3_listener_ritual_02'
  ],
  ch4: [
    'b1_ch4_fall_failure_01',
    'b1_ch4_fall_failure_02'
  ],
  ch5: [
    'b1_ch5_aftermath_01',
    'b1_ch5_aftermath_02',
    'jairo_verification_order',
    'two_sets_of_tracks',
    'no_body_found',
    'ground_raptor_ambush',
    'kel_finds_jairo',
    'silence_decision'
  ],
  ch6: [
    'b1_ch6_exile_separation_01',
    'b1_ch6_exile_separation_02'
  ],
  ch7: [
    'b1_ch7_cambria_fracture_01',
    'b1_ch7_cambria_fracture_02'
  ],
  final: [
    'b1_final_what_remains_01',
    'b1_final_what_remains_02'
  ]
};

export function getBook1ChapterBlocks(chapterId) {
  const ids = BOOK1_CHAPTERS[chapterId] ?? [];
  if (!ids.length) return [];
  const byId = Object.fromEntries(BOOK1_BLOCKS.map((block) => [block.id, block]));
  return ids.map((id) => byId[id]).filter(Boolean);
}
// World of Tethys || D.C. Barletta
