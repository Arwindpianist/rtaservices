/**
 * Quote–invoice link store for Zoho–Xero connector.
 * In-memory with optional file persistence to data/quote-invoice-links.json.
 * Replace this implementation with DB/KV for production multi-instance.
 */
import { sql } from '@/lib/db';
import { ensureNeonSchema } from '@/lib/neon-schema';
import { features } from '@/lib/features';

export interface QuoteInvoiceLink {
  zohoQuoteId: string;
  xeroInvoiceId: string;
  xeroInvoiceNumber?: string;
  createdAt?: string;
  paidAt?: string;
}

const DATA_DIR = 'data';
const DATA_FILE = 'quote-invoice-links.json';

let memory = new Map<string, QuoteInvoiceLink>();
let loaded = false;

function getDataPath(): string {
  if (typeof process === 'undefined' || !process.cwd) return '';
  const path = require('path');
  return path.join(process.cwd(), DATA_DIR, DATA_FILE);
}

function ensureDataDir(): void {
  try {
    const fs = require('fs');
    const path = require('path');
    const dir = path.join(process.cwd(), DATA_DIR);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch {
    // ignore (e.g. read-only filesystem)
  }
}

function loadFromFile(): void {
  if (loaded) return;
  loaded = true;
  try {
    const fs = require('fs');
    const p = getDataPath();
    if (!p || !fs.existsSync(p)) return;
    const raw = fs.readFileSync(p, 'utf-8');
    const arr: QuoteInvoiceLink[] = JSON.parse(raw);
    memory = new Map(arr.map((link) => [link.zohoQuoteId, link]));
  } catch {
    // start fresh
  }
}

function saveToFile(): void {
  try {
    const fs = require('fs');
    ensureDataDir();
    const p = getDataPath();
    if (!p) return;
    const arr = Array.from(memory.values());
    fs.writeFileSync(p, JSON.stringify(arr, null, 2), 'utf-8');
  } catch {
    // ignore
  }
}

export function getLinkByQuoteId(quoteId: string): QuoteInvoiceLink | null {
  if (features.neonPersistence) {
    return null;
  }
  loadFromFile();
  return memory.get(quoteId) ?? null;
}

export function getLinkByXeroInvoiceId(xeroInvoiceId: string): QuoteInvoiceLink | null {
  if (features.neonPersistence) {
    return null;
  }
  loadFromFile();
  for (const link of memory.values()) {
    if (link.xeroInvoiceId === xeroInvoiceId) return link;
  }
  return null;
}

export function setLink(link: QuoteInvoiceLink): void {
  if (features.neonPersistence) {
    void upsertLinkNeon(link);
    return;
  }
  loadFromFile();
  memory.set(link.zohoQuoteId, {
    ...link,
    createdAt: link.createdAt ?? new Date().toISOString(),
  });
  saveToFile();
}

export function listLinks(): QuoteInvoiceLink[] {
  if (features.neonPersistence) {
    return [];
  }
  loadFromFile();
  return Array.from(memory.values());
}

export function updatePaidAt(quoteId: string, paidAt: string): void {
  if (features.neonPersistence) {
    void setPaidAtNeon(quoteId, paidAt);
    return;
  }
  loadFromFile();
  const existing = memory.get(quoteId);
  if (!existing) return;
  memory.set(quoteId, { ...existing, paidAt });
  saveToFile();
}

export function setLinkByXeroId(xeroInvoiceId: string, paidAt: string): void {
  if (features.neonPersistence) {
    void setPaidAtByXeroIdNeon(xeroInvoiceId, paidAt);
    return;
  }
  loadFromFile();
  for (const [qId, link] of memory.entries()) {
    if (link.xeroInvoiceId === xeroInvoiceId) {
      memory.set(qId, { ...link, paidAt });
      saveToFile();
      return;
    }
  }
}

export async function getLinkByQuoteIdAsync(quoteId: string): Promise<QuoteInvoiceLink | null> {
  if (!features.neonPersistence) return getLinkByQuoteId(quoteId);
  await ensureNeonSchema();
  const rows = await sql<QuoteInvoiceLink[]>`
    SELECT zoho_quote_id as "zohoQuoteId", xero_invoice_id as "xeroInvoiceId",
           xero_invoice_number as "xeroInvoiceNumber", created_at as "createdAt", paid_at as "paidAt"
    FROM integration_links
    WHERE zoho_quote_id = ${quoteId}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function getLinkByXeroInvoiceIdAsync(xeroInvoiceId: string): Promise<QuoteInvoiceLink | null> {
  if (!features.neonPersistence) return getLinkByXeroInvoiceId(xeroInvoiceId);
  await ensureNeonSchema();
  const rows = await sql<QuoteInvoiceLink[]>`
    SELECT zoho_quote_id as "zohoQuoteId", xero_invoice_id as "xeroInvoiceId",
           xero_invoice_number as "xeroInvoiceNumber", created_at as "createdAt", paid_at as "paidAt"
    FROM integration_links
    WHERE xero_invoice_id = ${xeroInvoiceId}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function setLinkAsync(link: QuoteInvoiceLink): Promise<void> {
  if (!features.neonPersistence) return setLink(link);
  await upsertLinkNeon(link);
}

export async function listLinksAsync(): Promise<QuoteInvoiceLink[]> {
  if (!features.neonPersistence) return listLinks();
  await ensureNeonSchema();
  return sql<QuoteInvoiceLink[]>`
    SELECT zoho_quote_id as "zohoQuoteId", xero_invoice_id as "xeroInvoiceId",
           xero_invoice_number as "xeroInvoiceNumber", created_at as "createdAt", paid_at as "paidAt"
    FROM integration_links
    ORDER BY updated_at DESC
  `;
}

export async function updatePaidAtAsync(quoteId: string, paidAt: string): Promise<void> {
  if (!features.neonPersistence) return updatePaidAt(quoteId, paidAt);
  await setPaidAtNeon(quoteId, paidAt);
}

async function upsertLinkNeon(link: QuoteInvoiceLink): Promise<void> {
  await ensureNeonSchema();
  await sql`
    INSERT INTO integration_links
      (zoho_quote_id, xero_invoice_id, xero_invoice_number, paid_at, created_at, updated_at)
    VALUES
      (${link.zohoQuoteId}, ${link.xeroInvoiceId}, ${link.xeroInvoiceNumber ?? null}, ${link.paidAt ?? null}, ${link.createdAt ?? new Date().toISOString()}, NOW())
    ON CONFLICT (zoho_quote_id) DO UPDATE SET
      xero_invoice_id = EXCLUDED.xero_invoice_id,
      xero_invoice_number = EXCLUDED.xero_invoice_number,
      paid_at = COALESCE(EXCLUDED.paid_at, integration_links.paid_at),
      updated_at = NOW()
  `;
}

async function setPaidAtNeon(quoteId: string, paidAt: string): Promise<void> {
  await ensureNeonSchema();
  await sql`
    UPDATE integration_links
    SET paid_at = ${paidAt}, updated_at = NOW()
    WHERE zoho_quote_id = ${quoteId}
  `;
}

async function setPaidAtByXeroIdNeon(xeroInvoiceId: string, paidAt: string): Promise<void> {
  await ensureNeonSchema();
  await sql`
    UPDATE integration_links
    SET paid_at = ${paidAt}, updated_at = NOW()
    WHERE xero_invoice_id = ${xeroInvoiceId}
  `;
}
