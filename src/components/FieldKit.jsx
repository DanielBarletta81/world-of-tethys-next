'use client';

import { motion } from 'framer-motion';
import { Map as MapIcon, Scroll, Diamond, User, BookOpen, Sparkles } from 'lucide-react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useTethys } from '@/context/TethysContext';
import { getAmazonBookUrl } from '@/lib/links';

export default function FieldKit() {
  const { user } = useUser();
  const {
    resin = 0,
    mode = 'explore',
    setModeChoice,
    earnResin,
    spendResin
  } = useTethys();

  const amazonUrl = getAmazonBookUrl() || '/bookstore';

  const handleMode = (next) => setModeChoice?.(next);
  const handleEarn = () => earnResin?.(50, 'forage');
  const handleSpend = () => spendResin?.(25, 'map_scan');

  return (
    <section className="relative border-t border-[#2d241e] bg-[#0d0a09] text-stone-200">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(244,163,64,0.07),_transparent_55%)] opacity-80 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-15 mix-blend-soft-light pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 py-10 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-amber-400 font-mono">Field Kit</p>
            <h3 className="text-2xl font-header text-stone-50">Equip your expedition role</h3>
            <p className="text-stone-400 text-sm max-w-xl">
              Choose to walk as a Wayfinder or fund as a Patron. Resin is your currency; earn in the field or spend on scans and relics.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Diamond className="text-forge-orange w-5 h-5" />
            <span className="font-mono text-sm tracking-widest text-amber-300">{resin} Resin</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Identity + Sigil */}
          <div className="flex-1 bg-[#12100e] border border-[#2f261f] rounded-lg p-5 shadow-[0_15px_40px_rgba(0,0,0,0.35)]">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#0b0908] border border-[#2f261f] overflow-hidden flex items-center justify-center">
                {user ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.picture} alt={user.name} className="w-full h-full object-cover opacity-80" />
                ) : (
                  <User className="text-stone-600 w-6 h-6" />
                )}
              </div>
              <div>
                <p className="text-sm text-stone-400 uppercase tracking-[0.2em]">Identity</p>
                <p className="text-lg text-stone-50">{user?.name || 'Unknown Wanderer'}</p>
                <a
                  href={user ? '/api/auth/logout' : '/api/auth/login'}
                  className="text-[11px] uppercase tracking-[0.25em] text-amber-400 hover:text-amber-200"
                >
                  {user ? 'Sever Link' : 'Identify Sigil'}
                </a>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-[10px] uppercase tracking-[0.25em] text-stone-500 mb-2">Mode</p>
              <div className="relative bg-[#0b0908] border border-[#2f261f] rounded-md overflow-hidden">
                <motion.div
                  className="absolute top-1 bottom-1 w-1/2 bg-[#1b1612] border border-[#3b2f27] rounded-md"
                  animate={{ x: mode === 'buy' ? '100%' : '0%' }}
                  transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                />
                <div className="relative grid grid-cols-2 text-center text-[11px] font-mono uppercase tracking-[0.18em]">
                  <button
                    onClick={() => handleMode('explore')}
                    className={`flex items-center justify-center gap-2 py-3 transition-colors ${
                      mode === 'explore' ? 'text-stone-50' : 'text-stone-600'
                    }`}
                  >
                    <MapIcon size={14} />
                    Wayfinder
                  </button>
                  <button
                    onClick={() => handleMode('buy')}
                    className={`flex items-center justify-center gap-2 py-3 transition-colors ${
                      mode === 'buy' ? 'text-amber-300' : 'text-stone-600'
                    }`}
                  >
                    <Scroll size={14} />
                    Patron
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex-1 bg-[#12100e] border border-[#2f261f] rounded-lg p-5 shadow-[0_15px_40px_rgba(0,0,0,0.35)] flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <BookOpen className="text-amber-400 w-5 h-5 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-stone-100">Acquire the Tome</p>
                <p className="text-xs text-stone-500 mb-3">Unlock the official chronicle; supports the archive.</p>
                <a
                  href={amazonUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-amber-700/60 text-amber-200 rounded-sm bg-amber-900/10 hover:bg-amber-900/30 transition-colors"
                >
                  <Sparkles size={14} /> Open Amazon
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleEarn}
                className="border border-emerald-800/50 bg-emerald-900/10 text-emerald-200 text-xs uppercase tracking-[0.18em] py-3 rounded-sm hover:bg-emerald-900/30 transition-colors"
              >
                Forage +50
              </button>
              <button
                onClick={handleSpend}
                className="border border-amber-800/50 bg-amber-900/10 text-amber-200 text-xs uppercase tracking-[0.18em] py-3 rounded-sm hover:bg-amber-900/30 transition-colors"
              >
                Map Scan -25
              </button>
            </div>

            <div className="text-[11px] text-stone-500 leading-relaxed">
              Resin activity is local to your device for now. When you connect your sigil we can sync it to the Registry and export to VR builds.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
