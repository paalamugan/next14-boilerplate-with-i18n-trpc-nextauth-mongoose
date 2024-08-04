import type { FC, PropsWithChildren } from 'react';

import { WithLayout } from '@/components/Hoc/withLayout';

const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <WithLayout layout="root">
      <div className="py-5 text-xl [&_p]:my-6">{children}</div>
    </WithLayout>
  );
};
export default Layout;
