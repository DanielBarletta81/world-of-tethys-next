import { Cinzel, Newsreader, JetBrains_Mono } from 'next/font/google';
import { getAmazonBookUrl } from '@/lib/links';
import { auth0 } from '@/lib/auth0';
import { TethysProvider } from '@/context/TethysContext';
import AuthAppProvider from '@/components/AuthAppProvider';

// --- THE CORE UI STACK ---
import AtmosphericLayer from '@/components/AtmosphericLayer';
import InkDropOverlay from '@/components/InkDropOverlay';
import AshCloudNav from '@/components/AshCloudNav';
import PlayerAvatar from '@/components/PlayerAvatar';
import SensoryNetwork from '@/components/SensoryNetwork'; 
import './globals.css';

// --- FONTS ---
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

export default async function RootLayout({ children }) {
  const session = await auth0.getSession();
  const amazonUrl = getAmazonBookUrl();
  const currentYear = new Date().getFullYear();

  return (
    <html lang="en" className={`${fontHeader.variable} ${fontBody.variable} ${fontMono.variable}`}>
      <body className="bg-tethys-bg text-[#e7e5e4] antialiased overflow-x-hidden selection:bg-amber-900 selection:text-white font-body">
        
        {/* 1. DATA LAYER */}
        <AuthAppProvider user={session?.user}>
          <TethysProvider>
            
            {/* 2. ATMOSPHERE LAYER (Z-0) 
                These sit behind everything. You do NOT need to add noise to individual pages anymore. */}
            <div className="fixed inset-0 z-0 pointer-events-none">
              <AtmosphericLayer />
              <InkDropOverlay />
            </div>

            {/* 3. HUD LAYER (Z-50) 
                These float on top of everything. */}
            <AshCloudNav />      
            <PlayerAvatar />     
            <SensoryNetwork />   

            {/* 4. CONTENT LAYER (Z-10) 
                This is where your Page content renders. */}
            <div className="relative z-10 flex flex-col min-h-screen">
              <main className="flex-grow">
                {children}
              </main>

              {/* GLOBAL FOOTER */}
              <footer className="border-t border-[#292524] bg-[#0c0a09]/90 backdrop-blur-md pt-12 pb-8 mt-20">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-end gap-6">
                  <div>
                    <h4 className="font-header text-amber-500/80 text-lg uppercase tracking-widest">
                      World of Tethys
                    </h4>
                    <p className="font-mono text-[10px] text-stone-600 uppercase tracking-[0.2em] mt-2">
                      System Status: Ash Fall Critical
                    </p>
                    <p className="font-mono text-[10px] text-stone-600 uppercase tracking-[0.2em] mt-1">
                      &copy; {currentYear} D.C. Barletta.
                    </p>
                  </div>
                  {amazonUrl && (
                    <a href={amazonUrl} target="_blank" rel="noreferrer" className="text-[10px] font-mono text-stone-700 hover:text-stone-400 transition-colors">
                      [ External Link: Amazon Datastream ]
                    </a>
                  )}
                </div>
              </footer>
            </div>
          </TethysProvider>
        </AuthAppProvider>
      </body>
    </html>
  );
}