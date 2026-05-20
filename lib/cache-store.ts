import { sql } from '@/lib/db';
import { ensureNeonSchema } from '@/lib/neon-schema';
import { features } from '@/lib/features';

type JsonValue = Record<string, unknown> | unknown[] | string | number | boolean | null;

export type CacheEntryInfo = {
  cacheKey: string;
  updatedAt: string;
  expiresAt: string;
};

export async function readCache<T = unknown>(key: string): Promise<T | null> {
  if (!features.dashboardCache) return null;
  await ensureNeonSchema();
  const rows = await sql<{ payload_json: T; expires_at: string }[]>`
    SELECT payload_json, expires_at
    FROM cache_entries
    WHERE cache_key = ${key}
    LIMIT 1
  `;
  const row = rows[0];
  if (!row) return null;
  if (new Date(row.expires_at).getTime() <= Date.now()) return null;
  return row.payload_json;
}

export async function getCacheEntryInfo(key: string): Promise<CacheEntryInfo | null> {
  if (!features.dashboardCache) return null;
  await ensureNeonSchema();
  const rows = await sql<CacheEntryInfo[]>`
    SELECT cache_key as "cacheKey",
           updated_at as "updatedAt",
           expires_at as "expiresAt"
    FROM cache_entries
    WHERE cache_key = ${key}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

export async function writeCache(key: string, payload: JsonValue, ttlSeconds: number, scope = 'global'): Promise<void> {
  if (!features.dashboardCache) return;
  await ensureNeonSchema();
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();
  await sql`
    INSERT INTO cache_entries (cache_key, scope, payload_json, expires_at, updated_at)
    VALUES (${key}, ${scope}, ${JSON.stringify(payload)}::jsonb, ${expiresAt}, NOW())
    ON CONFLICT (cache_key) DO UPDATE SET
      payload_json = EXCLUDED.payload_json,
      scope = EXCLUDED.scope,
      expires_at = EXCLUDED.expires_at,
      updated_at = NOW()
  `;
}

export async function withReadThroughCache<T>(
  key: string,
  ttlSeconds: number,
  producer: () => Promise<T>
): Promise<{ value: T; cacheHit: boolean }> {
  const cached = await readCache<T>(key);
  if (cached != null) {
    return { value: cached, cacheHit: true };
  }
  const value = await producer();
  await writeCache(key, value as JsonValue, ttlSeconds);
  return { value, cacheHit: false };
}

export async function invalidateCachePrefix(prefix: string): Promise<void> {
  if (!features.dashboardCache) return;
  await ensureNeonSchema();
  await sql`DELETE FROM cache_entries WHERE cache_key LIKE ${`${prefix}%`}`;
  await sql`INSERT INTO cache_invalidation_log (prefix) VALUES (${prefix})`;
}
