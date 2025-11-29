'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, Timestamp, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  UserSubscription,
  SubscriptionPackage,
  SUBSCRIPTION_PACKAGES,
  SUBSCRIPTION_FEATURES,
  getActiveSubscriptions,
} from '@/types/subscription.types';
import { FaCrown, FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaGift } from 'react-icons/fa';

interface UserData {
  uid: string;
  email: string;
  name?: string;
  role?: string;
}

export default function SubscriptionsManagementPage() {
  const { userRole, hasPermission } = useAuth();
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<SubscriptionPackage>('ai-writing');
  const [duration, setDuration] = useState(30); // days
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    if (!hasPermission('canManageUsers')) {
      router.push('/admin/dashboard');
      return;
    }
    fetchData();
  }, [hasPermission, router]);

  const fetchData = async () => {
    try {
      // Fetch subscriptions
      const subsSnapshot = await getDocs(collection(db, 'userSubscriptions'));
      const subsData = subsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          startDate: data.startDate?.toDate() || new Date(),
          endDate: data.endDate?.toDate(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          cancelledAt: data.cancelledAt?.toDate(),
        } as UserSubscription;
      });
      setSubscriptions(subsData);

      // Fetch users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({
        uid: doc.id,
        email: doc.data().email || '',
        name: doc.data().name || '',
        role: doc.data().role || 'User',
      }));
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGrantSubscription = async () => {
    if (!selectedUser || !selectedPackage) return;

    try {
      const user = users.find(u => u.uid === selectedUser);
      if (!user) return;

      const packageDetails = SUBSCRIPTION_PACKAGES.find(p => p.id === selectedPackage);
      if (!packageDetails) return;

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + duration);

      await addDoc(collection(db, 'userSubscriptions'), {
        userId: user.uid,
        userEmail: user.email,
        userName: user.name || user.email,
        package: selectedPackage,
        status: 'active',
        startDate: Timestamp.fromDate(startDate),
        endDate: Timestamp.fromDate(endDate),
        autoRenew: false,
        features: packageDetails.features,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      alert('Subscription granted successfully!');
      setShowGrantModal(false);
      setSelectedUser('');
      fetchData();
    } catch (error) {
      console.error('Error granting subscription:', error);
      alert('Failed to grant subscription');
    }
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    if (!confirm('Are you sure you want to cancel this subscription?')) return;

    try {
      await updateDoc(doc(db, 'userSubscriptions', subscriptionId), {
        status: 'cancelled',
        cancelledAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      fetchData();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert('Failed to cancel subscription');
    }
  };

  const handleDeleteSubscription = async (subscriptionId: string) => {
    if (!confirm('Are you sure you want to permanently delete this subscription?')) return;

    try {
      await deleteDoc(doc(db, 'userSubscriptions', subscriptionId));
      fetchData();
    } catch (error) {
      console.error('Error deleting subscription:', error);
      alert('Failed to delete subscription');
    }
  };

  const handleExtendSubscription = async (subscription: UserSubscription) => {
    const days = prompt('Extend subscription by how many days?', '30');
    if (!days) return;

    try {
      const newEndDate = new Date(subscription.endDate || new Date());
      newEndDate.setDate(newEndDate.getDate() + parseInt(days));

      await updateDoc(doc(db, 'userSubscriptions', subscription.id), {
        endDate: Timestamp.fromDate(newEndDate),
        updatedAt: Timestamp.now(),
      });
      fetchData();
    } catch (error) {
      console.error('Error extending subscription:', error);
      alert('Failed to extend subscription');
    }
  };

  const getStatusBadge = (subscription: UserSubscription) => {
    const isExpired = subscription.endDate && subscription.endDate < new Date();
    
    if (subscription.status === 'cancelled') {
      return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Cancelled</span>;
    }
    if (isExpired) {
      return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Expired</span>;
    }
    if (subscription.status === 'active') {
      return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Active</span>;
    }
    return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">{subscription.status}</span>;
  };

  const getDaysRemaining = (endDate?: Date) => {
    if (!endDate) return 'Lifetime';
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return 'Expired';
    if (days === 0) return 'Expires today';
    return `${days} days left`;
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'active') return sub.status === 'active' && (!sub.endDate || sub.endDate > new Date());
    if (filterStatus === 'expired') return sub.endDate && sub.endDate < new Date();
    if (filterStatus === 'cancelled') return sub.status === 'cancelled';
    return true;
  });

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscription Management</h1>
          <p className="text-gray-600">Manage user subscriptions and feature access</p>
        </div>
        <button
          onClick={() => setShowGrantModal(true)}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90"
        >
          <FaGift />
          Grant Subscription
        </button>
      </div>

      {/* Packages Overview */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Available Packages</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SUBSCRIPTION_PACKAGES.map(pkg => (
            <div
              key={pkg.id}
              className={`border rounded-lg p-4 ${pkg.popular ? 'border-primary border-2' : 'border-gray-200'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900">{pkg.name}</h3>
                {pkg.popular && (
                  <span className="bg-primary text-white text-xs px-2 py-1 rounded">Popular</span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-3">{pkg.description}</p>
              <p className="text-2xl font-bold text-primary mb-3">
                ${pkg.price}
                <span className="text-sm text-gray-500">/{pkg.billingPeriod}</span>
              </p>
              <div className="space-y-1">
                {pkg.features.slice(0, 3).map(featureId => (
                  <div key={featureId} className="flex items-center gap-2 text-sm text-gray-700">
                    <FaCheck className="text-green-600 flex-shrink-0" />
                    <span>{SUBSCRIPTION_FEATURES[featureId]?.name}</span>
                  </div>
                ))}
                {pkg.features.length > 3 && (
                  <p className="text-xs text-gray-500 mt-2">+{pkg.features.length - 3} more features</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Filter:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Subscriptions</option>
            <option value="active">Active Only</option>
            <option value="expired">Expired Only</option>
            <option value="cancelled">Cancelled Only</option>
          </select>
          <span className="text-sm text-gray-600">
            Showing {filteredSubscriptions.length} of {subscriptions.length} subscriptions
          </span>
        </div>
      </div>

      {/* Subscriptions List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Package</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Features</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredSubscriptions.map((sub) => {
              const packageDetails = SUBSCRIPTION_PACKAGES.find(p => p.id === sub.package);
              return (
                <tr key={sub.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{sub.userName}</div>
                      <div className="text-sm text-gray-500">{sub.userEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <FaCrown className="text-yellow-500" />
                      <span className="text-sm font-medium text-gray-900">
                        {packageDetails?.name || sub.package}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(sub)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {getDaysRemaining(sub.endDate)}
                    </div>
                    {sub.endDate && (
                      <div className="text-xs text-gray-500">
                        Until {sub.endDate.toLocaleDateString()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      {sub.features.length} features
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      {sub.status === 'active' && (
                        <>
                          <button
                            onClick={() => handleExtendSubscription(sub)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Extend subscription"
                          >
                            <FaPlus />
                          </button>
                          <button
                            onClick={() => handleCancelSubscription(sub.id)}
                            className="text-orange-600 hover:text-orange-800"
                            title="Cancel subscription"
                          >
                            <FaTimes />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDeleteSubscription(sub.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete subscription"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredSubscriptions.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No subscriptions found.
          </div>
        )}
      </div>

      {/* Grant Subscription Modal */}
      {showGrantModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Grant Subscription</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select User</label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                >
                  <option value="">Choose a user...</option>
                  {users
                    .filter(u => u.role !== 'SuperAdmin') // Don't show SuperAdmin
                    .map(user => (
                      <option key={user.uid} value={user.uid}>
                        {user.name || user.email} ({user.role})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Package</label>
                <select
                  value={selectedPackage}
                  onChange={(e) => setSelectedPackage(e.target.value as SubscriptionPackage)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  {SUBSCRIPTION_PACKAGES.map(pkg => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} - ${pkg.price}/{pkg.billingPeriod}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (days)</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 30)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  min="1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Subscription will expire on {new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toLocaleDateString()}
                </p>
              </div>

              {selectedPackage && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm font-semibold text-blue-900 mb-2">Included Features:</p>
                  <ul className="text-xs space-y-1">
                    {SUBSCRIPTION_PACKAGES.find(p => p.id === selectedPackage)?.features.map(featureId => (
                      <li key={featureId} className="text-blue-800 flex items-center gap-2">
                        <FaCheck className="text-green-600" />
                        {SUBSCRIPTION_FEATURES[featureId]?.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleGrantSubscription}
                  disabled={!selectedUser}
                  className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
                >
                  Grant Subscription
                </button>
                <button
                  onClick={() => {
                    setShowGrantModal(false);
                    setSelectedUser('');
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
