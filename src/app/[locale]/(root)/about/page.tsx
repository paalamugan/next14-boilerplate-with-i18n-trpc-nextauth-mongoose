import { getTranslations } from 'next-intl/server';
import type { FC } from 'react';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'About',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

type AboutProps = {
  params: {
    locale: string;
  };
};
const About: FC<AboutProps> = async ({ params }) => {
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'About',
  });

  return <p>{t('about_paragraph')}</p>;
};

export default About;
