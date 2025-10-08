import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Splash screen is disabled - users go directly to home page
  // Check if the user has visited the splash page before
  // const hasSplashCookie = request.cookies.has('splash_viewed');

  // If the user is requesting the home page and hasn't seen the splash page yet
  // if (request.nextUrl.pathname === '/' && !hasSplashCookie) {
  //   // Create a response that redirects to the splash page
  //   const response = NextResponse.redirect(new URL('/splash', request.url));

  //   // Set a cookie to remember that the user has seen the splash page
  //   response.cookies.set('splash_viewed', 'true', {
  //     maxAge: 60 * 60 * 24, // 1 day
  //     path: '/',
  //   });

  //   return response;
  // }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/'],
};
