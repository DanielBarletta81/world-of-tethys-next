'use client';

import { motion } from 'framer-motion';
import React, { useMemo } from 'react';
import { useTethys } from '@/context/TethysContext';
import { deriveStaffPhenotype, flagsLabel } from '@/lib/staff-phenotype';

/**
 * Visual representation of the staff using core/binding/apex/aura segments.
 * Accepts either staffProfile (segments) or a minimal staffData with core/binding/apex/aura keys.
 */
export default function StaffVisualizer({ staffData, className = '', heightClass = 'h-[420px]' }) {
  const { playerProfile } = useTethys();
  const components = staffData?.components || {};
  const core = staffData?.segments?.core || staffData?.core || components.core || {};
  const wrap = staffData?.segments?.wrap || staffData?.binding || components.wrap || {};
  const apex = staffData?.segments?.apex || staffData?.apex || components.apex || {};
  const aura = staffData?.segments?.aura || staffData?.aura || {};
  const phenotype = useMemo(
    () =>
      deriveStaffPhenotype({
        dna: playerProfile?.dna || {},
        pathMode: playerProfile?.path?.primary || 'wild',
        progress: playerProfile?.progress || {},
        epigenetics: playerProfile?.dna?.epigenetics || null
      }),
    [playerProfile?.dna, playerProfile?.path?.primary, playerProfile?.progress]
  );
  const warpTilt = phenotype.warp * 2.5;
  const barkRidge = Math.round(phenotype.grain * 8);
  const wrapOpacity = 0.35 + phenotype.wrapDensity * 0.4;
  const wetLayerOpacity = phenotype.wetness * 0.6;
  const glowBoost = phenotype.glowBoost || 0;
  const glowColor = phenotype.auraColor;
  const staffName = staffData?.name || core.label || 'Staff Core';
  const staffSigil = flagsLabel(phenotype.flags);

  return (
    <div className={`relative ${heightClass} w-full flex flex-col items-center justify-center ${className}`}>
      {/* Aura */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-full blur-3xl"
        animate={{ opacity: [0.08 + glowBoost, 0.18 + glowBoost, 0.08 + glowBoost] }}
        transition={{ duration: 5, repeat: Infinity }}
        style={{
          background:
            aura.visual?.accent ||
            `radial-gradient(circle at 50% 35%, ${glowColor}33, transparent 55%)`
        }}
      />

      {/* Driftwood Body */}
      <motion.div
        animate={{ y: [0, -3, 0], rotate: [warpTilt, warpTilt + 0.4, warpTilt] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10 flex flex-col items-center"
      >
        <div className="relative flex flex-col items-center">
          <div
            className="w-12 h-14 rounded-[20px] border border-stone-700/60 shadow-[0_6px_18px_rgba(0,0,0,0.45)]"
            style={{
              background:
                phenotype.variant === 'spore'
                  ? `radial-gradient(circle at 50% 40%, ${glowColor}66, rgba(8,14,14,0.8) 70%)`
                  : phenotype.variant === 'etched'
                  ? 'linear-gradient(180deg, rgba(198,211,220,0.7), rgba(46,55,61,0.9))'
                  : `radial-gradient(circle at 50% 40%, ${glowColor}44, rgba(66,44,32,0.9) 70%)`
            }}
          />
          <div
            className="relative w-7 h-64 rounded-full border border-stone-800/70 shadow-inner overflow-hidden"
            style={{
              background: `linear-gradient(180deg, ${phenotype.woodLight} 0%, ${phenotype.woodDark} 65%, ${phenotype.wetStain} 100%)`,
              filter: phenotype.variant === 'etched' ? 'saturate(0.6)' : 'none'
            }}
          >
            <div
              className="absolute inset-0 opacity-80"
              style={{
                backgroundImage: `repeating-linear-gradient(180deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 6px, rgba(0,0,0,0.18) ${6 + barkRidge}px)`
              }}
            />
            <div
              className="absolute inset-x-0 bottom-0 h-24"
              style={{
                background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${phenotype.wetStain} 90%)`,
                opacity: wetLayerOpacity
              }}
            />
            <div
              className="absolute left-1/2 -translate-x-1/2 top-10 w-10 h-28 rounded-full"
              style={{
                background: `repeating-linear-gradient(120deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 3px, rgba(10,12,12,${wrapOpacity}) 4px)`,
                opacity: wrapOpacity
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 30% 30%, rgba(0,0,0,${phenotype.chip}) 0%, transparent 45%)`
              }}
            />
          </div>
        </div>
        <div className="mt-3 text-center">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-ancient-ink/70">
            {staffName}
          </p>
          <p className="text-[9px] uppercase tracking-[0.35em] text-stone-500">
            {staffSigil}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
// World of Tethys || D.C. Barletta
