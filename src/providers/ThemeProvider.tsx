import { NextThemeProvider } from '@paalan/react-providers/NextThemeProvider';
import type { ComponentPropsWithoutRef, FC } from 'react';

export type ThemeProviderProps = ComponentPropsWithoutRef<typeof NextThemeProvider>;

export const ThemeProvider: FC<ThemeProviderProps> = ({ children, ...props }) => {
  return <NextThemeProvider {...props}>{children}</NextThemeProvider>;
};
