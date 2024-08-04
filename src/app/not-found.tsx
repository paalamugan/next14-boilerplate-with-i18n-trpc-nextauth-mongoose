'use client';

import { ArrowBackIcon } from '@paalan/react-icons';
import { Button } from '@paalan/react-ui';
import { useTranslations } from 'next-intl';

import Link from '@/components/Link';
import { CenteredLayout } from '@/layouts/CenteredLayout';

const NotFoundPage = () => {
  const t = useTranslations();
  return (
    <>
      <div />
      <CenteredLayout>
        <main className="flex flex-col gap-3 text-center">
          <h1 className="text-4xl font-semibold"> 404 </h1>
          <h1 className="mt-4">{t('layouts.error.notFound.title')}</h1>
          <p className="mt-4 max-w-sm text-center text-lg">
            {t('layouts.error.notFound.description')}
          </p>
          <Button as={Link} href="/dashboard">
            <ArrowBackIcon className="size-5" />
            Back to Dashboard
          </Button>
        </main>
      </CenteredLayout>
    </>
  );
};

export default NotFoundPage;
