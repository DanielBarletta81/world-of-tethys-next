'use client';

import { useMemo, useSyncExternalStore } from 'react';
import { getRumorLog, subscribeRumorLog } from '@/lib/rumorLog';

function factionColor(faction) {
  return {
    'sky-city': '#7dd3fc',
    'lower-tier': '#fbbf24',
    mystic: '#a78bfa',
    ironwood: '#22c55e',
    thal: '#f87171'
  }[faction] || '#888';
}

export default function RumorGraph({ npcs = [] }) {
  const log = useSyncExternalStore(
    subscribeRumorLog,
    () => getRumorLog(),
    () => []
  );

  const nodes = useMemo(
    () =>
      npcs.map((npc, index) => ({
        ...npc,
        x: 100 + (index % 5) * 140,
        y: 100 + Math.floor(index / 5) * 120
      })),
    [npcs]
  );

  const nodeById = useMemo(
    () => Object.fromEntries(nodes.map((node) => [node.id, node])),
    [nodes]
  );

  return (
    <svg
      width="100%"
      height="600"
      className="bg-black/70 border border-white/10 rounded-lg"
    >
      {log.map((rumor, index) => {
        const from = nodeById[rumor.from];
        const to = nodeById[rumor.to];
        if (!from || !to) return null;

        const confidence = rumor.confidence ?? 0;

        return (
          <line
            key={`${rumor.from}-${rumor.to}-${index}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke={factionColor(rumor.faction)}
            strokeWidth={Math.max(1, confidence * 4)}
            opacity={0.4 + confidence * 0.6}
          />
        );
      })}

      {nodes.map((node) => (
        <g key={node.id}>
          <circle
            cx={node.x}
            cy={node.y}
            r={18}
            fill={factionColor(node.faction)}
            opacity={0.6}
          />
          <text
            x={node.x}
            y={node.y + 32}
            fill="#aaa"
            fontSize="10"
            textAnchor="middle"
          >
            {node.name}
          </text>
        </g>
      ))}
    </svg>
  );
}
// World of Tethys || D.C. Barletta
