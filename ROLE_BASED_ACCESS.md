# Role-Based Access Control (RBAC) Documentation

## User Roles

The application has three distinct user roles with different levels of access:

### 1. **User** (Regular Members)
- **Access Level**: Limited
- **Can Access**:
  - Member Directory (view other members)
  - Their own profile (`/admin/lc-profile`)
  - Profile visibility settings

- **Cannot Access**:
  - Admin Dashboard
  - Content Management
  - User Management
  - Events Management
  - Forms Management
  - DataHub Admin
  - Any administrative features

- **After Sign In**: Redirected to `/member-directory`

### 2. **SuperUser** (Staff/Administrators)
- **Access Level**: Full Admin (except delete)
- **Can Access**:
  - Admin Dashboard
  - Profile Management
  - LC Member Profile
  - Events (view/edit/archive)
  - Forms (view/edit/archive)
  - Registration
  - DataHub Admin
  - Home Page Content
  - LC Past Classes
  - LC Past Events
  - LC Services
  - LC Gallery
  - Contact Submissions
  - Alumni Comments
  - Blog Entries
  - Service Entries
  - Program Entries

- **Cannot Do**:
  - Delete content (can only archive)
  - Manage user roles
  - Manage system settings

- **After Sign In**: Redirected to `/admin/dashboard`

### 3. **SuperAdmin** (System Administrator)
- **Access Level**: Full Access
- **Can Access**: Everything SuperUser can access, plus:
  - Delete content
  - Manage user roles
  - Manage system settings
  - User Management

- **After Sign In**: Redirected to `/admin/dashboard`

## Default Role Assignments

Configured in `types/roles.ts`:

```typescript
'brianstittsr@gmail.com': 'SuperAdmin'
'gloria@ncleadconnect.org': 'SuperUser'
'kathy@ncleadconnect.org': 'SuperUser'
```

All other users default to `'User'` role.

## Navigation Structure

### User Navigation (Sidebar)
- Member Directory
- My Profile

### SuperUser/SuperAdmin Navigation (Sidebar)
- Dashboard
- Profile
- LC Member Profile
- Events
- Forms
- Registration
- DataHub Admin
- **Content Management Section**:
  - Home Page Content
  - LC Past Classes
  - LC Past Events
  - LC Services
  - LC Gallery
  - Contact Submissions
  - Alumni Comments
  - Blog Entries
  - Service Entries
  - Program Entries
- **User Management Section** (SuperAdmin only):
  - Manage Users

## Header Dropdown Menu

### For Users:
- Member Directory
- My Profile
- Log Out

### For SuperUser/SuperAdmin:
- Admin Dashboard
- Log Out

## Sign-In Redirects

After successful sign-in, users are redirected based on their role:

- **User** → `/member-directory`
- **SuperUser** → `/admin/dashboard`
- **SuperAdmin** → `/admin/dashboard`

## Registration Flow

After completing the 6-step profile wizard:

1. User account created in Firebase Auth
2. Username mapping saved to `usernames` collection
3. User role saved to `userRoles` collection (defaults to 'User')
4. Member profile saved to `memberProfiles` collection
5. User redirected to `/member-directory`

## Profile Visibility Settings

Users can control their profile visibility:

- **Public**: Visible to everyone
- **Members Only**: Visible only to logged-in members
- **LC Staff Only**: Visible only to SuperUser and SuperAdmin
- **Private**: Not visible in directory

Users can also control what information is shown:
- Show/hide email
- Show/hide phone
- Show/hide employer
- Allow/disallow direct messages
- Include/exclude from directory

## Permission Checks

The application uses the `hasPermission()` function to check if a user has specific permissions:

```typescript
{hasPermission('canManageContent') && (
  // Content management UI
)}
```

Available permissions:
- `canAccessAdmin`
- `canManageUsers`
- `canManageEvents`
- `canManageForms`
- `canManageContent`
- `canManageSettings`
- `canViewAnalytics`
- `canExportData`
- `canDeleteContent`
- `canArchiveContent`
- `canManageRoles`

## Files Modified

1. `types/roles.ts` - Role definitions and permissions
2. `context/AuthContext.tsx` - Authentication and role management
3. `app/admin/layout.tsx` - Admin sidebar navigation
4. `components/Header/index.tsx` - Header dropdown menu
5. `app/signin/page.tsx` - Sign-in redirect logic
6. `components/MemberRegistration/MemberProfileWizardModal.tsx` - Registration redirect

## Testing Roles

SuperAdmin users can test different roles using the RoleSwitcher component (visible only to SuperAdmin).

## Security

- All admin routes are protected by the `AdminLayout` component
- Firestore security rules enforce role-based access at the database level
- Client-side checks are backed by server-side security rules
