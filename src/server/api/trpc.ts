/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { initTRPC } from '@trpc/server';
import type { NextRequest } from 'next/server';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { fromZodError, ValidationError } from 'zod-validation-error';

import {
  type RateLimitConfig,
  rateLimitMiddleware,
} from '@/server/api/middlewares/rate-limit.middleware';
import { type ServerSession } from '@/server/api/routers/auth/service/auth.service.types';
import { mongodbConnect } from '@/server/database/mongodb';

import { authService } from './routers/auth/service/auth.service';
import { getTRPCError } from './utils/trpc-error';

/**
 * Defines your context shape.
 * Add fields here that the inner context brings.
 */
interface CreateContextOptions {
  headers: Headers;
  req: NextRequest;
}

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: CreateContextOptions) => {
  const mongodb = await mongodbConnect();
  return {
    ...opts,
    mongodb,
  };
};
export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;

const getZodValidationError = (error: unknown) => {
  if (error instanceof ValidationError) return error;

  if (error instanceof ZodError) {
    return fromZodError(error, {
      includePath: true,
    });
  }

  return null;
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    const errorCause = error.cause;
    const zodValidationError = getZodValidationError(errorCause);
    const mongoServerErrorMessage =
      errorCause?.name === 'MongoServerError'
        ? 'An error occurred while processing your request. Please try again later.'
        : null;
    const zodValidationErrorMessage = zodValidationError?.message;
    return {
      ...shape,
      // If you want to hide the error message from the client, you can set it to a generic message
      message: zodValidationErrorMessage || mongoServerErrorMessage || error.message,
      data: {
        ...shape.data,
        zodValidationError,
      },
    };
  },
});

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

// eslint-disable-next-line prefer-destructuring
export const createCallerFactory = t.createCallerFactory;

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure;

type ProtectedProcedureOpts = Omit<TRPCContext, 'session'> & {
  session: ServerSession;
};
const enforceUserIsAuthenticated = t.middleware(async opts => {
  const verifiedSessionToken = authService.verifySessionTokenFromCookies(opts.ctx.req.headers);

  if (!verifiedSessionToken) {
    throw getTRPCError('Session token is missing', 'UNAUTHORIZED');
  }

  try {
    const result = await authService.validateSessionToken({
      encodedSessionToken: verifiedSessionToken.encodedSessionToken,
      userId: verifiedSessionToken.userId,
      headers: opts.ctx.headers,
    });

    if (!result.success) {
      throw getTRPCError('Invalid session token', 'UNAUTHORIZED');
    }

    if (!result.userInfo) {
      throw getTRPCError('Failed to retrieve user info');
    }

    return await opts.next({
      ctx: {
        ...opts.ctx,
        session: {
          user: result.userInfo,
          sessionToken: result.sessionToken,
        },
      } satisfies ProtectedProcedureOpts,
    });
  } catch (error: unknown) {
    throw getTRPCError(error);
  }
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthenticated);
export const protectedRateLimitedProcedure = (
  configOrFn:
    | RateLimitConfig
    | ((opts: ProtectedProcedureOpts) => RateLimitConfig)
    | ((opts: ProtectedProcedureOpts) => Promise<RateLimitConfig>)
) => {
  return protectedProcedure.use(async opts => {
    let config: RateLimitConfig;

    if (typeof configOrFn === 'function') {
      const result = configOrFn({ ...opts.ctx, session: opts.ctx.session });

      if (result instanceof Promise) {
        config = await result;
      } else {
        config = result;
      }
    } else {
      config = configOrFn;
    }

    await rateLimitMiddleware(opts.ctx.session, config);
    return opts.next(opts);
  });
};
