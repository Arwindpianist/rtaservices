import { NextResponse } from 'next/server';
import { getXeroTokens } from '@/lib/xero-store';
import { requireModuleAccessAsync } from '@/lib/module-access';
import { withReadThroughCache } from '@/lib/cache-store';
import { refreshSnapshotIfStale } from '@/lib/sync/snapshot-sync';

export async function GET() {
  const denied = await requireModuleAccessAsync('dashboard.xero', 'view');
  if (denied) return denied;
  const producer = async () => {
    const tokens = getXeroTokens();
    return { connected: !!tokens };
  };
  const { value } = await withReadThroughCache('dashboard:xero:status', 45, producer);
  void refreshSnapshotIfStale('dashboard:xero:status', 30_000, 45, producer);
  return NextResponse.json(value, {
    headers: { 'Cache-Control': 'private, max-age=20, stale-while-revalidate=45' },
  });
}
