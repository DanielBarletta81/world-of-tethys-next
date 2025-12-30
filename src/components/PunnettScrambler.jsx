'use client';

import { useMemo, useState } from 'react';

const alleleOptions = ['RR', 'Rr', 'rR', 'rr'];

function buildSquare(parentA, parentB) {
  const [a1, a2] = parentA.split('');
  const [b1, b2] = parentB.split('');
  const grid = [
    [`${a1}${b1}`, `${a1}${b2}`],
    [`${a2}${b1}`, `${a2}${b2}`]
  ];

  const counts = grid.flat().reduce((acc, combo) => {
    const sorted = combo.split('').sort().join('');
    acc[sorted] = (acc[sorted] || 0) + 1;
    return acc;
  }, {});

  return { grid, counts };
}

export default function PunnettScrambler() {
  const [parentA, setParentA] = useState('Rr');
  const [parentB, setParentB] = useState('Rr');

  const { grid, counts } = useMemo(() => buildSquare(parentA, parentB), [parentA, parentB]);

  const scramble = () => {
    setParentA(alleleOptions[Math.floor(Math.random() * alleleOptions.length)]);
    setParentB(alleleOptions[Math.floor(Math.random() * alleleOptions.length)]);
  };

  return (
    <div className="punnett-card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-ancient-ink/60">Parent Strand A</p>
          <select value={parentA} onChange={(e) => setParentA(e.target.value)} className="punnett-select">
            {alleleOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-ancient-ink/60">Parent Strand B</p>
          <select value={parentB} onChange={(e) => setParentB(e.target.value)} className="punnett-select">
            {alleleOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <button type="button" onClick={scramble} className="punnett-button">
          Scramble
        </button>
      </div>

      <div className="punnett-grid">
        <div className="punnett-cell head" />
        <div className="punnett-cell head">{parentB[0]}</div>
        <div className="punnett-cell head">{parentB[1]}</div>
        <div className="punnett-cell head">{parentA[0]}</div>
        <div className="punnett-cell">
          {grid[0][0]}
        </div>
        <div className="punnett-cell">
          {grid[0][1]}
        </div>
        <div className="punnett-cell head">{parentA[1]}</div>
        <div className="punnett-cell">
          {grid[1][0]}
        </div>
        <div className="punnett-cell">
          {grid[1][1]}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-mono uppercase tracking-[0.2em]">
        {['RR', 'Rr', 'rr'].map((key) => (
          <div key={key} className="punnett-stat">
            <span>{key}</span>
            <strong>{((counts[key] || 0) / 4) * 100}%</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
