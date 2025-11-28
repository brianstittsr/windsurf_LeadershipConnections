# Firebase Setup Required - IMPORTANT

## Current Error

You're seeing this error:
```
FirebaseError: Missing or insufficient permissions.
```

This means your Firestore security rules and/or composite indexes need to be deployed.

## Required Steps to Fix

### Step 1: Deploy Firestore Security Rules

The security rules are already defined in `firestore.rules`, but they need to be deployed to Firebase.

**Deploy Command:**
```bash
firebase deploy --only firestore:rules
```

**What this does:**
- Uploads your security rules to Firebase
- Allows public users to read published calendar events
- Restricts write access to admin users only

### Step 2: Deploy Firestore Indexes

The composite indexes are defined in `firestore.indexes.json`, but they also need to be deployed.

**Deploy Command:**
```bash
firebase deploy --only firestore:indexes
```

**What this does:**
- Creates composite indexes for efficient queries
- Enables filtering by `published` + `startDate` (upcoming events)
- Enables filtering by `published` + `endDate` (past events)

**Alternative:** Let Firebase auto-create indexes:
1. Load `/lc-event-calendar` in your browser
2. Check the browser console for a Firestore error
3. Click the provided link to automatically create the index
4. Repeat for `/lc-past-events`

### Step 3: Verify Firebase Configuration

Make sure your `.env.local` file has all required Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Step 4: Initialize Firebase Admin (for server-side operations)

If you're using Firebase Admin SDK, ensure you have:

```env
FIREBASE_ADMIN_PROJECT_ID=your_project_id
FIREBASE_ADMIN_CLIENT_EMAIL=your_service_account@your_project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

## Complete Deployment Command

To deploy everything at once:

```bash
firebase deploy --only firestore
```

This deploys both rules and indexes.

## Verify Deployment

After deploying, verify in Firebase Console:

1. **Security Rules:**
   - Go to Firebase Console → Firestore Database → Rules
   - Should see your rules with `calendarEvents` collection

2. **Indexes:**
   - Go to Firebase Console → Firestore Database → Indexes
   - Should see two composite indexes for `calendarEvents`
   - Status should be "Enabled" (may take 1-5 minutes to build)

## Testing After Deployment

1. **Test Public Access:**
   - Open `/lc-event-calendar` (not logged in)
   - Should load without permission errors
   - Should show published events

2. **Test Admin Access:**
   - Log in as admin
   - Go to `/admin/events`
   - Click "Add Sample Events"
   - Should successfully create events

## Current Security Rules

Your `firestore.rules` file includes:

```javascript
match /calendarEvents/{eventId} {
  allow read: if resource.data.published == true || isAdmin();
  allow create, update, delete: if isAdmin();
}
```

**This means:**
- ✅ Anyone can read published events
- ✅ Only admins can read unpublished events
- ✅ Only admins can create/edit/delete events

## Troubleshooting

### Error: "Missing or insufficient permissions"

**Cause:** Security rules not deployed or too restrictive

**Fix:**
```bash
firebase deploy --only firestore:rules
```

### Error: "The query requires an index"

**Cause:** Composite indexes not created

**Fix:**
```bash
firebase deploy --only firestore:indexes
```

Or click the link in the error message to auto-create.

### Error: "Firebase configuration not found"

**Cause:** Missing environment variables

**Fix:** Check `.env.local` has all Firebase credentials

### Error: "Failed to get document because the client is offline"

**Cause:** Network issue or Firebase not initialized

**Fix:** 
- Check internet connection
- Verify Firebase is initialized in `lib/firebase.ts`
- Check browser console for initialization errors

## Quick Fix Checklist

- [ ] Run `firebase login` (if not logged in)
- [ ] Run `firebase use [your-project-id]` (select correct project)
- [ ] Run `firebase deploy --only firestore`
- [ ] Wait 1-5 minutes for indexes to build
- [ ] Refresh your browser
- [ ] Test `/lc-event-calendar` page
- [ ] Test `/admin/events` page (as admin)

## Need Help?

If you're still seeing errors after following these steps:

1. Check Firebase Console → Firestore Database → Rules
2. Check Firebase Console → Firestore Database → Indexes
3. Check browser console for specific error messages
4. Verify you're using the correct Firebase project
5. Ensure your Firebase plan supports Firestore (Spark plan or higher)

## Additional Notes

- **Development:** You can temporarily set rules to allow all access for testing:
  ```javascript
  allow read, write: if true;
  ```
  ⚠️ **Never use this in production!**

- **Production:** Always use proper security rules with authentication checks

- **Indexes:** Building indexes can take 1-5 minutes. Be patient after deployment.
