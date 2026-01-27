'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Share2 } from 'lucide-react';
import ArchiveLog from './ArchiveLog';

export default function SideStoryLayout({ story, onComplete }) {
  const containerRef = useRef(null);
  const [activeSection, setActiveSection] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  const bgOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.1, 0.3, 0.05]);
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    if (!onComplete) return;
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      if (latest > 0.95) {
        onComplete();
      }
    });
    return () => unsubscribe();
  }, [onComplete, scrollYProgress]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-[#0c0a09] text-stone-300 font-serif selection:bg-amber-900/30 selection:text-amber-100"
    >
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-700 via-orange-500 to-amber-900 z-50 origin-left"
        style={{ scaleX }}
      />

      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          style={{ opacity: bgOpacity }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#451a03_0%,transparent_70%)] mix-blend-screen"
        />
        <div className="absolute inset-0 opacity-10 bg-[url('/noise.svg')]" />
        <motion.div
          style={{ y: yParallax }}
          className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 p-6 lg:p-24">
        <main className="w-full lg:w-2/3 space-y-16">
          <header className="mb-24 space-y-6">
            <div className="flex items-center gap-3 text-amber-600/80 font-mono text-xs tracking-[0.2em] uppercase">
              <span>Log ID: {story.id}</span>
              <span className="w-px h-3 bg-stone-800" />
              <span>{story.date}</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-display text-transparent bg-clip-text bg-gradient-to-b from-stone-100 to-stone-500 leading-[0.9]">
              {story.title}
            </h1>

            <p className="text-lg md:text-xl text-stone-400 italic font-body border-l-2 border-amber-900/30 pl-6 py-2">
              {story.tldr}
            </p>
          </header>

          <article className="prose prose-invert prose-lg max-w-none prose-p:leading-relaxed prose-headings:font-display prose-headings:tracking-wide prose-blockquote:border-l-amber-700 prose-a:text-amber-500 hover:prose-a:text-amber-300 transition-colors">
            {story.content.map((block, idx) => (
              <StorySection
                key={idx}
                block={block}
                index={idx}
                onInView={setActiveSection}
              />
            ))}
          </article>

          <section className="mt-32 pt-12 border-t border-stone-800 flex justify-between items-center">
            <div className="text-xs font-mono text-stone-500 uppercase tracking-widest">
              End of Record
            </div>
            <button className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-500 hover:text-amber-300 transition-colors">
              <Share2 size={14} /> Share Log
            </button>
          </section>
        </main>

        <aside className="hidden lg:block w-1/3 relative">
          <div className="sticky top-32 space-y-8">
            <ArchiveLog
              context={story.context}
              activeSection={activeSection}
              sectionMeta={story.content[activeSection]?.meta}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

function StorySection({ block, index, onInView }) {
  return (
    <motion.div
      onViewportEnter={() => onInView(index)}
      viewport={{ amount: 0.6 }}
      className="mb-12 relative"
    >
      {block.marginNote && (
        <span className="hidden xl:block absolute -left-48 top-2 w-40 text-[10px] font-mono text-stone-500 text-right leading-tight">
          {block.marginNote}
        </span>
      )}
      <div dangerouslySetInnerHTML={{ __html: block.html }} />
    </motion.div>
  );
}
