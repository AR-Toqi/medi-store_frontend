import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/admin', '/seller', '/cart', '/checkout', '/orders', '/profile'];
const authRoutes = ['/login', '/register', '/signup', '/verify-email'];

export function proxy(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const accessToken = cookies.get('accessToken')?.value;
  const isProtected = protectedRoutes.some((route) => nextUrl.pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => nextUrl.pathname.startsWith(route));

  // If trying to access protected route without token
  if (isProtected && !accessToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('message', 'unauthorized');
    return NextResponse.redirect(loginUrl);
  }

  // If already logged in and trying to access auth routes
  if (isAuthRoute && accessToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/seller/:path*',
    '/cart/:path*',
    '/checkout/:path*',
    '/orders/:path*',
    '/profile/:path*',
    '/login',
    '/register',
    '/signup',
    '/verify-email',
  ],
};
