/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const postgres = require('postgres');

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required');
  }
  const sql = postgres(databaseUrl, { ssl: 'require' });
  const dataDir = path.join(process.cwd(), 'data');
  const linksPath = path.join(dataDir, 'quote-invoice-links.json');
  const xeroPath = path.join(dataDir, 'xero-tokens.json');

  if (fs.existsSync(linksPath)) {
    const links = JSON.parse(fs.readFileSync(linksPath, 'utf-8'));
    for (const item of links) {
      await sql`
        INSERT INTO integration_links
          (zoho_quote_id, xero_invoice_id, xero_invoice_number, paid_at, created_at, updated_at)
        VALUES
          (${item.zohoQuoteId}, ${item.xeroInvoiceId}, ${item.xeroInvoiceNumber ?? null}, ${item.paidAt ?? null}, ${item.createdAt ?? new Date().toISOString()}, NOW())
        ON CONFLICT (zoho_quote_id) DO UPDATE SET
          xero_invoice_id = EXCLUDED.xero_invoice_id,
          xero_invoice_number = EXCLUDED.xero_invoice_number,
          paid_at = EXCLUDED.paid_at,
          updated_at = NOW()
      `;
    }
    console.log(`Migrated ${links.length} integration links`);
  } else {
    console.log('No quote-invoice-links.json found, skipping');
  }

  if (fs.existsSync(xeroPath)) {
    const tokens = JSON.parse(fs.readFileSync(xeroPath, 'utf-8'));
    if (tokens.access_token && tokens.refresh_token && tokens.expires_at) {
      await sql`
        INSERT INTO xero_tokens (id, access_token, refresh_token, expires_at, tenant_id, updated_at)
        VALUES ('default', ${tokens.access_token}, ${tokens.refresh_token}, ${tokens.expires_at}, ${tokens.tenant_id ?? null}, NOW())
        ON CONFLICT (id) DO UPDATE SET
          access_token = EXCLUDED.access_token,
          refresh_token = EXCLUDED.refresh_token,
          expires_at = EXCLUDED.expires_at,
          tenant_id = EXCLUDED.tenant_id,
          updated_at = NOW()
      `;
      console.log('Migrated xero token store');
    }
  } else {
    console.log('No xero-tokens.json found, skipping');
  }

  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
