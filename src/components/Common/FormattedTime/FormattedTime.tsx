import type { DateTimeFormatOptions } from 'next-intl';
import { useFormatter } from 'next-intl';
import type { FC } from 'react';

import { DEFAULT_DATE_FORMAT } from '@/next-helpers/calendar.constants';

type FormattedTimeProps = {
  date: string | Date;
  format?: DateTimeFormatOptions;
};

export const FormattedTime: FC<FormattedTimeProps> = ({ date, format }) => {
  const formatter = useFormatter();

  const dateObject = new Date(date);

  return (
    <time dateTime={dateObject.toISOString()}>
      {formatter.dateTime(dateObject, format ?? DEFAULT_DATE_FORMAT)}
    </time>
  );
};
