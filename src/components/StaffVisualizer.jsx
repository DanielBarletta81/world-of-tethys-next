'use client';

import { motion } from 'framer-motion';

/**
 * Visual representation of the staff using core/binding/apex/aura segments.
 * Accepts either staffProfile (segments) or a minimal staffData with core/binding/apex/aura keys.
 */
export default function StaffVisualizer({ staffData }) {
  const core = staffData?.segments?.core || staffData?.core || {};
  const wrap = staffData?.segments?.wrap || staffData?.binding || {};
  const apex = staffData?.segments?.apex || staffData?.apex || {};
  const aura = staffData?.segments?.aura || staffData?.aura || {};

  return (
    <div className="relative h-[420px] w-full flex flex-col items-center justify-center">
      {/* Aura */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-full blur-3xl"
        animate={{ opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 4, repeat: Infinity }}
        style={{ background: aura.visual?.accent || 'radial-gradient(circle at 50% 35%, rgba(122,58,35,0.25), transparent 55%)' }}
      />

      {/* Apex */}
      <motion.div
        animate={{ y: [0, -8, 0], rotate: [0, 2, -2, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-20"
      >
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-300/80 to-amber-700/60 border-2 border-ancient-ink shadow-lg flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-black/70 shadow-inner" />
        </div>
        <p className="text-center text-[10px] font-mono uppercase tracking-[0.2em] mt-2 text-ancient-ink/70">
          {apex.label || 'Apex'}
        </p>
      </motion.div>

      {/* Shaft */}
      <div className="relative z-10 flex flex-col items-center mt-4">
        <div
          className="w-6 h-64 rounded-full shadow-inner ancient-border"
          style={{
            background: core.visual?.texture
              ? core.visual.texture
              : 'linear-gradient(180deg, #4d2c26 0%, #2e2a26 100%)',
            borderColor: core.visual?.color || '#3d2b1f'
          }}
        >
          {/* Binding */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 top-12 w-8 h-24 mix-blend-multiply rounded-full"
            style={{ background: wrap.visual?.accent || 'rgba(122,58,35,0.35)' }}
            initial={{ opacity: 0.4, scaleY: 0.6 }}
            animate={{ opacity: [0.4, 0.7, 0.4], scaleY: [0.6, 1, 0.6] }}
            transition={{ duration: 3.5, repeat: Infinity }}
          />
        </div>
        <p className="text-center text-[10px] font-mono uppercase tracking-[0.2em] mt-3 text-ancient-ink/70">
          {core.label || 'Core'}
        </p>
      </div>
    </div>
  );
}
