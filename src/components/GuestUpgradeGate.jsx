'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { UserPlus, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const TRACK_KEY = 'tethys_guest_pages_v1';
const SHOWN_KEY = 'tethys_guest_upgrade_shown_v1';
const MIN_PAGES = 3;
const EXCLUDED_PATHS = new Set(['/login']);

export default function GuestUpgradeGate() {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setOpen(false);
      return;
    }
    if (!pathname || EXCLUDED_PATHS.has(pathname)) return;
    if (typeof window === 'undefined') return;

    try {
      const raw = localStorage.getItem(TRACK_KEY);
      let parsed = [];
      try {
        parsed = JSON.parse(raw || '[]');
      } catch {
        parsed = [];
      }
      const seen = new Set(Array.isArray(parsed) ? parsed : []);
      if (!seen.has(pathname)) {
        seen.add(pathname);
        localStorage.setItem(TRACK_KEY, JSON.stringify([...seen]));
      }

      if (seen.size >= MIN_PAGES && !localStorage.getItem(SHOWN_KEY)) {
        localStorage.setItem(SHOWN_KEY, '1');
        setOpen(true);
      }
    } catch {
      /* ignore tracking errors */
    }
  }, [pathname, user]);

  if (!open || user) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur-sm p-6">
      <div className="relative w-full max-w-md bg-[#0c0a09] border border-emerald-900/40 rounded-lg shadow-[0_0_60px_rgba(16,185,129,0.2)]">
        <div className="px-6 pt-6 pb-4 border-b border-emerald-900/30">
          <p className="text-[10px] uppercase tracking-[0.3em] text-emerald-500/70 font-mono">
            Signal Archive
          </p>
          <h2 className="text-2xl font-serif text-emerald-100 mt-2">
            Preserve your field record
          </h2>
          <p className="text-sm text-stone-400 mt-2">
            You have crossed multiple zones. Register to keep your staff, adornments, and atlas history synced for future excursions.
          </p>
        </div>
        <div className="px-6 py-5 space-y-3">
          <button
            onClick={() => {
              setOpen(false);
              router.push('/login');
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-900/20 border border-emerald-500/40 text-emerald-200 uppercase tracking-[0.2em] text-[11px] rounded-sm hover:bg-emerald-900/40 transition-colors"
          >
            <UserPlus size={14} />
            Register Signal
          </button>
          <button
            onClick={() => setOpen(false)}
            className="w-full px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-stone-500 hover:text-stone-300"
          >
            Drift as Guest
          </button>
        </div>
        <button
          onClick={() => setOpen(false)}
          className="absolute top-3 right-3 p-2 text-stone-600 hover:text-emerald-400 transition-colors"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
// World of Tethys || D.C. Barletta
