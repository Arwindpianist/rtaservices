import { NextRequest, NextResponse } from 'next/server';
import { getZohoAccessToken, getZohoCrmDomain } from '@/lib/zoho-client';

const QUOTE_FIELDS = [
  'Auto_Number_1', 'Currency_2', 'Grand_Total', 'Quote_Stage', 'Subject', 'Description',
  'Account_Name', 'Deal_Name', 'Contact_Name', 'Valid_Till', 'Quote_Date',
  'Payment_Terms', 'Delivery_Terms', 'Delivery_Time', 'Carrier',
  'Billing_Country', 'Billing_City', 'Billing_Street', 'Billing_Code', 'Billing_State',
  'Sub_Total', 'Tax', 'Discount', 'Adjustment', 'Exchange_Rate',
  'Created_Time', 'Modified_Time', 'Created_By', 'Modified_By', 'Owner',
  'Terms_and_Conditions', 'End_Customer', 'Quoted_Items',
].join(',');

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: 'Quote ID required' }, { status: 400 });
  }

  const { token, error: tokenError } = await getZohoAccessToken();
  if (!token) {
    return NextResponse.json(
      { error: tokenError || 'Zoho not configured' },
      { status: 503 }
    );
  }

  const domain = getZohoCrmDomain();
  const url = `${domain}/crm/v2/Quotes/${id}?fields=${QUOTE_FIELDS}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Zoho-oauthtoken ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      { error: `Zoho API error: ${res.status}`, details: text.slice(0, 200) },
      { status: res.status === 404 ? 404 : 502 }
    );
  }

  const data = await res.json();
  const quote = data.data?.[0] ?? data.quotes?.[0] ?? data;
  if (!quote || !quote.id) {
    return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
  }

  return NextResponse.json({ quote });
}
