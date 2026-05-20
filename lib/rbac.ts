export type AppRole = 'superadmin' | 'arnaud' | 'craig' | 'chris' | 'staff' | 'other';

export interface RoleCapabilities {
  canSeePayroll: boolean;
  canSeeHrm: boolean;
  canSeeMasterFinancials: boolean;
  canSeeSalaryAndLeave: boolean;
  canManageUsers: boolean;
}

const CAPABILITIES: Record<AppRole, RoleCapabilities> = {
  superadmin: {
    canSeePayroll: true,
    canSeeHrm: true,
    canSeeMasterFinancials: true,
    canSeeSalaryAndLeave: true,
    canManageUsers: true,
  },
  arnaud: {
    canSeePayroll: true,
    canSeeHrm: true,
    canSeeMasterFinancials: true,
    canSeeSalaryAndLeave: true,
    canManageUsers: false,
  },
  craig: {
    canSeePayroll: false,
    canSeeHrm: false,
    canSeeMasterFinancials: false,
    canSeeSalaryAndLeave: false,
    canManageUsers: false,
  },
  chris: {
    canSeePayroll: false,
    canSeeHrm: false,
    canSeeMasterFinancials: false,
    canSeeSalaryAndLeave: false,
    canManageUsers: false,
  },
  staff: {
    canSeePayroll: false,
    canSeeHrm: false,
    canSeeMasterFinancials: false,
    canSeeSalaryAndLeave: false,
    canManageUsers: false,
  },
  other: {
    canSeePayroll: false,
    canSeeHrm: false,
    canSeeMasterFinancials: false,
    canSeeSalaryAndLeave: false,
    canManageUsers: false,
  },
};

export function normalizeRole(value: string | null | undefined): AppRole {
  if (!value) return 'staff';
  const lower = value.toLowerCase();
  if (lower === 'superadmin' || lower === 'arnaud' || lower === 'craig' || lower === 'chris' || lower === 'other') {
    return lower;
  }
  return 'staff';
}

export function getRoleCapabilities(role: string | null | undefined): RoleCapabilities {
  return CAPABILITIES[normalizeRole(role)];
}
