'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Lock, FileText, Headphones, CheckCircle } from 'lucide-react';
import { useTethys } from '@/context/TethysContext';
import { cdn } from '@/lib/cdn';

const TYPE_META = {
  video: { label: 'projection', icon: Play },
  audio: { label: 'resonance', icon: Headphones },
  text: { label: 'record', icon: FileText }
};

export default function CaveWallTerminal({
  mediaId,
  title,
  type = 'video',
  src,
  previewSrc,
  thumbnail,
  rewards = { lore: 5 }
}) {
  const { hasOnboarded, consumeMedia, playerProfile, applyPlayerAction } = useTethys();
  const [isOpen, setIsOpen] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const isConsumed = playerProfile?.history?.mediaConsumed?.includes(mediaId);
  const previewRef = useRef(null);
  const [previewReady, setPreviewReady] = useState(false);
  const [previewInView, setPreviewInView] = useState(false);

  const wallTexture = useMemo(
    () => cdn('/img/bg/obsidian-coast-4k.jpg'),
    []
  );
  const poster = useMemo(
    () => (thumbnail ? cdn(thumbnail) : ''),
    [thumbnail]
  );
  const mediaUrl = useMemo(() => {
    if (!src) return '';
    if (src.startsWith('http')) return src;
    return cdn(src);
  }, [src]);
  const previewUrl = useMemo(() => {
    if (!previewSrc) return '';
    if (previewSrc.startsWith('http')) return previewSrc;
    return cdn(previewSrc);
  }, [previewSrc]);

  useEffect(() => {
    if (!previewUrl) return;
    const target = previewRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setPreviewInView(entry.isIntersecting);
        });
      },
      { threshold: 0.25 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [previewUrl]);

  useEffect(() => {
    const video = previewRef.current;
    if (!video) return;
    if (!previewReady) return;
    if (!previewInView) {
      video.pause();
      return;
    }
    const play = async () => {
      try {
        await video.play();
      } catch {
        /* autoplay blocked */
      }
    };
    play();
  }, [previewInView, previewReady]);

  const handleOpen = () => {
    if (!hasOnboarded) return;
    setIsOpen(true);
  };

  const handleClaim = async () => {
    if (isConsumed || isClaiming) return;
    setIsClaiming(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    await consumeMedia(mediaId, type, rewards);
    setIsClaiming(false);
  };

  const handleMediaPlay = () => {
    applyPlayerAction({
      id: `terminal_${mediaId || 'media'}_${type}`,
      type: 'restorative',
      intensity: 0.3,
      xp: 2,
      repeatPenalty: false,
      envPressure: 0.05
    });
  };

  const TypeIcon = TYPE_META[type]?.icon || Play;
  const typeLabel = TYPE_META[type]?.label || 'projection';

  if (!hasOnboarded) {
    return (
      <div className="relative w-full aspect-video bg-[#0c0a09] border border-stone-800 rounded-sm flex items-center justify-center opacity-60">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: `url(${cdn('/noise.svg')})` }}
        />
        <div className="text-center space-y-2">
          <Lock className="w-7 h-7 mx-auto text-stone-600" />
          <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-mono">
            Terminal Locked
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        onClick={handleOpen}
        className="group relative w-full aspect-video bg-black border border-stone-800 rounded-sm overflow-hidden cursor-pointer shadow-2xl"
      >
        {poster && (
          <div
            className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ${
              previewReady && previewInView ? 'opacity-0' : 'opacity-70 group-hover:opacity-95 group-hover:scale-105'
            }`}
            style={{ backgroundImage: `url(${poster})` }}
          />
        )}
        {previewUrl ? (
          <video
            ref={previewRef}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
              previewReady && previewInView ? 'opacity-70 group-hover:opacity-95' : 'opacity-0'
            }`}
            src={previewUrl}
            poster={poster || undefined}
            muted
            autoPlay
            loop
            playsInline
            onCanPlay={() => setPreviewReady(true)}
            onMouseEnter={() => previewRef.current?.pause()}
            onMouseLeave={() => previewRef.current?.play()}
          />
        ) : (
          !poster && (
            <div className="absolute inset-0 bg-black/40" />
          )
        )}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_120%)] opacity-80" />
        <div
          className="absolute inset-0 opacity-20 mix-blend-multiply"
          style={{ backgroundImage: `url(${wallTexture})` }}
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className={`w-12 h-12 rounded-full border bg-black/60 backdrop-blur-sm flex items-center justify-center transition-colors duration-300 ${
              isConsumed
                ? 'border-emerald-500/50 text-emerald-400'
                : 'border-stone-500/40 text-stone-100 group-hover:border-amber-500 group-hover:text-amber-400'
            }`}
          >
            {isConsumed ? <CheckCircle size={18} /> : <TypeIcon size={18} className="ml-0.5" />}
          </div>

          <div className="mt-4 text-center">
            <h3 className="text-white font-display text-lg tracking-wide drop-shadow-md">
              {title}
            </h3>
            <div className="flex justify-center gap-2 mt-1">
              {!isConsumed && rewards?.lore ? (
                <span className="text-[9px] font-mono text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-900/50">
                  +{rewards.lore} LORE
                </span>
              ) : null}
              <span className="text-[9px] font-mono text-stone-500 uppercase tracking-wider bg-black/40 px-2 py-0.5 rounded">
                {typeLabel}
              </span>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-xl"
          >
            <div
              className="absolute inset-0 opacity-25 bg-cover mix-blend-lighten pointer-events-none"
              style={{ backgroundImage: `url(${wallTexture})` }}
            />
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-full max-w-5xl aspect-video bg-black shadow-[0_0_80px_rgba(251,191,36,0.08)] overflow-hidden rounded-md border border-stone-800"
            >
              {type === 'video' && mediaUrl && (
                mediaUrl.endsWith('.mp4') || mediaUrl.endsWith('.webm') || mediaUrl.endsWith('.mov') ? (
                  <video
                    src={mediaUrl}
                    className="w-full h-full opacity-90 mix-blend-screen"
                    controls
                    autoPlay
                    onPlay={handleMediaPlay}
                  />
                ) : (
                  <iframe
                    src={mediaUrl}
                    className="w-full h-full opacity-90 mix-blend-screen"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    title={title}
                  />
                )
              )}
              {type === 'audio' && mediaUrl && (
                <div className="w-full h-full flex items-center justify-center">
                  <audio controls autoPlay src={mediaUrl} className="w-2/3" onPlay={handleMediaPlay} />
                </div>
              )}
              {type === 'text' && mediaUrl && (
                <div className="w-full h-full flex items-center justify-center">
                  <a
                    href={mediaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-stone-200 text-sm uppercase tracking-[0.2em] border border-stone-600 px-6 py-3 rounded hover:text-white hover:border-stone-300 transition-colors"
                  >
                    Open Record
                  </a>
                </div>
              )}

              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.85))]" />
              <div
                className="absolute inset-0 opacity-20 mix-blend-multiply pointer-events-none"
                style={{ backgroundImage: `url(${wallTexture})` }}
              />

              <div className="absolute bottom-5 right-5">
                {!isConsumed ? (
                  <button
                    onClick={handleClaim}
                    disabled={isClaiming}
                    className="flex items-center gap-2 px-5 py-2 border border-amber-700/60 bg-amber-950/50 text-amber-200 text-[10px] uppercase tracking-[0.2em] rounded hover:border-amber-400 hover:text-amber-100 transition-colors"
                  >
                    {isClaiming ? 'Integrating...' : 'Archive Memory'}
                  </button>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2 border border-emerald-800/50 bg-emerald-950/40 text-emerald-300 text-[10px] uppercase tracking-[0.2em] rounded">
                    <CheckCircle size={14} /> Archived
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-5 right-5 text-stone-500 hover:text-stone-200 text-[10px] uppercase tracking-[0.2em]"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
