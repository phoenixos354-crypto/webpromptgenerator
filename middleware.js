import { NextResponse } from 'next/server';

export const config = {
  matcher: ['/((?!api|_next|favicon.ico|login.html).*)'],
};

export default function middleware(req) {
  const { pathname } = req.nextUrl;

  // Bypass: halaman login dan assets publik
  if (
    pathname === '/login.html' ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js|woff|woff2|ttf)$/)
  ) {
    return NextResponse.next();
  }

  // Cek cookie auth
  const authCookie = req.cookies.get('auth');
  const correctPassword = process.env.SITE_PASSWORD;

  if (authCookie?.value === correctPassword) {
    // Sudah login, lanjutkan
    return NextResponse.next();
  }

  // Belum login, redirect ke halaman login
  const loginUrl = new URL('/login.html', req.url);
  return NextResponse.redirect(loginUrl);
}
