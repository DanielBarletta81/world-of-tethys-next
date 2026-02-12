import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Audio } from 'expo-av';
import type { AudioTrack } from '../data/audioTracks';

export type PlaybackStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'buffering' | 'error';

type AudioContextValue = {
  activeTrack: AudioTrack | null;
  isPlaying: boolean;
  status: PlaybackStatus;
  positionMillis: number;
  durationMillis: number;
  setTrack: (track: AudioTrack, autoPlay?: boolean) => Promise<void>;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  toggle: (track?: AudioTrack) => Promise<void>;
  seek: (millis: number) => Promise<void>;
};

const AudioContext = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [activeTrack, setActiveTrack] = useState<AudioTrack | null>(null);
  const [status, setStatus] = useState<PlaybackStatus>('idle');
  const [isPlaying, setIsPlaying] = useState(false);
  const [positionMillis, setPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState(0);

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      playsInSilentModeIOS: true
    }).catch(() => {
      setStatus('error');
    });
  }, []);

  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    };
  }, []);

  const onPlaybackStatusUpdate = (playback: Audio.AVPlaybackStatus) => {
    if (!playback.isLoaded) {
      if (playback.error) {
        setStatus('error');
      }
      setIsPlaying(false);
      return;
    }

    setPositionMillis(playback.positionMillis ?? 0);
    setDurationMillis(playback.durationMillis ?? 0);
    setIsPlaying(playback.isPlaying);

    if (playback.isBuffering) {
      setStatus('buffering');
    } else if (playback.isPlaying) {
      setStatus('playing');
    } else {
      setStatus('paused');
    }
  };

  const unload = async () => {
    if (!soundRef.current) return;
    try {
      await soundRef.current.unloadAsync();
    } finally {
      soundRef.current = null;
    }
  };

  const setTrack = async (track: AudioTrack, autoPlay = true) => {
    if (!track.src) {
      setActiveTrack(track);
      setStatus('error');
      return;
    }

    setStatus('loading');
    setActiveTrack(track);
    setPositionMillis(0);
    setDurationMillis(0);

    await unload();

    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: track.src },
        { shouldPlay: autoPlay },
        onPlaybackStatusUpdate
      );
      soundRef.current = sound;
    } catch (err) {
      console.error('Audio load failed:', err);
      setStatus('error');
    }
  };

  const play = async () => {
    if (!soundRef.current && activeTrack) {
      await setTrack(activeTrack, true);
      return;
    }
    await soundRef.current?.playAsync();
  };

  const pause = async () => {
    await soundRef.current?.pauseAsync();
  };

  const toggle = async (track?: AudioTrack) => {
    if (track) {
      if (activeTrack?.id === track.id) {
        if (isPlaying) {
          await pause();
        } else {
          await play();
        }
      } else {
        await setTrack(track, true);
      }
      return;
    }

    if (!activeTrack) return;
    if (isPlaying) {
      await pause();
    } else {
      await play();
    }
  };

  const seek = async (millis: number) => {
    if (!soundRef.current) return;
    await soundRef.current.setPositionAsync(Math.max(0, millis));
  };

  const value = useMemo<AudioContextValue>(() => ({
    activeTrack,
    isPlaying,
    status,
    positionMillis,
    durationMillis,
    setTrack,
    play,
    pause,
    toggle,
    seek
  }), [activeTrack, isPlaying, status, positionMillis, durationMillis]);

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
