'use client';

import { NextThemeProvider } from '@paalan/react-providers/NextThemeProvider';
import { toast } from '@paalan/react-ui';
import { useSearchParams } from 'next/navigation';
import { type ComponentPropsWithoutRef, type FC, useEffect } from 'react';

import { usePathname, useRouter } from '@/lib/navigation';

export type ThemeProviderProps = ComponentPropsWithoutRef<typeof NextThemeProvider> & {
  enableGlobalToaster?: boolean;
};

export const ThemeProvider: FC<ThemeProviderProps> = ({
  children,
  enableGlobalToaster,
  ...props
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const message = searchParams.get('message');
    const error = searchParams.get('error');
    const success = searchParams.get('success');

    if (!enableGlobalToaster || (!message && !error && !success)) return;

    let toastType;
    if (message) {
      toastType = toast;
    } else if (success) {
      toastType = toast.success;
    } else {
      toastType = toast.error;
    }

    toastType(message || success || error);

    const newSearchParams = new URLSearchParams(searchParams.toString());
    const paramsToRemove = ['message', 'error', 'success'];
    paramsToRemove.forEach(param => newSearchParams.delete(param));
    const redirectPath = `${pathname}?${newSearchParams.toString()}`;
    router.replace(redirectPath, { scroll: false });
  }, [pathname, router, searchParams, enableGlobalToaster]);

  return <NextThemeProvider {...props}>{children}</NextThemeProvider>;
};
