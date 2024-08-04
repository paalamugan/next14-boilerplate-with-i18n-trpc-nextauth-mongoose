'use client';

import { useTranslations } from 'next-intl';

import { useSession } from '@/stores/session-store';
import { api } from '@/trpc/client';

export const SignOutButton = () => {
  const t = useTranslations('auth.navbar.links');
  const session = useSession();
  const signOutMutation = api.auth.signOut.useMutation({
    onSuccess() {
      session.update(null);
    },
  });
  return (
    <button
      className="border-none text-gray-700 hover:text-gray-900"
      type="button"
      onClick={async () => {
        signOutMutation.mutate();
      }}
    >
      {t('signOut')}
    </button>
  );
};
