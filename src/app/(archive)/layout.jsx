'use client';

import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import JournalNav from '@/components/JournalNav';
import { useTethys } from '@/context/TethysContext';

export default function ArchiveLayout({ children }) {
  const pathname = usePathname();
  const { playerProfile } = useTethys();
  const level = Number(playerProfile?.progression?.level || 1);
  const showLevel2 = level >= 5;
  const showLevel3 = level >= 10;

  return (
    <div className="min-h-screen bg-[#050403] text-stone-200">
      <header className="px-6 pt-8 pb-4 border-b border-stone-800">
        <div className="text-[11px] tracking-[0.35em] uppercase text-stone-400 font-mono">
          WORLD OF TETHYS
        </div>
        <div className="mt-2 text-[10px] tracking-[0.3em] uppercase text-stone-600">
          Archive Level I
        </div>
        {showLevel2 && (
          <div className="mt-1 text-[10px] tracking-[0.3em] uppercase text-stone-600">
            Archive Level II
          </div>
        )}
        {showLevel3 && (
          <div className="mt-1 text-[10px] tracking-[0.3em] uppercase text-stone-600">
            Archive Level III
          </div>
        )}
        <div className="mt-6">
          <JournalNav />
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="px-6 py-10"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
