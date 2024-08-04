import type { Meta as MetaObj, StoryObj } from '@storybook/react';

import { SideBar } from '@/components/Common/SideBar';

type Story = StoryObj<typeof SideBar>;
type Meta = MetaObj<typeof SideBar>;

export const Default: Story = {
  args: {
    groups: [
      {
        groupName: 'Group 1',
        items: [
          {
            link: '/item1',
            label: 'Item 1',
          },
          {
            link: '/item2',
            label: 'Item 2',
          },
          {
            link: '/item3',
            label: 'Item 3',
          },
          {
            link: '/item4',
            label: 'Item 4',
          },
          {
            link: '/item5',
            label: 'Item 5',
          },
          {
            link: '/item6',
            label: 'Item 6',
          },
        ],
      },
      {
        groupName: 'Group 2',
        items: [
          {
            link: '/item7',
            label: 'Item 7',
          },
          {
            link: '/item8',
            label: 'Item 8',
          },
          {
            link: '/item9',
            label: 'Item 9',
          },
          {
            link: '/item10',
            label: 'Item 10',
          },
        ],
      },
      {
        groupName: 'Group 3',
        items: [
          {
            link: '/item11',
            label: 'Item 11',
          },
          {
            link: '/item12',
            label: 'Item 12',
          },
          {
            link: '/item13',
            label: '',
          },
        ],
      },
    ],
  },
};

export default { component: SideBar } as Meta;
