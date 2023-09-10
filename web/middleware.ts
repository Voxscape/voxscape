import { NextRequest, NextResponse, NextMiddleware, NextFetchEvent } from 'next/server';
import { logHttpRequest } from './server/request_logger';

const setXRobotsTagHeader = process.env.DISABLE_X_ROBOTS_TAG !== 'YES';

export function middleware(req: NextRequest, ev: NextFetchEvent): NextResponse {
  logHttpRequest(req, ev);
  const resHeaders = new Headers();

  if (setXRobotsTagHeader) {
    resHeaders.set('x-robots-tag', 'noindex');
  }

  return NextResponse.next({
    headers: resHeaders,
  });
}

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
