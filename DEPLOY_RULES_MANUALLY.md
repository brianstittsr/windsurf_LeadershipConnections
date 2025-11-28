# Deploy Firestore Rules Manually (Easiest Method)

## Quick Fix - No Firebase CLI Needed!

Since you're getting "Missing or insufficient permissions", deploy the rules directly through Firebase Console.

## Step-by-Step Instructions

### 1. Open Firebase Console
Go to: https://console.firebase.google.com/

### 2. Select Your Project
Click on your Leadership Connections project

### 3. Navigate to Firestore Rules
- Click **"Firestore Database"** in the left sidebar
- Click the **"Rules"** tab at the top

### 4. Copy These Rules

Replace ALL existing rules with this:

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
    
    // Calendar Events - THIS IS THE IMPORTANT ONE!
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

### 5. Click "Publish"
Click the **"Publish"** button at the top right

### 6. Confirm
You'll see a confirmation - click **"Publish"** again

## ✅ That's It!

The rules are now deployed. Your calendar should work immediately!

## Test It

1. **Refresh your browser** on the calendar page
2. Go to: `http://localhost:3000/lc-event-calendar`
3. Should load without permission errors

## Next: Create Indexes

You'll also need to create composite indexes. Here's how:

### Option 1: Let Firebase Auto-Create (Easiest)

1. Load `/lc-event-calendar` in your browser
2. Open browser console (F12)
3. Look for a Firestore error with a clickable link
4. Click the link - it will auto-create the index
5. Wait 1-5 minutes for it to build

### Option 2: Create Manually in Console

1. In Firebase Console, go to **Firestore Database → Indexes**
2. Click **"Create Index"**

**Create Index 1:**
- Collection ID: `calendarEvents`
- Fields to index:
  - Field: `published`, Order: Ascending
  - Field: `startDate`, Order: Ascending
- Query scope: Collection
- Click **"Create"**

**Create Index 2:**
- Collection ID: `calendarEvents`
- Fields to index:
  - Field: `published`, Order: Ascending
  - Field: `endDate`, Order: Descending
- Query scope: Collection
- Click **"Create"**

Wait 1-5 minutes for indexes to build (status will show "Enabled" when ready).

## Troubleshooting

### Still getting permission errors?

1. **Check rules are published:**
   - Go to Firestore Database → Rules
   - Check the timestamp shows recent update

2. **Hard refresh your browser:**
   - Press `Ctrl + Shift + R` (Windows)
   - Or `Cmd + Shift + R` (Mac)

3. **Check browser console:**
   - Press F12
   - Look for specific error messages
   - Share them if you need more help

### "The query requires an index" error?

This means you need to create the composite indexes (see above).
The easiest way is to click the link in the error message.

## Why This Works

The key rule for calendar events is:

```javascript
match /calendarEvents/{eventId} {
  allow read: if resource.data.published == true || isAdmin();
  allow create, update, delete: if isAdmin();
}
```

This allows:
- ✅ Anyone to read published events (for the public calendar)
- ✅ Only admins to create/edit/delete events
- ✅ Admins to see unpublished events

## Summary

1. ✅ Copy rules from above
2. ✅ Paste into Firebase Console → Firestore → Rules
3. ✅ Click "Publish"
4. ✅ Refresh your browser
5. ✅ Create indexes (auto or manual)
6. ✅ Wait 1-5 minutes for indexes to build
7. ✅ Test your calendar!

No Firebase CLI needed! 🎉
