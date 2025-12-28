import { NextResponse } from 'next/server';

export function middleware(request) {
  const hostname = request.headers.get('host');
  const protocol = request.headers.get('x-forwarded-proto');

  if (process.env.NODE_ENV === 'production' && protocol === 'http') {
    return NextResponse.redirect(
      `https://${hostname}${request.nextUrl.pathname}${request.nextUrl.search}`,
      301
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
