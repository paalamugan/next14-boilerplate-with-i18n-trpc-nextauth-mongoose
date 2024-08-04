/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
import tailwindConfig from '@paalan/react-config/tailwind';
import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config = {
  presets: [tailwindConfig],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@paalan/react-ui/**/*.{js,ts,jsx,tsx}',
    './node_modules/@paalan/react-icons/**/*.{js,ts,jsx,tsx}',
    './node_modules/@paalan/react-shared/**/*.{js,ts,jsx,tsx}',
  ],

  // Project-specific customizations
  theme: {
    extend: {
      aria: { current: 'current="page"' },
      maxWidth: { '8xl': '95rem' },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
        'open-sans': ['var(--font-open-sans)'],
      },
    },
  },
} satisfies Config;

export default config;
