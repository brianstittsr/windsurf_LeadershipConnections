import { UserRole, getDefaultRole, hasPermission } from '@/types/roles';

// Admin user emails - only these users can access the admin dashboard
export const ADMIN_EMAILS = [
  'brianstittsr@gmail.com',
  'kathy@ncleadconnect.org',
  'gloria@ncleadconnect.org',
];

export function isAdminUser(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

export function getUserRole(email: string | null | undefined): UserRole {
  if (!email) return 'User';
  return getDefaultRole(email);
}

export function canAccessAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  const role = getUserRole(email);
  return hasPermission(role, 'canAccessAdmin');
}
