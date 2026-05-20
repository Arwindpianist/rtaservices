import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import {
  authenticatedRoutesDisabledResponse,
  isAuthenticatedRoutesDisabled,
  isProtectedAuthenticatedPath,
} from '@/lib/authenticated-routes';

/** Superadmin may only access these areas (no business dashboards). */
const SUPERADMIN_ALLOWED_PREFIXES = ['/dashboard/superadmin', '/dashboard/quote-payments'] as const;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isAuthenticatedRoutesDisabled() && isProtectedAuthenticatedPath(pathname)) {
    return authenticatedRoutesDisabledResponse(request);
  }

  if (!pathname.startsWith('/dashboard')) {
    return NextResponse.next();
  }

  // Without NEXTAUTH_SECRET, JWT cannot be verified here; set it in .env.local for route isolation.
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request, secret });
  if (!token) {
    const login = new URL('/login', request.url);
    login.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(login);
  }

  const role = String((token as { role?: string }).role || '').toLowerCase();

  if (pathname.startsWith('/dashboard/superadmin') && role !== 'superadmin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (pathname.startsWith('/dashboard/admin') && role !== 'superadmin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (role === 'superadmin') {
    const allowed = SUPERADMIN_ALLOWED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
    if (!allowed) {
      return NextResponse.redirect(new URL('/dashboard/superadmin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/accept-invite',
    '/api/dashboard/:path*',
    '/api/admin/:path*',
    '/api/auth/:path*',
    '/api/connector/:path*',
    '/api/xero/:path*',
    '/api/zoho/:path*',
    '/api/pipeline-drafts/:path*',
    '/api/cron/:path*',
  ],
};
