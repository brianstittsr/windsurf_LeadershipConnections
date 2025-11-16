# Admin Dashboard Setup

## Overview
The admin dashboard allows authorized users to view user metrics and manage the Leadership C.O.N.N.E.C.T.I.O.N.S. platform.

## Admin Users
The following users have admin access:

1. **brianstittsr@gmail.com**
   - Password: `Yfhk9r76q@@12345`

2. **kathy@ncleadconnect.org**
   - Password: `2026ncleadconnect`

3. **gloria@ncleadconnect.org**
   - Password: `2026ncleadconnect`

## Setup Instructions

### Step 1: Create Admin Users in Firebase

1. Navigate to: `http://localhost:3000/setup-admin`
2. Click the "Create Admin Users" button
3. Wait for confirmation that all users were created successfully

### Step 2: Sign In as Admin

1. Go to: `http://localhost:3000/signin`
2. Enter one of the admin email addresses and passwords
3. You will be automatically redirected to the dashboard

### Step 3: Access Dashboard

- Direct URL: `http://localhost:3000/admin/dashboard`
- Only admin users can access this page
- Non-admin users will be redirected to the sign-in page

## Dashboard Features

The admin dashboard displays:

### User Metrics
- **Total Users**: Total number of registered users
- **New This Month**: Users who registered in the last 30 days
- **New This Week**: Users who registered in the last 7 days

### Recent Users Table
Shows the 10 most recent user registrations with:
- Name
- Email address
- Location (City, State)
- Registration date

## Security

- Admin access is controlled by email address in `lib/adminUsers.ts`
- Only users in the `ADMIN_EMAILS` array can access the dashboard
- Authentication is handled through Firebase Auth
- All dashboard data is fetched from Firestore in real-time

## Adding New Admin Users

To add a new admin user:

1. Add their email to `lib/adminUsers.ts` in the `ADMIN_EMAILS` array
2. Create their Firebase Auth account manually or through the setup page
3. They will automatically have dashboard access upon sign-in

## Troubleshooting

### "User already exists" error
- This means the user was already created in Firebase
- You can still sign in with the existing credentials

### Cannot access dashboard
- Verify the user's email is in the `ADMIN_EMAILS` array
- Check that Firebase Auth is properly configured
- Ensure the user is signed in

### No users showing in dashboard
- Check that users have a `createdAt` timestamp in Firestore
- Verify Firestore security rules allow admin read access
- Check browser console for any errors
