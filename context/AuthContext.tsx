'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { UserRole, RolePermissions, ROLE_PERMISSIONS } from '@/types/roles';
import { getUserRole } from '@/lib/adminUsers';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userRole: UserRole;
  permissions: RolePermissions;
  hasPermission: (permission: keyof RolePermissions) => boolean;
}

const defaultPermissions: RolePermissions = ROLE_PERMISSIONS.User;

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true,
  userRole: 'User',
  permissions: defaultPermissions,
  hasPermission: () => false
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole>('User');
  const [permissions, setPermissions] = useState<RolePermissions>(defaultPermissions);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user?.email) {
        // Try to get role from Firestore first, fall back to default
        try {
          const { getUserRoleFromFirestore, initializeUserRole } = await import('@/lib/userRoles');
          let role = await getUserRoleFromFirestore(user.uid);
          
          // If no role in Firestore, initialize with default
          if (!role || role === 'User') {
            role = await initializeUserRole(user.uid, user.email);
          }
          
          setUserRole(role);
          setPermissions(ROLE_PERMISSIONS[role]);
        } catch (error) {
          console.error('Error loading user role:', error);
          // Fall back to default role based on email
          const role = getUserRole(user.email);
          setUserRole(role);
          setPermissions(ROLE_PERMISSIONS[role]);
        }
      } else {
        setUserRole('User');
        setPermissions(defaultPermissions);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const hasPermission = (permission: keyof RolePermissions): boolean => {
    return permissions[permission];
  };

  return (
    <AuthContext.Provider value={{ user, loading, userRole, permissions, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
