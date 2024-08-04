import { type NextRequest, NextResponse } from 'next/server';
// import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import siteConfig from '@/next-helpers/site.config';

import { verifySessionTokenFromCookies } from './utils/middleware.helper';
// import { verifySessionTokenFromCookies } from './utils/middleware.helper';
import { createRouteMatcher } from './utils/routeMatcher';

const intlMiddleware = createMiddleware({
  locales: siteConfig.locale.locales,
  localePrefix: siteConfig.locale.localePrefix,
  defaultLocale: siteConfig.locale.defaultLocale,
});

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/:locale/dashboard(.*)',
  '/profile(.*)',
  '/:locale/profile(.*)',
]);

const authMiddleware = (request: NextRequest) => {
  const verifiedSessionToken = verifySessionTokenFromCookies();

  if (!verifiedSessionToken && !request.nextUrl.pathname.includes('/signin')) {
    const url = new URL('/signin', request.url);
    url.searchParams.set('redirectBackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return intlMiddleware(request);
};

export default function middleware(request: NextRequest) {
  if (isProtectedRoute(request)) return authMiddleware(request);
  return intlMiddleware(request);
}

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets and API routes.
  matcher: ['/((?!.+\\.[\\w]+$|_next|api|trpc).*)', '/'],
};
