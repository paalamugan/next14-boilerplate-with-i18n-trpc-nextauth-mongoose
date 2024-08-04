import { cookies } from 'next/headers';

import { SESSION_TOKEN_COOKIE_KEY, USER_ID_COOKIE_KEY } from '@/server/api/routers/auth/constants';

export const verifySessionTokenFromCookies = () => {
  const encodedSessionToken = cookies().get(SESSION_TOKEN_COOKIE_KEY)?.value;
  const userId = cookies().get(USER_ID_COOKIE_KEY)?.value;

  if (!encodedSessionToken || !userId) return null;

  return {
    encodedSessionToken,
    userId,
  };
};
