# Deploy Firestore Rules - Required for LC Past Classes

## ⚠️ IMPORTANT: Firestore Rules Must Be Deployed

The migration script failed because Firestore rules need to be updated to allow writes to the `lcPastClasses` collection.

## Quick Fix - Deploy Rules via Firebase Console

### Option 1: Firebase Console (Recommended - Easiest)

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com
   - Select your project

2. **Navigate to Firestore Rules**
   - Click "Firestore Database" in left sidebar
   - Click "Rules" tab at the top

3. **Update Rules**
   - You'll see the rules editor
   - Find the section with `lcClasses` (around line 32-36)
   - Add the new `lcPastClasses` rule after it

4. **Add This Code** (after the lcClasses section):
   ```
   // LC Past Classes - public read, admin write
   match /lcPastClasses/{document=**} {
     allow read: if true;
     allow write: if isAdmin();
   }
   ```

5. **Publish Rules**
   - Click "Publish" button at top
   - Wait for confirmation message
   - Rules are now live!

### Option 2: Firebase CLI (If You Have It Set Up)

1. **Authenticate Firebase CLI**
   ```bash
   firebase login
   ```

2. **Deploy Rules**
   ```bash
   firebase deploy --only firestore:rules
   ```

3. **Confirm Deployment**
   - Wait for success message
   - Rules are deployed!

## Complete Updated Rules File

The `firestore.rules` file has already been updated in your project. Here's what was added:

```javascript
// LC Past Classes - public read, admin write
match /lcPastClasses/{document=**} {
  allow read: if true;
  allow write: if isAdmin();
}
```

This rule allows:
- **Public Read**: Anyone can view past classes
- **Admin Write**: Only admins can create/update/delete classes

## After Deploying Rules

Once the rules are deployed, run the migration script again:

```bash
npm run migrate-past-classes
```

This will:
1. Connect to Firebase
2. Create `lcPastClasses` collection
3. Add all 4 class articles with complete content
4. Set all classes to `published: true`

## Verify Deployment

### Check in Firebase Console:
1. Go to Firestore Database
2. Look for `lcPastClasses` collection
3. Should see 4 documents:
   - Class of 1998-1999
   - Class of 2017-2018
   - Class of 2022-2023
   - Class of 2023-2024

### Check on Website:
1. Visit: https://www.ncleadconnect.org/lc-past-classes
2. Should see all 4 classes displayed
3. Click on a class to view full article

### Check in Admin Panel:
1. Visit: https://www.ncleadconnect.org/admin/lc-classes
2. Sign in with admin credentials
3. Should see all 4 classes listed
4. Can edit, add, or delete classes

## Troubleshooting

### "Permission Denied" Error
- **Cause**: Firestore rules not deployed
- **Fix**: Deploy rules via Firebase Console (Option 1 above)

### "Collection Not Found" Error
- **Cause**: Migration hasn't run successfully yet
- **Fix**: Run `npm run migrate-past-classes` after deploying rules

### Rules Not Taking Effect
- **Cause**: Browser cache or Firebase propagation delay
- **Fix**: 
  - Wait 1-2 minutes for rules to propagate
  - Clear browser cache
  - Try in incognito/private window

### Migration Script Fails
- **Cause**: Firebase credentials or connection issue
- **Fix**:
  - Check `.env.local` has all Firebase credentials
  - Verify internet connection
  - Check Firebase Console for project status

## What Happens After Successful Migration

1. **Firebase Firestore**
   - New `lcPastClasses` collection created
   - 4 documents with complete class data
   - All fields populated (title, content, images, etc.)

2. **Public Website**
   - `/lc-past-classes` page shows all classes
   - Classes display with images and descriptions
   - Click any class to view full article
   - Title is visible (dark mode disabled)

3. **Admin Panel**
   - `/admin/lc-classes` shows management interface
   - Can edit any class content
   - Can add new classes
   - Can delete classes
   - Can toggle published status

## Next Steps After Rules Deployment

1. ✅ Deploy Firestore rules (via Firebase Console)
2. ✅ Run migration: `npm run migrate-past-classes`
3. ✅ Verify in Firebase Console
4. ✅ Check public website
5. ✅ Test admin panel
6. ✅ Customize content as needed

## Firebase Console Quick Links

- **Firebase Console**: https://console.firebase.google.com
- **Firestore Database**: https://console.firebase.google.com/project/_/firestore
- **Firestore Rules**: https://console.firebase.google.com/project/_/firestore/rules

## Support

If you encounter issues:
1. Check Firebase Console for error messages
2. Verify all admin emails in `isAdmin()` function
3. Check browser console for JavaScript errors
4. Ensure `.env.local` has correct Firebase credentials
5. Try deploying rules again if first attempt fails

---

**Remember**: The rules file in your project (`firestore.rules`) has already been updated. You just need to deploy it to Firebase!
