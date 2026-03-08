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
import Link from 'next/link';
import { BOOK1_COVER_URL } from '@/lib/site-assets';

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
const worldSiteUrl = process.env.NEXT_PUBLIC_WORLD_SITE_URL || 'https://worldoftethys.com';

export const metadata = {
  metadataBase: new URL(metadataBaseUrl),
  title: {
    default: 'World of Tethys by D.C. Barletta',
    template: '%s | World of Tethys',
  },
  description:
    'World of Tethys by D.C. Barletta: prehistoric fiction, dinosaur survival, evolutionary fantasy, and ecological storytelling. Available on Amazon.',
  keywords: [
    'world of tethys',
    'dc barletta',
    'prehistoric fiction',
    'dinosaur survival novel',
    'evolutionary fantasy',
    'volcanic world novel',
    'natural history fiction',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'World of Tethys by D.C. Barletta',
    description:
      'Discover World of Tethys, a prehistoric epic novel set in a volcanic world of ancient forests, flying predators, and evolving ecosystems.',
    type: 'website',
    images: [
      {
        url: BOOK1_COVER_URL,
        width: 1200,
        height: 630,
        alt: 'World of Tethys prehistoric volcanic landscape',
      },
    ],
  },
  verification: {
    other: {
      'p:domain_verify': '0911a7e67a7bf1098d8b561256e29144',
    },
  },
};

export default function RootLayout({ children }) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'D.C. Barletta',
    url: metadataBaseUrl,
    sameAs: [worldSiteUrl, 'https://www.youtube.com/@worldoftethysauthor'],
  };

  return (
    <html
      lang="en"
      className={`${skySans.variable} ${naturalist.variable} ${volcanic.variable} ${fieldNotes.variable} ${mystic.variable} ${mono.variable} ${handwriting.variable}`}
    >
      <body className="bg-[#0c0a09] text-[#e7e5e4] antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
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
