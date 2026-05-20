import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-session';
import { sql } from '@/lib/db';
import { ensureNeonSchema } from '@/lib/neon-schema';
import { normalizeRole, type AppRole } from '@/lib/rbac';

export type ModulePermissionLevel = 'none' | 'view' | 'edit' | 'admin';

export type ModuleKey =
  | 'dashboard.settings'
  | 'dashboard.finances'
  | 'dashboard.receivables'
  | 'dashboard.sales_forecast'
  | 'dashboard.customers'
  | 'dashboard.payroll'
  | 'dashboard.hrm'
  | 'dashboard.xero'
  | 'pipeline.drafts'
  | 'admin.users'
  | 'admin.audit'
  | 'admin.module_access'
  | 'admin.support_queue'
  | 'integrations.xero.connect'
  | 'tracking.quote_payments'
  | 'support.private_requests';

export type ModuleDefinition = {
  key: ModuleKey;
  label: string;
  description: string;
  enabled: boolean;
};

export type EffectiveModulePermission = {
  moduleKey: ModuleKey;
  level: ModulePermissionLevel;
  enabled: boolean;
  source: 'default' | 'role' | 'user_override' | 'tenant_disabled';
};

const MODULES: ModuleDefinition[] = [
  { key: 'dashboard.settings', label: 'Dashboard Settings', description: 'User profile/session/preferences settings', enabled: true },
  { key: 'dashboard.finances', label: 'Finances Dashboard', description: 'Master finances widgets and APIs', enabled: true },
  { key: 'dashboard.receivables', label: 'Receivables', description: 'Receivables page and APIs', enabled: true },
  { key: 'dashboard.sales_forecast', label: 'Sales Forecast', description: 'Sales forecast widgets and APIs', enabled: true },
  { key: 'dashboard.customers', label: 'Customers', description: 'Customers dashboard pages', enabled: true },
  { key: 'dashboard.payroll', label: 'Payroll', description: 'Payroll pages and APIs', enabled: true },
  { key: 'dashboard.hrm', label: 'HRM', description: 'HRM pages and APIs', enabled: true },
  { key: 'dashboard.xero', label: 'Xero Data', description: 'Xero invoices/status data visibility', enabled: true },
  { key: 'pipeline.drafts', label: 'Pipeline Drafts', description: 'Temporary pipeline draft CRUD + commit', enabled: true },
  { key: 'admin.users', label: 'User Management', description: 'Invites, user updates, resets', enabled: true },
  { key: 'admin.audit', label: 'Audit Log', description: 'Audit log query and export', enabled: true },
  { key: 'admin.module_access', label: 'Module Access Control', description: 'Manage module-level permissions', enabled: true },
  { key: 'admin.support_queue', label: 'Private Support Queue', description: 'Review and triage private support requests', enabled: true },
  { key: 'integrations.xero.connect', label: 'Connect Xero', description: 'Initiate/refresh Xero OAuth connection', enabled: true },
  { key: 'tracking.quote_payments', label: 'Quote Payment Tracking', description: 'Zoho quote to Xero invoice payment tracking', enabled: true },
  { key: 'support.private_requests', label: 'Private Support Requests', description: 'Submit private help requests', enabled: true },
];

const LEVEL_ORDER: Record<ModulePermissionLevel, number> = {
  none: 0,
  view: 1,
  edit: 2,
  admin: 3,
};

const DEFAULT_BY_ROLE: Record<AppRole, Record<ModuleKey, ModulePermissionLevel>> = {
  superadmin: Object.fromEntries(MODULES.map((m) => [m.key, 'admin'])) as Record<ModuleKey, ModulePermissionLevel>,
  arnaud: {
    'dashboard.finances': 'view',
    'dashboard.settings': 'view',
    'dashboard.receivables': 'view',
    'dashboard.sales_forecast': 'view',
    'dashboard.customers': 'view',
    'dashboard.payroll': 'view',
    'dashboard.hrm': 'view',
    'dashboard.xero': 'view',
    'pipeline.drafts': 'edit',
    'admin.users': 'none',
    'admin.audit': 'none',
    'admin.module_access': 'none',
    'admin.support_queue': 'none',
    'integrations.xero.connect': 'admin',
    'tracking.quote_payments': 'view',
    'support.private_requests': 'edit',
  },
  craig: {
    'dashboard.settings': 'view',
    'dashboard.finances': 'none',
    'dashboard.receivables': 'none',
    'dashboard.sales_forecast': 'view',
    'dashboard.customers': 'view',
    'dashboard.payroll': 'none',
    'dashboard.hrm': 'none',
    'dashboard.xero': 'none',
    'pipeline.drafts': 'edit',
    'admin.users': 'none',
    'admin.audit': 'none',
    'admin.module_access': 'none',
    'admin.support_queue': 'none',
    'integrations.xero.connect': 'none',
    'tracking.quote_payments': 'none',
    'support.private_requests': 'edit',
  },
  chris: {
    'dashboard.settings': 'view',
    'dashboard.finances': 'none',
    'dashboard.receivables': 'none',
    'dashboard.sales_forecast': 'view',
    'dashboard.customers': 'view',
    'dashboard.payroll': 'none',
    'dashboard.hrm': 'none',
    'dashboard.xero': 'none',
    'pipeline.drafts': 'edit',
    'admin.users': 'none',
    'admin.audit': 'none',
    'admin.module_access': 'none',
    'admin.support_queue': 'none',
    'integrations.xero.connect': 'none',
    'tracking.quote_payments': 'none',
    'support.private_requests': 'edit',
  },
  staff: {
    'dashboard.settings': 'view',
    'dashboard.finances': 'none',
    'dashboard.receivables': 'none',
    'dashboard.sales_forecast': 'view',
    'dashboard.customers': 'view',
    'dashboard.payroll': 'none',
    'dashboard.hrm': 'none',
    'dashboard.xero': 'none',
    'pipeline.drafts': 'edit',
    'admin.users': 'none',
    'admin.audit': 'none',
    'admin.module_access': 'none',
    'admin.support_queue': 'none',
    'integrations.xero.connect': 'none',
    'tracking.quote_payments': 'none',
    'support.private_requests': 'edit',
  },
  other: {
    'dashboard.settings': 'view',
    'dashboard.finances': 'none',
    'dashboard.receivables': 'none',
    'dashboard.sales_forecast': 'view',
    'dashboard.customers': 'view',
    'dashboard.payroll': 'none',
    'dashboard.hrm': 'none',
    'dashboard.xero': 'none',
    'pipeline.drafts': 'edit',
    'admin.users': 'none',
    'admin.audit': 'none',
    'admin.module_access': 'none',
    'admin.support_queue': 'none',
    'integrations.xero.connect': 'none',
    'tracking.quote_payments': 'none',
    'support.private_requests': 'edit',
  },
};

function asLevel(value: string | null | undefined): ModulePermissionLevel {
  if (value === 'view' || value === 'edit' || value === 'admin') return value;
  return 'none';
}

function moduleKeys(): ModuleKey[] {
  return MODULES.map((m) => m.key);
}

export async function ensureModuleAccessSeed(): Promise<void> {
  await ensureNeonSchema();
  for (const mod of MODULES) {
    await sql`
      INSERT INTO access_modules (module_key, label, description, is_enabled, updated_at)
      VALUES (${mod.key}, ${mod.label}, ${mod.description}, ${mod.enabled}, NOW())
      ON CONFLICT (module_key) DO UPDATE SET
        label = EXCLUDED.label,
        description = EXCLUDED.description,
        updated_at = NOW()
    `;
    await sql`
      INSERT INTO tenant_module_toggles (module_key, is_enabled, updated_at)
      VALUES (${mod.key}, ${mod.enabled}, NOW())
      ON CONFLICT (module_key) DO NOTHING
    `;
  }

  const roles: AppRole[] = ['superadmin', 'arnaud', 'craig', 'chris', 'staff', 'other'];
  for (const role of roles) {
    const defaults = DEFAULT_BY_ROLE[role];
    for (const key of moduleKeys()) {
      await sql`
        INSERT INTO role_module_permissions (role, module_key, permission_level, updated_at)
        VALUES (${role}, ${key}, ${defaults[key]}, NOW())
        ON CONFLICT (role, module_key) DO NOTHING
      `;
    }
  }
}

export async function listAccessModules(): Promise<ModuleDefinition[]> {
  await ensureModuleAccessSeed();
  const rows = await sql<ModuleDefinition[]>`
    SELECT module_key as key, label, description, is_enabled as enabled
    FROM access_modules
    ORDER BY module_key ASC
  `;
  return rows;
}

export async function listRoleModulePermissions(): Promise<Array<{ role: AppRole; moduleKey: ModuleKey; permissionLevel: ModulePermissionLevel }>> {
  await ensureModuleAccessSeed();
  const rows = await sql<Array<{ role: string; moduleKey: ModuleKey; permissionLevel: string }>>`
    SELECT role, module_key as "moduleKey", permission_level as "permissionLevel"
    FROM role_module_permissions
    ORDER BY role ASC, module_key ASC
  `;
  return rows.map((r) => ({
    role: normalizeRole(r.role),
    moduleKey: r.moduleKey,
    permissionLevel: asLevel(r.permissionLevel),
  }));
}

export async function listUserModuleOverrides(): Promise<Array<{ userId: string; moduleKey: ModuleKey; permissionLevel: ModulePermissionLevel }>> {
  await ensureModuleAccessSeed();
  const rows = await sql<Array<{ userId: string; moduleKey: ModuleKey; permissionLevel: string }>>`
    SELECT user_id as "userId", module_key as "moduleKey", permission_level as "permissionLevel"
    FROM user_module_overrides
    ORDER BY user_id ASC, module_key ASC
  `;
  return rows.map((r) => ({
    userId: r.userId,
    moduleKey: r.moduleKey,
    permissionLevel: asLevel(r.permissionLevel),
  }));
}

export async function setRoleModulePermission(input: {
  role: AppRole;
  moduleKey: ModuleKey;
  permissionLevel: ModulePermissionLevel;
}): Promise<void> {
  await ensureModuleAccessSeed();
  await sql`
    INSERT INTO role_module_permissions (role, module_key, permission_level, updated_at)
    VALUES (${normalizeRole(input.role)}, ${input.moduleKey}, ${input.permissionLevel}, NOW())
    ON CONFLICT (role, module_key) DO UPDATE SET
      permission_level = EXCLUDED.permission_level,
      updated_at = NOW()
  `;
}

export async function setUserModuleOverride(input: {
  userId: string;
  moduleKey: ModuleKey;
  permissionLevel: ModulePermissionLevel;
}): Promise<void> {
  await ensureModuleAccessSeed();
  await sql`
    INSERT INTO user_module_overrides (user_id, module_key, permission_level, updated_at)
    VALUES (${input.userId}, ${input.moduleKey}, ${input.permissionLevel}, NOW())
    ON CONFLICT (user_id, module_key) DO UPDATE SET
      permission_level = EXCLUDED.permission_level,
      updated_at = NOW()
  `;
}

export async function setTenantModuleToggle(input: { moduleKey: ModuleKey; enabled: boolean }): Promise<void> {
  await ensureModuleAccessSeed();
  await sql`
    INSERT INTO tenant_module_toggles (module_key, is_enabled, updated_at)
    VALUES (${input.moduleKey}, ${input.enabled}, NOW())
    ON CONFLICT (module_key) DO UPDATE SET
      is_enabled = EXCLUDED.is_enabled,
      updated_at = NOW()
  `;
}

export async function getEffectiveModulePermissions(user: { id: string; role: string }): Promise<Record<ModuleKey, EffectiveModulePermission>> {
  await ensureModuleAccessSeed();
  const role = normalizeRole(user.role);

  const [toggles, roleRows, userRows] = await Promise.all([
    sql<Array<{ moduleKey: ModuleKey; enabled: boolean }>>`
      SELECT module_key as "moduleKey", is_enabled as enabled
      FROM tenant_module_toggles
    `,
    sql<Array<{ moduleKey: ModuleKey; permissionLevel: string }>>`
      SELECT module_key as "moduleKey", permission_level as "permissionLevel"
      FROM role_module_permissions
      WHERE role = ${role}
    `,
    sql<Array<{ moduleKey: ModuleKey; permissionLevel: string }>>`
      SELECT module_key as "moduleKey", permission_level as "permissionLevel"
      FROM user_module_overrides
      WHERE user_id = ${user.id}
    `,
  ]);

  const toggleMap = new Map(toggles.map((t) => [t.moduleKey, t.enabled]));
  const roleMap = new Map(roleRows.map((r) => [r.moduleKey, asLevel(r.permissionLevel)]));
  const userMap = new Map(userRows.map((r) => [r.moduleKey, asLevel(r.permissionLevel)]));

  const result = {} as Record<ModuleKey, EffectiveModulePermission>;
  for (const key of moduleKeys()) {
    const enabled = toggleMap.get(key) ?? true;
    if (!enabled) {
      result[key] = { moduleKey: key, level: 'none', enabled, source: 'tenant_disabled' };
      continue;
    }
    const userLevel = userMap.get(key);
    if (userLevel) {
      result[key] = { moduleKey: key, level: userLevel, enabled, source: 'user_override' };
      continue;
    }
    const roleLevel = roleMap.get(key) ?? DEFAULT_BY_ROLE[role][key] ?? 'none';
    result[key] = { moduleKey: key, level: roleLevel, enabled, source: 'role' };
  }
  return result;
}

export async function hasModuleAccess(
  user: { id: string; role: string },
  moduleKey: ModuleKey,
  required: ModulePermissionLevel = 'view',
): Promise<boolean> {
  const effective = await getEffectiveModulePermissions(user);
  const current = effective[moduleKey];
  return LEVEL_ORDER[current.level] >= LEVEL_ORDER[required];
}

export async function requireModuleAccessAsync(
  moduleKey: ModuleKey,
  required: ModulePermissionLevel = 'view',
): Promise<NextResponse | null> {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const allowed = await hasModuleAccess(user, moduleKey, required);
  if (!allowed) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  return null;
}

