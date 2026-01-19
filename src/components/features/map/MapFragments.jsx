'use client';

import { useEffect, useState } from 'react';
import { cdn } from '@/lib/cdn';

// Simple, static pin overlays for the atlas with SVG icons
export default function MapFragments({
  fragmentsConfig,
  stillnessReady,
  cambriaActive = false,
  lockedRegions = [],
  onTravel,
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
        if (lockedRegions.includes(f.region)) {
          return f;
        }
        if (cambriaActive) {
          onFracture?.(f.region);
          return { ...f, fractured: true };
        }
        onUnlock?.(f.region);
        return f;
      })
    );
  }, [stillnessReady, cambriaActive, lockedRegions, onUnlock, onFracture]);

  return (
    <svg className="absolute inset-0" viewBox="0 0 100 100" role="presentation">
      {fragments.map((f) => {
        const isLocked = lockedRegions.includes(f.region);
        const isClickable = f.clickable !== false;
        const showPin = f.showPin !== false;
        const labelX = f.labelOffset?.x ?? 7;
        const labelY = f.labelOffset?.y ?? 3;

        return (
          <g
            key={f.id}
            transform={`translate(${f.pos.x * 100} ${f.pos.y * 100})`}
            className={isClickable ? 'cursor-pointer' : 'cursor-default'}
            onClick={isClickable ? () => onTravel?.(f.region) : undefined}
          >
            {showPin && isLocked && (
              <circle r="6.5" fill="none" stroke="#64748b" strokeWidth="0.6" opacity="0.6" />
            )}
            {showPin && (
              <circle
                r="5.2"
                fill={cambriaActive ? '#7c2d12' : '#0b0a09'}
                stroke={f.fractured ? '#f97316' : '#f59e0b'}
                strokeWidth="0.6"
                opacity={isLocked ? 0.45 : 0.92}
              />
            )}
            {showPin && f.icon ? (
              <image
                href={cdn(f.icon)}
                x="-4.5"
                y="-4.5"
                width="9"
                height="9"
                opacity={isLocked ? 0.45 : 0.92}
              />
            ) : null}
            {f.label ? (
              <text
                x={labelX}
                y={labelY}
                fontSize="3.2"
                fill="#e7e5e4"
                opacity={isLocked ? 0.45 : 0.85}
                className="font-sans"
              >
                {f.label}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
// World of Tethys || D.C. Barletta
