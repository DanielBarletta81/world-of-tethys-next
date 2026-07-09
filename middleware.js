import { NextResponse } from 'next/server';

export async function middleware(request) {
  const hostname = request.headers.get('host');
  const protocol = request.headers.get('x-forwarded-proto');
  const pathname = request.nextUrl.pathname;
  const siteBase = (process.env.NEXT_PUBLIC_SITE_URL || 'https://worldoftethys.com').replace(/\/$/, '');
  const authorSiteBase = (process.env.NEXT_PUBLIC_AUTHOR_SITE_URL || siteBase).replace(/\/$/, '');
  const requestHost = (hostname || '').toLowerCase();
  let authorSiteHost = '';

  try {
    authorSiteHost = new URL(authorSiteBase).host.toLowerCase();
  } catch {
    authorSiteHost = '';
  }

  // Redirect HTTP to HTTPS in production
  if (process.env.NODE_ENV === 'production' && protocol === 'http') {
    return NextResponse.redirect(
      `https://${hostname}${request.nextUrl.pathname}${request.nextUrl.search}`,
      301
    );
  }

  // Redirect legacy /portal route
  if (pathname === '/portal') {
    return NextResponse.redirect(new URL('/', request.url), 308);
  }

  if (pathname === '/world-of-tethys') {
    return NextResponse.redirect(new URL('/world', request.url), 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
