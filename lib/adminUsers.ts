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
