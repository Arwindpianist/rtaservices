import { NextRequest, NextResponse } from 'next/server';
import { setLink } from '@/lib/connector-store';

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

  setLink({
    zohoQuoteId,
    xeroInvoiceId,
    xeroInvoiceNumber: body.xeroInvoiceNumber?.trim(),
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true, zohoQuoteId, xeroInvoiceId });
}
