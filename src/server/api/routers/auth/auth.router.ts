import { TRPCError } from '@trpc/server';

// import { type MeQueryResult } from '@/server/api/routers/auth/auth.types';
import { authService } from '@/server/api/routers/auth/service/auth.service';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';
import { Logger } from '@/server/logger/logger';

import type { IUserData } from '../users/model/user.model';
import {
  accountVerifyInputSchema,
  forgotPasswordInputSchema,
  resetPasswordInputSchema,
  signInInputSchema,
  signUpInputSchema,
} from './auth.input';

export const authRouter = createTRPCRouter({
  signIn: publicProcedure.input(signInInputSchema).mutation(async ({ input, ctx }) => {
    const result = await authService.signIn({ input, headers: ctx.headers });
    return result;
  }),

  signUp: publicProcedure.input(signUpInputSchema).mutation(async ({ input, ctx }) => {
    const result = await authService.signUp({ input, headers: ctx.headers });
    return result;
  }),

  me: protectedProcedure.query(async ({ ctx }) => {
    return {
      user: ctx.session.user,
    };
  }),

  signOut: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      await authService.signOut({
        session: ctx.session,
        headers: ctx.headers,
      });
    } catch (error: unknown) {
      Logger.error('Failed to signOut', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to signOut',
      });
    }
  }),

  signOutAllSessions: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      await authService.removeAllSessions({ headers: ctx.headers, userId: ctx.session.user.id });
    } catch (error: unknown) {
      Logger.error('Failed to signOut all sessions', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to signOut all sessions',
      });
    }
  }),

  accountVerify: publicProcedure
    .input(accountVerifyInputSchema)
    .mutation(async ({ input }): Promise<IUserData> => {
      const result = await authService.accountVerify({ input });
      return result;
    }),

  resetPassword: publicProcedure.input(resetPasswordInputSchema).mutation(async ({ input }) => {
    const result = await authService.resetPassword({ input });
    return result;
  }),

  forgotPassword: publicProcedure.input(forgotPasswordInputSchema).mutation(async ({ input }) => {
    const result = await authService.forgotPassword({ input });
    return result;
  }),
});
