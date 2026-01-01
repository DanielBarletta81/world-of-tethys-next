'use client';

import { motion } from 'framer-motion';
import { Book, Calendar, ShoppingBag } from 'lucide-react';
import { getAmazonBookUrl } from '@/lib/links';

export default function BookManifest() {
  const amazonUrl = getAmazonBookUrl();
  if (!amazonUrl) return null;

  return (
    <div className="bg-[#e6ded0] border-2 border-[#8a3c23] p-1 shadow-[6px_6px_0_rgba(138,60,35,0.2)] group relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-50 pointer-events-none" />

      <div className="bg-[#f5efe4] border border-[#8a3c23]/30 p-5 relative z-10 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-[#8a3c23] block mb-1">
              Incoming Artifact
            </span>
            <h3 className="font-display text-xl text-[#1a1510] leading-none">Book I: Sky City</h3>
          </div>
          <Book className="w-5 h-5 text-[#8a3c23] opacity-80" />
        </div>

        <div className="flex items-center gap-3 border-y border-[#3d2b1f]/10 py-3">
          <Calendar className="w-4 h-4 text-[#5c4f43]" />
          <div>
            <span className="block text-[9px] font-mono uppercase tracking-widest text-[#5c4f43]">Drop Date</span>
            <span className="font-bold text-[#1a1510] font-display text-lg">February 28</span>
          </div>
        </div>

        <p className="text-xs font-serif italic text-[#5c4f43] leading-relaxed">
          "The digital archive is active now. The physical key arrives in February."
        </p>

        <motion.a
          href={amazonUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          className="flex items-center justify-center gap-2 w-full py-3 bg-[#8a3c23] text-[#e6ded0] font-mono text-[10px] uppercase tracking-[0.25em] hover:bg-[#1a1510] transition-colors"
        >
          <ShoppingBag className="w-3 h-3" />
          <span>Pre-Order Now</span>
        </motion.a>
      </div>

      <div className="absolute -right-6 -top-6 w-12 h-12 bg-[#8a3c23] rotate-45 z-20" />
    </div>
  );
}
