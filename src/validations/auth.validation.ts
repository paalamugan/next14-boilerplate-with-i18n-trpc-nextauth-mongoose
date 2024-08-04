import { z } from 'zod';

export const userProviderSchema = z.enum(['email', 'google', 'facebook', 'github']);
export type UserProviderSchema = z.infer<typeof userProviderSchema>;

export const signInValidationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});
export type SignInValidationSchemaType = z.infer<typeof signInValidationSchema>;

export const signUpValidationSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(4),
  provider: userProviderSchema,
});
export type SignUpValidationSchemaType = z.infer<typeof signUpValidationSchema>;
