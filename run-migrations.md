# Run Migrations - Step by Step Guide

## The Issue

The migration scripts are failing because they use the client-side Firebase SDK without authentication. The Firestore rules require admin authentication to write data.

## Solution Options

### Option 1: Temporarily Open Rules (Quick & Easy)

1. **Update firestore.rules temporarily**
   
   Change these two sections:
   
   ```javascript
   // LC Past Classes - TEMPORARY: Allow all writes
   match /lcPastClasses/{document=**} {
     allow read: if true;
     allow write: if true;  // TEMPORARY - REMOVE AFTER MIGRATION
   }
   
   // LC Past Events - TEMPORARY: Allow all writes  
   match /lcPastEvents/{document=**} {
     allow read: if true;
     allow write: if true;  // TEMPORARY - REMOVE AFTER MIGRATION
   }
   ```

2. **Deploy temporary rules**
   ```bash
   firebase deploy --only firestore:rules
   ```

3. **Run migrations**
   ```bash
   npm run migrate-past-classes
   npm run migrate-past-events
   ```

4. **Restore secure rules**
   
   Change back to:
   ```javascript
   // LC Past Classes - public read, admin write
   match /lcPastClasses/{document=**} {
     allow read: if true;
     allow write: if isAdmin();
   }
   
   // LC Past Events - public read, admin write
   match /lcPastEvents/{document=**} {
     allow read: if true;
     allow write: if isAdmin();
   }
   ```

5. **Deploy secure rules**
   ```bash
   firebase deploy --only firestore:rules
   ```

### Option 2: Manual Entry via Firebase Console (Most Secure)

1. Go to Firebase Console: https://console.firebase.google.com/project/ncleadconnect-donor/firestore
2. Create `lcPastClasses` collection
3. Manually add each class document
4. Create `lcPastEvents` collection  
5. Manually add each event document

### Option 3: Use Firebase Admin Panel (Recommended if you have time)

1. Go to: https://www.ncleadconnect.org/admin/lc-classes
2. Sign in with your admin email (brianstittsr@gmail.com)
3. Manually add each class through the admin interface
4. Go to: https://www.ncleadconnect.org/admin/lc-past-events
5. Manually add each event through the admin interface

## Recommended Approach

**Use Option 1** - It's quick (5 minutes total) and safe if you:
- Deploy temporary rules
- Run migrations immediately
- Restore secure rules right after

The window of vulnerability is only a few minutes and the collections don't exist yet, so there's minimal risk.

## Quick Commands

```bash
# 1. Deploy temporary open rules
firebase deploy --only firestore:rules

# 2. Run migrations
npm run migrate-past-classes
npm run migrate-past-events

# 3. Edit firestore.rules to restore isAdmin() checks

# 4. Deploy secure rules
firebase deploy --only firestore:rules
```

## What to Change in firestore.rules

**BEFORE MIGRATION (lines 38-48):**
```javascript
// LC Past Classes - TEMPORARY: Allow all writes
match /lcPastClasses/{document=**} {
  allow read: if true;
  allow write: if true;  // TEMPORARY
}

// LC Past Events - TEMPORARY: Allow all writes
match /lcPastEvents/{document=**} {
  allow read: if true;
  allow write: if true;  // TEMPORARY
}
```

**AFTER MIGRATION (restore these):**
```javascript
// LC Past Classes - public read, admin write
match /lcPastClasses/{document=**} {
  allow read: if true;
  allow write: if isAdmin();
}

// LC Past Events - public read, admin write
match /lcPastEvents/{document=**} {
  allow read: if true;
  allow write: if isAdmin();
}
```

## Verification

After successful migration, verify:

1. **Firebase Console**
   - Check `lcPastClasses` has 4 documents
   - Check `lcPastEvents` has documents

2. **Public Website**
   - Visit: https://www.ncleadconnect.org/lc-past-classes
   - Should see all classes

3. **Admin Panel**
   - Visit: https://www.ncleadconnect.org/admin/lc-classes
   - Should see all classes editable

4. **Rules are Secure**
   - Try to write without auth - should fail
   - Only admins can write via admin panel
