'use client';

import { motion } from 'framer-motion';
import React from 'react';
//import { useTethys } from '@/context/TethysContext';
//import StaffSequencer from './StaffSequencer';

/**
 * Visual representation of the staff using core/binding/apex/aura segments.
 * Accepts either staffProfile (segments) or a minimal staffData with core/binding/apex/aura keys.
 */
export default function StaffVisualizer({ staffData, className = '', heightClass = 'h-[420px]' }) {
  const components = staffData?.components || {};
  const core = staffData?.segments?.core || staffData?.core || components.core || {};
  const wrap = staffData?.segments?.wrap || staffData?.binding || components.wrap || {};
  const apex = staffData?.segments?.apex || staffData?.apex || components.apex || {};
  const aura = staffData?.segments?.aura || staffData?.aura || {};
  const shaftGradient = staffData?.visuals?.shaftGradient;
  const wrapColor = staffData?.visuals?.wrapColor;
  const glowColor = staffData?.visuals?.glowColor;

  return (
    <div className={`relative ${heightClass} w-full flex flex-col items-center justify-center ${className}`}>
      {/* Aura */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-full blur-3xl"
        animate={{ opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 4, repeat: Infinity }}
        style={{
          background:
            aura.visual?.accent ||
            (glowColor
              ? `radial-gradient(circle at 50% 35%, ${glowColor}33, transparent 55%)`
              : 'radial-gradient(circle at 50% 35%, rgba(122,58,35,0.25), transparent 55%)')
        }}
      />

      {/* Unified Staff */}
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="relative flex flex-col items-center">
          <div
            className="w-10 h-12 rounded-t-full border-2 shadow-lg"
            style={{
              borderColor: core.visual?.color || '#3d2b1f',
              background:
                apex.visual?.accent ||
                (glowColor
                  ? `radial-gradient(circle at 50% 40%, ${glowColor}55, transparent 70%)`
                  : 'linear-gradient(180deg, rgba(255,178,102,0.65), rgba(88,52,22,0.8))')
            }}
          />
          <div
            className="w-6 h-64 rounded-full shadow-inner ancient-border"
            style={{
              background: core.visual?.texture
                ? core.visual.texture
                : core.visual?.gradient || shaftGradient || 'linear-gradient(180deg, #4d2c26 0%, #2e2a26 100%)',
              borderColor: core.visual?.color || '#3d2b1f'
            }}
          >
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 top-12 w-8 h-24 mix-blend-multiply rounded-full"
              style={{ background: wrap.visual?.accent || wrap.visual?.color || wrapColor || 'rgba(122,58,35,0.35)' }}
              initial={{ opacity: 0.4, scaleY: 0.6 }}
              animate={{ opacity: [0.4, 0.7, 0.4], scaleY: [0.6, 1, 0.6] }}
              transition={{ duration: 3.5, repeat: Infinity }}
            />
          </div>
        </div>
        <p className="text-center text-[10px] font-mono uppercase tracking-[0.2em] mt-3 text-ancient-ink/70">
          {staffData?.name || core.label || 'Staff Core'}
        </p>
      </motion.div>
    </div>
  );
}
// World of Tethys || D.C. Barletta
