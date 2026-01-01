'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const FACTIONS = [
  {
    id: 'council',
    name: 'The High Council',
    motto: 'Order Above All',
    desc: 'The architects of Sky City. They believe control is the only way to survive the Ash. They hoard the technology of the Ancients.',
    color: 'text-amber-500',
    border: 'border-amber-600',
    bg: 'bg-amber-900/20',
    icon: '🏛️'
  },
  {
    id: 'weep',
    name: 'The Weep Syndicate',
    motto: 'Chaos is Freedom',
    desc: 'Rebels living in the toxic runoff below. They scavenge what is thrown away and believe the surface can be reclaimed.',
    color: 'text-emerald-500',
    border: 'border-emerald-600',
    bg: 'bg-emerald-900/20',
    icon: '🐍'
  }
];

export default function FactionsPage() {
  const [selected, setSelected] = useState(null);
  const [pledged, setPledged] = useState(false);

  const handlePledge = (factionId) => {
    setPledged(true);
    // Trigger the global evolution event to update the Avatar
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('tethys:evolved', { 
        detail: { weight: 'lore' } // Pledging counts as Lore knowledge
      });
      window.dispatchEvent(event);
      
      // Save allegiance (Mock persistence)
      localStorage.setItem('tethys_faction', factionId);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0e0d] text-stone-300 font-serif relative overflow-hidden flex flex-col items-center justify-center p-6">
      
      {/* BACKGROUND: Split Screen Effect */}
      <div className="absolute inset-0 flex pointer-events-none opacity-20">
        <div className="w-1/2 h-full bg-gradient-to-r from-amber-900/20 to-transparent"></div>
        <div className="w-1/2 h-full bg-gradient-to-l from-emerald-900/20 to-transparent"></div>
      </div>
      
      {/* HEADER */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 relative z-10"
      >
        <h1 className="text-4xl md:text-6xl tracking-widest text-white uppercase drop-shadow-2xl">
          Choose Your Path
        </h1>
        <p className="mt-4 text-stone-500 font-mono text-xs uppercase tracking-[0.3em]">
          Politics of the Ash Age
        </p>
      </motion.div>

      {/* FACTION CARDS */}
      {!pledged ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl w-full relative z-10">
          {FACTIONS.map((faction) => (
            <motion.div
              key={faction.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelected(faction.id)}
              className={`relative p-8 border-2 cursor-pointer transition-all duration-500 group
                ${selected === faction.id 
                  ? `${faction.border} ${faction.bg} opacity-100` 
                  : 'border-stone-800 bg-stone-900/50 opacity-60 hover:opacity-100'
                }
              `}
            >
              {/* Icon */}
              <div className="text-6xl mb-6 filter grayscale group-hover:grayscale-0 transition-all duration-500">
                {faction.icon}
              </div>
              
              {/* Title */}
              <h2 className={`text-3xl mb-2 uppercase tracking-wider ${faction.color}`}>
                {faction.name}
              </h2>
              
              {/* Motto */}
              <p className="text-xs font-mono text-stone-500 uppercase tracking-[0.2em] mb-6">
                "{faction.motto}"
              </p>
              
              {/* Description */}
              <p className="leading-relaxed text-stone-400 mb-8">
                {faction.desc}
              </p>

              {/* Pledge Button (Only visible if selected) */}
              {selected === faction.id && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePledge(faction.id);
                  }}
                  className={`w-full py-3 border ${faction.border} ${faction.color} uppercase text-xs font-bold tracking-[0.3em] hover:bg-black/50 transition-colors`}
                >
                  Pledge Allegiance
                </motion.button>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        /* SUCCESS STATE */
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-2xl bg-stone-900 p-12 border border-stone-800 shadow-2xl"
        >
          <div className="text-6xl mb-6">
            {FACTIONS.find(f => f.id === selected)?.icon}
          </div>
          <h2 className="text-3xl text-white mb-4">Allegiance Confirmed</h2>
          <p className="text-stone-400 mb-8">
            "The {FACTIONS.find(f => f.id === selected)?.name} acknowledges your support. Watch your dossier for new directives."
          </p>
          <Link href="/" className="inline-block px-8 py-3 bg-stone-800 hover:bg-stone-700 text-stone-300 uppercase text-xs tracking-widest transition-colors">
            Return to Shadow
          </Link>
        </motion.div>
      )}

      {/* Back Link */}
      {!pledged && (
        <div className="mt-20">
          <Link href="/" className="text-stone-600 hover:text-stone-400 text-xs uppercase tracking-widest transition-colors">
            &larr; Remain Neutral
          </Link>
        </div>
      )}
    </div>
  );
}