import type { PropsWithChildren } from 'react';

import { TRPCReactProvider } from '@/trpc/client';

import { LocaleProvider } from './LocaleProvider';
import { ThemeProvider } from './ThemeProvider';

export const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <TRPCReactProvider>
      <LocaleProvider>
        <ThemeProvider attribute="class">{children}</ThemeProvider>
      </LocaleProvider>
    </TRPCReactProvider>
  );
};
