import { NextResponse } from 'next/server';

export async function middleware(request) {
  const hostname = request.headers.get('host');
  const protocol = request.headers.get('x-forwarded-proto');
  const normalizedHost = (hostname || '').split(':')[0].toLowerCase();
  const pathname = request.nextUrl.pathname;

  if (process.env.NODE_ENV === 'production' && protocol === 'http') {
    return NextResponse.redirect(
      `https://${hostname}${request.nextUrl.pathname}${request.nextUrl.search}`,
      301
    );
  }

  const isWorldDomain =
    normalizedHost === 'worldoftethys.com' ||
    normalizedHost === 'www.worldoftethys.com';
  const isAuthorDomain =
    normalizedHost === 'dcbarletta.com' ||
    normalizedHost === 'www.dcbarletta.com';

  // Host-aware landing pages during the transition:
  // worldoftethys.com -> /world, dcbarletta.com -> /author
  if (pathname === '/') {
    if (isWorldDomain) {
      return NextResponse.redirect(new URL('/world', request.url), 308);
    }

    if (isAuthorDomain) {
      return NextResponse.redirect(new URL('/author', request.url), 308);
    }
  }

  if (isWorldDomain && pathname === '/about-dc-barletta') {
    return NextResponse.redirect(new URL('/author', request.url), 308);
  }

  if (isWorldDomain && pathname === '/world-of-tethys') {
    return NextResponse.redirect(new URL('/world', request.url), 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
// World of Tethys || D.C. Barletta
