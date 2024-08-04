/* eslint-disable no-console */
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import type { NextRequest } from 'next/server';

import { appRouter } from '@/server/api/root';
import { createTRPCContext } from '@/server/api/trpc';
import { logColors, Logger } from '@/server/logger';

const logger = new Logger('ApiTRPCRoute');

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a HTTP request (e.g. when you make requests from Client Components).
 */
const createContext = async (opts: { req: NextRequest; headers: Headers }) => {
  return createTRPCContext({ ...opts });
};

const handler = async (req: NextRequest) => {
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: ({ resHeaders }) => createContext({ req, headers: resHeaders }),
    onError:
      process.env.NODE_ENV === 'development'
        ? ({ path, error, type }) => {
            logger.error(
              logColors.red(`❌ tRPC failed on [${type} - ${path ?? '<no-path>'}]:`),
              error.message
            );
          }
        : undefined,
  });
};

export { handler as GET, handler as POST };
