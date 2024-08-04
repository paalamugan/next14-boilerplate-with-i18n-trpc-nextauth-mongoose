'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import ErrorPage from '../../error';

const NextAuthErrorPage = () => {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get('error') || 'Authentication Failed';
  return (
    <ErrorPage
      error={new Error(errorMessage)}
      statusCode={401}
      statusText="Unauthorized"
      showErrorMessage
    />
  );
};

const NextAuthErrorSuspense = () => {
  return (
    <Suspense>
      <NextAuthErrorPage />
    </Suspense>
  );
};

export default NextAuthErrorSuspense;
