export const LT_SKY_CITY_TRIAL = {
  id: 'sky-city_trial',
  base: 'The platform was open to the wind, and the charge was held in procedure.',
  variants: {
    low: 'The platform was open to the wind, and the charge was held in procedure.',
    mid: 'The hearing opened with logs and thresholds, not an accusation.',
    high: 'Later accounts say the trial began with process, not truth.'
  },
  myths: ['sky-city-fall'],
  regions: ['sky-city'],
  signals: {
    beliefs: ['procedure', 'judgment'],
    institutions: ['archive', 'council'],
    epistemics: {
      certainty: 0.45,
      witness: 'indirect'
    }
  }
};

export const LT_SKY_CITY_VERDICT = {
  id: 'sky-city_verdict',
  base: 'He was deemed unsuitable, a risk without a name.',
  variants: {
    low: 'He was deemed unsuitable, a risk without a name.',
    mid: 'The outcome removed clearance and reclassified risk.',
    high: 'Some later framed the verdict as caution, others as erasure.'
  },
  myths: ['sky-city-fall'],
  regions: ['sky-city'],
  signals: {
    beliefs: ['exile', 'continuity'],
    institutions: ['archive', 'council'],
    epistemics: {
      certainty: 0.4,
      witness: 'indirect'
    }
  }
};

export const SKY_CITY_TRIAL_BLOCKS = [
  LT_SKY_CITY_TRIAL,
  LT_SKY_CITY_VERDICT
];
// World of Tethys || D.C. Barletta
