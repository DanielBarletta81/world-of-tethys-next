// src/components/oracle/OracleModal.jsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, MapPinned, Ear } from "lucide-react";



export default function OracleModal({ open, onClose, entry }) {
  return (
    <AnimatePresence>
      {open && entry && (
        <>
          <motion.button
            className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-label="Close oracle modal"
          />
          <motion.div
            className="fixed left-1/2 top-1/2 z-[201] w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2
                       rounded-2xl border border-emerald-900/40 bg-[#0b0a09]/95 shadow-[0_0_80px_rgba(45,212,191,0.10)]
                       overflow-hidden"
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ duration: 0.18 }}
            role="dialog"
            aria-modal="true"
          >
            <div className="px-6 py-5 border-b border-stone-800 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-[0.35em] text-emerald-400 font-mono flex items-center gap-2">
                  <Ear size={12} /> Oracle Pool
                </p>
                <h3 className="text-stone-100 text-xl font-serif">
                  {entry.title}
                </h3>
                {entry.locationLabel && (
                  <p className="text-xs text-stone-400 flex items-center gap-2">
                    <MapPinned size={14} className="opacity-70" />
                    {entry.locationLabel}
                  </p>
                )}
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-lg border border-stone-800 text-stone-300 hover:text-white hover:border-stone-600"
              >
                <X size={16} />
              </button>
            </div>

            <div className="px-6 py-6 space-y-4">
              {/* “gibberish” surface */}
              {entry.gibberish && (
                <p className="text-xs text-emerald-200/80 font-mono tracking-[0.18em] uppercase">
                  {entry.gibberish}
                </p>
              )}

              {/* the actual payload */}
              <p className="text-stone-200 leading-relaxed">
                {entry.body}
              </p>

              {/* optional: actionable hint */}
              {entry.hint && (
                <div className="mt-3 rounded-xl border border-amber-600/30 bg-amber-500/10 p-4">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-amber-300 font-mono">
                    If you listen correctly
                  </p>
                  <p className="text-sm text-amber-100 mt-2">{entry.hint}</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
// World of Tethys || D.C. Barletta
