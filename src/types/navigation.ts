import type { HTMLAttributeAnchorTarget, ReactNode } from 'react';

export interface FooterConfig {
  text: string;
  link: string;
}

export interface SocialConfig {
  icon: string;
  link: string;
  alt?: string;
}

export type AuthNavigationKeys = 'dashboard' | 'profile';

export type GuestNavigationKeys =
  | 'home'
  | 'guestbook'
  | 'about'
  | 'portfolio'
  | 'signIn'
  | 'signUp';

export interface NavigationEntry {
  label?: string;
  link?: string;
  items?: Record<string, NavigationEntry>;
  target?: HTMLAttributeAnchorTarget;
  icon?: ReactNode;
}

export type TopNavigationRecord = {
  auth: Record<AuthNavigationKeys, NavigationEntry>;
  root: Record<GuestNavigationKeys, NavigationEntry>;
};

export type TopNavigationKeys = keyof TopNavigationRecord;

export interface NavigationConfig {
  topNavigation: TopNavigationRecord;
  sideNavigation: TopNavigationRecord;
}
