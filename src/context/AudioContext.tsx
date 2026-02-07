'use client';

import React, { createContext, useContext, useState, useRef, useEffect, useMemo } from 'react';
// Import the manifest file we just created
import { AUDIO_TRACKS } from '../lib/audio-manifest';

type AudioTrack = {
  id: string;
  src: string;
  label?: string;
};

type AudioContextValue = {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  volume: number;
  setVolume: (v: number) => void;
  playTrack: (trackId: string) => void;
  togglePlay: () => void;
  closePlayer: () => void;
};

const AudioContext = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null); // Null = Player hidden/inactive
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Audio Object (Client Side Only)
  useEffect(() => {
    audioRef.current = new Audio();
    
    // Handle track ending
    audioRef.current.addEventListener('ended', () => setIsPlaying(false));
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Effect: Handle Track Switching
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;

    // Only change source if it's a new track
    if (audioRef.current.src !== currentTrack.src) {
        audioRef.current.src = currentTrack.src;
        audioRef.current.load();
        if (isPlaying) audioRef.current.play().catch(e => console.log("Autoplay prevented:", e));
    }
  }, [currentTrack, isPlaying]);

  // Effect: Handle Play/Pause
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;

    if (isPlaying) {
      audioRef.current.play().catch(e => console.log("Playback error:", e));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrack]);

  // Effect: Handle Volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Actions
  const playTrack = (trackId: string) => {
    const track = AUDIO_TRACKS.find((t) => t.id === trackId);
    if (track) {
      if (currentTrack?.id === trackId) {
        // Toggle if same track
        setIsPlaying(!isPlaying);
      } else {
        // New track
        setCurrentTrack(track);
        setIsPlaying(true);
      }
    }
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  const closePlayer = () => {
    setIsPlaying(false);
    setCurrentTrack(null);
  };

  const value = useMemo<AudioContextValue>(() => ({
    currentTrack,
    isPlaying,
    volume,
    setVolume,
    playTrack,
    togglePlay,
    closePlayer
  }), [currentTrack, isPlaying, volume]);

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const ctx = useContext(AudioContext);
  if (!ctx) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return ctx;
}
// World of Tethys || D.C. Barletta
