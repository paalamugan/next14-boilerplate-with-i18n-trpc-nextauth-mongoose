import type { ComponentProps, FC } from 'react';

import { SideBarItem } from '@/components/Common/SideBar/SideBarItem';
import type { FormattedMessage } from '@/types';

import styles from './index.module.css';

type SideBarGroupProps = {
  groupName: FormattedMessage;
  items: Array<ComponentProps<typeof SideBarItem>>;
};

export const SideBarGroup: FC<SideBarGroupProps> = ({ groupName, items }) => (
  <section className={styles.group}>
    <label htmlFor="sidebar-group" className={styles.groupName}>
      {groupName}
    </label>
    <ul className={styles.itemList}>
      {items.map(({ label, link }) => (
        <SideBarItem key={link} label={label} link={link} />
      ))}
    </ul>
  </section>
);
