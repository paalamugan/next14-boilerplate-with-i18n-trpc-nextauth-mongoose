import { getTranslations } from 'next-intl/server';

import { Hello } from './_components/Hello';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'Dashboard',
  });

  return {
    title: t('meta_title'),
  };
}

const Dashboard = async () => {
  return (
    <div className="[&_p]:my-6">
      <Hello />
    </div>
  );
};

export default Dashboard;
