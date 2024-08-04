import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@paalan/react-ui';
import { getTranslations } from 'next-intl/server';

import Link from '@/components/Link';
import { CenteredLayout } from '@/layouts/CenteredLayout';

import { SignInForm } from './_components/SignInForm';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'SignIn',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

const SignInPage = () => {
  return (
    <CenteredLayout>
      <Card className="mx-auto mt-4 max-w-lg border-0 shadow-none sm:mt-12 sm:border sm:shadow-sm md:mt-20 lg:mt-24 xl:mt-28">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <SignInForm />
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </CenteredLayout>
  );
};

export default SignInPage;
