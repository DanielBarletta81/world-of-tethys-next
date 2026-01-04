'use client';

import React from 'react';
import Link from 'next/link';
// Components
import TethysNexus from '../components/TethysNexus';
import StarterLoadout from '../components/StarterLoadout';
import BookBanner from '../components/BookBanner';
import LoginWidget from '../components/LoginWidget'; // The sticky top-right one
import LoginCard from '../components/LoginCard'; 
   // The new big center card
import Footer from '@/components/Footer';
import { Anchor, BookOpen, Database, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user, loading } = useAuth();

  return (
    <main className="min-h-screen bg-[#0c0a09] text-[#e7e5e4] font-serif selection:bg-amber-900 selection:text-white relative overflow-x-hidden">
      
      {/* GLOBAL UI */}
      <LoginWidget /> 
      <BookBanner />

      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-start pt-16 pb-12 px-4 md:px-8 border-b border-[#292524]">
        
        {/* Title */}
        <div className="text-center mb-8 z-10 relative">
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-orange-600 to-red-900 mb-4 drop-shadow-sm font-serif">
            WORLD OF TETHYS
          </h1>
          <div className="flex items-center justify-center gap-4 text-xs text-[#a8a29e] uppercase tracking-[0.3em] font-sans">
            <span>Archaeological Reconstruction</span>
            <span className="w-1 h-1 bg-amber-600 rounded-full"></span>
            <span>Era: 111 M.Y.A.</span>
          </div>
        </div>

        {/* If NOT logged in, show the new Login Card prominently */}
        {!user && !loading && (
          <div className="z-20 w-full mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <LoginCard />
          </div>
        )}

        {/* The Map (Always visible but serves as background if not logged in) */}
        <div className="w-full max-w-6xl flex-1 min-h-[600px] shadow-2xl rounded-xl overflow-hidden border border-[#292524] relative z-0 bg-[#0c0a09]">
           <TethysNexus />
           {/* Add a blur/lock overlay if you want to gate the map behind login */}
           {/* {!user && <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-10 flex items-center justify-center pointer-events-none"></div>} */}
        </div>
        
      </section>

      {/* 2. EXPLORER INVENTORY */}
      <section className="max-w-7xl mx-auto px-4 py-12 border-b border-[#292524]/50">
        <div className="flex items-center gap-4 mb-8">
           <div className="h-[1px] bg-[#292524] flex-1"></div>
           <h2 className="text-sm font-sans uppercase tracking-[0.3em] text-[#78716c]">Explorer Inventory</h2>
           <div className="h-[1px] bg-[#292524] flex-1"></div>
        </div>
        <StarterLoadout />
      </section>

      {/* 3. ACCESS TERMINALS */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <Link href="/pteros" className="group relative block bg-[#1c1917] border border-[#292524] hover:border-cyan-700 transition-all duration-500 overflow-hidden rounded-lg h-full p-8">
             <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <Anchor className="text-cyan-600 mb-4" />
             <h3 className="text-2xl font-bold text-[#e7e5e4] mb-2 font-serif">Pteros Station</h3>
             <p className="text-sm text-[#a8a29e] mb-4">Ecological monitoring of the Twin Straits.</p>
             <div className="text-xs uppercase tracking-widest text-cyan-600 flex gap-2 items-center">Access <ArrowRight size={12}/></div>
          </Link>

          <Link href="/codex" className="group relative block bg-[#1c1917] border border-[#292524] hover:border-amber-700 transition-all duration-500 overflow-hidden rounded-lg h-full p-8">
             <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <BookOpen className="text-amber-600 mb-4" />
             <h3 className="text-2xl font-bold text-[#e7e5e4] mb-2 font-serif">The Codex</h3>
             <p className="text-sm text-[#a8a29e] mb-4">Decipher ancient glyphs and history.</p>
             <div className="text-xs uppercase tracking-widest text-amber-600 flex gap-2 items-center">Decrypt <ArrowRight size={12}/></div>
          </Link>

          <Link href="/mystics" className="group relative block bg-[#1c1917] border border-[#292524] hover:border-teal-700 transition-all duration-500 overflow-hidden rounded-lg h-full p-8">
             <div className="absolute inset-0 bg-gradient-to-t from-teal-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <Database className="text-teal-600 mb-4" />
             <h3 className="text-2xl font-bold text-[#e7e5e4] mb-2 font-serif">Vernal Oracle</h3>
             <p className="text-sm text-[#a8a29e] mb-4">Root network whispers and fungal analysis.</p>
             <div className="text-xs uppercase tracking-widest text-teal-600 flex gap-2 items-center">Enter <ArrowRight size={12}/></div>
          </Link>

        </div>
      </section>

      <Footer />
    </main>
  );
}