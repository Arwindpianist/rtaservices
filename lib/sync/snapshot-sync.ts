import { getCacheEntryInfo, withReadThroughCache } from '@/lib/cache-store';

type Producer<T> = () => Promise<T>;

export async function readSnapshot<T>(key: string, ttlSeconds: number, producer: Producer<T>): Promise<T> {
  const { value } = await withReadThroughCache(key, ttlSeconds, producer);
  return value;
}

export async function refreshSnapshotIfStale<T>(
  key: string,
  staleAfterMs: number,
  ttlSeconds: number,
  producer: Producer<T>,
): Promise<void> {
  const info = await getCacheEntryInfo(key);
  if (!info) return;
  const updatedAt = new Date(info.updatedAt).getTime();
  if (Date.now() - updatedAt < staleAfterMs) return;
  void withReadThroughCache(key, ttlSeconds, producer);
}

