import { NextRequest, NextResponse } from 'next/server';
import { getZohoAccessToken, getZohoCrmDomain } from '@/lib/zoho-client';
import { getValidAccessToken } from '@/lib/xero-store';
import { getXeroTokens } from '@/lib/xero-store';

function extractVal(v: unknown): string | undefined {
  if (v == null) return undefined;
  if (typeof v === 'string' && v.trim()) return v.trim();
  if (v && typeof v === 'object') {
    const o = v as Record<string, unknown>;
    if (typeof o.name === 'string' && o.name.trim()) return o.name.trim();
  }
  return undefined;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ customerId: string }> }
) {
  const { customerId } = await params;
  const customerName = decodeURIComponent(customerId || '').trim();
  if (!customerName) {
    return NextResponse.json({ error: 'customerId required' }, { status: 400 });
  }

  const zohoQuotes: { id: string; name: string; amount: number; currency: string; stage: string }[] = [];
  const zohoDeals: { id: string; name: string; amount: number; stage: string }[] = [];
  let xeroInvoices: { id: string; number: string; total: number; status: string; dueDate: string }[] = [];

  const { token: zohoToken } = await getZohoAccessToken();
  if (zohoToken) {
    const domain = getZohoCrmDomain();
    const quoteFields = 'id,Auto_Number_1,Grand_Total,Currency_2,Quote_Stage,Account_Name,Contact_Name,Subject';
    const quotesRes = await fetch(
      `${domain}/crm/v2/Quotes?per_page=100&fields=${quoteFields}`,
      { headers: { Authorization: `Zoho-oauthtoken ${zohoToken}` } }
    );
    if (quotesRes.ok) {
      const data = await quotesRes.json();
      const quotes = data.data ?? data.quotes ?? [];
      const quoteNumberField = process.env.ZOHO_QUOTE_NUMBER_FIELD || 'Auto_Number_1';
      for (const q of quotes) {
        const acct = q.Account_Name as { name?: string } | undefined;
        const contact = q.Contact_Name as { name?: string } | undefined;
        const name = (acct?.name || contact?.name || '').trim();
        if (name !== customerName) continue;
        const quoteName = extractVal(q[quoteNumberField]) || extractVal(q.Subject) || q.id;
        zohoQuotes.push({
          id: q.id,
          name: quoteName,
          amount: Number(q.Grand_Total) || 0,
          currency: (extractVal(q.Currency_2) || 'USD').toUpperCase(),
          stage: String(q.Quote_Stage ?? ''),
        });
      }
    }

    const dealFields = 'id,Deal_Name,Amount,Stage,Account_Name';
    const dealsRes = await fetch(
      `${domain}/crm/v2/Deals?per_page=100&fields=${dealFields}`,
      { headers: { Authorization: `Zoho-oauthtoken ${zohoToken}` } }
    );
    if (dealsRes.ok) {
      const data = await dealsRes.json();
      const deals = data.data ?? data.deals ?? [];
      for (const d of deals) {
        const acct = d.Account_Name as { name?: string } | undefined;
        const name = (acct?.name || '').trim();
        if (name !== customerName) continue;
        zohoDeals.push({
          id: d.id,
          name: (d.Deal_Name as string) || d.id,
          amount: Number(d.Amount) || 0,
          stage: String(d.Stage ?? ''),
        });
      }
    }
  }

  const accessToken = await getValidAccessToken();
  const tokens = getXeroTokens();
  const tenantId = tokens?.tenant_id;
  if (accessToken && tenantId) {
    try {
      const res = await fetch('https://api.xero.com/api.xro/2.0/Invoices?pageSize=100&order=DueDate%20DESC', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Xero-tenant-id': tenantId,
        },
      });
      if (res.ok) {
        const data = await res.json();
        const invoices = (data.Invoices || []).filter(
          (inv: { Type?: string; Contact?: { Name?: string } }) =>
            (inv.Type || 'ACCREC').toUpperCase() === 'ACCREC' &&
            (inv.Contact?.Name || '').trim().toLowerCase() === customerName.toLowerCase()
        );
        xeroInvoices = invoices.map((inv: { InvoiceID?: string; InvoiceNumber?: string; Total?: number; Status?: string; DueDate?: string }) => ({
          id: inv.InvoiceID,
          number: inv.InvoiceNumber || inv.InvoiceID,
          total: inv.Total ?? 0,
          status: (inv.Status || '').toLowerCase(),
          dueDate: inv.DueDate || '',
        }));
      }
    } catch {
      // leave empty
    }
  }

  return NextResponse.json({
    customerName,
    zohoQuotes,
    zohoDeals,
    xeroInvoices,
  });
}
