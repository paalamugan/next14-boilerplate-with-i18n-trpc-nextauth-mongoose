import siteConfig from '@/next-helpers/site.config';

export const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export const getI18nPath = (url: string, locale: string) => {
  if (locale === siteConfig.locale.defaultLocale) {
    return url;
  }

  return `/${locale}${url}`;
};
