/* eslint-disable no-console */

'use client';

import { ArrowBackIcon } from '@paalan/react-icons';
import { cn } from '@paalan/react-shared/lib';
import { Box, Button, Flex, Strong, Text } from '@paalan/react-ui';
import { captureException } from '@sentry/nextjs';
import { useRouter } from 'next/navigation';
import { type FC, useEffect } from 'react';

import Link from '@/components/Link';
import { CenteredLayout } from '@/layouts/CenteredLayout';

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset?: () => void;
  statusCode?: number;
  statusText?: string;
  showErrorMessage?: boolean;
};
const ErrorPage: FC<ErrorPageProps> = ({
  error,
  reset,
  statusCode = 500,
  statusText = 'Internal Server Error',
  showErrorMessage = false,
}) => {
  const router = useRouter();

  useEffect(() => {
    captureException(error);
    console.error(error.cause);
  }, [error]);

  const onRefresh = () => {
    if (reset) {
      reset();
    } else {
      router.refresh();
    }
  };

  const textColor = statusCode >= 400 && showErrorMessage ? 'text-danger' : '';
  return (
    <>
      <div />
      <CenteredLayout>
        <main className="flex flex-col gap-3 text-center">
          <h1 className={cn('text-4xl font-semibold', textColor)}> {statusCode} </h1>
          <h1 className={cn('mt-3', textColor)}>{statusText}</h1>
          <Box className="mt-3 max-w-sm text-center text-lg">
            {showErrorMessage ? (
              <Text color="danger" mb="3">
                <Strong>Error Message:</Strong> {error.message}
              </Text>
            ) : (
              <Text>
                This page is currently unavailable. Please see the console for more information.
              </Text>
            )}
          </Box>
          <Flex justifyContent="center" gap="3">
            <Button as={Link} href="/dashboard">
              <ArrowBackIcon className="size-5" />
              Back to Dashboard
            </Button>
            <Button variant="outline" onClick={onRefresh}>
              Refresh
            </Button>
          </Flex>
        </main>
      </CenteredLayout>
    </>
  );
};

export default ErrorPage;
