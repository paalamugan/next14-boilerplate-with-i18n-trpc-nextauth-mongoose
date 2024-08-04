import { z } from 'zod';

export const userProviderSchema = z.enum(['email', 'google', 'facebook', 'github']);
export type UserProviderSchema = z.infer<typeof userProviderSchema>;

export const signInValidationSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email' }),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters' }),
});
export type SignInValidationSchemaType = z.infer<typeof signInValidationSchema>;

export const baseSignUpValidationSchema = signInValidationSchema.extend({
  firstName: z
    .string({ required_error: 'First name is required' })
    .min(1, { message: 'First name is required' }),
  lastName: z
    .string({ required_error: 'Last name is required' })
    .min(1, { message: 'Last name is required' }),
  confirmPassword: z.string({ required_error: 'Password confirmation is required' }),
  provider: userProviderSchema,
});

export const signUpValidationSchema = baseSignUpValidationSchema.refine(
  ({ password, confirmPassword }) => password === confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }
);
export type SignUpValidationSchemaType = z.infer<typeof signUpValidationSchema>;

export const forgotPasswordValidationSchema = signInValidationSchema.pick({ email: true });
export type ForgotPasswordValidationSchemaType = z.infer<typeof forgotPasswordValidationSchema>;
