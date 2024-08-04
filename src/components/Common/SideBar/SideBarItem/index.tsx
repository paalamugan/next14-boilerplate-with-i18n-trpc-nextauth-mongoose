import { ArrowUpRightIcon } from '@heroicons/react/24/solid';
import type { FC } from 'react';

import ActiveLink from '@/components/Common/ActiveLink';
import type { FormattedMessage } from '@/types';

import styles from './index.module.css';

type SideBarItemProps = {
  label: FormattedMessage;
  link: string;
};

export const SideBarItem: FC<SideBarItemProps> = ({ label, link }) => (
  <li className={styles.sideBarItem}>
    <ActiveLink href={link} activeClassName={styles.active}>
      <span className={styles.label}>{label}</span>

      {link.startsWith('http') && <ArrowUpRightIcon className={styles.icon} />}
    </ActiveLink>
  </li>
);
