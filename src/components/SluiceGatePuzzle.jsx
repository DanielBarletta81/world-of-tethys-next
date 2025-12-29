'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTethys } from '@/context/TethysContext';

const TARGET_PATTERN = [1, 0, 1, 1];

export default function SluiceGatePuzzle({ onOpen }) {
  const { setOilLevel, harvestPressure, setHarvestPressure } = useTethys();
  const [pattern, setPattern] = useState([0, 0, 0, 0]);
  const solved = pattern.every((value, index) => value === TARGET_PATTERN[index]);

  const toggleIndex = (index) => {
    setPattern((prev) => {
      const next = [...prev];
      next[index] = next[index] ? 0 : 1;
      return next;
    });
  };

  const handleExecute = () => {
    if (solved) {
      setOilLevel((prev) => Math.min(100, prev + 5));
      setHarvestPressure((prev) => Math.max(1, prev - 1));
      onOpen?.();
    } else {
      setHarvestPressure((prev) => Math.min(10, prev + 1));
    }
  };

  return (
    <div className="bg-tethys-card border border-white/5 p-6 rounded-3xl shadow-inner space-y-4">
      <h3 className="text-sm font-semibold text-white uppercase tracking-[0.3em]">Sluice Gate Puzzle</h3>
      <p className="text-xs text-gray-400">
        Align the sluice locks (1 = open, 0 = closed). Incorrect sequences increase harvest pressure. Correct sequence vents cavitation.
      </p>

      <div className="grid grid-cols-4 gap-3">
        {pattern.map((value, idx) => (
          <button
            key={idx}
            onClick={() => toggleIndex(idx)}
            className={`rounded-2xl py-4 font-mono text-lg transition-all ${
              value
                ? 'bg-sync-violet/40 border border-sync-violet text-white'
                : 'bg-black/30 border border-white/10 text-gray-500'
            }`}
          >
            {value}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs font-mono text-gray-400">
        <span>Harvest Pressure</span>
        <motion.span
          key={harvestPressure}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className={`text-sm font-semibold ${harvestPressure > 7 ? 'text-dissonant-red' : 'text-nute-emerald'}`}
        >
          {harvestPressure}
        </motion.span>
      </div>

      <button
        onClick={handleExecute}
        className="w-full py-3 rounded-2xl font-mono text-xs uppercase tracking-[0.4em] bg-sync-violet/20 border border-sync-violet text-white hover:bg-sync-violet hover:text-white transition-all"
      >
        Execute Sequence
      </button>
    </div>
  );
}
