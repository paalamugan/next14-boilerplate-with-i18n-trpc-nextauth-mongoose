import type { FC, PropsWithChildren } from 'react';

import { CenteredLayout } from '@/layouts/CenteredLayout';

import styles from './layouts.module.css';

export const RootLayout: FC<PropsWithChildren> = ({ children }) => (
  <CenteredLayout>
    <main className={styles.rootLayout}>{children}</main>
  </CenteredLayout>
);
