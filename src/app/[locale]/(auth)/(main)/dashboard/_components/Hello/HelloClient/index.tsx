'use client';

import { useSession } from 'next-auth/react';

export const HelloClient = () => {
  const session = useSession();
  return JSON.stringify(session, null, 2);
};
