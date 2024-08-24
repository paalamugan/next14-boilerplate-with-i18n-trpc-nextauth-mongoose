import { render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';

import messages from '@/i18n/locales/en.json';

import About from './page';

describe('About page', () => {
  describe('Render method', () => {
    it('should have a text starting with `Welcome to our About page`', async () => {
      const jsx = await About({
        params: { locale: 'en' },
      });
      render(
        <NextIntlClientProvider locale="en" messages={messages}>
          {jsx}
        </NextIntlClientProvider>
      );

      const paragraph = await screen.findByText(/about_paragraph/);

      expect(paragraph).toBeInTheDocument();
    });
  });
});
