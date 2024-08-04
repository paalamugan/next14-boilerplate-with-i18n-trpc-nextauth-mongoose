import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

import { userService } from './service/user.service';
import { createUserInputSchema } from './user.input';

export const userRouter = createTRPCRouter({
  userById: protectedProcedure.query(async ({ ctx }) => {
    return userService.getUserById({ id: ctx.session.user.id });
  }),
  createUser: protectedProcedure.input(createUserInputSchema).mutation(async ({ input }) => {
    return userService.createUser({ input });
  }),
});
