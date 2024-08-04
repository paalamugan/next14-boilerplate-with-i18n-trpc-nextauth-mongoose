import type { NextAuthConfig } from 'next-auth';

export const authBaseConfig = {
  session: {
    strategy: 'jwt',
  },
  pages: { signIn: '/signin', error: '/auth-error' },
  providers: [],
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
