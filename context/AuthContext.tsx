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
  actualRole: UserRole; // The real role before any test override
  permissions: RolePermissions;
  hasPermission: (permission: keyof RolePermissions) => boolean;
}

const defaultPermissions: RolePermissions = ROLE_PERMISSIONS.User;

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true,
  userRole: 'User',
  actualRole: 'User',
  permissions: defaultPermissions,
  hasPermission: () => false
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<UserRole>('User');
  const [actualRole, setActualRole] = useState<UserRole>('User');
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
          
          // Store the actual role
          setActualRole(role);
          
          // SuperAdmin can override role for testing
          if (role === 'SuperAdmin') {
            const testRole = localStorage.getItem('testRole') as UserRole | null;
            if (testRole && ['SuperAdmin', 'SuperUser', 'User'].includes(testRole)) {
              console.log(`🔄 SuperAdmin testing as: ${testRole}`);
              setUserRole(testRole);
              setPermissions(ROLE_PERMISSIONS[testRole]);
              setLoading(false);
              return;
            }
          }
          
          setUserRole(role);
          setPermissions(ROLE_PERMISSIONS[role]);
        } catch (error) {
          console.error('Error loading user role:', error);
          // Fall back to default role based on email
          const role = getUserRole(user.email);
          setActualRole(role);
          setUserRole(role);
          setPermissions(ROLE_PERMISSIONS[role]);
        }
      } else {
        setActualRole('User');
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
    <AuthContext.Provider value={{ user, loading, userRole, actualRole, permissions, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
