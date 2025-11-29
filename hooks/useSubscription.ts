import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import {
  UserSubscription,
  userHasFeature,
  getActiveSubscriptions,
} from '@/types/subscription.types';

export function useSubscription() {
  const { user, userRole } = useAuth();
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSubscriptions([]);
      setLoading(false);
      return;
    }

    fetchSubscriptions();
  }, [user]);

  const fetchSubscriptions = async () => {
    if (!user) return;

    try {
      const q = query(
        collection(db, 'userSubscriptions'),
        where('userId', '==', user.uid),
        where('status', '==', 'active')
      );
      const querySnapshot = await getDocs(q);
      const subsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          startDate: data.startDate?.toDate() || new Date(),
          endDate: data.endDate?.toDate(),
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as UserSubscription;
      });
      setSubscriptions(subsData);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasFeature = (featureId: string): boolean => {
    // SuperAdmin always has access to everything
    if (userRole === 'SuperAdmin') return true;
    
    // Check user's active subscriptions
    return userHasFeature(subscriptions, featureId);
  };

  const hasAnyFeature = (featureIds: string[]): boolean => {
    return featureIds.some(id => hasFeature(id));
  };

  const activeSubscriptions = getActiveSubscriptions(subscriptions);

  return {
    subscriptions,
    activeSubscriptions,
    hasFeature,
    hasAnyFeature,
    loading,
    refetch: fetchSubscriptions,
  };
}
