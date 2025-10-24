# Stripe Donation Setup Instructions

## Overview
The donation functionality has been successfully integrated into the Contact & Support page using Stripe payment processing. To enable live donations, you need to configure your Stripe API keys.

## Setup Steps

### 1. Create a Stripe Account
1. Go to [https://stripe.com](https://stripe.com)
2. Sign up for a free Stripe account
3. Complete the account verification process

### 2. Get Your API Keys
1. Log into your Stripe Dashboard: [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Navigate to **Developers** → **API keys**
3. Copy your **Publishable key** (starts with `pk_test_` for test mode)
4. Copy your **Secret key** (starts with `sk_test_` for test mode)

### 3. Configure Environment Variables
1. Create a `.env.local` file in your project root (if it doesn't exist)
2. Add your Stripe keys:

```bash
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_actual_secret_key_here
```

**Important:** 
- Never commit `.env.local` to version control (it's already in `.gitignore`)
- The `NEXT_PUBLIC_` prefix makes the publishable key available to the client-side code
- Keep your secret key secure and never expose it in client-side code

### 4. Test the Donation Form
1. Start your development server: `npm run dev`
2. Navigate to the Contact & Support page: `http://localhost:3000/contact`
3. Scroll down to the "Support Our Mission" section
4. Test with Stripe's test card numbers:
   - **Success:** `4242 4242 4242 4242`
   - **Declined:** `4000 0000 0000 0002`
   - Use any future expiry date and any 3-digit CVC

### 5. Production Setup
When ready for live donations:
1. Activate your Stripe account in the dashboard
2. Replace test keys with live keys (starting with `pk_live_` and `sk_live_`)
3. Set up webhooks for payment confirmations (optional but recommended)

## Features Included

### Donation Form Features
- ✅ Predefined donation amounts ($25, $50, $100, $250, $500)
- ✅ Custom donation amount input
- ✅ Secure Stripe card element
- ✅ Real-time payment processing
- ✅ Success confirmation with thank you message
- ✅ Error handling and user feedback
- ✅ Mobile-responsive design
- ✅ Security indicators for user trust

### Technical Implementation
- ✅ Next.js API route for payment intent creation
- ✅ Stripe Elements for secure card input
- ✅ Client-side and server-side error handling
- ✅ TypeScript support throughout
- ✅ Tailwind CSS styling matching your site theme

## Troubleshooting

### Common Issues
1. **"Stripe is not configured" error**: Make sure your `.env.local` file has the correct API keys
2. **Payment form not loading**: Check that `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set correctly
3. **500 error on payment**: Verify your `STRIPE_SECRET_KEY` is valid and has the correct permissions

### Support
- Stripe Documentation: [https://stripe.com/docs](https://stripe.com/docs)
- Stripe Test Cards: [https://stripe.com/docs/testing#cards](https://stripe.com/docs/testing#cards)

## Security Notes
- All payment data is handled securely by Stripe - no sensitive card information touches your servers
- PCI compliance is handled by Stripe
- All communications are encrypted with HTTPS
- Environment variables keep your secret keys secure
