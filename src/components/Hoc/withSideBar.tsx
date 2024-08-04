import type { RichTranslationValues } from 'next-intl';
import type { FC } from 'react';

import { useNavigationConfig } from '@/hooks/server';
import type { AuthNavigationKeys } from '@/types';

import { SideBar } from '../Common/SideBar';

type WithSidebarProps = {
  navKeys: Array<AuthNavigationKeys>;
  context?: Record<string, RichTranslationValues>;
};

export const WithSidebar: FC<WithSidebarProps> = ({ navKeys, context }) => {
  const { getAuthSideNavigation } = useNavigationConfig();

  const mappedSidebarItems = getAuthSideNavigation(navKeys, context).map(
    ([, { label, items }]) => ({
      groupName: label,
      items: items.map(([, item]) => item),
    })
  );

  return <SideBar groups={mappedSidebarItems} />;
};
