# Subscription Management System Guide

## 📋 Overview

The Leadership Connections platform now has a comprehensive subscription management system that allows you to control access to premium features through subscription packages.

---

## 🎯 How to Access Subscription Management

### For SuperAdmin:

1. **Log in** to your account
2. Navigate to **Admin Section**
3. Click on **"Subscriptions"** in the admin menu
4. You'll see the Subscription Management page

**Direct URL**: `http://localhost:3000/admin/subscriptions`

---

## 📦 Available Subscription Packages

### 1. **AI Writing Package** - $29.99/month
**Features Included:**
- ✅ AI Text Enhancement (for events, grants, communications)
- ✅ Grant Templates

**Best For:** Organizations focused on content creation and grant writing

---

### 2. **Data Analytics Package** - $49.99/month
**Features Included:**
- ✅ AI Data Merge
- ✅ AI Reporting
- ✅ AI Data Analysis
- ✅ Data Export
- ✅ Data Archive

**Best For:** Organizations with extensive data management needs

---

### 3. **Grant Writing Package** - $39.99/month
**Features Included:**
- ✅ Grant Templates
- ✅ AI Grant Writer
- ✅ AI Text Enhancement

**Best For:** Nonprofits focused on grant applications

---

### 4. **Project Reporting Package** - $34.99/month
**Features Included:**
- ✅ Project Tracking
- ✅ Automated Reports
- ✅ AI Reporting

**Best For:** Organizations managing multiple projects

---

### 5. **Everything Package** - $99.99/month ⭐ POPULAR
**Features Included:**
- ✅ **ALL FEATURES** from all packages
- ✅ Best value for comprehensive needs

**Best For:** Organizations wanting full platform access

---

## 🎁 How to Grant Subscriptions to Members

### Step-by-Step Process:

1. **Navigate to Subscription Management**
   - Go to `/admin/subscriptions`

2. **Click "Grant Subscription" Button**
   - Located in the top-right corner

3. **Select User**
   - Choose from dropdown list of users
   - SuperAdmin users are excluded (they have all features by default)

4. **Select Package**
   - Choose one of the 5 subscription packages
   - View included features in the modal

5. **Set Duration**
   - Enter number of days (default: 30)
   - See expiration date preview

6. **Click "Grant Subscription"**
   - Subscription is immediately active
   - User can now access all features in that package

---

## 👥 How to Enable Features for Specific Members

### Individual User Subscriptions:

**Option 1: Grant Single Package**
```
1. Go to Subscriptions page
2. Click "Grant Subscription"
3. Select specific user
4. Choose appropriate package
5. Set duration
6. Confirm
```

**Option 2: Grant Multiple Packages**
```
You can grant multiple packages to the same user:
1. Grant first package (e.g., AI Writing)
2. Grant second package (e.g., Data Analytics)
3. User will have features from BOTH packages
```

---

## 🌐 How to Enable Features for ALL Members

### Bulk Subscription Options:

**Option 1: Manual Grant (Current System)**
```
1. Go to Subscriptions page
2. For each user:
   - Click "Grant Subscription"
   - Select user
   - Choose "Everything Package"
   - Set duration
   - Confirm
```

**Option 2: Future Enhancement (Recommended)**
Create a "Grant to All Users" feature:
- Add button: "Grant to All SuperUsers"
- Select package
- Set duration
- Automatically creates subscriptions for all eligible users

---

## 🔍 How to View Active Subscriptions

### Subscription List View:

The main subscriptions page shows:
- **User Information**: Name and email
- **Package**: Which subscription package
- **Status**: Active, Expired, or Cancelled
- **Duration**: Days remaining until expiration
- **Features**: Number of features included
- **Actions**: Extend, Cancel, or Delete

### Filter Options:
- **All Subscriptions**: View everything
- **Active Only**: Currently active subscriptions
- **Expired Only**: Past expiration date
- **Cancelled Only**: Manually cancelled subscriptions

---

## ⚙️ Subscription Management Actions

### Extend Subscription:
```
1. Find subscription in list
2. Click "+" (Plus) icon
3. Enter number of days to extend
4. Confirm
```

### Cancel Subscription:
```
1. Find active subscription
2. Click "×" (Cancel) icon
3. Confirm cancellation
4. Status changes to "Cancelled"
```

### Delete Subscription:
```
1. Find subscription
2. Click trash icon
3. Confirm deletion
4. Permanently removes subscription record
```

---

## 🔐 Where Features Are Used

### AI Text Enhancement:
- **Location**: Event Calendar Management
- **Feature**: "Enhance with AI" button on event descriptions
- **Access**: Requires `ai-text-enhancement` feature

### Geocoding:
- **Location**: Event Calendar Management
- **Feature**: "Get Coordinates" button
- **Access**: Requires `geocoding` feature

### AI Data Features:
- **Location**: DataHub Dataset Detail Pages
- **Features**:
  - AI Data Merge
  - AI Reporting
  - AI Data Analysis
- **Access**: Requires respective feature subscriptions

---

## 💡 Feature Access Logic

### SuperAdmin:
```
✅ Has access to ALL features automatically
✅ No subscription required
✅ Cannot be restricted
```

### SuperUser:
```
🔒 Requires subscription for premium features
✅ Can be granted individual packages
✅ Can have multiple packages simultaneously
⏰ Subscriptions expire after set duration
```

### Regular User:
```
❌ No access to premium features
📝 Can view but not use subscription features
```

---

## 🎨 User Experience

### When User Has Subscription:
- Feature buttons are **enabled**
- No lock icon displayed
- Full access to functionality

### When User Lacks Subscription:
- Feature buttons show **lock icon** 🔒
- Clicking opens subscription modal
- Modal explains feature benefits
- "Request Access" button available

---

## 📊 Subscription Status Badges

### Active (Green):
- Subscription is currently valid
- End date is in the future
- User has full access

### Expired (Gray):
- End date has passed
- User loses access to features
- Can be extended or renewed

### Cancelled (Red):
- Manually cancelled by admin
- User loses access immediately
- Can be deleted or reactivated

---

## 🔄 Subscription Workflow

```
1. Admin grants subscription
   ↓
2. Record created in Firestore
   ↓
3. User logs in
   ↓
4. useSubscription hook fetches active subscriptions
   ↓
5. Features check subscription status
   ↓
6. Access granted or denied based on features
```

---

## 🗄️ Database Structure

### Firestore Collection: `userSubscriptions`

**Document Structure:**
```javascript
{
  id: "auto-generated",
  userId: "user-uid",
  userEmail: "user@example.com",
  userName: "John Doe",
  package: "ai-writing",
  status: "active",
  startDate: Timestamp,
  endDate: Timestamp,
  autoRenew: false,
  features: ["ai-text-enhancement", "grant-templates"],
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## 🛡️ Security Rules

### Firestore Rules:
```javascript
// Users can read their own subscriptions
// Only admins can create, update, or delete
match /userSubscriptions/{subscriptionId} {
  allow read: if isAuthenticated() && 
    (request.auth.uid == resource.data.userId || isAdmin());
  allow create, update, delete: if isAdmin();
  allow list: if isAdmin();
}
```

---

## 🔧 Technical Implementation

### Hook Usage:
```typescript
import { useSubscription } from '@/hooks/useSubscription';

const { hasFeature, hasAnyFeature } = useSubscription();

// Check single feature
if (hasFeature('ai-text-enhancement')) {
  // Enable feature
}

// Check multiple features
if (hasAnyFeature(['ai-data-merge', 'ai-reporting'])) {
  // Enable features
}
```

---

## 📈 Future Enhancements

### Recommended Additions:

1. **Payment Integration**
   - Stripe or PayPal integration
   - Automatic subscription renewal
   - Payment history

2. **Self-Service Portal**
   - Users can purchase subscriptions
   - Upgrade/downgrade packages
   - View billing history

3. **Usage Analytics**
   - Track feature usage per user
   - Generate usage reports
   - Optimize pricing

4. **Email Notifications**
   - Subscription granted
   - Expiration warnings (7 days, 1 day)
   - Renewal reminders

5. **Bulk Operations**
   - Grant to all users at once
   - Export subscription list
   - Import subscriptions from CSV

---

## 🆘 Troubleshooting

### User Can't See Feature:
1. Check if subscription is active
2. Verify end date hasn't passed
3. Confirm correct package includes feature
4. Check user role (must be SuperUser or SuperAdmin)

### Subscription Not Working:
1. Verify Firestore rules are deployed
2. Check browser console for errors
3. Ensure user is logged in
4. Refresh subscription data

### Feature Still Locked:
1. Clear browser cache
2. Log out and log back in
3. Check subscription status in admin panel
4. Verify feature ID matches in code

---

## 📞 Support

For technical issues or questions:
- Check Firestore console for subscription records
- Review browser console for errors
- Verify user authentication status
- Contact system administrator

---

## ✅ Quick Reference

### Grant Subscription:
`Admin → Subscriptions → Grant Subscription → Select User → Choose Package → Set Duration → Confirm`

### View Subscriptions:
`Admin → Subscriptions → Filter by status`

### Extend Subscription:
`Find subscription → Click + icon → Enter days → Confirm`

### Check User Access:
`View subscription list → Find user → Check status and features`

---

**Last Updated**: November 29, 2025
**Version**: 1.0
**System**: Leadership Connections Platform
