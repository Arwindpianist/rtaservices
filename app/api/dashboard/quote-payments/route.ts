import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { ensureNeonSchema } from '@/lib/neon-schema';
import { requireModuleAccessAsync } from '@/lib/module-access';
import { getXeroTokensAsync } from '@/lib/xero-store';
import { withReadThroughCache } from '@/lib/cache-store';
import { refreshSnapshotIfStale } from '@/lib/sync/snapshot-sync';

type QuotePaymentRow = {
  zohoQuoteId: string;
  xeroInvoiceId: string;
  xeroInvoiceNumber: string | null;
  paidAt: string | null;
  status: string | null;
  createdAt: string | null;
  updatedAt: string;
};

export async function GET() {
  const denied = await requireModuleAccessAsync('tracking.quote_payments', 'view');
  if (denied) return denied;
  const producer = async () => {
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
    return {
      xeroConnected: Boolean(xeroTokens?.access_token && xeroTokens?.tenant_id),
      items: rows,
    };
  };
  const { value } = await withReadThroughCache('dashboard:quote-payments', 90, producer);
  void refreshSnapshotIfStale('dashboard:quote-payments', 45_000, 90, producer);
  return NextResponse.json(value, {
    headers: { 'Cache-Control': 'private, max-age=30, stale-while-revalidate=90' },
  });
}

