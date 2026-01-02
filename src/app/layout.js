// src/app/layout.js
import './globals.css';
import { Cinzel, Newsreader, JetBrains_Mono } from 'next/font/google';
import AshCloudNav from '@/components/AshCloudNav';
import PlayerAvatar from '@/components/PlayerAvatar';
import AtmosphericLayer from '@/components/AtmosphericLayer'; // (From previous steps)

// 1. SETUP FONTS
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
        <AshCloudNav />      {/* Top Center Navigation */}
        <PlayerAvatar />     {/* Top Right Thermal Monitor */}

        {/* C. PAGE CONTENT (Z-10) */}
        <main className="relative z-10 flex flex-col min-h-screen pt-24">
          {children}
        </main>
</TethysProvider>
      </body>
    </html>
  );
}