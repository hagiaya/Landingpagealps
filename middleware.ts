import { NextRequest, NextResponse } from 'next/server';
import type { NextFetchEvent, NextMiddleware } from 'next/server';

// Define protected routes
const protectedRoutes = ['/admin'];

export function middleware(request: NextRequest) {
  // Check if the requested route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  );

  // Allow access to login page and public resources
  if (request.nextUrl.pathname.startsWith('/admin/login') || 
      request.nextUrl.pathname === '/admin/login' ||
      request.nextUrl.pathname.startsWith('/_next') ||
      request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  if (isProtectedRoute) {
    // Since we're using client-side authentication with localStorage, 
    // the middleware can't directly check the auth token.
    // Instead, we'll allow the request to proceed and handle authentication client-side.
    // The middleware will only block direct access to /admin if they don't have any auth token,
    // but since localStorage is client-side only, we need a different approach.
    
    // For now, let the request proceed and handle auth client-side in AdminAuthWrapper
    return NextResponse.next();
  }

  return NextResponse.next();
}

function checkAuth(request: NextRequest): boolean {
  // In a real application, you would check for a valid session/token
  // For this example, we'll check for a custom header or cookie
  const authHeader = request.headers.get('authorization');
  const cookie = request.cookies.get('admin-auth');
  
  // Check environment variables for basic credentials
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  
  // In a real app, you'd validate against a proper auth system
  // This is a simplified example
  if (request.nextUrl.pathname.startsWith('/admin') && request.nextUrl.pathname !== '/admin/login') {
    // For browser requests, check for the admin-auth cookie
    return cookie?.value === 'true';
  }
  
  return true;
}

// Specify which paths the middleware should run for
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}