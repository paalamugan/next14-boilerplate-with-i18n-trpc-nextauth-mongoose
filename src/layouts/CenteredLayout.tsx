import type { FC, PropsWithChildren } from 'react';

import styles from './layouts.module.css';

export const CenteredLayout: FC<PropsWithChildren> = ({ children }) => (
  <div className={styles.centeredLayout}>{children}</div>
);
