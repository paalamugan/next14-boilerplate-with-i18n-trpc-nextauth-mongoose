import NextAuth from 'next-auth';

import { userRepository } from '@/server/api/routers/users/repository/user.repository';
import { mongodbConnect } from '@/server/database/mongodb';

import { authConfig } from './auth.config';

export const { handlers, signIn, signOut, auth: getSession } = NextAuth(authConfig);

export const auth = async () => {
  const session = await NextAuth(authConfig).auth();
  if (!session?.user) throw new Error('Not authenticated.');
  if (!session.user.id) throw new Error('User ID not found.');

  await mongodbConnect();

  const user = await userRepository.getUserByIdOrThrow(session.user.id);
  return user;
};
