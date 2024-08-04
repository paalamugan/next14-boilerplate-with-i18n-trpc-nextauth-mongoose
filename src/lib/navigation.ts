import { createSharedPathnamesNavigation } from 'next-intl/navigation';

import siteConfig from '@/next-helpers/site.config';

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation({
  locales: siteConfig.locale.locales,
  localePrefix: siteConfig.locale.localePrefix,
});
