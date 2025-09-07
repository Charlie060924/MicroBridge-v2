import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected routes that require authentication
const protectedRoutes = [
  '/student_portal',
  '/employer_portal',
  '/profile',
  '/settings',
  '/applications',
  '/jobs/create',
  '/jobs/manage',
];

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth/signin',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/verify-email',
  '/auth/employer-signin',
  '/auth/employer-signup',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Check if the current path is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route)
  );

  // If it's a protected route and no token, redirect to signin
  if (isProtectedRoute && !token) {
    const url = new URL('/auth/signin', request.url);
    // Add the current path as a redirect parameter
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // If it's a public auth route and user is already authenticated, redirect to appropriate dashboard
  if (isPublicRoute && pathname.startsWith('/auth/') && token) {
    // Try to determine user type from the URL or default to student
    const isEmployerRoute = pathname.includes('employer');
    const dashboardPath = isEmployerRoute ? '/employer_portal/workspace' : '/student_portal/workspace';
    return NextResponse.redirect(new URL(dashboardPath, request.url));
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};