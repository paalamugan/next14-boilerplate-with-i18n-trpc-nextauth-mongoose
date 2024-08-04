'use client';

import Hamburger from '@heroicons/react/24/solid/Bars3Icon';
import XMark from '@heroicons/react/24/solid/XMarkIcon';
import * as Label from '@radix-ui/react-label';
import type { ComponentProps, FC, HTMLAttributeAnchorTarget, ReactNode } from 'react';
import { useState } from 'react';

import { SignOutButton } from '@/components/Auth/SignOutButton';
import { LanguageSwitcher } from '@/components/Common/LanguageSwitcher';
import ThemeToggle from '@/components/Common/ThemeToggle';
import Link from '@/components/Link';
import type { FormattedMessage } from '@/types';

import style from './index.module.css';
import NavItem from './NavItem';

const navInteractionIcons = {
  show: <Hamburger className={style.navInteractionIcon} />,
  close: <XMark className={style.navInteractionIcon} />,
};

type NavbarProps = {
  navItems: Array<{
    text: FormattedMessage;
    link: string;
    target?: HTMLAttributeAnchorTarget | undefined;
    icon?: ReactNode;
  }>;
  languages: ComponentProps<typeof LanguageSwitcher>;
  onThemeTogglerClick: () => void;
};

const NavBar: FC<NavbarProps> = ({ navItems, languages, onThemeTogglerClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className={`${style.container}`}>
      <div className={style.demoIconAndMobileItemsToggler}>
        <Link className={style.demoIconWrapper} href="/" aria-label="Home">
          Activpass
        </Link>

        <Label.Root
          onClick={() => setIsMenuOpen(prev => !prev)}
          className={style.sidebarItemTogglerLabel}
          htmlFor="sidebarItemToggler"
        >
          {navInteractionIcons[isMenuOpen ? 'close' : 'show']}
        </Label.Root>
      </div>

      <input className="peer hidden" id="sidebarItemToggler" type="checkbox" />

      <div className={`${style.main} peer-checked:flex`}>
        <div className={style.navItems}>
          {navItems.map(({ text, link, target, icon }) => (
            <NavItem key={link} href={link} target={target} icon={icon}>
              {text}
            </NavItem>
          ))}
        </div>

        <div className={style.actionsWrapper}>
          <ThemeToggle onClick={onThemeTogglerClick} />

          <LanguageSwitcher
            onChange={languages.onChange}
            availableLanguages={languages.availableLanguages}
            currentLanguage={languages.currentLanguage}
          />
          <SignOutButton />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
