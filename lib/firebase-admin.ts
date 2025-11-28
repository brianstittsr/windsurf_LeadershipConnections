import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

// Check if Firebase Admin config is valid
function isFirebaseAdminConfigValid() {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  return !!(projectId && clientEmail && privateKey);
}

// Initialize Firebase Admin only if config is valid
let adminApp: App | null = null;
let adminDb: Firestore | null = null;
let adminAuth: Auth | null = null;

if (isFirebaseAdminConfigValid()) {
  const firebaseAdminConfig = {
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    }),
  };

  // Initialize Firebase Admin
  adminApp = getApps().length === 0 ? initializeApp(firebaseAdminConfig, 'admin') : getApps()[0];

  // Initialize Firestore Admin
  adminDb = getFirestore(adminApp);

  // Initialize Auth Admin
  adminAuth = getAuth(adminApp);
} else {
  console.warn('Firebase Admin configuration is incomplete. Firebase Admin services will not be available.');
}

export { adminDb, adminAuth };
export default adminApp;
