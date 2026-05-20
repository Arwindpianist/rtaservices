/**
 * Xero token store. In-memory with optional file persistence to data/xero-tokens.json.
 * For production multi-instance, replace with Vercel KV or a DB (same interface).
 */
import { sql } from '@/lib/db';
import { ensureNeonSchema } from '@/lib/neon-schema';
import { features } from '@/lib/features';

const DATA_DIR = 'data';
const DATA_FILE = 'xero-tokens.json';

type StoredTokens = {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  tenant_id?: string;
  authorized_by_user_id?: string;
  authorized_by_role?: string;
  authorized_at?: string;
};

let stored: StoredTokens | null = null;
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
    // ignore
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
    const data = JSON.parse(raw);
    if (data && data.access_token && data.refresh_token && data.expires_at) {
      stored = {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: data.expires_at,
        tenant_id: data.tenant_id,
      };
    }
  } catch {
    // start fresh
  }
}

function saveToFile(): void {
  if (!stored) return;
  try {
    const fs = require('fs');
    ensureDataDir();
    const p = getDataPath();
    if (!p) return;
    fs.writeFileSync(
      p,
      JSON.stringify(
        {
          access_token: stored.access_token,
          refresh_token: stored.refresh_token,
          expires_at: stored.expires_at,
          tenant_id: stored.tenant_id,
        },
        null,
        2
      ),
      'utf-8'
    );
  } catch {
    // ignore
  }
}

export function getXeroTokens(): StoredTokens | null {
  if (features.neonPersistence) {
    return stored;
  }
  loadFromFile();
  return stored;
}

export function setXeroTokens(tokens: {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  tenant_id?: string;
  authorized_by_user_id?: string;
  authorized_by_role?: string;
}) {
  if (features.neonPersistence) {
    stored = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: Date.now() + tokens.expires_in * 1000,
      tenant_id: tokens.tenant_id,
      authorized_by_user_id: tokens.authorized_by_user_id,
      authorized_by_role: tokens.authorized_by_role,
      authorized_at: new Date().toISOString(),
    };
    void setXeroTokensAsync(tokens);
    return;
  }
  loadFromFile();
  stored = {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_at: Date.now() + tokens.expires_in * 1000,
    tenant_id: tokens.tenant_id,
    authorized_by_user_id: tokens.authorized_by_user_id,
    authorized_by_role: tokens.authorized_by_role,
    authorized_at: new Date().toISOString(),
  };
  saveToFile();
}

export function clearXeroTokens() {
  if (features.neonPersistence) {
    loaded = true;
    stored = null;
    void clearXeroTokensAsync();
    return;
  }
  loaded = true;
  stored = null;
  try {
    const fs = require('fs');
    const p = getDataPath();
    if (p && fs.existsSync(p)) fs.unlinkSync(p);
  } catch {
    // ignore
  }
}

export async function getValidAccessToken(): Promise<string | null> {
  await loadFromNeonIfEnabled();
  if (!features.neonPersistence) loadFromFile();
  if (!stored) return null;
  const buffer = 60 * 1000; // refresh 1 min before expiry
  if (Date.now() >= stored.expires_at - buffer) {
    const clientId = process.env.XERO_CLIENT_ID;
    const clientSecret = process.env.XERO_CLIENT_SECRET;
    if (!clientId || !clientSecret) return null;
    const res = await fetch('https://identity.xero.com/connect/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: stored.refresh_token,
      }).toString(),
    });
    if (!res.ok) return null;
    const data = await res.json();
    await setXeroTokensAsync({
      access_token: data.access_token,
      refresh_token: data.refresh_token || stored.refresh_token,
      expires_in: data.expires_in || 1800,
      tenant_id: data.tenant_id || stored.tenant_id,
    });
    stored = {
      access_token: data.access_token,
      refresh_token: data.refresh_token || stored.refresh_token,
      expires_at: Date.now() + (data.expires_in || 1800) * 1000,
      tenant_id: data.tenant_id || stored.tenant_id,
    };
    return stored.access_token;
  }
  return stored.access_token;
}

async function loadFromNeonIfEnabled(): Promise<void> {
  if (!features.neonPersistence || stored) return;
  await ensureNeonSchema();
  const rows = await sql<StoredTokens[]>`
    SELECT access_token, refresh_token, expires_at, tenant_id
    FROM xero_tokens
    WHERE id = 'default'
    LIMIT 1
  `;
  const row = rows[0];
  if (row) {
    stored = row;
    loaded = true;
  }
}

export async function setXeroTokensAsync(tokens: {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  tenant_id?: string;
  authorized_by_user_id?: string;
  authorized_by_role?: string;
}): Promise<void> {
  if (!features.neonPersistence) {
    setXeroTokens(tokens);
    return;
  }
  await ensureNeonSchema();
  const expiresAt = Date.now() + tokens.expires_in * 1000;
  await sql`
    INSERT INTO xero_tokens (id, access_token, refresh_token, expires_at, tenant_id, authorized_by_user_id, authorized_by_role, authorized_at, updated_at)
    VALUES ('default', ${tokens.access_token}, ${tokens.refresh_token}, ${expiresAt}, ${tokens.tenant_id ?? null}, ${tokens.authorized_by_user_id ?? null}, ${tokens.authorized_by_role ?? null}, NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
      access_token = EXCLUDED.access_token,
      refresh_token = EXCLUDED.refresh_token,
      expires_at = EXCLUDED.expires_at,
      tenant_id = EXCLUDED.tenant_id,
      authorized_by_user_id = COALESCE(EXCLUDED.authorized_by_user_id, xero_tokens.authorized_by_user_id),
      authorized_by_role = COALESCE(EXCLUDED.authorized_by_role, xero_tokens.authorized_by_role),
      authorized_at = COALESCE(EXCLUDED.authorized_at, xero_tokens.authorized_at),
      updated_at = NOW()
  `;
}

export async function getXeroTokensAsync(): Promise<StoredTokens | null> {
  if (!features.neonPersistence) return getXeroTokens();
  await loadFromNeonIfEnabled();
  return stored;
}

export async function clearXeroTokensAsync(): Promise<void> {
  if (!features.neonPersistence) {
    clearXeroTokens();
    return;
  }
  await ensureNeonSchema();
  await sql`DELETE FROM xero_tokens WHERE id = 'default'`;
}
