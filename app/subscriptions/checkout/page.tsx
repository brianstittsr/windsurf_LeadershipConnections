'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { SUBSCRIPTION_PACKAGES, SubscriptionPackage } from '@/types/subscription.types';
import { PaymentProvider } from '@/types/payment.types';
import { FaLock, FaCheck, FaCreditCard, FaPaypal } from 'react-icons/fa';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const packageId = searchParams.get('package') as SubscriptionPackage;
  const provider = searchParams.get('provider') as PaymentProvider || 'stripe';
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const selectedPackage = SUBSCRIPTION_PACKAGES.find(p => p.id === packageId);

  useEffect(() => {
    if (!user) {
      router.push('/signin?redirect=/subscriptions');
    }
    if (!selectedPackage) {
      router.push('/subscriptions');
    }
  }, [user, selectedPackage, router]);

  const handleStripeCheckout = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Call API to create Stripe checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId,
          userId: user?.uid,
          userEmail: user?.email,
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        return;
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Stripe checkout error:', err);
      setError('Failed to initialize payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayPalCheckout = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Call API to create PayPal order
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId,
          userId: user?.uid,
          userEmail: user?.email,
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        return;
      }

      // Redirect to PayPal
      if (data.approvalUrl) {
        window.location.href = data.approvalUrl;
      }
    } catch (err) {
      console.error('PayPal checkout error:', err);
      setError('Failed to initialize payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    if (provider === 'stripe') {
      handleStripeCheckout();
    } else if (provider === 'paypal') {
      handlePayPalCheckout();
    }
  };

  if (!selectedPackage) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-blue-600 p-8 text-white">
            <h1 className="text-3xl font-bold mb-2">Complete Your Purchase</h1>
            <p className="text-blue-100">You're one step away from unlocking premium features</p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Order Summary */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{selectedPackage.name}</h3>
                      <p className="text-sm text-gray-600">{selectedPackage.description}</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">${selectedPackage.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Tax</span>
                      <span className="text-gray-900">$0.00</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200">
                      <span>Total</span>
                      <span className="text-primary">${selectedPackage.price.toFixed(2)}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500">
                    Billed {selectedPackage.billingPeriod}. Cancel anytime.
                  </p>
                </div>

                {/* Features */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">What's Included:</h3>
                  <div className="space-y-2">
                    {selectedPackage.features.slice(0, 5).map((featureId) => (
                      <div key={featureId} className="flex items-center gap-2 text-sm">
                        <FaCheck className="text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">
                          {featureId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </span>
                      </div>
                    ))}
                    {selectedPackage.features.length > 5 && (
                      <p className="text-xs text-gray-500 pl-6">
                        +{selectedPackage.features.length - 5} more features
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                  <FaLock className="text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900">Secure Payment</p>
                    <p className="text-xs text-blue-700">
                      Your payment information is encrypted and secure
                    </p>
                  </div>
                </div>

                {provider === 'stripe' && (
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <FaCreditCard className="text-2xl text-blue-600" />
                      <div>
                        <p className="font-semibold text-gray-900">Credit Card via Stripe</p>
                        <p className="text-sm text-gray-600">Secure payment processing</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      You will be redirected to Stripe's secure checkout page to complete your payment.
                    </p>
                  </div>
                )}

                {provider === 'paypal' && (
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <FaPaypal className="text-2xl text-blue-700" />
                      <div>
                        <p className="font-semibold text-gray-900">PayPal</p>
                        <p className="text-sm text-gray-600">Fast and secure payment</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      You will be redirected to PayPal to complete your payment.
                    </p>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full bg-primary text-white py-4 px-6 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-4"
                >
                  {loading ? 'Processing...' : `Pay $${selectedPackage.price.toFixed(2)}`}
                </button>

                <button
                  onClick={() => router.back()}
                  className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Go Back
                </button>

                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500">
                    By completing this purchase, you agree to our{' '}
                    <a href="/terms" className="text-primary hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Money-Back Guarantee */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <h3 className="font-bold text-green-900 mb-2">30-Day Money-Back Guarantee</h3>
          <p className="text-sm text-green-800">
            Not satisfied? Get a full refund within 30 days, no questions asked.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
