'use client';

import React from 'react';
import { useAudio } from '../context/AuthContext'; // Correction: Import from AudioContext, fixed below
import { useAudio as useGlobalAudio } from '../context/AudioContext'; 
import { Play, Pause, X, Volume2, Radio } from 'lucide-react';

export default function GlobalAudioPlayer() {
  const { currentTrack, isPlaying, togglePlay, closePlayer, volume, setVolume } = useGlobalAudio();

  // Don't render if no track is selected
  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-in slide-in-from-bottom-10 fade-in duration-500">
      
      {/* The Device Frame (Obsidian) */}
      <div className="bg-[#0c0a09] border border-[#292524] rounded-lg shadow-[0_0_40px_rgba(0,0,0,0.8)] p-4 w-72 relative overflow-hidden group">
        
        {/* Magma Glow Background (Active only when playing) */}
        <div className={`absolute inset-0 bg-gradient-to-tr from-orange-900/20 to-transparent transition-opacity duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}></div>
        
        {/* Close Button */}
        <button 
          onClick={closePlayer}
          className="absolute top-2 right-2 text-[#57534e] hover:text-red-500 transition-colors"
        >
          <X size={12} />
        </button>

        {/* Display Screen */}
        <div className="flex items-center gap-4 relative z-10">
          
          {/* The "Eye" (Play/Pause) */}
          <button 
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-[#1c1917] border border-orange-900/30 flex items-center justify-center text-orange-600 hover:text-orange-400 hover:border-orange-500 transition-all shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-1" />}
          </button>

          {/* Track Info */}
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center gap-2 mb-1">
               <span className="text-[9px] uppercase tracking-widest text-[#57534e] border border-[#292524] px-1 rounded">
                 {currentTrack.type}
               </span>
               {isPlaying && (
                 <div className="flex gap-0.5 items-end h-3">
                   <div className="w-0.5 bg-orange-600 animate-[bounce_1s_infinite] h-2"></div>
                   <div className="w-0.5 bg-orange-600 animate-[bounce_1.2s_infinite] h-3"></div>
                   <div className="w-0.5 bg-orange-600 animate-[bounce_0.8s_infinite] h-1"></div>
                 </div>
               )}
            </div>
            <div className="text-xs font-serif text-[#e7e5e4] truncate w-full">
              {currentTrack.title}
            </div>
            <div className="text-[10px] text-[#78716c] truncate">
              {currentTrack.artist}
            </div>
          </div>

        </div>

        {/* Volume Slider (Hidden normally, subtle at bottom) */}
        <div className="mt-3 flex items-center gap-2 relative z-10">
           <Volume2 size={10} className="text-[#57534e]" />
           <input 
             type="range" 
             min="0" 
             max="1" 
             step="0.01" 
             value={volume}
             onChange={(e) => setVolume(parseFloat(e.target.value))}
             className="w-full h-1 bg-[#1c1917] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-orange-700 [&::-webkit-slider-thumb]:rounded-full"
           />
        </div>

      </div>
    </div>
  );
}