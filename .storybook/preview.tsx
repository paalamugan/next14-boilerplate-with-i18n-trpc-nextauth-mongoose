/* eslint-disable import/no-extraneous-dependencies */

import '../src/styles/globals.css';
import '@/lib/next-fonts';

import { withThemeByDataAttribute } from '@storybook/addon-themes';
import type { Preview, ReactRenderer } from '@storybook/react';
import { NextIntlClientProvider } from 'next-intl';

import englishLocale from '@/i18n/locales/en.json';
import { ThemeProvider } from '@/providers/ThemeProvider';

import { STORYBOOK_MODES, STORYBOOK_SIZES } from './constants';

const preview: Preview = {
  parameters: {
    nextjs: { router: { basePath: '' }, appDirectory: true },
    chromatic: { modes: STORYBOOK_MODES },
    viewport: { defaultViewport: 'large', viewports: STORYBOOK_SIZES },
  },
  decorators: [
    Story => (
      <NextIntlClientProvider locale="en" timeZone="Etc/UTC" messages={englishLocale}>
        <ThemeProvider defaultTheme="dark" attribute="data-theme">
          <Story />
        </ThemeProvider>
      </NextIntlClientProvider>
    ),
    withThemeByDataAttribute<ReactRenderer>({
      themes: { light: '', dark: 'dark' },
      defaultTheme: 'light',
      attributeName: 'data-theme',
    }),
  ],
};

export default preview;
