import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { cn } from '@paalan/react-shared/lib';
import { useTranslations } from 'next-intl';
import type { FC, MouseEvent } from 'react';

import styles from './index.module.css';

type ThemeToggleProps = {
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
};

const ThemeToggle: FC<ThemeToggleProps> = ({ onClick = () => {} }) => {
  const t = useTranslations();

  const ariaLabel = t('common.themeToggle.label');

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(styles.themeToggle, 'hover:dark:bg-neutral-800')}
      aria-label={ariaLabel}
    >
      <MoonIcon className="block dark:hidden" height="20" />
      <SunIcon className="hidden dark:block" height="20" />
    </button>
  );
};

export default ThemeToggle;
