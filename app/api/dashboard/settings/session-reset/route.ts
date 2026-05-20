import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-session';
import { requestPasswordResetByEmail, logAuditEvent } from '@/lib/users';
import { requireModuleAccessAsync } from '@/lib/module-access';

export async function POST() {
  const denied = await requireModuleAccessAsync('dashboard.settings', 'view');
  if (denied) return denied;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  await requestPasswordResetByEmail(user.email);
  await logAuditEvent({
    eventType: 'settings.password_reset_requested',
    actorUserId: user.id,
    targetUserId: user.id,
  });
  return NextResponse.json({ ok: true });
}

