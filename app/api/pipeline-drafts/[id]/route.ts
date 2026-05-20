import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-session';
import { deletePipelineDraft, updatePipelineDraft } from '@/lib/pipeline-drafts';
import { requireModuleAccessAsync } from '@/lib/module-access';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const denied = await requireModuleAccessAsync('pipeline.drafts', 'edit');
  if (denied) return denied;
  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));
  await updatePipelineDraft(id, { payload: body?.payload, status: body?.status });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const denied = await requireModuleAccessAsync('pipeline.drafts', 'edit');
  if (denied) return denied;
  const { id } = await context.params;
  await deletePipelineDraft(id);
  return NextResponse.json({ ok: true });
}
