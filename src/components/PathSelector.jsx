'use client';

import { useEffect, useMemo, useState } from 'react';

const PATHS = {
  root: {
    id: 'root-whisper',
    label: 'Root Whisper Path',
    desc: 'Creature-forward. You hear the biomes and follow evolutionary clues.',
    flavor: 'Igzier’s exile line; Shadehounds and Stryker answer you.'
  },
  mystic: {
    id: 'bond-mystic',
    label: 'Bond Mystic Path',
    desc: 'Spiritual bond-keeper. You mediate between Kith, beasts, and lore.',
    flavor: 'Walk with Ravel; read roots and glow-tides for meaning.'
  },
  tri: {
    id: 'triumvirate',
    label: 'Triumvirate Path',
    desc: 'Political tactician. You navigate Sky City power and alliances.',
    flavor: 'Play the ledgers; bargain with Cohab Code and the Weep.'
  }
};

const QUIZ_CHOICES = {
  terrain: [
    { value: 'swamp', label: 'Swamp/Fen' },
    { value: 'peak', label: 'High Peaks' },
    { value: 'city', label: 'Sky City' }
  ],
  motive: [
    { value: 'evolution', label: 'Track evolution' },
    { value: 'spirit', label: 'Channel spirits' },
    { value: 'power', label: 'Move the senate' }
  ],
  ally: [
    { value: 'beast', label: 'Beast allies' },
    { value: 'kith', label: 'Kith/mystics' },
    { value: 'council', label: 'Councils/guard' }
  ]
};

export default function PathSelector({ onPathChange }) {
  const [path, setPath] = useState(null);
  const [quizMode, setQuizMode] = useState(false);
  const [answers, setAnswers] = useState({ terrain: '', motive: '', ally: '' });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem('tethys_path');
      if (stored) setPath(stored);
    } catch {
      // ignore
    }
  }, []);

  const persistPath = (next) => {
    setPath(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('tethys_path', next);
    }
    onPathChange?.(next);
  };

  const pickRandom = () => {
    const keys = Object.keys(PATHS);
    const pick = keys[Math.floor(Math.random() * keys.length)];
    persistPath(PATHS[pick].id);
  };

  const evaluateQuiz = () => {
    const { terrain, motive, ally } = answers;
    const score = { root: 0, mystic: 0, tri: 0 };

    if (terrain === 'swamp' || terrain === 'peak') score.root += 1;
    if (terrain === 'city') score.tri += 1;

    if (motive === 'evolution') score.root += 1;
    if (motive === 'spirit') score.mystic += 1;
    if (motive === 'power') score.tri += 1;

    if (ally === 'beast') score.root += 1;
    if (ally === 'kith') score.mystic += 1;
    if (ally === 'council') score.tri += 1;

    const best = Object.entries(score).sort((a, b) => b[1] - a[1])[0][0];
    persistPath(PATHS[best].id);
  };

  const currentPath = useMemo(() => Object.values(PATHS).find((p) => p.id === path), [path]);

  return (
    <section className="relative py-16 border-t border-stone-800 bg-[#0c0a09]">
      <div className="max-w-6xl mx-auto px-6 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-amber-500 font-mono">Choose Your Path</p>
            <h2 className="text-3xl font-header text-stone-100">Guild Alignment</h2>
            <p className="text-stone-400 text-sm">
              Creature, Mystic, or Triumvirate? Pick now, roll random, or take a 3-step quiz.
            </p>
            {currentPath && (
              <p className="text-xs text-amber-300 mt-2">
                Current: {currentPath.label}
              </p>
            )}
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={pickRandom}
              className="px-4 py-2 text-xs uppercase tracking-[0.2em] bg-[#1a120e] border border-amber-600/50 text-amber-200 rounded hover:border-amber-400"
            >
              Random Path
            </button>
            <button
              onClick={() => setQuizMode((v) => !v)}
              className="px-4 py-2 text-xs uppercase tracking-[0.2em] bg-[#1a120e] border border-stone-700 text-stone-200 rounded hover:border-amber-400"
            >
              {quizMode ? 'Close Quiz' : 'Take Quiz'}
            </button>
          </div>
        </div>

        {/* Direct picks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.values(PATHS).map((p) => (
            <button
              key={p.id}
              onClick={() => persistPath(p.id)}
              className={`text-left rounded-2xl border p-4 transition-all ${
                path === p.id
                  ? 'border-amber-500/70 bg-[#1a120e] shadow-[0_0_25px_rgba(255,120,60,0.2)]'
                  : 'border-stone-800 bg-[#0f0b09] hover:border-amber-500/50'
              }`}
            >
              <p className="text-[10px] uppercase tracking-[0.3em] text-amber-400 font-mono">{p.label}</p>
              <p className="text-sm text-stone-300 mt-2">{p.desc}</p>
              {p.flavor && <p className="text-[11px] text-amber-300/80 mt-2 font-mono">{p.flavor}</p>}
            </button>
          ))}
        </div>

        {/* Quiz */}
        {quizMode && (
          <div className="rounded-2xl border border-stone-800 bg-[#0f0b09] p-4 space-y-3">
            <p className="text-xs text-stone-400">Answer 3 quick questions to set your path.</p>
            {Object.entries(QUIZ_CHOICES).map(([key, options]) => (
              <div key={key} className="space-y-1">
                <p className="text-[10px] uppercase tracking-[0.3em] text-amber-400 font-mono">{key}</p>
                <div className="flex flex-wrap gap-2">
                  {options.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setAnswers((prev) => ({ ...prev, [key]: opt.value }))}
                      className={`px-3 py-2 text-xs rounded border transition ${
                        answers[key] === opt.value
                          ? 'border-amber-500/70 text-amber-200 bg-[#1a120e]'
                          : 'border-stone-700 text-stone-300 bg-[#0c0a09]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <button
              onClick={evaluateQuiz}
              className="px-4 py-2 text-xs uppercase tracking-[0.2em] bg-amber-600 text-[#0c0a09] rounded shadow-[0_0_20px_rgba(255,120,60,0.3)] hover:bg-amber-500"
            >
              Set My Path
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
