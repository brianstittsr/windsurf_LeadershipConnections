# Firebase Permissions Error - Complete Fix Guide

## 🚨 Current Error

You're seeing:
```
FirebaseError: Missing or insufficient permissions
```

This appears on multiple pages:
- `/admin/events` - Error fetching events
- `/admin/forms` - Error fetching forms  
- `/admin/datasets` - Error fetching projects
- `/lc-event-calendar` - Error fetching calendar events

## ✅ Solution: Deploy Firestore Rules via Firebase Console

Since Firebase CLI setup is complex, use the **easiest method** - Firebase Console:

### Step 1: Open Firebase Console

Go to: **https://console.firebase.google.com/**

### Step 2: Select Your Project

Click on your **Leadership Connections** project

### Step 3: Navigate to Firestore Rules

1. Click **"Firestore Database"** in the left sidebar
2. Click the **"Rules"** tab at the top

### Step 4: Copy and Paste These Rules

**Replace ALL existing rules** with the complete rules below:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && 
             exists(/databases/$(database)/documents/adminUsers/$(request.auth.uid));
    }
    
    // Helper function to check if user is authenticated
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // User profiles
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && request.auth.uid == userId;
    }
    
    // Admin users
    match /adminUsers/{userId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // Alumni comments
    match /alumniComments/{commentId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Blog entries
    match /blogEntries/{entryId} {
      allow read: if resource.data.published == true || isAdmin();
      allow write: if isAdmin();
    }
    
    // Service entries
    match /serviceEntries/{entryId} {
      allow read: if resource.data.active == true || isAdmin();
      allow write: if isAdmin();
    }
    
    // Program entries
    match /programEntries/{entryId} {
      allow read: if resource.data.active == true || isAdmin();
      allow write: if isAdmin();
    }
    
    // Settings
    match /settings/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Custom Forms
    match /customForms/{formId} {
      allow read: if resource.data.published == true || isAdmin();
      allow write: if isAdmin();
    }
    
    // Form Submissions
    match /formSubmissions/{submissionId} {
      allow read: if isAdmin();
      allow create: if true;
      allow update, delete: if isAdmin();
    }
    
    // DataHub - API Keys
    match /lcDatasetAPIKeys/{document=**} {
      allow read, write: if isAdmin();
    }
    
    // Calendar Events - CRITICAL FOR EVENT CALENDAR
    match /calendarEvents/{eventId} {
      allow read: if resource.data.published == true || isAdmin();
      allow create, update, delete: if isAdmin();
    }
    
    // DataHub - Audit Logs
    match /lcDatasetAuditLogs/{document=**} {
      allow read: if isAdmin();
      allow create: if true;
      allow update, delete: if isAdmin();
    }
    
    // Projects - for grouping forms, datasets, and events
    match /projects/{projectId} {
      allow read: if isAdmin();
      allow write: if isAdmin();
    }
    
    // LC Forms
    match /lcForms/{formId} {
      allow read: if isAdmin();
      allow write: if isAdmin();
    }
    
    // LC Datasets
    match /lcDatasets/{datasetId} {
      allow read: if isAdmin();
      allow write: if isAdmin();
    }
    
    // LC Form Submissions
    match /lcFormSubmissions/{submissionId} {
      allow read: if isAdmin();
      allow create: if true;
      allow update, delete: if isAdmin();
    }
    
    // Member Profiles
    match /memberProfiles/{profileId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && 
                     (request.auth.uid == profileId || isAdmin());
    }
    
    // Connections
    match /connections/{connectionId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
    }
    
    // Mentorships
    match /mentorships/{mentorshipId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
    }
    
    // Messages
    match /messages/{messageId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
    }
    
    // Message Threads
    match /messageThreads/{threadId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
    }
    
    // Strategic Planning Methods
    match /strategicPlanningMethods/{methodId} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
```

### Step 5: Publish the Rules

1. Click the **"Publish"** button at the top right
2. Confirm by clicking **"Publish"** again in the dialog

### Step 6: Create Composite Indexes

You also need to create indexes for the calendar events queries.

**Option A: Auto-Create (Easiest)**

1. Refresh your browser on `/lc-event-calendar`
2. Open browser console (F12)
3. Look for a Firestore error with a clickable link
4. Click the link - Firebase will auto-create the index
5. Wait 1-5 minutes for it to build

**Option B: Manual Creation**

In Firebase Console:

1. Go to **Firestore Database → Indexes** tab
2. Click **"Create Index"**

**Create Index 1 (Upcoming Events):**
- Collection ID: `calendarEvents`
- Fields:
  - `published` - Ascending
  - `startDate` - Ascending
- Query scope: Collection
- Click **"Create"**

**Create Index 2 (Past Events):**
- Collection ID: `calendarEvents`
- Fields:
  - `published` - Ascending
  - `endDate` - Descending
- Query scope: Collection
- Click **"Create"**

Wait 1-5 minutes for indexes to build (status will show "Enabled").

## ✅ Verification

After publishing rules and creating indexes:

1. **Hard refresh your browser:**
   - Windows: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

2. **Test these pages:**
   - `/lc-event-calendar` - Should load without errors
   - `/admin/events` - Should display events list
   - `/admin/forms` - Should display forms list
   - `/admin/datasets` - Should display projects

3. **Check browser console:**
   - Press F12
   - Should see no Firebase permission errors

## 🔍 Troubleshooting

### Still seeing permission errors?

**Check rules are published:**
1. Go to Firestore Database → Rules
2. Verify timestamp shows recent update
3. Rules should match the code above

**Check you're logged in as admin:**
1. Your email must exist in the `adminUsers` collection
2. Check Firebase Console → Firestore Database → Data
3. Look for `adminUsers` collection
4. Verify your user ID is there

**Clear browser cache:**
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

### "The query requires an index" error?

This means indexes aren't created yet:
1. Click the link in the error message (easiest)
2. Or manually create indexes as described above
3. Wait 1-5 minutes for them to build

### API Datasets 500 error?

This is a separate backend issue, not related to Firestore rules.
Check your API route: `app/api/datasets/route.ts`

## 📋 Summary

**What you need to do:**

1. ✅ Copy the Firestore rules above
2. ✅ Paste into Firebase Console → Firestore → Rules
3. ✅ Click "Publish"
4. ✅ Create 2 composite indexes (auto or manual)
5. ✅ Wait 1-5 minutes for indexes to build
6. ✅ Hard refresh your browser
7. ✅ Test your pages

**Total time:** 5-10 minutes

**No command line needed!** Everything is done through Firebase Console web interface.

## 🎯 Expected Result

After completing these steps:
- ✅ No more "Missing or insufficient permissions" errors
- ✅ Calendar events load correctly
- ✅ Admin pages display data
- ✅ Can add sample events
- ✅ Can create/edit calendar events

## 📞 Need Help?

If you're still stuck:
1. Screenshot the Firebase Console Rules page
2. Screenshot the Indexes page
3. Share any console errors
4. Verify you're logged in as an admin user
