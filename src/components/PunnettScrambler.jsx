'use client';

import { useMemo, useState, useEffect } from 'react';

// Available genes to choose from
const GENES = [
  { label: 'R (Red/White)', char: 'R' },
  { label: 'B (Brown/Blue)', char: 'B' },
  { label: 'G (Green/Yellow)', char: 'G' },
  { label: 'T (Tall/Short)', char: 'T' },
];

function buildSquare(parentA, parentB) {
  const [a1, a2] = parentA.split('');
  const [b1, b2] = parentB.split('');
  
  // Create the 2x2 grid
  const grid = [
    [`${a1}${b1}`, `${a1}${b2}`],
    [`${a2}${b1}`, `${a2}${b2}`]
  ];

  // Calculate statistics
  const counts = grid.flat().reduce((acc, combo) => {
    // Sort so that 'rR' becomes 'Rr' for counting purposes
    const sorted = combo.split('').sort().join('');
    acc[sorted] = (acc[sorted] || 0) + 1;
    return acc;
  }, {});

  return { grid, counts };
}

export default function PunnettScrambler() {
  // 1. New State for the Gene Letter (Default 'R')
  const [gene, setGene] = useState(GENES[0]);
  
  // 2. State for parents (Defaulting to Heterozygous)
  const [parentA, setParentA] = useState('Rr');
  const [parentB, setParentB] = useState('Rr');

  // 3. Dynamic Allele Options based on selected Gene
  // e.g., if Gene is 'B', returns ['BB', 'Bb', 'bB', 'bb']
  const alleleOptions = useMemo(() => {
    const D = gene.char.toUpperCase(); // Dominant
    const r = gene.char.toLowerCase(); // Recessive
    return [`${D}${D}`, `${D}${r}`, `${r}${D}`, `${r}${r}`];
  }, [gene]);

  // 4. Update parents when the Gene changes so the letters match
  // We try to preserve the genotype (Heterozygous remains Heterozygous)
  useEffect(() => {
    const updateGenotype = (currentStr) => {
      const isHomoDom = currentStr[0] === currentStr[0].toUpperCase() && currentStr[1] === currentStr[1].toUpperCase();
      const isHomoRec = currentStr[0] === currentStr[0].toLowerCase() && currentStr[1] === currentStr[1].toLowerCase();
      
      const D = gene.char.toUpperCase();
      const r = gene.char.toLowerCase();

      if (isHomoDom) return `${D}${D}`;
      if (isHomoRec) return `${r}${r}`;
      return `${D}${r}`; // Default to Heterozygous
    };

    setParentA((prev) => updateGenotype(prev));
    setParentB((prev) => updateGenotype(prev));
  }, [gene]);

  const { grid, counts } = useMemo(() => buildSquare(parentA, parentB), [parentA, parentB]);

  const scramble = () => {
    setParentA(alleleOptions[Math.floor(Math.random() * alleleOptions.length)]);
    setParentB(alleleOptions[Math.floor(Math.random() * alleleOptions.length)]);
  };

  // Helper to generate the stat keys for the bottom row (e.g., RR, Rr, rr)
  const statKeys = [
    `${gene.char.toUpperCase()}${gene.char.toUpperCase()}`,
    `${gene.char.toUpperCase()}${gene.char.toLowerCase()}`,
    `${gene.char.toLowerCase()}${gene.char.toLowerCase()}`
  ];

  return (
    <div className="punnett-card space-y-6 p-4 border rounded-lg bg-white/5 border-stone-800">
      
      {/* --- NEW: Trait Selector --- */}
      <div className="flex flex-col space-y-2">
        <label className="text-[10px] font-mono uppercase tracking-[0.4em] text-ancient-ink/60">
          Select Trait
        </label>
        <select 
          value={gene.char} 
          onChange={(e) => setGene(GENES.find(g => g.char === e.target.value))}
          className="punnett-select w-full p-2 bg-stone-900 border border-stone-700 rounded text-stone-300 font-mono"
        >
          {GENES.map((g) => (
            <option key={g.char} value={g.char}>{g.label}</option>
          ))}
        </select>
      </div>

      {/* Parent Selectors */}
      <div className="flex items-end justify-between gap-4">
        <div className="w-1/3">
          <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-ancient-ink/60 mb-1">Parent A</p>
          <select 
            value={parentA} 
            onChange={(e) => setParentA(e.target.value)} 
            className="punnett-select w-full p-2 bg-stone-900 border border-stone-700 rounded text-stone-300 font-mono"
          >
            {alleleOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        
        <div className="w-1/3">
          <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-ancient-ink/60 mb-1">Parent B</p>
          <select 
            value={parentB} 
            onChange={(e) => setParentB(e.target.value)} 
            className="punnett-select w-full p-2 bg-stone-900 border border-stone-700 rounded text-stone-300 font-mono"
          >
            {alleleOptions.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <button 
          type="button" 
          onClick={scramble} 
          className="punnett-button px-4 py-2 h-[42px] bg-amber-600/20 hover:bg-amber-600/40 text-amber-500 border border-amber-600/50 rounded uppercase text-xs tracking-widest transition-colors"
        >
          Random
        </button>
      </div>

      {/* The Grid */}
      <div className="punnett-grid grid grid-cols-[30px_1fr_1fr] gap-1 text-center font-serif text-lg">
        {/* Top Header Row */}
        <div className="punnett-cell head opacity-0"></div>
        <div className="punnett-cell head font-bold text-stone-500">{parentB[0]}</div>
        <div className="punnett-cell head font-bold text-stone-500">{parentB[1]}</div>

        {/* Middle Row */}
        <div className="punnett-cell head font-bold text-stone-500 flex items-center justify-center">{parentA[0]}</div>
        <div className="punnett-cell bg-stone-800/50 p-4 border border-stone-700 rounded text-stone-200">
          {grid[0][0]}
        </div>
        <div className="punnett-cell bg-stone-800/50 p-4 border border-stone-700 rounded text-stone-200">
          {grid[0][1]}
        </div>

        {/* Bottom Row */}
        <div className="punnett-cell head font-bold text-stone-500 flex items-center justify-center">{parentA[1]}</div>
        <div className="punnett-cell bg-stone-800/50 p-4 border border-stone-700 rounded text-stone-200">
          {grid[1][0]}
        </div>
        <div className="punnett-cell bg-stone-800/50 p-4 border border-stone-700 rounded text-stone-200">
          {grid[1][1]}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-mono uppercase tracking-[0.2em] pt-2 border-t border-stone-800/50">
        {statKeys.map((key) => (
          <div key={key} className="punnett-stat flex flex-col">
            <span className="text-stone-500">{key}</span>
            <strong className="text-amber-500 text-lg">{((counts[key] || 0) / 4) * 100}%</strong>
          </div>
        ))}
      </div>
    </div>
  );
}