import { userProviderSchema } from '@/validations/auth.validation';

import type { IUserData } from '../../users/model/user.model';
import { ADMIN_CREDENTIALS, AUTH_ROLES } from '../constants';

const rootAdminUser: IUserData = {
  id: 'root-admin-user-id',
  username: ADMIN_CREDENTIALS.username,
  email: `${ADMIN_CREDENTIALS.username.toLowerCase()}@example.com`,
  rawPassword: ADMIN_CREDENTIALS.password,
  firstName: 'Admin',
  lastName: 'Admin',
  role: AUTH_ROLES.ADMIN,
  verified: true,
  fullName: 'Admin Admin',
  provider: userProviderSchema.enum.email,
};

export const isRootAdminUser = (email: string) => {
  return rootAdminUser.username === email || rootAdminUser.email === email;
};

export const getRootAdminUser = () => rootAdminUser;
