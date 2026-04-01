import localFont from 'next/font/local';
import Script from 'next/script';
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
import PersistentNav from '@/components/layout/navigation/PersistentNav';
import SocialRail from '@/components/layout/SocialRail';
import { getConfiguredSiteUrls, getSiteVariantFromConfig } from '@/lib/site-variant';

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

const { worldSiteUrl, authorSiteUrl } = getConfiguredSiteUrls();
const defaultSiteVariant = getSiteVariantFromConfig();
const isAuthorDefaultSite = defaultSiteVariant === 'author';
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || (isAuthorDefaultSite ? authorSiteUrl : worldSiteUrl)).replace(/\/$/, '');
const socialLinks = Array.from(new Set([
  worldSiteUrl,
  authorSiteUrl,
  'https://www.youtube.com/@WorldofTethys',
  'https://www.goodreads.com/author/show/63851248.D_C_Barletta',
  'https://www.amazon.com/stores/D.C.-Barletta/author/B0G5LM24FM',
  process.env.NEXT_PUBLIC_PINTEREST_PROFILE_URL
].filter(Boolean)));

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: isAuthorDefaultSite ? 'D.C. Barletta | Author of World of Tethys' : 'World of Tethys | Immersive Atlas & Lore',
    template: isAuthorDefaultSite ? '%s | D.C. Barletta' : '%s | World of Tethys',
  },
  description: isAuthorDefaultSite
    ? 'Official author platform for D.C. Barletta featuring World of Tethys books, essays, and publishing resources.'
    : 'Explore World of Tethys: immersive atlas systems, deep lore, natural history, archive intelligence, and evolving world signals.',
  alternates: {
    canonical: './',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: isAuthorDefaultSite ? 'D.C. Barletta | Author of World of Tethys' : 'World of Tethys | Immersive Atlas & Lore',
    description: isAuthorDefaultSite
      ? 'Book One. A name above the waterline. An older world below.'
      : 'Explore the World of Tethys through map-driven lore, natural history, living archive systems, and immersive world pathways.',
    type: 'website',
    url: siteUrl,
    siteName: isAuthorDefaultSite ? 'D.C. Barletta' : 'World of Tethys',
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
  const siteVariant = getSiteVariantFromConfig();
  const isAuthorSite = siteVariant === 'author';
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: isAuthorSite ? 'D.C. Barletta' : 'World of Tethys',
    url: isAuthorSite ? authorSiteUrl : worldSiteUrl,
    sameAs: socialLinks,
  };

  return (
    <html
      lang="en"
      className={`${skySans.variable} ${naturalist.variable} ${volcanic.variable} ${fieldNotes.variable} ${mystic.variable} ${mono.variable} ${handwriting.variable}`}
    >
      <body
        data-site-variant={siteVariant}
        className={isAuthorSite ? 'bg-[#f4efe6] text-[#2f241d] antialiased' : 'bg-[#0c0a09] text-[#e7e5e4] antialiased'}
      >
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-TJN1NEHV58"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-TJN1NEHV58');`}
        </Script>
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
              <PersistentNav siteVariant={siteVariant} />
              <SocialRail />
              <GlobalAtmosphere siteVariant={siteVariant} />
              {!isAuthorSite ? <IdleGrowthOverlay /> : null}
              {!isAuthorSite ? <AudioUnlockOverlay /> : null}
              <div id="main-content" role="main" className="relative min-h-screen pt-24 md:pt-28">
                {children}
              </div>
              {!isAuthorSite ? <GuestUpgradeGate /> : null}
              {!isAuthorSite ? <GlobalAudioPlayer /> : null}
            </AudioProvider>
          </TethysProvider>
        </AuthProvider>
        <Footer siteVariant={siteVariant} />
      </body>
    </html>
  );
}
