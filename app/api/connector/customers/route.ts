import { NextResponse } from 'next/server';
import { getZohoAccessToken, getZohoCrmDomain } from '@/lib/zoho-client';

function extractVal(v: unknown): string | undefined {
  if (v == null) return undefined;
  if (typeof v === 'string' && v.trim()) return v.trim();
  if (v && typeof v === 'object') {
    const o = v as Record<string, unknown>;
    if (typeof o.name === 'string' && o.name.trim()) return o.name.trim();
  }
  return undefined;
}

export async function GET() {
  const customers: { id: string; name: string; quoteCount: number }[] = [];
  const nameToCount = new Map<string, number>();

  const { token } = await getZohoAccessToken();
  if (!token) {
    return NextResponse.json({ customers: [], error: 'Zoho not configured' });
  }

  const domain = getZohoCrmDomain();
  const quoteFields = 'id,Account_Name,Contact_Name';
  const quotesRes = await fetch(
    `${domain}/crm/v2/Quotes?per_page=200&fields=${quoteFields}`,
    { headers: { Authorization: `Zoho-oauthtoken ${token}` } }
  );
  if (quotesRes.ok) {
    const data = await quotesRes.json();
    const quotes = data.data ?? data.quotes ?? [];
    for (const q of quotes) {
      const acct = q.Account_Name as { name?: string } | undefined;
      const contact = q.Contact_Name as { name?: string } | undefined;
      const name = acct?.name || contact?.name;
      if (name && name.trim()) {
        const n = name.trim();
        nameToCount.set(n, (nameToCount.get(n) ?? 0) + 1);
      }
    }
  }

  const dealFields = 'id,Account_Name';
  const dealsRes = await fetch(
    `${domain}/crm/v2/Deals?per_page=200&fields=${dealFields}`,
    { headers: { Authorization: `Zoho-oauthtoken ${token}` } }
  );
  if (dealsRes.ok) {
    const data = await dealsRes.json();
    const deals = data.data ?? data.deals ?? [];
    for (const d of deals) {
      const acct = d.Account_Name as { name?: string } | undefined;
      const name = acct?.name;
      if (name && name.trim()) {
        const n = name.trim();
        nameToCount.set(n, (nameToCount.get(n) ?? 0) + 1);
      }
    }
  }

  for (const [name, count] of nameToCount.entries()) {
    customers.push({
      id: encodeURIComponent(name),
      name,
      quoteCount: count,
    });
  }
  customers.sort((a, b) => a.name.localeCompare(b.name));

  return NextResponse.json({ customers });
}
