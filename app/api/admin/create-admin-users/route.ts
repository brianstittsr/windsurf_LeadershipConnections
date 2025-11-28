import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

export async function POST(request: Request) {
  try {
    // Check if Firebase Admin is initialized
    if (!adminAuth || !adminDb) {
      return NextResponse.json(
        {
          success: false,
          error: 'Firebase Admin is not configured. Please check your environment variables.',
        },
        { status: 500 }
      );
    }

    const adminUsers = [
      {
        email: 'brianstittsr@gmail.com',
        password: 'Yfhk9r76q@@12345',
        name: 'Brian Stitts',
      },
      {
        email: 'kathy@ncleadconnect.org',
        password: '2026ncleadconnect',
        name: 'Kathy',
      },
      {
        email: 'gloria@ncleadconnect.org',
        password: '2026ncleadconnect',
        name: 'Gloria',
      },
    ];

    const results = [];

    for (const adminUser of adminUsers) {
      try {
        // Check if user already exists
        let userRecord;
        try {
          userRecord = await adminAuth.getUserByEmail(adminUser.email);
          results.push({
            email: adminUser.email,
            status: 'already_exists',
            uid: userRecord.uid,
          });
        } catch (error: any) {
          if (error.code === 'auth/user-not-found') {
            // Create the user
            userRecord = await adminAuth.createUser({
              email: adminUser.email,
              password: adminUser.password,
              emailVerified: true,
            });

            // Add user data to Firestore
            await adminDb.collection('users').doc(userRecord.uid).set({
              email: adminUser.email,
              name: adminUser.name,
              isAdmin: true,
              createdAt: Timestamp.now(),
            });

            results.push({
              email: adminUser.email,
              status: 'created',
              uid: userRecord.uid,
            });
          } else {
            throw error;
          }
        }
      } catch (error: any) {
        results.push({
          email: adminUser.email,
          status: 'error',
          error: error.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
