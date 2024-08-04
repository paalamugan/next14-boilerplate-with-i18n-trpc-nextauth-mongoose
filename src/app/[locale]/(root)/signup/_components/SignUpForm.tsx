'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Form, type FormItemField, useToast } from '@paalan/react-ui';
import type { FC } from 'react';
import { useForm } from 'react-hook-form';

import { UserProviderEnum } from '@/enums/user.enum';
import { useRouter } from '@/lib/navigation';
import { api } from '@/trpc/client';
import {
  signUpValidationSchema,
  type SignUpValidationSchemaType,
} from '@/validations/auth.validation';

const fields: FormItemField[] = [
  {
    name: 'firstName',
    label: 'First name',
    type: 'input',
    placeholder: 'Enter your first name',
    required: true,
  },
  {
    name: 'lastName',
    label: 'Last name',
    type: 'input',
    placeholder: 'Enter your last name',
    required: true,
  },
  {
    name: 'email',
    label: 'Email',
    type: 'input',
    inputType: 'email',
    placeholder: 'Enter your email',
    required: true,
    formItemClassName: 'col-span-2',
  },
  {
    name: 'password',
    label: 'Password',
    type: 'input',
    inputType: 'password',
    placeholder: 'Enter your password',
    formItemClassName: 'col-span-2',
    required: true,
  },
];

export const SignUpForm: FC = () => {
  const toast = useToast();
  const router = useRouter();

  const signUpMutation = api.auth.signUp.useMutation();

  const form = useForm<SignUpValidationSchemaType>({
    resolver: zodResolver(signUpValidationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      provider: UserProviderEnum.email,
    },
  });

  const onSubmitHandle = async (values: SignUpValidationSchemaType) => {
    try {
      await signUpMutation.mutateAsync(values);
      toast.success('Account created successfully');
      router.push('/signin');
    } catch (error) {
      const errorMessage = (error as Error).message;
      toast.error(errorMessage);
    }
  };

  return (
    <Form<SignUpValidationSchemaType>
      fields={fields}
      form={form}
      onSubmit={onSubmitHandle}
      hideResetButton
      submitText="Create an account"
      actionClassName="col-span-2"
      submitClassName="w-full"
      className="grid grid-cols-2 gap-4 space-y-0"
    />
  );
};
