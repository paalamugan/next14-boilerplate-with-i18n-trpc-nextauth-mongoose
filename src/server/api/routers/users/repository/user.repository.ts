import { TRPCError } from '@trpc/server';
import { DateTime } from 'luxon';
import { z } from 'zod';

import { generateRandomToken } from '@/server/api/helpers/common';
import { type ServerSession } from '@/server/api/routers/auth/service/auth.service.types';
import {
  type ChangePasswordParams,
  type CreateUserParams,
  type ForgotPasswordParams,
  type GetUserByIdOptions,
  type ResetPasswordParams,
  type UpdateUserParams,
  type VerifyCredentialsParams,
} from '@/server/api/routers/users/repository/user.repository.types';
import { redis } from '@/server/database/redis';
import { Logger } from '@/server/logger/logger';

import { AUTH_ROLES } from '../../auth/constants';
import { getRootAdminUser, isRootAdminUser } from '../../auth/helpers/auth.helper';
import { type IUserData, type IUserSchema, UserModel } from '../model/user.model';

class UserRepository {
  private readonly logger = new Logger(UserRepository.name);

  private getUserInfoKey = (userId: IUserSchema['id']): string => {
    return `user-info:${userId}`;
  };

  private cacheUserInfo = async (user: ServerSession['user']): Promise<void> => {
    const userKey = this.getUserInfoKey(user.id);
    await redis.set(
      userKey,
      JSON.stringify(user),
      'EX',
      60 * 60 * 24 * 7 // 7 days in seconds
    );
  };

  private getCachedUserInfo = async (
    userId: ServerSession['user']['id']
  ): Promise<ServerSession['user'] | null> => {
    const userKey = this.getUserInfoKey(userId);
    const cachedUserInfo = await redis.get(userKey);
    return cachedUserInfo !== null ? (JSON.parse(cachedUserInfo) as ServerSession['user']) : null;
  };

  getUserById = async <T extends boolean = false>(
    id: IUserData['id'],
    options?: GetUserByIdOptions<T>
  ): Promise<(T extends true ? ServerSession['user'] : IUserData) | null> => {
    const rootUser = getRootAdminUser();
    if (rootUser.username === id || rootUser.id === id) return rootUser; // Return root user if id is root user

    const { includeSensitiveInfo = false, bypassCache = false } = options ?? {};
    if (!bypassCache) {
      const cachedUserInfo = await this.getCachedUserInfo(id);
      if (cachedUserInfo) {
        if (includeSensitiveInfo) return cachedUserInfo;

        delete cachedUserInfo.hash;
        delete cachedUserInfo.salt;

        return cachedUserInfo satisfies IUserData as T extends true
          ? ServerSession['user']
          : IUserData;
      }
    }

    let userData: ServerSession['user'] | null = null;

    try {
      const userDoc = await UserModel.get(id);
      userData = userDoc.toClientObject(includeSensitiveInfo);
    } catch (error) {
      this.logger.error('Failed to get user by id', error);
      return null;
    }

    if (userData) {
      this.cacheUserInfo(userData);
    }

    return userData ?? null;
  };

  getUserByIdOrThrow = async <T extends boolean = false>(
    id: IUserSchema['id'],
    options?: GetUserByIdOptions<T>
  ): Promise<T extends true ? ServerSession['user'] : IUserData> => {
    const user = await this.getUserById(id, options);
    if (user === null) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      });
    }
    return user;
  };

  verifyCredentials = async (credentials: VerifyCredentialsParams) => {
    try {
      const user = await UserModel.authenticate(credentials.email, credentials.password);
      user.set('lastLogin', new Date());
      const savedUser = await user.save();
      return savedUser;
    } catch (error) {
      this.logger.error('Failed to verify credentials', error);
      throw error;
    }
  };

  isUserExists = async (email: string) => {
    try {
      if (isRootAdminUser(email)) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Already admin has this name. So you cannot use this username!',
        });
      }

      const user = await UserModel.findOne({
        $or: [{ email }, { username: email }],
      });

      if (user) {
        const userEmail = user.email;
        const isEmail = z.string().email().safeParse(userEmail).success;

        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `${isEmail ? 'User with email ' : 'Username '}"${userEmail}" already exist."`,
        });
      }
    } catch (error) {
      this.logger.error('Failed to check if user exists', error);
      throw error;
    }
  };

  createUser = async ({ data }: CreateUserParams) => {
    try {
      await this.isUserExists(data.email);

      const dataBody: Omit<IUserData, 'id' | 'fullName'> = {
        ...data,
        username: data.email.split('@')[0] || data.firstName.toLowerCase(),
        verified: true,
        role: AUTH_ROLES.ADMIN,
      };

      const user = new UserModel(dataBody);
      await user.save();
      return user;
    } catch (error) {
      this.logger.error('Failed to create user', error);
      throw error;
    }
  };

  updateUser = async ({ userId, data }: UpdateUserParams) => {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(userId, data, { new: true }).exec();
      if (!updatedUser) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        });
      }
      this.cacheUserInfo(updatedUser.toClientObject(true));
      return updatedUser;
    } catch (error) {
      this.logger.error('Failed to update user', error);
      throw error;
    }
  };

  forgotPassword = async ({ email }: ForgotPasswordParams) => {
    const user = await UserModel.findByEmail(email);

    const token = generateRandomToken();
    user.resetPasswordToken = token;
    user.resetPasswordExpires = DateTime.now().plus({ hours: 24 }).toJSDate();

    try {
      return await user.save();
    } catch (error) {
      this.logger.error('Failed to save reset password token', error);
      throw error;
    }
  };

  resetPassword = async (params: ResetPasswordParams) => {
    const { email, passwordToken, password } = params;

    await UserModel.findByEmail(email);

    const user = await UserModel.findOne({
      resetPasswordToken: passwordToken,
      resetPasswordExpires: {
        $gt: Date.now(),
      },
    }).exec();

    if (!user) {
      throw new Error('Password reset token is invalid or has expired.');
    }

    user.set('password', password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    try {
      return await user.save();
    } catch (error) {
      this.logger.error('Failed to save reset password token', error);
      throw error;
    }
  };

  changePassword = async ({ userId, oldPassword, newPassword }: ChangePasswordParams) => {
    return UserModel.changePassword(userId, oldPassword, newPassword);
  };
}

export const userRepository = new UserRepository();
