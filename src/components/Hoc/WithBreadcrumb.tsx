'use client';

import { Breadcrumb, Paper } from '@paalan/react-ui';
import { type FC } from 'react';

import { BreadcrumbLink } from '@/components/Common/BreadcrumbLink';
import { useBreadcrumb } from '@/providers/BreadcrumbProvider';


export const WithBreadcrumb: FC = () => {
  const { items } = useBreadcrumb();

  return (
    <Paper className="flex items-center gap-2 p-4 text-sm md:px-6">
      <Breadcrumb items={items} Link={BreadcrumbLink} />
    </Paper>
  );
};
