import { Timestamp } from 'firebase/firestore';
import { SubscriptionPackage } from './subscription.types';

export type PaymentProvider = 'stripe' | 'paypal' | 'manual';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
export type PaymentMethod = 'card' | 'paypal' | 'bank_transfer' | 'other';

export interface PaymentTransaction {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  subscriptionId: string;
  package: SubscriptionPackage;
  amount: number;
  currency: string;
  provider: PaymentProvider;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string; // Stripe/PayPal transaction ID
  invoiceId?: string;
  receiptUrl?: string;
  description: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  refundedAt?: Date;
  refundAmount?: number;
  refundReason?: string;
}

export interface StripeConfig {
  publishableKey: string;
  secretKey: string;
  webhookSecret: string;
  priceIds: Record<SubscriptionPackage, string>;
}

export interface PayPalConfig {
  clientId: string;
  clientSecret: string;
  mode: 'sandbox' | 'production';
  planIds: Record<SubscriptionPackage, string>;
}

export interface PaymentIntent {
  id: string;
  userId: string;
  package: SubscriptionPackage;
  amount: number;
  currency: string;
  provider: PaymentProvider;
  clientSecret?: string; // For Stripe
  orderId?: string; // For PayPal
  status: 'created' | 'processing' | 'succeeded' | 'failed';
  createdAt: Date;
  expiresAt: Date;
}

export interface AutoRenewalSettings {
  id: string;
  userId: string;
  subscriptionId: string;
  enabled: boolean;
  provider: PaymentProvider;
  paymentMethodId?: string; // Stripe payment method ID
  paypalSubscriptionId?: string; // PayPal subscription ID
  nextRenewalDate: Date;
  lastRenewalDate?: Date;
  failedAttempts: number;
  lastFailureReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentMethodInfo {
  id: string;
  userId: string;
  provider: PaymentProvider;
  type: PaymentMethod;
  last4?: string; // Last 4 digits of card
  brand?: string; // Visa, Mastercard, etc.
  expiryMonth?: number;
  expiryYear?: number;
  email?: string; // For PayPal
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  id: string;
  userId: string;
  userEmail: string;
  subscriptionId: string;
  transactionId: string;
  invoiceNumber: string;
  package: SubscriptionPackage;
  amount: number;
  currency: string;
  tax?: number;
  total: number;
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  dueDate: Date;
  paidAt?: Date;
  pdfUrl?: string;
  createdAt: Date;
}

export interface RefundRequest {
  id: string;
  transactionId: string;
  userId: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requestedBy: string;
  requestedAt: Date;
  processedBy?: string;
  processedAt?: Date;
  notes?: string;
}

// Helper functions
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

export function getPaymentStatusColor(status: PaymentStatus): string {
  switch (status) {
    case 'completed':
      return 'green';
    case 'pending':
      return 'yellow';
    case 'failed':
      return 'red';
    case 'refunded':
      return 'orange';
    case 'cancelled':
      return 'gray';
    default:
      return 'gray';
  }
}

export function getPaymentStatusLabel(status: PaymentStatus): string {
  switch (status) {
    case 'completed':
      return 'Completed';
    case 'pending':
      return 'Pending';
    case 'failed':
      return 'Failed';
    case 'refunded':
      return 'Refunded';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
}
