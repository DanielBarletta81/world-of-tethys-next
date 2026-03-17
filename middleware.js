import { NextResponse } from 'next/server';

export async function middleware(request) {
  const hostname = request.headers.get('host');
  const protocol = request.headers.get('x-forwarded-proto');
  const pathname = request.nextUrl.pathname;
  const enableLegacyAuthorRedirects = process.env.ENABLE_LEGACY_AUTHOR_ROUTES === 'true';

  if (process.env.NODE_ENV === 'production' && protocol === 'http') {
    return NextResponse.redirect(
      `https://${hostname}${request.nextUrl.pathname}${request.nextUrl.search}`,
      301
    );
  }

  if (enableLegacyAuthorRedirects && pathname === '/about-dc-barletta') {
    return NextResponse.redirect(new URL('/author', request.url), 308);
  }

  if (pathname === '/world-of-tethys') {
    return NextResponse.redirect(new URL('/world', request.url), 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
