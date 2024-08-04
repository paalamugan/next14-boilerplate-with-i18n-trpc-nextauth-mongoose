import { Card, CardContent, CardDescription, CardHeader, CardTitle, Text } from '@paalan/react-ui';

import Link from '@/components/Link';

import { SignUpForm } from './_components/SignUpForm';

const SignUpPage = () => {
  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>Enter your information to create an account</CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm />
        <Text fontSize="base" className="text-center">
          Already have an account?{' '}
          <Link href="/signin" className="text-primary underline">
            Sign in
          </Link>
        </Text>
      </CardContent>
    </Card>
  );
};

export default SignUpPage;
