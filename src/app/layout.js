import localFont from 'next/font/local';
import { AuthProvider } from '../context/AuthContext';
import { TethysProvider } from '../context/TethysContext';
import { AudioProvider } from '../context/AudioContext';
import GlobalAudioPlayer from '../components/GlobalAudioPlayer';
import GlobalAtmosphere from '../components/GlobalAtmosphere';
import AudioUnlockOverlay from '../components/AudioUnlockOverlay';
import GuestUpgradeGate from '../components/GuestUpgradeGate';
import IdleGrowthOverlay from '../components/IdleGrowthOverlay';
import './globals.css';
import Footer from '@/components/layout/Footer';
import cdn from '@/lib/cdn';
import Link from 'next/link';

const skySans = localFont({
  src: [
    { path: '../../public/fonts/space-grotesk/space-grotesk-300.ttf', weight: '300', style: 'normal' },
    { path: '../../public/fonts/space-grotesk/space-grotesk-400.ttf', weight: '400', style: 'normal' },
    { path: '../../public/fonts/space-grotesk/space-grotesk-500.ttf', weight: '500', style: 'normal' },
    { path: '../../public/fonts/space-grotesk/space-grotesk-600.ttf', weight: '600', style: 'normal' },
    { path: '../../public/fonts/space-grotesk/space-grotesk-700.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-sky',
  display: 'swap',
});

const naturalist = localFont({
  src: [
    { path: '../../public/fonts/spectral/spectral-400.ttf', weight: '400', style: 'normal' },
    { path: '../../public/fonts/spectral/spectral-500.ttf', weight: '500', style: 'normal' },
    { path: '../../public/fonts/spectral/spectral-600.ttf', weight: '600', style: 'normal' },
    { path: '../../public/fonts/spectral/spectral-700.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-naturalist',
  display: 'swap',
});

const volcanic = localFont({
  src: [
    { path: '../../public/fonts/cinzel-decorative/cinzel-decorative-400.ttf', weight: '400', style: 'normal' },
    { path: '../../public/fonts/cinzel-decorative/cinzel-decorative-700.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-volcanic',
  display: 'swap',
});

const fieldNotes = localFont({
  src: [
    { path: '../../public/fonts/im-fell-english/im-fell-english-400.ttf', weight: '400', style: 'normal' },
  ],
  variable: '--font-field',
  display: 'swap',
});

const mystic = localFont({
  src: [
    { path: '../../public/fonts/uncial-antiqua/uncial-antiqua-400.ttf', weight: '400', style: 'normal' },
  ],
  variable: '--font-mystic',
  display: 'swap',
});

const mono = localFont({
  src: [
    { path: '../../public/fonts/jetbrains-mono/jetbrains-mono-400.ttf', weight: '400', style: 'normal' },
    { path: '../../public/fonts/jetbrains-mono/jetbrains-mono-600.ttf', weight: '600', style: 'normal' },
  ],
  variable: '--font-mono',
  display: 'swap',
});

const handwriting = localFont({
  src: [
    { path: '../../public/fonts/nanum-pen-script/nanum-pen-script-400.ttf', weight: '400', style: 'normal' },
  ],
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
      className={`${skySans.variable} ${naturalist.variable} ${volcanic.variable} ${fieldNotes.variable} ${mystic.variable} ${mono.variable} ${handwriting.variable}`}
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
              <IdleGrowthOverlay />
              <AudioUnlockOverlay />
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
