import { z } from 'zod';

import { signUpValidationSchema } from '@/validations/auth.validation';

export const createUserInputSchema = signUpValidationSchema;
export type CreateUserInputSchema = z.infer<typeof createUserInputSchema>;

export const updateUserInputSchema = z.object({
  id: z.string(),
  data: createUserInputSchema.omit({ password: true, provider: true }).optional(),
});

export type UpdateUserInputSchema = z.infer<typeof updateUserInputSchema>;
