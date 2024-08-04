import { UpstashRedisAdapter } from '@auth/upstash-redis-adapter';
import type { NextAuthConfig } from 'next-auth';

import { env } from '@/env';
import { upstashRedis } from '@/server/database/upstash-redis';

export const authBaseConfig = {
  adapter: upstashRedis
    ? UpstashRedisAdapter(upstashRedis, {
        baseKeyPrefix: env.UPSTASH_REDIS_REST_BASE_KEY_PREFIX,
      })
    : undefined,
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 7, // 7 day in seconds
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
