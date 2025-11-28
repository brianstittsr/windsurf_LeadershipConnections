import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin only if credentials are available
function initializeFirebaseAdmin() {
  if (admin.apps.length) {
    return admin.app();
  }

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  // Only initialize if all required credentials are present
  if (!projectId || !clientEmail || !privateKey) {
    console.warn('Firebase Admin credentials not fully configured');
    return null;
  }

  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey: privateKey.replace(/\\n/g, '\n'),
    }),
  });
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Initialize Firebase Admin
    const app = initializeFirebaseAdmin();
    if (!app) {
      return NextResponse.json(
        { error: 'Firebase Admin not configured' },
        { status: 500 }
      );
    }

    const temporaryPassword = Math.random().toString(36).slice(-8);
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().updateUser(user.uid, { password: temporaryPassword });

    // Here you would use a service like Nodemailer or SendGrid to send the email.
    // For this example, we'll just log the temporary password to the console.
    console.log(`Sending welcome email to ${email} with temporary password: ${temporaryPassword}`);

    return NextResponse.json({ message: 'Welcome email sent.' });
  } catch (error: any) {
    console.error('Error in send-welcome-email:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
