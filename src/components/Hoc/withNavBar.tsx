'use client';

import { useNextTheme } from '@paalan/react-providers/NextThemeProvider';
import { useLocale } from 'next-intl';
import { type FC } from 'react';

import NavBar from '@/components/Common/NavBar';
import { useNavigationConfig } from '@/hooks';
import { usePathname, useRouter } from '@/lib/navigation';
import { availableLocales } from '@/next-helpers/next.locales';

export const WithNavBar: FC = () => {
  const { authNavigationItems } = useNavigationConfig();
  const { resolvedTheme, setTheme } = useNextTheme();
  const pathname = usePathname();
  const router = useRouter();

  const locale = useLocale();

  const toggleCurrentTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const onLanguageChange = (code: string) => {
    router.replace(pathname!, { locale: code });
    router.refresh();
  };

  return (
    <NavBar
      onThemeTogglerClick={toggleCurrentTheme}
      languages={{
        currentLanguage: locale,
        availableLanguages: availableLocales,
        onChange: localeData => onLanguageChange(localeData.code),
      }}
      navItems={authNavigationItems.map(([, { label, link, target, icon }]) => ({
        link,
        text: label,
        target,
        icon,
      }))}
    />
  );
};
