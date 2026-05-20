import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-session';
import {
  listRoleModulePermissions,
  setRoleModulePermission,
  type ModuleKey,
  type ModulePermissionLevel,
} from '@/lib/module-access';
import { normalizeRole } from '@/lib/rbac';
import { logAuditEvent } from '@/lib/users';

export async function GET() {
  const current = await getCurrentUser();
  if (!current?.capabilities.canManageUsers) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const permissions = await listRoleModulePermissions();
  return NextResponse.json({ permissions });
}

export async function PUT(request: Request) {
  const current = await getCurrentUser();
  if (!current?.capabilities.canManageUsers) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const body = await request.json().catch(() => ({}));
  const role = normalizeRole(String(body?.role || 'staff'));
  const moduleKey = String(body?.moduleKey || '') as ModuleKey;
  const permissionLevel = String(body?.permissionLevel || 'none') as ModulePermissionLevel;
  if (!moduleKey) {
    return NextResponse.json({ error: 'moduleKey is required' }, { status: 400 });
  }
  await setRoleModulePermission({ role, moduleKey, permissionLevel });
  await logAuditEvent({
    eventType: 'admin.module_access.role_permission_updated',
    actorUserId: current.id,
    metadata: { role, moduleKey, permissionLevel },
  });
  return NextResponse.json({ ok: true });
}

