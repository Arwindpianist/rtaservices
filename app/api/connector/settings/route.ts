import { NextResponse } from 'next/server';

/**
 * GET: return current connector settings (from env). Read-only; no secrets.
 */
export async function GET() {
  const settings = {
    ZOHO_QUOTE_WON_STAGE: process.env.ZOHO_QUOTE_WON_STAGE ?? 'Won',
    XERO_DEFAULT_ACCOUNT_CODE: process.env.XERO_DEFAULT_ACCOUNT_CODE ?? '200',
    XERO_DEFAULT_TAX_TYPE: process.env.XERO_DEFAULT_TAX_TYPE ?? 'NONE',
    XERO_AUTO_SEND_INVOICE: process.env.XERO_AUTO_SEND_INVOICE === 'true',
    ZOHO_CUSTOM_FIELD_XERO_PAID_DATE: process.env.ZOHO_CUSTOM_FIELD_XERO_PAID_DATE ?? '',
  };
  return NextResponse.json(settings);
}
