import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/admin', '/seller', '/cart', '/checkout', '/orders', '/profile'];
const authRoutes = ['/login', '/register', '/signup', '/verify-email'];

export function proxy(request: NextRequest) {
  const { nextUrl, cookies } = request;
  
  // Better Auth cookies are usually prefixed with 'better-auth.session_token'
  // In development it's often 'better-auth.session_token'
  // In production it might have a __Secure- prefix
  const sessionToken = 
    cookies.get('better-auth.session_token')?.value || 
    cookies.get('__Secure-better-auth.session_token')?.value ||
    cookies.get('accessToken')?.value; // Keeping this just in case

  const isProtected = protectedRoutes.some((route) => nextUrl.pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => nextUrl.pathname.startsWith(route));

  // If trying to access protected route without token
  if (isProtected && !sessionToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('message', 'unauthorized');
    return NextResponse.redirect(loginUrl);
  }



  // If already logged in and trying to access auth routes
  if (isAuthRoute && sessionToken) {
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

export default proxy;
