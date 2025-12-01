import { StripeConfig, PayPalConfig } from '@/types/payment.types';

// Stripe Configuration
export const stripeConfig: StripeConfig = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '',
  secretKey: process.env.STRIPE_SECRET_KEY ?? '',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET ?? '',
  priceIds: {
    'ai-writing': process.env.STRIPE_PRICE_AI_WRITING ?? '',
    'data-analytics': process.env.STRIPE_PRICE_DATA_ANALYTICS ?? '',
    'grant-writing': process.env.STRIPE_PRICE_GRANT_WRITING ?? '',
    'project-reporting': process.env.STRIPE_PRICE_PROJECT_REPORTING ?? '',
    'everything': process.env.STRIPE_PRICE_EVERYTHING ?? '',
  },
};

// PayPal Configuration
export const paypalConfig: PayPalConfig = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ?? '',
  clientSecret: process.env.PAYPAL_CLIENT_SECRET ?? '',
  mode: (process.env.PAYPAL_MODE as 'sandbox' | 'production') ?? 'sandbox',
  planIds: {
    'ai-writing': process.env.PAYPAL_PLAN_AI_WRITING ?? '',
    'data-analytics': process.env.PAYPAL_PLAN_DATA_ANALYTICS ?? '',
    'grant-writing': process.env.PAYPAL_PLAN_GRANT_WRITING ?? '',
    'project-reporting': process.env.PAYPAL_PLAN_PROJECT_REPORTING ?? '',
    'everything': process.env.PAYPAL_PLAN_EVERYTHING ?? '',
  },
};

// Check if payment providers are configured
export const isStripeConfigured = (): boolean => {
  return !!(stripeConfig.publishableKey && stripeConfig.secretKey);
};

export const isPayPalConfigured = (): boolean => {
  return !!(paypalConfig.clientId && paypalConfig.clientSecret);
};

export const getAvailablePaymentProviders = (): string[] => {
  const providers: string[] = [];
  if (isStripeConfigured()) providers.push('stripe');
  if (isPayPalConfigured()) providers.push('paypal');
  return providers;
};
