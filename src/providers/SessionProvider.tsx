'use client';

import type { SessionProviderProps as NextSessionProviderProps } from 'next-auth/react';
import { SessionProvider as NextSessionProvider } from 'next-auth/react';
import type { FC } from 'react';

export type SessionProviderProps = NextSessionProviderProps;
export const SessionProvider: FC<SessionProviderProps> = ({ children, ...props }) => {
  return <NextSessionProvider {...props}>{children}</NextSessionProvider>;
};
