'use client';

import { useTranslations } from 'next-intl';
import { type FC, use } from 'react';

export const ServerFetch: FC<{ dataPromise: Promise<unknown> }> = ({ dataPromise }) => {
  const data = use(dataPromise);
  const t = useTranslations('pages.profile.content');
  return (
    <div className="[&_p]:my-6">
      <h1 className="font-bold">{t('serverFetchTitle')}</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};
