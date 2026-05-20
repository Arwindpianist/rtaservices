import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-session';
import { listAccessModules, setTenantModuleToggle, type ModuleKey } from '@/lib/module-access';
import { logAuditEvent } from '@/lib/users';

export async function GET() {
  const current = await getCurrentUser();
  if (!current?.capabilities.canManageUsers) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const modules = await listAccessModules();
  return NextResponse.json({ modules });
}

export async function PUT(request: Request) {
  const current = await getCurrentUser();
  if (!current?.capabilities.canManageUsers) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const body = await request.json().catch(() => ({}));
  const moduleKey = String(body?.moduleKey || '') as ModuleKey;
  const enabled = Boolean(body?.enabled);
  if (!moduleKey) {
    return NextResponse.json({ error: 'moduleKey is required' }, { status: 400 });
  }
  await setTenantModuleToggle({ moduleKey, enabled });
  await logAuditEvent({
    eventType: 'admin.module_access.module_toggled',
    actorUserId: current.id,
    metadata: { moduleKey, enabled },
  });
  return NextResponse.json({ ok: true });
}

