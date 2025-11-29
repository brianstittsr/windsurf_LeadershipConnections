'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { UserRole, ROLE_PERMISSIONS } from '@/types/roles';
import { useRouter } from 'next/navigation';

interface UserData {
  uid: string;
  email: string;
  name?: string;
  role?: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export default function UsersManagementPage() {
  const { hasPermission, userRole } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>('User');

  useEffect(() => {
    if (!hasPermission('canManageUsers')) {
      router.push('/admin/dashboard');
      return;
    }
    fetchUsers();
  }, [hasPermission, router]);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          uid: doc.id,
          email: data.email || '',
          name: data.name || '',
          role: data.role || 'User',
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        };
      }) as UserData[];
      
      usersData.sort((a, b) => a.email.localeCompare(b.email));
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditRole = (user: UserData) => {
    setEditingUser(user);
    setSelectedRole(user.role || 'User');
  };

  const handleUpdateRole = async () => {
    if (!editingUser) return;

    try {
      await updateDoc(doc(db, 'users', editingUser.uid), {
        role: selectedRole,
        updatedAt: Timestamp.fromDate(new Date())
      });

      setUsers(users.map(u => 
        u.uid === editingUser.uid 
          ? { ...u, role: selectedRole, updatedAt: new Date() }
          : u
      ));

      setEditingUser(null);
      alert('User role updated successfully!');
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Error updating user role. Please try again.');
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    const colors = {
      SuperAdmin: 'bg-red-100 text-red-800',
      SuperUser: 'bg-blue-100 text-blue-800',
      User: 'bg-gray-100 text-gray-800'
    };
    return colors[role];
  };

  if (!hasPermission('canManageUsers')) {
    return null;
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
        <p className="text-gray-600">Manage user roles and permissions</p>
      </div>

      {/* Role Permissions Reference */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Role Permissions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(ROLE_PERMISSIONS).map(([role, permissions]) => (
            <div key={role} className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className={`font-semibold mb-2 px-2 py-1 rounded inline-block ${getRoleBadgeColor(role as UserRole)}`}>
                {role}
              </h3>
              <ul className="text-sm space-y-1 mt-3">
                {Object.entries(permissions).map(([perm, value]) => (
                  value && (
                    <li key={perm} className="text-gray-700">
                      ✓ {perm.replace('can', '').replace(/([A-Z])/g, ' $1').trim()}
                    </li>
                  )
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Default Role Assignments */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
        <h3 className="font-semibold text-gray-900 mb-2">Default Role Assignments</h3>
        <ul className="text-sm space-y-1">
          <li className="text-gray-700">• brianstittsr@gmail.com → <span className="font-semibold text-red-600">SuperAdmin</span></li>
          <li className="text-gray-700">• gloria@ncleadconnect.org → <span className="font-semibold text-blue-600">SuperUser</span></li>
          <li className="text-gray-700">• kathy@ncleadconnect.org → <span className="font-semibold text-blue-600">SuperUser</span></li>
          <li className="text-gray-700">• All other users → <span className="font-semibold text-gray-600">User</span></li>
        </ul>
        <p className="text-xs text-gray-600 mt-2">
          Note: Default roles are assigned automatically on user creation. You can override them here.
        </p>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.uid} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {user.name || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-block text-xs px-2 py-1 rounded ${getRoleBadgeColor(user.role || 'User')}`}>
                    {user.role || 'User'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => router.push(`/member-profile/${user.uid}`)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      View Profile
                    </button>
                    {userRole === 'SuperAdmin' && (
                      <button
                        onClick={() => handleEditRole(user)}
                        className="text-primary hover:text-primary/80"
                      >
                        Change Role
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No users found.
          </div>
        )}
      </div>

      {/* Edit Role Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setEditingUser(null)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Change User Role</h2>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">User Email:</p>
              <p className="font-semibold text-gray-900">{editingUser.email}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select New Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
              >
                <option value="User">User</option>
                <option value="SuperUser">SuperUser</option>
                <option value="SuperAdmin">SuperAdmin</option>
              </select>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 mb-6">
              <p className="text-xs font-semibold text-gray-700 mb-2">
                {selectedRole} Permissions:
              </p>
              <ul className="text-xs space-y-1">
                {Object.entries(ROLE_PERMISSIONS[selectedRole]).map(([perm, value]) => (
                  value && (
                    <li key={perm} className="text-gray-600">
                      ✓ {perm.replace('can', '').replace(/([A-Z])/g, ' $1').trim()}
                    </li>
                  )
                ))}
              </ul>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleUpdateRole}
                className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
              >
                Update Role
              </button>
              <button
                onClick={() => setEditingUser(null)}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
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
