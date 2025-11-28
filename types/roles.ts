export type UserRole = 'SuperAdmin' | 'SuperUser' | 'User';

export interface UserRoleData {
  email: string;
  role: UserRole;
  uid?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RolePermissions {
  canAccessAdmin: boolean;
  canManageUsers: boolean;
  canManageEvents: boolean;
  canManageForms: boolean;
  canManageContent: boolean;
  canManageSettings: boolean;
  canViewAnalytics: boolean;
  canExportData: boolean;
  canDeleteContent: boolean;
  canArchiveContent: boolean;
  canManageRoles: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  SuperAdmin: {
    canAccessAdmin: true,
    canManageUsers: true,
    canManageEvents: true,
    canManageForms: true,
    canManageContent: true,
    canManageSettings: true,
    canViewAnalytics: true,
    canExportData: true,
    canDeleteContent: true,
    canArchiveContent: true,
    canManageRoles: true,
  },
  SuperUser: {
    canAccessAdmin: true,
    canManageUsers: false,
    canManageEvents: true,
    canManageForms: true,
    canManageContent: true,
    canManageSettings: false,
    canViewAnalytics: true,
    canExportData: true,
    canDeleteContent: false,  // SuperUser cannot delete
    canArchiveContent: true,  // SuperUser can archive
    canManageRoles: false,
  },
  User: {
    canAccessAdmin: false,
    canManageUsers: false,
    canManageEvents: false,
    canManageForms: false,
    canManageContent: false,
    canManageSettings: false,
    canViewAnalytics: false,
    canExportData: false,
    canDeleteContent: false,
    canArchiveContent: false,
    canManageRoles: false,
  },
};

// Default role assignments
export const DEFAULT_ROLE_ASSIGNMENTS: Record<string, UserRole> = {
  'brianstittsr@gmail.com': 'SuperAdmin',
  'gloria@ncleadconnect.org': 'SuperUser',
  'kathy@ncleadconnect.org': 'SuperUser',
};

export function getDefaultRole(email: string): UserRole {
  const normalizedEmail = email.toLowerCase();
  return DEFAULT_ROLE_ASSIGNMENTS[normalizedEmail] || 'User';
}

export function hasPermission(role: UserRole, permission: keyof RolePermissions): boolean {
  return ROLE_PERMISSIONS[role][permission];
}
