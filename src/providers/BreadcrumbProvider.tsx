'use client';

import { createContext } from '@paalan/react-shared/utils';
import type { Breadcrumb } from '@paalan/react-ui';
import { type FC, type PropsWithChildren, useCallback, useEffect, useState } from 'react';

export type BreadcrumbItem = React.ComponentPropsWithoutRef<typeof Breadcrumb>['items'][number];

export type BreadcrumbContextType = {
  items: BreadcrumbItem[];
  setItems: (items: BreadcrumbItem[]) => void;
  addItem: (item: BreadcrumbItem) => void;
  removeItem: (item: BreadcrumbItem) => void;
};
const [LocalBreadcrumbProvider, useBreadcrumb] = createContext<BreadcrumbContextType>({
  hookName: 'useBreadcrumb',
  providerName: 'BreadcrumbProvider',
});

export { useBreadcrumb };

/**
 * BreadcrumbProvider
 * 
 * @examples
 * Import SetBreadcrumbItems and AddBreadcrumbItem to add items to the breadcrumb from any component.
 * 
 * <SetBreadcrumbItems
        items={[
          {
            label: 'Page 1',
            href: '/page1',
          },
          {
            label: 'Page 2',
          },
        ]}
      />
 */
export const BreadcrumbProvider: FC<PropsWithChildren> = ({ children }) => {
  const [items, setItems] = useState<BreadcrumbItem[]>([]);

  const addItem = useCallback((item: BreadcrumbItem) => {
    return setItems(prevItems => {
      if (typeof item.label === 'string' && prevItems.some(i => i.label === item.label)) {
        return prevItems;
      }
      return [...prevItems, item];
    });
  }, []);

  const removeItem = useCallback((item: BreadcrumbItem) => {
    return setItems(prevItems => prevItems.filter(i => i !== item));
  }, []);

  return (
    <LocalBreadcrumbProvider
      value={{
        items,
        setItems,
        addItem,
        removeItem,
      }}
    >
      {children}
    </LocalBreadcrumbProvider>
  );
};

type AddBreadcrumbItemProps = {
  items: BreadcrumbItem[];
};
export const AddBreadcrumbItem: FC<AddBreadcrumbItemProps> = ({ items }) => {
  const { addItem } = useBreadcrumb();

  useEffect(() => {
    if (!items) return;
    items.forEach(item => addItem(item));
  }, [addItem, items]);

  return null;
};

export const SetBreadcrumbItems: FC<AddBreadcrumbItemProps> = ({ items }) => {
  const { setItems } = useBreadcrumb();

  useEffect(() => {
    if (!items) return;
    setItems(items);
  }, [setItems, items]);

  return null;
};
