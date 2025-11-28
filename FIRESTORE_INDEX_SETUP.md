# Firestore Composite Index Setup

## Required Composite Index for Calendar Events

To enable the event calendar functionality, you need to create a composite index in Firestore.

### Index Configuration

**Collection:** `calendarEvents`

**Fields to index:**
1. `published` (Ascending)
2. `startDate` (Ascending)

### How to Create the Index

#### Option 1: Via Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Firestore Database** → **Indexes** tab
4. Click **Create Index**
5. Configure:
   - Collection ID: `calendarEvents`
   - Fields:
     - Field: `published`, Order: Ascending
     - Field: `startDate`, Order: Ascending
   - Query scope: Collection
6. Click **Create**

#### Option 2: Via Error Link
When you first load the LC Event Calendar page, Firestore will show an error in the browser console with a direct link to create the required index. Simply click that link and it will auto-configure the index for you.

#### Option 3: Via firestore.indexes.json
Add this to your `firestore.indexes.json` file:

```json
{
  "indexes": [
    {
      "collectionGroup": "calendarEvents",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "published",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "startDate",
          "order": "ASCENDING"
        }
      ]
    }
  ]
}
```

Then deploy with:
```bash
firebase deploy --only firestore:indexes
```

### Index Build Time
- The index typically takes 1-5 minutes to build
- You can monitor progress in the Firebase Console under Indexes
- The calendar page will work once the index status shows "Enabled"
