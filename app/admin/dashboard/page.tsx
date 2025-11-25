'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { isAdminUser } from '@/lib/adminUsers';

interface UserMetrics {
  totalUsers: number;
  newUsersThisMonth: number;
  newUsersThisWeek: number;
  recentUsers: Array<{
    email: string;
    name: string;
    createdAt: string;
    city?: string;
    state?: string;
  }>;
}

const DashboardPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [metrics, setMetrics] = useState<UserMetrics>({
    totalUsers: 0,
    newUsersThisMonth: 0,
    newUsersThisWeek: 0,
    recentUsers: [],
  });
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !isAdminUser(user.email))) {
      router.push('/signin');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const usersRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersRef);
        
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        let totalUsers = 0;
        let newUsersThisMonth = 0;
        let newUsersThisWeek = 0;
        const recentUsersList: any[] = [];

        usersSnapshot.forEach((doc) => {
          const userData = doc.data();
          totalUsers++;

          // Check if user has a createdAt timestamp
          if (userData.createdAt) {
            const createdAt = userData.createdAt.toDate ? userData.createdAt.toDate() : new Date(userData.createdAt);
            
            if (createdAt >= oneMonthAgo) {
              newUsersThisMonth++;
            }
            if (createdAt >= oneWeekAgo) {
              newUsersThisWeek++;
            }

            // Add to recent users list (last 10)
            if (recentUsersList.length < 10) {
              recentUsersList.push({
                email: userData.email || 'N/A',
                name: userData.name || 'N/A',
                createdAt: createdAt.toLocaleDateString(),
                city: userData.city,
                state: userData.state,
              });
            }
          }
        });

        // Sort recent users by date (most recent first)
        recentUsersList.sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        setMetrics({
          totalUsers,
          newUsersThisMonth,
          newUsersThisWeek,
          recentUsers: recentUsersList,
        });
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoadingMetrics(false);
      }
    };

    if (user && isAdminUser(user.email)) {
      fetchMetrics();
    }
  }, [user]);

  if (loading || loadingMetrics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  if (!user || !isAdminUser(user.email)) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome back, {user.email}
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Users
            </h3>
            <p className="text-4xl font-bold mt-3 text-primary">
              {metrics.totalUsers}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              All registered users
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              New This Month
            </h3>
            <p className="text-4xl font-bold mt-3 text-green-600">
              {metrics.newUsersThisMonth}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Last 30 days
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              New This Week
            </h3>
            <p className="text-4xl font-bold mt-3 text-blue-600">
              {metrics.newUsersThisWeek}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Last 7 days
            </p>
          </div>
        </div>

        {/* Recent Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              Recent Users
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Joined Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {metrics.recentUsers.length > 0 ? (
                  metrics.recentUsers.map((user, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.city && user.state ? `${user.city}, ${user.state}` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.createdAt}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
    </div>
  );
};

export default DashboardPage;
