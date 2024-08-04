import { TRPCError } from '@trpc/server';
import argon2 from 'argon2';

import { TimeInSeconds } from '@/server/api/enums/time-in-seconds.enum';
import { type IUserData, UserModel } from '@/server/api/routers/users/model/user.model';
import { userRepository } from '@/server/api/routers/users/repository/user.repository';
import { createSecureCookie, deleteCookie } from '@/server/api/utils/cookie-management';
import { getTRPCError } from '@/server/api/utils/trpc-error';
import { redis } from '@/server/database/redis';
import { Logger } from '@/server/logger';

import { SESSION_TOKEN_COOKIE_KEY, SESSION_TOKENS_PREFIX, USER_ID_COOKIE_KEY } from '../constants';
import {
  type AccountVerifyArgs,
  type AddUserSessionArgs,
  type DeleteSessionTokenArgs,
  type ForgotPasswordArgs,
  type ResetPasswordArgs,
  type ServerSession,
  type SignInArgs,
  type SignOutAllSessionsArgs,
  type SignOutArgs,
  type SignUpArgs,
  type ValidateSessionTokenArgs,
  type ValidateSessionTokenResult,
} from './auth.service.types';

class AuthService {
  private readonly logger = new Logger(AuthService.name);

  getSessionTokensKey = (userId: IUserData['id']): string => {
    return `${SESSION_TOKENS_PREFIX}${userId}`;
  };

  private async addUserSession(args: AddUserSessionArgs): Promise<void> {
    const sessionKey = this.getSessionTokensKey(args.userId);
    const score = Math.floor(Date.now() / 1000) + args.expiresIn; // Current time + expiration time in seconds

    const pipeline = redis.multi();
    pipeline.zadd(sessionKey, score.toString(), args.sessionToken);
    pipeline.zcount(sessionKey, '-inf', '+inf');
    pipeline.expire(sessionKey, args.expiresIn);

    const results = await pipeline.exec();
    const sessionTokensCount = results?.[1]?.[1];
    if (
      !Array.isArray(results) ||
      results.some(result => result[0] !== null) ||
      typeof sessionTokensCount !== 'number'
    ) {
      // TODO: Logging
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to add user session',
      });
    }

    const SESSIONS_TOKEN_LIMIT = 8;
    if (sessionTokensCount > SESSIONS_TOKEN_LIMIT) {
      const tokensToRemove = sessionTokensCount - 8;
      pipeline.zremrangebyrank(sessionKey, 0, tokensToRemove - 1);
    }

    await pipeline.exec();
  }

  private async deleteSessionToken(args: DeleteSessionTokenArgs): Promise<void> {
    const sessionKey = this.getSessionTokensKey(args.userId);
    await redis.zrem(sessionKey, args.sessionToken);
  }

  private async isTokenAboutToExpire(
    userId: IUserData['id'],
    decodedSessionToken: string
  ): Promise<boolean> {
    const sessionKey = this.getSessionTokensKey(userId);
    const score = await redis.zscore(sessionKey, decodedSessionToken);
    const currentTimestamp = Math.floor(Date.now() / 1000);
    return score !== null && parseInt(score, 10) - currentTimestamp < TimeInSeconds.OneWeek;
  }

  private async generateSessionToken(userId: IUserData['id']): Promise<string> {
    const rawToken = `${userId}-${Date.now()}-${Math.random()}`;
    const hashedToken = await argon2.hash(rawToken);
    return hashedToken;
  }

  private async renewSessionTokenAndCookies(
    userId: IUserData['id'],
    headers: Headers
  ): Promise<string> {
    const expiresIn = 60 * 60 * 24 * 5; // Renew for another 5 days
    const newSessionToken = await this.generateSessionToken(userId);
    await this.addUserSession({
      userId,
      sessionToken: newSessionToken,
      expiresIn,
    });

    createSecureCookie({
      headers,
      expiresInSeconds: expiresIn,
      name: SESSION_TOKEN_COOKIE_KEY,
      value: encodeURIComponent(newSessionToken),
    });

    return newSessionToken;
  }

  verifySessionTokenFromCookies = (headers: Headers) => {
    const sessionToken = headers
      .get('cookie')
      ?.split(';')
      .find(cookie => {
        return cookie.trim().startsWith(SESSION_TOKEN_COOKIE_KEY);
      });

    const userId = headers
      .get('cookie')
      ?.split(';')
      .find(cookie => {
        return cookie.trim().startsWith(USER_ID_COOKIE_KEY);
      });

    if (!sessionToken || !userId) return null;

    const encodedSessionToken = sessionToken.split('=')[1];
    const userIdValue = userId.split('=')[1];

    if (!encodedSessionToken || !userIdValue) return null;

    return {
      encodedSessionToken,
      userId: userIdValue,
    };
  };

  checkSessionTokenValidity = async (
    userId: IUserData['id'],
    sessionToken: string
  ): Promise<boolean> => {
    const sessionKey = this.getSessionTokensKey(userId);
    const score = await redis.zscore(sessionKey, sessionToken);
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (score !== null && parseInt(score, 10) > currentTimestamp) {
      return true;
    }

    await redis.zrem(sessionKey, sessionToken);
    return false;
  };

  signIn = async (args: SignInArgs): Promise<ServerSession> => {
    const {
      input: { credentials },
      headers,
    } = args;
    try {
      const verifiedUser = await userRepository.verifyCredentials(credentials);
      const user = verifiedUser.toClientObject();

      const expiresIn = TimeInSeconds.TwoWeeks;
      const sessionToken = await this.generateSessionToken(user.id);
      await this.addUserSession({
        userId: user.id,
        sessionToken,
        expiresIn,
      });

      createSecureCookie({
        headers,
        expiresInSeconds: expiresIn,
        name: SESSION_TOKEN_COOKIE_KEY,
        value: encodeURIComponent(sessionToken),
      });

      createSecureCookie({
        headers,
        expiresInSeconds: expiresIn,
        name: USER_ID_COOKIE_KEY,
        value: user.id,
      });

      return {
        user,
        sessionToken,
      };
    } catch (error: unknown) {
      throw getTRPCError(error);
    }
  };

  signUp = async (args: SignUpArgs) => {
    const { input } = args;
    const newUser = await userRepository.createUser({ data: input });

    if (!newUser) {
      throw getTRPCError('Failed to create user');
    }

    return newUser.toClientObject();
  };

  signOut = async (args: SignOutArgs): Promise<void> => {
    await this.deleteSessionToken({
      userId: args.session.user.id,
      sessionToken: args.session.sessionToken,
    });

    this.logger.info('User signed out successfully: ', args.session.user.id);

    deleteCookie({
      headers: args.headers,
      name: SESSION_TOKEN_COOKIE_KEY,
    });

    deleteCookie({
      headers: args.headers,
      name: USER_ID_COOKIE_KEY,
    });
  };

  validateSessionToken = async (
    args: ValidateSessionTokenArgs
  ): Promise<ValidateSessionTokenResult> => {
    const decodedSessionToken = decodeURIComponent(args.encodedSessionToken);
    const isSessionTokenValid = await this.checkSessionTokenValidity(
      args.userId,
      decodedSessionToken
    );

    if (!isSessionTokenValid) {
      return {
        success: false,
      };
    }

    let finalSessionToken = decodedSessionToken;
    if (await this.isTokenAboutToExpire(args.userId, decodedSessionToken)) {
      finalSessionToken = await this.renewSessionTokenAndCookies(args.userId, args.headers);
    }

    return {
      success: true,
      userInfo: await userRepository.getUserById(args.userId, {
        includeSensitiveInfo: true,
      }),
      sessionToken: finalSessionToken,
    };
  };

  removeAllSessions = async (args: SignOutAllSessionsArgs) => {
    const sessionKey = this.getSessionTokensKey(args.userId);
    await redis.del(sessionKey);

    deleteCookie({
      name: SESSION_TOKEN_COOKIE_KEY,
      headers: args.headers,
    });

    deleteCookie({
      name: USER_ID_COOKIE_KEY,
      headers: args.headers,
    });
  };

  accountVerify = async (args: AccountVerifyArgs) => {
    const { input } = args;
    const user = await UserModel.findOne({ verifyToken: input.token });
    if (!user) {
      throw new Error('Verification token is invalid!');
    }

    user.verified = true;
    user.verifyToken = undefined;
    user.lastLogin = new Date();

    const savedUser = await user.save();
    return savedUser.toClientObject();
  };

  forgotPassword = async (args: ForgotPasswordArgs) => {
    const { input } = args;
    try {
      const email = input.email.toLowerCase().trim();

      const userDoc = await userRepository.forgotPassword({ email });

      // Send email for forget password change
      const emailData = {
        email: userDoc.email,
        username: userDoc.username,
        token: userDoc.resetPasswordToken,
      };

      this.logger.info(`Forgot password email sent to ${emailData.email}`);
      // TODO: Implement email service
      // email.send('forgot-password', { to: data.email }, data)

      return { success: true };
    } catch (error) {
      throw getTRPCError(error);
    }
  };

  resetPassword = async (args: ResetPasswordArgs) => {
    const { input } = args;

    const userDoc = await userRepository.resetPassword(input);

    // Send email for password change
    const emailData = {
      username: userDoc.username,
      email: userDoc.email,
    };

    this.logger.info(`Password reset email sent to ${emailData.email}`);
    // TODO: Implement email service
    // email.send('reset-password', { to: emailData.email }, emailData)

    return { success: true };
  };
}

export const authService = new AuthService();
