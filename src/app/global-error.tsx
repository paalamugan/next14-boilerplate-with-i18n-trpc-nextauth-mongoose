'use client';

import { captureException } from '@sentry/nextjs';
import { type FC, useEffect } from 'react';

import BaseLayout from '@/layouts/BaseLayout';
import { Providers } from '@/providers/providers';

import ErrorPage from './error';

type GlobalErrorPageProps = {
  error: Error & { digest?: string };
  params: { locale: string };
  reset: () => void;
};
const GlobalErrorPage: FC<GlobalErrorPageProps> = ({ error, params = { locale: 'en' }, reset }) => {
  const { locale = 'en' } = params;

  useEffect(() => {
    captureException(error);
  }, [error]);

  return (
    <html lang={locale}>
      <body>
        <Providers>
          <BaseLayout>
            <ErrorPage error={error} reset={reset} />
          </BaseLayout>
        </Providers>
      </body>
    </html>
  );
};

export default GlobalErrorPage;
