/**
 * Quote–invoice link store for Zoho–Xero connector.
 * In-memory with optional file persistence to data/quote-invoice-links.json.
 * Replace this implementation with DB/KV for production multi-instance.
 */

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
  loadFromFile();
  return memory.get(quoteId) ?? null;
}

export function getLinkByXeroInvoiceId(xeroInvoiceId: string): QuoteInvoiceLink | null {
  loadFromFile();
  for (const link of memory.values()) {
    if (link.xeroInvoiceId === xeroInvoiceId) return link;
  }
  return null;
}

export function setLink(link: QuoteInvoiceLink): void {
  loadFromFile();
  memory.set(link.zohoQuoteId, {
    ...link,
    createdAt: link.createdAt ?? new Date().toISOString(),
  });
  saveToFile();
}

export function listLinks(): QuoteInvoiceLink[] {
  loadFromFile();
  return Array.from(memory.values());
}

export function updatePaidAt(quoteId: string, paidAt: string): void {
  loadFromFile();
  const existing = memory.get(quoteId);
  if (!existing) return;
  memory.set(quoteId, { ...existing, paidAt });
  saveToFile();
}

export function setLinkByXeroId(xeroInvoiceId: string, paidAt: string): void {
  loadFromFile();
  for (const [qId, link] of memory.entries()) {
    if (link.xeroInvoiceId === xeroInvoiceId) {
      memory.set(qId, { ...link, paidAt });
      saveToFile();
      return;
    }
  }
}
