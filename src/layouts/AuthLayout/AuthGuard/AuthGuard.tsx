import { ArrowPathIcon } from '@heroicons/react/24/solid';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

import { usePathname, useRouter } from '@/lib/navigation';

type Props = {
  children: React.ReactNode;
};

export const AuthGuard: React.FC<Props> = ({ children }) => {
  const session = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/dashboard';

  useEffect(() => {
    if (pathname === '/signin' && session.status === 'authenticated') {
      router.push(redirectTo);
    }

    if (session.status === 'unauthenticated' && pathname !== '/signin') {
      const urlSearchParams = new URLSearchParams();
      urlSearchParams.set('redirectTo', pathname);
      router.push(`/signin?${urlSearchParams.toString()}`);
    }
  }, [session.status, pathname, router, searchParams, redirectTo]);

  if (
    session.status === 'loading' ||
    (session.status === 'unauthenticated' && pathname !== '/signin')
  ) {
    return (
      <div className="flex h-screen items-center justify-center">
        <ArrowPathIcon className="size-6 animate-spin" />
      </div>
    );
  }

  return children;
};
