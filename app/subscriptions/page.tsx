'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useSubscription } from '@/hooks/useSubscription';
import {
  SUBSCRIPTION_PACKAGES,
  SUBSCRIPTION_FEATURES,
  SubscriptionPackage,
} from '@/types/subscription.types';
import { PaymentProvider } from '@/types/payment.types';
import { FaCheck, FaCrown, FaStar, FaCreditCard, FaPaypal, FaLock } from 'react-icons/fa';
import Link from 'next/link';

export default function SubscriptionsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { activeSubscriptions, loading } = useSubscription();
  const [selectedPackage, setSelectedPackage] = useState<SubscriptionPackage | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>('stripe');
  const [showCheckout, setShowCheckout] = useState(false);

  const hasActiveSubscription = (packageId: SubscriptionPackage): boolean => {
    return activeSubscriptions.some(sub => sub.package === packageId);
  };

  const handleSelectPackage = (packageId: SubscriptionPackage) => {
    if (!user) {
      router.push('/signin?redirect=/subscriptions');
      return;
    }
    setSelectedPackage(packageId);
    setShowCheckout(true);
  };

  const handleCheckout = () => {
    if (!selectedPackage) return;
    
    // Redirect to checkout page with selected package and provider
    router.push(`/subscriptions/checkout?package=${selectedPackage}&provider=${selectedProvider}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlock powerful features to enhance your Leadership Connections experience
          </p>
          {activeSubscriptions.length > 0 && (
            <div className="mt-4">
              <Link
                href="/subscriptions/manage"
                className="text-primary hover:underline font-medium"
              >
                Manage Your Subscriptions →
              </Link>
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {SUBSCRIPTION_PACKAGES.map((pkg) => {
            const isActive = hasActiveSubscription(pkg.id);
            const isPopular = pkg.popular;

            return (
              <div
                key={pkg.id}
                className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transition-transform hover:scale-105 ${
                  isPopular ? 'ring-4 ring-primary' : ''
                }`}
              >
                {isPopular && (
                  <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 text-sm font-bold rounded-bl-lg flex items-center gap-1">
                    <FaStar className="text-yellow-300" />
                    POPULAR
                  </div>
                )}

                {isActive && (
                  <div className="absolute top-0 left-0 bg-green-500 text-white px-4 py-1 text-sm font-bold rounded-br-lg flex items-center gap-1">
                    <FaCheck />
                    ACTIVE
                  </div>
                )}

                <div className="p-8">
                  {/* Package Header */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <FaCrown className="text-yellow-500 text-2xl" />
                      <h3 className="text-2xl font-bold text-gray-900">{pkg.name}</h3>
                    </div>
                    <p className="text-gray-600 text-sm">{pkg.description}</p>
                  </div>

                  {/* Pricing */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-gray-900">
                        ${pkg.price}
                      </span>
                      <span className="text-gray-600">/{pkg.billingPeriod}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-8 space-y-3">
                    {pkg.features.map((featureId) => {
                      const feature = SUBSCRIPTION_FEATURES[featureId];
                      return (
                        <div key={featureId} className="flex items-start gap-3">
                          <FaCheck className="text-green-600 flex-shrink-0 mt-1" />
                          <div>
                            <p className="text-gray-900 font-medium text-sm">
                              {feature?.name}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {feature?.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleSelectPackage(pkg.id)}
                    disabled={isActive}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                      isActive
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : isPopular
                        ? 'bg-primary text-white hover:bg-primary/90'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    }`}
                  >
                    {isActive ? 'Currently Active' : 'Get Started'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Features Comparison */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Feature Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">
                    Feature
                  </th>
                  {SUBSCRIPTION_PACKAGES.map((pkg) => (
                    <th
                      key={pkg.id}
                      className="text-center py-4 px-4 font-semibold text-gray-900"
                    >
                      {pkg.name.replace(' Package', '')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.values(SUBSCRIPTION_FEATURES).map((feature) => (
                  <tr key={feature.id} className="border-b border-gray-100">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{feature.name}</p>
                        <p className="text-sm text-gray-500">{feature.description}</p>
                      </div>
                    </td>
                    {SUBSCRIPTION_PACKAGES.map((pkg) => (
                      <td key={pkg.id} className="text-center py-4 px-4">
                        {pkg.features.includes(feature.id) ? (
                          <FaCheck className="text-green-600 mx-auto text-xl" />
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Secure Payment Options
          </h2>
          <p className="text-gray-600 mb-6">
            We accept all major payment methods through secure providers
          </p>
          <div className="flex justify-center items-center gap-8 flex-wrap">
            <div className="flex items-center gap-2 text-gray-700">
              <FaCreditCard className="text-3xl text-blue-600" />
              <span className="font-medium">Credit Card</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <FaPaypal className="text-3xl text-blue-700" />
              <span className="font-medium">PayPal</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <FaLock className="text-2xl text-green-600" />
              <span className="font-medium">256-bit SSL Encryption</span>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <details className="bg-white rounded-lg shadow p-6">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Can I cancel anytime?
              </summary>
              <p className="mt-3 text-gray-600">
                Yes! You can cancel your subscription at any time from your account settings.
                You'll continue to have access until the end of your billing period.
              </p>
            </details>
            <details className="bg-white rounded-lg shadow p-6">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                What payment methods do you accept?
              </summary>
              <p className="mt-3 text-gray-600">
                We accept all major credit cards (Visa, Mastercard, American Express) and
                PayPal through our secure payment processors.
              </p>
            </details>
            <details className="bg-white rounded-lg shadow p-6">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Can I upgrade or downgrade my plan?
              </summary>
              <p className="mt-3 text-gray-600">
                Absolutely! You can change your plan at any time. When upgrading, you'll be
                charged a prorated amount. When downgrading, the change takes effect at the
                next billing cycle.
              </p>
            </details>
            <details className="bg-white rounded-lg shadow p-6">
              <summary className="font-semibold text-gray-900 cursor-pointer">
                Do you offer refunds?
              </summary>
              <p className="mt-3 text-gray-600">
                We offer a 30-day money-back guarantee. If you're not satisfied with your
                subscription, contact us within 30 days for a full refund.
              </p>
            </details>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && selectedPackage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Choose Payment Method</h3>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                You've selected:{' '}
                <span className="font-bold text-gray-900">
                  {SUBSCRIPTION_PACKAGES.find(p => p.id === selectedPackage)?.name}
                </span>
              </p>
              <p className="text-3xl font-bold text-primary mb-2">
                ${SUBSCRIPTION_PACKAGES.find(p => p.id === selectedPackage)?.price}
                <span className="text-lg text-gray-600">/month</span>
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <button
                onClick={() => setSelectedProvider('stripe')}
                className={`w-full p-4 rounded-lg border-2 transition-colors flex items-center justify-between ${
                  selectedProvider === 'stripe'
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FaCreditCard className="text-2xl text-blue-600" />
                  <span className="font-semibold">Credit Card (Stripe)</span>
                </div>
                {selectedProvider === 'stripe' && (
                  <FaCheck className="text-primary" />
                )}
              </button>

              <button
                onClick={() => setSelectedProvider('paypal')}
                className={`w-full p-4 rounded-lg border-2 transition-colors flex items-center justify-between ${
                  selectedProvider === 'paypal'
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FaPaypal className="text-2xl text-blue-700" />
                  <span className="font-semibold">PayPal</span>
                </div>
                {selectedProvider === 'paypal' && (
                  <FaCheck className="text-primary" />
                )}
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCheckout}
                className="flex-1 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 font-semibold"
              >
                Continue to Checkout
              </button>
              <button
                onClick={() => {
                  setShowCheckout(false);
                  setSelectedPackage(null);
                }}
                className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
