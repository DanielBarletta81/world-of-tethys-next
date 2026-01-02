// src/app/layout.js
import './globals.css';
import { Cinzel, Newsreader, JetBrains_Mono } from 'next/font/google';
import WayfinderNav from '@/components/WayFinderNav';
import PlayerAvatar from '@/components/PlayerAvatar';
import AtmosphericLayer from '@/components/AtmosphericLayer'; // (From previous steps)
import { TethysProvider } from '@/context/TethysContext';
import AtmosphericTotem from '@/components/AtmosphericTotem';
// 1. S
const fontHeader = Cinzel({ 
  subsets: ['latin'], 
  variable: '--font-header',
  display: 'swap',
});
const fontBody = Newsreader({ 
  subsets: ['latin'], 
  variable: '--font-body',
  display: 'swap', 
  style: ['normal', 'italic']
});
const fontMono = JetBrains_Mono({ 
  subsets: ['latin'], 
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  title: 'World of Tethys | The Ash Age',
  description: 'Survival in the shadow of the Spire.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fontHeader.variable} ${fontBody.variable} ${fontMono.variable}`}>
      <body className="bg-[#0c0a09] text-stone-200 font-serif overflow-x-hidden selection:bg-forge-orange selection:text-white">
        <TethysProvider>
        {/* A. GLOBAL ATMOSPHERE (Z-0) */}
       <AtmosphericLayer />  {/* Subtle background effects */}

        {/* B. GLOBAL HUD (Z-50) */}
        <WayfinderNav />     {/* Top Center Navigation */}
        <PlayerAvatar />     {/* Top Right Thermal Monitor */}

        {/* C. PAGE CONTENT (Z-10) */}
        <main className="relative z-10 flex flex-col min-h-screen pt-24">
          {children}
          <footer className="mt-auto border-t border-[#2f261f] bg-[#0b0908]/80 backdrop-blur-sm relative z-10">
            <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-stone-400 tracking-wide">
              <span className="uppercase tracking-[0.2em] text-stone-500">World of Tethys</span>
              <span className="text-stone-500">
                © {new Date().getFullYear()} Daniel C. Barletta — All rights reserved.
              </span>
            </div>
          </footer>
        </main>
</TethysProvider>
      </body>
    </html>
  );
}
