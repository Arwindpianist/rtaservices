/**
 * Xero Contacts: find by name or create. Used by connector when creating invoices from Zoho quotes.
 */

const XERO_API = 'https://api.xero.com/api.xro/2.0';

export type ContactInput = { name: string; email?: string };

/**
 * Find a Xero contact by name (exact match). If not found, create one and return its ContactID.
 */
export async function findOrCreateXeroContact(
  accessToken: string,
  tenantId: string,
  input: ContactInput
): Promise<string> {
  const existing = await findXeroContactByName(accessToken, tenantId, input.name);
  if (existing) return existing;

  return createXeroContact(accessToken, tenantId, input);
}

/**
 * GET Contacts?where=Name=="..."
 */
async function findXeroContactByName(
  accessToken: string,
  tenantId: string,
  name: string
): Promise<string | null> {
  if (!name || !name.trim()) return null;
  const escaped = name.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  const where = `Name=="${escaped}"`;
  const url = `${XERO_API}/Contacts?where=${encodeURIComponent(where)}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Xero-tenant-id': tenantId,
    },
  });
  if (!res.ok) return null;
  const data = await res.json();
  const contacts = data.Contacts;
  if (!Array.isArray(contacts) || contacts.length === 0) return null;
  const id = contacts[0].ContactID;
  return id ?? null;
}

/**
 * POST Contacts - create a new contact.
 */
async function createXeroContact(
  accessToken: string,
  tenantId: string,
  input: ContactInput
): Promise<string> {
  const body = {
    Name: input.name.trim(),
    ...(input.email?.trim() && { EmailAddress: input.email.trim() }),
  };
  const res = await fetch(`${XERO_API}/Contacts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Xero-tenant-id': tenantId,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ Contacts: [body] }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Xero create contact failed: ${res.status} ${err}`);
  }
  const data = await res.json();
  const contacts = data.Contacts;
  if (!Array.isArray(contacts) || contacts.length === 0) throw new Error('Xero returned no contact after create');
  const id = contacts[0].ContactID;
  if (!id) throw new Error('Xero contact missing ContactID');
  return id;
}
