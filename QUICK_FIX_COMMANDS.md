# Quick Fix Commands

## Fix Firebase Permissions Error

Run these commands in order:

### 1. Install Dependencies (if not done)
```bash
npm install qrcode.react
```

### 2. Deploy Firestore Rules and Indexes
```bash
firebase deploy --only firestore
```

**Or deploy separately:**
```bash
# Deploy security rules
firebase deploy --only firestore:rules

# Deploy indexes
firebase deploy --only firestore:indexes
```

### 3. Wait for Indexes to Build
- Takes 1-5 minutes
- Check status in Firebase Console → Firestore → Indexes
- Status should change from "Building" to "Enabled"

### 4. Restart Development Server
```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## Verify Everything Works

### Test Calendar Events
1. Go to `http://localhost:3000/lc-event-calendar`
2. Should see "No upcoming events" or list of events
3. No permission errors in console

### Test Admin Panel
1. Log in as admin
2. Go to `http://localhost:3000/admin/events`
3. Click "Add Sample Events"
4. Should successfully create 3 events

### Test Past Events
1. Go to `http://localhost:3000/lc-past-events`
2. Should load without errors
3. Will show past events once they exist

## If Still Getting Errors

### Check Firebase Project
```bash
firebase projects:list
firebase use [your-project-id]
```

### Check Firestore Rules in Console
1. Go to Firebase Console
2. Navigate to Firestore Database → Rules
3. Verify rules are deployed (check timestamp)

### Check Indexes in Console
1. Go to Firebase Console
2. Navigate to Firestore Database → Indexes
3. Verify indexes exist and are "Enabled"

### Check Environment Variables
Verify `.env.local` has:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

## Common Issues

### "Missing or insufficient permissions"
**Fix:** `firebase deploy --only firestore:rules`

### "The query requires an index"
**Fix:** `firebase deploy --only firestore:indexes` or click the error link

### "Cannot find module 'qrcode.react'"
**Fix:** `npm install qrcode.react`

### Image aspect ratio warning
**Fix:** Already fixed in code (added style prop)

## All-in-One Fix

Run all commands at once:
```bash
npm install qrcode.react && firebase deploy --only firestore && npm run dev
```

This will:
1. Install missing packages
2. Deploy Firestore rules and indexes
3. Restart the dev server
