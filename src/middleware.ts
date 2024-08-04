import { type NextRequest, NextResponse } from 'next/server';
import NextAuth from 'next-auth';
// import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import type { NextAuthRequest } from 'node_modules/next-auth/lib';
import type { AppRouteHandlerFnContext } from 'node_modules/next-auth/lib/types';

import siteConfig from '@/next-helpers/site.config';

import { authBaseConfig } from './lib/auth/auth.base.config';
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

const authMiddleware = (request: NextAuthRequest) => {
  if (!request.auth?.user?.id && !request.nextUrl.pathname.includes('/signin')) {
    const url = new URL('/signin', request.url);
    url.searchParams.set('redirectTo', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return intlMiddleware(request);
};

export default function middleware(request: NextRequest, response: AppRouteHandlerFnContext) {
  if (isProtectedRoute(request)) {
    return NextAuth(authBaseConfig).auth(authMiddleware)(request, response);
  }
  return intlMiddleware(request);
}

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets and API routes.
  matcher: ['/((?!.+\\.[\\w]+$|_next|api|trpc|favicon.ico).*)', '/', '/_not-found'],
};
