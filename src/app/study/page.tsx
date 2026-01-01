import React from "react";
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

// --- DATA: Your Books & Links ---
const BOOKS = [
  {
    id: 'book1',
    title: 'Book I: The Spark',
    subtitle: 'The Ash Age Begins',
    cover: '/img/book1-cover.jpg', // Make sure you have this image
    desc: 'The surface is silent. The Undercity is waking up. Follow the journey of Kaelen as he descends into the spires to find the truth behind the silence.',
    amazonLink: 'https://amazon.com/author/yourname',
    audioLink: '/listen', // Internal link to your audio section
    price: '$14.99'
  }
];

const SCIENCE_REFS = [
  { title: 'Tectonic Energy Theory', type: 'Geology', link: '#' },
  { title: 'Bioluminescence in Deep Caves', type: 'Biology', link: '#' },
  { title: 'Atmospheric Ash Models', type: 'Meteorology', link: '#' },
];

export default function StudyPage() {
  return (
    <div className="min-h-screen bg-[#1c1917] text-[#e7e5e4] font-serif selection:bg-amber-900 selection:text-white">
      
      {/* 1. ATMOSPHERE: Wood Grain & Lighting */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Subtle noise for paper texture */}
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-5 mix-blend-overlay"></div>
        {/* The "Lamp" Spotlight - Static and Warm */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-amber-500/10 blur-[150px] rounded-full mix-blend-screen"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">
        
        {/* 2. HEADER: Simple & Elegant */}
        <header className="text-center mb-20">
          <div className="inline-block border-b-2 border-amber-800/50 pb-4 px-8">
             <h1 className="text-4xl md:text-5xl tracking-widest text-amber-500/90 drop-shadow-lg">
               THE STUDY
             </h1>
          </div>
          <p className="mt-6 text-stone-500 italic max-w-xl mx-auto">
            "Here, the noise of the machinery fades. Only the truth remains."
          </p>
        </header>

        {/* 3. THE BOOK SHOWCASE (Hero) */}
        {BOOKS.map((book) => (
          <motion.div 
            key={book.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row gap-12 items-center mb-24 bg-[#292524] p-8 md:p-12 rounded-sm border border-[#44403c] shadow-2xl relative"
          >
            {/* Decorative Corner Brackets (The "Photo Album" look) */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-700/50"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-700/50"></div>

            {/* Left: The Cover */}
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="relative w-48 h-72 md:w-64 md:h-96 shadow-[10px_10px_30px_rgba(0,0,0,0.5)] transform hover:scale-[1.02] transition-transform duration-500">
                <Image 
                  src={book.cover} 
                  alt={book.title} 
                  fill 
                  className="object-cover rounded-r-md"
                />
                {/* Book Spine Shadow */}
                <div className="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-black/50 to-transparent"></div>
              </div>
            </div>

            {/* Right: The Pitch */}
            <div className="w-full md:w-2/3 space-y-6 text-center md:text-left">
              <div>
                <h2 className="text-3xl text-amber-100">{book.title}</h2>
                <span className="text-amber-600 uppercase tracking-widest text-sm font-bold">
                  {book.subtitle}
                </span>
              </div>
              
              <p className="text-stone-400 leading-relaxed text-lg">
                {book.desc}
              </p>

              {/* The "Buy" Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
                <a 
                  href={book.amazonLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-8 py-3 bg-amber-700 hover:bg-amber-600 text-amber-50 font-bold uppercase tracking-widest text-xs rounded transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  <span>Purchase Tome</span>
                  <span className="opacity-50">|</span>
                  <span>{book.price}</span>
                </a>

                <Link 
                  href={book.audioLink}
                  className="px-8 py-3 bg-transparent border border-stone-600 hover:border-amber-500 text-stone-400 hover:text-amber-500 font-bold uppercase tracking-widest text-xs rounded transition-all flex items-center justify-center"
                >
                  Listen to Sample
                </Link>
              </div>
            </div>
          </motion.div>
        ))}

        {/* 4. BOTTOM GRID: Author & Science */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* LEFT: About the Author */}
          <div className="bg-[#0c0a09] p-8 border border-stone-800 rounded-sm">
            <h3 className="text-amber-500/80 font-bold uppercase tracking-widest text-xs mb-6 border-b border-stone-800 pb-2">
              The Architect
            </h3>
            <div className="flex gap-6 items-start">
              <div className="w-20 h-20 bg-stone-800 rounded-full overflow-hidden flex-shrink-0 relative">
                 {/* <Image src="/img/author.jpg" fill className="object-cover" /> */}
                 <div className="w-full h-full bg-stone-700 flex items-center justify-center text-2xl text-stone-500">?</div>
              </div>
              <p className="text-stone-400 text-sm leading-relaxed">
                Constructing worlds from static and stone. Exploring the intersection of geology, mythology, and the digital frontier.
              </p>
            </div>
            <div className="mt-6 flex gap-4 text-xs text-stone-500 uppercase tracking-wider">
               <a href="#" className="hover:text-amber-500 transition-colors">Instagram</a>
               <a href="#" className="hover:text-amber-500 transition-colors">Contact</a>
            </div>
          </div>

          {/* RIGHT: The Science Behind the Fiction */}
          <div className="bg-[#0c0a09] p-8 border border-stone-800 rounded-sm">
             <h3 className="text-cyan-600/80 font-bold uppercase tracking-widest text-xs mb-6 border-b border-stone-800 pb-2">
              Research Logs
            </h3>
            <ul className="space-y-4">
              {SCIENCE_REFS.map((ref, i) => (
                <li key={i} className="flex justify-between items-center group cursor-pointer">
                  <span className="text-stone-400 group-hover:text-cyan-400 transition-colors text-sm">
                    {ref.title}
                  </span>
                  <span className="text-[10px] text-stone-600 border border-stone-800 px-2 py-1 rounded">
                    {ref.type}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* 5. BACK TO HUB */}
        <div className="mt-20 text-center">
          <Link href="/" className="text-stone-600 hover:text-stone-400 text-xs uppercase tracking-[0.3em] transition-colors">
            &larr; Return to The Hub
          </Link>
        </div>

      </div>
    </div>
  );
}