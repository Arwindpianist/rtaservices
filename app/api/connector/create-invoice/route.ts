import { NextRequest, NextResponse } from 'next/server';
import { createInvoiceFromQuoteId } from '@/lib/connector-create-invoice';

export async function POST(request: NextRequest) {
  let body: { zohoQuoteId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const zohoQuoteId = body.zohoQuoteId?.trim();
  if (!zohoQuoteId) {
    return NextResponse.json({ error: 'zohoQuoteId required' }, { status: 400 });
  }

  const result = await createInvoiceFromQuoteId(zohoQuoteId);

  if (result.ok) {
    return NextResponse.json({
      ok: true,
      xeroInvoiceId: result.xeroInvoiceId,
      xeroInvoiceNumber: result.xeroInvoiceNumber,
      ...(result.alreadyLinked && { alreadyLinked: true }),
    });
  }

  const status = result.error.includes('not configured') || result.error.includes('not connected')
    ? 503
    : result.error.includes('not found')
      ? 404
      : result.error.includes('stage must be')
        ? 400
        : 502;
  return NextResponse.json({ error: result.error }, { status });
}
