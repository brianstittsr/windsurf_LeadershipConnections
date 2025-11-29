# Payment Integration Setup Guide

## 🎯 Overview

Your Leadership Connections platform now has a complete payment integration system with:
- ✅ **Stripe Integration** - Credit card payments
- ✅ **PayPal Integration** - PayPal payments
- ✅ **Automatic Renewals** - Recurring subscriptions
- ✅ **Self-Service Purchases** - Users can buy subscriptions
- ✅ **Payment History** - Complete transaction tracking
- ✅ **Subscription Management** - User dashboard
- ✅ **Webhook Handlers** - Automatic subscription updates

---

## 📋 Prerequisites

Before setting up payments, you need:

1. **Stripe Account** (for credit card payments)
   - Sign up at: https://stripe.com
   - Get API keys from Dashboard

2. **PayPal Business Account** (for PayPal payments)
   - Sign up at: https://developer.paypal.com
   - Create app for API credentials

3. **Environment Variables** configured
4. **Firestore Collections** created
5. **Webhook Endpoints** configured

---

## 🔧 Step 1: Stripe Setup

### 1.1 Create Stripe Account

1. Go to https://stripe.com
2. Sign up for an account
3. Complete business verification
4. Navigate to **Developers** → **API Keys**

### 1.2 Get API Keys

You'll need:
- **Publishable Key** (starts with `pk_`)
- **Secret Key** (starts with `sk_`)
- **Webhook Secret** (starts with `whsec_`)

### 1.3 Create Products & Prices

In Stripe Dashboard:

1. Go to **Products** → **Add Product**
2. Create 5 products:

**Product 1: AI Writing Package**
- Name: AI Writing Package
- Price: $29.99/month
- Recurring: Monthly
- Copy the Price ID (starts with `price_`)

**Product 2: Data Analytics Package**
- Name: Data Analytics Package
- Price: $49.99/month
- Recurring: Monthly
- Copy the Price ID

**Product 3: Grant Writing Package**
- Name: Grant Writing Package
- Price: $39.99/month
- Recurring: Monthly
- Copy the Price ID

**Product 4: Project Reporting Package**
- Name: Project Reporting Package
- Price: $34.99/month
- Recurring: Monthly
- Copy the Price ID

**Product 5: Everything Package**
- Name: Everything Package
- Price: $99.99/month
- Recurring: Monthly
- Copy the Price ID

### 1.4 Setup Webhook

1. Go to **Developers** → **Webhooks**
2. Click **Add Endpoint**
3. Enter URL: `https://yourdomain.com/api/stripe/webhook`
4. Select events:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.deleted`
   - `customer.subscription.updated`
5. Copy the **Signing Secret**

---

## 💳 Step 2: PayPal Setup

### 2.1 Create PayPal Developer Account

1. Go to https://developer.paypal.com
2. Log in with PayPal account
3. Go to **Dashboard** → **Apps & Credentials**

### 2.2 Create App

1. Click **Create App**
2. App Name: "Leadership Connections"
3. App Type: Merchant
4. Copy:
   - **Client ID**
   - **Secret**

### 2.3 Create Subscription Plans

1. Go to **Products** → **Subscriptions**
2. Create 5 plans matching Stripe products:

**Plan 1: AI Writing Package**
- Name: AI Writing Package
- Billing cycle: Monthly
- Price: $29.99
- Copy the Plan ID

**Plan 2-5:** Repeat for other packages

### 2.4 Set Webhook URL

1. Go to **Webhooks**
2. Add webhook URL: `https://yourdomain.com/api/paypal/webhook`
3. Select all subscription events

---

## 🔐 Step 3: Environment Variables

Add these to your `.env.local` file:

```env
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Stripe Price IDs
STRIPE_PRICE_AI_WRITING=price_xxxxxxxxxxxxx
STRIPE_PRICE_DATA_ANALYTICS=price_xxxxxxxxxxxxx
STRIPE_PRICE_GRANT_WRITING=price_xxxxxxxxxxxxx
STRIPE_PRICE_PROJECT_REPORTING=price_xxxxxxxxxxxxx
STRIPE_PRICE_EVERYTHING=price_xxxxxxxxxxxxx

# PayPal Configuration
NEXT_PUBLIC_PAYPAL_CLIENT_ID=xxxxxxxxxxxxx
PAYPAL_CLIENT_SECRET=xxxxxxxxxxxxx
PAYPAL_MODE=sandbox  # Change to 'production' for live

# PayPal Plan IDs
PAYPAL_PLAN_AI_WRITING=P-xxxxxxxxxxxxx
PAYPAL_PLAN_DATA_ANALYTICS=P-xxxxxxxxxxxxx
PAYPAL_PLAN_GRANT_WRITING=P-xxxxxxxxxxxxx
PAYPAL_PLAN_PROJECT_REPORTING=P-xxxxxxxxxxxxx
PAYPAL_PLAN_EVERYTHING=P-xxxxxxxxxxxxx

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000  # Change for production
```

---

## 🗄️ Step 4: Firestore Collections

The system uses these collections (automatically created):

### Collection: `paymentTransactions`
```javascript
{
  id: "auto-generated",
  userId: "user-uid",
  userEmail: "user@example.com",
  userName: "John Doe",
  subscriptionId: "sub_xxxxx",
  package: "ai-writing",
  amount: 29.99,
  currency: "USD",
  provider: "stripe",
  paymentMethod: "card",
  status: "completed",
  transactionId: "pi_xxxxx",
  invoiceId: "in_xxxxx",
  receiptUrl: "https://...",
  description: "AI Writing Package - Monthly Subscription",
  createdAt: Timestamp,
  updatedAt: Timestamp,
  completedAt: Timestamp
}
```

### Collection: `autoRenewalSettings`
```javascript
{
  id: "auto-generated",
  userId: "user-uid",
  subscriptionId: "sub-id",
  enabled: true,
  provider: "stripe",
  paymentMethodId: "pm_xxxxx",
  nextRenewalDate: Timestamp,
  lastRenewalDate: Timestamp,
  failedAttempts: 0,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Updated: `userSubscriptions`
```javascript
{
  // ... existing fields ...
  stripeSubscriptionId: "sub_xxxxx",  // NEW
  stripeCustomerId: "cus_xxxxx",      // NEW
  paypalSubscriptionId: "I-xxxxx",    // NEW
}
```

---

## 🚀 Step 5: Install Dependencies

```bash
npm install stripe @paypal/checkout-server-sdk
```

Or:

```bash
yarn add stripe @paypal/checkout-server-sdk
```

---

## 🧪 Step 6: Testing

### Test Mode

Both Stripe and PayPal have test modes:

**Stripe Test Cards:**
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Requires Auth: `4000 0025 0000 3155`

**PayPal Sandbox:**
- Use sandbox accounts from PayPal Developer Dashboard
- Test buyer and seller accounts

### Test Webhooks Locally

Use Stripe CLI:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Use ngrok for PayPal:
```bash
ngrok http 3000
```

---

## 🌐 Step 7: User Flow

### Self-Service Purchase Flow:

1. **Browse Plans**
   - User visits `/subscriptions`
   - Views all 5 subscription packages
   - Compares features

2. **Select Package**
   - Clicks "Get Started"
   - Chooses payment method (Stripe or PayPal)

3. **Checkout**
   - Redirected to `/subscriptions/checkout`
   - Reviews order summary
   - Clicks "Pay"

4. **Payment Processing**
   - Stripe: Redirected to Stripe Checkout
   - PayPal: Redirected to PayPal
   - Enters payment details

5. **Confirmation**
   - Redirected back to success page
   - Subscription activated immediately
   - Receives confirmation email (if configured)

6. **Access Features**
   - Features unlocked automatically
   - Can use AI tools, data features, etc.

---

## 👤 Step 8: User Management

### Subscription Dashboard

Users can manage subscriptions at `/subscriptions/manage`:

**Features:**
- View active subscriptions
- See days remaining
- Toggle auto-renewal on/off
- Cancel subscriptions
- Upgrade/downgrade plans
- View payment history
- Download invoices

### Auto-Renewal

**How it works:**
1. User subscribes with auto-renewal enabled
2. Stripe/PayPal charges automatically each month
3. Webhook updates subscription end date
4. User receives invoice
5. Continues uninterrupted access

**If payment fails:**
1. Webhook receives failure event
2. System logs failed payment
3. User notified (if email configured)
4. Retry attempts made automatically
5. Subscription cancelled after max retries

---

## 🔔 Step 9: Webhook Events

### Stripe Webhooks

**checkout.session.completed**
- Creates new subscription
- Activates features
- Records payment transaction

**invoice.payment_succeeded**
- Extends subscription end date
- Records renewal payment
- Updates payment history

**invoice.payment_failed**
- Logs failed payment
- Increments failure count
- Triggers notification

**customer.subscription.deleted**
- Cancels subscription
- Removes feature access
- Updates status

**customer.subscription.updated**
- Updates subscription status
- Syncs changes from Stripe

### PayPal Webhooks

Similar events for PayPal subscriptions

---

## 💰 Step 10: Revenue Tracking

### Admin Dashboard

View revenue metrics:
- Total revenue
- Monthly recurring revenue (MRR)
- Active subscriptions count
- Churn rate
- Popular packages

### Reports

Generate reports:
- Revenue by package
- Payment success/failure rates
- Subscription growth
- Customer lifetime value

---

## 🔒 Step 11: Security

### Best Practices:

1. **Never expose secret keys**
   - Keep in `.env.local`
   - Never commit to Git
   - Use environment variables

2. **Verify webhook signatures**
   - Already implemented
   - Prevents fake webhooks

3. **Use HTTPS in production**
   - Required for Stripe/PayPal
   - Protects payment data

4. **PCI Compliance**
   - Stripe handles card data
   - You never touch card numbers
   - Reduces compliance burden

5. **Test thoroughly**
   - Use test mode first
   - Test all scenarios
   - Verify webhooks work

---

## 📊 Step 12: Firestore Rules

Already configured in `firestore.rules`:

```javascript
// Payment Transactions - users can read their own
match /paymentTransactions/{transactionId} {
  allow read: if isAuthenticated() && 
    (request.auth.uid == resource.data.userId || isAdmin());
  allow create, update, delete: if isAdmin();
  allow list: if isAdmin();
}

// Auto-Renewal Settings - users can manage their own
match /autoRenewalSettings/{settingId} {
  allow read, update: if isAuthenticated() && 
    request.auth.uid == resource.data.userId;
  allow create, delete: if isAdmin();
  allow list: if isAdmin();
}
```

---

## 🎨 Step 13: Customization

### Branding

Customize Stripe Checkout:
1. Go to Stripe Dashboard → **Settings** → **Branding**
2. Upload logo
3. Set brand colors
4. Customize email templates

### Email Notifications

Configure email notifications:
1. Stripe: **Settings** → **Emails**
2. PayPal: **Account Settings** → **Notifications**

### Custom Domain

Use custom domain for checkout:
1. Stripe: Configure in settings
2. PayPal: Set return URLs

---

## 🚨 Troubleshooting

### Common Issues:

**1. Webhook not receiving events**
- Check webhook URL is correct
- Verify endpoint is publicly accessible
- Check webhook signature verification
- Review webhook logs in Stripe/PayPal dashboard

**2. Payment fails**
- Check API keys are correct
- Verify test/live mode matches
- Check product/price IDs are correct
- Review error logs

**3. Subscription not activating**
- Check webhook handler is working
- Verify Firestore rules allow writes
- Check user ID matches
- Review server logs

**4. Auto-renewal not working**
- Verify webhook events are received
- Check subscription status in Stripe/PayPal
- Confirm payment method is valid
- Review renewal settings

---

## 📱 Step 14: Mobile Support

The payment system is fully responsive:
- Mobile-optimized checkout
- Touch-friendly UI
- Apple Pay support (Stripe)
- Google Pay support (Stripe)

---

## 🌍 Step 15: International Support

### Multi-Currency

Enable in Stripe:
1. **Settings** → **Payment Methods**
2. Enable currencies
3. Set conversion rates

### Tax Calculation

Stripe Tax:
1. Enable Stripe Tax
2. Configure tax rates
3. Automatic calculation

---

## 📈 Step 16: Analytics

### Track Metrics:

- Conversion rate
- Average order value
- Customer acquisition cost
- Lifetime value
- Churn rate
- MRR growth

### Integration:

- Google Analytics
- Mixpanel
- Segment
- Custom dashboard

---

## ✅ Checklist

Before going live:

- [ ] Stripe account verified
- [ ] PayPal account verified
- [ ] All products/plans created
- [ ] Environment variables set
- [ ] Webhooks configured
- [ ] Test purchases completed
- [ ] Refund process tested
- [ ] Email notifications working
- [ ] Terms of Service updated
- [ ] Privacy Policy updated
- [ ] Support email configured
- [ ] SSL certificate installed
- [ ] Backup system in place
- [ ] Monitoring configured

---

## 🆘 Support

### Resources:

- **Stripe Docs**: https://stripe.com/docs
- **PayPal Docs**: https://developer.paypal.com/docs
- **Stripe Support**: https://support.stripe.com
- **PayPal Support**: https://www.paypal.com/us/smarthelp/contact-us

### Contact:

For technical issues with the integration:
- Check server logs
- Review Firestore console
- Test webhooks
- Contact system administrator

---

## 🎉 You're Ready!

Your payment system is now fully configured with:
- ✅ Stripe credit card payments
- ✅ PayPal payments
- ✅ Automatic recurring billing
- ✅ Self-service subscription management
- ✅ Complete payment history
- ✅ Webhook automation
- ✅ Secure payment processing

Users can now purchase subscriptions and access premium features!

---

**Last Updated**: November 29, 2025
**Version**: 1.0
**System**: Leadership Connections Payment Integration
