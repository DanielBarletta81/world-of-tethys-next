import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: 'World of Tethys',
  description: 'Headless Next.js frontend for World of Tethys'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="site-body">
        <div className="site-shell">
          <header className="site-header">
            <Link href="/" className="wordmark">
              WORLD OF TETHYS
            </Link>
            <nav className="site-nav">
              <Link href="/records">Archive</Link>
              <Link href="/records">Records</Link>
              <Link href="/creatures">Creatures</Link>
              <Link href="/mystics">Mystics</Link>
              <Link href="/registry">Registry</Link>
            </nav>
          </header>
          <main className="site-main">{children}</main>
          <footer className="site-footer">
            <p className="footer-mark">WORLD OF TETHYS</p>
            <p className="footer-credit">© 2025 D.C. Barletta</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
