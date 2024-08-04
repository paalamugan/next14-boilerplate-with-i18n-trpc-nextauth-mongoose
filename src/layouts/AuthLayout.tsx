import type { FC, PropsWithChildren } from 'react';

import { WithNavBar } from '@/components/Hoc/withNavBar';

export const AuthLayout: FC<PropsWithChildren> = ({ children }) => (
  <>
    <WithNavBar />
    <main className="container">{children}</main>
  </>
);
