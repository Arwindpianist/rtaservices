/**
 * Update a Zoho CRM Quote (e.g. custom field for Xero paid date).
 * Requires Zoho scope to update Quotes. Use the field's API name (e.g. Xero_Invoice_Paid_Date).
 */

import { getZohoAccessToken, getZohoCrmDomain } from '@/lib/zoho-client';

export async function updateQuoteCustomField(
  quoteId: string,
  fieldName: string,
  value: string
): Promise<{ ok: boolean; error?: string }> {
  const { token, error: tokenError } = await getZohoAccessToken();
  if (!token) {
    return { ok: false, error: tokenError || 'Zoho not configured' };
  }

  const domain = getZohoCrmDomain();
  const url = `${domain}/crm/v2/Quotes/${quoteId}`;
  const body = { data: [{ [fieldName]: value }] };

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Zoho-oauthtoken ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    return { ok: false, error: `Zoho quote update failed: ${res.status} ${text.slice(0, 200)}` };
  }

  return { ok: true };
}
