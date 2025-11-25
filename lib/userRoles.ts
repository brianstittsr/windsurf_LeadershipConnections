import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { UserRole, getDefaultRole } from '@/types/roles';

/**
 * Assign or update a user's role in Firestore
 */
export async function assignUserRole(uid: string, email: string, role?: UserRole): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    // Determine the role to assign
    const assignedRole = role || getDefaultRole(email);
    
    if (userDoc.exists()) {
      // Update existing user
      await updateDoc(userRef, {
        role: assignedRole,
        updatedAt: new Date()
      });
    } else {
      // Create new user with role
      await setDoc(userRef, {
        uid,
        email,
        role: assignedRole,
        createdAt: new Date(),
        updatedAt: new Date()
      }, { merge: true });
    }
  } catch (error) {
    console.error('Error assigning user role:', error);
    throw error;
  }
}

/**
 * Get a user's role from Firestore
 */
export async function getUserRoleFromFirestore(uid: string): Promise<UserRole> {
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.role || 'User';
    }
    
    return 'User';
  } catch (error) {
    console.error('Error getting user role:', error);
    return 'User';
  }
}

/**
 * Initialize user role on first login
 */
export async function initializeUserRole(uid: string, email: string): Promise<UserRole> {
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists() || !userDoc.data().role) {
      const defaultRole = getDefaultRole(email);
      await assignUserRole(uid, email, defaultRole);
      return defaultRole;
    }
    
    return userDoc.data().role as UserRole;
  } catch (error) {
    console.error('Error initializing user role:', error);
    return 'User';
  }
}
