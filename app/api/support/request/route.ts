import { NextRequest, NextResponse } from 'next/server';

/**
 * POST body: { software, contactName, email, company, phone?, version?, instances?, details }
 * Extend to send email / Zoho / CRM when ready.
 */
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const software = typeof body.software === 'string' ? body.software.trim() : '';
  const contactName = typeof body.contactName === 'string' ? body.contactName.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const company = typeof body.company === 'string' ? body.company.trim() : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
  const details = typeof body.details === 'string' ? body.details.trim() : '';

  if (!software || !contactName || !email || !company || !phone || !details) {
    return NextResponse.json(
      { error: 'software, contactName, email, company, phone, and details are required' },
      { status: 400 }
    );
  }

  // TODO: forward to sales@rtaservices.net, Zoho, etc.
  return NextResponse.json({
    ok: true,
    message: 'Support request received. Our team will contact you shortly.',
  });
}
