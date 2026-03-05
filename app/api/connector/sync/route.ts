import { NextRequest, NextResponse } from 'next/server';
import { getZohoAccessToken, getZohoCrmDomain } from '@/lib/zoho-client';
import { getValidAccessToken } from '@/lib/xero-store';
import { getXeroTokens } from '@/lib/xero-store';
import { getLinkByXeroInvoiceId } from '@/lib/connector-store';
import { updatePaidAt } from '@/lib/connector-store';
import { createInvoiceFromQuoteId } from '@/lib/connector-create-invoice';
import { updateQuoteCustomField } from '@/lib/zoho-quote-update';

const WON_STAGE = (process.env.ZOHO_QUOTE_WON_STAGE || 'Won').toLowerCase();
const QUOTE_FIELDS = 'id,Quote_Stage,Modified_Time,Created_Time';

/**
 * GET or POST: sync job.
 * 1) Auto-create Xero invoices for Zoho quotes in Won stage that have no link.
 * 2) Payment sync: for Xero invoices that are PAID, update link store paidAt (and optionally Zoho later).
 */
export async function GET(request: NextRequest) {
  return runSync(request);
}

export async function POST(request: NextRequest) {
  return runSync(request);
}

async function runSync(_request: NextRequest) {
  const created: { zohoQuoteId: string; xeroInvoiceNumber?: string }[] = [];
  const createErrors: { zohoQuoteId: string; error: string }[] = [];
  let paymentUpdates = 0;

  const { token: zohoToken } = await getZohoAccessToken();
  if (!zohoToken) {
    return NextResponse.json({
      ok: false,
      error: 'Zoho not configured',
      created,
      createErrors,
      paymentUpdates,
    });
  }

  const domain = getZohoCrmDomain();
  const since = new Date();
  since.setDate(since.getDate() - 90);

  const quotesUrl = `${domain}/crm/v2/Quotes?sort_by=Modified_Time&sort_order=desc&per_page=100&fields=${QUOTE_FIELDS}`;
  const quotesRes = await fetch(quotesUrl, {
    headers: { Authorization: `Zoho-oauthtoken ${zohoToken}` },
  });

  if (!quotesRes.ok) {
    return NextResponse.json({
      ok: false,
      error: `Zoho quotes failed: ${quotesRes.status}`,
      created,
      createErrors,
      paymentUpdates,
    });
  }

  const quoteData = await quotesRes.json();
  const quotes = quoteData.data ?? quoteData.quotes ?? [];
  const wonQuoteIds = quotes
    .filter((q: { Quote_Stage?: string; Modified_Time?: string; Created_Time?: string }) => {
      const stage = (String(q.Quote_Stage ?? '')).toLowerCase();
      const mod = q.Modified_Time ?? q.Created_Time;
      if (!stage.includes(WON_STAGE)) return false;
      if (mod && new Date(mod) < since) return false;
      return true;
    })
    .map((q: { id: string }) => q.id)
    .filter(Boolean);

  for (const quoteId of wonQuoteIds) {
    const result = await createInvoiceFromQuoteId(quoteId);
    if (result.ok && !result.alreadyLinked) {
      created.push({ zohoQuoteId: quoteId, xeroInvoiceNumber: result.xeroInvoiceNumber });
    } else if (!result.ok) {
      createErrors.push({ zohoQuoteId: quoteId, error: result.error });
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
        const invoices = data.Invoices || [];
        for (const inv of invoices) {
          if ((inv.Type || 'ACCREC').toUpperCase() !== 'ACCREC') continue;
          const status = (inv.Status || '').toLowerCase();
          if (status !== 'paid') continue;
          const payments = inv.Payments as { Date?: string }[] | undefined;
          const paidAt = payments?.[0]?.Date ?? new Date().toISOString().split('T')[0];
          const link = getLinkByXeroInvoiceId(inv.InvoiceID);
          if (link && !link.paidAt) {
            updatePaidAt(link.zohoQuoteId, paidAt);
            paymentUpdates += 1;
            const customField = process.env.ZOHO_CUSTOM_FIELD_XERO_PAID_DATE;
            if (customField && customField.trim()) {
              await updateQuoteCustomField(link.zohoQuoteId, customField.trim(), paidAt);
            }
          }
        }
      }
    } catch {
      // non-fatal
    }
  }

  return NextResponse.json({
    ok: true,
    created: created.length,
    createdDetails: created,
    createErrors,
    paymentUpdates,
  });
}
