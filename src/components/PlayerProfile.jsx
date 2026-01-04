'use client';

import { useEffect, useMemo, useState } from 'react';
import { Compass, Gem, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTethys } from '@/context/TethysContext';
import { generateStaffProfile } from '@/lib/staff-utils';
import PlayerAvatar from './PlayerAvatar';
import StaffVisualizer from './StaffVisualizer';
import SeedVisualizer from './SeedVisualizer';
import StaffSequencer from './StaffSequencer';

const DEFAULT_STATS = { geology: 35, creature: 25, lore: 20, human: 10 };
const PATH_CHOICES = [
  { id: 'root-whisper', label: 'Root Whisper' },
  { id: 'bond-mystic', label: 'Bond Mystic' },
  { id: 'triumvirate', label: 'Triumvirate' }
];

const STAT_FIELDS = [
  { key: 'geology', label: 'Geothermal Read', hint: 'Mantle / stone empathy', tone: 'from-orange-800/60 to-red-700/40' },
  { key: 'creature', label: 'Biologic Bond', hint: 'Beast whisper / kith', tone: 'from-amber-700/50 to-lime-700/40' },
  { key: 'lore', label: 'Lore Index', hint: 'Archive decipher speed', tone: 'from-cyan-700/50 to-sky-700/30' },
  { key: 'human', label: 'Human Factor', hint: 'Negotiation / trade', tone: 'from-stone-700/60 to-stone-600/30' }
];

const withTotals = (next) => ({
  ...next,
  total: Math.round((next.geology + next.creature + next.lore + next.human) / 10)
});

export default function PlayerProfile() {
  const { user } = useAuth();
  const { stats: tethysStats = {}, inventory = [] } = useTethys();
  const [playerStats, setPlayerStats] = useState(withTotals(DEFAULT_STATS));
  const [path, setPath] = useState(null);
  const [staffProfile, setStaffProfile] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  const inventoryIds = useMemo(() => inventory.map((item) => item.id), [inventory]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem('tethys_player_stats');
      const storedPath = window.localStorage.getItem('tethys_path');
      if (stored) {
        const parsed = JSON.parse(stored);
        setPlayerStats(withTotals({ ...DEFAULT_STATS, ...parsed }));
      }
      if (storedPath) setPath(storedPath);
    } catch {
      setPlayerStats(withTotals(DEFAULT_STATS));
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return;
    window.localStorage.setItem('tethys_player_stats', JSON.stringify(playerStats));
  }, [playerStats, hydrated]);

  useEffect(() => {
    if (!hydrated || !path || typeof window === 'undefined') return;
    window.localStorage.setItem('tethys_path', path);
  }, [path, hydrated]);

  useEffect(() => {
    const profile = generateStaffProfile(playerStats, inventoryIds.length ? inventoryIds : ['Map_fragment']);
    setStaffProfile(profile);
  }, [playerStats, inventoryIds]);

  const updateStat = (key, value) => {
    setPlayerStats((prev) => withTotals({ ...prev, [key]: Math.max(0, Math.min(100, value)) }));
  };

  const handlePath = (next) => {
    setPath(next);
  };

  return (
    <section className="relative bg-[#0c0a09] border border-stone-800 rounded-2xl p-6 shadow-2xl overflow-hidden">
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-10 pointer-events-none" />
      <div className="absolute -left-24 top-0 w-72 h-72 bg-amber-900/10 blur-[120px] rounded-full" />
      <div className="absolute right-0 -bottom-16 w-72 h-72 bg-cyan-900/10 blur-[120px] rounded-full" />

      {/* Floating avatar / heat gauge */}
      <PlayerAvatar statsOverride={playerStats} />

      <div className="relative z-10 space-y-6">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-amber-500 font-mono">Player Profile</p>
            <h2 className="text-3xl font-serif text-white leading-tight">{user?.displayName || 'Ghost Warden'}</h2>
            <p className="text-sm text-stone-400">
              Core stats drive the staff sequencer, visualizer, and Avatar heat rank.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.2em] font-mono">
            <div className="flex items-center gap-2 px-3 py-2 bg-[#1c1917] border border-amber-700/40 rounded">
              <Gem size={14} className="text-amber-500" />
              <span>Resin {tethysStats.resin ?? 0}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-[#1c1917] border border-stone-700 rounded">
              <Compass size={14} className="text-cyan-400" />
              <span>{path ? PATH_CHOICES.find((p) => p.id === path)?.label || path : 'Path unset'}</span>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Stat tuner */}
          <div className="lg:col-span-2 bg-[#0f0b09] border border-stone-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500 font-mono">Field Readings</p>
                <p className="text-sm text-stone-400">Adjust and persist to local archives.</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-[0.3em] text-amber-400 font-mono">Heat Index</p>
                <p className="text-lg font-mono text-amber-200">{playerStats.total}</p>
              </div>
            </div>

            <div className="space-y-3">
              {STAT_FIELDS.map((field) => (
                <div key={field.key} className="rounded-lg border border-stone-800 bg-gradient-to-r from-transparent to-transparent overflow-hidden">
                  <div className="px-3 pt-3 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.25em] text-stone-400">{field.label}</p>
                      <p className="text-[11px] text-stone-500">{field.hint}</p>
                    </div>
                    <span className="text-sm font-mono text-amber-200">{playerStats[field.key]}</span>
                  </div>
                  <div className={`px-3 pb-3 pt-2 bg-gradient-to-r ${field.tone}`}>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={playerStats[field.key]}
                      onChange={(e) => updateStat(field.key, Number(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-stone-800">
              <p className="text-[10px] uppercase tracking-[0.25em] text-stone-500 mb-2">Path Alignment</p>
              <div className="flex flex-wrap gap-2">
                {PATH_CHOICES.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() => handlePath(choice.id)}
                    className={`px-3 py-2 text-[11px] rounded border transition ${
                      path === choice.id
                        ? 'border-amber-600/60 text-amber-100 bg-amber-900/30'
                        : 'border-stone-700 text-stone-300 hover:border-amber-600/40'
                    }`}
                  >
                    {choice.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Staff visual */}
          <div className="lg:col-span-3 bg-[#0f0b09] border border-stone-800 rounded-xl p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-500 font-mono">Staff DNA</p>
                <h3 className="text-2xl text-white font-serif tracking-wide">{staffProfile?.name || 'Awaiting stats'}</h3>
              </div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-cyan-300">
                <Sparkles size={14} />
                <span>{staffProfile?.rarity || 'Common'}</span>
              </div>
            </div>

            <div className="bg-[#0c0a09] border border-stone-800 rounded-lg p-4">
              {staffProfile ? (
                <StaffVisualizer staffData={staffProfile} />
              ) : (
                <div className="h-[420px] flex items-center justify-center text-xs text-stone-500 font-mono">
                  Feed stats to visualize the staff form.
                </div>
              )}
            </div>

            {staffProfile && (
              <div className="grid md:grid-cols-3 gap-3 text-sm text-stone-200">
                <div className="rounded border border-stone-800 p-3 bg-[#0c0a09]">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-stone-500 mb-1">Components</p>
                  <ul className="space-y-1 text-stone-300">
                    <li>Core: {staffProfile.components.core.label}</li>
                    <li>Binding: {staffProfile.components.wrap.label}</li>
                    <li>Apex: {staffProfile.components.apex.label}</li>
                  </ul>
                </div>
                <div className="rounded border border-stone-800 p-3 bg-[#0c0a09]">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-stone-500 mb-1">Output</p>
                  <p className="text-sm font-mono text-amber-200">Power {staffProfile.stats.power.toFixed(1)}</p>
                  <p className="text-sm font-mono text-cyan-200">Resonance {staffProfile.stats.resonance.toFixed(1)}</p>
                </div>
                <div className="rounded border border-stone-800 p-3 bg-[#0c0a09]">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-stone-500 mb-1">Perks</p>
                  <ul className="space-y-1 text-stone-300 list-disc list-inside">
                    {staffProfile.perks.map((perk, idx) => (
                      <li key={idx}>{perk}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#0f0b09] border border-stone-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500 font-mono">Sequencer</p>
              <p className="text-sm text-stone-400">Feeds from the profile stats above.</p>
            </div>
          </div>
          <StaffSequencer
            initialStats={playerStats}
            initialPath={path}
            inventoryOverride={inventoryIds}
            onProfile={setStaffProfile}
          />
          <SeedVisualizer seed={staffProfile?.seed || 'N/A'} currentScores={playerStats} />
        </div>
      </div>
    </section>
  );
}
