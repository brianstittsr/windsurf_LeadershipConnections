# Firestore Security Rules Setup

## Overview
This document explains how to set up Firestore security rules to fix the "Missing or insufficient permissions" errors.

## Current Error
You're seeing these errors because Firestore is in production mode with restrictive default rules that deny all reads and writes.

## Solution: Deploy Security Rules

### Option 1: Using Firebase Console (Recommended)

1. **Go to Firebase Console**:
   - Visit https://console.firebase.google.com/
   - Select your project

2. **Navigate to Firestore Database**:
   - Click on "Firestore Database" in the left sidebar
   - Click on the "Rules" tab at the top

3. **Copy and Paste Rules**:
   - Open the `firestore.rules` file in this project
   - Copy all the content
   - Paste it into the Firebase Console rules editor
   - Click "Publish"

### Option 2: Using Firebase CLI

1. **Install Firebase CLI** (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Initialize Firebase** (if not already done):
   ```bash
   firebase init firestore
   ```
   - Select your project
   - Accept the default `firestore.rules` file

4. **Deploy Rules**:
   ```bash
   firebase deploy --only firestore:rules
   ```

## Security Rules Explanation

### Admin Users
Only these emails have admin access:
- brianstittsr@gmail.com
- kathy@ncleadconnect.org
- gloria@ncleadconnect.org

### Collections and Permissions

| Collection | Read | Write |
|------------|------|-------|
| `users` | Own data + Admins | Own data only |
| `siteContent` | Public | Admin only |
| `lcClasses` | Public | Admin only |
| `lcPastEvents` | Public | Admin only |
| `lcServices` | Public | Admin only |
| `lcGallery` | Public | Admin only |
| `alumniComments` | Public | Admin only |
| `blogEntries` | Public | Admin only |
| `serviceEntries` | Public | Admin only |
| `programEntries` | Public | Admin only |
| `events` | Public | Admin only |
| `forms` | Admin only | Authenticated users can create |
| `registrations` | Admin only | Authenticated users can create |
| `grants` | Public | Admin only |

### Key Features

1. **Public Read Access**: Most content is publicly readable so visitors can view the site
2. **Admin Write Access**: Only admin users can modify content
3. **User Privacy**: Users can only read/write their own data
4. **Form Submissions**: Authenticated users can submit forms, admins can view all

## Testing

After deploying the rules:

1. **Test Public Access**:
   - Visit your site without logging in
   - You should see home page content, classes, events, etc.

2. **Test Admin Access**:
   - Sign in as an admin user
   - Go to `/admin/home-content`
   - Try editing and saving content
   - Should work without errors

3. **Test User Access**:
   - Sign up as a regular user
   - You should be able to view content but not edit it

## Troubleshooting

### Still Getting Permission Errors?

1. **Check Rules Deployment**:
   - Go to Firebase Console → Firestore → Rules
   - Verify the rules are published
   - Check the "Last deployed" timestamp

2. **Verify Admin Email**:
   - Make sure you're signed in with one of the admin emails
   - Check the email in the header after signing in

3. **Clear Browser Cache**:
   - Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
   - Or clear browser cache and cookies

4. **Check Firebase Auth**:
   - Verify you're signed in (check the header)
   - Try signing out and back in

### Rules Not Working?

If rules don't seem to be working:

1. Check the Firebase Console for rule errors
2. Look at the Firestore Rules simulator to test specific operations
3. Check browser console for detailed error messages
4. Verify your Firebase project ID matches your `.env.local` configuration

## Security Best Practices

1. **Never expose admin credentials** in client-side code
2. **Always validate on the server** for sensitive operations
3. **Use Firebase Admin SDK** for server-side operations that need elevated permissions
4. **Regularly review** who has admin access
5. **Monitor Firestore usage** in Firebase Console

## Next Steps

After deploying these rules:

1. Test all admin functionality
2. Test public pages
3. Verify form submissions work
4. Check that non-admin users can't access admin pages

## Support

If you continue to have issues:
1. Check the Firebase Console for detailed error messages
2. Review the Firestore Rules documentation: https://firebase.google.com/docs/firestore/security/get-started
3. Test rules using the Firebase Rules Playground in the console
