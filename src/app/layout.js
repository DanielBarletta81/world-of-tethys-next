import Link from 'next/link';
import { getAmazonBookUrl } from '@/lib/links';
import { auth0 } from '@/lib/auth0';
import { TethysProvider } from '@/context/TethysContext';
import AnaphaseWrapper from '@/components/AnaphaseWrapper';
import AuthAppProvider from '@/components/AuthAppProvider';
import './globals.css';

export const metadata = {
  title: 'World of Tethys',
  description: 'Headless Next.js frontend for World of Tethys'
};

export default async function RootLayout({ children }) {
  const amazonUrl = getAmazonBookUrl();
  const session = await auth0.getSession();
  const navItems = [
    { href: '/history', label: 'Chronicles', description: 'Eras & cataclysms' },
    { href: '/records', label: 'Records', description: 'Expedition briefs' },
    { href: '/characters', label: 'Characters', description: 'Living legends' },
    { href: '/creatures', label: 'Creatures', description: 'Biodome sightings' },
    { href: '/mystics', label: 'Mystics', description: 'Orders & rites' },
    { href: '/humans', label: 'Humans', description: 'Settlements mapped' },
    { href: '/registry', label: 'Registry', description: 'Artifacts logged' },
    { href: '/listen', label: 'Listen', description: 'Signal archives' }
  ];
  const navMetrics = [
    { label: 'Expedition', value: 'Relay VII' },
    { label: 'Biome Index', value: '67% charted' },
    { label: 'Reliquaries', value: '12 active' }
  ];

  return (
    <html lang="en">
      <body className="site-body ancient-overlay">
        <AuthAppProvider user={session?.user}>
          <TethysProvider>
            <div className="site-shell">
              <header className="site-header">
                <div className="nav-banner">
                  <div className="nav-banner__identity">
                    <p className="nav-banner__eyebrow">Atlas Initiative</p>
                    <Link href="/" className="wordmark">
                      WORLD OF TETHYS
                    </Link>
                    <p className="nav-banner__lede">
                      Field researchers charting the ruins and living archives of forgotten biomes.
                    </p>
                  </div>
                  <div className="nav-banner__metrics">
                    {navMetrics.map((metric) => (
                      <div key={metric.label} className="nav-badge">
                        <span className="nav-badge__label">{metric.label}</span>
                        <span className="nav-badge__value">{metric.value}</span>
                      </div>
                    ))}
                  </div>
                  {amazonUrl && (
                    <a
                      href={amazonUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="nav-banner__cta"
                    >
                      Field Manual
                    </a>
                  )}
                </div>
                <nav className="ancient-nav" aria-label="Discovery routes">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href} className="ancient-nav__item">
                      <span className="ancient-nav__label">{item.label}</span>
                      <span className="ancient-nav__desc">{item.description}</span>
                    </Link>
                  ))}
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
        </AuthAppProvider>
      </body>
    </html>
  );
}
