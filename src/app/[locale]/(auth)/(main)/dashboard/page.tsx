import { getTranslations } from 'next-intl/server';
import type { FC } from 'react';

import { auth } from '@/lib/auth';

import { Hello } from './_components/Hello';

export const generateMetadata = async (props: { params: { locale: string } }) => {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'Dashboard',
  });

  return {
    title: t('meta_title'),
  };
};

type DashboardProps = {
  params: {
    locale: string;
  };
};

const Dashboard: FC<DashboardProps> = async ({ params }) => {
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'Dashboard',
  });
  const user = await auth();
  return (
    <div className="[&_p]:my-6">
      <Hello />
      <h1 className="mt-4 text-2xl">{t('user_data')}</h1>
      <pre>
        <code>{JSON.stringify(user, null, 2)}</code>
      </pre>
    </div>
  );
};

export default Dashboard;
