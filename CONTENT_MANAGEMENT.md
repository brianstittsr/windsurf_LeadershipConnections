# Content Management System

## Overview
The admin panel now includes a Content Management System (CMS) that allows authorized administrators to edit home page content directly through the admin interface.

## Accessing Content Management

1. **Sign in as an admin user**:
   - Go to `/signin`
   - Use one of the admin email addresses:
     - brianstittsr@gmail.com
     - kathy@ncleadconnect.org
     - gloria@ncleadconnect.org

2. **Navigate to Content Management**:
   - After signing in, you'll be redirected to `/admin/dashboard`
   - Look for "Content Management" section in the left sidebar
   - Click on "Home Page Content"

## Editable Home Page Sections

### 1. Hero Section
Currently, the hero section displays a video background. The hero content fields are prepared for future use if you want to add text overlay on the video.

**Editable Fields:**
- **Subtitle**: Small text above the main title
- **Title**: Main headline
- **Description**: Supporting text
- **Primary Button Text**: Text for the main call-to-action button
- **Primary Button Link**: URL the button links to
- **Secondary Button Text**: Text for the secondary button
- **Secondary Button Link**: URL the secondary button links to

### 2. Call-to-Action (CTA) Section
This section appears at the bottom of the home page with a purple background.

**Editable Fields:**
- **Title**: Main headline (e.g., "Ready to Make a Difference?")
- **Description**: Supporting text explaining the call-to-action
- **Button Text**: Text on the button (e.g., "Get Involved Today")
- **Button Link**: URL the button links to (e.g., "/get-involved")

## How to Edit Content

1. **Navigate to Home Page Content**:
   - Sign in as admin
   - Go to Admin → Content Management → Home Page Content

2. **Edit the fields**:
   - Update any text fields as needed
   - Change button text and links
   - Preview changes mentally or check the live site

3. **Save Changes**:
   - Click the "Save Changes" button at the bottom
   - You'll see a success message when saved
   - Changes appear immediately on the home page

## Technical Details

### Data Storage
- Content is stored in Firestore database
- Collection: `siteContent`
- Document: `homePage`

### Default Content
If no content is found in Firestore, the system uses default content:
- Hero: "Empowering Youth Through Leadership"
- CTA: "Ready to Make a Difference?"

### Real-time Updates
- Changes are fetched from Firestore when the page loads
- No need to rebuild or redeploy the site
- Content updates appear immediately after saving

## Future Enhancements

Potential additions to the CMS:
1. **Testimonials Management**: Edit testimonials shown on home page
2. **Benefits Section**: Edit the interactive benefits cards
3. **About Page Content**: Edit about page text and images
4. **Image Upload**: Upload and manage images through the admin panel
5. **Preview Mode**: Preview changes before publishing
6. **Version History**: Track and revert content changes
7. **Multi-language Support**: Manage content in multiple languages

## Troubleshooting

### Content Not Saving
- Check that you're signed in as an admin user
- Verify Firebase configuration is correct
- Check browser console for errors
- Ensure Firestore security rules allow admin writes

### Content Not Displaying
- Check that Firebase is properly initialized
- Verify the content was saved successfully
- Clear browser cache and reload
- Check browser console for errors

### Access Denied
- Verify your email is in the admin users list (`lib/adminUsers.ts`)
- Make sure you're signed in
- Try logging out and back in

## Security

- Only users with emails in `ADMIN_EMAILS` can access content management
- All content changes are logged with user information
- Firestore security rules should restrict write access to admin users only

## Support

For technical issues or questions about the CMS:
1. Check the browser console for error messages
2. Verify Firebase configuration in `.env.local`
3. Contact the development team for assistance
