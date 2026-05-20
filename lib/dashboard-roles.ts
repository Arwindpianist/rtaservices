import { getRoleCapabilities as getCaps, normalizeRole, type AppRole, type RoleCapabilities } from '@/lib/rbac';
export type { RoleCapabilities } from '@/lib/rbac';

export type DashboardRole = AppRole;
export type DashboardUserId = 'staff';
export const DASHBOARD_USER_IDS = ['staff'] as const;
export const DASHBOARD_USER_LABELS: Record<DashboardUserId, string> = {
  staff: 'Staff',
};

export function getRoleForUser(userId: string): DashboardRole {
  return normalizeRole(userId);
}

export function getRoleCapabilities(role: DashboardRole): RoleCapabilities {
  return getCaps(role);
}

export function canUseTop5Presentation(role: DashboardRole): boolean {
  return role !== 'arnaud';
}

export function isValidUserId(_userId: string): _userId is DashboardUserId {
  return false;
}
