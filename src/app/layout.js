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
    { label: 'Volume', value: 'Book I — Sky City' },
    { label: 'Author', value: 'D.C. Barletta', href: 'https://www.dcbarletta.com' },
    { label: 'Status', value: 'Pre-Order (Feb 28)' }
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
                        {metric.href ? (
                          <a
                            href={metric.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="nav-badge__value underline decoration-dotted hover:text-[#8a3c23] transition-colors"
                          >
                            {metric.value}
                          </a>
                        ) : (
                          <span className="nav-badge__value">{metric.value}</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {amazonUrl && (
                    <a
                      href={amazonUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="nav-banner__cta group"
                    >
                      <span className="group-hover:hidden">View Supply Drop</span>
                      <span className="hidden group-hover:inline text-[#8a3c23] font-bold">Pre-Order Book I</span>
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

              <footer className="site-footer mt-20 border-t border-[#3d2b1f]/20 pt-10 pb-20 text-center">
                <div className="wordmark text-2xl mb-2 text-[#1a1510]">Author D.C. Barletta</div>
                <p className="text-[10px] font-mono uppercase tracking-[0.4em] opacity-40 mb-6 text-[#5c4f43]">
                  Architect of the Cambrian 9 • World of Tethys
                </p>
                {amazonUrl && (
                  <a
                    href={amazonUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 border border-[#8a3c23] text-[#8a3c23] text-[11px] font-mono uppercase tracking-[0.4em] hover:bg-[#8a3c23] hover:text-[#e6ded0] transition-colors"
                  >
                    Reserve "Sky City" (Launch Feb 28)
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
