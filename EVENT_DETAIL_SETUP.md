# Event Detail Page Setup Instructions

## Required Package Installation

You need to install the `qrcode.react` package for QR code functionality.

### Installation Command

Run this command in your project directory:

```bash
npm install qrcode.react
```

Or if you're using yarn:

```bash
yarn add qrcode.react
```

## Google Maps API Key (Optional but Recommended)

To display the embedded map on the event detail page, you need a Google Maps API key.

### Steps to Get Google Maps API Key:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Maps Embed API**
4. Go to **Credentials** and create an API key
5. Restrict the API key to your domain for security

### Add API Key to Environment Variables:

Create or update your `.env.local` file:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

**Note:** If you don't add the API key, the map will still show but with a "For development purposes only" watermark.

## Features Included

### Event Detail Page (`/lc-event-calendar/[eventId]`)

✅ **Event Information Display:**
- Event title and category badge
- Date, time, and location with icons
- Full event description
- Attendee count (if max attendees is set)

✅ **Interactive Map:**
- Embedded Google Maps showing event location
- "Open in Google Maps" link for directions

✅ **QR Code Sharing:**
- Two QR codes generated:
  1. **Event Details QR** - Links to the event page
  2. **Location QR** - Opens Google Maps with the location
- Instructions for scanning QR codes
- Share button for native mobile sharing

✅ **Navigation:**
- Back to calendar button
- Breadcrumb navigation

✅ **Registration CTA:**
- Shows if event requires registration
- Call-to-action button for registration

## How It Works

1. **From Calendar Page:**
   - Users click "View Details" on any event card
   - Navigates to `/lc-event-calendar/[eventId]`

2. **Event Detail Page:**
   - Fetches event data from Firestore
   - Displays all event information
   - Generates QR codes dynamically
   - Embeds Google Maps for location

3. **QR Code Sharing:**
   - Users can scan QR codes with smartphone camera
   - Event Details QR → Opens event page
   - Location QR → Opens Google Maps with directions

## Testing

1. Create an event in the admin panel (`/admin/events`)
2. Mark it as "Published"
3. Go to `/lc-event-calendar`
4. Click "View Details" on the event
5. Verify:
   - Event information displays correctly
   - Map shows the location
   - QR codes are visible
   - Share button works

## Mobile Optimization

The page is fully responsive and includes:
- Mobile-friendly layout
- Touch-optimized buttons
- Native share API support on mobile devices
- QR codes optimized for smartphone cameras

## Security Notes

- Only published events are accessible to the public
- Unpublished events return "Event Not Found"
- Admin users can view all events (if you add admin check)
