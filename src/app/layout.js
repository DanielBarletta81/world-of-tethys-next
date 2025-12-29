import Link from 'next/link';
import { getAmazonBookUrl } from '@/lib/links';
import { TethysProvider } from '@/context/TethysContext';
import AnaphaseWrapper from '@/components/AnaphaseWrapper';
import './globals.css';

export const metadata = {
  title: 'World of Tethys',
  description: 'Headless Next.js frontend for World of Tethys'
};

export default function RootLayout({ children }) {
  const amazonUrl = getAmazonBookUrl();
  const navItems = [
    { href: '/history', label: 'History' },
    { href: '/records', label: 'Records' },
    { href: '/characters', label: 'Characters' },
    { href: '/creatures', label: 'Creatures' },
    { href: '/mystics', label: 'Mystics' },
    { href: '/humans', label: 'Humans' },
    { href: '/registry', label: 'Registry' },
    { href: '/listen', label: 'Listen' }
  ];

  return (
    <html lang="en">
      <body className="site-body">
        <TethysProvider>
          <div className="site-shell">
            <header className="site-header">
              <Link href="/" className="wordmark">
                WORLD OF TETHYS
              </Link>
              <nav className="site-nav">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    {item.label}
                  </Link>
                ))}
                {amazonUrl && (
                  <a href={amazonUrl} target="_blank" rel="noreferrer">
                    Book I (Amazon)
                  </a>
                )}
              </nav>
            </header>
            <main className="site-main">
              <AnaphaseWrapper>{children}</AnaphaseWrapper>
            </main>
            <footer className="site-footer">
              <p className="footer-mark">WORLD OF TETHYS</p>
              <p className="footer-credit">© 2025 D.C. Barletta</p>
            </footer>
          </div>
        </TethysProvider>
      </body>
    </html>
  );
}
