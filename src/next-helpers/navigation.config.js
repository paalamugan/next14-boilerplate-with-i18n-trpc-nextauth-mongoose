import { DashboardIcon } from '@paalan/react-icons';

/** @type {import('../types/index.js').NavigationConfig} */
const navigation = {
  topNavigation: {
    auth: {
      dashboard: {
        link: '/dashboard',
        label: 'auth.navbar.links.dashboard',
        icon: <DashboardIcon />,
      },
      profile: {
        link: '/profile',
        label: 'auth.navbar.links.profile',
      },
    },
    root: {
      home: {
        link: '/home',
        label: 'root.navbar.links.home',
      },
      guestbook: {
        link: '/guestbook',
        label: 'root.navbar.links.guestbook',
      },
      about: {
        link: '/about',
        label: 'root.navbar.links.about',
      },
      portfolio: {
        link: '/portfolio',
        label: 'root.navbar.links.portfolio',
      },
      signIn: {
        link: '/signin',
        label: 'root.navbar.links.signin',
      },
      signUp: {
        link: '/signup',
        label: 'root.navbar.links.signup',
      },
    },
  },
  sideNavigation: {
    auth: {
      dashboard: {},
      profile: {},
    },
    root: {
      home: {},
      guestbook: {},
      about: {},
      portfolio: {},
      signIn: {},
      signUp: {},
    },
  },
};

export default navigation;
