import { NextResponse } from 'next/server';
import { auth0 } from './src/lib/auth0';

export async function middleware(request) {
  const hostname = request.headers.get('host');
  const protocol = request.headers.get('x-forwarded-proto');

  if (process.env.NODE_ENV === 'production' && protocol === 'http') {
    return NextResponse.redirect(
      `https://${hostname}${request.nextUrl.pathname}${request.nextUrl.search}`,
      301
    );
  }

  return auth0.middleware(request);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
