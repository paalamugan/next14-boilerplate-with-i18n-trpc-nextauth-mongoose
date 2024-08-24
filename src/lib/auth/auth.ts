import NextAuth from 'next-auth';

import { authConfig } from './auth.config';

export const { handlers, signIn, signOut, auth: getSession } = NextAuth(authConfig);
