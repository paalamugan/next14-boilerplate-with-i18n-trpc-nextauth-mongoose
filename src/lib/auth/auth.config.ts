import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { UserModel } from '@/server/api/routers/users/model/user.model';
import { mongodbConnect } from '@/server/database/mongodb';
import { signInValidationSchema } from '@/validations/auth.validation';

import { authBaseConfig } from './auth.base.config';

export const authConfig = {
  ...authBaseConfig,
  providers: [
    ...authBaseConfig.providers,
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async credentials => {
        const { email, password } = await signInValidationSchema.parseAsync(credentials);
        await mongodbConnect();
        const user = await UserModel.authenticate(email, password);
        const userObj = user.toClientObject();
        return {
          id: userObj.id,
          email: userObj.email,
          name: userObj.fullName,
        };
      },
    }),
  ],
} satisfies NextAuthConfig;
