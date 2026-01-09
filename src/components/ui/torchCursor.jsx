// src/components/ui/TorchCursor.jsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function TorchCursor({ enabled = true }) {
  const [pos, setPos] = useState({ x: -9999, y: -9999 });

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[9999]"
      aria-hidden="true"
    >
      {/* “torch” core */}
      <motion.div
        className="absolute"
        style={{ left: pos.x, top: pos.y }}
        animate={{ x: 12, y: 12 }}
        transition={{ type: "spring", stiffness: 500, damping: 40 }}
      >
        {/* flame + handle (pure CSS shapes, no images needed) */}
        <div className="relative">
          {/* glow */}
          <div className="absolute -left-6 -top-8 w-20 h-20 rounded-full blur-2xl opacity-30 bg-amber-400" />
          <div className="absolute -left-4 -top-6 w-14 h-14 rounded-full blur-xl opacity-25 bg-orange-500" />
          <div className="absolute -left-3 -top-5 w-10 h-10 rounded-full blur-lg opacity-20 bg-emerald-300" />

          {/* flame */}
          <div className="w-3 h-5 rounded-t-full rounded-b-[10px] bg-amber-200 shadow-[0_0_18px_rgba(251,191,36,0.35)]" />
          {/* handle */}
          <div className="mx-auto mt-1 w-1 h-6 rounded bg-stone-500 opacity-80" />
          <div className="mx-auto mt-0.5 w-2 h-2 rounded bg-stone-700 opacity-90" />
        </div>
      </motion.div>
    </motion.div>
  );
}
// World of Tethys || D.C. Barletta
