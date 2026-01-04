'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';

const CYCLE_LABEL = 'Cycle: Albian Awakening';

export default function CelestialDisk({ label = CYCLE_LABEL, className = 'tethys-disk' }) {
  const [degrees, setDegrees] = useState(0);

  useEffect(() => {
    const updateRotation = () => {
      const now = new Date();
      const nextYear = new Date(now.getFullYear() + 1, 0, 1);
      const elapsed = nextYear - now;
      const progress = 1 - elapsed / (365 * 24 * 60 * 60 * 1000);
      setDegrees(progress * 360);
    };
    updateRotation();
    const timer = setInterval(updateRotation, 1000);
    return () => clearInterval(timer);
  }, []);

  const meter = useMemo(() => {
    const pct = Math.min(100, Math.max(0, (degrees % 360) / 3.6));
    return `${pct.toFixed(0)}%`;
  }, [degrees]);

  return (
    <div className={`relative inline-flex flex-col items-center gap-3 ${className}`}>
      <motion.div
        animate={{ rotate: degrees }}
        transition={{ type: 'spring', stiffness: 20, damping: 8 }}
        className="relative w-24 h-24 rounded-full border border-amber-800/60 shadow-[0_0_30px_rgba(255,125,40,0.25)] bg-gradient-to-br from-[#1c1917] via-[#0f0b09] to-black overflow-hidden"
      >
        <div className="absolute inset-2 rounded-full border border-amber-900/30"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.08),transparent_60%)]"></div>
        <img src="/logo-disk.png" alt="Tethys Celestial Disk" className="w-full h-full object-contain opacity-80" />
      </motion.div>
      <div className="text-center space-y-1">
        <p className="text-[10px] uppercase tracking-[0.3em] text-amber-400 font-mono">{label}</p>
        <p className="text-[9px] text-stone-500 font-mono">Cycle Progress: {meter}</p>
      </div>
    </div>
  );
}
