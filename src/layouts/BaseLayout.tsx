'use client';

import type { FC, PropsWithChildren } from 'react';

import styles from './layouts.module.css';

type BaseLayoutProps = PropsWithChildren;
const BaseLayout: FC<BaseLayoutProps> = ({ children }) => {
  return <div className={styles.baseLayout}>{children}</div>;
};

export default BaseLayout;
