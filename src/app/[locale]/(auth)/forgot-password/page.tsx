import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@paalan/react-ui';
import { getTranslations } from 'next-intl/server';

import Link from '@/components/Link';
import { CenteredLayout } from '@/layouts/CenteredLayout';

import { ForgotPasswordForm } from './_components/ForgotPasswordForm';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'ForgotPassword',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

const ForgotPasswordPage = () => {
  return (
    <CenteredLayout>
      <Card className="mx-auto mt-4 max-w-md border-0 shadow-none sm:mt-12 sm:border sm:shadow-sm md:mt-20 lg:mt-24 xl:mt-28">
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>Enter your email below to reset your password</CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
          <div className="mt-4 text-center text-sm">
            Remember your password?{' '}
            <Link href="/signin" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </CenteredLayout>
  );
};

export default ForgotPasswordPage;
