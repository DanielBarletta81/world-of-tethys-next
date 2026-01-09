// src/components/MagmaSeal.jsx
'use client';
import Link from 'next/link';
import Image from 'next/image';

export default function MagmaSeal({ className = "" }) {
  return (
    <Link href="/" className={`relative group block w-20 h-20 shrink-0 ${className}`}>
      
      {/* 1. The Magma Pulse (Behind) */}
      <div className="absolute inset-0 bg-orange-600 rounded-full blur-xl opacity-20 group-hover:opacity-50 group-hover:scale-125 transition-all duration-700 animate-pulse"></div>
      
      {/* 2. The Iron Coin Container */}
      <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-orange-900/40 group-hover:border-orange-500 transition-colors shadow-[0_0_30px_rgba(0,0,0,0.5)] bg-[#0c0a09]">
        
        {/* 3. The Image (Filtered to look like hot iron) */}
        <Image 
          src="/img/a symbols/tethys-seal.png" 
          alt="Seal of Tethys" 
          fill
          className="object-cover sepia-[0.8] brightness-75 contrast-125 group-hover:brightness-110 group-hover:sepia-[0.4] transition-all duration-500"
        />

        {/* 4. The Heat Overlay (Gradient) */}
        <div className="absolute inset-0 bg-gradient-to-tr from-red-900/60 via-transparent to-orange-500/10 mix-blend-overlay pointer-events-none"></div>
        
        {/* 5. Metallic Glint Animation */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:animate-shine pointer-events-none"></div>
      </div>
    </Link>
  );
}
// World of Tethys || D.C. Barletta
