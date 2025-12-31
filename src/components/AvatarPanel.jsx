'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Collapsible reader/player panel with a drifting "ghost" avatar.
 */
export default function AvatarPanel({ name = 'Mysterious Reader', title = 'Silent Archivist' }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full max-w-xs ml-auto">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 border border-ancient-ink/30 bg-black/40 text-ancient-ink font-mono text-[11px] uppercase tracking-[0.3em] hover:border-ancient-accent transition-colors"
      >
        <span className="flex items-center gap-3">
          <span className="relative w-8 h-8 rounded-full border border-ancient-ink/40 bg-ancient-ink/10 overflow-hidden">
            <motion.div
              animate={{ y: [-6, 6, -6], opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 bg-gradient-to-br from-ancient-accent/50 to-ancient-ink/40 mix-blend-screen"
            />
          </span>
          <span>{name}</span>
        </span>
        <span className="text-ancient-accent">{open ? 'Close' : 'Open'}</span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -8 }}
            animate={{ height: 'auto', opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="border border-ancient-ink/30 border-t-0 bg-[#0f0b08]/80 p-4 space-y-3 text-ancient-ink text-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-ancient-ink/40 bg-ancient-accent/10 flex items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-ancient-ink/50" />
              </div>
              <div>
                <p className="font-display text-lg leading-tight">{title}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ancient-ink/70">Avatar channel open</p>
              </div>
            </div>

            <div className="space-y-1 font-mono text-[11px] uppercase tracking-[0.2em]">
              <p>Bonded: Awaiting lore</p>
              <p>Traits: Hybridizing as new stories arrive</p>
              <p>Status: Elusive observer</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
