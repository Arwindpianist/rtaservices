import { NextRequest, NextResponse } from 'next/server';
import { setLinkAsync } from '@/lib/connector-store';
import { invalidateCachePrefix } from '@/lib/cache-store';

/**
 * POST: manually link an Xero invoice to a Zoho quote (reconciliation).
 * Body: { xeroInvoiceId: string, zohoQuoteId: string, xeroInvoiceNumber?: string }
 */
export async function POST(request: NextRequest) {
  let body: { xeroInvoiceId?: string; zohoQuoteId?: string; xeroInvoiceNumber?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const xeroInvoiceId = body.xeroInvoiceId?.trim();
  const zohoQuoteId = body.zohoQuoteId?.trim();
  if (!xeroInvoiceId || !zohoQuoteId) {
    return NextResponse.json(
      { error: 'xeroInvoiceId and zohoQuoteId required' },
      { status: 400 }
    );
  }

  await setLinkAsync({
    zohoQuoteId,
    xeroInvoiceId,
    xeroInvoiceNumber: body.xeroInvoiceNumber?.trim(),
    createdAt: new Date().toISOString(),
  });

  await invalidateCachePrefix('connector:');
  await invalidateCachePrefix('dashboard:finances');
  return NextResponse.json({ ok: true, zohoQuoteId, xeroInvoiceId });
}
