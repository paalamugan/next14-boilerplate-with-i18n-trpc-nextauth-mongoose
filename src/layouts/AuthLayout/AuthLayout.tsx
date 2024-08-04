import type { FC, PropsWithChildren } from 'react';

import { AuthGuard } from '@/layouts/AuthLayout/AuthGuard';

import { Header } from './Header';

export const AuthLayout: FC<PropsWithChildren> = ({ children }) => (
  <AuthGuard>
    <Header />
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">{children}</main>
  </AuthGuard>
);
