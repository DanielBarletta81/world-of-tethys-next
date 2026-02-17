'use client';

import { useEffect, useState } from 'react';
import { cdn } from '@/lib/cdn';

// Simple, static pin overlays for the atlas with SVG icons
export default function MapFragments({
  fragmentsConfig,
  stillnessReady,
  cambriaActive = false,
  lockedRegions = [],
  labelIds = null,
  labelOpacity = 0.22,
  ghosted = false,
  foodWebHints = {},
  foodWebActive = false,
  foodWebAliases = {},
  analogHints = {},
  rootTunnelVisible = false,
  onTravel,
  onInspect,
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

  const rootStart = fragmentsConfig.find((f) => f.region === 'ironwoods')?.anchor;
  const rootEnd = fragmentsConfig.find((f) => f.region === 'mystic-woods')?.anchor;
  const rootPath =
    rootStart && rootEnd
      ? `M ${rootStart.x * 100} ${rootStart.y * 100} Q ${((rootStart.x + rootEnd.x) / 2) * 100} ${
          ((rootStart.y + rootEnd.y) / 2) * 100 + 3
        } ${rootEnd.x * 100} ${rootEnd.y * 100}`
      : null;

  return (
    <svg className="absolute inset-0" viewBox="0 0 100 100" role="presentation">
      {rootTunnelVisible && rootPath ? (
        <g opacity={0.7} className="pointer-events-none">
          <path
            d={rootPath}
            fill="none"
            stroke="#8a3c23"
            strokeWidth="0.7"
            strokeDasharray="2,2"
            className="animate-pulse"
          />
          <text
            x={((rootStart.x + rootEnd.x) / 2) * 100}
            y={((rootStart.y + rootEnd.y) / 2) * 100 + 6}
            fill="#8a3c23"
            fontSize="2.2"
            textAnchor="middle"
            className="font-sky uppercase tracking-[0.2em]"
          >
            Root Tunnels
          </text>
        </g>
      ) : null}
      {fragments.map((f) => {
        const isLocked = lockedRegions.includes(f.region);
        const isClickable = f.clickable !== false;
        const showPin = f.showPin !== false;
        const showLabel = !labelIds || labelIds.includes(f.id) || labelIds.includes(f.region);
        const labelX = f.labelOffset?.x ?? 7;
        const labelY = f.labelOffset?.y ?? 3;
        const baseOpacity = ghosted ? 0.55 : 1;
        const aliasKey = foodWebAliases?.[f.region];
        const foodHints = foodWebActive
          ? foodWebHints?.[f.region] || foodWebHints?.[aliasKey] || []
          : [];
        const foodHintText = foodHints.length
          ? `Food Web\\n${foodHints
              .map((hint) =>
                hint.creatureId ? `${hint.tethys} [${hint.creatureId}]` : hint.tethys
              )
              .join('\\n')}`
          : null;
        const analogList = analogHints?.[f.region] || analogHints?.[aliasKey] || [];
        const analogText = analogList.length
          ? `Analogs\\n${analogList
              .map((analog) => `${analog.tethys} → ${analog.realWorld}`)
              .join('\\n')}`
          : null;
        const tooltipText = [foodHintText, analogText].filter(Boolean).join('\\n\\n') || null;

        const handleClick = (event) => {
          if (!isClickable) return;
          if (event.shiftKey || event.altKey) {
            onInspect?.(f.region);
            return;
          }
          onTravel?.(f.region);
        };

        return (
          <g
            key={f.id}
            transform={`translate(${f.pos.x * 100} ${f.pos.y * 100})`}
            className={isClickable ? 'cursor-pointer map-fragment' : 'cursor-default'}
            onClick={handleClick}
          >
            {tooltipText ? <title>{tooltipText}</title> : null}
            {showPin && isLocked && (
              <circle r="6.5" fill="none" stroke="#64748b" strokeWidth="0.6" opacity={0.6 * baseOpacity} />
            )}
            {showPin && (
              <circle
                r="5.2"
                fill={cambriaActive ? '#7c2d12' : '#0b0a09'}
                stroke={f.fractured ? '#f97316' : '#f59e0b'}
                strokeWidth="0.6"
                opacity={(isLocked ? 0.35 : 0.85) * baseOpacity}
              />
            )}
            {showPin && f.icon ? (
              <image
                href={cdn(f.icon)}
                x="-4.5"
                y="-4.5"
                width="9"
                height="9"
                opacity={(isLocked ? 0.3 : 0.8) * baseOpacity}
              />
            ) : null}
            {f.label && showLabel ? (
              <text
                x={labelX}
                y={labelY}
                fontSize={ghosted ? '2.4' : '2.8'}
                fill="#e7e5e4"
                opacity={(isLocked ? 0.18 : labelOpacity) * baseOpacity}
                className="font-sky uppercase tracking-[0.2em]"
              >
                {f.label}
              </text>
            ) : null}
          </g>
        );
      })}
      <style jsx>{`
        .map-fragment {
          transition: transform 240ms ease, filter 240ms ease, opacity 240ms ease;
          transform-box: fill-box;
          transform-origin: center;
        }
        .map-fragment:hover {
          transform: scale(1.06);
          filter: drop-shadow(0 0 6px rgba(226, 232, 240, 0.4));
        }
      `}</style>
    </svg>
  );
}
// World of Tethys || D.C. Barletta
