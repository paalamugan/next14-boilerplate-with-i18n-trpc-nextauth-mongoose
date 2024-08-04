/* eslint-disable @typescript-eslint/consistent-type-imports */
// Use type safe message keys with `next-intl`
type Messages = typeof import('../src/i18n/locales/en.json');
declare interface IntlMessages extends Messages {}

declare module globalThis {
  // eslint-disable-next-line vars-on-top, no-var
  var mongoose: {
    conn: typeof import('mongoose') | null;
    promise: Promise<typeof import('mongoose')> | null;
  };
  // eslint-disable-next-line vars-on-top, no-var
  var redis: InstanceType<(typeof import('ioredis'))['Redis']>;
}
