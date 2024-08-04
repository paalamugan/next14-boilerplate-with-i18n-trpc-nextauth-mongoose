import type { Meta as MetaObj, StoryObj } from '@storybook/react';

import { SideBarItem } from '@/components/Common/SideBar/SideBarItem';

type Story = StoryObj<typeof SideBarItem>;
type Meta = MetaObj<typeof SideBarItem>;

export const Default: Story = {
  args: {
    label: 'Example Item',
    link: '/example',
  },
};

export default { component: SideBarItem } as Meta;
