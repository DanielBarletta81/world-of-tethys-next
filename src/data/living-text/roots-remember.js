export const LT_WRONG_KIND_OF_SMOKE = {
  id: 'wrong_kind_of_smoke',
  base: 'The smoke did not carry the clean burn of pine or campfire.',
  variants: {
    low: 'The smoke did not carry the clean burn of pine or campfire.',
    mid: 'The smoke was noted as unlike pine or campfire, thin and metallic.',
    high: 'Later accounts describe the smoke as unlike any natural fire.'
  },
  myths: ['sky-city-fall'],
  regions: ['mystic-woods', 'sky-city'],
  signals: {
    beliefs: ['industrial_contamination'],
    institutions: ['sky-city'],
    epistemics: {
      certainty: 0.55,
      witness: 'direct'
    }
  }
};

export const LT_WATCHER_COUGH = {
  id: 'watcher_cough',
  base: 'Watcher had been coughing again.',
  variants: {
    low: 'Watcher had been coughing again.',
    mid: 'Some said Watcher had been disturbed again.',
    high: 'It was later claimed the mountain reacted to the City’s actions.'
  },
  myths: ['watcher-origin'],
  regions: ['watcher-mountain', 'sky-city', 'mystic-woods'],
  signals: {
    beliefs: ['mountain_agency'],
    epistemics: {
      certainty: 0.4,
      witness: 'ritual'
    }
  }
};

export const LT_STRYKER_WOUNDED = {
  id: 'stryker_wounded',
  base: 'Someone had pushed the creature too close to heat and wind.',
  variants: {
    low: 'Someone had pushed the creature too close to heat and wind.',
    mid: 'It appeared the creature had been exposed to heat and wind prematurely.',
    high: 'Responsibility for the injuries was never clearly assigned.'
  },
  myths: ['sky-city-fall'],
  regions: ['sky-city', 'mystic-woods'],
  signals: {
    beliefs: ['reckless_engineering'],
    institutions: ['sky-city'],
    epistemics: {
      certainty: 0.35,
      witness: 'direct'
    }
  }
};

export const LT_BOND_THREAD_ALIVE = {
  id: 'bond_thread_alive',
  base: 'The line between them was thin, not cut.',
  variants: {
    low: 'The line between them was thin, not cut.',
    mid: 'The bond was believed to be strained but intact.',
    high: 'Some claimed the bond persisted, though no proof remained.'
  },
  myths: ['bond-origin'],
  regions: ['mystic-woods'],
  signals: {
    beliefs: ['bond_persistence'],
    epistemics: {
      certainty: 0.3,
      witness: 'ritual'
    }
  }
};

export const LT_SCARS_MAPS = {
  id: 'scars_make_maps',
  base: 'Scars were useful. They made maps.',
  variants: {
    low: 'Scars were useful. They made maps.',
    mid: 'Scars were said to mark where survival learned its lessons.',
    high: 'Some later treated scars as warnings rather than guides.'
  },
  myths: ['survival-doctrine'],
  regions: ['mystic-woods', 'ironwoods'],
  signals: {
    beliefs: ['adaptive_scarring'],
    epistemics: {
      certainty: 0.6,
      witness: 'direct'
    }
  }
};

export const ROOTS_REMEMBER_BLOCKS = [
  LT_WRONG_KIND_OF_SMOKE,
  LT_WATCHER_COUGH,
  LT_STRYKER_WOUNDED,
  LT_BOND_THREAD_ALIVE,
  LT_SCARS_MAPS
];
// World of Tethys || D.C. Barletta
