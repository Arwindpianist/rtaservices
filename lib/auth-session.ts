import { auth } from '@/auth';
import { getRoleCapabilities, normalizeRole } from '@/lib/rbac';
import { getEffectiveModulePermissions } from '@/lib/module-access';

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const role = normalizeRole(session.user.role);
  const modulePermissions = await getEffectiveModulePermissions({
    id: session.user.id,
    role,
  });
  return {
    id: session.user.id,
    email: session.user.email || '',
    name: session.user.name || '',
    role,
    capabilities: getRoleCapabilities(role),
    modulePermissions,
  };
}
