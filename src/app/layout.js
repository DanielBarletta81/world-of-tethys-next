import Link from 'next/link';
import { getAmazonBookUrl } from '@/lib/links';
import { auth0 } from '@/lib/auth0';
import { TethysProvider } from '@/context/TethysContext';
import AnaphaseWrapper from '@/components/AnaphaseWrapper';
import AuthAppProvider from '@/components/AuthAppProvider';
import AtmosphericLayer from '@/components/AtmosphericLayer';
import InkDropOverlay from '@/components/InkDropOverlay';

// --- NEW IMPORTS ---
import AshCloudNav from '@/components/AshCloudNav';
import PlayerAvatar from '@/components/PlayerAvatar';
import './globals.css';

export const metadata = {
  title: 'World of Tethys',
  description: 'The Ash Age Has Begun. Survive the Spire.',
};

export default async function RootLayout({ children }) {
  const amazonUrl = getAmazonBookUrl();
  const session = await auth0.getSession();

  return (
    <html lang="en">
      <body className="bg-[#0c0a09] text-[#e7e5e4] antialiased overflow-x-hidden selection:bg-amber-900 selection:text-white">
        
        {/* 1. PROVIDERS (State Management) */}
        <AuthAppProvider user={session?.user}>
          <TethysProvider>
            
            {/* 2. ATMOSPHERE (Visuals underneath everything) */}
            <div className="fixed inset-0 z-0 pointer-events-none">
              <AtmosphericLayer />
              <InkDropOverlay />
            </div>

            {/* 3. HEADLESS UI (Floating HUD Elements) */}
            {/* The Storm Nav (Top Center) */}
            <AshCloudNav />
            
            {/* The Player Stats (Top Right) */}
            <PlayerAvatar />

            {/* 4. MAIN CONTENT (The Stage) */}
            <div className="relative z-10 min-h-screen flex flex-col">
              
              <main className="flex-grow">
                {/* Your page transition wrapper */}
                <AnaphaseWrapper>
                  {children}
                </AnaphaseWrapper>
              </main>

              {/* 5. MINIMAL FOOTER (The Foundation) */}
              <footer className="border-t border-[#292524] bg-[#1c1917]/80 backdrop-blur-md py-12 mt-auto relative z-20">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                  
                  {/* Author Cred */}
                  <div className="text-center md:text-left">
                    <h4 className="text-amber-500/80 font-serif tracking-wider uppercase text-sm">
                      World of Tethys
                    </h4>
                    <p className="text-[10px] text-stone-600 uppercase tracking-[0.3em] mt-1">
                      Architect: D.C. Barletta
                    </p>
                  </div>

                  {/* Primary Call to Action (Amazon) */}
                  {amazonUrl && (
                    <a
                      href={amazonUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative px-8 py-3 bg-[#292524] border border-[#44403c] hover:border-amber-600 transition-all duration-500 overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-amber-600/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                      <span className="relative text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400 group-hover:text-amber-500 transition-colors">
                        Acquire Book I
                      </span>
                    </a>
                  )}

                  {/* Secondary Links (Hidden in footer now to clean up header) */}
                  <div className="flex gap-6 text-[10px] uppercase tracking-widest text-stone-600">
                    <Link href="/registry" className="hover:text-stone-300 transition-colors">Registry</Link>
                    <Link href="/science" className="hover:text-stone-300 transition-colors">Science</Link>
                  </div>

                </div>
              </footer>

            </div>

          </TethysProvider>
        </AuthAppProvider>
      </body>
    </html>
  );
}