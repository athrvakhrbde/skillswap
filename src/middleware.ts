// NOTE: This is a minimal middleware implementation for Netlify compatibility.
// Authentication is handled client-side in the ProtectedRoute component.
// A more comprehensive middleware can be implemented in the future if needed.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple pass-through middleware that doesn't modify requests
export function middleware(request: NextRequest) {
  // Simply continue to the requested page without modifications
  return NextResponse.next();
}

export const config = {
  // Only apply middleware to specific routes if needed
  matcher: [
    // Apply to protected routes only (currently handled client-side)
    '/profile',
    '/messages/:path*',
  ],
};

/* Full implementation for future reference:
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of routes that require authentication
const protectedRoutes = [
  '/profile',
  '/messages',
];

export function middleware(request: NextRequest) {
  // This is a simplified middleware that checks for authentication via cookies
  // In a production app, you would validate the token on the server
  
  // Get the path from the request URL
  const { pathname } = request.nextUrl;
  
  // Check if the route should be protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedRoute) {
    // Check if the user is authenticated by looking for Firebase auth token cookie
    // Note: In a real implementation, you would validate this token with Firebase Admin SDK
    const authCookie = request.cookies.get('__session');
    
    // If no auth cookie is found, redirect to login
    if (!authCookie) {
      const loginUrl = new URL('/login', request.url);
      
      // Add a redirect parameter to return after login
      loginUrl.searchParams.set('redirect', pathname);
      
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // Continue to the requested page
  return NextResponse.next();
}

export const config = {
  // Matcher defining when this middleware should run
  matcher: [
    // Apply to all routes except static assets, api routes, and _next paths
    '/((?!_next/static|_next/image|api|favicon.ico).*)',
  ],
};
*/ 