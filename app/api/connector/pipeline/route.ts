import { NextResponse } from 'next/server';
import { getZohoAccessToken, getZohoCrmDomain } from '@/lib/zoho-client';
import { getValidAccessToken } from '@/lib/xero-store';
import { getXeroTokens } from '@/lib/xero-store';
import { listLinks } from '@/lib/connector-store';

type PipelineRow = {
  zohoQuoteId: string;
  quoteName: string;
  customer: string;
  amount: number;
  currency: string;
  stage: string;
  createdBy?: string;
  endCustomer?: string;
  dealName?: string;
  xeroInvoiceId?: string;
  xeroInvoiceNumber?: string;
  xeroStatus?: string;
  paidAt?: string;
  paidAmount?: number;
};

export async function GET() {
  const pipeline: PipelineRow[] = [];
  const links = listLinks();
  const linkByQuoteId = new Map(links.map((l) => [l.zohoQuoteId, l]));

  let xeroInvoices: { InvoiceID?: string; Status?: string; Total?: number; Payments?: { Date?: string; Amount?: number }[] }[] = [];
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
        const all = data.Invoices || [];
        xeroInvoices = all.filter((inv: { Type?: string }) => (inv.Type || 'ACCREC').toUpperCase() === 'ACCREC');
      }
    } catch {
      // leave xeroInvoices empty
    }
  }

  const xeroByInvoiceId = new Map(
    xeroInvoices.map((inv) => [
      inv.InvoiceID,
      {
        status: (inv.Status || '').toLowerCase(),
        total: inv.Total ?? 0,
        paidAt: inv.Payments?.[0]?.Date,
        paidAmount: inv.Payments?.reduce((s, p) => s + (p.Amount ?? 0), 0),
      },
    ])
  );

  const { token: zohoToken } = await getZohoAccessToken();
  if (!zohoToken) {
    return NextResponse.json({
      pipeline,
      links,
      error: 'Zoho not configured',
    });
  }

  const domain = getZohoCrmDomain();
  const QUOTE_FIELDS = [
    'Auto_Number_1', 'Currency_2', 'Grand_Total', 'Quote_Stage', 'Subject',
    'Account_Name', 'Contact_Name', 'Created_By', 'End_Customer', 'Deal_Name',
  ].join(',');
  const quotesUrl = `${domain}/crm/v2/Quotes?sort_by=Modified_Time&sort_order=desc&per_page=100&fields=${QUOTE_FIELDS}`;
  const quotesRes = await fetch(quotesUrl, {
    headers: { Authorization: `Zoho-oauthtoken ${zohoToken}` },
  });

  if (!quotesRes.ok) {
    return NextResponse.json({
      pipeline,
      links,
      error: `Zoho quotes failed: ${quotesRes.status}`,
    });
  }

  const quoteData = await quotesRes.json();
  const quotes = quoteData.data ?? quoteData.quotes ?? [];

  function extractVal(v: unknown): string | undefined {
    if (v == null) return undefined;
    if (typeof v === 'string' && v.trim()) return v.trim();
    if (v && typeof v === 'object') {
      const o = v as Record<string, unknown>;
      if (typeof o.name === 'string' && o.name.trim()) return o.name.trim();
    }
    return undefined;
  }

  const quoteNumberField = process.env.ZOHO_QUOTE_NUMBER_FIELD || 'Auto_Number_1';
  const wonStage = (process.env.ZOHO_QUOTE_WON_STAGE || 'Won').toLowerCase();

  for (const q of quotes) {
    const id = q.id;
    if (!id) continue;
    const stage = String(q.Quote_Stage ?? '').toLowerCase();
    const name =
      extractVal(q[quoteNumberField]) ||
      extractVal(q.Subject) ||
      (q.id as string);
    const acct = q.Account_Name as { name?: string } | undefined;
    const contact = q.Contact_Name as { name?: string } | undefined;
    const customer = acct?.name || contact?.name || '-';
    const amount = Number(q.Grand_Total) || 0;
    const currency = (extractVal(q.Currency_2) || 'USD').toUpperCase();
    const link = linkByQuoteId.get(id);
    const xeroId = link?.xeroInvoiceId;
    const xeroInfo = xeroId ? xeroByInvoiceId.get(xeroId) : undefined;

    const row: PipelineRow = {
      zohoQuoteId: id,
      quoteName: name,
      customer,
      amount,
      currency,
      stage,
      createdBy: extractVal(q.Created_By),
      endCustomer: (q.End_Customer as { name?: string })?.name,
      dealName: (q.Deal_Name as { name?: string })?.name,
      xeroInvoiceId: link?.xeroInvoiceId,
      xeroInvoiceNumber: link?.xeroInvoiceNumber,
      xeroStatus: xeroInfo?.status,
      paidAt: link?.paidAt ?? xeroInfo?.paidAt,
      paidAmount: xeroInfo?.paidAmount,
    };
    pipeline.push(row);
  }

  return NextResponse.json({
    pipeline,
    links,
  });
}
