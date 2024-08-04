import { Text } from '@paalan/react-ui';
import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';

export const SignOutButton = () => {
  const t = useTranslations('auth.navbar.links');
  return (
    <Text
      onClick={async () => {
        await signOut({
          callbackUrl: '/signin',
        });
      }}
    >
      {t('signOut')}
    </Text>
  );
};
