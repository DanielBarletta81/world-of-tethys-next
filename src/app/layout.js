import { Cinzel, Newsreader, JetBrains_Mono } from 'next/font/google';
import { getAmazonBookUrl } from '@/lib/links';
import { auth0 } from '@/lib/auth0';
import { TethysProvider } from '@/context/TethysContext';
import AuthAppProvider from '@/components/AuthAppProvider';

// --- VISUALS & UI ---
import AtmosphericLayer from '@/components/AtmosphericLayer';
import InkDropOverlay from '@/components/InkDropOverlay';
import AshCloudNav from '@/components/AshCloudNav';
import PlayerAvatar from '@/components/PlayerAvatar';
import SensoryNetwork from '@/components/SensoryNetwork'; // The "Whisper" Network
import './globals.css';

// --- FONTS ---
// 1. "Cinzel" for High Titles (The Epic Feel)
const fontHeader = Cinzel({ 
  subsets: ['latin'], 
  variable: '--font-header',
  display: 'swap',
});

// 2. "Newsreader" for Long Form Text (The Book Feel)
const fontBody = Newsreader({ 
  subsets: ['latin'], 
  variable: '--font-body',
  display: 'swap', 
  style: ['normal', 'italic']
});

// 3. "JetBrains Mono" for UI/Data (The Sci-Fi Feel)
const fontMono = JetBrains_Mono({ 
  subsets: ['latin'], 
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  title: 'World of Tethys | The Ash Age',
  description: 'Survival in the shadow of the Spire. A living archive by D.C. Barletta.',
};

export default async function RootLayout({ children }) {
  const session = await auth0.getSession();
  const amazonUrl = getAmazonBookUrl();
  const currentYear = new Date().getFullYear();

  return (
    <html lang="en" className={`${fontHeader.variable} ${fontBody.variable} ${fontMono.variable}`}>
      <body className="bg-[#0c0a09] text-[#e7e5e4] antialiased overflow-x-hidden selection:bg-amber-900 selection:text-white font-body">
        
        {/* 1. STATE PROVIDERS */}
        <AuthAppProvider user={session?.user}>
          <TethysProvider>
            
            {/* 2. ATMOSPHERE (Layer 0 - Background) */}
            <div className="fixed inset-0 z-0 pointer-events-none">
              <AtmosphericLayer />
              <InkDropOverlay />
            </div>

            {/* 3. FLOATING HUD (Layer 50 - UI) */}
            <AshCloudNav />      {/* Top Center */}
            <PlayerAvatar />     {/* Top Right */}
            <SensoryNetwork />   {/* Bottom Left (The Whispers) */}

            {/* 4. MAIN CONTENT (Layer 10 - Scrollable) */}
            <div className="relative z-10 flex flex-col min-h-screen">
              <main className="flex-grow">
                {children}
              </main>

              {/* 5. THE FOOTER (Layer 10 - Bottom) */}
              <footer className="border-t border-[#292524] bg-[#0c0a09]/90 backdrop-blur-md pt-12 pb-8 mt-20 relative">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-end gap-6">
                  
                  {/* Left: Identity */}
                  <div>
                    <h4 className="font-header text-amber-500/80 text-lg uppercase tracking-widest">
                      World of Tethys
                    </h4>
                    <p className="font-mono text-[10px] text-stone-600 uppercase tracking-[0.2em] mt-2">
                      System Status: Ash Fall Critical
                    </p>
                    <p className="font-mono text-[10px] text-stone-600 uppercase tracking-[0.2em] mt-1">
                      &copy; {currentYear} D.C. Barletta. All Rights Reserved.
                    </p>
                  </div>

                  {/* Right: Utility Links */}
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-stone-500">
                      <a href="#" className="hover:text-amber-500 transition-colors">Terms of Entry</a>
                      <a href="#" className="hover:text-amber-500 transition-colors">Privacy Protocol</a>
                      <a href="#" className="hover:text-amber-500 transition-colors">Contact The Council</a>
                    </div>
                    
                    {amazonUrl && (
                      <a 
                        href={amazonUrl}
                        target="_blank" 
                        rel="noreferrer"
                        className="mt-4 text-[10px] font-mono text-stone-700 hover:text-stone-400 transition-colors"
                      >
                        [ External Link: Amazon Datastream ]
                      </a>
                    )}
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