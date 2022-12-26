import { topLinkTypes } from '@/@types/types';
export const topLink: topLinkTypes = [
  {
    id: 1,
    name: '文章',
    route: '/main'
  },
  {
    id: 2,
    name: '归档',
    route: '/postfile'
  },
  {
    id: 3,
    name: '读书',
    route: '/read'
  },
  {
    id: 4,
    name: '实践',
    route: '/demo'
  },
  {
    id: 5,
    name: '关于',
    route: '/about'
  },
  {
    id: 6,
    name: 'playground',
    route: '/editor',
    widget: 'collapse',
    platform: 'pc'
  },
  {
    id: 7,
    route: 'javascript:void(0)',
    noLink: true,
    widget: 'theme',
    platform: 'all'
  }
];
export const iconList = [
  {
    id: 1,
    name: 'github',
    href: 'https://github.com/huangyan321'
  }
];
