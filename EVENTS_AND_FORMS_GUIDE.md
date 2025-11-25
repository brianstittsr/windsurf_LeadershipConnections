# Event Calendar & Custom Forms Guide

This guide explains how to use the new Event Calendar and Custom Forms features in the Leadership Connections platform.

## Table of Contents
- [Event Calendar](#event-calendar)
- [Custom Forms](#custom-forms)
- [QR Code Generation](#qr-code-generation)
- [Form Templates](#form-templates)

---

## Event Calendar

### Admin Interface
Access the event calendar management at `/admin/events`

### Features
- **Create Events**: Add new events with full details
  - Title and description
  - Start and end date/time
  - Location
  - Category (workshop, class, event, meeting, other)
  - Maximum attendees (optional)
  - Event image (optional)
  - Registration requirement
  - Link to registration form
  - Publish/draft status

- **Edit Events**: Update existing event details
- **Delete Events**: Remove events from the calendar
- **View Events**: See all events in a list view with filtering

### Public Calendar
Access the public calendar at `/calendar`

#### Features:
- **Calendar View**: Month-by-month calendar grid showing all events
- **List View**: Detailed list of all upcoming events
- **Category Filters**: Filter events by category
- **Event Details**: Click any event to see full details
- **Registration**: Direct link to registration form if required

---

## Custom Forms

### Admin Interface
Access forms management at `/admin/forms`

### Creating Forms

#### Option 1: Use a Template
Click "Create New Form" and select from pre-built templates:

1. **Event Registration**
   - Full Name
   - Email Address
   - Phone Number
   - Number of Attendees
   - Dietary Restrictions
   - How did you hear about this event?

2. **Attendance Tracking**
   - Full Name
   - Email Address
   - Check-in Time
   - Program/Event

3. **Donation Tracking**
   - Donor Name
   - Email Address
   - Phone Number
   - Donation Amount
   - Donation Type
   - Program to Support
   - Comments

4. **Pre-Event Survey**
   - Full Name
   - Email Address
   - What are you most excited about?
   - What do you hope to learn?
   - Specific questions
   - Experience Level

5. **Post-Event Survey**
   - Full Name (optional)
   - Email Address (optional)
   - Overall Rating
   - What did you like most?
   - What could be improved?
   - Would you attend future events?
   - Additional Comments

6. **Custom Form**
   - Start with a blank form and add your own fields

#### Option 2: Create Custom Form
1. Select "Custom Form" template
2. Add fields using the "+ Add Field" button
3. Configure each field:
   - Label
   - Type (text, email, phone, textarea, number, date, select, radio, checkbox, file)
   - Required/Optional
   - Placeholder text
   - Options (for select, radio, checkbox)
   - Reorder fields using ↑ ↓ buttons

### Form Settings
- **Published**: Make form visible to public
- **Allow Multiple Submissions**: Let users submit multiple times
- **Require Authentication**: Require login to submit

### Managing Forms
- **Edit**: Modify form fields and settings
- **Duplicate**: Create a copy of an existing form (great for similar events)
- **View Submissions**: See all form responses
- **Generate QR Code**: Create a QR code for mobile access
- **Delete**: Remove form and all submissions

---

## QR Code Generation

### How to Generate QR Codes
1. Go to `/admin/forms`
2. Find the form you want to create a QR code for
3. Click "Generate QR" button
4. QR code will appear below the form details
5. Click "Download QR Code" to save as PNG

### Use Cases
- Print QR codes on event flyers
- Display at registration tables
- Include in email newsletters
- Share on social media
- Add to presentation slides

### Mobile Access
When someone scans the QR code with their phone:
1. They're taken directly to the form
2. Can fill it out on their mobile device
3. Submit instantly
4. No app download required

---

## Form Submissions

### Viewing Submissions
1. Go to `/admin/forms`
2. Click "View Submissions (X)" on any form
3. See all submissions in a table format
4. Click "View Details" to see individual responses

### Exporting Data
1. On the submissions page, click "Export to CSV"
2. Downloads a spreadsheet with all responses
3. Open in Excel, Google Sheets, or any spreadsheet software
4. Use for analysis, reporting, or record-keeping

### Submission Details
Each submission includes:
- Submission ID
- Date and time submitted
- All form field responses
- User information (if authenticated)

---

## Integration with Events

### Linking Forms to Events
1. Create a registration form (or use Event Registration template)
2. Create an event in `/admin/events`
3. Check "Registration Required"
4. Select your registration form from the dropdown
5. Publish both the form and event

### User Experience
1. User views event on public calendar
2. Clicks event to see details
3. Sees "Registration Required" notice
4. Clicks "Register Now" button
5. Redirected to registration form
6. Fills out and submits form
7. Confirmation message displayed

---

## Best Practices

### Events
- Add clear, descriptive titles
- Include complete location information
- Set realistic maximum attendees
- Use high-quality images
- Test registration forms before publishing
- Update event status promptly

### Forms
- Keep forms concise (5-10 fields ideal)
- Use clear, simple language
- Mark required fields appropriately
- Test forms before sharing
- Review submissions regularly
- Export data for backup

### QR Codes
- Test QR codes before printing
- Use high-resolution images for printing
- Include a short URL as backup
- Place QR codes at eye level
- Ensure good lighting for scanning
- Provide WiFi access at events

---

## Troubleshooting

### Form Not Appearing
- Check if form is published
- Verify the URL is correct
- Clear browser cache

### QR Code Not Scanning
- Ensure good lighting
- Hold phone steady
- Try different QR code reader app
- Check if QR code image is clear

### Submissions Not Saving
- Check internet connection
- Verify all required fields are filled
- Try refreshing the page
- Contact administrator if issue persists

---

## Technical Details

### File Structure
```
/app/admin/events/page.tsx          - Event management admin
/app/admin/forms/page.tsx           - Forms management admin
/app/admin/forms/submissions/[formId]/page.tsx - View submissions
/app/calendar/page.tsx              - Public calendar view
/app/forms/public/[formId]/page.tsx - Public form submission
/components/Calendar/EventCalendar.tsx - Calendar component
/types/event.ts                     - Event type definitions
/types/form.ts                      - Form type definitions
/lib/qrcode-utils.ts               - QR code generation utilities
```

### Database Collections
- `calendarEvents` - Event data
- `customForms` - Form configurations
- `formSubmissions` - Form submission data

### Dependencies
- `qrcode` - QR code generation
- `date-fns` - Date formatting and manipulation
- `firebase/firestore` - Database operations

---

## Support

For questions or issues:
1. Check this guide first
2. Review the admin interface tooltips
3. Test in a development environment
4. Contact the technical team

---

**Last Updated**: November 2025
**Version**: 1.0
