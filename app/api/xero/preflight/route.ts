import { NextRequest, NextResponse } from 'next/server';

function getBaseUrl(request: NextRequest): string {
  const xForwardedProto = request.headers.get('x-forwarded-proto');
  const xForwardedHost = request.headers.get('x-forwarded-host');
  const proto = (xForwardedProto ? xForwardedProto.split(',')[0].trim() : request.nextUrl.protocol.replace(':', '')) || 'https';
  const host = (xForwardedHost ? xForwardedHost.split(',')[0].trim() : request.headers.get('host')) || '';
  const reqOrigin = host ? `${proto}://${host}` : request.nextUrl.origin;

  const env = process.env.NEXT_PUBLIC_APP_URL;
  if (!env) return reqOrigin.replace(/\/+$/, '');

  const trimmed = env.replace(/\/+$/, '');
  try {
    const envUrl = new URL(trimmed);
    const reqUrl = new URL(reqOrigin);
    // If env points to a different origin (common during domain cutovers), prefer the request origin.
    if (envUrl.origin !== reqUrl.origin) return reqOrigin.replace(/\/+$/, '');
    // Preserve any env pathname (subpath deployments).
    return trimmed;
  } catch {
    // If NEXT_PUBLIC_APP_URL isn't a valid URL, fall back to trimmed value.
    return trimmed;
  }
}

export async function GET(request: NextRequest) {
  const clientId = process.env.XERO_CLIENT_ID;
  const clientSecret = process.env.XERO_CLIENT_SECRET;
  const baseUrl = getBaseUrl(request);
  const redirectUri = `${baseUrl}/api/xero/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      {
        ok: false,
        code: 'config',
        message: 'Xero environment variables are missing.',
        redirectUri,
      },
      { status: 200 }
    );
  }

  return NextResponse.json({
    ok: true,
    redirectUri,
  });
}
