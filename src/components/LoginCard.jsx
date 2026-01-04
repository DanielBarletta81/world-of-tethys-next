'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Hammer, Flame, Ghost } from 'lucide-react';

export default function LoginCard() {
  const { loginGoogle, loginGhost, user } = useAuth();

  // If user is already logged in, show nothing
  if (user) return null;

  return (
    <div className="relative group max-w-sm w-full mx-auto my-12">
      
      {/* 1. MAGMA GLOW UNDERLAY (Pulsing) */}
      <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
      
      {/* 2. THE OBSIDIAN SLATE (Main Card) */}
      <div className="relative px-7 py-6 bg-[#0c0a09] ring-1 ring-white/10 rounded-lg leading-none flex flex-col items-center text-center shadow-2xl">
        
        <div className="mb-4 p-3 bg-orange-900/20 rounded-full border border-orange-700/50 shadow-[0_0_15px_rgba(234,88,12,0.4)]">
          <Flame size={32} className="text-orange-500 animate-pulse" />
        </div>

        <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-stone-500 font-serif tracking-widest uppercase mb-2">
          Identify Yourself
        </h3>
        
        <p className="text-stone-500 text-xs mb-8 italic">
          "The Tethys Archive requires a signature to access the deep records."
        </p>

        {/* 3. PRIMARY ACTION: GOOGLE LOGIN */}
        <button
          onClick={loginGoogle}
          className="w-full group/btn relative flex items-center justify-center gap-3 bg-[#1c1917] hover:bg-[#292524] text-orange-50 px-6 py-4 transition-all duration-200 border border-orange-900/50 hover:border-orange-500 rounded-sm overflow-hidden"
        >
          {/* Rumble Effect Wrapper */}
          <div className="absolute inset-0 bg-orange-600/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
          
          <Hammer size={18} className="relative z-10 text-orange-600 group-hover/btn:animate-[spin_1s_ease-in-out]" />
          <span className="relative z-10 font-serif uppercase tracking-[0.15em] text-xs font-bold">
            Chisel Thyne Name
          </span>
        </button>

        <div className="my-4 flex items-center w-full">
          <div className="h-px bg-stone-800 flex-1"></div>
          <span className="px-2 text-[10px] text-stone-600 uppercase">OR</span>
          <div className="h-px bg-stone-800 flex-1"></div>
        </div>

        {/* 4. SECONDARY ACTION: GHOST MODE */}
        <button
          onClick={loginGhost}
          className="text-xs text-stone-500 hover:text-stone-300 uppercase tracking-widest flex items-center gap-2 transition-colors"
        >
          <Ghost size={14} /> Enter as Ghost
        </button>

      </div>

      {/* Rumble Animation Styles */}
      <style jsx>{`
        @keyframes tilt {
          0%, 50%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(0.5deg); }
          75% { transform: rotate(-0.5deg); }
        }
        .animate-tilt {
          animation: tilt 10s infinite linear;
        }
        .group:hover .animate-tilt {
          animation: tilt 0.5s infinite linear; /* Fast rumble on hover */
        }
      `}</style>
    </div>
  );
}