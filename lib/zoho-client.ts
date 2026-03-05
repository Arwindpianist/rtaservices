/**
 * Shared Zoho CRM API client: token and domain. Used by opportunities, quotes, and connector.
 */

const ZOHO_ACCOUNTS_URL = process.env.ZOHO_ACCOUNTS_URL || 'https://accounts.zoho.com';
const TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1000;

let tokenCache: { token: string; expiresAt: number } | null = null;

export function getZohoCrmDomain(): string {
  return process.env.ZOHO_CRM_DOMAIN || 'https://www.zohoapis.com';
}

export async function getZohoAccessToken(): Promise<{ token: string | null; error?: string }> {
  const clientId = process.env.ZOHO_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET;
  const refreshToken = process.env.ZOHO_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) {
    return { token: null, error: 'Missing ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, or ZOHO_REFRESH_TOKEN' };
  }

  const now = Date.now();
  if (tokenCache && tokenCache.expiresAt - TOKEN_REFRESH_BUFFER_MS > now) {
    return { token: tokenCache.token };
  }

  const params = new URLSearchParams({
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'refresh_token',
  });

  const res = await fetch(`${ZOHO_ACCOUNTS_URL}/oauth/v2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });
  const text = await res.text();
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(text) as Record<string, unknown>;
  } catch {
    console.error('[Zoho] Token response was not JSON:', text?.slice(0, 200));
    return { token: null, error: 'Zoho returned invalid JSON' };
  }

  const errMsg = data.error as string | undefined;
  const errDesc = (data.error_description as string) || '';
  if (!res.ok || errMsg) {
    const msg = errMsg || (data.message as string) || `HTTP ${res.status}`;
    console.error('[Zoho] Token refresh failed:', msg, data);
    const isRateLimit = /too many|rate limit|try again/i.test(errDesc);
    if (!isRateLimit) tokenCache = null;
    return { token: null, error: `Token refresh failed: ${msg}` };
  }

  const token =
    (data.access_token as string) ??
    (data.accessToken as string) ??
    (data as { access_token?: string }).access_token ??
    null;
  if (!token) {
    console.error('[Zoho] No access_token in response. Keys:', Object.keys(data));
    return {
      token: null,
      error: `No access_token in Zoho response (keys: ${Object.keys(data).join(', ')})`,
    };
  }

  const expiresInSec = (data.expires_in as number) ?? 3600;
  tokenCache = {
    token,
    expiresAt: Date.now() + expiresInSec * 1000,
  };
  return { token };
}
