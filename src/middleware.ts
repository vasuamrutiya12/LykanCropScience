import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { verifyToken } from './lib/auth';

const intlMiddleware = createMiddleware(routing);

const ADMIN_PUBLIC = ['/admin/login'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin route protection
  if (pathname.startsWith('/admin')) {
    const isPublic = ADMIN_PUBLIC.some((p) => pathname === p);
    if (!isPublic) {
      const token = request.cookies.get('lykan_admin_token')?.value;
      const auth = token ? await verifyToken(token) : null;
      if (!auth) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
    }
    if (pathname === '/admin/login') {
      const token = request.cookies.get('lykan_admin_token')?.value;
      const auth = token ? await verifyToken(token) : null;
      if (auth) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    }
    return NextResponse.next();
  }

  // API routes - no intl
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};
