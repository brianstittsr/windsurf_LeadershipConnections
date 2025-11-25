# Role-Based Access Control (RBAC) Guide

## Overview
The Leadership Connections platform now includes a comprehensive role-based access control system with three distinct user roles, each with specific permissions.

## User Roles

### 1. SuperAdmin
**Assigned to**: brianstittsr@gmail.com

**Full Permissions**:
- ✅ Access Admin Dashboard
- ✅ Manage Users & Roles
- ✅ Manage Events
- ✅ Manage Forms
- ✅ Manage Content
- ✅ Manage Settings
- ✅ View Analytics
- ✅ Export Data
- ✅ Delete Content
- ✅ Manage Roles

**Description**: SuperAdmin has complete control over the entire platform. This role can manage all users, change user roles, and access all administrative features.

### 2. SuperUser
**Assigned to**: 
- gloria@ncleadconnect.org
- kathy@ncleadconnect.org

**Permissions**:
- ✅ Access Admin Dashboard
- ✅ Manage Events
- ✅ Manage Forms
- ✅ Manage Content
- ✅ View Analytics
- ✅ Export Data
- ✅ Delete Content
- ❌ Manage Users
- ❌ Manage Settings
- ❌ Manage Roles

**Description**: SuperUser can manage most content and features but cannot change user roles or system settings. Perfect for trusted administrators who manage day-to-day operations.

### 3. User
**Assigned to**: All other users by default

**Permissions**:
- ❌ Access Admin Dashboard
- ❌ Manage Users
- ❌ Manage Events
- ❌ Manage Forms
- ❌ Manage Content
- ❌ Manage Settings
- ❌ View Analytics
- ❌ Export Data
- ❌ Delete Content
- ❌ Manage Roles

**Description**: Regular users can access public-facing features like viewing events, submitting forms, and participating in programs, but have no administrative access.

## Role Assignment

### Automatic Assignment
When a user creates an account, they are automatically assigned a role based on their email address:

```typescript
brianstittsr@gmail.com       → SuperAdmin
gloria@ncleadconnect.org     → SuperUser
kathy@ncleadconnect.org      → SuperUser
All other emails             → User
```

### Manual Assignment (SuperAdmin Only)
SuperAdmins can change user roles through the User Management interface:

1. Navigate to `/admin/users`
2. Find the user you want to modify
3. Click "Change Role"
4. Select the new role
5. Click "Update Role"

## Permission Details

### canAccessAdmin
- **Who**: SuperAdmin, SuperUser
- **What**: Access to the admin dashboard and all admin routes
- **Where**: `/admin/*` routes

### canManageUsers
- **Who**: SuperAdmin only
- **What**: View all users, change user roles
- **Where**: `/admin/users`

### canManageEvents
- **Who**: SuperAdmin, SuperUser
- **What**: Create, edit, delete events
- **Where**: `/admin/events`

### canManageForms
- **Who**: SuperAdmin, SuperUser
- **What**: Create, edit, delete forms; view submissions
- **Where**: `/admin/forms`

### canManageContent
- **Who**: SuperAdmin, SuperUser
- **What**: Manage blog posts, services, programs, gallery, etc.
- **Where**: `/admin/blog-entries`, `/admin/service-entries`, etc.

### canManageSettings
- **Who**: SuperAdmin only
- **What**: Modify system settings and configurations
- **Where**: Settings pages (future implementation)

### canViewAnalytics
- **Who**: SuperAdmin, SuperUser
- **What**: View usage statistics and analytics
- **Where**: Analytics dashboard (future implementation)

### canExportData
- **Who**: SuperAdmin, SuperUser
- **What**: Export data to CSV and other formats
- **Where**: Forms submissions, user data, etc.

### canDeleteContent
- **Who**: SuperAdmin, SuperUser
- **What**: Permanently delete content items
- **Where**: All content management pages

### canManageRoles
- **Who**: SuperAdmin only
- **What**: Change user roles and permissions
- **Where**: `/admin/users`

## Implementation Details

### Files Created/Modified

#### New Files:
- `/types/roles.ts` - Role definitions and permissions
- `/lib/userRoles.ts` - Role management utilities
- `/app/admin/users/page.tsx` - User management interface
- `ROLES_GUIDE.md` - This documentation

#### Modified Files:
- `/context/AuthContext.tsx` - Added role and permission tracking
- `/lib/adminUsers.ts` - Added role-based functions
- `/lib/firestore-schema.ts` - Added role field to UserProfile
- `/app/admin/layout.tsx` - Added role-based navigation

### Database Schema

#### users Collection
```typescript
{
  uid: string;
  email: string;
  name: string;
  role: 'SuperAdmin' | 'SuperUser' | 'User';
  createdAt: Date;
  updatedAt: Date;
  // ... other fields
}
```

## Usage in Code

### Check Permissions in Components
```typescript
import { useAuth } from '@/context/AuthContext';

function MyComponent() {
  const { hasPermission, userRole } = useAuth();
  
  // Check specific permission
  if (hasPermission('canManageEvents')) {
    // Show event management UI
  }
  
  // Check role
  if (userRole === 'SuperAdmin') {
    // Show SuperAdmin-only features
  }
}
```

### Protect Routes
```typescript
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function ProtectedPage() {
  const { hasPermission } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!hasPermission('canManageEvents')) {
      router.push('/');
    }
  }, [hasPermission, router]);
  
  // Page content
}
```

### Conditional Rendering
```typescript
{hasPermission('canManageContent') && (
  <button onClick={handleEdit}>Edit Content</button>
)}
```

## Security Considerations

### Client-Side Protection
- All admin routes check permissions before rendering
- Navigation items are hidden based on permissions
- Buttons and actions are conditionally rendered

### Server-Side Protection (Recommended)
While client-side checks are in place, it's recommended to also implement server-side permission checks in API routes:

```typescript
// Example API route protection
import { getUserRoleFromFirestore } from '@/lib/userRoles';
import { hasPermission } from '@/types/roles';

export async function POST(request: Request) {
  const user = await getCurrentUser(); // Your auth logic
  const role = await getUserRoleFromFirestore(user.uid);
  
  if (!hasPermission(role, 'canManageEvents')) {
    return new Response('Unauthorized', { status: 403 });
  }
  
  // Process request
}
```

## Testing the Role System

### As SuperAdmin (brianstittsr@gmail.com)
1. Sign in with SuperAdmin account
2. Navigate to `/admin/dashboard`
3. Verify all menu items are visible
4. Navigate to `/admin/users`
5. Verify you can see and modify user roles
6. Check that role badge shows "SuperAdmin"

### As SuperUser (gloria@ncleadconnect.org or kathy@ncleadconnect.org)
1. Sign in with SuperUser account
2. Navigate to `/admin/dashboard`
3. Verify Events and Forms are accessible
4. Verify Content Management section is visible
5. Verify User Management is NOT visible
6. Check that role badge shows "SuperUser"

### As Regular User
1. Sign in with any other email
2. Try to access `/admin/dashboard`
3. Verify you are redirected to home page
4. Check that no admin links appear in navigation
5. Verify role badge shows "User" (if visible anywhere)

## Troubleshooting

### User Can't Access Admin Dashboard
1. Check user's email in Firestore `users` collection
2. Verify `role` field is set correctly
3. Check if user is in `ADMIN_EMAILS` array in `/lib/adminUsers.ts`
4. Clear browser cache and sign in again

### Role Not Updating
1. Sign out and sign back in
2. Check Firestore for role update
3. Verify SuperAdmin made the change
4. Check browser console for errors

### Permission Denied Errors
1. Verify user has correct role
2. Check permission requirements in code
3. Ensure AuthContext is properly loaded
4. Check for JavaScript errors in console

## Future Enhancements

Potential improvements to the role system:

- [ ] Custom roles with granular permissions
- [ ] Role-based email notifications
- [ ] Audit log for role changes
- [ ] Temporary role assignments
- [ ] Role expiration dates
- [ ] Department-based roles
- [ ] API key management per role
- [ ] Two-factor authentication for SuperAdmin

## Support

For questions about the role system:
1. Review this documentation
2. Check the code comments in `/types/roles.ts`
3. Test with different user accounts
4. Contact the SuperAdmin for role changes

---

**Last Updated**: November 19, 2025
**Version**: 1.0
