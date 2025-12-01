import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripeConfig } from '@/lib/payment-config';

// Initialize Stripe only if configured
let stripe: Stripe | null = null;
if (stripeConfig.secretKey) {
  stripe = new Stripe(stripeConfig.secretKey, {
    apiVersion: '2025-08-27.basil',
  });
}

export async function POST(request: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!stripe || !stripeConfig.publishableKey) {
      return NextResponse.json(
        { error: 'Stripe is not configured' },
        { status: 503 }
      );
    }

    const { packageId, userId, userEmail } = await request.json();

    if (!packageId || !userId || !userEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get price ID for the package
    const priceId = stripeConfig.priceIds[packageId as keyof typeof stripeConfig.priceIds];
    
    if (!priceId) {
      return NextResponse.json(
        { error: 'Invalid package selected' },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: userEmail,
      metadata: {
        userId,
        packageId,
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscriptions/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscriptions/checkout?package=${packageId}&provider=stripe`,
      subscription_data: {
        metadata: {
          userId,
          packageId,
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
