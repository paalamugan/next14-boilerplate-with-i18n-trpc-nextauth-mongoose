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
import type { FC } from 'react';
import { useForm } from 'react-hook-form';

import { api } from '@/trpc/client';
import {
  forgotPasswordValidationSchema,
  type ForgotPasswordValidationSchemaType,
} from '@/validations/auth.validation';

export const ForgotPasswordForm: FC = () => {
  const form = useForm({
    resolver: zodResolver(forgotPasswordValidationSchema),
    defaultValues: {
      email: '',
    },
  });
  const toast = useToast();

  const forgotPasswordMutation = api.auth.forgotPassword.useMutation({
    onSuccess(data) {
      if (!data.success) {
        toast.error('Failed to send verification email');
        return;
      }
      toast.success('Verification email sent successfully');
    },
    onError(error) {
      toast.error(error.message || 'Failed to send verification email');
    },
  });

  const onSubmit = async (values: ForgotPasswordValidationSchemaType) => {
    forgotPasswordMutation.mutate(values);
  };

  const isLoading = forgotPasswordMutation.isPending;
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
                <Input id="email" placeholder="Enter your registered email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" isLoading={isLoading}>
          {isLoading ? 'Sending...' : 'Send verification email'}
        </Button>
      </form>
    </FormRoot>
  );
};
