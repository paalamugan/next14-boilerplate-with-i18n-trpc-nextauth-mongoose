import { env } from '@/env';

export const SESSION_TOKEN_COOKIE_KEY = 'x-session-token';
export const USER_ID_COOKIE_KEY = 'x-user-id';

export const SESSION_TOKENS_PREFIX = 'session-tokens:';

export const ADMIN_CREDENTIALS = {
  username: env.ADMIN_USERNAME || 'admin',
  password: env.ADMIN_PASSWORD || 'admin',
} as const;

export const AUTH_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;
