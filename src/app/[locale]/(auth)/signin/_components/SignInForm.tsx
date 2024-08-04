'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormRoot,
  Input,
  useToast,
} from '@paalan/react-ui';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { type FC, useState } from 'react';
import { useForm } from 'react-hook-form';

import Link from '@/components/Link';
import { useRouter } from '@/lib/navigation';
import {
  signInValidationSchema,
  type SignInValidationSchemaType,
} from '@/validations/auth.validation';

type SignInFormProps = {};
export const SignInForm: FC<SignInFormProps> = () => {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/dashboard';
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(signInValidationSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (credentials: SignInValidationSchemaType) => {
    try {
      setIsSubmitting(true);
      const response = await signIn('credentials', {
        ...credentials,
        callbackUrl: redirectTo,
        redirect: false,
      });
      if (response?.error) {
        throw new Error('Invalid email or password.');
      }
      if (response?.url) {
        toast.success('Signed in successfully');
        router.push(response.url);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to sign in');
      } else {
        toast.error('Failed to sign in');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormRoot {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="email">Email</FormLabel>
              <FormControl>
                <Input id="email" placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center">
                <FormLabel htmlFor="password">Password</FormLabel>
                <Link href="/forgot-password" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </Link>
              </div>
              <FormControl>
                <Input id="password" placeholder="Enter your password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </FormRoot>
  );
};
