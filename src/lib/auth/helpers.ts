import { userRepository } from '@/server/api/routers/users/repository/user.repository';
import { mongodbConnect } from '@/server/database/mongodb';

import { getSession } from './auth';

export const auth = async () => {
  const session = await getSession();
  if (!session?.user) throw new Error('Not authenticated.');
  if (!session.user.id) throw new Error('User ID not found.');

  await mongodbConnect();

  const user = await userRepository.getUserByIdOrThrow(session.user.id);
  return user;
};
