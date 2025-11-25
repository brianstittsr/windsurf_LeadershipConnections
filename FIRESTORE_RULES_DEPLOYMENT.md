# Firestore Rules Deployment Guide

## Issue Fixed

The error "Missing or insufficient permissions" was caused by missing Firestore security rules for the new collections we created.

## What Was Updated

Added security rules for:
- ✅ `customForms` - Custom form definitions
- ✅ `formSubmissions` - Form submission data
- ✅ `strategicPlanningMethods` - Strategic planning content
- ✅ `lcDatasets` - Dataset definitions (DataHub)
- ✅ `lcDatasetRecords` - Dataset records (DataHub)
- ✅ `lcDatasetAPIKeys` - API keys for external access
- ✅ `lcDatasetAuditLogs` - Audit trail logs

## Security Rules Summary

### Custom Forms
```javascript
match /customForms/{formId} {
  allow read: if isAdmin() || resource.data.published == true;
  allow write: if isAdmin();
}
```
- **Admins**: Full access
- **Public**: Can read published forms only
- **Write**: Admin only

### Form Submissions
```javascript
match /formSubmissions/{document=**} {
  allow read: if isAdmin();
  allow create: if true;
  allow update, delete: if isAdmin();
}
```
- **Anyone**: Can create (submit forms)
- **Admins**: Can read all submissions
- **Update/Delete**: Admin only

### DataHub Datasets
```javascript
match /lcDatasets/{datasetId} {
  allow read: if isAdmin() || resource.data.metadata.isPublic == true;
  allow write: if isAdmin();
}
```
- **Admins**: Full access
- **Public**: Can read public datasets only
- **Write**: Admin only

### DataHub Records
```javascript
match /lcDatasetRecords/{recordId} {
  allow read: if isAdmin();
  allow create: if true;
  allow update, delete: if isAdmin();
}
```
- **Anyone**: Can create records (for form integration)
- **Admins**: Can read all records
- **Update/Delete**: Admin only

## How to Deploy

### Option 1: Firebase Console (Recommended)

1. **Open Firebase Console**
   - Go to https://console.firebase.google.com
   - Select your project

2. **Navigate to Firestore Rules**
   - Click "Firestore Database" in left sidebar
   - Click "Rules" tab at the top

3. **Update Rules**
   - Copy the entire contents of `firestore.rules`
   - Paste into the Firebase console editor
   - Click "Publish"

4. **Verify Deployment**
   - Rules should show as "Active"
   - Check the timestamp to confirm it's recent

### Option 2: Firebase CLI

If you have Firebase CLI installed:

```bash
# Login to Firebase
firebase login

# Deploy rules only
firebase deploy --only firestore:rules

# Or deploy everything
firebase deploy
```

### Option 3: Automatic Deployment

If you have CI/CD set up, the rules will deploy automatically on your next push to the main branch.

## Testing the Fix

After deploying the rules:

1. **Refresh your browser** (hard refresh: Ctrl+Shift+R or Cmd+Shift+R)
2. **Navigate to Admin → Forms**
3. **Verify forms load** without permission errors
4. **Try creating a form** to test write permissions
5. **Check DataHub Admin** to verify dataset access

## Expected Behavior

### Before Fix
```
Error: FirebaseError: Missing or insufficient permissions
```

### After Fix
- ✅ Forms page loads successfully
- ✅ Can create/edit/delete forms
- ✅ Can view form submissions
- ✅ DataHub Admin accessible
- ✅ Can create datasets
- ✅ Form-to-dataset integration works

## Security Notes

### Admin Users
Currently defined as:
- `brianstittsr@gmail.com`
- `kathy@ncleadconnect.org`
- `gloria@ncleadconnect.org`

To add more admins, update the `isAdmin()` function in `firestore.rules`:

```javascript
function isAdmin() {
  return request.auth != null && 
    (request.auth.token.email == 'brianstittsr@gmail.com' ||
     request.auth.token.email == 'kathy@ncleadconnect.org' ||
     request.auth.token.email == 'gloria@ncleadconnect.org' ||
     request.auth.token.email == 'newemail@example.com'); // Add here
}
```

### Public Access
- Published forms are publicly readable
- Public datasets are readable by anyone
- Form submissions are always allowed (for public forms)
- Dataset record creation is allowed (for form integration)

### Data Protection
- All write operations require admin privileges
- Unpublished forms are admin-only
- Private datasets are admin-only
- Form submissions are admin-only for reading
- Audit logs are protected

## Troubleshooting

### Still Getting Permission Errors?

1. **Check if rules deployed**
   - Go to Firebase Console → Firestore → Rules
   - Verify the timestamp is recent
   - Check if your changes are visible

2. **Clear browser cache**
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
   - Or clear all browser cache

3. **Check authentication**
   - Verify you're logged in
   - Check if your email is in the admin list
   - Try logging out and back in

4. **Verify collection names**
   - Ensure collection names match exactly
   - Check for typos in your code

5. **Check Firebase Console**
   - Go to Firestore Database
   - Verify collections exist
   - Check if data is being written

### Common Issues

**Issue**: "resource.data is undefined"
**Solution**: This happens when trying to read a document that doesn't exist yet. The rules are correct; just create the document first.

**Issue**: Rules work in console but not in app
**Solution**: Clear browser cache and hard refresh. Firebase caches rules aggressively.

**Issue**: Can't create forms
**Solution**: Verify you're logged in as an admin user (check email in isAdmin() function).

## Additional Security Recommendations

### Production Hardening

For production, consider:

1. **Rate Limiting**
   - Add rate limits to prevent abuse
   - Use Firebase App Check

2. **Field-Level Security**
   - Validate field types and values
   - Prevent injection attacks

3. **Data Validation**
   - Add schema validation in rules
   - Enforce required fields

4. **Audit Logging**
   - Log all admin actions
   - Monitor suspicious activity

### Example Enhanced Rules

```javascript
match /customForms/{formId} {
  allow read: if isAdmin() || resource.data.published == true;
  allow create: if isAdmin() && 
    request.resource.data.title is string &&
    request.resource.data.fields is list;
  allow update: if isAdmin();
  allow delete: if isAdmin();
}
```

## Monitoring

### Check Rule Usage

In Firebase Console:
1. Go to Firestore Database
2. Click "Usage" tab
3. Monitor read/write operations
4. Check for denied requests

### Set Up Alerts

1. Go to Firebase Console → Alerting
2. Create alerts for:
   - High denied request rate
   - Unusual access patterns
   - Failed authentication attempts

## Support

If you continue to have permission issues:

1. Check this guide
2. Verify rules are deployed
3. Check Firebase Console logs
4. Review authentication status
5. Contact system administrator

---

**Status**: ✅ Rules Updated  
**Last Updated**: November 25, 2024  
**Next Step**: Deploy rules to Firebase
