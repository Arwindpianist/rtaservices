import { NextResponse } from 'next/server';
import { withReadThroughCache, writeCache } from '@/lib/cache-store';
import { sql } from '@/lib/db';
import { ensureNeonSchema } from '@/lib/neon-schema';
import { getInvoicesIn, getInvoicesOut, MOCK_CLAIMS, MOCK_PAYMENTS } from '@/lib/mock-data/finances';
import { getValidAccessToken, getXeroTokens, getXeroTokensAsync } from '@/lib/xero-store';

type QuotePaymentRow = {
  zohoQuoteId: string;
  xeroInvoiceId: string;
  xeroInvoiceNumber: string | null;
  paidAt: string | null;
  status: string | null;
  createdAt: string | null;
  updatedAt: string;
};

async function refreshFinancesSummary() {
  const accessToken = await getValidAccessToken();
  const tokens = getXeroTokens();
  const tenantId = tokens?.tenant_id;
  if (accessToken && tenantId) {
    try {
      const res = await fetch(
        'https://api.xero.com/api.xro/2.0/Invoices?pageSize=100&order=DueDate%20DESC',
        { headers: { Authorization: `Bearer ${accessToken}`, 'Xero-tenant-id': tenantId } },
      );
      if (res.ok) {
        const data = await res.json();
        const raw = data.Invoices || [];
        const invoices = raw.map((inv: { Type?: string; Total?: number }) => ({
          type: (inv.Type || 'ACCREC').toUpperCase() === 'ACCPAY' ? 'in' : 'out',
          amount: inv.Total ?? 0,
        }));
        const inList = invoices.filter((i: { type: string }) => i.type === 'in');
        const outList = invoices.filter((i: { type: string }) => i.type === 'out');
        const toPay = inList.reduce((s: number, i: { amount: number }) => s + i.amount, 0);
        const toReceive = outList.reduce((s: number, i: { amount: number }) => s + i.amount, 0);
        const claimsTotal = MOCK_CLAIMS.filter((c) => c.status !== 'Paid').reduce((s, c) => s + c.amount, 0);
        const paymentsDue = MOCK_PAYMENTS.filter((p) => p.status === 'due' || p.status === 'overdue').reduce((s, p) => s + p.amount, 0);
        await writeCache('dashboard:finances:summary', { source: 'xero', toPay, toReceive, claimsTotal, paymentsDue }, 120);
        return;
      }
    } catch {
      // fallback below
    }
  }
  const invoicesIn = getInvoicesIn();
  const invoicesOut = getInvoicesOut();
  const toPay = invoicesIn.reduce((s, i) => s + i.amount, 0);
  const toReceive = invoicesOut.reduce((s, i) => s + i.amount, 0);
  const claimsTotal = MOCK_CLAIMS.filter((c) => c.status !== 'Paid').reduce((s, c) => s + c.amount, 0);
  const paymentsDue = MOCK_PAYMENTS.filter((p) => p.status === 'due' || p.status === 'overdue').reduce((s, p) => s + p.amount, 0);
  await writeCache('dashboard:finances:summary', { source: 'mock', toPay, toReceive, claimsTotal, paymentsDue }, 120);
}

async function refreshQuotePayments() {
  await ensureNeonSchema();
  const [rows, xeroTokens] = await Promise.all([
    sql<QuotePaymentRow[]>`
      SELECT zoho_quote_id as "zohoQuoteId",
             xero_invoice_id as "xeroInvoiceId",
             xero_invoice_number as "xeroInvoiceNumber",
             paid_at as "paidAt",
             status,
             created_at as "createdAt",
             updated_at as "updatedAt"
      FROM integration_links
      ORDER BY updated_at DESC
      LIMIT 500
    `,
    getXeroTokensAsync(),
  ]);
  await writeCache('dashboard:quote-payments', {
    xeroConnected: Boolean(xeroTokens?.access_token && xeroTokens?.tenant_id),
    items: rows,
  }, 90);
}

async function refreshXeroStatus() {
  await withReadThroughCache('dashboard:xero:status', 45, async () => ({ connected: !!getXeroTokens() }));
}

async function runSync(request: Request) {
  const auth = request.headers.get('authorization') || '';
  const isVercelCron = request.headers.has('x-vercel-cron');
  const expected = process.env.CRON_SECRET;
  if (!isVercelCron && (!expected || auth !== `Bearer ${expected}`)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await Promise.all([refreshFinancesSummary(), refreshQuotePayments(), refreshXeroStatus()]);
  return NextResponse.json({ ok: true, synced: ['dashboard:finances:summary', 'dashboard:quote-payments', 'dashboard:xero:status'] });
}

export async function GET(request: Request) {
  return runSync(request);
}

export async function POST(request: Request) {
  return runSync(request);
}

