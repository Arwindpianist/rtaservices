import { NextResponse } from 'next/server';
import { getZohoAccessToken, getZohoCrmDomain } from '@/lib/zoho-client';
import { getValidAccessToken } from '@/lib/xero-store';
import { getXeroTokens } from '@/lib/xero-store';
import { listLinks } from '@/lib/connector-store';

const WON_STAGE = (process.env.ZOHO_QUOTE_WON_STAGE || 'Won').toLowerCase();
const QUOTE_FIELDS = 'id,Auto_Number_1,Grand_Total,Currency_2,Account_Name,Contact_Name,Quote_Stage,Valid_Till';

function getAgeBucket(dueDate: string): string {
  if (!dueDate) return '0-30';
  const due = new Date(dueDate).getTime();
  const now = Date.now();
  const days = Math.floor((due - now) / (24 * 60 * 60 * 1000));
  if (days < 0) {
    const overdue = -days;
    if (overdue <= 30) return '0-30';
    if (overdue <= 60) return '30-60';
    if (overdue <= 90) return '60-90';
    return '90+';
  }
  if (days <= 30) return '0-30';
  if (days <= 60) return '30-60';
  if (days <= 90) return '60-90';
  return '90+';
}

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
  const toBeInvoiced: { id: string; name: string; customer: string; amount: number; currency: string }[] = [];
  const outstanding: { id: string; number: string; entity: string; amount: number; currency: string; dueDate: string; ageBucket: string }[] = [];
  const ageing: Record<string, number> = { '0-30': 0, '30-60': 0, '60-90': 0, '90+': 0 };
  let expectedCash30 = 0;
  let expectedCash60 = 0;
  let expectedCash90 = 0;

  const links = listLinks();
  const linkedQuoteIds = new Set(links.map((l) => l.zohoQuoteId));

  const { token: zohoToken } = await getZohoAccessToken();
  if (zohoToken) {
    const domain = getZohoCrmDomain();
    const quotesRes = await fetch(
      `${domain}/crm/v2/Quotes?sort_by=Modified_Time&sort_order=desc&per_page=100&fields=${QUOTE_FIELDS}`,
      { headers: { Authorization: `Zoho-oauthtoken ${zohoToken}` } }
    );
    if (quotesRes.ok) {
      const quoteData = await quotesRes.json();
      const quotes = quoteData.data ?? quoteData.quotes ?? [];
      const quoteNumberField = process.env.ZOHO_QUOTE_NUMBER_FIELD || 'Auto_Number_1';
      for (const q of quotes) {
        const stage = (String(q.Quote_Stage ?? '')).toLowerCase();
        if (!stage.includes(WON_STAGE)) continue;
        if (linkedQuoteIds.has(q.id)) continue;
        const name = extractVal(q[quoteNumberField]) || extractVal(q.Subject) || q.id;
        const acct = q.Account_Name as { name?: string } | undefined;
        const contact = q.Contact_Name as { name?: string } | undefined;
        const customer = acct?.name || contact?.name || '—';
        const amount = Number(q.Grand_Total) || 0;
        const currency = (extractVal(q.Currency_2) || 'USD').toUpperCase();
        toBeInvoiced.push({ id: q.id, name, customer, amount, currency });
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
          (inv: { Type?: string; Status?: string }) =>
            (inv.Type || 'ACCREC').toUpperCase() === 'ACCREC' && (inv.Status || '').toLowerCase() !== 'paid'
        );
        const now = Date.now();
        const day = 24 * 60 * 60 * 1000;
        for (const inv of invoices) {
          const dueDate = inv.DueDate || inv.Date || '';
          const amount = inv.Total ?? 0;
          const currency = inv.CurrencyCode || 'USD';
          const bucket = getAgeBucket(dueDate);
          ageing[bucket] = (ageing[bucket] ?? 0) + amount;
          outstanding.push({
            id: inv.InvoiceID,
            number: inv.InvoiceNumber || inv.InvoiceID,
            entity: inv.Contact?.Name || '—',
            amount,
            currency,
            dueDate,
            ageBucket: bucket,
          });
          const dueTime = dueDate ? new Date(dueDate).getTime() : now;
          if (dueTime >= now && dueTime <= now + 30 * day) expectedCash30 += amount;
          if (dueTime >= now && dueTime <= now + 60 * day) expectedCash60 += amount;
          if (dueTime >= now && dueTime <= now + 90 * day) expectedCash90 += amount;
        }
      }
    } catch {
      // leave outstanding empty
    }
  }

  return NextResponse.json({
    toBeInvoiced,
    outstanding,
    ageing,
    expectedCash30,
    expectedCash60,
    expectedCash90,
  });
}
