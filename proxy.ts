import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authMiddleware } from './src/app/lib/auth-middleware';

export async function proxy(request: NextRequest) {
  const { nextUrl } = request;
  
  // Get session from better-auth middleware config (no Prisma)
  const session = await authMiddleware.api.getSession({
    headers: request.headers,
  });

  // Define protected routes that require authentication
  const protectedRoutes = ['/challenge'];
  // Define auth routes that should be inaccessible when logged in
  const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'];

  const isProtectedRoute = protectedRoutes.some(route => 
    nextUrl.pathname.startsWith(route)
  );
  
  const isAuthRoute = authRoutes.some(route => 
    nextUrl.pathname.startsWith(route)
  );

  // Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !session?.user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users from auth routes to challenge page
  if (isAuthRoute && session?.user) {
    const challengeUrl = new URL('/challenge', request.url);
    return NextResponse.redirect(challengeUrl);
  }

  // Add user info to headers for downstream usage
  if (session?.user) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', session.user.id);
    requestHeaders.set('x-user-email', session.user.email || '');
    requestHeaders.set('x-user-name', session.user.name || '');

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
