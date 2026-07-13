import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  
  // Use x-forwarded-host on Vercel, fallback to host
  const hostname = req.headers.get('x-forwarded-host') || req.headers.get('host') || '';

  // Check if we are on the tierlist subdomain
  const isTierlistSubdomain = hostname.includes('tierlist.rearmc.fun') || hostname.includes('tierlist.localhost');

  // If we are on the tierlist subdomain and trying to access the root path,
  // rewrite it to the /tierlist route internally.
  if (isTierlistSubdomain && url.pathname === '/') {
    return NextResponse.rewrite(new URL('/tierlist', req.url));
  }

  // Also, you can optionally redirect if they try to access /tierlist on the main domain
  // (uncomment if you want strict domains)
  // const isMainDomain = hostname === 'rearmc.fun' || hostname.startsWith('localhost:3000');
  // if (isMainDomain && url.pathname === '/tierlist') {
  //   const redirectUrl = new URL(url.href);
  //   redirectUrl.hostname = 'tierlist.rearmc.fun';
  //   redirectUrl.pathname = '/';
  //   return NextResponse.redirect(redirectUrl);
  // }

  return NextResponse.next();
}

// Config to limit the middleware to only run on necessary routes (improves performance)
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
};
