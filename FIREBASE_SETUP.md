# Firebase Database Setup Instructions

## Overview
Firebase has been successfully integrated into the Leadership Connections project, providing a comprehensive donor management system with Firestore database connectivity. This document outlines the setup process and available features.

## Setup Steps

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project" or "Add project"
3. Enter project name: `leadership-connections` (or your preferred name)
4. Enable Google Analytics (optional but recommended)
5. Complete project creation

### 2. Enable Firestore Database
1. In your Firebase project, go to **Firestore Database**
2. Click "Create database"
3. Choose **Start in test mode** (for development)
4. Select your preferred location (closest to your users)
5. Click "Done"

### 3. Get Firebase Configuration
1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps" section
3. Click "Web" icon to add a web app
4. Register your app with name: "Leadership Connections Web"
5. Copy the configuration object

### 4. Set Up Authentication (Optional)
1. Go to **Authentication** in Firebase Console
2. Click "Get started"
3. Go to **Sign-in method** tab
4. Enable desired providers (Email/Password, Google, etc.)

### 5. Configure Environment Variables
Create a `.env.local` file in your project root with your Firebase configuration:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here

# Firebase Admin (for server-side operations)
FIREBASE_PRIVATE_KEY="your_private_key_here"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project_id.iam.gserviceaccount.com
```

### 6. Generate Service Account Key (For Admin Operations)
1. Go to **Project Settings** → **Service accounts**
2. Click "Generate new private key"
3. Download the JSON file
4. Copy the `private_key` and `client_email` values to your `.env.local`

## Database Structure

### Collections Created
The Firebase integration includes the following Firestore collections:

#### **donors**
```javascript
{
  id: "auto-generated",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "+1234567890",
  address: {
    street: "123 Main St",
    city: "Anytown",
    state: "CA",
    zip: "12345"
  },
  donorType: "individual", // individual | corporate | foundation
  tags: ["online-donation", "major-donor"],
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### **donations**
```javascript
{
  id: "auto-generated",
  donorId: "donor_document_id",
  amount: 100.00,
  currency: "USD",
  paymentMethod: "stripe",
  stripePaymentId: "pi_1234567890",
  campaignId: "campaign_document_id", // optional
  isRecurring: false,
  frequency: "monthly", // monthly | quarterly | annually
  status: "completed", // pending | completed | failed | refunded
  donationDate: timestamp,
  notes: "Online donation via website",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### **campaigns**
```javascript
{
  id: "auto-generated",
  name: "Annual Fundraising Campaign 2024",
  description: "Supporting leadership development programs",
  goal: 50000.00,
  startDate: timestamp,
  endDate: timestamp,
  type: "general", // general | event | program | emergency
  status: "active", // draft | active | completed | cancelled
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### **communications**
```javascript
{
  id: "auto-generated",
  donorId: "donor_document_id",
  type: "email", // email | phone | mail | meeting | text
  subject: "Thank you for your donation",
  content: "Email content...",
  direction: "outbound", // inbound | outbound
  status: "sent", // sent | delivered | opened | clicked | bounced
  campaignId: "campaign_document_id", // optional
  communicationDate: timestamp,
  createdAt: timestamp
}
```

## API Endpoints

### Donor Management
- `GET /api/donors` - Get all donors (with optional filters)
- `POST /api/donors` - Create new donor
- `GET /api/donors/[id]` - Get specific donor
- `PUT /api/donors/[id]` - Update donor
- `DELETE /api/donors/[id]` - Delete donor

### Donation Management
- `GET /api/donations` - Get donations (with optional filters)
- `POST /api/donations` - Create new donation
- `POST /api/process-donation` - Process completed Stripe payment

### Campaign Management
- `GET /api/campaigns` - Get campaigns
- `POST /api/campaigns` - Create new campaign

## Usage Examples

### Creating a Donor
```javascript
import { DonorService } from '@/lib/firestore';

const newDonor = await DonorService.createDonor({
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane.smith@example.com',
  phone: '+1234567890',
  donorType: 'individual',
  tags: ['website-signup']
});
```

### Recording a Donation
```javascript
import { DonationService } from '@/lib/firestore';

const donation = await DonationService.createDonation({
  donorId: 'donor_id_here',
  amount: 100.00,
  paymentMethod: 'stripe',
  stripePaymentId: 'pi_1234567890',
  status: 'completed'
});
```

### Querying Donations by Donor
```javascript
import { DonationService } from '@/lib/firestore';

const donorDonations = await DonationService.getDonationsByDonor('donor_id_here');
```

## Integration with Existing Donation Form

The donation form has been updated to automatically:
1. Create or find existing donor records
2. Save completed donations to Firestore
3. Link donations to Stripe payment intents
4. Track donation metadata and timestamps

## Security Rules (Recommended)

Add these Firestore security rules in the Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to authenticated users only
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // For development, you can use more permissive rules:
    // match /{document=**} {
    //   allow read, write: if true;
    // }
  }
}
```

## Testing the Integration

### 1. Test Database Connection
```javascript
// In a React component or API route
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

const testConnection = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'donors'));
    console.log('Firebase connected successfully');
    console.log('Donors count:', querySnapshot.size);
  } catch (error) {
    console.error('Firebase connection failed:', error);
  }
};
```

### 2. Test Donation Flow
1. Navigate to `/contact` page
2. Scroll to donation section
3. Select an amount and enter test card: `4242 4242 4242 4242`
4. Complete the donation
5. Check Firebase Console → Firestore Database for new records

## Monitoring and Analytics

### Firebase Console
- Monitor database usage in **Firestore Database**
- View authentication users in **Authentication**
- Check performance in **Performance Monitoring**
- Review crash reports in **Crashlytics**

### Custom Analytics
The system tracks:
- Donation completion rates
- Donor acquisition sources
- Campaign performance
- Communication engagement

## Backup and Security

### Automatic Backups
Firebase automatically backs up your data, but consider:
1. Enabling **Firestore Export** for regular backups
2. Setting up **Cloud Functions** for automated exports
3. Implementing **Security Rules** for data protection

### Data Privacy
- All donor data is encrypted in transit and at rest
- Implement proper access controls
- Consider GDPR compliance for international donors
- Regular security audits recommended

## Troubleshooting

### Common Issues
1. **"Firebase not configured"**: Check environment variables
2. **"Permission denied"**: Update Firestore security rules
3. **"Network error"**: Verify Firebase project settings
4. **"Invalid API key"**: Regenerate keys in Firebase Console

### Debug Mode
Enable Firebase debug logging:
```javascript
import { connectFirestoreEmulator } from 'firebase/firestore';

// For development only
if (process.env.NODE_ENV === 'development') {
  connectFirestoreEmulator(db, 'localhost', 8080);
}
```

## Next Steps

1. **Set up Firebase project** with your configuration
2. **Test the donation flow** with Stripe test cards
3. **Configure security rules** for production
4. **Set up monitoring** and alerts
5. **Plan data migration** from existing systems
6. **Train staff** on new donor management features

## Support Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Getting Started](https://firebase.google.com/docs/firestore/quickstart)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Stripe + Firebase Integration](https://firebase.google.com/docs/use-cases/payments)

---

**Note**: This integration provides the foundation for a comprehensive donor management system. Additional features like email automation, advanced reporting, and volunteer management can be built on this foundation.
