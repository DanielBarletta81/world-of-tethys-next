export const STORY_MANIFEST = {
  'the-sinking-sluice': {
    id: 'LOG-041',
    slug: 'the-sinking-sluice',
    date: '111.4 MYA',
    title: 'The Sinking Sluice',
    tldr: 'Karys attempts to bypass the Cohab Code using unauthorized pressure valves.',
    context: {
      region: 'Sky City - Lower Tiers',
      startDepth: -200,
      characterPair: 'Karys / Igzier'
    },
    rewards: { lore: 15, resin: 5 },
    content: [
      {
        html:
          '<p>The valve wheel was cold enough to burn. Karys adjusted her grip, feeling the vibration of the city\'s throat beneath her boots.</p>',
        meta: { depth: -210, pressure: 'Stable', location: 'Valve Access 4' }
      },
      {
        html:
          '<p>Steam hissed from the joint. Not a leak—a warning. She kept turning.</p>',
        marginNote: 'Standard safety protocols override manual torque at 80%.',
        meta: { depth: -210, pressure: 'Rising', location: 'Valve Access 4' }
      },
      {
        html:
          '<p>The floor dropped away. Gravity shifted as the sluice opened, pulling the canal—and her—into the dark.</p>',
        meta: { depth: -450, pressure: 'Critical', location: 'Freefall' }
      }
    ]
  },
  'roots-remember': {
    id: 'LOG-042',
    slug: 'roots-remember',
    title: 'What The Roots Remember',
    date: '111.4 MYA',
    tldr: 'Ravel listens to the fungal network and hears a history that contradicts the Archive.',
    context: {
      region: 'Mystic Woods',
      startDepth: 0,
      characterPair: 'Ravel / Kith'
    },
    rewards: { lore: 25, resin: 10 },
    content: []
  }
};
