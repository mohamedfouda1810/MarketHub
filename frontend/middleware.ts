import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Note: Since we are using an external backend, the robust way to handle auth in Next.js middleware
  // is to read the HttpOnly cookie (e.g. 'accessToken' or a custom session cookie) 
  // For this demonstration, we'll check for a basic cookie. In production, consider next-auth or Jose to decode JWT.
  const token = request.cookies.get('accessToken')?.value;
  // We can also store role in a separate cookie or decode JWT here
  const role = request.cookies.get('userRole')?.value;

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');

  if (isAuthPage) {
    if (token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Protect Vendor routes
  if (pathname.startsWith('/vendor')) {
    if (!token) {
      return NextResponse.redirect(new URL(`/login?returnUrl=${pathname}`, request.url));
    }
    if (role !== 'Vendor' && role !== 'SuperAdmin' && role !== 'Admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // Protect Admin routes
  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL(`/login?returnUrl=${pathname}`, request.url));
    }
    if (role !== 'SuperAdmin' && role !== 'Admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  }

  // Protect Customer Account/Checkout routes
  if (pathname.startsWith('/account') || pathname.startsWith('/checkout')) {
    if (!token) {
      return NextResponse.redirect(new URL(`/login?returnUrl=${pathname}`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/vendor/:path*',
    '/admin/:path*',
    '/account/:path*',
    '/checkout/:path*',
    '/login',
    '/register/:path*'
  ],
};