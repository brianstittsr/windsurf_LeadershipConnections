# Calendar Event System Documentation

## Overview

The Leadership C.O.N.N.E.C.T.I.O.N.S. calendar system automatically manages upcoming and past events with intelligent filtering based on event dates.

## System Architecture

### Firestore Schema

**Collection:** `calendarEvents`

**Fields:**
```typescript
{
  id: string;                    // Auto-generated document ID
  title: string;                 // Event title
  description: string;           // Full event description
  startDate: Timestamp;          // Event start date/time
  endDate: Timestamp;            // Event end date/time
  location: string;              // Physical location address
  image?: string;                // Optional event image URL
  category: string;              // 'workshop' | 'class' | 'event' | 'meeting' | 'other'
  maxAttendees?: number;         // Optional max capacity
  currentAttendees: number;      // Current registration count
  registrationRequired: boolean; // Whether registration is needed
  registrationFormId?: string;   // Link to custom form
  published: boolean;            // Visibility control
  createdAt: Timestamp;          // Creation timestamp
  updatedAt: Timestamp;          // Last update timestamp
}
```

## Automatic Event Filtering

### Upcoming Events (`/lc-event-calendar`)

**Query Logic:**
```typescript
where('published', '==', true)
where('startDate', '>=', now)
orderBy('startDate', 'asc')
```

**Behavior:**
- Shows only events that haven't started yet
- Automatically hides events once their start date has passed
- Sorted chronologically (earliest first)
- Grouped by month

### Past Events (`/lc-past-events`)

**Query Logic:**
```typescript
where('published', '==', true)
where('endDate', '<', now)
orderBy('endDate', 'desc')
```

**Behavior:**
- Shows only events that have completely ended
- Automatically appears when event end date passes
- Sorted reverse chronologically (most recent first)
- Displayed in grid layout with event cards

## Event Lifecycle

```
1. Event Created (Admin Panel)
   ↓
2. Published = true
   ↓
3. Appears on "LC Event Calendar" (upcoming)
   ↓
4. Event Start Date Passes
   ↓
5. Automatically hidden from upcoming calendar
   ↓
6. Event End Date Passes
   ↓
7. Automatically appears on "LC Past Events"
```

## Required Firestore Indexes

### Index 1: Upcoming Events
- **Fields:**
  - `published` (Ascending)
  - `startDate` (Ascending)

### Index 2: Past Events
- **Fields:**
  - `published` (Ascending)
  - `endDate` (Descending)

### Creating Indexes

**Option 1: Automatic (Recommended)**
1. Load `/lc-event-calendar` or `/lc-past-events`
2. Check browser console for Firestore error
3. Click the provided link to auto-create index

**Option 2: Firebase Console**
1. Go to Firebase Console → Firestore → Indexes
2. Create composite indexes as specified above

**Option 3: Deploy via CLI**
```bash
firebase deploy --only firestore:indexes
```

## Adding Sample Events

### Via Admin Panel
1. Go to `/admin/events`
2. Click "Add Sample Events" button
3. Confirms and adds 3 sample events:
   - Leadership Development Workshop (next month)
   - Community Engagement Meeting (next month)
   - Youth Mentorship Kickoff (2 months out)

### Programmatically
```typescript
import { addSampleCalendarEvent, addMultipleSampleEvents } from '@/lib/add-sample-event';

// Add single event
const result = await addSampleCalendarEvent();

// Add multiple events
const result = await addMultipleSampleEvents();
```

## Event Detail Pages

### URL Structure
- **Upcoming Event:** `/lc-event-calendar/[eventId]`
- **Past Event:** `/lc-event-calendar/[eventId]` (same URL, works for both)

### Features
- Full event information display
- Google Maps integration
- Dual QR codes (event details + location)
- Share functionality
- Registration CTA (if required)

## Security Rules

```javascript
match /calendarEvents/{eventId} {
  allow read: if resource.data.published == true || isAdmin();
  allow create, update, delete: if isAdmin();
}
```

**Behavior:**
- Public can only read published events
- Unpublished events only visible to admins
- Only admins can create, edit, or delete events

## Testing the System

### Test Upcoming Events
1. Create event with future start date
2. Set `published = true`
3. Visit `/lc-event-calendar`
4. Event should appear in upcoming list

### Test Past Events
1. Create event with past end date
2. Set `published = true`
3. Visit `/lc-past-events`
4. Event should appear in past events section

### Test Automatic Transition
1. Create event ending in 1 hour
2. Publish the event
3. Wait for end time to pass
4. Event automatically moves from upcoming to past

## Admin Panel Features

### Event Calendar Management (`/admin/events`)

**Capabilities:**
- ✅ Add new events
- ✅ Edit existing events
- ✅ Delete events
- ✅ Toggle published status
- ✅ Add sample events (for testing)
- ✅ View all events (past and future)

**Form Fields:**
- Event Title
- Description
- Start Date & Time
- End Date & Time
- Location
- Category
- Max Attendees (optional)
- Registration Required
- Registration Form Link (optional)
- Published Status

## Best Practices

### Event Creation
1. **Set accurate end dates** - This determines when events move to past
2. **Use descriptive titles** - Helps users find events
3. **Include full location** - Needed for Google Maps integration
4. **Test before publishing** - Create as unpublished first

### Event Categories
- **Workshop** - Hands-on learning sessions
- **Class** - Educational programs
- **Event** - General community events
- **Meeting** - Regular meetings or gatherings
- **Other** - Miscellaneous activities

### Location Format
Use full addresses for best map results:
```
✅ Good: "123 Leadership Lane, Durham, NC 27701"
❌ Bad: "Community Center"
```

## Troubleshooting

### Events Not Showing on Calendar
- Check `published` field is `true`
- Verify `startDate` is in the future
- Ensure Firestore index is created
- Check browser console for errors

### Events Not Moving to Past
- Verify `endDate` has passed
- Check Firestore index for past events exists
- Confirm `published` is `true`

### QR Codes Not Working
- Install `qrcode.react` package: `npm install qrcode.react`
- Verify event URL is accessible
- Check location format is valid

### Map Not Displaying
- Add Google Maps API key to `.env.local`
- Verify API key has Maps Embed API enabled
- Check location string is valid

## Future Enhancements

Potential features to add:
- [ ] Event registration system
- [ ] Email notifications for upcoming events
- [ ] Calendar export (iCal format)
- [ ] Event categories filtering
- [ ] Search functionality
- [ ] Event attendance tracking
- [ ] Recurring events support
- [ ] Event reminders
