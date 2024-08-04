import type { CreateUserInputSchema, UpdateUserInputSchema } from '../user.input';

export type GetUserByIdArgs = {
  id: string;
};

export type CreateUserArgs = {
  input: CreateUserInputSchema;
};

export type UpdateUserArgs = {
  input: UpdateUserInputSchema;
};
