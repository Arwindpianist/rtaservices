import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-session';
import { listPrivateSupportRequests, updatePrivateSupportRequestStatus } from '@/lib/private-support';
import { logAuditEvent } from '@/lib/users';
import { requireModuleAccessAsync } from '@/lib/module-access';

export async function GET(request: Request) {
  const denied = await requireModuleAccessAsync('admin.support_queue', 'view');
  if (denied) return denied;
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || undefined;
  const rows = await listPrivateSupportRequests(status);
  return NextResponse.json({ requests: rows });
}

export async function PATCH(request: Request) {
  const denied = await requireModuleAccessAsync('admin.support_queue', 'edit');
  if (denied) return denied;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const id = typeof body.id === 'string' ? body.id : '';
  const status = typeof body.status === 'string' ? body.status : '';
  if (!id || !status) {
    return NextResponse.json({ error: 'id and status are required' }, { status: 400 });
  }
  await updatePrivateSupportRequestStatus(id, status as 'open' | 'in_progress' | 'resolved' | 'closed');
  await logAuditEvent({
    eventType: 'private_support.status_updated',
    actorUserId: user.id,
    metadata: { requestId: id, status },
  });
  return NextResponse.json({ ok: true });
}

