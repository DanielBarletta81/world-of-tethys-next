export const SKY_CITY_ARCHIVE_VARIANTS = {
  id: 'sky-city_archive_variants',
  lines: [
    {
      text: 'You keep moving. That is either discipline or damage.',
      tags: { clarity: 'firm', faction: 'sky-city' }
    },
    {
      text: 'The record does not bend for survival. It only records it.',
      tags: { clarity: 'hedged', faction: 'sky-city' }
    },
    {
      text: 'I have seen worse endurance. I have seen less useful.',
      tags: { clarity: 'distant', faction: 'sky-city' }
    },
    {
      text: 'You carry fresh bruises. The City notes them and moves on.',
      tags: { clarity: 'firm', imprints: ['bruise'] }
    },
    {
      text: 'Your tracks say you returned by the low routes.',
      tags: { clarity: 'hedged', locations: ['the_weep', 'pteros_island'] }
    },
    {
      text: 'The ash is still in your seams. That makes you observable.',
      tags: { clarity: 'distant', imprints: ['ash'] }
    }
  ]
};

export const DOCKHAND_VARIANTS = {
  id: 'dockhand_variants',
  lines: [
    {
      text: 'You look like the wind taught you something it won’t repeat.',
      tags: { clarity: 'hedged', imprints: ['bruise', 'ash'] }
    },
    {
      text: 'I don’t care how you survived. I care if you slow me down.',
      tags: { clarity: 'firm', faction: 'lower-tier' }
    },
    {
      text: 'Your boots say you’ve been back through the Ledge.',
      tags: { clarity: 'distant', locations: ['the-ledge'] }
    }
  ]
};

export const MYSTIC_VARIANTS = {
  id: 'mystic_variants',
  lines: [
    {
      text: 'The ground still remembers your weight.',
      tags: { clarity: 'hedged', imprints: ['track'] }
    },
    {
      text: 'Survival is not purity. It is residue.',
      tags: { clarity: 'distant', faction: 'mystic' }
    },
    {
      text: 'You returned by paths the trees do not repeat.',
      tags: { clarity: 'hedged', locations: ['mystic-woods'] }
    }
  ]
};

export const IRONWOOD_VARIANTS = {
  id: 'ironwood_variants',
  lines: [
    {
      text: 'You keep the same pace even when you hurt. That is useful.',
      tags: { clarity: 'firm', faction: 'ironwood' }
    },
    {
      text: 'Tracks like yours don’t argue. They mark where you chose.',
      tags: { clarity: 'hedged', imprints: ['track'] }
    },
    {
      text: 'If the City didn’t stop you, don’t make me do it.',
      tags: { clarity: 'distant', locations: ['sky-city'] }
    }
  ]
};
// World of Tethys || D.C. Barletta
