'use client';

import { useNextTheme } from '@paalan/react-providers/NextThemeProvider';
import {
  Button,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  IconButton,
  SheetContent,
  SheetRoot,
  SheetTrigger,
} from '@paalan/react-ui';
import { CircleUser, Menu, Package2 } from 'lucide-react';
import { useLocale } from 'next-intl';
import type { FC } from 'react';

import ActiveLink from '@/components/Common/ActiveLink';
import { LanguageSwitcher } from '@/components/Common/LanguageSwitcher';
import ThemeToggle from '@/components/Common/ThemeToggle';
import Link from '@/components/Link';
import { SignOutButton } from '@/components/SignOutButton';
import { usePathname, useRouter } from '@/lib/navigation';
import { availableLocales } from '@/next-helpers/next.locales';

export const Header: FC = () => {
  const { resolvedTheme, setTheme } = useNextTheme();

  const pathname = usePathname();
  const router = useRouter();

  const locale = useLocale();

  const onLanguageChange = (code: string) => {
    router.replace(pathname!, { locale: code });
    router.refresh();
  };

  const toggleCurrentTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link href="/" className="contents items-center gap-2 text-lg font-semibold md:text-base">
          My Logo
          <span className="sr-only">My Logo</span>
        </Link>
        <ActiveLink
          href="/dashboard"
          activeClassName="text-primary"
          className="text-foreground transition-colors hover:text-primary"
        >
          Dashboard
        </ActiveLink>
        <ActiveLink
          href="/profile"
          activeClassName="text-primary"
          className="text-foreground transition-colors hover:text-primary"
        >
          Profile
        </ActiveLink>
      </nav>
      <SheetRoot>
        <SheetTrigger asChild>
          <Button variant="outline" size="md" className="shrink-0 md:hidden">
            <Menu className="size-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
              <Package2 className="size-6" />
              <span className="sr-only">My Logo</span>
            </Link>
            <ActiveLink href="/dashboard" className="hover:text-foreground">
              Dashboard
            </ActiveLink>
            <ActiveLink href="/profile" className="text-muted-foreground hover:text-foreground">
              Profile
            </ActiveLink>
          </nav>
        </SheetContent>
      </SheetRoot>
      <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <ThemeToggle onClick={toggleCurrentTheme} />
        <LanguageSwitcher
          onChange={localeData => onLanguageChange(localeData.code)}
          availableLanguages={availableLocales}
          currentLanguage={locale}
        />
        <DropdownMenuRoot>
          <DropdownMenuTrigger asChild>
            <IconButton className="rounded-full text-xl text-foreground">
              <CircleUser className="size-6" />
              <span className="sr-only">Toggle user menu</span>
            </IconButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <SignOutButton />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuRoot>
      </div>
    </header>
  );
};
