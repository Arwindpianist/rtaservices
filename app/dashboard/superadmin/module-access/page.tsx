'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SuperadminTableSkeleton } from '@/components/dashboard/SuperadminSkeleton';

type ModuleRow = {
  key: string;
  label: string;
  description: string;
  enabled: boolean;
};

type RolePermission = {
  role: string;
  moduleKey: string;
  permissionLevel: 'none' | 'view' | 'edit' | 'admin';
};

type UserRow = {
  id: string;
  email: string;
  role: string;
};

type UserOverride = {
  userId: string;
  moduleKey: string;
  permissionLevel: 'none' | 'view' | 'edit' | 'admin';
};

const ROLE_ORDER = ['superadmin', 'arnaud', 'craig', 'chris', 'staff', 'other'];
const LEVELS: Array<'none' | 'view' | 'edit' | 'admin'> = ['none', 'view', 'edit', 'admin'];

export default function ModuleAccessPage() {
  const [modules, setModules] = useState<ModuleRow[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [overrides, setOverrides] = useState<UserOverride[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [draftRolePermissions, setDraftRolePermissions] = useState<Record<string, RolePermission['permissionLevel']>>({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    setIsLoading(true);
    setError('');
    const [mRes, rRes, uRes] = await Promise.all([
      fetch('/api/admin/module-access/modules'),
      fetch('/api/admin/module-access/roles'),
      fetch('/api/admin/module-access/users'),
    ]);
    const mData = await mRes.json().catch(() => ({}));
    const rData = await rRes.json().catch(() => ({}));
    const uData = await uRes.json().catch(() => ({}));
    if (!mRes.ok || !rRes.ok || !uRes.ok) {
      setError(mData.error || rData.error || uData.error || 'Failed to load module access data');
      setIsLoading(false);
      return;
    }
    setModules(mData.modules ?? []);
    const incomingRolePermissions = rData.permissions ?? [];
    setRolePermissions(incomingRolePermissions);
    setDraftRolePermissions(
      Object.fromEntries(
        incomingRolePermissions.map((p: RolePermission) => [`${p.role}:${p.moduleKey}`, p.permissionLevel]),
      ),
    );
    setUsers(uData.users ?? []);
    setOverrides(uData.overrides ?? []);
    if (!selectedUserId && (uData.users?.length ?? 0) > 0) {
      setSelectedUserId(uData.users[0].id);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rolePermMap = useMemo(() => {
    const map = new Map<string, RolePermission['permissionLevel']>();
    for (const r of rolePermissions) map.set(`${r.role}:${r.moduleKey}`, r.permissionLevel);
    return map;
  }, [rolePermissions]);

  const overrideMap = useMemo(() => {
    const map = new Map<string, UserOverride['permissionLevel']>();
    for (const o of overrides) map.set(`${o.userId}:${o.moduleKey}`, o.permissionLevel);
    return map;
  }, [overrides]);

  const updateModuleToggle = async (moduleKey: string, enabled: boolean) => {
    setError('');
    const res = await fetch('/api/admin/module-access/modules', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ moduleKey, enabled }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Failed to update module toggle');
      return;
    }
    setSuccess('Module toggle updated');
    setTimeout(() => setSuccess(''), 1200);
    await load();
  };

  const updateRolePermission = async (
    role: string,
    moduleKey: string,
    permissionLevel: string,
    options?: { silent?: boolean },
  ) => {
    setError('');
    const res = await fetch('/api/admin/module-access/roles', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, moduleKey, permissionLevel }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Failed to update role permission');
      return;
    }
    if (!options?.silent) {
      setSuccess('Role permission updated');
      setTimeout(() => setSuccess(''), 1200);
      await load();
    }
  };

  const saveRolePermissionChanges = async () => {
    const changes: Array<{ role: string; moduleKey: string; permissionLevel: string }> = [];
    for (const role of ROLE_ORDER) {
      for (const m of modules) {
        const key = `${role}:${m.key}`;
        const current = rolePermMap.get(key) ?? 'none';
        const draft = draftRolePermissions[key] ?? current;
        if (draft !== current) {
          changes.push({ role, moduleKey: m.key, permissionLevel: draft });
        }
      }
    }
    if (changes.length === 0) {
      setSuccess('No role permission changes');
      setTimeout(() => setSuccess(''), 1000);
      return;
    }
    for (const change of changes) {
      await updateRolePermission(change.role, change.moduleKey, change.permissionLevel, { silent: true });
    }
    await load();
    setSuccess(`Saved ${changes.length} role permission changes`);
    setTimeout(() => setSuccess(''), 1200);
  };

  const updateUserOverride = async (userId: string, moduleKey: string, permissionLevel: string) => {
    setError('');
    const res = await fetch('/api/admin/module-access/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, moduleKey, permissionLevel }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Failed to update user override');
      return;
    }
    setSuccess('User override updated');
    setTimeout(() => setSuccess(''), 1200);
    await load();
  };

  const selectedUser = users.find((u) => u.id === selectedUserId) || null;

  return (
    <div className="rta-neu-theme sa-theme min-h-[calc(100vh-3.5rem)] sa-bg p-4 sm:p-6">
      <div className="sa-shell space-y-4">
        <div className="sa-enter">
          <h1 className="sa-title text-2xl font-bold">Module Access</h1>
          <p className="mt-1 text-body-sm sa-muted">Control module visibility and permissions by role and user.</p>
        </div>
        {error && <p className="text-sm text-rta-red">{error}</p>}
        {success && <p className="text-sm text-green-700">{success}</p>}
        {isLoading ? <SuperadminTableSkeleton rows={10} /> : null}

        <Card className={`sa-card sa-enter ${isLoading ? 'opacity-60' : ''}`}>
          <CardHeader className="pb-2">
            <CardTitle className="sa-title text-base">Global Module Toggles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {modules.map((m) => (
              <div key={m.key} className="sa-item flex items-center justify-between gap-3 p-3">
                <div>
                  <p className="font-semibold sa-text">{m.label}</p>
                  <p className="text-xs sa-muted">{m.key} · {m.description}</p>
                </div>
                <Button
                  type="button"
                  className={m.enabled ? 'sa-cta' : ''}
                  onClick={() => updateModuleToggle(m.key, !m.enabled)}
                >
                  {m.enabled ? 'Enabled' : 'Disabled'}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className={`sa-card sa-enter ${isLoading ? 'opacity-60' : ''}`}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="sa-title text-base">Role Permission Matrix</CardTitle>
              <Button type="button" className="sa-cta" onClick={saveRolePermissionChanges}>
                Save All Changes
              </Button>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-[920px] text-sm">
              <thead>
                <tr className="border-b border-rta-border">
                  <th className="py-2 text-left">Module</th>
                  {ROLE_ORDER.map((role) => (
                    <th key={role} className="py-2 text-left capitalize">{role}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {modules.map((m) => (
                  <tr key={m.key} className="border-b border-rta-border">
                    <td className="py-2 pr-2">{m.label}</td>
                    {ROLE_ORDER.map((role) => (
                      <td key={`${m.key}:${role}`} className="py-2 pr-2">
                        <select
                          value={draftRolePermissions[`${role}:${m.key}`] ?? rolePermMap.get(`${role}:${m.key}`) ?? 'none'}
                          onChange={(e) =>
                            setDraftRolePermissions((prev) => ({
                              ...prev,
                              [`${role}:${m.key}`]: e.target.value as RolePermission['permissionLevel'],
                            }))
                          }
                          className="h-8 min-w-[88px] rounded-md border border-rta-border px-2 text-xs"
                        >
                          {LEVELS.map((lvl) => <option key={lvl} value={lvl}>{lvl}</option>)}
                        </select>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card className={`sa-card sa-enter ${isLoading ? 'opacity-60' : ''}`}>
          <CardHeader className="pb-2">
            <CardTitle className="sa-title text-base">User Overrides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="h-10 min-w-[260px] rounded-md border border-rta-border px-3 text-sm"
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.email}
                </option>
              ))}
            </select>
            <div className="grid gap-2 md:grid-cols-2">
              {modules.map((m) => (
                <div key={`override-${m.key}`} className="sa-item flex items-center justify-between gap-2 p-3">
                  <span className="text-sm sa-text">{m.label}</span>
                  <select
                    value={overrideMap.get(`${selectedUserId}:${m.key}`) ?? 'none'}
                    onChange={(e) => selectedUserId && updateUserOverride(selectedUserId, m.key, e.target.value)}
                    className="h-8 min-w-[96px] rounded-md border border-rta-border px-2 text-xs"
                  >
                    {LEVELS.map((lvl) => <option key={lvl} value={lvl}>{lvl}</option>)}
                  </select>
                  {selectedUser && (() => {
                    const roleDefault = rolePermMap.get(`${selectedUser.role}:${m.key}`) ?? 'none';
                    const overrideLevel = overrideMap.get(`${selectedUserId}:${m.key}`) ?? 'none';
                    if (overrideLevel === roleDefault) return null;
                    return (
                      <span className="rounded-full sa-secondary px-2 py-0.5 text-[10px] font-semibold sa-text">
                        Override: {roleDefault} -&gt; {overrideLevel}
                      </span>
                    );
                  })()}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

