import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-session';
import { markDraftCommitted } from '@/lib/pipeline-drafts';
import { updateQuoteCustomField } from '@/lib/zoho-quote-update';
import { invalidateCachePrefix } from '@/lib/cache-store';
import { requireModuleAccessAsync } from '@/lib/module-access';

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const denied = await requireModuleAccessAsync('pipeline.drafts', 'edit');
  if (denied) return denied;
  const body = await request.json().catch(() => ({}));
  const { id } = await context.params;
  const zohoQuoteId = String(body?.zohoQuoteId || '');
  const fieldApiName = String(body?.fieldApiName || '');
  const value = body?.value;
  if (!zohoQuoteId || !fieldApiName) {
    return NextResponse.json({ error: 'zohoQuoteId and fieldApiName are required' }, { status: 400 });
  }
  const result = await updateQuoteCustomField(zohoQuoteId, fieldApiName, value);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 502 });
  }
  await markDraftCommitted(id);
  await invalidateCachePrefix('connector:');
  await invalidateCachePrefix('zoho:');
  return NextResponse.json({ ok: true });
}
