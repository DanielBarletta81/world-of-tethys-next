// src/components/CinematicTerminal.jsx
'use client';
import { useMemo, useRef, useState } from 'react';
import { Play, X, MonitorPlay } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import cdn from '@/lib/cdn';

const DEFAULT_THRESHOLDS = [15, 30, 60]; // seconds

export default function CinematicTerminal({
  videoId,
  videoUrl,
  title,
  thumbnail,
  onWatchProgress, // (msWatched, thresholdSeconds) => void
  thresholds = DEFAULT_THRESHOLDS,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const firedRef = useRef(new Set());
  const poster = useMemo(() => (thumbnail ? cdn(thumbnail) : ''), [thumbnail]);
  const useHtml5 = Boolean(videoUrl);

  const embedUrl = useMemo(() => {
    if (videoUrl) return cdn(videoUrl);
    if (!videoId) return '';
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
  }, [videoId, videoUrl]);

  const handleTime = (e) => {
    const t = e?.target?.currentTime || 0;
    thresholds.forEach((th) => {
      if (t >= th && !firedRef.current.has(th)) {
        firedRef.current.add(th);
        onWatchProgress?.(t * 1000, th);
      }
    });
  };

  return (
    <>
      {/* 1. The Trigger Card */}
      <div
        onClick={() => setIsOpen(true)}
        className="group relative w-full aspect-video bg-black border border-stone-800 rounded-sm overflow-hidden cursor-pointer shadow-2xl"
      >
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
          style={{ backgroundImage: poster ? `url(${poster})` : undefined }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border border-white/20 bg-black/50 backdrop-blur-sm flex items-center justify-center group-hover:bg-amber-600 group-hover:border-amber-500 transition-colors duration-300">
            <Play className="text-white fill-white ml-1" size={24} />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
          <div className="flex items-center gap-2 text-amber-500 text-[10px] uppercase tracking-widest font-mono mb-1">
            <MonitorPlay size={12} /> Encrypted Feed
          </div>
          <h3 className="text-white font-display text-lg tracking-wide">{title}</h3>
        </div>
      </div>

      {/* 2. The Cinema Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-stone-500 hover:text-white flex items-center gap-2 text-xs uppercase tracking-widest"
            >
              Close Feed <X size={18} />
            </button>

            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="w-full max-w-6xl aspect-video bg-black border border-stone-800 shadow-[0_0_100px_rgba(245,158,11,0.1)] relative"
            >
              {useHtml5 ? (
                <video
                  src={embedUrl}
                  poster={poster}
                  controls
                  autoPlay
                  className="w-full h-full"
                  onTimeUpdate={handleTime}
                />
              ) : (
                <iframe
                  src={embedUrl}
                  className="w-full h-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title={title}
                />
              )}

              <div className="absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-10 mix-blend-overlay"></div>
            </motion.div>

            <div className="mt-6 text-center">
              <h2 className="text-2xl text-white font-display uppercase tracking-widest">{title}</h2>
              <p className="text-stone-500 text-sm mt-2 font-mono">Streaming from Archive Node 9</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
// World of Tethys || D.C. Barletta
