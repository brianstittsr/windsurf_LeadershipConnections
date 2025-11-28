# Event Details Page - OpenStreetMap & QR Code Updates

## Overview

Updated the Event Details page (`/lc-event-calendar/[eventId]`) with the following improvements:
1. **Replaced Google Maps with OpenStreetMap** - Free, open-source mapping
2. **Added clickable links under all QR codes** - Easy access to destinations
3. **Added Registration Form QR code** - Quick access to event registration

## Changes Made

### 1. OpenStreetMap Integration ✅

**Replaced:**
- Google Maps embed (required API key, had errors)

**With:**
- OpenStreetMap interactive map component
- Uses existing `EventMap` component
- No API key required
- Free and open-source

**Features:**
- Interactive pan and zoom
- Marker with event details
- Link to full OpenStreetMap
- Conditional display (only if coordinates exist)
- Graceful fallback message if no coordinates

### 2. QR Code Links Added ✅

All QR codes now have clickable links underneath:

**Event Details QR Code:**
- Shows truncated URL
- Clickable link to event page
- Opens in new tab

**Event Location QR Code:**
- "Open in OpenStreetMap →" link
- Direct link to location on OpenStreetMap
- Opens in new tab

**Registration Form QR Code (NEW):**
- "Register Online →" link
- Direct link to registration form
- Opens in new tab
- Only shows if `registrationFormId` exists

### 3. Registration Form QR Code ✅

**New QR Code Added:**
- Appears in QR code grid (3rd position)
- Only displays if event has `registrationFormId`
- Links to `/forms/public/[formId]`
- Includes clickable link below QR code

**Conditional Display:**
- Checks for `event.registrationFormId`
- Grid adjusts automatically (2 or 3 columns)
- Responsive layout on all devices

## Layout Changes

### Before:
```
[Event Details QR] [Event Location QR]
```

### After:
```
[Event Details QR] [Event Location QR] [Registration Form QR]
     (with link)         (with link)          (with link)
```

## Technical Details

### New Interface Fields

```typescript
interface CalendarEvent {
  // ... existing fields
  registrationFormId?: string;  // NEW
  coordinates?: {               // NEW
    lat: number;
    lng: number;
  };
}
```

### New Functions

```typescript
// OpenStreetMap URL generator
const getOpenStreetMapUrl = (location: string, coordinates?: { lat: number; lng: number }) => {
  if (coordinates) {
    return `https://www.openstreetmap.org/?mlat=${coordinates.lat}&mlon=${coordinates.lng}#map=15/${coordinates.lat}/${coordinates.lng}`;
  }
  return `https://www.openstreetmap.org/search?query=${encodeURIComponent(location)}`;
};

// Registration form URL generator
const getRegistrationFormUrl = () => {
  if (typeof window !== 'undefined' && event?.registrationFormId) {
    return `${window.location.origin}/forms/public/${event.registrationFormId}`;
  }
  return '';
};
```

### Map Component

```tsx
// Dynamic import to avoid SSR issues
const EventMap = dynamic(() => import('@/components/Events/EventMap'), {
  ssr: false,
  loading: () => <div className="w-full h-[400px] bg-gray-200 rounded-lg animate-pulse"></div>
});

// Usage
<EventMap
  latitude={event.coordinates.lat}
  longitude={event.coordinates.lng}
  locationName={event.location}
  eventTitle={event.title}
/>
```

## QR Code Grid Layout

### Responsive Grid:
- **Mobile**: 1 column (stacked)
- **Tablet (sm)**: 2 columns
- **Desktop (lg)**: 3 columns (if registration form exists)

### Each QR Code Card:
```tsx
<div className="flex flex-col items-center">
  <div className="rounded-lg bg-white p-6 shadow-lg">
    <QRCodeSVG value={url} size={200} level="H" includeMargin={true} />
  </div>
  <p className="mt-3 text-center text-sm font-semibold text-gray-700">Label</p>
  <a href={url} className="mt-2 text-xs text-primary hover:underline">
    Link Text →
  </a>
</div>
```

## Benefits

### OpenStreetMap vs Google Maps:
✅ **No API key required** - No setup needed
✅ **No cost** - Completely free
✅ **No errors** - No "API key invalid" messages
✅ **Open source** - Community-driven
✅ **Privacy-friendly** - No tracking
✅ **Same functionality** - Interactive map with markers

### QR Code Links:
✅ **Better UX** - Users can click instead of scanning
✅ **Desktop friendly** - Works on computers without cameras
✅ **Accessibility** - Screen readers can access links
✅ **Transparency** - Users see where QR codes lead
✅ **Backup option** - If QR scan fails, click the link

### Registration Form QR Code:
✅ **Quick registration** - One scan to register
✅ **Mobile optimized** - Easy on-the-go registration
✅ **Shareable** - Can share QR code image
✅ **Professional** - Modern event management
✅ **Conditional** - Only shows when form exists

## Admin Panel Updates Needed

To use the new features, events need:

### 1. Coordinates (for map)
- Add `coordinates.lat` and `coordinates.lng` in admin panel
- Example: `{ lat: 35.9940, lng: -78.8986 }` for Durham, NC

### 2. Registration Form ID (for QR code)
- Add `registrationFormId` field in admin panel
- Example: `QcauZ3pmjITj8LbA8AX8`
- Must match a published form in `/forms/public/[formId]`

## Testing Checklist

- [x] OpenStreetMap displays when coordinates exist
- [x] Map shows correct location with marker
- [x] "Open in OpenStreetMap" link works
- [x] Graceful message when no coordinates
- [x] Event Details QR code has link
- [x] Event Location QR code has link
- [x] Registration Form QR code appears when formId exists
- [x] Registration Form QR code has link
- [x] All links open in new tabs
- [x] QR codes scan correctly
- [x] Grid layout responsive on all devices
- [x] Registration CTA button links to form

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS/Android)

## Files Modified

### 1. `app/lc-event-calendar/[eventId]/page.tsx`

**Changes:**
- Imported `EventMap` component dynamically
- Added `registrationFormId` and `coordinates` to interface
- Replaced Google Maps with OpenStreetMap
- Added `getOpenStreetMapUrl()` function
- Added `getRegistrationFormUrl()` function
- Updated QR code section with 3-column grid
- Added links under all QR codes
- Added registration form QR code (conditional)
- Updated registration CTA to link to form

**Lines Modified:** ~150 lines

## Usage Examples

### Event with All Features:
```typescript
{
  title: "Leadership Workshop 2024",
  location: "Durham Convention Center",
  coordinates: {
    lat: 35.9940,
    lng: -78.8986
  },
  registrationFormId: "QcauZ3pmjITj8LbA8AX8",
  registrationRequired: true
}
```

**Result:**
- Interactive OpenStreetMap displayed
- 3 QR codes with links:
  1. Event Details
  2. Event Location (OpenStreetMap)
  3. Registration Form
- Registration CTA button

### Event with Map Only:
```typescript
{
  title: "Community Meeting",
  location: "Raleigh City Hall",
  coordinates: {
    lat: 35.7796,
    lng: -78.6382
  }
  // No registrationFormId
}
```

**Result:**
- Interactive OpenStreetMap displayed
- 2 QR codes with links:
  1. Event Details
  2. Event Location
- No registration QR code or CTA

### Event with No Coordinates:
```typescript
{
  title: "Virtual Webinar",
  location: "Online via Zoom"
  // No coordinates
}
```

**Result:**
- Message: "Map coordinates not available for this event."
- 2 QR codes with links:
  1. Event Details
  2. Event Location (search on OpenStreetMap)

## Future Enhancements

Potential additions:
- [ ] Add calendar download QR code (.ics file)
- [ ] Add social media share QR codes
- [ ] Add event flyer download QR code
- [ ] Add directions QR code (from user's location)
- [ ] Add QR code customization (colors, logos)

## Summary

✅ **OpenStreetMap Integration** - Free, open-source mapping
✅ **QR Code Links** - Clickable links under all QR codes
✅ **Registration Form QR Code** - Quick access to registration
✅ **Responsive Design** - Works on all devices
✅ **No API Keys** - No setup required
✅ **Better UX** - Multiple ways to access information

**All event details pages now have enhanced functionality with OpenStreetMap and improved QR codes!**
