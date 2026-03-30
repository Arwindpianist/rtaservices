import { NextRequest, NextResponse } from 'next/server';
import { setXeroTokens } from '@/lib/xero-store';

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
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  if (error || !code) {
    return NextResponse.redirect(new URL(`/dashboard?xero=error`, request.url));
  }
  const clientId = process.env.XERO_CLIENT_ID;
  const clientSecret = process.env.XERO_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL(`/dashboard?xero=config`, request.url));
  }
  const baseUrl = getBaseUrl(request);
  const redirectUri = `${baseUrl}/api/xero/callback`;
  const res = await fetch('https://identity.xero.com/connect/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    }).toString(),
  });
  if (!res.ok) {
    const err = await res.text();
    return NextResponse.redirect(new URL(`/dashboard?xero=exchange`, request.url));
  }
  const data = await res.json();
  let tenantId = data.tenant_id || (Array.isArray(data.tenants) && data.tenants[0]?.tenantId);
  if (!tenantId && data.access_token) {
    const connRes = await fetch('https://api.xero.com/connections', {
      headers: { Authorization: `Bearer ${data.access_token}` },
    });
    if (connRes.ok) {
      const conns = await connRes.json();
      tenantId = conns[0]?.tenantId || conns[0]?.tenant_id;
    }
  }
  setXeroTokens({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_in: data.expires_in || 1800,
    tenant_id: tenantId,
  });
  return NextResponse.redirect(new URL('/dashboard', request.url));
}
