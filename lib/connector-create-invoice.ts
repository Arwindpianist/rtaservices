/**
 * Shared logic for creating a Xero invoice from a Zoho quote.
 * Used by POST /api/connector/create-invoice and by the sync job.
 */

import { getZohoAccessToken, getZohoCrmDomain } from '@/lib/zoho-client';
import { getValidAccessToken } from '@/lib/xero-store';
import { getXeroTokens } from '@/lib/xero-store';
import { findOrCreateXeroContact } from '@/lib/xero-contacts';
import { getLinkByQuoteId, setLink } from '@/lib/connector-store';

const QUOTE_FIELDS = [
  'Auto_Number_1', 'Currency_2', 'Grand_Total', 'Quote_Stage', 'Subject', 'Description',
  'Account_Name', 'Deal_Name', 'Contact_Name', 'Valid_Till', 'Quote_Date',
  'Quoted_Items',
].join(',');

function extractVal(v: unknown): string | undefined {
  if (v == null) return undefined;
  if (typeof v === 'string' && v.trim()) return v.trim();
  if (v && typeof v === 'object') {
    const o = v as Record<string, unknown>;
    if (typeof o.name === 'string' && o.name.trim()) return o.name.trim();
  }
  return undefined;
}

function getQuoteName(quote: Record<string, unknown>): string {
  const field = process.env.ZOHO_QUOTE_NUMBER_FIELD || 'Auto_Number_1';
  if (quote[field] != null) {
    const val = extractVal(quote[field]);
    if (val) return String(val);
  }
  const sub = extractVal(quote.Subject);
  if (sub) return sub;
  return (quote.id as string) || 'Quote';
}

function getContactName(quote: Record<string, unknown>): string {
  const acct = quote.Account_Name as { name?: string } | undefined;
  const contact = quote.Contact_Name as { name?: string } | undefined;
  if (acct?.name?.trim()) return acct.name.trim();
  if (contact?.name?.trim()) return contact.name.trim();
  return (quote.Subject as string) || 'Customer';
}

function getCurrency(quote: Record<string, unknown>): string {
  const field = process.env.ZOHO_CURRENCY_OPTION_FIELD || 'Currency_2';
  if (quote[field] != null) {
    const val = extractVal(quote[field]);
    if (val) return String(val).toUpperCase();
  }
  return 'USD';
}

function getDueDate(quote: Record<string, unknown>): string {
  const validTill = quote.Valid_Till as string | undefined;
  if (validTill) {
    const d = new Date(validTill);
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  }
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().slice(0, 10);
}

type QuotedItem = {
  Product_Name?: { name?: string };
  Product_Name1?: { name?: string };
  quantity?: number;
  total?: number;
  list_price?: number;
  net_total?: number;
};

function buildLineItems(quote: Record<string, unknown>): { Description: string; Quantity: number; UnitAmount: number; LineAmount: number; AccountCode: string; TaxType: string }[] {
  const accountCode = process.env.XERO_DEFAULT_ACCOUNT_CODE || '200';
  const taxType = process.env.XERO_DEFAULT_TAX_TYPE || 'NONE';
  const items = quote.Quoted_Items as QuotedItem[] | undefined;
  if (Array.isArray(items) && items.length > 0) {
    return items.map((item) => {
      const name = extractVal(item.Product_Name ?? item.Product_Name1) || 'Item';
      const qty = Math.max(1, Number(item.quantity) || 1);
      const total = Number(item.total ?? item.net_total ?? item.list_price) || 0;
      const unitAmount = total > 0 ? total / qty : 0;
      const lineAmount = Math.round(total * 100) / 100;
      return {
        Description: name,
        Quantity: qty,
        UnitAmount: Math.round(unitAmount * 100) / 100,
        LineAmount: lineAmount,
        AccountCode: accountCode,
        TaxType: taxType,
      };
    });
  }
  const grandTotal = Number(quote.Grand_Total) || 0;
  return [
    {
      Description: getQuoteName(quote),
      Quantity: 1,
      UnitAmount: grandTotal,
      LineAmount: grandTotal,
      AccountCode: accountCode,
      TaxType: taxType,
    },
  ];
}

export type CreateInvoiceResult =
  | { ok: true; xeroInvoiceId: string; xeroInvoiceNumber?: string; alreadyLinked?: boolean }
  | { ok: false; error: string };

/**
 * Create a Xero ACCREC draft invoice from a Zoho quote and store the link.
 * Idempotent: if a link already exists for the quote, returns existing link.
 */
export async function createInvoiceFromQuoteId(zohoQuoteId: string): Promise<CreateInvoiceResult> {
  const wonStage = (process.env.ZOHO_QUOTE_WON_STAGE || 'Won').toLowerCase();

  const existing = getLinkByQuoteId(zohoQuoteId);
  if (existing) {
    return {
      ok: true,
      xeroInvoiceId: existing.xeroInvoiceId,
      xeroInvoiceNumber: existing.xeroInvoiceNumber,
      alreadyLinked: true,
    };
  }

  const { token: zohoToken, error: zohoError } = await getZohoAccessToken();
  if (!zohoToken) {
    return { ok: false, error: zohoError || 'Zoho not configured' };
  }

  const domain = getZohoCrmDomain();
  const quoteRes = await fetch(`${domain}/crm/v2/Quotes/${zohoQuoteId}?fields=${QUOTE_FIELDS}`, {
    headers: { Authorization: `Zoho-oauthtoken ${zohoToken}` },
  });
  if (!quoteRes.ok) {
    return { ok: false, error: `Zoho quote fetch failed: ${quoteRes.status}` };
  }
  const quoteData = await quoteRes.json();
  const quote = quoteData.data?.[0] ?? quoteData.quotes?.[0];
  if (!quote || quote.id !== zohoQuoteId) {
    return { ok: false, error: 'Quote not found' };
  }

  const stage = (String(quote.Quote_Stage ?? '')).toLowerCase();
  if (!stage.includes(wonStage)) {
    return { ok: false, error: `Quote stage must be "${wonStage}". Current: ${quote.Quote_Stage}` };
  }

  const accessToken = await getValidAccessToken();
  const tokens = getXeroTokens();
  const tenantId = tokens?.tenant_id;
  if (!accessToken || !tenantId) {
    return { ok: false, error: 'Xero not connected' };
  }

  const contactName = getContactName(quote);
  const contactId = await findOrCreateXeroContact(accessToken, tenantId, { name: contactName });

  const date = new Date().toISOString().slice(0, 10);
  const dueDate = getDueDate(quote);
  const reference = getQuoteName(quote);
  const lineItems = buildLineItems(quote);
  const autoSend = process.env.XERO_AUTO_SEND_INVOICE === 'true';

  const invoicePayload = {
    Type: 'ACCREC',
    Contact: { ContactID: contactId },
    Date: date,
    DueDate: dueDate,
    Reference: reference,
    Status: autoSend ? 'SUBMITTED' : 'DRAFT',
    LineAmountTypes: 'NoTax',
    LineItems: lineItems,
  };

  const xeroRes = await fetch('https://api.xero.com/api.xro/2.0/Invoices', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Xero-tenant-id': tenantId,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ Invoices: [invoicePayload] }),
  });

  if (!xeroRes.ok) {
    const errText = await xeroRes.text();
    return { ok: false, error: `Xero invoice create failed: ${xeroRes.status} ${errText.slice(0, 200)}` };
  }

  const xeroData = await xeroRes.json();
  const invoices = xeroData.Invoices;
  if (!Array.isArray(invoices) || invoices.length === 0) {
    return { ok: false, error: 'Xero returned no invoice' };
  }
  const inv = invoices[0];
  const xeroInvoiceId = inv.InvoiceID;
  const xeroInvoiceNumber = inv.InvoiceNumber;

  setLink({
    zohoQuoteId,
    xeroInvoiceId,
    xeroInvoiceNumber,
    createdAt: new Date().toISOString(),
  });

  return { ok: true, xeroInvoiceId, xeroInvoiceNumber };
}
