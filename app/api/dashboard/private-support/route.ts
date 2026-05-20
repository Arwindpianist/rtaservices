import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-session';
import { createPrivateSupportRequest } from '@/lib/private-support';
import { logAuditEvent } from '@/lib/users';
import { requireModuleAccessAsync } from '@/lib/module-access';

export async function POST(request: Request) {
  const denied = await requireModuleAccessAsync('support.private_requests', 'edit');
  if (denied) return denied;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const subject = typeof body.subject === 'string' ? body.subject.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  if (!subject || !message) {
    return NextResponse.json({ error: 'Subject and message are required' }, { status: 400 });
  }

  const created = await createPrivateSupportRequest({
    requesterUserId: user.id,
    requesterEmail: user.email,
    subject,
    message,
  });
  await logAuditEvent({
    eventType: 'private_support.requested',
    actorUserId: user.id,
    metadata: { requestId: created.id, subject: created.subject },
  });
  return NextResponse.json({ ok: true, request: created });
}

