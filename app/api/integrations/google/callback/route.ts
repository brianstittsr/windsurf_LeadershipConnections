import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(
      new URL(`/admin/integrations/google?error=${encodeURIComponent(error)}`, request.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL('/admin/integrations/google?error=no_code', request.url)
    );
  }

  try {
    // Get stored credentials
    const docRef = doc(db, 'integrations', 'google');
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists() || !docSnap.data().credentials) {
      return NextResponse.redirect(
        new URL('/admin/integrations/google?error=no_credentials', request.url)
      );
    }

    const credentials = docSnap.data().credentials;
    const redirectUri = `${request.nextUrl.origin}/api/integrations/google/callback`;

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: credentials.clientId,
        client_secret: credentials.clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Token exchange error:', errorData);
      return NextResponse.redirect(
        new URL(`/admin/integrations/google?error=${encodeURIComponent(errorData.error_description || 'token_exchange_failed')}`, request.url)
      );
    }

    const tokens = await tokenResponse.json();

    // Update credentials with tokens
    await updateDoc(docRef, {
      'credentials.accessToken': tokens.access_token,
      'credentials.refreshToken': tokens.refresh_token || credentials.refreshToken,
      'credentials.tokenExpiry': Timestamp.fromDate(new Date(Date.now() + tokens.expires_in * 1000)),
      'credentials.connectedAt': Timestamp.fromDate(new Date()),
      updatedAt: Timestamp.fromDate(new Date())
    });

    return NextResponse.redirect(
      new URL('/admin/integrations/google?success=true', request.url)
    );
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/admin/integrations/google?error=callback_failed', request.url)
    );
  }
}
