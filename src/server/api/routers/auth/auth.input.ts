import { z } from 'zod';

import { signInValidationSchema, signUpValidationSchema } from '@/validations/auth.validation';

export const signInInputSchema = z.object({
  credentials: signInValidationSchema,
});
export type SignInInputSchemaType = z.infer<typeof signInInputSchema>;

export const signUpInputSchema = signUpValidationSchema;
export type SignUpInputSchema = z.infer<typeof signUpInputSchema>;

export const accountVerifyInputSchema = z.object({
  token: z.string(),
});
export type AccountVerifyInputSchema = z.infer<typeof accountVerifyInputSchema>;

export const resetPasswordInputSchema = z.object({
  passwordToken: z.string(),
  password: z.string().min(4),
  email: z.string().email(),
});
export type ResetPasswordInputSchema = z.infer<typeof resetPasswordInputSchema>;

export const forgotPasswordInputSchema = z.object({
  email: z.string().email(),
});
export type ForgotPasswordInputSchema = z.infer<typeof forgotPasswordInputSchema>;
