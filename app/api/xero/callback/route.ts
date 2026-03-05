import { NextRequest, NextResponse } from 'next/server';
import { setXeroTokens } from '@/lib/xero-store';

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
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
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
