/**
 * Hardcoded dashboard user IDs and role capabilities.
 * Chris = finances (no payroll/HRM); Arnaud = + payroll, HRM, master financials; Craig = same as Chris for now; Other staff = same as Chris.
 */

export const DASHBOARD_USER_IDS = ['chris', 'arnaud', 'craig', 'other'] as const;
export type DashboardUserId = (typeof DASHBOARD_USER_IDS)[number];

export const DASHBOARD_USER_LABELS: Record<DashboardUserId, string> = {
  chris: 'Chris',
  arnaud: 'Arnaud',
  craig: 'Craig',
  other: 'Other staff',
};

export type DashboardRole = 'chris' | 'arnaud' | 'craig' | 'other';

export interface RoleCapabilities {
  canSeePayroll: boolean;
  canSeeHrm: boolean;
  canSeeMasterFinancials: boolean;
  canSeeSalaryAndLeave: boolean;
}

const ROLE_CAPABILITIES: Record<DashboardRole, RoleCapabilities> = {
  chris: {
    canSeePayroll: false,
    canSeeHrm: false,
    canSeeMasterFinancials: false,
    canSeeSalaryAndLeave: false,
  },
  arnaud: {
    canSeePayroll: true,
    canSeeHrm: true,
    canSeeMasterFinancials: true,
    canSeeSalaryAndLeave: true,
  },
  craig: {
    // Temporarily same as Chris (no HRM)
    canSeePayroll: false,
    canSeeHrm: false,
    canSeeMasterFinancials: false,
    canSeeSalaryAndLeave: false,
  },
  other: {
    canSeePayroll: false,
    canSeeHrm: false,
    canSeeMasterFinancials: false,
    canSeeSalaryAndLeave: false,
  },
};

export function getRoleForUser(userId: string): DashboardRole {
  if (DASHBOARD_USER_IDS.includes(userId as DashboardUserId)) {
    return userId as DashboardRole;
  }
  return 'other';
}

export function getRoleCapabilities(role: DashboardRole): RoleCapabilities {
  return ROLE_CAPABILITIES[role];
}

export function isValidUserId(userId: string): userId is DashboardUserId {
  return DASHBOARD_USER_IDS.includes(userId as DashboardUserId);
}
