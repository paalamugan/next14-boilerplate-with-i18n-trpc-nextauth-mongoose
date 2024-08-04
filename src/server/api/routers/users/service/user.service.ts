import { TRPCError } from '@trpc/server';

import { userRepository } from '@/server/api/routers/users/repository/user.repository';
import { Logger } from '@/server/logger';

import type { CreateUserArgs, GetUserByIdArgs, UpdateUserArgs } from './user.service.types';

class UserService {
  private readonly logger = new Logger(UserService.name);

  getUserById = async ({ id }: GetUserByIdArgs) => {
    try {
      if (!id) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'User ID is required',
        });
      }
      const user = await userRepository.getUserById(id);
      return user;
    } catch (error: unknown) {
      this.logger.error('Failed to get user by id', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to get user by id',
      });
    }
  };

  createUser = async ({ input }: CreateUserArgs) => {
    try {
      const user = await userRepository.createUser({ data: input });
      return user;
    } catch (error: unknown) {
      this.logger.error('Failed to create user', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create user',
      });
    }
  };

  updateUser = async ({ input }: UpdateUserArgs) => {
    const { id, data } = input;
    try {
      const user = await userRepository.updateUser({ userId: id, data });
      return user;
    } catch (error: unknown) {
      this.logger.error('Failed to update user', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to update user',
      });
    }
  };
}

export const userService = new UserService();
