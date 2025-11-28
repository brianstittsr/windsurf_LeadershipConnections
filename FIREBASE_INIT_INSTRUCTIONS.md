# Firebase Initialization Instructions

## The Issue

You're seeing: `Error: Not in a Firebase app directory (could not locate firebase.json)`

This means Firebase CLI needs to be initialized in your project.

## Quick Fix - Option 1: Manual Setup (Recommended)

I've created the required files (`firebase.json` and `.firebaserc`), but you need to update `.firebaserc` with your actual Firebase project ID.

### Step 1: Find Your Firebase Project ID

**Option A - From .env.local:**
1. Open `.env.local`
2. Find the line: `NEXT_PUBLIC_FIREBASE_PROJECT_ID=...`
3. Copy the project ID value

**Option B - From Firebase Console:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the gear icon → Project settings
4. Copy the "Project ID"

### Step 2: Update .firebaserc

Open `.firebaserc` and replace `"your-project-id"` with your actual project ID:

```json
{
  "projects": {
    "default": "your-actual-project-id-here"
  }
}
```

### Step 3: Deploy Firestore

Now you can deploy:

```bash
firebase deploy --only firestore
```

## Quick Fix - Option 2: Use Firebase Init

If you prefer to let Firebase CLI set everything up:

```bash
# Initialize Firebase (will create firebase.json and .firebaserc)
firebase init firestore

# Follow the prompts:
# - Select your Firebase project from the list
# - Use existing firestore.rules file: YES
# - Use existing firestore.indexes.json file: YES

# Then deploy
firebase deploy --only firestore
```

## Verify Your Setup

After deployment, check:

### 1. Firebase Console - Rules
- Go to Firebase Console → Firestore Database → Rules
- Should see your rules with timestamp showing recent update

### 2. Firebase Console - Indexes
- Go to Firebase Console → Firestore Database → Indexes
- Should see 2 composite indexes for `calendarEvents`
- Status should change from "Building" to "Enabled" (1-5 minutes)

### 3. Test Your App
```bash
# Restart dev server
npm run dev

# Visit these pages (should work without permission errors):
# - http://localhost:3000/lc-event-calendar
# - http://localhost:3000/admin/events
# - http://localhost:3000/lc-past-events
```

## Files Created

I've created these files for you:

### `firebase.json`
```json
{
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  }
}
```

### `.firebaserc`
```json
{
  "projects": {
    "default": "your-project-id"
  }
}
```

**⚠️ IMPORTANT:** Update `"your-project-id"` in `.firebaserc` with your actual Firebase project ID!

## Troubleshooting

### "Error: HTTP Error: 404, Project 'your-project-id' does not exist"

**Cause:** The project ID in `.firebaserc` is incorrect or placeholder

**Fix:** 
1. Get your real project ID from `.env.local` or Firebase Console
2. Update `.firebaserc` with the correct ID

### "Error: Failed to get Firebase project"

**Cause:** Not logged into Firebase CLI

**Fix:**
```bash
firebase login
```

### "Error: Authorization failed"

**Cause:** Not authorized for the Firebase project

**Fix:**
1. Verify you're logged in: `firebase login`
2. Check you have access to the project in Firebase Console
3. Try: `firebase login --reauth`

### "Index already exists"

**Cause:** Indexes were created manually in Firebase Console

**Fix:** This is fine! The deployment will skip existing indexes.

## Complete Setup Checklist

- [ ] Get Firebase project ID from `.env.local` or Firebase Console
- [ ] Update `.firebaserc` with actual project ID
- [ ] Run `firebase login` (if not logged in)
- [ ] Run `firebase deploy --only firestore`
- [ ] Wait 1-5 minutes for indexes to build
- [ ] Check Firebase Console to verify deployment
- [ ] Restart dev server: `npm run dev`
- [ ] Test calendar pages for permission errors

## Alternative: Deploy via Firebase Console

If Firebase CLI continues to have issues, you can manually set up in Firebase Console:

### Security Rules:
1. Go to Firebase Console → Firestore Database → Rules
2. Copy contents from `firestore.rules`
3. Paste and publish

### Indexes:
1. Go to Firebase Console → Firestore Database → Indexes
2. Click "Create Index"
3. Create two indexes as specified in `firestore.indexes.json`:
   - Index 1: `calendarEvents` → `published` (Ascending) + `startDate` (Ascending)
   - Index 2: `calendarEvents` → `published` (Ascending) + `endDate` (Descending)

## Next Steps After Successful Deployment

Once deployed successfully:

1. **Add Sample Events:**
   - Go to `/admin/events`
   - Click "Add Sample Events"
   - Should create 3 events without errors

2. **View Calendar:**
   - Go to `/lc-event-calendar`
   - Should see upcoming events

3. **Test Automatic Filtering:**
   - Events automatically move to past events when their end date passes
   - No manual action needed!
