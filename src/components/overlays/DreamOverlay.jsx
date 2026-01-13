"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Minimal dream overlay.
 * - No text (impressions only)
 * - Shows two silhouettes (Ravel distant, Kith perched)
 * - Auto fades after durationMs, then calls onEnd
 */
export default function DreamOverlay({ show, durationMs = 15000, onEnd }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!show) return;
    setActive(true);
    const t = setTimeout(() => {
      setActive(false);
      onEnd?.();
    }, durationMs);
    return () => clearTimeout(t);
  }, [show, durationMs, onEnd]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.95 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="pointer-events-none fixed inset-0 z-[9999] bg-gradient-to-b from-black/80 via-[#0f172a]/90 to-black/85 backdrop-blur-md"
        >
          {/* Ravel silhouette (distant) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.7, y: 0 }}
            transition={{ duration: 2.4, ease: [0.22, 0.61, 0.36, 1] }}
            className="absolute left-16 bottom-20 h-48 w-24 rounded-full bg-gradient-to-t from-black via-black/80 to-transparent blur-[1px]"
          />

          {/* Kith silhouette (perched) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 0.6, y: 0 }}
            transition={{ delay: 0.4, duration: 2.8, ease: [0.22, 0.61, 0.36, 1] }}
            className="absolute right-24 top-24 h-20 w-20 rounded-full bg-gradient-to-b from-black via-black/70 to-black/30 blur-[2px]"
          />

          {/* Subtle ambient shimmer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.18 }}
            transition={{ delay: 0.8, duration: 3.2, ease: "easeInOut" }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(120,220,170,0.08),transparent_55%)]"
          />

          {/* Torch extinguish overlay */}
          <div className="absolute inset-0 bg-black/35" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// World of Tethys || D.C. Barletta
