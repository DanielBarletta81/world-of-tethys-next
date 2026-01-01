'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { getAmazonBookUrl } from '@/lib/links';
import { useExpedition } from '@/lib/useExpedition';

const basePairs = [
  { name: 'Igzier', partner: 'Karys', faction: 'Sky City', vibe: 'Heat + Resolve', img: '/images/bond-igz-karys.jpg' },
  { name: 'Rosa-Lyn', partner: 'Echo Orchid', faction: 'Kith Network', vibe: 'Resonance + Faith', img: '/images/bond-rosa-orchid.jpg' },
  { name: 'Melden', partner: 'Striped Bass', faction: 'Hydro Guild', vibe: 'Logic + Flow', img: '/images/bond-melden-bass.jpg' },
  { name: 'A-Lan', partner: 'Spiny Stickleback', faction: 'Hydro Guild', vibe: 'Homing + Sediment Scent (Pawcatuck / Pawtuxet analog)', img: '/images/bond-alan-stickleback.jpg' },
  { name: 'Phlyp III', partner: 'River Herring', faction: 'Hydro Guild', vibe: 'Estuary Echo + Scent Navigation', img: '/images/bond-phlyp-herring.jpg' }
];

const hybridPairs = [
  { name: 'Igzier', partner: 'Bone-Rookery Wyvern', faction: 'Empire Edge', vibe: 'Loyalty + Fury', img: '/images/bond-igz-wyvern.jpg' },
  { name: 'Karys', partner: 'Glass Choir Seraph', faction: 'Sky Court', vibe: 'Piety + Ambition', img: '/images/bond-karys-seraph.jpg' },
  { name: 'Ravel', partner: 'Mycelial Leviathan', faction: 'Deep Archive', vibe: 'Memory + Hunger', img: '/images/bond-ravel-leviathan.jpg' },
  { name: 'Pteroswift', partner: 'Love Bond Relay', faction: 'Sky Relay', vibe: 'Peregrine Dive + Hybrid Torque (unreliable unless bond is red-hot)', img: '/images/bond-pteroswift.jpg' }
];

export default function BondForge() {
  const { sessionTime, inventory } = useExpedition();
  const amazonUrl = getAmazonBookUrl();
  const [illuminated, setIlluminated] = useState(false);
  const [bond, setBond] = useState(null);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('tethys_illuminated') : null;
    if (saved) setIlluminated(saved === 'true');
  }, []);

  useEffect(() => {
    if (illuminated && typeof window !== 'undefined') {
      localStorage.setItem('tethys_illuminated', 'true');
    }
  }, [illuminated]);

  const tier = useMemo(() => {
    if (illuminated || sessionTime >= 900 || inventory.includes('ArchitectKey')) return 'hybrid';
    return 'base';
  }, [illuminated, sessionTime, inventory]);

  const pool = tier === 'hybrid' ? [...basePairs, ...hybridPairs] : basePairs;

  const forge = () => {
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setBond(pick);
  };

  return (
    <div className="bg-[#120d0b] border border-[#ff8c50]/30 shadow-[10px_12px_30px_rgba(0,0,0,0.5),inset_0_0_40px_rgba(255,120,60,0.08)] rounded-xl overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,120,60,0.08),transparent_40%),url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-70 pointer-events-none" />
      <div className="relative p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#ffb87a] font-mono">Empire Route</p>
            <h3 className="text-2xl font-display text-[#f6eee2]">Bond Forge</h3>
          </div>
          <span className="px-3 py-1 text-[10px] uppercase font-mono rounded-full border border-[#ff8c50]/40 text-[#ffdcc3] bg-[#1a120e]">
            {tier === 'hybrid' ? 'Hybrid Tier' : 'Foundling Tier'}
          </span>
        </div>

        <p className="text-sm text-[#e8dfcf]/80 leading-relaxed">
          Navigate Sky City politics and keep Igzier ↔ Karys in view. Illuminating the path (session time or a single purchase) unlocks hybrid alliances.
        </p>

        <div className="flex flex-wrap gap-2 text-[11px] font-mono text-[#ffdcc3]/80">
          <button
            type="button"
            onClick={() => setIlluminated(true)}
            className="px-3 py-2 border border-[#ff8c50]/40 bg-[#1f150f] rounded hover:border-[#ffc48f] transition"
          >
            I illuminated the path
          </button>
          {amazonUrl && (
            <a
              href={amazonUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 border border-[#ff8c50]/40 bg-[#1f150f] rounded hover:border-[#ffc48f] transition"
            >
              Pre-Order Link
            </a>
          )}
          <button
            type="button"
            onClick={forge}
            className="px-3 py-2 border border-[#ff8c50]/60 bg-[#261710] text-[#f6eee2] rounded shadow-[0_0_20px_rgba(255,120,60,0.2)] hover:border-[#ffc48f] transition"
          >
            Forge Bond
          </button>
        </div>

        {bond ? (
          <motion.div
            key={bond.name + bond.partner}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center bg-[#1a120e] border border-[#ff8c50]/20 rounded-lg overflow-hidden"
          >
            <div className="md:col-span-2">
              <div
                className="h-full min-h-[180px] bg-cover bg-center opacity-80"
                style={{ backgroundImage: `url(${bond.img})` }}
              />
            </div>
            <div className="md:col-span-3 p-4 space-y-2">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#ffb87a] font-mono">Faction: {bond.faction}</p>
              <h4 className="text-xl font-display text-[#f6eee2]">{bond.name} ⇄ {bond.partner}</h4>
              <p className="text-sm text-[#e8dfcf]/80">{bond.vibe}</p>
              <p className="text-xs text-[#ffdcc3]/70">
                This pairing will echo through the chapter stream and in-world pop-ups (Igzier/Karys longing included).
              </p>
            </div>
          </motion.div>
        ) : (
          <p className="text-sm text-[#e8dfcf]/70">Press Forge to summon your political/romance bond.</p>
        )}
      </div>
    </div>
  );
}
