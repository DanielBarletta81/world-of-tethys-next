'use client';

import CambriaClient from '@/components/CambriaClient';

const compositionLabels = [
  'Theropod Aggressors (Carnivores)',
  'Sauropod Titans (Structural)',
  'Pterosaur Scouts (Aerial)',
  'Marine Leviathans (Aquatic)',
  'Insectoid Symbiotes (Utility)'
];

const survivalLabels = [
  'Deep Sea Pressure Resistance',
  'Low Oxygen Tolerance',
  'Toxin Filtration Capacity',
  'Wound Regeneration Speed',
  'Caloric Efficiency Rate'
];

const radarLabels = [
  'Hydrodynamic Efficiency',
  'Bite Force Pressure',
  'Cognitive Problem Solving',
  'Camouflage Capability',
  'Reproductive Rate',
  'Armor Density Rating'
];

const lineLabels = [
  'Founding Era (Year 0-100)',
  'Golden Age of Splicing (100-300)',
  'The Expansion Era (300-450)',
  'The Stagnation Period (450-500)',
  'The Mutation Cascade (500-550)',
  'The Fall of Cambria (550+)'
];

function splitLabels(labels) {
  return labels.map((label) => {
    if (label.length <= 16) return label;
    const words = label.split(' ');
    const lines = [];
    let current = words[0];
    for (let i = 1; i < words.length; i += 1) {
      if (`${current} ${words[i]}`.length <= 16) {
        current += ` ${words[i]}`;
      } else {
        lines.push(current);
        current = words[i];
      }
    }
    lines.push(current);
    return lines;
  });
}

export default function CambriaPage() {
  return <CambriaClient />;
}
// World of Tethys || D.C. Barletta
