import '@paalan/react-ui/styles.css';
import '@/styles/globals.css';

import { cn } from '@paalan/react-shared/lib';
import type { Metadata } from 'next';
import { getLocale, unstable_setRequestLocale } from 'next-intl/server';
import NextTopLoader from 'nextjs-toploader';
import type { FC, PropsWithChildren } from 'react';

import BaseLayout from '@/layouts/BaseLayout';
import { INTER, OPEN_SANS } from '@/lib/next-fonts';
import { allLocaleCodes, availableLocalesMap, defaultLocale } from '@/next-helpers/next.locales';
import siteConfig from '@/next-helpers/site.config';
import { Providers } from '@/providers/providers';

const fontClasses = cn(INTER.variable, OPEN_SANS.variable);

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  icons: [
    {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/static/favicons/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/static/favicons/favicon-16x16.png',
    },
    {
      rel: 'icon',
      url: '/static/favicons/favicon.ico',
    },
  ],
};

const RootLayout: FC<PropsWithChildren> = async ({ children }) => {
  const locale = await getLocale();

  const { langDir, hrefLang } = availableLocalesMap[locale] || defaultLocale;

  if (!allLocaleCodes.includes(locale)) {
    // Forces the current locale to be the Default Locale
    unstable_setRequestLocale(defaultLocale.code);
  }

  // Configures the current Locale to be the given Locale of the Request
  unstable_setRequestLocale(locale);

  return (
    <html className={fontClasses} dir={langDir} lang={hrefLang} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <NextTopLoader height={5} />
          <BaseLayout>{children}</BaseLayout>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;

export const dynamic = 'force-dynamic';
