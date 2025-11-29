import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripeConfig } from '@/lib/payment-config';
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, doc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { SUBSCRIPTION_PACKAGES } from '@/types/subscription.types';

const stripe = new Stripe(stripeConfig.secretKey, {
  apiVersion: '2025-08-27.basil',
});

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      stripeConfig.webhookSecret
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { userId, packageId } = session.metadata || {};
  
  if (!userId || !packageId) {
    console.error('Missing metadata in checkout session');
    return;
  }

  const pkg = SUBSCRIPTION_PACKAGES.find(p => p.id === packageId);
  if (!pkg) return;

  // Create subscription
  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription

  await addDoc(collection(db, 'userSubscriptions'), {
    userId,
    userEmail: session.customer_email,
    userName: session.customer_email,
    package: packageId,
    status: 'active',
    startDate: Timestamp.fromDate(startDate),
    endDate: Timestamp.fromDate(endDate),
    autoRenew: true,
    features: pkg.features,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    stripeSubscriptionId: session.subscription,
    stripeCustomerId: session.customer,
  });

  // Create payment transaction
  await addDoc(collection(db, 'paymentTransactions'), {
    userId,
    userEmail: session.customer_email || '',
    userName: session.customer_email || '',
    subscriptionId: session.subscription,
    package: packageId,
    amount: (session.amount_total || 0) / 100,
    currency: session.currency?.toUpperCase() || 'USD',
    provider: 'stripe',
    paymentMethod: 'card',
    status: 'completed',
    transactionId: session.payment_intent,
    description: `${pkg.name} - Monthly Subscription`,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    completedAt: Timestamp.now(),
  });
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const metadata = (invoice as any).subscription_details?.metadata || {};
  const { userId, packageId } = metadata;
  
  if (!userId || !packageId) return;

  const pkg = SUBSCRIPTION_PACKAGES.find(p => p.id === packageId);
  if (!pkg) return;

  // Create payment transaction for renewal
  await addDoc(collection(db, 'paymentTransactions'), {
    userId,
    userEmail: invoice.customer_email || '',
    userName: invoice.customer_email || '',
    subscriptionId: (invoice as any).subscription || '',
    package: packageId,
    amount: (invoice.amount_paid || 0) / 100,
    currency: invoice.currency?.toUpperCase() || 'USD',
    provider: 'stripe',
    paymentMethod: 'card',
    status: 'completed',
    transactionId: (invoice as any).payment_intent || '',
    invoiceId: invoice.id,
    receiptUrl: invoice.hosted_invoice_url || undefined,
    description: `${pkg.name} - Renewal`,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    completedAt: Timestamp.now(),
  });

  // Extend subscription
  const q = query(
    collection(db, 'userSubscriptions'),
    where('userId', '==', userId),
    where('stripeSubscriptionId', '==', (invoice as any).subscription)
  );
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    const subDoc = querySnapshot.docs[0];
    const currentEndDate = subDoc.data().endDate?.toDate() || new Date();
    const newEndDate = new Date(currentEndDate);
    newEndDate.setMonth(newEndDate.getMonth() + 1);

    await updateDoc(doc(db, 'userSubscriptions', subDoc.id), {
      endDate: Timestamp.fromDate(newEndDate),
      updatedAt: Timestamp.now(),
    });
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const metadata = (invoice as any).subscription_details?.metadata || {};
  const { userId } = metadata;
  
  if (!userId) return;

  // Log failed payment
  await addDoc(collection(db, 'paymentTransactions'), {
    userId,
    userEmail: invoice.customer_email || '',
    userName: invoice.customer_email || '',
    subscriptionId: (invoice as any).subscription || '',
    package: '',
    amount: (invoice.amount_due || 0) / 100,
    currency: invoice.currency?.toUpperCase() || 'USD',
    provider: 'stripe',
    paymentMethod: 'card',
    status: 'failed',
    transactionId: (invoice as any).payment_intent || '',
    description: 'Payment Failed',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const { userId } = subscription.metadata || {};
  
  if (!userId) return;

  // Cancel subscription in database
  const q = query(
    collection(db, 'userSubscriptions'),
    where('userId', '==', userId),
    where('stripeSubscriptionId', '==', subscription.id)
  );
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    const subDoc = querySnapshot.docs[0];
    await updateDoc(doc(db, 'userSubscriptions', subDoc.id), {
      status: 'cancelled',
      updatedAt: Timestamp.now(),
    });
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const { userId } = subscription.metadata || {};
  
  if (!userId) return;

  // Update subscription status
  const q = query(
    collection(db, 'userSubscriptions'),
    where('userId', '==', userId),
    where('stripeSubscriptionId', '==', subscription.id)
  );
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    const subDoc = querySnapshot.docs[0];
    await updateDoc(doc(db, 'userSubscriptions', subDoc.id), {
      status: subscription.status === 'active' ? 'active' : 'cancelled',
      updatedAt: Timestamp.now(),
    });
  }
}
