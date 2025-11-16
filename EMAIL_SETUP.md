# Email Setup for Contact Form

## Overview
The contact form now sends emails to multiple admin addresses when a submission is received. The system uses Nodemailer with Gmail SMTP.

## Required Environment Variables

Add these to your `.env.local` file:

```env
EMAIL_USER=your-gmail-address@gmail.com
EMAIL_PASSWORD=your-app-password
```

## Gmail Setup Instructions

### 1. Enable 2-Factor Authentication
- Go to your Google Account settings
- Enable 2-Factor Authentication if not already enabled

### 2. Generate App Password
- Go to Google Account > Security > 2-Step Verification > App passwords
- Select "Mail" and generate a password
- Use this password (not your regular Gmail password) as `EMAIL_PASSWORD`

### 3. Alternative: Use OAuth2 (Recommended for Production)
For production environments, consider using OAuth2 instead of app passwords:

```javascript
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
});
```

## Email Recipients

The system sends emails to these addresses:
- brianstittsr@gmail.com
- kathy@ncleadconnect.org
- gloria@ncleadconnect.org
- katherineharrelson527@gmail.com
- gloria4god11@gmail.com

## Features

### Contact Form
- **Program Selection**: Dropdown with predefined programs
- **Other Field**: Appears when "Other" is selected
- **Form Validation**: Required fields validation
- **Success/Error Messages**: User feedback
- **Loading States**: Prevents double submission

### Database Storage
- **Firestore Collection**: `contactSubmissions`
- **Fields**: name, email, program, otherProgram, message, createdAt, status
- **Status Tracking**: new, reviewed, responded

### Admin Interface
- **View All Submissions**: Sorted by date (newest first)
- **Status Management**: Update submission status
- **Email Links**: Click to reply directly
- **Delete Function**: Remove submissions
- **Real-time Updates**: Changes reflect immediately

### Email Notifications
- **Automatic Sending**: Emails sent on form submission
- **Rich HTML Format**: Formatted email with all details
- **Reply-To Header**: Set to submitter's email for easy replies
- **Submission ID**: Included for tracking

## Security

### Firestore Rules
```javascript
// Contact submissions - anyone can create, admins can read all
match /contactSubmissions/{document=**} {
  allow read: if isAdmin();
  allow create: if true;
  allow update, delete: if isAdmin();
}
```

### Admin Access
Only users with admin email addresses can:
- View contact submissions
- Update submission status
- Delete submissions

## Troubleshooting

### Email Not Sending
1. Check environment variables are set correctly
2. Verify Gmail app password is correct
3. Ensure 2FA is enabled on Gmail account
4. Check server logs for specific error messages

### Form Not Submitting
1. Check browser console for JavaScript errors
2. Verify API route is accessible
3. Check Firestore permissions
4. Ensure all required fields are filled

### Admin Page Not Loading
1. Verify user is logged in with admin email
2. Check Firestore security rules are deployed
3. Ensure admin email is in the approved list

## Testing

### Test Form Submission
1. Fill out the contact form on `/get-involved`
2. Check that success message appears
3. Verify email is received by admin addresses
4. Check submission appears in admin panel

### Test Admin Functions
1. Log in as admin user
2. Navigate to `/admin/contact-submissions`
3. Verify submissions are visible
4. Test status updates and deletion

## Deployment Notes

### Environment Variables
Ensure these are set in your deployment environment:
- `EMAIL_USER`
- `EMAIL_PASSWORD`

### Firestore Rules
Deploy the updated firestore.rules:
```bash
firebase deploy --only firestore:rules
```

### Dependencies
The following packages are required:
- `nodemailer`
- `@types/nodemailer`
