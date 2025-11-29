'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useSubscription } from '@/hooks/useSubscription';
import { SUBSCRIPTION_PACKAGES, SUBSCRIPTION_FEATURES } from '@/types/subscription.types';
import { PaymentTransaction, AutoRenewalSettings } from '@/types/payment.types';
import { FaCrown, FaCheck, FaTimes, FaDownload, FaCreditCard, FaHistory, FaCog } from 'react-icons/fa';
import Link from 'next/link';

export default function ManageSubscriptionsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { activeSubscriptions, subscriptions, loading, refetch } = useSubscription();
  const [paymentHistory, setPaymentHistory] = useState<PaymentTransaction[]>([]);
  const [autoRenewal, setAutoRenewal] = useState<AutoRenewalSettings[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/signin?redirect=/subscriptions/manage');
      return;
    }
    fetchPaymentHistory();
    fetchAutoRenewalSettings();
  }, [user, router]);

  const fetchPaymentHistory = async () => {
    if (!user) return;
    
    try {
      const q = query(
        collection(db, 'paymentTransactions'),
        where('userId', '==', user.uid)
      );
      const querySnapshot = await getDocs(q);
      const payments = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          completedAt: data.completedAt?.toDate(),
          refundedAt: data.refundedAt?.toDate(),
        } as PaymentTransaction;
      });
      setPaymentHistory(payments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
    } catch (error) {
      console.error('Error fetching payment history:', error);
    } finally {
      setLoadingPayments(false);
    }
  };

  const fetchAutoRenewalSettings = async () => {
    if (!user) return;
    
    try {
      const q = query(
        collection(db, 'autoRenewalSettings'),
        where('userId', '==', user.uid)
      );
      const querySnapshot = await getDocs(q);
      const settings = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          nextRenewalDate: data.nextRenewalDate?.toDate() || new Date(),
          lastRenewalDate: data.lastRenewalDate?.toDate(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as AutoRenewalSettings;
      });
      setAutoRenewal(settings);
    } catch (error) {
      console.error('Error fetching auto-renewal settings:', error);
    }
  };

  const handleToggleAutoRenewal = async (subscriptionId: string, currentStatus: boolean) => {
    try {
      const setting = autoRenewal.find(s => s.subscriptionId === subscriptionId);
      if (setting) {
        await updateDoc(doc(db, 'autoRenewalSettings', setting.id), {
          enabled: !currentStatus,
          updatedAt: new Date(),
        });
        fetchAutoRenewalSettings();
      }
    } catch (error) {
      console.error('Error toggling auto-renewal:', error);
      alert('Failed to update auto-renewal settings');
    }
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    if (!confirm('Are you sure you want to cancel this subscription? You will lose access at the end of your billing period.')) {
      return;
    }

    try {
      await updateDoc(doc(db, 'userSubscriptions', subscriptionId), {
        status: 'cancelled',
        updatedAt: new Date(),
      });
      refetch();
      alert('Subscription cancelled successfully');
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert('Failed to cancel subscription');
    }
  };

  const getDaysRemaining = (endDate?: Date) => {
    if (!endDate) return 'Lifetime';
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return 'Expired';
    if (days === 0) return 'Expires today';
    return `${days} days remaining`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading || loadingPayments) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your subscriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/subscriptions" className="text-primary hover:underline mb-4 inline-block">
            ← Back to Plans
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Subscriptions</h1>
          <p className="text-gray-600">View and manage your active subscriptions and payment history</p>
        </div>

        {/* Active Subscriptions */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FaCrown className="text-yellow-500" />
              Active Subscriptions
            </h2>
          </div>
          <div className="p-6">
            {activeSubscriptions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">You don't have any active subscriptions</p>
                <Link
                  href="/subscriptions"
                  className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90"
                >
                  Browse Plans
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {activeSubscriptions.map((sub) => {
                  const pkg = SUBSCRIPTION_PACKAGES.find(p => p.id === sub.package);
                  const renewalSetting = autoRenewal.find(r => r.subscriptionId === sub.id);
                  
                  return (
                    <div key={sub.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {pkg?.name}
                          </h3>
                          <p className="text-gray-600 text-sm mb-2">{pkg?.description}</p>
                          <p className="text-sm text-gray-500">
                            {getDaysRemaining(sub.endDate)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">
                            ${pkg?.price}
                            <span className="text-sm text-gray-600">/{pkg?.billingPeriod}</span>
                          </p>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Included Features:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {sub.features.slice(0, 4).map(featureId => (
                            <div key={featureId} className="flex items-center gap-2 text-sm text-gray-600">
                              <FaCheck className="text-green-600 flex-shrink-0" />
                              <span>{SUBSCRIPTION_FEATURES[featureId]?.name}</span>
                            </div>
                          ))}
                        </div>
                        {sub.features.length > 4 && (
                          <p className="text-xs text-gray-500 mt-2">
                            +{sub.features.length - 4} more features
                          </p>
                        )}
                      </div>

                      {/* Auto-Renewal */}
                      {renewalSetting && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FaCog className="text-blue-600" />
                              <span className="text-sm font-medium text-gray-900">
                                Auto-Renewal: {renewalSetting.enabled ? 'Enabled' : 'Disabled'}
                              </span>
                            </div>
                            <button
                              onClick={() => handleToggleAutoRenewal(sub.id, renewalSetting.enabled)}
                              className="text-sm text-primary hover:underline"
                            >
                              {renewalSetting.enabled ? 'Disable' : 'Enable'}
                            </button>
                          </div>
                          {renewalSetting.enabled && (
                            <p className="text-xs text-gray-600 mt-1">
                              Next renewal: {renewalSetting.nextRenewalDate.toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-3">
                        <Link
                          href={`/subscriptions/upgrade?current=${sub.package}`}
                          className="flex-1 text-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
                        >
                          Upgrade Plan
                        </Link>
                        <button
                          onClick={() => handleCancelSubscription(sub.id)}
                          className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FaHistory className="text-gray-600" />
              Payment History
            </h2>
          </div>
          <div className="p-6">
            {paymentHistory.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No payment history available
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paymentHistory.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {payment.createdAt.toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {payment.description}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-900">
                          ${payment.amount.toFixed(2)} {payment.currency}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          {payment.receiptUrl ? (
                            <a
                              href={payment.receiptUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline flex items-center gap-1 text-sm"
                            >
                              <FaDownload />
                              Download
                            </a>
                          ) : (
                            <span className="text-gray-400 text-sm">N/A</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-lg shadow mt-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FaCreditCard className="text-gray-600" />
              Payment Methods
            </h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Manage your saved payment methods for faster checkout
            </p>
            <Link
              href="/subscriptions/payment-methods"
              className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800"
            >
              Manage Payment Methods
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
