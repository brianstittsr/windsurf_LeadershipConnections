# LC Past Events - Setup Instructions

## Overview
Two comprehensive articles have been created for the LC Past Events page:

1. **Women In Pink: Thanksgiving Dinners for Breast Cancer Survivors** (2013)
2. **Democracy Without Walls: Engaging with Government Leaders** (2014)

## Articles Content Summary

### Women In Pink: Thanksgiving Dinners for Breast Cancer Survivors
- **Date**: 2013
- **Location**: Leadership C.O.N.N.E.C.T.I.O.N.S. Center
- **Tags**: Community Service, Women In Pink
- **Sections**:
  - Program Mission
  - Thanksgiving Dinner Event
  - Community Impact
  - Building Connections
  - Volunteer Engagement
  - Legacy of Care

### Democracy Without Walls: Engaging with Government Leaders
- **Date**: 2014
- **Location**: Various Government Offices
- **Tags**: Civic Engagement, Government
- **Sections**:
  - Program Mission and Vision
  - Government Visits and Meetings
  - Interactive Learning Experiences
  - Meeting Local and State Leaders
  - Civic Education and Awareness
  - Building Future Leaders
  - Community Impact and Outcomes
  - Breaking Down Barriers
- **Images**: Includes 3 embedded images showing students meeting with government officials

## How to Migrate Events to Firebase

### Step 1: Ensure Firebase Configuration
Make sure your `.env.local` file has all Firebase credentials:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Step 2: Run Migration Script
Execute the following command in your terminal:
```bash
npm run migrate-past-events
```

This will:
- Create the `lcPastEvents` collection in Firestore
- Add all 5 past events including the two new articles
- Store complete HTML content for each event

### Step 3: Verify in Firebase Console
1. Go to Firebase Console
2. Navigate to Firestore Database
3. Check the `lcPastEvents` collection
4. Verify all events are present with their content

## Admin Panel Management

### Accessing the Admin Panel
1. Navigate to: `http://localhost:3000/admin/lc-past-events`
2. Sign in with admin credentials
3. You'll see all past events listed

### Editing Events
1. Click "Edit" on any event
2. Modify any field including:
   - Title
   - Description (paragraph)
   - Date
   - Location
   - Image path
   - Tags
   - **Full Article Content (HTML)** - This is where you can edit the complete article
   - Published status (checkbox)
3. Click "Save" to update in Firebase

### Adding New Events
1. Click "Add New Event" button
2. Fill in all fields
3. Add HTML content in the "Full Article Content" field
4. Check "Published" to make it visible
5. Click "Save"

### Deleting Events
1. Click "Delete" on any event
2. Confirm deletion
3. Event will be removed from Firebase

## Content Editing Tips

### HTML Content Format
The content field accepts HTML with Tailwind CSS classes. Use this structure:

```html
<div class="event-content">
  <h3 class="text-2xl font-bold mb-6 text-primary-600 dark:text-primary-400">Article Title</h3>
  
  <p class="mb-6 text-base leading-relaxed text-body-color">
    Introduction paragraph...
  </p>

  <h4 class="text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400">Section Title</h4>
  <p class="mb-6 text-base leading-relaxed text-body-color">
    Section content...
  </p>

  <!-- Add images -->
  <div class="mb-10 w-full overflow-hidden rounded">
    <img src="/images/path/to/image.jpg" alt="Description" class="w-full h-auto rounded" />
  </div>

  <!-- Highlight box -->
  <div class="mt-8 p-6 bg-primary bg-opacity-10 rounded-lg">
    <p class="text-base font-medium text-primary mb-2">Highlight Title</p>
    <p class="text-base text-body-color">
      Highlight content...
    </p>
  </div>
</div>
```

### Tailwind Classes Used
- **Headings**: `text-2xl font-bold mb-6 text-primary-600 dark:text-primary-400`
- **Subheadings**: `text-xl font-semibold mb-4 text-primary-600 dark:text-primary-400`
- **Paragraphs**: `mb-6 text-base leading-relaxed text-body-color`
- **Images**: `mb-10 w-full overflow-hidden rounded`
- **Highlight boxes**: `mt-8 p-6 bg-primary bg-opacity-10 rounded-lg`

## Viewing Events

### Public Page
- URL: `http://localhost:3000/lc-past-events`
- Shows all published events in a grid
- Click any event to view full article

### Individual Event Page
- URL: `http://localhost:3000/lc-past-events/[slug]`
- Displays full article content with HTML rendering
- Examples:
  - `/lc-past-events/women-in-pink-thanksgiving`
  - `/lc-past-events/democracy-without-walls`

## Firebase Structure

### Collection: `lcPastEvents`
Each document contains:
```javascript
{
  id: number,
  slug: string,              // URL-friendly identifier
  title: string,             // Event title
  paragraph: string,         // Short description
  image: string,             // Path to main image
  date: string,              // Display date (e.g., "2013", "Fall 2023")
  location: string,          // Event location
  tags: string[],            // Category tags
  content: string,           // Full HTML article content
  published: boolean,        // Visibility status
  createdAt: Timestamp,      // Creation date
  updatedAt: Timestamp       // Last update date
}
```

## Troubleshooting

### Events Not Showing
1. Check Firebase rules allow read access
2. Verify `published` field is `true`
3. Check browser console for errors

### Migration Fails
1. Verify Firebase credentials in `.env.local`
2. Check Firestore rules allow write access
3. Ensure you have internet connection

### Admin Panel Access Denied
1. Verify you're signed in
2. Check your email is in the admin users list
3. Contact system administrator

## Next Steps

1. Run the migration script to populate Firebase
2. Access admin panel to verify events
3. Test editing an event
4. View events on the public page
5. Customize content as needed

All content is now fully editable through the admin panel!
