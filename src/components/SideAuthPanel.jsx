'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { LogIn, Shield, Ghost, X } from 'lucide-react';

export default function SideAuthPanel() {
  const { user, loading, loginGoogle, loginGhost } = useAuth();
  const [open, setOpen] = useState(true);

  if (user || loading) return null;

  return (
    <div className="fixed right-4 top-32 z-40">
      <div
        className={`relative transition-all duration-300 ${
          open ? 'translate-x-0 opacity-100' : 'translate-x-64 opacity-40'
        }`}
      >
        <div className="absolute -left-9 top-5">
          <button
            onClick={() => setOpen((v) => !v)}
            className="w-8 h-16 bg-black/60 border border-amber-600/50 text-amber-200 text-[10px] font-mono uppercase tracking-[0.2em] rounded-l-sm shadow-[0_0_15px_rgba(245,158,11,0.35)] hover:bg-black/75 transition-colors flex flex-col items-center justify-center gap-1"
          >
            {open ? <X size={14} /> : <LogIn size={14} />}
            <span className="-rotate-90">{open ? 'Hide' : 'Join'}</span>
          </button>
        </div>

        <div className="w-72 bg-black/60 border border-amber-700/60 rounded-sm shadow-[0_0_30px_rgba(245,158,11,0.25)] backdrop-blur-md overflow-hidden">
          <div className="px-5 py-4 border-b border-amber-800/40">
            <p className="text-[10px] uppercase tracking-[0.3em] text-amber-400 font-mono">Join the World</p>
            <p className="text-sm text-stone-200 mt-1">Sync resin, staff, and archives.</p>
          </div>

          <div className="p-5 space-y-3">
            <button
              onClick={loginGoogle}
              className="w-full px-4 py-3 bg-amber-900/30 border border-amber-700/70 text-amber-100 uppercase tracking-[0.2em] text-[11px] rounded-sm hover:bg-amber-900/50 transition flex items-center justify-center gap-2 shadow-inner"
            >
              <Shield size={14} /> Sign in with Google
            </button>
            <button
              onClick={loginGhost}
              className="w-full px-4 py-2 bg-stone-900/70 border border-stone-700 text-stone-200 uppercase tracking-[0.18em] text-[11px] rounded-sm hover:bg-stone-800 transition flex items-center justify-center gap-2"
            >
              <Ghost size={14} /> Enter as Ghost
            </button>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              Collapses after login. Use Google for cloud sync; Ghost keeps you local.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
