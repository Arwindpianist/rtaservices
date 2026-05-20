import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-session';
import { createPipelineDraft, listPipelineDrafts } from '@/lib/pipeline-drafts';
import { requireModuleAccessAsync } from '@/lib/module-access';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const denied = await requireModuleAccessAsync('pipeline.drafts', 'view');
  if (denied) return denied;
  const drafts = await listPipelineDrafts();
  return NextResponse.json({ drafts });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const denied = await requireModuleAccessAsync('pipeline.drafts', 'edit');
  if (denied) return denied;
  const body = await request.json().catch(() => ({}));
  const zohoQuoteId = String(body?.zohoQuoteId || '');
  const payload = (body?.payload || {}) as Record<string, unknown>;
  if (!zohoQuoteId) return NextResponse.json({ error: 'zohoQuoteId required' }, { status: 400 });
  const draft = await createPipelineDraft({
    zohoQuoteId,
    authorUserId: user.id,
    payload,
    sourceModifiedTime: typeof body?.sourceModifiedTime === 'string' ? body.sourceModifiedTime : undefined,
  });
  return NextResponse.json({ draft });
}
