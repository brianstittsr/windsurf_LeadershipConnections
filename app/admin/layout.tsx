'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, userRole, hasPermission } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/signin');
    } else if (!loading && user && !hasPermission('canAccessAdmin')) {
      router.push('/');
    }
  }, [user, loading, hasPermission, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!hasPermission('canAccessAdmin')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You do not have permission to access the admin area.</p>
          <Link href="/" className="text-primary hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 shadow-sm p-4 fixed left-0 top-[88px] bottom-0 overflow-y-auto z-10">
        <div className="mb-4 pb-4 border-b border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Logged in as:</p>
          <p className="text-sm font-semibold truncate text-gray-900">{user?.email}</p>
          <p className="text-xs text-primary mt-1 font-medium">Role: {userRole}</p>
        </div>
        
        <nav>
          <ul className="space-y-1">
            <li><Link href="/admin/dashboard" className="block py-2 px-4 rounded-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors">Dashboard</Link></li>
            <li><Link href="/admin/profile" className="block py-2 px-4 rounded-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors">Profile</Link></li>
            <li><Link href="/admin/lc-profile" className="block py-2 px-4 rounded-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors">LC Member Profile</Link></li>
            
            {hasPermission('canManageEvents') && (
              <li><Link href="/admin/events" className="block py-2 px-4 rounded-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors">Events</Link></li>
            )}
            
            {hasPermission('canManageForms') && (
              <li><Link href="/admin/forms" className="block py-2 px-4 rounded-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors">Forms</Link></li>
            )}
            
            <li><Link href="/admin/registration" className="block py-2 px-4 rounded-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors">Registration</Link></li>
            <li><Link href="/admin/datasets" className="block py-2 px-4 rounded-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors">DataHub Admin</Link></li>
            <li><Link href="/admin/grants" className="block py-2 px-4 rounded-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors">Grants</Link></li>
            <li><Link href="/admin/ai-chat" className="block py-2 px-4 rounded-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors">AI Chat</Link></li>
            
            {hasPermission('canManageContent') && (
              <>
                <li className="pt-4 mt-4 border-t border-gray-200">
                  <span className="block py-2 px-4 text-gray-500 font-semibold text-xs uppercase tracking-wider">Content Management</span>
                </li>
                <li><Link href="/admin/home-content" className="block py-2 px-4 rounded-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors">Home Page Content</Link></li>
                <li><Link href="/admin/lc-classes" className="block py-2 px-4 rounded-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors">LC Past Classes</Link></li>
                <li><Link href="/admin/lc-past-events" className="block py-2 px-4 rounded-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors">LC Past Events</Link></li>
                <li><Link href="/admin/lc-services" className="block py-2 px-4 rounded-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors">LC Services</Link></li>
                <li><Link href="/admin/lc-gallery" className="block py-2 px-4 rounded-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors">LC Gallery</Link></li>
                <li><Link href="/admin/contact-submissions" className="block py-2 px-4 rounded-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors">Contact Submissions</Link></li>
                <li><Link href="/admin/alumni-comments" className="block py-2 px-4 rounded-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors">Alumni Comments</Link></li>
                <li><Link href="/admin/blog-entries" className="block py-2 px-4 rounded-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors">Blog Entries</Link></li>
                <li><Link href="/admin/service-entries" className="block py-2 px-4 rounded-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors">Service Entries</Link></li>
                <li><Link href="/admin/program-entries" className="block py-2 px-4 rounded-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors">Program Entries</Link></li>
                <li><Link href="/admin/strategic-planning" className="block py-2 px-4 rounded-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors">Strategic Planning</Link></li>
              </>
            )}
            
            {hasPermission('canManageUsers') && (
              <>
                <li className="pt-4 mt-4 border-t border-gray-200">
                  <span className="block py-2 px-4 text-gray-500 font-semibold text-xs uppercase tracking-wider">User Management</span>
                </li>
                <li><Link href="/admin/users" className="block py-2 px-4 rounded-lg text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors">Manage Users</Link></li>
              </>
            )}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8 ml-64 pt-[120px] bg-gray-50">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
