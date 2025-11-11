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
          <ul className="space-y-2">
            <li><Link href="/admin/dashboard" className="block py-2 px-4 rounded hover:bg-gray-700">Dashboard</Link></li>
            <li><Link href="/admin/profile" className="block py-2 px-4 rounded hover:bg-gray-700">Profile</Link></li>
            <li><Link href="/admin/events" className="block py-2 px-4 rounded hover:bg-gray-700">Events</Link></li>
            <li><Link href="/admin/forms" className="block py-2 px-4 rounded hover:bg-gray-700">Forms</Link></li>
            <li><Link href="/admin/registration" className="block py-2 px-4 rounded hover:bg-gray-700">Registration</Link></li>
            <li><Link href="/admin/grants" className="block py-2 px-4 rounded hover:bg-gray-700">Grants</Link></li>
            <li><Link href="/admin/ai-chat" className="block py-2 px-4 rounded hover:bg-gray-700">AI Chat</Link></li>
            
            <li className="pt-4 border-t border-gray-600">
              <span className="block py-2 px-4 text-gray-300 font-semibold">Content Management</span>
            </li>
            <li><Link href="/admin/alumni-comments" className="block py-2 px-4 rounded hover:bg-gray-700">Alumni Comments</Link></li>
            <li><Link href="/admin/blog-entries" className="block py-2 px-4 rounded hover:bg-gray-700">Blog Entries</Link></li>
            <li><Link href="/admin/service-entries" className="block py-2 px-4 rounded hover:bg-gray-700">Service Entries</Link></li>
            <li><Link href="/admin/program-entries" className="block py-2 px-4 rounded hover:bg-gray-700">Program Entries</Link></li>
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
