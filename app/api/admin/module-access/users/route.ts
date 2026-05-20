import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-session';
import {
  listUserModuleOverrides,
  setUserModuleOverride,
  type ModuleKey,
  type ModulePermissionLevel,
} from '@/lib/module-access';
import { listUsers, logAuditEvent } from '@/lib/users';

export async function GET() {
  const current = await getCurrentUser();
  if (!current?.capabilities.canManageUsers) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const [users, overrides] = await Promise.all([listUsers(), listUserModuleOverrides()]);
  return NextResponse.json({ users, overrides });
}

export async function PUT(request: Request) {
  const current = await getCurrentUser();
  if (!current?.capabilities.canManageUsers) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const body = await request.json().catch(() => ({}));
  const userId = String(body?.userId || '');
  const moduleKey = String(body?.moduleKey || '') as ModuleKey;
  const permissionLevel = String(body?.permissionLevel || 'none') as ModulePermissionLevel;
  if (!userId || !moduleKey) {
    return NextResponse.json({ error: 'userId and moduleKey are required' }, { status: 400 });
  }
  await setUserModuleOverride({ userId, moduleKey, permissionLevel });
  await logAuditEvent({
    eventType: 'admin.module_access.user_override_updated',
    actorUserId: current.id,
    targetUserId: userId,
    metadata: { moduleKey, permissionLevel },
  });
  return NextResponse.json({ ok: true });
}

