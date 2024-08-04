'use client';

import { Select } from '@paalan/react-ui';
import type { ComponentProps, FC } from 'react';

import { useRouter } from '@/lib/navigation';

type WithSidebarSelectProps = Pick<
  ComponentProps<typeof Select>,
  'options' | 'defaultValue' | 'label'
>;

export const WithRouterSelect: FC<WithSidebarSelectProps> = ({ options, label, defaultValue }) => {
  const { push } = useRouter();

  return (
    <Select
      inline
      label={label}
      options={options}
      defaultValue={defaultValue}
      onValueChange={value => push(value)}
    />
  );
};
