'use client';

import SideStoryLayout from '@/components/stories/SideStoryLayout';

const storyData = {
  id: 'LOG-041',
  date: '111.4 MYA',
  title: 'The Sinking Sluice',
  tldr: 'Karys attempts to bypass the Cohab Code using unauthorized pressure valves.',
  context: {
    region: 'Sky City - Lower Tiers',
    startDepth: -200,
    characterPair: 'Karys / Igzier'
  },
  content: [
    {
      html: '<p>The valve wheel was cold enough to burn. Karys adjusted her grip...</p>',
      meta: { depth: -210, pressure: 'Stable', location: 'Valve Access 4' }
    },
    {
      html: '<p>Steam hissed from the joint. Not a leak—a warning. She kept turning.</p>',
      marginNote: 'Standard safety protocols override manual torque at 80%.',
      meta: { depth: -210, pressure: 'Rising', location: 'Valve Access 4' }
    },
    {
      html: '<p>The floor dropped away. Gravity shifted as the sluice opened...</p>',
      meta: { depth: -450, pressure: 'Critical', location: 'Freefall' }
    }
  ]
};

export default function TheWeepStoryPage() {
  return <SideStoryLayout story={storyData} />;
}
