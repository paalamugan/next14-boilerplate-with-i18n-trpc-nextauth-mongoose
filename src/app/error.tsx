'use client';

import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { Button } from '@paalan/react-ui';
import { captureException } from '@sentry/nextjs';
import { useTranslations } from 'next-intl';
import { type FC, useEffect } from 'react';

import Link from '@/components/Link';
import { CenteredLayout } from '@/layouts/CenteredLayout';

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};
const ErrorPage: FC<ErrorPageProps> = ({ error, reset }) => {
  const t = useTranslations();

  useEffect(() => {
    captureException(error);
  }, [error]);

  return (
    <>
      <div />
      <CenteredLayout>
        <main className="flex flex-col gap-3 text-center">
          <h1 className="text-4xl font-semibold"> 500 </h1>
          <h1 className="special mt-3">{t('layouts.error.internalServerError.title')}</h1>
          <p className="mt-3 max-w-sm text-center text-lg">
            {t('layouts.error.internalServerError.description')}
          </p>
          <div className="flex gap-2">
            <Button as={Link} href="/">
              {t('layouts.error.backToHome')}
              <ArrowRightIcon />
            </Button>
            <Button
              as={Link}
              href="/"
              variant="outline"
              onClick={e => {
                e.preventDefault();
                // Attempt to recover by trying to re-render the segment

                reset();
              }}
            >
              {t('layouts.error.refresh')}
              <ArrowRightIcon />
            </Button>
          </div>
        </main>
      </CenteredLayout>
    </>
  );
};

export default ErrorPage;
