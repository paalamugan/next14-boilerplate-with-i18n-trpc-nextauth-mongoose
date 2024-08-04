import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { UserModel } from '@/server/api/routers/users/model/user.model';
import { mongodbConnect } from '@/server/database/mongodb';
import { signInValidationSchema } from '@/validations/auth.validation';

export const authConfig = {
  session: {
    strategy: 'jwt',
  },
  pages: { signIn: '/signin', error: '/auth-error' },
  providers: [
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
  callbacks: {
    async jwt({ token, user }) {
      const newToken = { ...token };
      if (user) {
        newToken.id = user.id || '';
        newToken.email = user.email || '';
        newToken.name = user.name || '';
      }

      return newToken;
    },
    async session({ token, session }) {
      const newSession = { ...session };
      if (token) {
        newSession.user = {
          ...newSession.user,
          id: token.id || '',
          email: token.email || '',
          name: token.name,
        };
      }
      return newSession;
    },
  },
} satisfies NextAuthConfig;
