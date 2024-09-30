import { forwardRef, type PropsWithChildren } from 'react';

import Link from '../../Link';

type BreadcrumbLinkProps = PropsWithChildren<{
  href: string;
  className?: string;
}>;
export const BreadcrumbLink = forwardRef<React.ComponentRef<typeof Link>, BreadcrumbLinkProps>(
  (props, ref) => {
    return <Link ref={ref} {...props} />;
  }
);

BreadcrumbLink.displayName = 'BreadcrumbLink';
