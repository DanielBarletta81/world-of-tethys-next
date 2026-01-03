// src/app/layout.js
import { Inter, Cormorant_Garamond } from 'next/font/google';
import { AuthProvider } from '../context/AuthContext';
import { TethysProvider } from '../context/TethysContext';
import { AudioProvider } from '../context/AudioContext';
import GlobalAudioPlayer from '../components/GlobalAudioPlayer';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata = {
  title: 'World of Tethys | The 111-MYA Archive',
  description: 'A volcanic high-fantasy reconstruction of the Aptian Age. Explore the obsidian coast, decode ancient glyphs, and survive the tides.',
  keywords: ['Fantasy', 'Worldbuilding', 'Paleontology', 'Interactive Fiction', 'RPG'],
  openGraph: {
    title: 'World of Tethys',
    description: 'The ancient world is waking up. Will you listen to the roots or the magma?',
    type: 'website',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'World of Tethys Map',
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="bg-[#0c0a09] text-[#e7e5e4] antialiased">
        <AuthProvider>
          <TethysProvider>
            <AudioProvider>
              {children}
              <GlobalAudioPlayer />
            </AudioProvider>
          </TethysProvider>
        </AuthProvider>
      </body>
    </html>
  );
}