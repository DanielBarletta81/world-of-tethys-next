'use client';

import { useEffect, useMemo, useState } from 'react';

function pickTitle(scores = {}) {
  const lore = scores.lore || 0;
  const creature = scores.creature || 0;
  const geology = scores.geology || 0;

  if (lore + geology > 100) return { title: 'Tectonic Seer', shimmer: 'shimmer-indigo' };
  if (geology > 50) return { title: 'Rift Walker', shimmer: 'shimmer-orange' };
  if (creature > 50) return { title: 'Apex Hybrid', shimmer: 'shimmer-bone' };
  if (lore > 50) return { title: 'Chronicler of Silt', shimmer: 'shimmer-blue' };
  return { title: 'Hatchling', shimmer: '' };
}

export default function SeedVisualizer({ initialSeed, scores = {} }) {
  const [seed, setSeed] = useState(initialSeed || 'H-0000');
  const [latestScores, setLatestScores] = useState(scores);

  const { title, shimmer } = useMemo(() => pickTitle(latestScores), [latestScores]);

  useEffect(() => {
    const handler = (e) => {
      // Optionally use e.detail to pull updated scores; for now, refresh from props fallback.
      setLatestScores((prev) => ({ ...prev, ...scores }));
    };
    window.addEventListener('tethys:evolved', handler);
    return () => window.removeEventListener('tethys:evolved', handler);
  }, [scores]);

  useEffect(() => {
    if (initialSeed) setSeed(initialSeed);
  }, [initialSeed]);

  return (
    <div className={`seed-card ${shimmer}`}>
      <div className="seed-label">Genetic Signature</div>
      <div className="seed-value">{seed}</div>
      <div className="seed-title">{title}</div>
    </div>
  );
}
