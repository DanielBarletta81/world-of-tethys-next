import {
  IM_Fell_English,
  JetBrains_Mono,
  Nanum_Pen_Script,
  Space_Grotesk,
  Spectral,
  Uncial_Antiqua,
} from 'next/font/google';
import { AuthProvider } from '../context/AuthContext';
import { TethysProvider } from '../context/TethysContext';
import { AudioProvider } from '../context/AudioContext';
import GlobalAudioPlayer from '../components/GlobalAudioPlayer';
import GlobalAtmosphere from '../components/GlobalAtmosphere';
import GuestUpgradeGate from '../components/GuestUpgradeGate';
import './globals.css';
import Footer from '@/components/layout/Footer';
import cdn from '@/lib/cdn';
import Link from 'next/link';

const skySans = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sky',
  display: 'swap',
});

const naturalist = Spectral({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-naturalist',
  display: 'swap',
});

const fieldNotes = IM_Fell_English({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-field',
  display: 'swap',
});

const mystic = Uncial_Antiqua({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-mystic',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-mono',
  display: 'swap',
});

const handwriting = Nanum_Pen_Script({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-hand',
  display: 'swap',
});

const metadataBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(metadataBaseUrl),
  title: 'World of Tethys | The 111-MYA Archive',
  description: 'A volcanic high-fantasy reconstruction of the Aptian Age. Explore the obsidian coast, decode ancient glyphs, and survive the tides.',
  keywords: ['Fantasy', 'Worldbuilding', 'Paleontology', 'Interactive Fiction', 'RPG'],
  openGraph: {
    title: 'World of Tethys',
    description: 'The ancient world is waking up. Will you listen to the roots or the magma?',
    type: 'website',
    images: [
      {
        url: cdn('/symbols/tethys-seal.png'),
        width: 1200,
        height: 630,
        alt: 'World of Tethys Map',
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${skySans.variable} ${naturalist.variable} ${fieldNotes.variable} ${mystic.variable} ${mono.variable} ${handwriting.variable}`}
    >
      <body className="bg-[#0c0a09] text-[#e7e5e4] antialiased">
        <Link
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-orange-600 focus:text-white focus:rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          Skip to main content
        </Link>

        <AuthProvider>
          <TethysProvider>
            <AudioProvider>
              <GlobalAtmosphere />
              <div id="main-content" role="main" className="relative min-h-screen">
                {children}
              </div>
              <GuestUpgradeGate />
              <GlobalAudioPlayer/>
            </AudioProvider>
          </TethysProvider>
        </AuthProvider>
        <Footer />
      </body>
    </html>
  );
}
// World of Tethys || D.C. Barletta
