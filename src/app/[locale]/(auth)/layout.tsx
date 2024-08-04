import type { FC, PropsWithChildren } from 'react';

import { getSession } from '@/lib/auth/auth';
import { SessionProvider } from '@/providers/SessionProvider';

const AuthLayout: FC<PropsWithChildren> = async ({ children }) => {
  const session = await getSession();

  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default AuthLayout;

export const dynamic = 'force-dynamic';
export const revalidate = 0;
