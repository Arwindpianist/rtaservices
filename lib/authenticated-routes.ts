import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * When true, dashboard pages, auth pages, and protected API routes return 503 / redirect home.
 * Public marketing site and public APIs (contact, quote, OSS search, support request) stay available.
 *
 * Set in .env.local or deployment env:
 *   DISABLE_AUTHENTICATED_ROUTES=true
 */
export function isAuthenticatedRoutesDisabled(): boolean {
  const raw = process.env.DISABLE_AUTHENTICATED_ROUTES;
  return raw === 'true' || raw === '1' || raw === 'yes';
}

export function getAuthenticatedRoutesDisabledMessage(): string {
  return (
    process.env.DISABLE_AUTHENTICATED_ROUTES_MESSAGE?.trim() ||
    'Dashboard and sign-in are temporarily unavailable. Please try again later.'
  );
}

const PROTECTED_PREFIXES = [
  '/dashboard',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/accept-invite',
  '/api/dashboard',
  '/api/admin',
  '/api/auth',
  '/api/connector',
  '/api/xero',
  '/api/zoho',
  '/api/pipeline-drafts',
  '/api/cron',
] as const;

export function isProtectedAuthenticatedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function authenticatedRoutesDisabledResponse(request: NextRequest): NextResponse {
  const message = getAuthenticatedRoutesDisabledMessage();
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api/')) {
    return NextResponse.json(
      { error: message, code: 'AUTH_ROUTES_DISABLED' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  const home = new URL('/', request.url);
  home.searchParams.set('auth_disabled', '1');
  return NextResponse.redirect(home);
}
