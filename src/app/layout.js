import Link from 'next/link';
import { getAmazonBookUrl } from '@/lib/links';
import { auth0 } from '@/lib/auth0';
import { TethysProvider } from '@/context/TethysContext';
import AnaphaseWrapper from '@/components/AnaphaseWrapper';
import AuthAppProvider from '@/components/AuthAppProvider';
import AtmosphericLayer from '@/components/AtmosphericLayer';
import InkDropOverlay from '@/components/InkDropOverlay';
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
    { href: '/listen', label: 'Listen', description: 'Signal archives' },
    { href: '/science', label: 'Science Annex', description: 'Real-world biology' }
  ];
  const navMetrics = [
    { label: 'Volume', value: 'Book I — The Watcher' },
    { label: 'Author', value: 'D.C. Barletta' },
    { label: 'Release', value: 'Hardcover Out Now' }
  ];

  return (
    <html lang="en">
      <body className="site-body ancient-overlay">
        <AuthAppProvider user={session?.user}>
          <TethysProvider>
            <AtmosphericLayer />
            <InkDropOverlay />
            <div className="site-shell">
              <header className="site-header">
                <div className="nav-banner">
                  <div className="nav-banner__identity">
                    <p className="nav-banner__eyebrow">Atlas Initiative</p>
                    <Link href="/" className="wordmark">
                      WORLD OF TETHYS
                    </Link>
                    <p className="nav-banner__lede">
                      Author D.C. Barletta&apos;s living archive of the Tethys Inundation.
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
                      Acquire the Full Record (Amazon)
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
              <footer className="site-footer mt-20 border-t border-ancient-ink/10 pt-10 pb-20 text-center">
                <div className="wordmark text-2xl mb-2">Author D.C. Barletta</div>
                <p className="text-[10px] font-mono uppercase tracking-[0.4em] opacity-40 mb-6">
                  Architect of the Cambrian 9 • World of Tethys
                </p>
                {amazonUrl && (
                  <a
                    href={amazonUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 border border-ancient-accent text-ancient-accent text-[11px] font-mono uppercase tracking-[0.4em] hover:bg-ancient-accent hover:text-white transition-colors"
                  >
                    Enter the Dinosaur Factory
                  </a>
                )}
              </footer>
            </div>
          </TethysProvider>
        </AuthAppProvider>
      </body>
    </html>
  );
}
