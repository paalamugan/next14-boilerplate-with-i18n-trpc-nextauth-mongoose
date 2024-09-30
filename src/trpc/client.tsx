'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { httpBatchLink, loggerLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { useMemo } from 'react';

import { isTRPCClientErrorWithCode } from '@/lib/utils/is-trpc-client-error-with-code';
import { type AppRouter } from '@/server/api/root';

import { getTRPCBaseUrl, transformer } from './shared';
import { usePathname, useRouter } from '@/lib/navigation';

export const api = createTRPCReact<AppRouter>();

type Props = {
  children: React.ReactNode;
};

export const TRPCReactProvider: React.FC<Props> = props => {
  const router = useRouter();
  const pathname = usePathname();

  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry(failureCount, error) {
              if (isTRPCClientErrorWithCode(error) && error.data.code === 'UNAUTHORIZED') {
                router.push(`/signin?redirectTo=${pathname}`);
                return false;
              }
              return failureCount < 2;
            },
          },
        },
      }),
    [pathname, router]
  );

  const trpcClient = useMemo(
    () =>
      api.createClient({
        links: [
          loggerLink({
            enabled: op =>
              process.env.NODE_ENV === 'development' ||
              (op.direction === 'down' && op.result instanceof Error),
          }),
          httpBatchLink({
            url: getTRPCBaseUrl(),
            transformer,
          }),
        ],
      }),
    []
  );

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {props.children}
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      </QueryClientProvider>
    </api.Provider>
  );
};
