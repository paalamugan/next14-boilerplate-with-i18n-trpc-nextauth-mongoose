import type { FC, PropsWithChildren } from 'react';

import { AuthGuard } from '@/components/Auth/AuthGuard';
import { UserStoreInitializer } from '@/components/Auth/UserStoreInitializer';
import { getMe } from '@/server/api/helpers/session';

const AuthLayout: FC<PropsWithChildren> = async ({ children }) => {
  const user = await getMe();

  return (
    <>
      <UserStoreInitializer user={user} />
      <AuthGuard>{children}</AuthGuard>
    </>
  );
};

export default AuthLayout;

export const dynamic = 'force-dynamic';
export const revalidate = 0;
