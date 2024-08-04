'use client';

import { useTranslations } from 'next-intl';

import { api } from '@/trpc/client';

export const ClientFetch = () => {
  const { data, isPending } = api.users.userById.useQuery();
  const t = useTranslations('pages.profile.content');
  return (
    <div className="[&_p]:my-6">
      <h1 className="font-bold">{t('clientFetchTitle')}</h1>
      {isPending ? 'Loading...' : <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
};
