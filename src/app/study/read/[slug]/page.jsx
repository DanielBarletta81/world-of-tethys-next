'use client';

import { notFound } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useTethys } from '@/context/TethysContext';
import SideStoryLayout from '@/components/stories/SideStoryLayout';
import { STORY_MANIFEST } from '@/data/stories/manifest';

export default function StoryReaderPage({ params }) {
  const { slug } = params;
  const story = STORY_MANIFEST[slug];
  const { applyPlayerAction, setPlayerProfile, playerProfile } = useTethys();
  const hasAwardedRef = useRef(false);
  const [archiveToast, setArchiveToast] = useState(false);

  useEffect(() => {
    if (!story) return;
    hasAwardedRef.current = false;
  }, [story]);

  useEffect(() => {
    if (!story) return;
    const timer = setTimeout(() => {
      setPlayerProfile((profile) => {
        const history = profile?.history || {};
        const storiesRead = Array.isArray(history.storiesRead) ? history.storiesRead : [];
        if (storiesRead.includes(slug)) return profile;
        return {
          ...profile,
          history: {
            ...history,
            storiesRead: [...storiesRead, slug]
          }
        };
      });
      setArchiveToast(true);
      setTimeout(() => setArchiveToast(false), 2000);
    }, 5000);
    return () => clearTimeout(timer);
  }, [setPlayerProfile, slug, story]);

  if (!story) {
    notFound();
  }

  const handleCompletion = () => {
    if (hasAwardedRef.current) return;
    hasAwardedRef.current = true;

    applyPlayerAction({
      id: `read_${slug}`,
      type: 'lore_read',
      intensity: 1,
      xp: story.rewards?.lore || 0,
      region: story.context?.region,
      toast: `Archive Decoded: +${story.rewards?.lore || 0} Lore`
    });
  };

  return (
    <>
      {archiveToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 text-[10px] uppercase tracking-[0.35em] text-amber-300 border border-[#3b1d13] bg-[#0b0706] font-mono archive-toast">
          <div className="absolute inset-0 pointer-events-none opacity-15 mix-blend-soft-light archive-grain" />
          <div className="absolute inset-0 pointer-events-none archive-smoke" />
          <span className="inline-flex items-center gap-2 relative">
            <span className="h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
            Archive Logged
          </span>
        </div>
      )}
      <SideStoryLayout story={story} onComplete={handleCompletion} />
      <style jsx>{`
        .archive-toast {
          animation: archiveStamp 520ms ease-out;
          transform-origin: center;
        }

        .archive-grain {
          background-image: repeating-linear-gradient(
              0deg,
              rgba(255, 255, 255, 0.05) 0px,
              rgba(255, 255, 255, 0.05) 1px,
              transparent 1px,
              transparent 3px
            ),
            repeating-linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.04) 0px,
              rgba(255, 255, 255, 0.04) 1px,
              transparent 1px,
              transparent 4px
            );
        }

        .archive-smoke {
          background-image: radial-gradient(
            circle at 30% 60%,
            rgba(248, 113, 113, 0.18),
            transparent 55%
          );
          filter: blur(6px);
          animation: smokeDrift 3.5s ease-in-out infinite;
          opacity: 0.35;
        }

        @keyframes archiveStamp {
          0% {
            transform: translate(-50%, -8px) scale(1.08);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translate(-50%, 0) scale(1);
            opacity: 1;
          }
        }

        @keyframes smokeDrift {
          0% {
            transform: translate(-4px, 2px) scale(1);
            opacity: 0.25;
          }
          50% {
            transform: translate(6px, -2px) scale(1.05);
            opacity: 0.4;
          }
          100% {
            transform: translate(-2px, 1px) scale(1);
            opacity: 0.25;
          }
        }
      `}</style>
    </>
  );
}
