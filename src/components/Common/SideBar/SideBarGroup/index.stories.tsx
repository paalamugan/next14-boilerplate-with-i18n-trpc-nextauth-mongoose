import type { Meta as MetaObj, StoryObj } from '@storybook/react';

import { SideBarGroup } from '@/components/Common/SideBar/SideBarGroup';

type Story = StoryObj<typeof SideBarGroup>;
type Meta = MetaObj<typeof SideBarGroup>;

export const Default: Story = {
  args: {
    groupName: 'Example Group',
    items: [
      { label: 'Item 1', link: '/item1' },
      { label: 'Item 2', link: '/item2' },
      { label: 'Item 3', link: '/item3' },
    ],
  },
};

export const CustomGroup: Story = {
  args: {
    groupName: 'Custom Group',
    items: [
      { label: 'Custom Item 1', link: '/custom-item1' },
      { label: 'Custom Item 2', link: '/custom-item2' },
    ],
  },
};

export const EmptyGroup: Story = {
  args: {
    groupName: 'Empty Group',
    items: [],
  },
};

export default { component: SideBarGroup } as Meta;
