import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-session';
import { getUserSettings, upsertUserSettings } from '@/lib/user-settings';
import { logAuditEvent } from '@/lib/users';
import { requireModuleAccessAsync } from '@/lib/module-access';

export async function GET() {
  const denied = await requireModuleAccessAsync('dashboard.settings', 'view');
  if (denied) return denied;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const settings = await getUserSettings(user.id);
  return NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    settings,
  });
}

export async function PUT(request: Request) {
  const denied = await requireModuleAccessAsync('dashboard.settings', 'edit');
  if (denied) return denied;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const settings = await upsertUserSettings(user.id, {
    displayName: typeof body.displayName === 'string' ? body.displayName.trim() || null : undefined,
    defaultPeriod: body.defaultPeriod,
    tableDensity: body.tableDensity,
  });
  await logAuditEvent({
    eventType: 'settings.updated',
    actorUserId: user.id,
    metadata: { keys: ['displayName', 'defaultPeriod', 'tableDensity'] },
  });
  return NextResponse.json({ ok: true, settings });
}

