/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import 'server-only';

import { headers } from 'next/headers';
import { NextRequest } from 'next/server';

import { appRouter } from '@/server/api/root';
import { createCallerFactory, createTRPCContext, type TRPCContext } from '@/server/api/trpc';
// import { Logger } from '@/server/api/common/logger';
import { logColors } from '@/server/logger/colors';
import { Logger } from '@/server/logger/logger';

import { getTRPCBaseUrl } from './shared';

const logger = new Logger('ApiTRPCInternalRoute');
/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = async (): Promise<TRPCContext> => {
  const heads = new Headers(headers());
  heads.set('x-trpc-source', 'rsc');

  const url = new URL(getTRPCBaseUrl());
  const nextRequest = new NextRequest(url, {
    headers: heads,
    credentials: 'include',
  });

  return createTRPCContext({
    headers: heads,
    req: nextRequest,
  });
};

const createCaller = createCallerFactory(appRouter);

export const api = createCaller(() => createContext(), {
  onError: ({ path, error, type }) => {
    logger.error(
      logColors.red(`❌ Server tRPC failed on [${type} - ${path ?? '<no-path>'}]:`),
      error
    );
  },
});
