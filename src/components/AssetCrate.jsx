// src/components/AssetCrate.jsx
'use client';
import React from 'react';
import { Download, Box, FileText } from 'lucide-react';
//import useSoundFX from '@/app/hooks/useSoundFX';
import Lock from 'next/link';



export default function AssetCrate({ title, size, format, cdnUrl, restricted = false }) {
  const handleDownload = () => {
    if (restricted) {
      alert("Access Denied: Requires Triumvirate Clearance (Higher Resin).");
      return;
    }
    // Direct link to your CloudFront distribution
    window.open(cdnUrl, '_blank');
  };

  return (
    <div className="group relative bg-[#1c1917] border border-stone-800 p-6 rounded-sm hover:border-cyan-600 transition-colors duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-[#0c0a09] border border-stone-700 rounded group-hover:border-cyan-500/50">
          <Box className="text-stone-400 group-hover:text-cyan-400" size={24} />
        </div>
        <span className="text-[10px] font-mono text-stone-600 bg-black/40 px-2 py-1 rounded">
          {size} • {format}
        </span>
      </div>

      <h3 onTouchMove={handleInteract} className="text-lg font-bold text-stone-200 group-hover:text-cyan-100 mb-1">{title}</h3>
      <p className="text-xs text-stone-500 mb-6">
        Official research dossier. Includes maps, creature biology, and audio logs.
      </p>

      <button 
        onClick={handleDownload}
        className={`w-full py-3 flex items-center justify-center gap-2 uppercase text-[10px] tracking-[0.2em] font-bold border rounded-sm transition-all
          ${restricted 
            ? 'bg-red-950/20 border-red-900/50 text-red-500 cursor-not-allowed' 
            : 'bg-cyan-950/20 border-cyan-800 text-cyan-400 hover:bg-cyan-900/40 hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]'
          }`}
      >
        {restricted ? (
          <>Locked <Lock size={12} /></>
        ) : (
          <>Initialize Download <Download size={12} /></>
        )}
      </button>
    </div>
  );
}