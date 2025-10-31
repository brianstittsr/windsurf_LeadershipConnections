import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  try {
    const temporaryPassword = Math.random().toString(36).slice(-8);
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().updateUser(user.uid, { password: temporaryPassword });

    // Here you would use a service like Nodemailer or SendGrid to send the email.
    // For this example, we'll just log the temporary password to the console.
    console.log(`Sending welcome email to ${email} with temporary password: ${temporaryPassword}`);

    return NextResponse.json({ message: 'Welcome email sent.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
