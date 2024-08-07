import { z } from 'zod';

import {
  baseSignUpValidationSchema,
  signInValidationSchema,
  signUpValidationSchema,
} from '@/validations/auth.validation';

export const signInInputSchema = signInValidationSchema;
export type SignInInputSchemaType = z.infer<typeof signInInputSchema>;

export const signUpInputSchema = signUpValidationSchema;
export type SignUpInputSchema = z.infer<typeof signUpInputSchema>;

export const accountVerifyInputSchema = z.object({
  token: z.string(),
});
export type AccountVerifyInputSchema = z.infer<typeof accountVerifyInputSchema>;

export const resetPasswordInputSchema = baseSignUpValidationSchema
  .pick({
    email: true,
    password: true,
  })
  .extend({
    passwordToken: z.string(),
  });
export type ResetPasswordInputSchema = z.infer<typeof resetPasswordInputSchema>;

export const forgotPasswordInputSchema = baseSignUpValidationSchema.pick({ email: true });
export type ForgotPasswordInputSchema = z.infer<typeof forgotPasswordInputSchema>;
