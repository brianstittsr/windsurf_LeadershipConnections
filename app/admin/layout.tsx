'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    }
    // In a real app, you'd also check for an 'admin' role here
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <nav>
          <ul>
            <li><Link href="/admin/dashboard">Dashboard</Link></li>
            <li><Link href="/admin/profile">Profile</Link></li>
            <li><Link href="/admin/events">Events</Link></li>
            <li><Link href="/admin/forms">Forms</Link></li>
            <li><Link href="/admin/registration">Registration</Link></li>
            <li><Link href="/admin/grants">Grants</Link></li>
            <li><Link href="/admin/ai-chat">AI Chat</Link></li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
