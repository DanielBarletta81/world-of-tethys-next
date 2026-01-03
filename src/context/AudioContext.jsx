'use client';

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
// Import the manifest file we just created
import { AUDIO_TRACKS } from '../lib/audio-manifest';

const AudioContext = createContext();

export function AudioProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(null); // Null = Player hidden/inactive
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef(null);

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
  }, [currentTrack]);

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
  const playTrack = (trackId) => {
    const track = AUDIO_TRACKS.find(t => t.id === trackId);
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

  const value = {
    currentTrack,
    isPlaying,
    volume,
    setVolume,
    playTrack,
    togglePlay,
    closePlayer
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  return useContext(AudioContext);
}