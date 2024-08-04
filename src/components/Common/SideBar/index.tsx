'use client';

import { useTranslations } from 'next-intl';
import type { ComponentProps, FC } from 'react';

import { SideBarGroup } from '@/components/Common/SideBar/SideBarGroup';
import { WithRouterSelect } from '@/components/Hoc/withRouterSelect';
import { usePathname } from '@/lib/navigation';

import styles from './index.module.css';

type SideBarProps = {
  groups: Array<ComponentProps<typeof SideBarGroup>>;
};

export const SideBar: FC<SideBarProps> = ({ groups }) => {
  const t = useTranslations();
  const pathname = usePathname();

  const selectItems = groups.map(({ items, groupName }) => ({
    label: `${groupName}`,
    options: items.map(({ label, link }) => ({ value: link, label: `${label.toString()}` })),
  }));

  const currentItem = selectItems
    .map(item => item.options)
    .flat()
    .find(item => pathname === item.value);

  return (
    <aside className={styles.wrapper}>
      {selectItems.length > 0 && (
        <WithRouterSelect
          label={t('common.sidebar.title')}
          options={selectItems}
          defaultValue={currentItem?.value}
        />
      )}

      {groups.map(({ groupName, items }) => (
        <SideBarGroup key={groupName.toString()} groupName={groupName} items={items} />
      ))}
    </aside>
  );
};
