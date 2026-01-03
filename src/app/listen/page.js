'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

// --- MOCK DATA: Your Audio Logs ---
const TRACKS = [
  {
    id: 1,
    title: 'Log 001: The Weep',
    type: 'Audiobook - Episode 1 Preview',
    duration: '07:20',
    src: '/audio/Ep_01_Preview.mp3', // Placeholder path
    locked: false,
  },
  {
    id: 2,
    title: 'Signal: The Weep',
    type: 'Ambient Lore',
    duration: '03:45',
    src: '/audio/weep-ambience.mp3',
    locked: false,
  },
  {
    id: 3,
    title: 'Transmission: Council',
    type: 'Podcast Ep. 4',
    duration: '45:10',
    src: '/audio/podcast-4.mp3',
    locked: true, // Example of locked content
  }
];

export default function ListenerPage() {
  const [currentTrack, setCurrentTrack] = useState(TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Handle Play/Pause
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Switch Track
  const playTrack = (track) => {
    if (track.locked) return;
    setCurrentTrack(track);
    setIsPlaying(true);
    // Auto-play when switching (needs a small timeout for Ref update)
    setTimeout(() => audioRef.current?.play(), 100);
  };

  return (
    <div className="min-h-screen bg-[#0c0a09] text-stone-200 relative overflow-hidden font-sans">
      
      {/* 1. ATMOSPHERE */}
      {/* Background Texture */}
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-5 pointer-events-none"></div>
      {/* Deep Blue/Cyan Glow (The "Signal") */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-900/10 blur-[100px] rounded-full"></div>

      {/* 2. MAIN CONTENT */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-24">
        
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-white tracking-widest drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
            THE ECHO STONE
          </h1>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.3em] text-cyan-600/80">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
            Frequency: 98.4 Hz
          </div>
        </header>

        {/* 3. THE PLAYER (Hero UI) */}
        <div className="bg-[#1c1917] border border-stone-800 rounded-2xl p-8 md:p-12 shadow-2xl mb-16 relative overflow-hidden group">
          
          {/* Glowing Border Effect */}
          <div className={`absolute inset-0 border-2 border-cyan-500/20 rounded-2xl transition-opacity duration-1000 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}></div>

          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            
            {/* Visualizer Circle */}
            <div className="relative w-32 h-32 flex-shrink-0 flex items-center justify-center">
              <div className={`absolute inset-0 border-4 border-stone-700 rounded-full ${isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''} border-t-cyan-500`}></div>
              <div className="w-24 h-24 bg-stone-800 rounded-full flex items-center justify-center shadow-inner">
                 <span className="text-3xl text-cyan-400">
                   {isPlaying ? '▶' : '||'}
                 </span>
              </div>
              {/* Pulse Waves */}
              {isPlaying && (
                <>
                  <div className="absolute inset-0 border border-cyan-500 rounded-full animate-ping opacity-20"></div>
                  <div className="absolute inset-0 border border-cyan-500 rounded-full animate-ping opacity-20 delay-100"></div>
                </>
              )}
            </div>

            {/* Track Info & Controls */}
            <div className="flex-1 text-center md:text-left w-full">
              <h2 className="text-2xl font-serif text-white mb-1">{currentTrack.title}</h2>
              <p className="text-stone-500 text-sm uppercase tracking-widest mb-6">{currentTrack.type}</p>
              
              {/* Custom Audio Element (Hidden Default, Controlled via Buttons) */}
              <audio 
                ref={audioRef} 
                src={currentTrack.src} 
                onEnded={() => setIsPlaying(false)}
              />

              <div className="flex items-center justify-center md:justify-start gap-4">
                 <button 
                   onClick={togglePlay}
                   className="px-8 py-3 bg-cyan-900/30 hover:bg-cyan-900/50 border border-cyan-700 text-cyan-400 uppercase text-xs font-bold tracking-widest rounded transition-all hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                 >
                   {isPlaying ? 'Stop Signal' : 'Broadcast'}
                 </button>
                 
                 <div className="h-px flex-1 bg-stone-800 mx-4 hidden md:block"></div>
                 <span className="font-mono text-stone-500 text-xs">{currentTrack.duration}</span>
              </div>
            </div>
          </div>

          {/* Background Digital Noise */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-20"></div>
        </div>

        {/* 4. THE PLAYLIST (Transmission Log) */}
        <div className="max-w-2xl mx-auto">
          <h3 className="text-stone-500 text-xs uppercase tracking-[0.2em] mb-6 border-b border-stone-800 pb-2">
            Archived Transmissions
          </h3>

          <ul className="space-y-4">
            {TRACKS.map((track) => (
              <li 
                key={track.id}
                onClick={() => playTrack(track)}
                className={`group flex items-center justify-between p-4 rounded border transition-all cursor-pointer
                  ${currentTrack.id === track.id 
                    ? 'bg-stone-800 border-cyan-900/50' 
                    : 'bg-transparent border-stone-800 hover:border-stone-600'
                  }
                  ${track.locked ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold font-mono
                    ${currentTrack.id === track.id ? 'bg-cyan-900 text-cyan-400' : 'bg-stone-900 text-stone-600'}
                  `}>
                    {track.locked ? '🔒' : (currentTrack.id === track.id && isPlaying ? 'II' : track.id)}
                  </div>
                  <div>
                    <div className={`font-serif ${currentTrack.id === track.id ? 'text-cyan-200' : 'text-stone-300 group-hover:text-white'}`}>
                      {track.title}
                    </div>
                    <div className="text-[10px] text-stone-500 uppercase tracking-wide">
                      {track.type}
                    </div>
                  </div>
                </div>

                <div className="text-xs font-mono text-stone-600 group-hover:text-stone-400">
                  {track.locked ? 'ENCRYPTED' : track.duration}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* 5. EXTERNAL LINKS */}
        <div className="mt-20 text-center space-x-6">
          <a href="#" className="text-stone-500 hover:text-cyan-400 text-xs uppercase tracking-widest transition-colors">Spotify</a>
          <a href="#" className="text-stone-500 hover:text-cyan-400 text-xs uppercase tracking-widest transition-colors">Apple Podcasts</a>
          <a href="#" className="text-stone-500 hover:text-cyan-400 text-xs uppercase tracking-widest transition-colors">Audible</a>
        </div>

        {/* Back Link */}
        <div className="mt-12 text-center">
           <Link href="/" className="text-stone-700 hover:text-stone-400 text-[10px] uppercase tracking-[0.3em] transition-colors">
             &larr; Return to Hub
           </Link>
        </div>

      </div>
    </div>
  );
}