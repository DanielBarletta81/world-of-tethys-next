'use client';

import { useEffect, useState } from 'react';

// Simple, static pin overlays for the atlas with SVG icons
export default function MapFragments({
  fragmentsConfig,
  stillnessReady,
  cambriaActive = false,
  onUnlock,
  onFracture
}) {
  const [fragments, setFragments] = useState(
    fragmentsConfig.map((f) => ({
      ...f,
      pos: f.anchor,
      snapped: true,
      fractured: false
    }))
  );

  // When the mist clears (stillness), trigger unlock/fracture callbacks once.
  useEffect(() => {
    if (!stillnessReady) return;
    setFragments((fs) =>
      fs.map((f) => {
        if (f.fractured) return f;
        if (cambriaActive) {
          onFracture?.(f.region);
          return { ...f, fractured: true };
        }
        onUnlock?.(f.region);
        return f;
      })
    );
  }, [stillnessReady, cambriaActive, onUnlock, onFracture]);

  return (
    <svg className="absolute inset-0" viewBox="0 0 100 100" role="presentation">
      {fragments.map((f) => (
        <g key={f.id} transform={`translate(${f.pos.x * 100} ${f.pos.y * 100})`}>
          <circle
            r="5.2"
            fill={cambriaActive ? '#7c2d12' : '#0b0a09'}
            stroke={f.fractured ? '#f97316' : '#f59e0b'}
            strokeWidth="0.6"
            opacity="0.92"
          />
          <image
            href={f.icon || '/img/icons/pteros_island.svg'}
            x="-4.5"
            y="-4.5"
            width="9"
            height="9"
            opacity="0.92"
          />
          <text
            x="7"
            y="3"
            fontSize="3.2"
            fill="#e7e5e4"
            opacity="0.85"
            className="font-sans"
          >
            {f.label || f.id}
          </text>
        </g>
      ))}
    </svg>
  );
}
